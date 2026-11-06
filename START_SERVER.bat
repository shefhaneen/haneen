@echo off
chcp 65001 >nul
title Khaltchi Khaltchi - Local Server
echo ========================================================
echo   مطعم خلتشي خلتشي - جاري تشغيل السيرفر المحلي...
echo   سيرفر المنفذ: http://localhost:8080/
echo ========================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080
pause
