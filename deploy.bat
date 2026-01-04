@echo off
echo Cleaning dist...
rmdir /s /q dist

echo Building project...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed!
    exit /b %errorlevel%
)

echo Creating deployment...
git subtree push --prefix dist origin gh-pages

if %errorlevel% neq 0 (
    echo Deploy failed!
    exit /b %errorlevel%
)

echo Deploy completed successfully!
