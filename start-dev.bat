@echo off
echo Starting IoFA Backend...
start "IoFA Backend" cmd /k "cd InstituteofFineArtSystem\backend\IoFAApi && dotnet run"

timeout /t 5 /nobreak > nul

echo Starting IoFA Frontend...
start "IoFA Frontend" cmd /k "cd InstituteofFineArtSystem\frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5117
echo Frontend: http://localhost:5173
echo.
pause
