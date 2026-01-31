# Fix Backend Bugs

## Goal
Resolve failing unit tests in the Django backend, specifically focusing on pagination configuration and product creation validation errors.

## Context
Recent test runs identified two primary failure modes:
1. **Pagination**: `test_pagination_first_page` fails because the API returns more results (20) than the test expects (10).
2. **Product Creation**: `test_create_product_authenticated` fails with a 400 Bad Request instead of 201 Created.

## Procedure

### 1. Pagination Fix
- **Locate Configuration**: Find the `REST_FRAMEWORK` configuration in `settings.py` or the specific ViewSet definitions.
- **Analyze**: Determine if the global `PAGE_SIZE` is set to 20 or if it's missing (defaulting to a higher number).
- **Remediation**:
    - If the test is correct (standard is 10), update the backend `PAGE_SIZE` to 10.
    - If the backend is correct (standard is 20), update the test expectation to 20.
    - *Decision*: We will enforce a robust default of 10 to match standard API patterns.

### 2. Product Creation Fix
- **Analyze Test Payload**: Examine `tests/test_api.py` to see what data is being sent.
- **Analyze Serializer**: Examine the `ProductSerializer` to see what fields are required.
- **Debug**: The 400 error implies missing required fields or validation mismatches.
- **Remediation**: Update the `ProductSerializer` to handle the input correctly OR update the ViewSet to properly inject context (like the logged-in user).

### 3. Verification
- Run the execution script `execution/run_tests_and_report.py` to confirm all backend tests pass.

## Tools
- `grep_search`: To find settings and references.
- `view_file`: To analyze code logic.
- `replace_file_content`: To apply code fixes.
- `execution/run_tests_and_report.py`: To verify fixes.
