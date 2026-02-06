### 1. `src/App.jsx` (InputForm)
**불일치 및 Redundancy:**
*   **`satisfaction` (만족도) 필드**: API 명세(`POST /api/interviews`)에는 포함되지 않으나, 기획 의도상 UI에서 제거하지 않고 유지합니다. (서버 전송은 하지 않음)
*   **`mentalCare` (컨디션/멘탈 케어) 섹션**:
    *   **긴장도 변화**: API의 `tensionChangeScore` 필드와 매핑하여 정상적으로 저장합니다.
    *   **조절 방법(methods)**: UI에는 존재하지만 API 명세에는 저장 공간이 없습니다. (서버 전송 불가)
*   **`questions` 유효성 검사**: API는 `questions` 배열 중 **정확히 1개**가 `isHardest: true`여야 합니다. 현재 UI에서 `Worst` 질문 선택을 강제하는 유효성 검사 로직이 필요합니다.

### 2. `src/pages/FeedbackListPage.jsx`
**불일치 및 Redundancy:**
*   **데이터 매핑 오류**: 현재 코드는 `report.satisfaction`을 사용하고 있으나, API는 `atmosphereScore` (분위기 점수)를 반환합니다.
*   **Action**: 만족도 점수 표시를 제거하는 것이 아니라, `satisfaction` 대신 `atmosphereScore`를 사용하여 점수를 표시하도록 수정해야 합니다.

### 3. `src/pages/ReportPage.jsx`
**불일치 및 Redundancy:**
*   **`mentalCare` 섹션**: API 응답(`GET /api/interviews/{id}`)에는 `tensionChangeScore`만 존재하며, 구체적인 조절 방법(methods) 리스트는 반환되지 않습니다. 이에 따라 상세 조절 효과를 표시하는 UI 섹션의 조정이 필요합니다.
*   **피드백 데이터 구조 불일치**:
    *   코드: `feedback.checklist` / `item.text` 사용
    *   API: `feedback.checklistItems` / `item.renderedText` 반환
    *   API 응답 구조에 맞춰 렌더링 로직을 수정해야 합니다.

### 4. `src/pages/MyPage.jsx`
**불일치 및 Redundancy:**
*   **멘탈 케어 상세 메서드**: API(`GET /api/mypage/summary`)는 `avgScore` (평균 긴장도)만 반환합니다. UI에 하드코딩된 '호흡 조절' 등의 구체적 방법론과 효과 분석은 실제 데이터가 아니므로, 평균 점수 위주의 UI로 변경해야 합니다.
*   **데이터 매핑**: `missions` 섹션의 데이터 소스인 `checklistTop`은 템플릿 ID와 카운트만 제공합니다. UI의 `title`, `detail` 등이 API 데이터와 자연스럽게 매핑되도록 수정해야 합니다.

---

**요약된 작업 제안:**
1.  **입력 폼(`App.jsx`)**: `satisfaction` UI 유지, `tensionChangeScore` 연동 확인, `Worst` 질문 선택 유효성 검사 추가.
2.  **목록 페이지(`FeedbackListPage.jsx`)**: `satisfaction` 필드를 `atmosphereScore`로 교체하여 점수 표시 정상화.
3.  **상세 페이지(`ReportPage.jsx`)**: 체크리스트 데이터 매핑 수정(`checklistItems`), 멘탈 케어 섹션은 점수 위주로 간소화.
4.  **마이페이지(`MyPage.jsx`)**: 멘탈 케어 및 미션 섹션을 API 제공 데이터(`avgScore`, `checklistTop`) 기반으로 수정.