@echo off
echo ========================================
echo  Rakshak 3.0 - Starting All Services
echo ========================================
echo.

echo [1/4] Starting Records Service (MongoDB Backend)...
start "Records Service - Port 3000" /min cmd /k "cd /d %~dp0records && node index.js"
timeout /t 2 /nobreak >nul

echo [2/4] Starting Backend Service (IPFS)...
start "Backend Service - Port 5001" /min cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 2 /nobreak >nul

echo [3/4] Starting ML Disease Prediction Service...
start "ML Service - Port 8501" /min cmd /k "cd /d %~dp0workspace && streamlit run app.py --server.enableCORS=true --server.enableXsrfProtection=false --server.headless=true"
timeout /t 3 /nobreak >nul

echo [4/4] Starting Frontend (React + Vite)...
start "Frontend - Port 5173" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ========================================
echo  All Services Started!
echo ========================================
echo.
echo Services are now running:
echo   - Records:  http://localhost:3000 (minimized)
echo   - Backend:  http://localhost:5001 (minimized)
echo   - ML Service: http://localhost:8501 (minimized, no auto-open)
echo   - Frontend: http://localhost:5173
echo.
echo NOTE: ML Dashboard will open in a new tab only when
echo       you click the button in the Workstation page.
echo.
echo Press any key to exit this window...
pause >nul
