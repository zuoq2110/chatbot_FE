@echo off
echo ================================
echo     KMA Chatbot Frontend
echo        Build Script
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

REM Install dependencies if needed
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
)

REM Create production build
echo [INFO] Creating production build...
npm run build

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
) else (
    echo [SUCCESS] Build completed successfully!
    echo [INFO] Build files are in the 'build' directory
    echo.
    
    REM Show build size
    if exist "build" (
        echo [INFO] Build size:
        dir "build" /s
    )
)

pause
