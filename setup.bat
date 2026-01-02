@echo off
echo Setting up your project...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed.
    exit /b 1
)
echo Node.js version:
node -v
if not exist .env.development (
    echo Creating .env.development from template...
    copy .env.development.example .env.development
)
if not exist .env.production (
    echo Creating .env.production from template...
    copy .env.production.example .env.production
    echo IMPORTANT: Edit .env.production and set your BASE_PATH!
)
echo Installing dependencies...
call npm install
if %errorlevel% equ 0 (
    echo Setup complete!
    echo NEXT STEP: Edit .env.production and configure your deployment path
    echo To start development:
    echo   npm run dev
) else (
    echo Installation failed.
    exit /b 1
)