@echo off
echo Starting Event Ticket System Backend...
echo.

echo Database Configuration:
echo - Database: event_tickets_db
echo - Username: root  
echo - Password: mysql
echo - Port: 3306
echo.

echo Checking MySQL connection...
mysql -u root -pmysql -e "USE event_tickets_db; SHOW TABLES;" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to MySQL database!
    echo Please ensure:
    echo 1. MySQL is running
    echo 2. Database 'event_tickets_db' exists
    echo 3. Username 'root' with password 'mysql' has access
    pause
    exit /b 1
)

echo Database connection successful!
echo.

echo To start the backend, please:
echo 1. Open IntelliJ IDEA or Eclipse
echo 2. Import the backend folder as Maven project
echo 3. Run EventTicketApplication.java
echo.
echo OR install Maven and run: mvn spring-boot:run
echo.
echo Backend should start on: http://localhost:8080
echo Frontend is running on: http://localhost:3001
echo.
pause