#!/bin/bash
# HarvestConnect Backend Test Runner
# Uses uv for dependency management and pytest for testing

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  HarvestConnect Backend Test Suite${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo -e "${RED}❌ uv is not installed${NC}"
    echo "Please install uv: pip install uv"
    exit 1
fi

echo -e "${YELLOW}📦 Installing dependencies with uv...${NC}"
uv pip install -r requirements.txt --quiet
echo -e "${GREEN}✅ Dependencies installed${NC}\n"

# Get the Python interpreter from uv
PYTHON_BIN=$(uv run --python-preference managed python --version >/dev/null 2>&1 && uv run which python || which python)

# Create test database and apply migrations
echo -e "${YELLOW}🗄️  Setting up test database...${NC}"
uv run python manage.py migrate --run-syncdb --verbosity=0 2>/dev/null || true
echo -e "${GREEN}✅ Database ready${NC}\n"

# Run Django tests
echo -e "${YELLOW}🧪 Running Django test suite...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"
uv run python manage.py test tests.test_api --verbosity=2 2>&1 || TEST_RESULT=$?

if [ -z "$TEST_RESULT" ]; then
    TEST_RESULT=0
fi

echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}\n"

# Run pytest with coverage
echo -e "${YELLOW}📊 Running pytest with coverage...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"
uv run python -m pytest tests/test_api.py -v --tb=short 2>&1 || PYTEST_RESULT=$?

if [ -z "$PYTEST_RESULT" ]; then
    PYTEST_RESULT=0
fi

echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}\n"

# Print summary
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

if [ $TEST_RESULT -eq 0 ] && [ $PYTEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
else
    echo -e "${RED}❌ Some tests failed${NC}"
    if [ $TEST_RESULT -ne 0 ]; then
        echo -e "${RED}   - Django tests failed${NC}"
    fi
    if [ $PYTEST_RESULT -ne 0 ]; then
        echo -e "${RED}   - Pytest failed${NC}"
    fi
fi

echo -e "\n${YELLOW}📝 Test files:${NC}"
echo "  - /backend/tests/test_api.py (comprehensive pytest suite)"
echo "  - /backend/pytest.ini (pytest configuration)"
echo "  - /backend/requirements.txt (updated with testing dependencies)"

echo -e "\n${YELLOW}🚀 To run tests manually with uv:${NC}"
echo "  1. Django tests: uv run python manage.py test tests.test_api"
echo "  2. Pytest:       uv run python -m pytest tests/test_api.py -v"
echo "  3. With coverage: uv run python -m pytest tests/test_api.py --cov=api"

echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

exit $((TEST_RESULT + PYTEST_RESULT))
