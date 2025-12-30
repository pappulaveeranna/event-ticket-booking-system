@echo off
echo ========================================
echo Event Ticket Booking System Setup
echo ========================================
echo.

echo Database: event_tickets_db ✓
echo MySQL Password: mysql ✓
echo.

echo ========================================
echo BACKEND SETUP (Spring Boot)
echo ========================================
echo.
echo To run the backend, you need either:
echo 1. Maven installed (mvn spring-boot:run)
echo 2. IDE like IntelliJ IDEA or Eclipse
echo 3. Or install Maven from: https://maven.apache.org/download.cgi
echo.
echo Backend will run on: http://localhost:8080
echo.

echo ========================================
echo FRONTEND SETUP (React)
echo ========================================
echo.
echo Starting React frontend...
cd frontend

echo Installing dependencies...
call npm install

echo Starting development server on port 3001...
set PORT=3001
start "Event Ticket System - Frontend" cmd /k "npm start"

echo.
echo ========================================
echo SYSTEM READY
echo ========================================
echo Frontend: http://localhost:3001
echo Backend: http://localhost:8080 (needs manual start)
echo.
echo Default Login Credentials:
echo Admin: admin@event.com / admin123
echo User: user@test.com / user123
echo.
echo Next Steps:
echo 1. Start backend using IDE or Maven
echo 2. Open http://localhost:3001 in browser
echo 3. Register/Login and test the system
echo.
pause