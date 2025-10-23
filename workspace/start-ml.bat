@echo off
cd /d "%~dp0"
streamlit run app.py --server.headless true --server.port 8501
