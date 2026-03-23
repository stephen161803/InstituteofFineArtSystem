@echo off
echo ============================================
echo  IoFA - Build and Publish
echo ============================================

set ROOT_DIR=%~dp0
set PUBLISH_DIR=D:\Publish_Web
set FRONTEND_DIR=%ROOT_DIR%InstituteofFineArtSystem\frontend
set BACKEND_DIR=%ROOT_DIR%InstituteofFineArtSystem\backend\IoFAApi
set WWWROOT_DIR=%BACKEND_DIR%\wwwroot

echo.
echo [1/3] Building frontend...
cd /d "%FRONTEND_DIR%"
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Copying frontend dist to backend wwwroot...
if exist "%WWWROOT_DIR%" rmdir /s /q "%WWWROOT_DIR%"
xcopy /E /I /Y dist "%WWWROOT_DIR%"
cd /d "%ROOT_DIR%"

echo.
echo [3/3] Publishing backend to %PUBLISH_DIR%...
if exist "%PUBLISH_DIR%" rmdir /s /q "%PUBLISH_DIR%"
dotnet publish "%BACKEND_DIR%\IoFAApi.csproj" -c Release -o "%PUBLISH_DIR%"
if errorlevel 1 (
    echo ERROR: Backend publish failed!
    pause
    exit /b 1
)

echo.
echo ============================================
echo  Done! Published to %PUBLISH_DIR%
echo  Run: cd %PUBLISH_DIR% ^& dotnet IoFAApi.dll
echo ============================================
pause
