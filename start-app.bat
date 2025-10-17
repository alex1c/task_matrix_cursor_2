@echo off
REM Eisenhower Matrix Application Startup Script for Windows
REM This script starts both backend and frontend services for development

echo Starting Eisenhower Matrix Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Install dependencies if needed
echo Installing dependencies...
call npm install
cd frontend
call npm install
cd ..\backend
call npm install
cd ..

REM Build frontend
echo Building frontend...
cd frontend
call npm run build
cd ..

REM Start backend
echo Starting backend...
cd backend
start "Eisenhower Backend" cmd /k "npm start"
cd ..

echo.
echo Application started!
echo Backend: http://localhost:5000
echo Frontend: Built and ready for Apache
echo.
echo Press any key to exit...
pause >nul
