@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 goto runpy
where python >nul 2>nul
if %errorlevel%==0 goto runpython
echo Python is not installed. Use the HTTPS deployment steps in اقرأني_قبل_التثبيت.txt
pause
exit /b 1
:runpy
start "Rukn Kids Local Server" /D "%~dp0" cmd /k "py -m http.server 8765"
goto openapp
:runpython
start "Rukn Kids Local Server" /D "%~dp0" cmd /k "python -m http.server 8765"
:openapp
timeout /t 2 >nul
start "" "http://127.0.0.1:8765/index.html"
echo Keep the server window open while you use the app locally.
echo For installation on mobile, publish the folder to an HTTPS host as explained in the guide.
pause
