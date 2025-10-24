@echo off
echo ========================================
echo  Stopping All Services...
echo ========================================
echo.

REM Kill all Node.js processes
taskkill /F /IM node.exe /T 2>nul
timeout /t 1 /nobreak >nul

REM Kill Streamlit processes
taskkill /F /IM streamlit.exe /T 2>nul
taskkill /F /IM python.exe /T 2>nul
timeout /t 1 /nobreak >nul

echo ✅ All services stopped!
echo.
echo ========================================
echo  Restarting All Services...
echo ========================================
echo.

REM Start all services again
call START-ALL.bat
