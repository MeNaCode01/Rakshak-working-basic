@echo off
echo ========================================
echo  Rakshak 2.0 - Starting All Services
echo ========================================
echo.

echo [1/3] Starting Records Service (MongoDB Backend)...
start "Records Service - Port 3000" /min cmd /k "cd /d %~dp0records && node index.js"
timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend Service (IPFS)...
start "Backend Service - Port 5001" /min cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 2 /nobreak >nul

echo [3/3] Starting Frontend (React + Vite)...
start "Frontend - Port 5173" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ========================================
echo  All Services Started!
echo ========================================
echo.
echo Services are now running:
echo   - Records:  http://localhost:3000 (minimized)
echo   - Backend:  http://localhost:5001 (minimized)
echo   - Frontend: http://localhost:5173
echo.
echo NOTE: ML Service will start automatically when you
echo       click the ML button in the Workstation page.
echo.
echo Press any key to exit this window...
pause >nul
