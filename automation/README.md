# Smart Hedge Automated Trading System

This directory contains the automated trading system that integrates with your Laravel backend and Angel One SmartAPI.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd automation
pip install -r requirements.txt
```

### 2. Environment Setup

Copy the environment template and configure your settings:

```bash
# Copy .env.example to .env in the Laravel root
cp ../.env.example ../.env

# Configure the following variables in .env:
API_TOKEN=your-secure-api-token-here
ANGEL_API_KEY=your-angel-api-key
ANGEL_CLIENT_ID=your-angel-client-id
ANGEL_MPIN=your-angel-mpin
ANGEL_TOTP_SECRET=your-angel-totp-secret
```

### 3. Run Automation

```bash
# Run once
python runner.py --once

# Run continuously (every 15 minutes)
python runner.py --continuous

# Run continuously (custom interval)
python runner.py --continuous 30  # Every 30 minutes
```

## 📁 Directory Structure

```
automation/
├── runner.py              # Main automation script
├── requirements.txt       # Python dependencies
├── strategies/            # Trading strategy scripts
│   └── example_strategy.py
├── logs/                  # Generated log files
└── README.md             # This file
```

## 🔧 How It Works

### 1. Laravel API Integration

The `runner.py` script:
- Authenticates with your Laravel backend using API tokens
- Fetches active strategies from `/api/active-strategies`
- Validates strategy parameters and files

### 2. Strategy Execution

For each active strategy:
- Loads the associated Python strategy file
- Passes strategy parameters via environment variables
- Executes the strategy with proper error handling
- Logs all activities for monitoring

### 3. Angel One Integration

- Connects to Angel One SmartAPI using your credentials
- Generates TOTP for 2FA authentication
- Places orders based on strategy signals
- Monitors order status and execution

## 🛡️ Security Features

- **Token-based authentication** for Laravel API access
- **Environment variable isolation** for sensitive data
- **TOTP generation** for Angel One 2FA
- **Comprehensive logging** for audit trails
- **Input validation** and sanitization

## 📊 Creating Custom Strategies

### Strategy File Structure

Each strategy should be a Python file that:

1. **Reads environment variables** for configuration:
   ```python
   strategy_id = os.getenv('STRATEGY_ID')
   parameters = json.loads(os.getenv('STRATEGY_PARAMETERS'))
   ```

2. **Implements trading logic** based on your requirements

3. **Returns appropriate exit codes**:
   - `0` for success
   - `1` for failure

### Environment Variables Available to Strategies

- `STRATEGY_ID` - Strategy database ID
- `STRATEGY_NAME` - Strategy name
- `STRATEGY_PARAMETERS` - JSON parameters from Laravel
- `ANGEL_SESSION_TOKEN` - Active Angel One session
- `ANGEL_API_KEY` - Angel One API key
- `ANGEL_CLIENT_ID` - Angel One client ID

### Example Strategy Usage

```python
import os
import json
from smartapi import SmartConnect

# Get strategy configuration
strategy_id = os.getenv('STRATEGY_ID')
parameters = json.loads(os.getenv('STRATEGY_PARAMETERS'))

# Your trading logic here
def execute_strategy():
    # Implement your strategy
    pass

if __name__ == "__main__":
    success = execute_strategy()
    exit(0 if success else 1)
```

## 📝 Logging

All activities are logged to `logs/trading_automation.log` with:
- Timestamp and log level
- Strategy execution details
- API responses and errors
- Order placement and status
- Performance metrics

## 🔄 Deployment Options

### Option 1: Windows Task Scheduler

Create a scheduled task to run the automation script:

```bash
# Create a batch file (run_automation.bat)
@echo off
cd C:\path\to\smart_hedge\automation
python runner.py --continuous 15
```

### Option 2: Linux Cron Job

Add to crontab for scheduled execution:

```bash
# Run every 15 minutes during market hours (9:15 AM - 3:30 PM)
*/15 9-15 * * 1-5 cd /path/to/smart_hedge/automation && python runner.py --once
```

### Option 3: Docker Container

Create a Docker container for isolated execution:

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "runner.py", "--continuous"]
```

## 🚨 Error Handling

The system includes comprehensive error handling:

- **Connection failures**: Automatic retry with exponential backoff
- **Invalid strategies**: Skip and continue with next strategy
- **API errors**: Log and notify, continue operation
- **Order failures**: Detailed logging for manual review

## 📈 Monitoring

Monitor your automation system through:

1. **Log files**: Check `logs/trading_automation.log`
2. **Laravel logs**: Check Laravel application logs
3. **Angel One dashboard**: Monitor actual trades
4. **Database**: Track strategy execution history

## ⚠️ Important Notes

- **Test thoroughly** with paper trading before live deployment
- **Monitor market hours** - automation should only run during trading sessions
- **Keep credentials secure** - never commit API keys to version control
- **Regular backups** of strategy files and logs
- **Network connectivity** is essential for reliable operation

## 🔧 Troubleshooting

### Common Issues

1. **Authentication errors**: Check API token and Angel One credentials
2. **Strategy failures**: Review strategy logs and parameters
3. **Network timeouts**: Increase timeout values in configuration
4. **TOTP errors**: Verify TOTP secret is correct

### Debug Mode

Enable debug logging by setting `LOG_LEVEL=DEBUG` in your environment.

## 📞 Support

For issues or questions:
1. Check the logs in `logs/trading_automation.log`
2. Review Laravel application logs
3. Verify Angel One SmartAPI status
4. Check network connectivity and firewall settings
