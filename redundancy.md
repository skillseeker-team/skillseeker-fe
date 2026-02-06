최종본 API 명세(@spec/APIS.md)를 바탕으로 현재 프로젝트의 `.jsx` 파일들과 API 호출부(`src/api/interviewApi.js`)를 점검한 결과, 다음과 같은 불일치 사항들이 발견되었습니다.

### 1. `src/App.jsx` (면접 생성 요청)
*   **누락된 필드**: 면접 생성(`POST /api/interviews`) 시 UI에는 데이터(`satisfaction`, `mentalCare`)가 존재하지만, 요청 바디(payload)에 포함되지 않고 있습니다.
    *   UI의 `satisfaction` 값 -> API의 `satisfactionScore`로 전송 필요.
    *   UI의 `mentalCare` 배열 -> API의 `conditionMethods`로 전송 필요.
*   **Enum 값 불일치**: UI에서 사용하는 컨디션 관리 키(`breath`, `meds`, `mind`, `sleep`)와 API 명세의 키(`breathing`, `medication`, `mind_control`, `sleep_management`)가 서로 다릅니다. 이대로 보내면 백엔드에서 인식하지 못할 수 있습니다.

### 2. `src/pages/FeedbackListPage.jsx` (목록 조회 응답 처리)
*   **데이터 구조 불일치**: 현재 코드는 응답이 `{ items: [...] }` 형태라고 가정하고 `data.items`를 참조하고 있으나, 최신 명세상 `GET /api/interviews`는 **배열(`[...]`)을 직접 반환**합니다.
    *   이로 인해 현재 목록 화면에 아무것도 표시되지 않을 가능성이 큽니다.

### 3. `src/pages/ReportPage.jsx` (상세 조회 및 피드백 처리)
*   **데이터 필드 참조**:
    *   현재 만족도 점수를 `report.atmosphereScore`에서 가져오고 있으나, 이제는 `report.satisfactionScore`를 직접 사용할 수 있습니다.
    *   체크리스트 토글 시 `currentStatus === 'DONE' ? 'TODO' : 'DONE'`으로직이 있으나, API 에러 명세("이미 DONE인 항목")를 볼 때 서버가 `TODO`로의 역전환을 지원하는지 확인이 필요합니다.
*   **컨디션 관리 표시**: 현재 UI에서 "(API 미지원) 준비 중"으로 표시되는 섹션을 `report.conditionMethods` 데이터를 사용하여 실제 기록된 내용으로 표시할 수 있게 되었습니다.

### 4. `src/pages/MyPage.jsx` (통계 데이터 처리)
*   **평균 점수 필드**: `summary?.avgScore?.avg5`를 참조하고 있는데, 이는 명세(`avgScore: { avg5: 5.6 }`)와 일치합니다.
*   **내러티브 데이터**: `narrative?.narratives`를 참조하고 있는데, 이는 명세(`{ narratives: [...] }`)와 일치합니다.

### 5. `src/api/interviewApi.js` (공통 API 설정)
*   **Base URL**: `.env` 파일은 수정되었으나, `config.js`나 호출부에서 이 주소를 명확히 참조하여 개발 서버가 아닌 실제 IP(`10.108.226.151:8080`)로 요청을 보내고 있는지 확인이 필요합니다. (현재는 Vite Proxy에 의존 중)

---
**보고 요약**:
가장 시급한 불일치는 **목록 페이지의 데이터 구조(`data.items` vs `data`)**와 **입력 폼의 누락된 데이터 전송(`satisfactionScore`, `conditionMethods`)**입니다. 이 부분을 수정해야 기능이 정상적으로 작동할 것으로 보입니다.