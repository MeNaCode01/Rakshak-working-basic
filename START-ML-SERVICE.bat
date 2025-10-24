@echo off
echo Starting ML Disease Prediction Service with CORS enabled...
echo.
cd /d "%~dp0workspace"
streamlit run app.py --server.enableCORS=true --server.enableXsrfProtection=false --server.headless=true
