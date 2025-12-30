@echo off
echo Starting Event Ticket Booking System...
echo.

echo 1. Starting Backend (Spring Boot)...
cd backend
start "Backend Server" cmd /k "mvn spring-boot:run"

echo 2. Waiting for backend to start...
timeout /t 10

echo 3. Starting Frontend (React)...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo System is starting up!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Default Admin: admin@event.com / admin123
echo Default User: user@test.com / user123
echo.
pause