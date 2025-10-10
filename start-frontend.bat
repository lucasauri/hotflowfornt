@echo off
echo ========================================
echo    SISTEMA HORTIFRUTI - FRONTEND
echo ========================================
echo.

echo Iniciando servidor local para o frontend...
echo.
echo ========================================
echo    FRONTEND INICIADO COM SUCESSO!
echo ========================================
echo.
echo Frontend disponivel em: http://localhost:3000
echo Backend API: http://localhost:8080/api
echo.
echo Certifique-se de que o backend Java esta rodando!
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

python -m http.server 3000

pause 