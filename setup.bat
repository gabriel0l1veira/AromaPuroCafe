@echo off
title Aroma Puro Café - Setup Automático
echo ============================================
echo   INICIANDO PROJETO AROMA PURO CAFE ☕
echo ============================================

REM --- BACKEND ---
echo.
echo [1/6] Criando ambiente virtual Python...
cd backend
py -3.12 -m venv venv
if %errorlevel% neq 0 (
    echo Falha ao criar venv com py -3.12, tentando python...
    python -m venv venv
)
call venv\Scripts\activate

echo [2/6] Instalando dependencias do backend...
pip install --upgrade pip
pip install -r requirements.txt

echo [3/6] Populando banco de dados...
python seed_data.py

REM --- FRONTEND ---
cd ..\frontend
echo [4/6] Instalando dependencias do frontend...
npm install

echo [5/6] Iniciando BACKEND (Flask)...
start cmd /k "cd ..\backend && call venv\Scripts\activate && set FLASK_APP=app.main:create_app && set FLASK_RUN_PORT=5000 && flask run"

echo [6/6] Iniciando FRONTEND (Next.js)...
start cmd /k "cd frontend && npm run dev"

echo.
echo Projeto iniciado!
echo FRONTEND -> http://localhost:3000
echo BACKEND  -> http://localhost:5000
pause
