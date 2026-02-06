# Task List for API Integration

## 0. Configuration & Environment Setup
- [x] Create `.env` file in the project root:
    - Define `VITE_API_BASE_URL` (e.g., `http://localhost:8080`).
- [x] Update `vite.config.js`:
    - Configure `server.proxy` to forward `/api` requests to the backend (to avoid CORS in dev).
- [x] Create `src/api/config.js`:
    - Export a configured `API_BASE_URL` or `fetch` wrapper.

## 1. Setup API Client
- [x] Create `src/api/interviewApi.js` to handle interview-related API calls.
- [ ] Update `src/api/interviewApi.js` with new endpoints:
    - [ ] `updateChecklist(itemId, status)`: PATCH `/api/checklists/{itemId}`
    - [ ] `getMyPageSummary()`: GET `/api/mypage/summary`
    - [ ] `getMyPageNarrative()`: GET `/api/mypage/narrative`
    - [ ] `seedDemoData()`: POST `/api/demo/seed`

## 2. Refactor Interview Creation (`src/App.jsx`)
- [x] In `InputForm` component:
    - [x] Remove `localStorage` logic.
    - [x] Map `react-hook-form` data to API spec JSON format.
    - [x] Call `createInterview` API.
    - [x] On success, navigate to `/report/{newId}`.

## 3. Refactor Feedback List (`src/pages/FeedbackListPage.jsx`)
- [x] Remove `localStorage` reading.
- [x] Use `useEffect` to call `getInterviews`.
- [x] Render the list using the API response data (`items` array).

## 4. Refactor Report Detail (`src/pages/ReportPage.jsx`)
- [x] Remove `localStorage` reading.
- [x] Fetch interview details using `getInterviewById(id)`.
- [ ] Implement checklist toggle using `updateChecklist` API.
- [ ] Ensure feedback display matches new spec (checklist vs checklistItems).

## 5. Refactor MyPage (`src/pages/MyPage.jsx`)
- [ ] Fetch data using `getMyPageSummary()` and `getMyPageNarrative()`.
- [ ] Map API response to the UI state (replace/simplify `mockData`).
    - `topMistakes` -> Frequent Mistakes
    - `topQuestionsByCategory` -> Frequent Questions
    - `avgLast5` -> Stats/Graph
    - `checklistTop` -> (Optional) Display in mission section?
    - `narrative` -> Display narrative lines (User Info description)

## 6. Verification
- [ ] Verify form submission sends correct JSON payload.
- [ ] Verify list page displays fetched data.
- [ ] Verify detail page displays fetched data and checklist updates work.
- [ ] Verify MyPage displays real summary statistics.
