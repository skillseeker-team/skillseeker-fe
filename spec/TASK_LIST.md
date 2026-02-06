# Task List for API Integration

## 0. Configuration & Environment Setup
- [ ] Create `.env` file in the project root:
    - Define `VITE_API_BASE_URL` (e.g., `http://localhost:8080`).
- [ ] Update `vite.config.js`:
    - Configure `server.proxy` to forward `/api` requests to the backend (to avoid CORS in dev).
- [ ] Create `src/api/config.js`:
    - Export a configured `API_BASE_URL` or `fetch` wrapper.

## 1. Setup API Client
- [ ] Create `src/api/interviewApi.js` to handle interview-related API calls:
    - [ ] `createInterview(data)`: POST `/api/interviews`
    - [ ] `getInterviews()`: GET `/api/interviews`
    - [ ] `getInterviewById(id)`: GET `/api/interviews/{id}`
    - [ ] `deleteInterview(id)`: DELETE `/api/interviews/{id}`
    - [ ] `generateFeedback(id)`: POST `/api/interviews/{id}/feedback:ai`
    - [ ] `getFeedback(id)`: GET `/api/interviews/{id}/feedback`

## 2. Refactor Interview Creation (`src/App.jsx`)
- [ ] In `InputForm` component:
    - [ ] Remove `localStorage` logic.
    - [ ] Map `react-hook-form` data to API spec JSON format:
        - `date` -> `interviewDate`
        - `company` -> `company`
        - `position` -> `role`
        - `atmosphere` -> `atmosphereScore`
        - `tension` -> `tensionChangeScore`
        - `review` -> `memo`
        - `questions` array mapping:
            - `question` -> `questionText`
            - `answer` -> `answerText`
            - `isHardest`: true if index matches `worstQuestionIndex`
            - `isBest`: true if index matches `bestQuestionIndex`
    - [ ] Call `createInterview` API.
    - [ ] On success, navigate to `/report/{newId}`.

## 3. Refactor Feedback List (`src/pages/FeedbackListPage.jsx`)
- [ ] Remove `localStorage` reading.
- [ ] Use `useEffect` to call `getInterviews`.
- [ ] Render the list using the API response data (`items` array).

## 4. Refactor Report Detail (`src/pages/ReportPage.jsx`)
- [ ] Remove `localStorage` reading.
- [ ] Fetch interview details using `getInterviewById(id)`.
- [ ] (Future) Trigger or fetch AI feedback using `generateFeedback` / `getFeedback` and display real analysis instead of mock logic.

## 5. Verification
- [ ] Verify form submission sends correct JSON payload.
- [ ] Verify list page displays fetched data.
- [ ] Verify detail page displays fetched data.
