# Run Fullstack Tests

## Goal
Execute the full suite of unit tests for both the backend (Django) and frontend (Next.js) applications to verify system integrity and integration readiness.

## Inputs
- Backend Directory: `/home/deeone/Documents/HarvestConnect/backend`
- Frontend Directory: `/home/deeone/Documents/HarvestConnect/harvestconnect`

## Tools
- `execution/run_tests_and_report.py`: A Python script that orchestrates the execution of backend and frontend tests and generates a summary report.

## Procedure
1. **Validation**: Ensure `uv` is installed for backend dependency management and `npm` is available for frontend.
2. **Backend Testing**:
   - Navigate to the backend directory.
   - Execute the test runner (e.g., `run_tests.sh` or direct `pytest`/`manage.py` commands).
   - Capture pass/fail status and coverage metrics if available.
3. **Frontend Testing**:
   - Navigate to the frontend directory.
   - Run `npm test` in CI mode (single run, no watch).
   - Capture pass/fail status.
4. **Reporting**:
   - Generate a consolidated report highlighting:
     - Backend test functionality status.
     - Frontend test functionality status.
     - Any failures or errors encountered.

## Output
- A textual report displayed in the conversation summarizing the test results.
