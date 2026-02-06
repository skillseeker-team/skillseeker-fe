## **1) 인터뷰 생성**

**POST** **`/api/interviews`**

### **Request**

```json
{"interviewDate":"2026-02-07","company":"OO","role":"Backend","atmosphereScore":2,"tensionChangeScore":4,"memo":"기억나는 흐름...","questions":[{"questionText":"트랜잭션 격리수준?","answerText":"…","isHardest":true,"isBest":false},{"questionText":"HTTP vs HTTPS?","answerText":"…","isHardest":false,"isBest":true}]}
```

### **Response 201**

```json
{"id":1,"interviewDate":"2026-02-07","company":"OO","role":"Backend","atmosphereScore":2,"tensionChangeScore":4,"memo":"기억나는 흐름...","questions":[{"id":11,"questionText":"트랜잭션 격리수준?","answerText":"…","isHardest":true,"isBest":false,"category":null,"questionKey":null},{"id":12,"questionText":"HTTP vs HTTPS?","answerText":"…","isHardest":false,"isBest":true,"category":null,"questionKey":null}],"createdAt":"2026-02-07T12:00:00Z"}
```

### **Error 400 (hardest가 정확히 1개가 아니면)**

```json
{"code":"VALIDATION_ERROR","message":"hardest question must be exactly 1"}
```

---

## **2) 인터뷰 목록**

**GET** **`/api/interviews`**

### **Response 200**

```json
{"items":[{"id":1,"interviewDate":"2026-02-07","company":"OO","role":"Backend","createdAt":"..."}]}
```

---

## **3) 인터뷰 상세**

**GET** **`/api/interviews/{id}`**

### **Response 200**

(POST 응답과 동일 구조)

---

## **4) 인터뷰 삭제**

**DELETE** **`/api/interviews/{id}`**

### **Response 204 (body 없음)**

---

## **5) 피드백 생성(AI)**

**POST** **`/api/interviews/{id}/feedback:ai`**

### **Response 200**

```json
{"interviewId":1,"status":"DONE","overallSummary":["요약 1","요약 2","요약 3"],"improvementOne":"개선 포인트 1문장","weaknessTags":[{"tag":"evidence","label":"근거 부족","desc":"사례·수치·근거가 부족함","count":null}],"checklist":[{"id":101,"checklistId":"CL_ANSWER_60SEC","text":"트랜잭션 격리수준? 60초 답변 카드 만들기","status":"TODO"}],"questions":[{"id":11,"category":"database","questionKey":"transaction_isolation_level"}],"createdAt":"...","updatedAt":"..."}
```

### **Response 200 (PROCESSING 가능하게 할 수도 있음)**

```json
{"interviewId":1,"status":"PROCESSING"}
```

### **Response 200 (FAILED)**

```json
{"interviewId":1,"status":"FAILED","message":"LLM output invalid. Please retry."}
```

---

## **6) 피드백 조회**

**GET** **`/api/interviews/{id}/feedback`**

응답은 위와 동일

---

## **7) 체크리스트 완료 처리**

**PATCH** **`/api/checklists/{itemId}`**

### **Request**

```json
{"status":"DONE"}
```

### **Response 200**

```json
{"id":101,"status":"DONE"}
```

---

## **8) 마이페이지 통계**

**GET** **`/api/mypage/summary`**

### **Response 200**

```json
{"topMistakes":[{"tag":"evidence","label":"근거 부족","desc":"사례·수치·근거가 부족함","count":4}],"topQuestionsByCategory":{"database":[{"questionKey":"transaction_isolation_level","count":3}]},"avgLast5":{"type":"tension","avg":3.6},"checklistTop":[{"checklistId":"CL_ANSWER_60SEC","count":5}],"checklistIncompleteCount":7}
```

---

## **9) 마이페이지 내러티브**

**GET** **`/api/mypage/narrative`**

### **Response 200**

```json
{"lines":["최근 반복 실수는 '근거 부족'이 가장 많아요.","DB 질문이 자주 등장하니 transaction_isolation_level 카드부터 고치면 효율적이에요."]}
```

---

## **10) (옵션) 데모 데이터 시드**

**POST** **`/api/demo/seed`**

### **Response 200**

```json
{"ok":true,"createdInterviews":6}
```