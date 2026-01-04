@echo off
echo Building project...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed!
    exit /b %errorlevel%
)

echo Creating deployment...
git subtree split --prefix dist -b temp-gh-pages

echo Force pushing to gh-pages...
git push -f origin temp-gh-pages:gh-pages

echo Cleaning up...
git branch -D temp-gh-pages

if %errorlevel% neq 0 (
    echo Deploy failed!
    exit /b %errorlevel%
)

echo Deploy completed successfully!