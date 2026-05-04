@echo off
REM Quick deployment script for BUSA Voting System

echo.
echo ============================================
echo BUSA Voting System - GitHub Push Script
echo ============================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed. Please install it from https://git-scm.com
    pause
    exit /b 1
)

REM Initialize git if needed
if not exist .git (
    echo Initializing git repository...
    git init
)

REM Check if remote exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo GitHub repository not yet linked.
    echo Please enter your GitHub repository URL when prompted.
    echo Example: https://github.com/YOUR_USERNAME/busa-voting-system.git
    echo.
    set /p REPO_URL="Enter GitHub repository URL: "
    git remote add origin %REPO_URL%
) else (
    for /f "tokens=*" %%a in ('git remote get-url origin') do set REPO_URL=%%a
    echo Using existing remote: %REPO_URL%
)

echo.
echo Current branch status:
git status

echo.
echo Adding all files to git...
git add .

echo.
set /p COMMIT_MSG="Enter commit message (default: Update code): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update code

echo Committing changes...
git commit -m "%COMMIT_MSG%"

echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

if errorlevel 0 (
    echo.
    echo ============================================
    echo SUCCESS! Code pushed to GitHub
    echo ============================================
    echo.
    echo Next steps:
    echo 1. Go to Railway.app and deploy the backend
    echo 2. Go to Vercel and deploy the frontend
    echo.
    echo For detailed instructions, see: DEPLOYMENT_GUIDE.md
) else (
    echo.
    echo ERROR: Failed to push to GitHub
    echo Please check your GitHub URL and SSH keys
)

pause
