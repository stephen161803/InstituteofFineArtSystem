@echo off
echo ============================================
echo  IoFA - Start Development Servers
echo ============================================

set ROOT_DIR=%~dp0
set BACKEND_DIR=%ROOT_DIR%InstituteofFineArtSystem\backend\IoFAApi
set FRONTEND_DIR=%ROOT_DIR%InstituteofFineArtSystem\frontend

echo.
echo [1/2] Starting Backend...
start "IoFA Backend" cmd /k "cd /d "%BACKEND_DIR%" && dotnet run"

timeout /t 5 /nobreak > nul

echo [2/2] Starting Frontend...
if not exist "%FRONTEND_DIR%\node_modules" (
    echo node_modules not found, running npm install first...
    start "IoFA Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm install && npm run dev"
) else (
    start "IoFA Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"
)

echo.
echo Both servers are starting in separate windows.
echo Frontend: http://localhost:5173
echo Backend port: see the Backend terminal window.
echo.
pause
