# Task List: Interview Record Page Implementation

## 1. 폴더 구조 (Folder Structure)
이 프로젝트는 React 기반의 프론트엔드 구조를 따릅니다.

```
skillseeker-fe/
├── public/
├── src/
│   ├── assets/             # 이미지, 폰트 등 정적 자원
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   │   ├── layout/         # Header, Footer, Layout wrapper
│   │   ├── ui/             # 버튼, 입력 필드, Rating 컴포넌트 등 공용 UI
│   │   └── record/         # 면접 기록 페이지 전용 컴포넌트 (섹션별 분리)
│   ├── pages/              # 페이지 단위 컴포넌트 (InterviewRecordPage)
│   ├── styles/             # 전역 스타일 및 변수 (colors, fonts)
│   ├── App.jsx             # 메인 앱 컴포넌트 및 라우팅
│   └── main.jsx            # 진입점
└── package.json
```

## 2. 만들 파일의 종류 (Files to Create)

### Pages
- `src/pages/InterviewRecordPage.jsx`: 전체 폼을 포함하는 메인 페이지. 폼 상태(state)를 관리하고 제출을 처리합니다.

### Components
- **Layout**
    - `src/components/layout/Header.jsx`: 로고, 네비게이션(피드백, 기업 공고, 마이페이지), 프로필 아이콘.
    - `src/components/layout/PageContainer.jsx`: 중앙 정렬 및 여백을 위한 래퍼.

- **Record Sections (면접 기록 섹션)**
    - `src/components/record/BasicInfoSection.jsx`: [Step 1] 날짜, 회사명, 직무, 분위기 점수 입력.
    - `src/components/record/InterviewContentSection.jsx`: [Step 2] 질문/답변 리스트(CRUD), 내 답변 만족도, 한 줄 회고.
    - `src/components/record/MentalCareSection.jsx`: [Step 3] 컨디션 조절 방법(태그 선택), 긴장도 변화 점수.

- **UI Elements (공통 UI)**
    - `src/components/ui/RatingGroup.jsx`: 1~5점 선택 버튼 그룹 (분위기, 만족도, 긴장도 등 재사용).
    - `src/components/ui/SelectButtonMap.jsx`: 멘탈 케어 방법 같은 다중 선택 버튼 그룹.
    - `src/components/ui/ExpandableCard.jsx`: 질문/답변 내용을 접고 펼칠 수 있는 카드 UI.

## 3. 구현 상세 (Implementation Details)

### A. 상태 관리 (State Management)
- **Form State**: `InterviewRecordPage`에서 하나의 큰 객체로 관리하거나, Context API를 사용합니다.
    ```javascript
    const [formData, setFormData] = useState({
      basicInfo: { date: '', company: '', job: '', atmosphere: 3 },
      questions: [{ id: 1, question: '', answer: '', memo: '' }], // 동적 배열
      review: { satisfaction: 4, oneLineReview: '' },
      mentalCare: { methods: [], nervousness: 4 }
    });
    ```
- **Handler**: 각 섹션 컴포넌트에 `onChange` 핸들러를 props로 전달하여 상태를 업데이트합니다.

### B. 스타일링 (Styling)
- **CSS / CSS Modules**: `TECH_STACK.md`의 "HTML + CSS"를 준수하여, React 컴포넌트별 CSS 파일 혹은 Styled-components를 사용하지 않고 깨끗한 CSS 클래스 구조를 사용합니다.
- **Design System**:
    - **Colors**: Primary Blue (저장 버튼, 선택된 상태), Light Gray (배경), White (카드).
    - **Layout**: 최대 너비가 고정된 중앙 정렬 컨테이너 (`max-width: 800px` 등), 카드 형태의 섹션 구분 (`border-radius`, `box-shadow`).

### C. 기능적 요구사항 (Functional Requirements)
- **질문 추가하기**: "질문 내용을 입력하세요" 영역은 기본 하나가 열려 있고, 하단 "+ 질문 추가하기" 버튼으로 계속 늘릴 수 있어야 합니다.
- **선택형 입력**: 분위기, 만족도 등은 텍스트 입력이 아닌 **버튼 클릭(1~5)** 형태의 UI로 구현하여 사용자 경험을 높입니다.
- **멀티 선택**: 컨디션 조절 방법(호흡 조절, 약물 복용 등)은 **중복 선택**이 가능해야 합니다.

### D. 데이터 흐름 (Data Flow)
1. 사용자가 각 섹션 입력.
2. "저장 및 분석하기" 버튼 클릭.
3. `console.log`로 수집된 JSON 데이터 출력 (백엔드 연동 전 단계 확인용).
