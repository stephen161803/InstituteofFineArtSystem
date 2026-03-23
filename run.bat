@echo off
echo Starting IoFA System...
echo.
echo After the server starts, open the URL shown in the console (e.g. http://localhost:5000)
echo Press Ctrl+C to stop the server.
echo.
cd /d "%~dp0Publish_Web" 2>nul || cd /d "%~dp0"
dotnet IoFAApi.dll
pause
