@echo off
REM Smart Hedge Automation Runner for Windows
REM This script sets up the environment and runs the trading automation

echo Starting Smart Hedge Automated Trading System...
echo.

REM Change to the automation directory
cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and add it to your PATH
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Load environment variables from Laravel .env file
if exist "..\env" (
    echo Loading environment variables...
    for /f "tokens=1,2 delims==" %%a in ('type "..\env" ^| findstr /v "^#" ^| findstr "="') do (
        set "%%a=%%b"
    )
)

REM Check if required environment variables are set
if "%API_TOKEN%"=="" (
    echo ERROR: API_TOKEN not set in .env file
    pause
    exit /b 1
)

if "%ANGEL_API_KEY%"=="" (
    echo ERROR: ANGEL_API_KEY not set in .env file
    pause
    exit /b 1
)

REM Create logs directory
if not exist "logs" mkdir logs

REM Display menu
echo.
echo Smart Hedge Automation Menu:
echo 1. Run once (single execution)
echo 2. Run continuously (every 15 minutes)
echo 3. Run continuously (custom interval)
echo 4. Test connection only
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo Running automation once...
    python runner.py --once
) else if "%choice%"=="2" (
    echo Running automation continuously (15 minute intervals)...
    python runner.py --continuous 15
) else if "%choice%"=="3" (
    set /p interval="Enter interval in minutes: "
    echo Running automation continuously (%interval% minute intervals)...
    python runner.py --continuous %interval%
) else if "%choice%"=="4" (
    echo Testing connection...
    python -c "from runner import TradingAutomation, Config; automation = TradingAutomation(Config()); print('Connection test completed - check logs for details')"
) else if "%choice%"=="5" (
    echo Exiting...
    exit /b 0
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo Automation completed. Check logs/trading_automation.log for details.
pause
