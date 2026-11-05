@echo off
echo ============================================
echo   TRELLO DESKTOP - BUILD SCRIPT
echo ============================================
echo.

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Gagal menginstall dependencies.
    pause
    exit /b 1
)

echo.
echo [2/4] Installing Electron dependencies...
call npm install --save-dev electron electron-builder
if %errorlevel% neq 0 (
    echo ERROR: Gagal menginstall Electron.
    pause
    exit /b 1
)

echo.
echo [3/4] Building Windows executable (.exe)...
call npm run build:win
if %errorlevel% neq 0 (
    echo ERROR: Gagal membuild aplikasi.
    pause
    exit /b 1
)

echo.
echo [4/4] BUILD SELESAI!
echo.
echo File aplikasi tersimpan di folder: dist\
echo Nama file: Trello Desktop Setup 1.0.0.exe
echo.
echo ============================================
pause
