@echo off
echo ========================================
echo  Rakshak 2.0 - Stopping All Services
echo ========================================
echo.

echo Stopping all Node.js and Python processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM streamlit.exe >nul 2>&1

echo.
echo ✓ All services stopped!
echo.
pause


