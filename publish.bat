@echo off
echo ============================================
echo  IoFA - Build and Publish
echo ============================================

set PUBLISH_DIR=D:\Publish_Web
set FRONTEND_DIR=InstituteofFineArtSystem\frontend
set BACKEND_DIR=InstituteofFineArtSystem\backend\IoFAApi

echo.
echo [1/3] Building frontend...
cd %FRONTEND_DIR%
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Copying frontend dist to backend wwwroot...
if exist "..\backend\IoFAApi\wwwroot" rmdir /s /q "..\backend\IoFAApi\wwwroot"
xcopy /E /I /Y dist ..\backend\IoFAApi\wwwroot
cd ..\..\..\..

echo.
echo [3/3] Publishing backend to %PUBLISH_DIR%...
if exist "%PUBLISH_DIR%" rmdir /s /q "%PUBLISH_DIR%"
dotnet publish %BACKEND_DIR%\IoFAApi.csproj -c Release -o "%PUBLISH_DIR%"
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
