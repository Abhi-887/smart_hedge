#!/usr/bin/env python3
"""
Smart Hedge - Automated Trading System
======================================

Production-ready Python automation script for executing trading strategies
via Angel One SmartAPI. This script fetches active strategies from Laravel
backend and executes them automatically.

Features:
- Secure API authentication
- Angel One SmartAPI integration
- Comprehensive logging
- Error handling and retry logic
- Order placement and monitoring
- TOTP generation for 2FA
- Strategy parameter validation

Author: Smart Hedge Team
Version: 1.0.0
"""

import os
import sys
import json
import time
import logging
import requests
import subprocess
import pyotp
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from pathlib import Path

# Add Angel One SDK (install with: pip install smartapi-python)
try:
    from smartapi import SmartConnect
except ImportError:
    print("ERROR: Angel One SmartAPI not installed. Run: pip install smartapi-python")
    sys.exit(1)

# Configuration
@dataclass
class Config:
    """Configuration class for the automated trading system"""
    # Laravel API Configuration
    api_base_url: str = os.getenv('LARAVEL_API_URL', 'http://localhost:8000/api')
    api_token: str = os.getenv('API_TOKEN', '')

    # Angel One Configuration
    angel_api_key: str = os.getenv('ANGEL_API_KEY', '')
    angel_client_id: str = os.getenv('ANGEL_CLIENT_ID', '')
    angel_mpin: str = os.getenv('ANGEL_MPIN', '')
    angel_totp_secret: str = os.getenv('ANGEL_TOTP_SECRET', '')

    # Trading Configuration
    max_retries: int = 3
    retry_delay: int = 5
    log_level: str = 'INFO'
    log_file: str = 'trading_automation.log'

class TradingAutomation:
    """Main automation class for executing trading strategies"""

    def __init__(self, config: Config):
        self.config = config
        self.smart_api = None
        self.session_token = None

        # Setup logging
        self.setup_logging()

        # Validate configuration
        self.validate_config()

        self.logger.info("Trading automation system initialized")

    def setup_logging(self):
        """Configure comprehensive logging"""
        log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'

        # Create logs directory if it doesn't exist
        log_dir = Path('logs')
        log_dir.mkdir(exist_ok=True)

        # Configure logging to both file and console
        logging.basicConfig(
            level=getattr(logging, self.config.log_level),
            format=log_format,
            handlers=[
                logging.FileHandler(log_dir / self.config.log_file),
                logging.StreamHandler(sys.stdout)
            ]
        )

        self.logger = logging.getLogger(__name__)

    def validate_config(self):
        """Validate all required configuration parameters"""
        required_configs = [
            ('API_TOKEN', self.config.api_token),
            ('ANGEL_API_KEY', self.config.angel_api_key),
            ('ANGEL_CLIENT_ID', self.config.angel_client_id),
            ('ANGEL_MPIN', self.config.angel_mpin),
            ('ANGEL_TOTP_SECRET', self.config.angel_totp_secret)
        ]

        missing_configs = [name for name, value in required_configs if not value]

        if missing_configs:
            self.logger.error(f"Missing required configuration: {', '.join(missing_configs)}")
            raise ValueError(f"Missing configuration parameters: {missing_configs}")

        self.logger.info("Configuration validation passed")

    def generate_totp(self) -> str:
        """Generate TOTP for Angel One 2FA"""
        try:
            totp = pyotp.TOTP(self.config.angel_totp_secret)
            return totp.now()
        except Exception as e:
            self.logger.error(f"Failed to generate TOTP: {e}")
            raise

    def connect_to_angel_one(self) -> bool:
        """Establish connection to Angel One SmartAPI"""
        try:
            self.logger.info("Connecting to Angel One SmartAPI...")

            # Initialize SmartConnect
            self.smart_api = SmartConnect(api_key=self.config.angel_api_key)

            # Generate TOTP
            totp = self.generate_totp()

            # Login
            login_response = self.smart_api.generateSession(
                clientCode=self.config.angel_client_id,
                password=self.config.angel_mpin,
                totp=totp
            )

            if login_response['status']:
                self.session_token = login_response['data']['jwtToken']
                self.logger.info("Successfully connected to Angel One SmartAPI")
                return True
            else:
                self.logger.error(f"Angel One login failed: {login_response}")
                return False

        except Exception as e:
            self.logger.error(f"Angel One connection error: {e}")
            return False

    def fetch_active_strategies(self) -> List[Dict[str, Any]]:
        """Fetch active strategies from Laravel API"""
        try:
            self.logger.info("Fetching active strategies from Laravel API...")

            headers = {
                'Authorization': f'Bearer {self.config.api_token}',
                'Content-Type': 'application/json',
                'User-Agent': 'SmartHedge-Automation/1.0'
            }

            response = requests.get(
                f"{self.config.api_base_url}/active-strategies",
                headers=headers,
                timeout=30
            )

            response.raise_for_status()
            data = response.json()

            if data.get('success'):
                strategies = data.get('data', [])
                self.logger.info(f"Fetched {len(strategies)} active strategies")
                return strategies
            else:
                self.logger.error(f"API returned error: {data.get('error', 'Unknown error')}")
                return []

        except requests.RequestException as e:
            self.logger.error(f"Failed to fetch strategies: {e}")
            return []
        except json.JSONDecodeError as e:
            self.logger.error(f"Invalid JSON response: {e}")
            return []

    def validate_strategy(self, strategy: Dict[str, Any]) -> bool:
        """Validate strategy parameters before execution"""
        required_fields = ['id', 'name', 'python_file_path', 'parameters']

        for field in required_fields:
            if field not in strategy:
                self.logger.error(f"Strategy {strategy.get('id', 'unknown')} missing required field: {field}")
                return False

        # Validate Python file exists
        python_file = strategy['python_file_path']
        if not os.path.exists(python_file):
            self.logger.error(f"Python file not found: {python_file}")
            return False

        # Validate parameters is valid JSON
        try:
            if isinstance(strategy['parameters'], str):
                json.loads(strategy['parameters'])
        except json.JSONDecodeError:
            self.logger.error(f"Invalid JSON parameters for strategy {strategy['id']}")
            return False

        return True

    def execute_strategy(self, strategy: Dict[str, Any]) -> bool:
        """Execute a single trading strategy"""
        strategy_id = strategy['id']
        strategy_name = strategy['name']

        self.logger.info(f"Executing strategy: {strategy_name} (ID: {strategy_id})")

        try:
            # Validate strategy
            if not self.validate_strategy(strategy):
                return False

            # Prepare environment variables for the strategy script
            env = os.environ.copy()
            env.update({
                'STRATEGY_ID': str(strategy_id),
                'STRATEGY_NAME': strategy_name,
                'STRATEGY_PARAMETERS': json.dumps(strategy['parameters']),
                'ANGEL_SESSION_TOKEN': self.session_token or '',
                'ANGEL_API_KEY': self.config.angel_api_key,
                'ANGEL_CLIENT_ID': self.config.angel_client_id
            })

            # Execute the Python strategy file
            python_file = strategy['python_file_path']
            self.logger.info(f"Running strategy script: {python_file}")

            result = subprocess.run(
                [sys.executable, python_file],
                env=env,
                capture_output=True,
                text=True,
                timeout=300  # 5 minute timeout
            )

            if result.returncode == 0:
                self.logger.info(f"Strategy {strategy_name} executed successfully")
                if result.stdout:
                    self.logger.info(f"Strategy output: {result.stdout.strip()}")
                return True
            else:
                self.logger.error(f"Strategy {strategy_name} failed with return code {result.returncode}")
                if result.stderr:
                    self.logger.error(f"Strategy error: {result.stderr.strip()}")
                return False

        except subprocess.TimeoutExpired:
            self.logger.error(f"Strategy {strategy_name} timed out")
            return False
        except Exception as e:
            self.logger.error(f"Error executing strategy {strategy_name}: {e}")
            return False

    def place_order(self, order_params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Place an order through Angel One SmartAPI"""
        try:
            if not self.smart_api or not self.session_token:
                self.logger.error("Angel One connection not established")
                return None

            self.logger.info(f"Placing order: {order_params}")

            # Place order through SmartAPI
            order_response = self.smart_api.placeOrder(order_params)

            if order_response.get('status'):
                order_id = order_response['data']['orderid']
                self.logger.info(f"Order placed successfully. Order ID: {order_id}")
                return order_response
            else:
                self.logger.error(f"Order placement failed: {order_response}")
                return None

        except Exception as e:
            self.logger.error(f"Error placing order: {e}")
            return None

    def run_automation_cycle(self):
        """Run a single automation cycle"""
        self.logger.info("Starting automation cycle")

        try:
            # Connect to Angel One if not connected
            if not self.smart_api or not self.session_token:
                if not self.connect_to_angel_one():
                    self.logger.error("Failed to connect to Angel One. Skipping cycle.")
                    return

            # Fetch active strategies
            strategies = self.fetch_active_strategies()

            if not strategies:
                self.logger.info("No active strategies found")
                return

            # Execute each strategy
            success_count = 0
            for strategy in strategies:
                if self.execute_strategy(strategy):
                    success_count += 1

                # Small delay between strategies
                time.sleep(2)

            self.logger.info(f"Automation cycle completed. {success_count}/{len(strategies)} strategies executed successfully")

        except Exception as e:
            self.logger.error(f"Error in automation cycle: {e}")

    def run_continuous(self, interval_minutes: int = 15):
        """Run automation continuously with specified interval"""
        self.logger.info(f"Starting continuous automation (interval: {interval_minutes} minutes)")

        while True:
            try:
                self.run_automation_cycle()

                # Wait for next cycle
                self.logger.info(f"Waiting {interval_minutes} minutes for next cycle...")
                time.sleep(interval_minutes * 60)

            except KeyboardInterrupt:
                self.logger.info("Automation stopped by user")
                break
            except Exception as e:
                self.logger.error(f"Unexpected error in continuous loop: {e}")
                time.sleep(60)  # Wait 1 minute before retrying

def main():
    """Main entry point for the automation script"""
    try:
        # Load configuration
        config = Config()

        # Initialize automation system
        automation = TradingAutomation(config)

        # Check command line arguments
        if len(sys.argv) > 1:
            if sys.argv[1] == '--once':
                # Run single cycle
                automation.run_automation_cycle()
            elif sys.argv[1] == '--continuous':
                # Run continuously
                interval = int(sys.argv[2]) if len(sys.argv) > 2 else 15
                automation.run_continuous(interval)
            else:
                print("Usage:")
                print("  python runner.py --once              # Run once")
                print("  python runner.py --continuous [min]  # Run continuously (default: 15 min)")
        else:
            # Default: run once
            automation.run_automation_cycle()

    except Exception as e:
        logging.error(f"Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
