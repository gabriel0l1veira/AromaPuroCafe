@echo off
echo Criando pacote AromaPuroCafe.zip...
powershell -Command "Compress-Archive -Path AromaPuroCafe -DestinationPath AromaPuroCafe.zip -Force" 2>$null
if %errorlevel% neq 0 (
    echo Tentando compactar a partir do diretório atual...
    for %%I in (.) do set Curr=%%~nxI
    powershell -Command "Compress-Archive -Path * -DestinationPath ../AromaPuroCafe.zip -Force"
)
echo Pacote criado (AromaPuroCafe.zip).
pause
