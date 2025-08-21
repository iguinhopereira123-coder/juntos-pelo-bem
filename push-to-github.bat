@echo off
echo 🚀 Configurando Push para GitHub
echo.

echo Por favor, informe:
echo 1. Seu username no GitHub
echo 2. Nome do repositório
echo.

set /p username="Username do GitHub: "
set /p repo="Nome do repositório: "

echo.
echo Configurando remote...
git remote add origin https://github.com/%username%/%repo%.git

echo.
echo Fazendo push...
git push -u origin main

echo.
echo ✅ Concluído!
pause
