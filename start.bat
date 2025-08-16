@echo off
echo ================================
echo     KMA Chatbot Frontend
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found
    echo Please run this script from the chatbot_FE directory
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version
echo.

echo [INFO] NPM version:
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies installed successfully
    echo.
) else (
    echo [INFO] Dependencies already installed
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo [INFO] Creating .env file from .env.example...
    copy ".env.example" ".env"
    echo [INFO] Please check and update .env file with your configuration
    echo.
)

echo [INFO] Starting development server...
echo [INFO] The application will open at http://localhost:3000
echo [INFO] Press Ctrl+C to stop the server
echo.

npm start

pause
