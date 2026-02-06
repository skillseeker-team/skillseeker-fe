### 1. `src/App.jsx` (InputForm)
**불일치 및 Redundancy:**
*   **`satisfaction` (만족도) 필드**: UI에는 존재하지만 `POST /api/interviews` 요청 바디에 포함되지 않습니다. 서버에 저장되지 않는 데이터입니다.
*   **`mentalCare` (컨디션/멘탈 케어) 섹션**: UI의 "섹션 3: 컨디션 및 멘탈 케어" (조절 방법, 긴장도 변화)는 API 명세에 없습니다. 서버에 저장되지 않습니다.
*   **`questions` 유효성 검사**: API는 `questions` 배열 중 **정확히 1개**가 `isHardest: true`여야 합니다. 현재 UI는 선택을 강제하지 않아(기본값 없음), 사용자가 선택하지 않고 제출하면 `400 Error`가 발생할 가능성이 있습니다.

### 2. `src/pages/FeedbackListPage.jsx`
**불일치 및 Redundancy:**
*   **만족도 표시 (`report.satisfaction`)**: `GET /api/interviews` (목록 조회) 응답에는 `satisfaction`이나 `atmosphereScore`가 포함되지 않습니다. 현재 코드는 없는 데이터를 표시하려 하므로 점수가 나오지 않거나 깨질 수 있습니다.
*   **대체 데이터**: API는 대신 `questionCount`와 `hasFeedback` 필드를 제공하므로, 이를 활용하는 UI로 변경하거나 점수 표시를 제거해야 합니다.

### 3. `src/pages/ReportPage.jsx`
**불일치 및 Redundancy:**
*   **`mentalCare` 섹션**: "컨디션 조절 효과" 섹션은 API 응답(`GET /api/interviews/{id}`)에 포함되지 않는 데이터입니다. 표시할 데이터가 없으므로 제거하거나 숨겨야 합니다.
*   **피드백 데이터 구조 불일치**:
    *   코드: `feedback.checklist` / `item.text` 사용
    *   API: `feedback.checklistItems` / `item.renderedText` 반환
    *   이로 인해 체크리스트가 렌더링되지 않을 것입니다.
*   **전략(Strategy) 표시**: 현재 `checklist`의 첫 번째 항목을 전략으로 표시하고 있는데, API의 `improvementOne`이나 `overallSummary`를 더 적극적으로 활용하는 것이 적절해 보입니다.

### 4. `src/pages/MyPage.jsx`
**불일치 및 Redundancy:**
*   **멘탈 케어 상세 메서드**: API(`GET /api/mypage/summary`)는 단순히 `avgScore` (평균 긴장도)만 반환합니다. 현재 UI에 하드코딩된 구체적인 관리 방법(호흡 조절, 차 마시기 등)과 그 효과 분석은 실제 데이터가 아니므로 오해를 줄 수 있습니다.
*   **데이터 매핑**: `missions` 섹션의 데이터 소스인 `checklistTop`은 템플릿 ID와 카운트만 제공하므로, UI의 `title`, `detail`, `deadline` 등을 API 데이터에 맞게 단순화해야 합니다.

---

**요약된 작업 제안:**
1.  **입력 폼(`App.jsx`)**: `satisfaction`, `mentalCare` 입력 필드 제거 및 `Best/Worst` 질문 선택 강제화.
2.  **목록 페이지(`FeedbackListPage.jsx`)**: 만족도 점수 제거, 질문 수/피드백 여부 표시로 변경.
3.  **상세 페이지(`ReportPage.jsx`)**: `mentalCare` 섹션 제거, 체크리스트 데이터 매핑 수정(`checklistItems`, `renderedText`).
4.  **마이페이지(`MyPage.jsx`)**: 멘탈 케어 상세 분석 섹션 간소화 (평균 점수만 표시).