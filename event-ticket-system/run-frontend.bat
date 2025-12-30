@echo off
echo Event Ticket Booking System - Quick Setup
echo.

echo Step 1: Setting up MySQL Database
echo Please ensure MySQL is running and execute:
echo CREATE DATABASE event_db;
echo.

echo Step 2: Backend Setup Required
echo Maven is not installed. Please install Maven or use an IDE like IntelliJ/Eclipse
echo to run the Spring Boot application.
echo.

echo Step 3: Starting Frontend
cd frontend
echo Installing dependencies...
call npm install
echo.
echo Starting React development server...
start "React Frontend" cmd /k "npm start"

echo.
echo Frontend will start on: http://localhost:3000
echo Backend needs to be started manually on: http://localhost:8080
echo.
echo Default Credentials:
echo Admin: admin@event.com / admin123
echo User: user@test.com / user123
echo.
pause