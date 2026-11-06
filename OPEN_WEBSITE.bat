@echo off
chcp 65001 >nul
title Khaltchi Khaltchi - Open Website
echo ========================================================
echo   جاري فتح موقع مطعم خلتشي خلتشي في المتصفح فوراً...
echo ========================================================
start "" "%~dp0index.html"
exit
