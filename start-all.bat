@echo off
chcp 65001 > nul
echo ===================================================
echo     KHOI DONG HE THONG CRS MICROSERVICES
echo ===================================================

set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [1/5] Khoi dong auth-service (Port 8081)...
start "CRS - Auth Service (8081)" cmd /k "cd /d %~dp0auth-service && mvnw.cmd spring-boot:run"

echo [2/5] Khoi dong course-service (Port 8082)...
start "CRS - Course Service (8082)" cmd /k "cd /d %~dp0course-service && mvnw.cmd spring-boot:run"

echo [3/5] Khoi dong registration-service (Port 8083)...
start "CRS - Registration Service (8083)" cmd /k "cd /d %~dp0registration-service && mvnw.cmd spring-boot:run"

echo Cho 8 giay truoc khi bat Gateway de cac backend san sang...
timeout /t 8 /nobreak > nul

echo [4/5] Khoi dong api-gateway (Port 8080)...
start "CRS - API Gateway (8080)" cmd /k "cd /d %~dp0api-gateway && mvnw.cmd spring-boot:run"

echo [5/5] Khoi dong crs-frontend (Port 5173)...
start "CRS - Frontend (5173)" cmd /k "cd /d %~dp0crs-frontend && npm run dev"

echo ===================================================
echo Tat ca cac service da duoc khoi chay tren cac cua so rieng biet!
echo - Gateway : http://localhost:8080
echo - Frontend: http://localhost:5173
echo ===================================================
pause
