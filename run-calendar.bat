@echo off
cd /d "%~dp0"
start "My Calendar Server" cmd /k "npm run dev -- --open"