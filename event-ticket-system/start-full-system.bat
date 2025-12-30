@echo off
echo ========================================
echo   Event Ticket System - Full Startup
echo ========================================
echo.

echo Starting Backend Server...
echo.
cd backend
start cmd /k \"echo Backend Server Starting... && mvn spring-boot:run\"

echo Waiting for backend to initialize...
timeout /t 10 /nobreak > nul

echo.
echo Starting Frontend Development Server...
echo.
cd ..\frontend
start cmd /k \"echo Frontend Server Starting... && npm start\"

echo.
echo ========================================
echo   System Starting Up!
echo ========================================
echo.
echo Backend:  http://localhost:8081
echo Frontend: http://localhost:3000
echo.
echo Default Admin Login:
echo Email:    admin@event.com
echo Password: admin123
echo.
echo Default User Login:
echo Email:    user@test.com
echo Password: user123
echo.
echo Press any key to exit...
pause > nul