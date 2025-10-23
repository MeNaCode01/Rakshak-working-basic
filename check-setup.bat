@echo off
echo ========================================
echo  Rakshak 2.0 - Quick Start Checker
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Download from https://nodejs.org/
    pause
    exit /b 1
) else (
    node --version
    echo [OK] Node.js found
)
echo.

echo [2/5] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Download from https://www.python.org/
    pause
    exit /b 1
) else (
    python --version
    echo [OK] Python found
)
echo.

echo [3/5] Checking if node_modules exist...
if not exist "client\node_modules\" (
    echo [WARNING] client/node_modules not found. Run: cd client ^&^& npm install
) else (
    echo [OK] client/node_modules found
)

if not exist "backend\node_modules\" (
    echo [WARNING] backend/node_modules not found. Run: cd backend ^&^& npm install
) else (
    echo [OK] backend/node_modules found
)

if not exist "records\node_modules\" (
    echo [WARNING] records/node_modules not found. Run: cd records ^&^& npm install
) else (
    echo [OK] records/node_modules found
)
echo.

echo [4/5] Checking environment files...
if not exist "records\.env" (
    echo [WARNING] records/.env not found. Copy from records/.env.example and configure MongoDB
) else (
    echo [OK] records/.env found
)

if not exist "client\.env.development" (
    echo [WARNING] client/.env.development not found
) else (
    echo [OK] client/.env.development found
)
echo.

echo [5/5] Summary
echo ========================================
echo Prerequisites check complete!
echo.
echo Next steps:
echo 1. Install dependencies: See SETUP_GUIDE.md Step 1
echo 2. Configure MongoDB: See SETUP_GUIDE.md Step 2
echo 3. Run all services: See SETUP_GUIDE.md "Running the Project"
echo.
echo Open SETUP_GUIDE.md for detailed instructions
echo ========================================
pause
