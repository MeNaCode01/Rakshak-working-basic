@echo off
echo Starting ML Disease Prediction Service...
echo.
cd /d "%~dp0workspace"
streamlit run app.py
