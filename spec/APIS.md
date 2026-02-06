[http://10.108.226.151:8080](http://10.108.226.151:8080/)

const API_BASE_URL = "[http://10.108.226.151:8080](http://10.108.226.151:8080/)";

# SkillSeeker API 명세서

> Base URL: `http://{host}`
Swagger UI: `http://{host}/swagger-ui.html`
인증: 없음 (데모 유저 고정, user_id=1)
> 

---

## 공통 사항

### 에러 응답 형식

모든 에러는 아래 형식으로 반환됩니다.

```json
{
  "status": 400,
  "message": "에러 메시지",
  "errors": ["필드별 상세 에러 (validation 실패 시)"],
  "timestamp": "2025-01-15T14:30:00"
}
```

### 날짜/시간 형식

| 타입 | 형식 | 예시 |
| --- | --- | --- |
| LocalDate | `YYYY-MM-DD` | `"2025-01-15"` |
| LocalDateTime | `YYYY-MM-DDThh:mm:ss` | `"2025-01-15T14:30:00"` |

---

## 

## 1. Interview (면접)

### 1-1. 면접 생성

```
POST /api/interviews
```

**Request Body**

```json
{
  "company": "네이버",
  "role": "백엔드 개발자",
  "interviewDate": "2025-01-15",
  "atmosphereScore": null,
  "tensionChangeScore": 4,
  "conditionMethods": ["breathing", "sleep_management"],
  "satisfactionScore": 3,
  "memo": "첫 면접이라 많이 긴장함",
  "questions": [
    {
      "questionText": "TCP 3-way handshake에 대해 설명해주세요",
      "answerText": "SYN, SYN-ACK, ACK 과정으로 연결을 수립합니다",
      "isHardest": true,
      "isBest": false
    },
    {
      "questionText": "REST API 설계 원칙은?",
      "answerText": null,
      "isHardest": false,
      "isBest": false
    }
  ]
}
```

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| company | String | O | 회사명 |
| role | String | O | 포지션 |
| interviewDate | String (date) | O | 면접일 |
| atmosphereScore | Integer | X | 분위기 점수 |
| tensionChangeScore | Integer | X | 긴장도 변화 점수 1~5 (둘 다 보내면 이것만 저장) |
| conditionMethods | String[] | X | 컨디션 조절 방법 (복수 선택 가능) |
| satisfactionScore | Integer | X | 면접 체감 완성도 1~5 |
| memo | String | X | 메모 |
| questions | Array | O | 최소 1개, **정확히 1개가 `isHardest: true`여야 함** |
| questions[].questionText | String | O | 질문 내용 |
| questions[].answerText | String | X | 답변 내용 |
| questions[].isHardest | Boolean | X | 가장 어려웠던 질문 (기본 false) |
| questions[].isBest | Boolean | X | 가장 잘 답한 질문 (기본 false) |

**conditionMethods 허용 값:**

| key | 한글 |
| --- | --- |
| `breathing` | 호흡 조절 |
| `medication` | 약물 복용 |
| `mind_control` | 마인드 컨트롤 |
| `sleep_management` | 수면 관리 |
| `music` | 음악 감상 |

**Response `201 Created`**

```json
{
  "id": 1,
  "company": "네이버",
  "role": "백엔드 개발자",
  "interviewDate": "2025-01-15",
  "tension": "4",
  "conditionMethods": ["breathing", "sleep_management"],
  "satisfactionScore": 3,
  "memo": "첫 면접이라 많이 긴장함",
  "createdAt": "2025-01-15T14:30:00",
  "questions": [
    {
      "id": 1,
      "questionText": "TCP 3-way handshake에 대해 설명해주세요",
      "answerText": "SYN, SYN-ACK, ACK 과정으로 연결을 수립합니다",
      "isHardest": true,
      "isBest": false,
      "category": null,
      "questionKey": null
    }
  ]
}
```

**에러**

- `400` : hardest가 0개 또는 2개 이상 / 필수 필드 누락

---

---

### 1-2. 면접 목록 조회

```
GET /api/interviews
```

**Response `200 OK`**

```json
[
  {
    "id": 1,
    "company": "네이버",
    "role": "백엔드 개발자",
    "interviewDate": "2025-01-15",
    "questionCount": 4,
    "hasFeedback": true,
    "createdAt": "2025-01-15T14:30:00"
  }
]
```

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| questionCount | int | 질문 수 |
| hasFeedback | boolean | 피드백 리포트 존재 여부 |

---

### 1-3. 면접 상세 조회

```
GET /api/interviews/{id}
```

**Response `200 OK`** : 1-1 Response와 동일한 형식

**에러**

- `404` : 면접을 찾을 수 없음

---

### 1-4. 면접 삭제

```
DELETE /api/interviews/{id}
```

**Response `204 No Content`** (body 없음)

> 관련 질문, 피드백 리포트, 약점 태그, 체크리스트 모두 cascade 삭제됩니다.
> 

**에러**

- `404` : 면접을 찾을 수 없음

---

## 2. Feedback (AI 피드백)

### 2-1. AI 피드백 생성

```
POST /api/interviews/{id}/feedback:ai
```

**Request** : body 없음

**동작**

1. 면접 데이터를 패킹하고 payload_hash를 계산
2. 동일 hash의 완료된 리포트가 있으면 캐시 반환
3. 없으면 Gemini API 호출 → 결과 파싱 → DB 저장
4. 실패 시 status=FAILED로 저장, 재호출하면 재시도

**Response `200 OK`**

```json
{
  "id": 1,
  "interviewId": 1,
  "status": "DONE",
  "overallSummary": [
    "전반적으로 기본 개념은 이해하고 있으나 깊이 있는 설명이 부족합니다.",
    "답변 구조를 STAR 기법으로 개선하면 전달력이 크게 향상될 것입니다.",
    "실무 경험을 구체적 수치와 함께 제시하면 설득력이 높아집니다."
  ],
  "improvementOne": "가장 시급한 개선점은 답변에 구체적인 수치와 경험 사례를 추가하는 것입니다.",
  "weaknessTags": [
    {
      "tag": "depth",
      "label": "깊이 부족",
      "description": "기술적 깊이가 얕아 표면적 수준에 머묾",
      "reason": "TCP 핸드셰이크 설명이 교과서적 수준에 머물러 있습니다."
    }
  ],
  "checklistItems": [
    {
      "id": 1,
      "templateId": "REVIEW_STAR",
      "renderedText": "STAR 기법으로 'TCP 3-way handshake' 답변을 다시 작성해보세요.",
      "status": "TODO"
    }
  ],
  "createdAt": "2025-01-15T14:35:00"
}
```

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| status | String | `PENDING` / `PROCESSING` / `DONE` / `FAILED` |
| overallSummary | String[] | 3문장 요약 |
| improvementOne | String | 가장 중요한 개선점 1개 |
| weaknessTags[].tag | String | 약점 enum 값 |
| weaknessTags[].label | String | 한글 라벨 |
| weaknessTags[].description | String | 약점 설명 |
| weaknessTags[].reason | String | 이 면접에서의 구체적 이유 |
| checklistItems[].status | String | `TODO` / `DONE` |
| checklistItems[].renderedText | String | 렌더링된 체크리스트 텍스트 |

**에러**

- `400` : AI 생성 실패 (재시도 가능)
- `404` : 면접을 찾을 수 없음

---

### 2-2. 피드백 조회

```
GET /api/interviews/{id}/feedback
```

**Response `200 OK`** : 2-1 Response와 동일한 형식

**에러**

- `404` : 면접 또는 피드백을 찾을 수 없음

---

## 3. Checklist (체크리스트)

### 3-1. 체크리스트 완료 처리

```
PATCH /api/checklists/{itemId}
```

**Request** : body 없음

**Response `200 OK`**

```json
{
  "id": 1,
  "status": "DONE"
}
```

**에러**

- `400` : 이미 DONE인 항목
- `404` : 항목을 찾을 수 없음

---

## 4. MyPage (마이페이지)

### 4-1. 통계 요약 조회

```
GET /api/mypage/summary
```

> LLM 미사용. SQL 집계만 수행합니다.
> 

**Response `200 OK`**

```json
{
  "topMistakes": [
    {
      "tag": "depth",
      "count": 3,
      "label": "깊이 부족",
      "description": "기술적 깊이가 얕아 표면적 수준에 머묾"
    }
  ],
  "topQuestionsByCategory": {
    "database": [
      { "questionKey": "transaction_isolation_levels", "count": 2 }
    ],
    "architecture": [
      { "questionKey": "msa_vs_monolith_tradeoff", "count": 1 }
    ]
  },
  "avgScore": {
    "type": "tension",
    "avg5": 5.6
  },
  "checklistTop": [
    { "checklistId": "REVIEW_STAR", "count": 3 }
  ],
  "checklistIncompleteCount": 7
}
```

| 필드 | 설명 |
| --- | --- |
| topMistakes | 가장 빈번한 약점 TOP 3 |
| topQuestionsByCategory | 카테고리별 자주 나온 질문 TOP 5 |
| avgScore | 최근 5회 면접 평균 긴장도 |
| checklistTop | 가장 많이 나온 체크리스트 템플릿 TOP 10 |
| checklistIncompleteCount | 미완료 체크리스트 수 |

---

### 4-2. 내러티브 조회

```
GET /api/mypage/narrative
```

> LLM 미사용. 통계 기반 템플릿 문장을 반환합니다.
> 

**Response `200 OK`**

```json
{
  "narratives": [
    "지금까지 총 6회의 면접을 기록했습니다.",
    "가장 자주 나타나는 약점은 '깊이 부족'(3회)입니다.",
    "최근 5회 면접의 평균 긴장도는 5.6점입니다.",
    "체크리스트 진행률: 2/9 항목 완료 (22%)",
    "가장 많이 출제된 카테고리는 'database'입니다."
  ]
}
```

---

### 4-3. AI 인사이트 생성

```
POST /api/mypage/insights:ai
```

> 통계 요약 JSON만 LLM에 전달합니다 (면접 원문 미사용). summary_hash로 캐싱됩니다.
> 

**Request** : body 없음

**Response `200 OK`**

```json
{
  "highlights": [
    "데이터베이스 관련 질문이 가장 많이 출제되고 있어 이 영역의 준비가 중요합니다.",
    "답변의 깊이 부족이 반복되고 있어 기술적 원리 학습이 필요합니다.",
    "체크리스트 완료율이 낮아 학습 실행력을 높일 필요가 있습니다."
  ],
  "nextActions": [
    "이번 주 내로 트랜잭션 격리 수준의 내부 동작 원리를 정리하세요.",
    "미완료 체크리스트 항목 중 3개를 이번 주 안에 완료하세요."
  ],
  "cached": false
}
```

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| highlights | String[] | 핵심 인사이트 2~3개 |
| nextActions | String[] | 다음 행동 권장 2개 |
| cached | boolean | 캐시된 결과인지 여부 |

---

## 5. Demo (데모)

### 5-1. 데모 데이터 생성

```
POST /api/demo/seed
```

> 기존 데모 유저 데이터를 모두 삭제하고 샘플 데이터를 생성합니다.
> 

**Request** : body 없음

**Response `200 OK`**

```json
{
  "interviews": 6,
  "questions": 21,
  "feedbackReports": 3,
  "message": "Demo data seeded successfully"
}
```

---

## 부록: Enum 값 목록

### QuestionCategory (11개)

```
fundamentals, network, database, architecture, framework,
performance, devops, testing, project, collaboration, culture
```

### WeaknessTag (10개)

| tag | label | description |
| --- | --- | --- |
| structure | 답변 구조 | 답변이 체계적이지 않고 두서없이 전달됨 |
| evidence | 근거 부족 | 주장에 대한 구체적 근거나 사례가 없음 |
| depth | 깊이 부족 | 기술적 깊이가 얕아 표면적 수준에 머묾 |
| clarity | 명확성 | 핵심 메시지가 불명확하거나 모호함 |
| conciseness | 간결성 | 불필요한 내용이 많아 핵심 전달이 약함 |
| followup | 꼬리질문 대응 | 예상 꼬리질문에 대한 준비가 부족함 |
| pressure_handling | 압박 대응 | 압박 상황에서 논리적 대응이 부족함 |
| ownership | 주도성 | 본인의 역할과 기여가 명확하지 않음 |
| tradeoff | 트레이드오프 | 기술 선택의 장단점 분석이 부족함 |
| fundamentals | 기본기 | CS 기본 개념에 대한 이해가 부족함 |

### Feedback Status

```
PENDING → PROCESSING → DONE
                     → FAILED (재시도 가능)
```

### Checklist Status

```
TODO → DONE
```