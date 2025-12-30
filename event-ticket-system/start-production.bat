@echo off
echo ========================================
echo   Event Ticket System - Production Mode
echo ========================================
echo.

echo Checking MySQL Service...
sc query mysql > nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL service not found. Please install MySQL first.
    echo.
    echo Installation Guide:
    echo 1. Download MySQL from https://dev.mysql.com/downloads/installer/
    echo 2. Install MySQL Server
    echo 3. Create database 'event_db'
    echo 4. Update credentials in application-prod.properties
    echo.
    pause
    exit /b 1
)

echo Starting MySQL Service...
net start mysql > nul 2>&1

echo.
echo Building Backend...
cd backend
call mvn clean install -q

if %errorlevel% neq 0 (
    echo Backend build failed!
    pause
    exit /b 1
)

echo.
echo Starting Backend in Production Mode...
start cmd /k \"echo Backend Server (Production) Starting... && mvn spring-boot:run -Dspring-boot.run.profiles=prod\"

echo Waiting for backend to initialize...
timeout /t 15 /nobreak > nul

echo.
echo Building Frontend...
cd ..\frontend
call npm run build

if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)

echo.
echo Starting Frontend Production Server...
start cmd /k \"echo Frontend Server (Production) Starting... && npx serve -s build -l 3000\"

echo.
echo ========================================
echo   Production System Started!
echo ========================================
echo.
echo Backend:  http://localhost:8081
echo Frontend: http://localhost:3000
echo Database: MySQL (event_db)
echo.
echo Admin Login:
echo Email:    admin@event.com
echo Password: admin123
echo.
echo System is ready for production use!
echo.
echo Press any key to exit...
pause > nul