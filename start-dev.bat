@echo off
echo ============================================
echo  IoFA - Start Development Servers
echo ============================================

set ROOT_DIR=%~dp0
set BACKEND_DIR=%ROOT_DIR%InstituteofFineArtSystem\backend\IoFAApi
set FRONTEND_DIR=%ROOT_DIR%InstituteofFineArtSystem\frontend
set BACKEND_PORT=5117
set FRONTEND_PORT=5173

echo.
echo [Checking ports...]

:: Check and free backend port
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%BACKEND_PORT% " ^| findstr "LISTENING"') do (
    echo Port %BACKEND_PORT% is in use by PID %%a. Killing...
    taskkill /PID %%a /F >nul 2>&1
)

:: Check and free frontend port
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%FRONTEND_PORT% " ^| findstr "LISTENING"') do (
    echo Port %FRONTEND_PORT% is in use by PID %%a. Killing...
    taskkill /PID %%a /F >nul 2>&1
)

echo Ports cleared.
echo.

echo [1/2] Starting Backend (port %BACKEND_PORT%)...
start "IoFA Backend" cmd /k "cd /d "%BACKEND_DIR%" && dotnet run --launch-profile http"

timeout /t 5 /nobreak > nul

echo [2/2] Starting Frontend (port %FRONTEND_PORT%)...
if not exist "%FRONTEND_DIR%\node_modules" (
    echo node_modules not found, running npm install first...
    start "IoFA Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm install && npm run dev"
) else (
    start "IoFA Frontend" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"
)

echo.
echo Both servers are starting in separate windows.
echo Frontend : http://localhost:%FRONTEND_PORT%
echo Backend  : http://localhost:%BACKEND_PORT%
echo.
pause
