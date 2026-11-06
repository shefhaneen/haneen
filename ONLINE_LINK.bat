@echo off
chcp 65001 >nul
title Khaltchi Khaltchi - Public Online Link
echo ===================================================================
echo   مطعم خلتشي خلتشي - جاري إنشاء رابط إنترنت عام بدون باسورد...
echo ===================================================================

:: تشغيل السيرفر المحلي في الخلفية
start /b powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080 >nul 2>&1

timeout /t 2 >nul

echo.
echo   جاري إنشاء الرابط العام المباشر عبر نفق فوري...
echo   سيظهر الرابط العام بالأسفل (انسخه وشاركه مع أي شخص):
echo ===================================================================
echo.

ssh -o StrictHostKeyChecking=no -p 443 -R0:localhost:8080 a.pinggy.io

pause
