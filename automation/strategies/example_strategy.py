#!/usr/bin/env python3
"""
Example Trading Strategy for Smart Hedge
========================================

This is a sample strategy that demonstrates how to integrate with
the Smart Hedge automation system and Angel One SmartAPI.

This example implements a simple moving average crossover strategy.
"""

import os
import sys
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MovingAverageCrossoverStrategy:
    """Example strategy: Moving Average Crossover"""

    def __init__(self):
        # Get strategy parameters from environment
        self.strategy_id = os.getenv('STRATEGY_ID')
        self.strategy_name = os.getenv('STRATEGY_NAME')
        self.parameters = json.loads(os.getenv('STRATEGY_PARAMETERS', '{}'))

        # Angel One connection details
        self.session_token = os.getenv('ANGEL_SESSION_TOKEN')
        self.api_key = os.getenv('ANGEL_API_KEY')
        self.client_id = os.getenv('ANGEL_CLIENT_ID')

        logger.info(f"Initialized strategy: {self.strategy_name} (ID: {self.strategy_id})")

    def get_strategy_parameters(self) -> Dict[str, Any]:
        """Extract and validate strategy parameters"""
        default_params = {
            'symbol': 'SBIN-EQ',
            'exchange': 'NSE',
            'quantity': 1,
            'short_ma_period': 5,
            'long_ma_period': 20,
            'max_position_size': 10000,
            'stop_loss_percent': 2.0,
            'take_profit_percent': 4.0
        }

        # Merge with provided parameters
        params = {**default_params, **self.parameters}

        logger.info(f"Strategy parameters: {params}")
        return params

    def fetch_historical_data(self, symbol: str, exchange: str, days: int = 30) -> List[Dict]:
        """
        Fetch historical data for the symbol
        Note: In production, this would use Angel One SmartAPI
        For this example, we'll simulate data
        """
        logger.info(f"Fetching historical data for {symbol} on {exchange}")

        # Simulated historical data (in production, use SmartAPI)
        # This would be replaced with actual API calls to Angel One
        simulated_data = []
        base_price = 500.0

        for i in range(days):
            # Simulate price movement
            price_change = (i % 5 - 2) * 5  # Simple oscillating pattern
            close_price = base_price + price_change + (i * 0.5)

            simulated_data.append({
                'date': (datetime.now() - timedelta(days=days-i)).strftime('%Y-%m-%d'),
                'open': close_price - 2,
                'high': close_price + 3,
                'low': close_price - 4,
                'close': close_price,
                'volume': 100000 + (i * 1000)
            })

        return simulated_data

    def calculate_moving_average(self, data: List[Dict], period: int) -> List[float]:
        """Calculate simple moving average"""
        if len(data) < period:
            return []

        ma_values = []
        for i in range(period - 1, len(data)):
            avg = sum(float(data[j]['close']) for j in range(i - period + 1, i + 1)) / period
            ma_values.append(avg)

        return ma_values

    def generate_signals(self, data: List[Dict], params: Dict[str, Any]) -> Dict[str, Any]:
        """Generate buy/sell signals based on moving average crossover"""
        short_ma = self.calculate_moving_average(data, params['short_ma_period'])
        long_ma = self.calculate_moving_average(data, params['long_ma_period'])

        if len(short_ma) < 2 or len(long_ma) < 2:
            return {'signal': 'HOLD', 'reason': 'Insufficient data for analysis'}

        # Current and previous MA values
        current_short_ma = short_ma[-1]
        previous_short_ma = short_ma[-2]
        current_long_ma = long_ma[-1]
        previous_long_ma = long_ma[-2]

        current_price = float(data[-1]['close'])

        # Check for crossover signals
        if (previous_short_ma <= previous_long_ma and
            current_short_ma > current_long_ma):
            # Bullish crossover - short MA crosses above long MA
            return {
                'signal': 'BUY',
                'reason': 'Bullish crossover detected',
                'entry_price': current_price,
                'stop_loss': current_price * (1 - params['stop_loss_percent'] / 100),
                'take_profit': current_price * (1 + params['take_profit_percent'] / 100),
                'quantity': params['quantity']
            }
        elif (previous_short_ma >= previous_long_ma and
              current_short_ma < current_long_ma):
            # Bearish crossover - short MA crosses below long MA
            return {
                'signal': 'SELL',
                'reason': 'Bearish crossover detected',
                'entry_price': current_price,
                'stop_loss': current_price * (1 + params['stop_loss_percent'] / 100),
                'take_profit': current_price * (1 - params['take_profit_percent'] / 100),
                'quantity': params['quantity']
            }
        else:
            return {
                'signal': 'HOLD',
                'reason': 'No crossover signal detected',
                'current_price': current_price,
                'short_ma': current_short_ma,
                'long_ma': current_long_ma
            }

    def place_order(self, signal: Dict[str, Any], params: Dict[str, Any]) -> bool:
        """
        Place order based on signal
        Note: In production, this would use Angel One SmartAPI
        """
        if signal['signal'] == 'HOLD':
            logger.info(f"Signal: HOLD - {signal['reason']}")
            return True

        logger.info(f"Signal: {signal['signal']} - {signal['reason']}")

        # In production, construct order parameters for Angel One SmartAPI
        order_params = {
            'variety': 'NORMAL',
            'tradingsymbol': params['symbol'],
            'symboltoken': '',  # Would be fetched from Angel One
            'transactiontype': signal['signal'],
            'exchange': params['exchange'],
            'ordertype': 'MARKET',
            'producttype': 'INTRADAY',
            'duration': 'DAY',
            'price': '0',  # Market order
            'squareoff': '0',
            'stoploss': '0',
            'quantity': str(signal['quantity'])
        }

        # Simulate order placement (in production, use SmartAPI)
        logger.info(f"SIMULATED ORDER: {order_params}")
        logger.info(f"Entry Price: {signal['entry_price']}")
        logger.info(f"Stop Loss: {signal['stop_loss']}")
        logger.info(f"Take Profit: {signal['take_profit']}")

        # In production, you would call:
        # smart_api.placeOrder(order_params)

        return True

    def run(self) -> bool:
        """Main strategy execution"""
        try:
            logger.info("Starting Moving Average Crossover Strategy execution")

            # Get strategy parameters
            params = self.get_strategy_parameters()

            # Fetch historical data
            historical_data = self.fetch_historical_data(
                params['symbol'],
                params['exchange']
            )

            if not historical_data:
                logger.error("No historical data available")
                return False

            # Generate trading signals
            signal = self.generate_signals(historical_data, params)

            # Place order based on signal
            success = self.place_order(signal, params)

            if success:
                logger.info("Strategy execution completed successfully")
                return True
            else:
                logger.error("Strategy execution failed")
                return False

        except Exception as e:
            logger.error(f"Strategy execution error: {e}")
            return False

def main():
    """Main entry point for the strategy"""
    try:
        strategy = MovingAverageCrossoverStrategy()
        success = strategy.run()

        if success:
            print("SUCCESS: Strategy executed successfully")
            sys.exit(0)
        else:
            print("ERROR: Strategy execution failed")
            sys.exit(1)

    except Exception as e:
        logger.error(f"Fatal error: {e}")
        print(f"FATAL ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
