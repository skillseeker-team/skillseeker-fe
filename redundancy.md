### 1. `src/App.jsx` (InputForm)
**불일치 및 Redundancy:**
*   **`satisfaction` (만족도) 필드**: API 명세(`POST /api/interviews`)에는 포함되지 않으나, 기획상 UI 유지가 필요하여 존치합니다. (서버 전송은 하지 않음)
*   **`mentalCare` (컨디션/멘탈 케어) 섹션**:
    *   **긴장도 변화**: API의 `tensionChangeScore` 필드와 정상 연동됩니다.
    *   **조절 방법(methods)**: UI에는 존재하지만 API 명세에는 저장 공간이 없습니다.
*   **`questions` 유효성 검사**: API 제약 조건(정확히 1개의 `isHardest: true`)을 충족하기 위해 `Worst` 질문 선택이 강제되어야 합니다. (구현 완료)

### 2. `src/pages/FeedbackListPage.jsx`
**불일치 및 Redundancy:**
*   **데이터 부재**: `GET /api/interviews` (목록 조회) 응답에는 `satisfaction`이나 `atmosphereScore` 필드가 존재하지 않습니다.
*   **Action**: 목록 카드 하단의 만족도 점수 표시 섹션을 완전히 제거합니다. 대신 API에서 제공하는 `questionCount`(질문 수)나 `hasFeedback`(리포트 여부)를 활용할 수 있습니다.

### 3. `src/pages/ReportPage.jsx`
**불일치 및 Redundancy:**
*   **`mentalCare` 섹션**: 응답에 `methods` 상세 리스트가 없으므로 점수 위주로 UI를 간소화해야 합니다.
*   **피드백 데이터 구조 불일치**: API는 `checklistItems` 배열과 `renderedText` 필드를 사용합니다. (구현 완료)

### 4. `src/pages/MyPage.jsx`
**불일치 및 Redundancy:**
*   **멘탈 케어 상세 메서드**: API(`GET /api/mypage/summary`)는 `avgScore` (평균 긴장도)만 반환하므로 하드코딩된 방법론 섹션을 간소화해야 합니다.
*   **데이터 매핑**: `checklistTop` 데이터를 UI의 미션 카드 구조에 맞게 매핑해야 합니다.

---

**요약된 작업 제안:**
1.  **목록 페이지(`FeedbackListPage.jsx`)**: 존재하지 않는 만족도 점수 표시 섹션을 제거하고, 등록일 정보를 유지합니다.
2.  **상세 페이지(`ReportPage.jsx`)**: 멘탈 케어 섹션에서 지원되지 않는 상세 방법론 표시를 제거합니다.
3.  **마이페이지(`MyPage.jsx`)**: 실제 서버 데이터(`avgScore`, `checklistTop`)를 기반으로 UI를 정제합니다.
