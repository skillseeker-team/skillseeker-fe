import React, { useState } from 'react';
import { X } from 'lucide-react';
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
        status: '진행 전',
        estimatedTime: '예상 소요 2시간',
        completed: false,
      },
      {
        id: 3,
        text: '네오테크 서비스 직접 사용해보고 UX 개선 아이디어 3개 제안 정리',
        tip: '불편한 점/좋았던 점을 기준으로 정리하고, 프론트엔드 관점에서 어떻게 구현할지까지 한 줄 코멘트 작성.',
        status: '진행 중',
        completed: false,
      },
      {
        id: 4,
        text: '팀 협업 경험 2개 선정 후, 갈등·기여·성과 중심으로 STAR 구조 정리',
        tip: '상황(S), 과업(T), 액션(A), 결과(R) 순으로 작성하고, 네오테크 문화에 어떻게 연결되는지 문장 추가.',
        status: '진행 전',
        completed: false,
      },
    ],
  },
};

const Company = () => {
  const [companies, setCompanies] = useState(mockData.interestedCompanies);
  const [selectedCompanyId, setSelectedCompanyId] = useState(mockData.interestedCompanies[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    headcount: '',
    deadline: '',
    interviewDate: '',
    overview: '',
  });
  const [isAddingMission, setIsAddingMission] = useState(false);
  const [newMission, setNewMission] = useState({
    text: '',
    tip: '',
    status: '진행 전',
  });

  // Calculate D-Day utility
  // Calculate D-Day utility
  const calculateDDay = (targetDateStr) => {
    if (!targetDateStr) return 'D-Day';
    const today = new Date();
    const target = new Date(targetDateStr);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day';
    return diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  };

  // Find the selected company from the list, or fallback to mock detail if not found (or if list item lacks details, we use a default structure)
  // For this simplified version, we'll try to use the selected company from state if it has details, 
  // otherwise fallback to the hardcoded mockData.selectedCompany for the "Neotech" item specifically or blend them.
  // Actually, to make the new item work, we should just use the found company.
  // For the existing mock items (id 2,3,4,5), they don't have full details in `interestedCompanies`.
  // So we will stick to: if it's the new item (has details), use it. If it's old items, use mockData.selectedCompany (just as a placeholder for now as requested).
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  const companyDetail = selectedCompany && selectedCompany.overview
    ? selectedCompany
    : { ...mockData.selectedCompany, ...selectedCompany }; // Merge basic info from list with mock detail for legacy items

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    if (!selectedCompany) return;
    // Map current company details to form data
    setFormData({
      name: companyDetail.name || '',
      role: companyDetail.role || '',
      location: companyDetail.location || '',
      headcount: companyDetail.headcount || '',
      deadline: companyDetail.deadline || '',
      interviewDate: companyDetail.interviewDate || '',
      overview: companyDetail.overview || '',
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setFormData({
      name: '',
      role: '',
      location: '',
      headcount: '',
      deadline: '',
      interviewDate: '',
      overview: '',
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleSaveCompany = () => {
    if (!formData.name || !formData.role) {
      alert('기업명과 직무를 입력해주세요.');
      return;
    }

    const dDayValue = calculateDDay(formData.interviewDate);

    if (isEditing) {
      // Update existing company
      const updatedCompanies = companies.map(company => {
        if (company.id === selectedCompanyId) {
          return {
            ...company,
            name: formData.name,
            role: formData.role,
            location: formData.location || '위치 미정',
            headcount: formData.headcount || '0명',
            deadline: formData.deadline || '마감일 미정',
            interviewDate: formData.interviewDate || '미정',
            interviewScheduled: formData.interviewDate || '미정',
            dDay: dDayValue,
            overview: formData.overview || '기업 설명이 없습니다.',
            // Keep existing fields that aren't in form, falling back to current detail view if missing
            logo: company.logo,
            strategy: company.strategy || companyDetail.strategy,
            missions: company.missions || companyDetail.missions,
          };
        }
        return company;
      });
      setCompanies(updatedCompanies);
    } else {
      // Create new company
      const newId = companies.length > 0 ? Math.max(...companies.map(c => c.id)) + 1 : 1;

      const addedCompany = {
        id: newId,
        name: formData.name,
        role: formData.role,
        location: formData.location || '위치 미정',
        headcount: formData.headcount || '0명',
        deadline: formData.deadline || '마감일 미정',
        interviewDate: formData.interviewDate || '미정',
        interviewScheduled: formData.interviewDate || '미정',
        dDay: dDayValue,
        overview: formData.overview || '기업 설명이 없습니다.',
        strategy: '아직 등록된 전략이 없습니다.',
        missions: [],
      };
      setCompanies([...companies, addedCompany]);
      setSelectedCompanyId(newId);
    }

    setFormData({
      name: '',
      role: '',
      location: '',
      headcount: '',
      deadline: '',
      interviewDate: '',
      overview: '',
    });
    setIsModalOpen(false);
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleSaveMission = () => {
    if (!newMission.text.trim()) {
      alert('미션 내용을 입력해주세요.');
      return;
    }

    const updatedCompanies = companies.map(company => {
      if (company.id === selectedCompanyId) {
        // Ensure we work with the current visible missions (whether from state or mock fallback)
        const currentMissions = company.missions || companyDetail.missions || [];
        const newMissionId = currentMissions.length > 0 ? Math.max(...currentMissions.map(m => m.id)) + 1 : 1;

        const missionToAdd = {
          id: newMissionId,
          text: newMission.text,
          tip: newMission.tip,
          status: newMission.status,
          completed: false,
        };

        return {
          ...company,
          missions: [...currentMissions, missionToAdd],
          // Ensure strategy is preserved if we are converting a legacy item
          strategy: company.strategy || companyDetail.strategy,
        };
      }
      return company;
    });

    setCompanies(updatedCompanies);
    setNewMission({ text: '', tip: '', status: '진행 전' });
    setIsAddingMission(false);
  };

  const handleDeleteClick = () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    const updatedCompanies = companies.filter(c => c.id !== selectedCompanyId);
    setCompanies(updatedCompanies);

    if (updatedCompanies.length > 0) {
      setSelectedCompanyId(updatedCompanies[0].id);
    } else {
      setSelectedCompanyId(null);
    }

    alert('공고가 삭제되었습니다.');
  };

  // Sorting helper: Score D-Day for ordering
  const getDDayScore = (company) => {
    // 1. Valid date -> Calculate diff
    if (company.interviewDate && !isNaN(new Date(company.interviewDate).getTime())) {
      const today = new Date();
      const target = new Date(company.interviewDate);
      today.setHours(0, 0, 0, 0);
      target.setHours(0, 0, 0, 0);
      return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }
    // 2. Mock data string parsing
    const dDayStr = company.dDay;
    if (!dDayStr) return 9999;
    if (dDayStr === 'D-Day') return 0;
    if (dDayStr.startsWith('D-')) return parseInt(dDayStr.replace('D-', ''), 10); // Future (e.g. D-5 -> 5)
    if (dDayStr.startsWith('D+')) return -parseInt(dDayStr.replace('D+', ''), 10); // Past (e.g. D+5 -> -5)

    return 9999;
  };

  const sortedCompanies = [...companies].sort((a, b) => getDDayScore(a) - getDDayScore(b));

  return (
    <div className="company-page-container">
      {/* Left Column: Interested Companies List */}
      <div className="interested-companies-list">
        <div className="list-header">
          <h2 className="list-title">관심 기업 리스트</h2>
          <p className="list-description">지원 중인 공고를 한눈에 관리하세요</p>
        </div>
        <button className="add-company-to-list-btn" onClick={handleAddClick}>+ 새 공고 등록하기</button>

        <div className="company-items-wrapper">
          {companies.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              등록된 관심 기업이 없습니다.
            </div>
          ) : (
            sortedCompanies.map((company) => (
              <div
                key={company.id}
                className={`company-list-item ${selectedCompanyId === company.id ? 'active' : ''}`}
                onClick={() => setSelectedCompanyId(company.id)}
              >
                <div className="company-info">
                  <h3 className="company-name">{company.name}</h3>
                  <p className="company-role">{company.role}</p>
                  <p className="company-date">{company.interviewDate}</p>
                </div>
                <span className="d-day-badge">
                  {/* Try to calculate D-Day dynamically, fallback to static if not a valid date (mock data) */}
                  {isNaN(new Date(company.interviewDate).getTime()) ? company.dDay : calculateDDay(company.interviewDate)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Company Detail */}
      {selectedCompany && (
        <div className="company-detail-section">
          <div className="company-detail-header">
            <span className="status-label">
              {(() => {
                const dDayVal = calculateDDay(companyDetail.interviewDate);
                // Check computed D-Day or use static property if calculation fails/returns string
                // Note: calculateDDay returns "D-5", "D+5", "D-Day"
                // If mock data has static dDay, we use that if calculation isn't applicable?
                // Actually companyDetail merges mockData.selectedCompany + selected item.
                // If selected item is a new one, interviewDate is valid -> calculateDDay works.
                // If selected item is old mock (id 2,3...), it has `dDay` property in list, but companyDetail merges with `selectedCompany` (mock detail).
                // Let's rely on calculating from interviewDate if available, or fall back to dDay string.

                const currentDDay = companyDetail.interviewDate && !isNaN(new Date(companyDetail.interviewDate).getTime())
                  ? calculateDDay(companyDetail.interviewDate)
                  : companyDetail.dDay || 'D-Day'; // Fallback

                if (currentDDay === 'D-Day') return '오늘';
                if (currentDDay.startsWith('D+')) return '지난 공고';
                return '진행 중 공고';
              })()}
            </span>
            <div className="action-buttons">
              <button className="btn btn-edit" onClick={handleEditClick}>✏️ 수정</button>
              <button className="btn btn-delete" onClick={handleDeleteClick}>🗑️ 삭제</button>
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
              <p className="info-label">서류 제출 마감</p>
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
                  </label>
                  {mission.status && (
                    <span className={`mission-status-badge ${mission.status === '완료' ? 'completed' : mission.status === '진행 중' ? 'in-progress' : ''}`}>
                      {mission.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          {isAddingMission ? (
            <div className="add-mission-form" style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  value={newMission.text}
                  onChange={(e) => setNewMission({ ...newMission, text: e.target.value })}
                  placeholder="미션 명 (예: 기업 분석 보고서 작성하기)"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '14px' }}
                  autoFocus
                />
                <input
                  type="text"
                  value={newMission.tip}
                  onChange={(e) => setNewMission({ ...newMission, tip: e.target.value })}
                  placeholder="세부사항/Tip (예: DART 보고서 참고)"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '14px' }}
                />
                <select
                  value={newMission.status}
                  onChange={(e) => setNewMission({ ...newMission, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '14px', backgroundColor: 'white' }}
                >
                  <option value="진행 전">진행 전</option>
                  <option value="진행 중">진행 중</option>
                  <option value="완료">완료</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  className="btn"
                  onClick={() => setIsAddingMission(false)}
                  style={{ padding: '8px 16px', border: '1px solid #ced4da', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '14px' }}
                >
                  취소
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveMission}
                  style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
                >
                  등록
                </button>
              </div>
            </div>
          ) : (
            <button className="add-mission-btn" onClick={() => setIsAddingMission(true)}>+ 새로운 미션 추가해서 나만의 전략 세우기</button>
          )}
        </div>
      )
      }

      {/* Add Company Modal */}
      {/* Add Company Modal */}
      {
        isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{isEditing ? '공고 수정' : '새 공고 등록'}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="input-group">
                  <label>기업명</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="예: 네오테크"
                  />
                </div>
                <div className="input-group">
                  <label>지원 직무</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="예: 프론트엔드 개발자"
                  />
                </div>
                <div className="input-group">
                  <label>회사 위치</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="예: 서울 강남구"
                  />
                </div>
                <div className="input-group">
                  <label>모집 인원</label>
                  <input
                    type="text"
                    name="headcount"
                    value={formData.headcount}
                    onChange={handleInputChange}
                    placeholder="예: 0명"
                  />
                </div>
                <div className="input-group">
                  <label>마감 기한</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>면접 예정일</label>
                  <input
                    type="date"
                    name="interviewDate"
                    value={formData.interviewDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="input-group">
                  <label>기업 개요 및 설명</label>
                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleInputChange}
                    placeholder="기업에 대한 간단한 설명을 입력하세요."
                    rows={4}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>취소</button>
                <button className="btn btn-primary" onClick={handleSaveCompany}>
                  {isEditing ? '수정하기' : '등록하기'}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};


export default Company;