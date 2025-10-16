@echo off
echo 🚀 Iniciando HortiFlow React...
echo.

echo 📦 Instalando dependências...
call npm install

echo.
echo 🔥 Iniciando servidor de desenvolvimento...
echo.
echo 🌐 Acesse:
echo    Login: http://localhost:3000/login.html
echo    Dashboard: http://localhost:3000
echo.

call npm run dev

pause
