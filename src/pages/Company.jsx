import React, { useState } from 'react';
import '../App.css'; // Will create this CSS file

const mockData = {
  interestedCompanies: [
    {
      id: 1,
      name: '네오테크',
      role: '프론트엔드 개발자 (신입)',
      interviewDate: '2025.06 예정',
      dDay: 'D-5',
      logo: 'https://via.placeholder.com/32?text=N', // Placeholder logo
    },
    {
      id: 2,
      name: '핀큐브',
      role: '데이터 분석 인턴',
      interviewDate: '2025.03 예정',
      dDay: 'D-1',
      logo: 'https://via.placeholder.com/32?text=P', // Placeholder logo
    },
    {
      id: 3,
      name: '마켓리프',
      role: '서비스 기획자',
      interviewDate: '2025.08 예정',
      dDay: 'D-12',
      logo: 'https://via.placeholder.com/32?text=M', // Placeholder logo
    },
    {
      id: 4,
      name: '클라우드핏',
      role: '백엔드 엔지니어',
      interviewDate: '2025.10 예정',
      dDay: 'D-20',
      logo: 'https://via.placeholder.com/32?text=C', // Placeholder logo
    },
    {
      id: 5,
      name: '플레이버스',
      role: '게임 클라이언트 개발',
      interviewDate: '2025.12 예정',
      dDay: 'D-30',
      logo: 'https://via.placeholder.com/32?text=P', // Placeholder logo
    },
  ],
  selectedCompany: {
    name: '네오테크',
    role: '프론트엔드 개발자 (신입)·정규직',
    location: '서울·판교',
    headcount: '0~2명',
    deadline: '2025.02',
    interviewScheduled: '2025.03',
    overview: `네오테크는 글로벌 서비스를 지향하는 B2C IT 스타트업으로, 빠르게 실험하고 사용자 피드백을 적극 반영하는 문화를 가지고 있습니다. 프론트엔드 개발자는 React 기반의 웹 서비스 개발 및 운영을 담당하며, 디자이너·백엔드 개발자와의 협업 경험이 중요합니다.
    주요 업무에는 신규 기능 개발, 기존 코드 리팩토링, 성능 개선, 접근성 및 반응형 UI 개선 등이 포함됩니다. 자기 주도적으로 문제를 정의하고 해결 방법을 설계할 수 있는 태도를 중요하게 평가합니다.`,
    strategy: `공고의 요구사항과 나의 현재 상태를 비교하여, 면접일까지 집중할 미션을 체크리스트로 관리하세요.`,
    missions: [
      {
        id: 1,
        text: 'React 포트폴리오 프로젝트 구조 리팩토링 & 핵심 기능 화고 정라',
        tip: '상태 관리, 컴포넌트 분리, API 에러 처리 방식 중심으로 개선 포인트를 문서화해 면접 때 설명할 수 있도록 준비.',
        status: '완료',
        completed: true,
      },
      {
        id: 2,
        text: '프론트엔드 CS 기초 (브라우저 렌더링, 이벤트 루프, HTTP) 개념 복습',
        tip: '예상 질문 리스트를 만들고, 각 질문에 대해 2~3문장 이내로 답변 정리하기.',
        status: '오늘의 미션',
        estimatedTime: '예상 소요 2시간',
        completed: false,
      },
      {
        id: 3,
        text: '네오테크 서비스 직접 사용해보고 UX 개선 아이디어 3개 제안 정리',
        tip: '불편한 점/좋았던 점을 기준으로 정리하고, 프론트엔드 관점에서 어떻게 구현할지까지 한 줄 코멘트 작성.',
        status: '마감 전까지',
        completed: false,
      },
      {
        id: 4,
        text: '팀 협업 경험 2개 선정 후, 갈등·기여·성과 중심으로 STAR 구조 정리',
        tip: '상황(S), 과업(T), 액션(A), 결과(R) 순으로 작성하고, 네오테크 문화에 어떻게 연결되는지 문장 추가.',
        status: '면접 전날',
        completed: false,
      },
    ],
  },
};

const Company = () => {
  const [selectedCompanyId, setSelectedCompanyId] = useState(mockData.interestedCompanies[0].id);
  const companyDetail = mockData.selectedCompany; // For simplicity, always show the same detail for now

  return (
    <div className="company-page-container">
      {/* Left Column: Interested Companies List */}
      <div className="interested-companies-list">
        <div className="list-header">
          <h2 className="list-title">관심 기업 리스트</h2>
          <p className="list-description">지원 중인 공고를 한눈에 관리하세요</p>
          <button className="add-new-company-btn">+ 새 공고</button>
        </div>
        <button className="add-company-to-list-btn">+ 새 공고 등록하기</button>

        <div className="company-items-wrapper">
          {mockData.interestedCompanies.map((company) => (
            <div
              key={company.id}
              className={`company-list-item ${selectedCompanyId === company.id ? 'active' : ''}`}
              onClick={() => setSelectedCompanyId(company.id)}
            >
              <img src={company.logo} alt={`${company.name} logo`} className="company-logo" />
              <div className="company-info">
                <h3 className="company-name">{company.name}</h3>
                <p className="company-role">{company.role}</p>
                <p className="company-date">{company.interviewDate}</p>
              </div>
              <span className="d-day-badge">{company.dDay}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Company Detail */}
      <div className="company-detail-section">
        <div className="company-detail-header">
          <span className="status-label">진행 중 공고</span>
          <div className="action-buttons">
            <button className="btn btn-edit">✏️ 수정</button>
            <button className="btn btn-delete">🗑️ 삭제</button>
          </div>
        </div>

        <h1 className="company-detail-name">{companyDetail.name}</h1>
        <p className="company-detail-role">{companyDetail.role}</p>

        <div className="info-cards-grid">
          <div className="info-card">
            <p className="info-label">회사 위치</p>
            <p className="info-value">{companyDetail.location}</p>
          </div>
          <div className="info-card">
            <p className="info-label">모집 인원</p>
            <p className="info-value">{companyDetail.headcount}</p>
          </div>
          <div className="info-card">
            <p className="info-label">마감 기한</p>
            <p className="info-value">{companyDetail.deadline}</p>
          </div>
          <div className="info-card">
            <p className="info-label">면접 예정일</p>
            <p className="info-value">{companyDetail.interviewScheduled}</p>
          </div>
        </div>

        <div className="detail-section">
          <h2 className="section-title">기업 개요 및 설명</h2>
          <p className="section-content">{companyDetail.overview}</p>
        </div>

        <div className="detail-section strategy-section">
          <div className="strategy-header">
            <span className="strategy-badge">핵심 전략</span>
            <span className="strategy-description">{companyDetail.strategy}</span>
          </div>
          <div className="missions-list">
            {companyDetail.missions.map((mission) => (
              <div key={mission.id} className="mission-item">
                <input
                  type="checkbox"
                  id={`mission-${mission.id}`}
                  defaultChecked={mission.completed}
                  className="mission-checkbox"
                />
                <label htmlFor={`mission-${mission.id}`} className="mission-content">
                  <span className="mission-text">{mission.text}</span>
                  {mission.tip && <p className="mission-tip">{mission.tip}</p>}
                  {mission.status === '오늘의 미션' && mission.estimatedTime && (
                    <span className="mission-status-time">{mission.estimatedTime}</span>
                  )}
                </label>
                {mission.status && mission.status !== '오늘의 미션' && (
                  <span className={`mission-status-badge ${mission.status === '완료' ? 'completed' : ''}`}>
                    {mission.status}
                  </span>
                )}
              </div>
            ))}
          </div>
          <button className="add-mission-btn">+ 새로운 미션 추가해서 나만의 전략 세우기</button>
        </div>
      </div>
    </div>
  );
};

export default Company;