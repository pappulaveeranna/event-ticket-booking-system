@echo off
echo Starting Event Ticket Booking System Frontend...
echo.

cd /d "c:\Users\pappula veeranna\Desktop\javafullstack - project -final_year\event-ticket-system\frontend"

echo Checking if port 3000 is available...
netstat -an | find "3000" > nul
if %errorlevel% == 0 (
    echo Port 3000 is in use. Trying to kill existing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| find "3000" ^| find "LISTENING"') do taskkill /f /pid %%a 2>nul
    timeout /t 2 > nul
)

echo Installing/updating dependencies...
call npm install

echo Starting React development server...
set GENERATE_SOURCEMAP=false
call npm start

pause