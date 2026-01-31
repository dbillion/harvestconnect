# Fix Chat and Kanban Unit Tests

## Goal
Implement and fix unit tests for Chat Channels creation and Tradesman Kanban project workflows in both Django (Backend) and Next.js (Frontend).

## Context
The user requested focus on:
1.  **Chat Channels**: Creation and management of chat rooms (personal, group, channel).
2.  **Tradesman Kanban**: Project creation and status updates (Inquiry -> Quote Sent -> In Progress).
3.  **Connection**: Verification of the integration between frontend components and backend APIs for these features.

## Procedure

### 1. Backend Testing (Django)
-   **Analyze**: Check `backend/tests/test_api.py` for existing Chat and Project tests.
-   **Implement/Fix**:
    -   Create `ChatEndpointTestCase` to test `ChatRoom` and `ChatMessage` creation.
    -   Create `ProjectEndpointTestCase` (Tradesman) to test `Project` creation and status transitions.
-   **Verify**: Run `uv run python manage.py test tests.test_api` to ensure they pass.

### 2. Frontend Testing (Next.js)
-   **Analyze**: Check `harvestconnect/tests` or equivalent for component tests.
-   **Implement/Fix**:
    -   Test `ChatComponent` (or similar) for channel creation interaction.
    -   Test `KanbanBoard` (or similar) for project card creation and moving.
-   **Verify**: Run `npm test` to ensure they pass.

## Tools
-   `view_file`: To inspect existing tests and models/views.
-   `write_to_file`: To create new test files if needed.
-   `replace_file_content`: To add tests to `test_api.py`.
-   `execution/run_tests_and_report.py`: To verify everything.

## Learnings (Self-Annealing)
1.  **WebSocket Mocking**: When testing components with WebSockets in Vitest/JSDOM, use a `class` mock for `global.WebSocket` to ensure it works correctly with the `new` keyword and includes static properties like `OPEN`, `CLOSED`, etc.
2.  **ViewSet logic**: Ensure `perform_create` on ViewSets correctly handles automated field assignment (e.g., `sender=request.user` for messages) to prevent `IntegrityError` in tests.
3.  **Nested Assertions**: Backend tests should account for nested serializer outputs (e.g., `user` object inside `tradesman` field) when asserting against IDs.
4.  **Profile Signals**: In Django tests, be aware that `post_save` signals might already create a `UserProfile`. Getting the existing profile and updating its role is safer than trying to create a new one, which would trigger a `UNIQUE` constraint failure.
5.  **Featured Filters**: Views like `ArtistViewSet` that filter by `featured=True` require test data to explicitly set this flag to be visible in list/detail responses.
6.  **Registration Validation**: Validation for registration using `dj_rest_auth` often requires checking `password1` and `password2` fields in addition to the primary `password` field.

## Verification
-   **Backend**: `uv run python manage.py test tests.test_api` -> **PASSED**
-   **Frontend**: `npm test` (Vitest) -> **PASSED**
-   **Fullstack**: `uv run python execution/run_tests_and_report.py` -> **PASSED**
