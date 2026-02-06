import React, { useState, useRef, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Camera, Trash2 } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import '../App.css';

const mockData = {
  header: {
    analysisPeriod: '2025.01 - 2025.06',
  },
  // userInfo moved to UserContext
  frequentMistakes: {
    sectionDescription: '최근 10회 면접 복기 내용을 기반으로 자동 분류된 실수 패턴입니다.',
    mistakes: [
      { id: 1, text: '시선 처리 불안', count: 8, progress: 80, color: '#FF6B6B' },
      { id: 2, text: '두괄식 답변 미흡', count: 6, progress: 60, color: '#FFD166' },
      { id: 3, text: '경험 근거 부족', count: 5, progress: 50, color: '#06D6A0' },
      { id: 4, text: '말 속도 조절 실패', count: 4, progress: 40, color: '#118AB2' },
      { id: 5, text: '부정적 자기 표현', count: 3, progress: 30, color: '#cccccc' },
    ],
  },
  frequentQuestions: {
    questions: [
      {
        id: 1,
        text: '본인의 강점과 약점을 각각 구체적인 사례와 함께 설명해 주세요.',
        tip: '구조화된 답변 연습 필요 (STAR 기법 활용 추천)',
      },
      {
        id: 2,
        text: '최근에 가장 도전적이었던 프로젝트와 그 과정에서의 역할은 무엇인가요?',
        tip: '성과 수치화 및 구체적인 기여도 강조 필요',
      },
      {
        id: 3,
        text: '스트레스 상황에서 본인을 어떻게 관리하고 대처하나요?',
        tip: '실제 사례 + 구체적인 멘탈 관리 루틴 연결',
      },
    ],
  },
  mentalCare: {
    sectionDescription: '면접 전·후 기록한 감정 점수 변화를 기반으로 분석합니다.',
    methods: [
      {
        id: 1,
        rankType: '✓ 가장 효과적인 방법',
        title: '면접 직전 긴장 완화 기준',
        icon: '🌬️',
        methodName: '4-7-8 호흡 조절',
        badge: '1위',
        effectScore: 4.8,
        description: '평균 긴장도 63% → 28% 감소, 집중도 41% 향상',
        effectNote: '면접 직전 사용 시 가장 안정적',
        isTopMethod: true,
      },
      {
        id: 2,
        icon: '☕',
        methodName: '따뜻한 차 마시기 + 짧은 산책',
        badge: '2위',
        effectScore: 4.1,
        description: '면접 1시간 전, 걷기 10분 + 차 한 잔 루틴에서 가장 안정적',
        isTopMethod: false,
      },
      {
        id: 3,
        icon: '🎵',
        methodName: '플레이리스트 음악 듣기',
        badge: '3위',
        effectScore: 3.4,
        description: '긴장도는 낮추지만, 약간의 집중력 저하가 함께 나타남',
        isTopMethod: false,
      },
      {
        id: 4,
        icon: '💊',
        methodName: '청심환 복용',
        badge: '보조',
        effectScore: 2.6,
        description: '단독 사용보단 호흡 조절/산책과 함께할 때 효과 상승',
        isTopMethod: false,
      },
    ],
    recommendedRoutine: {
      icon: '💡',
      description: '면접 30분 전, 4-7-8 호흡 3세트 → 5분 산책 → 마지막 복기 노트 1회 점검',
    },
  },
  missions: {
    sectionDescription: '최근 실수 패턴과 합격자 답변 스타일을 기반으로 구성된 맞춤 미션입니다.',
    categories: [
      {
        id: 1,
        icon: '📈',
        categoryName: '스펙 관련 미션',
        statusText: '3개 중 1개 완료',
        categoryDescription: '경험의 설득력을 높이는 정량화/정리 미션',
        missions: [
          {
            id: 1,
            title: '프로젝트 A 성과 수치화하기',
            detail: '성과 지표(매출, 전환율, 사용자 수 등)를 최소 3개 이상 수치로 정리',
            deadline: '마감: 2025.02 · 예상 소요 40분',
            status: '진행 중',
            completed: false,
          },
          {
            id: 2,
            title: '이직 동기 답변 업그레이드',
            detail: '현재 답변을 300자 이내로 줄이고, 회사 리서치 내용 2개 이상 반영',
            deadline: '마감: 2025.02 · 예상 소요 30분',
            status: '시작 전',
            completed: false,
          },
          {
            id: 3,
            title: '자기소개서 핵심 키워드 5개 뽑기',
            detail: '핵심 키워드를 기준으로 답변 구조(과정 결과 배움) 재정리',
            deadline: '완료: 2025.01',
            status: '완료',
            completed: true,
          },
        ],
      },
      {
        id: 2,
        icon: '🤝',
        categoryName: '면접 태도 미션',
        statusText: '4개 중 2개 완료',
        categoryDescription: '시선 처리, 말투, 표정 등 커뮤니케이션 관련 미션',
        missions: [
          {
            id: 4,
            title: '모의 면접 1회 진행 (시선 처리 집중)',
            detail: '답변 후 2초간 눈맞춤 유지, 화면 녹화로 본인 시선 패턴 체크',
            deadline: '추천: 이번 주 안에 1회 이상',
            status: '진행 중',
            completed: false,
          },
          {
            id: 5,
            title: '두괄식 답변 템플릿 3개 만들기',
            detail: '지원 동기, 강점, 실패 경험 각각에 대한 1문장 핵심 결론 정리',
            deadline: '추천: 쉬운 질문부터 15분 집중',
            status: '시작 전',
            completed: false,
          },
          {
            id: 6,
            title: '웃는 표정 유지 연습 (거울 앞 5분)',
            detail: '입 모양, 눈매를 체크하고 어색하지 않은 미소 각도 찾기',
            deadline: '완료: 2025.01',
            status: '완료',
            completed: true,
          },
          {
            id: 7,
            title: '말 속도 0.8배로 줄어 말하기 연습',
            detail: '녹음 후 말 속도 체크, 쉼표 마침표 위치 의식하며 말하기',
            deadline: '완료: 2025.01',
            status: '완료',
            completed: true,
          },
        ],
      },
    ],
    dailyCompletionRate: 54,
  },
};

const MyPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { userInfo, setUserInfo } = useContext(UserContext); // Use context instead of local state
  const { header, frequentMistakes, frequentQuestions, mentalCare, missions: initialMissions } = mockData;
  // const [userInfo, setUserInfo] = useState(initialUserInfo); // Removed local state
  const [missions, setMissions] = useState(initialMissions);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(userInfo); // Initialize with context data

  const handleToggleMission = (categoryId, missionId) => {
    setMissions((prev) => {
      const newCategories = prev.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;

        const newMissions = cat.missions.map((m) =>
          m.id === missionId ? { ...m, completed: !m.completed } : m
        );

        // Update status text (e.g., "3개 중 1개 완료")
        const completedCount = newMissions.filter(m => m.completed).length;
        const totalCount = newMissions.length;

        return {
          ...cat,
          missions: newMissions,
          statusText: `${totalCount}개 중 ${completedCount}개 완료`
        };
      });

      // Update daily completion rate
      // This is a simplified calculation: total completed missions / total missions across all categories
      let totalMissions = 0;
      let totalCompleted = 0;

      newCategories.forEach(cat => {
        cat.missions.forEach(m => {
          totalMissions++;
          if (m.completed) totalCompleted++;
        });
      });

      const newRate = totalMissions > 0 ? Math.round((totalCompleted / totalMissions) * 100) : 0;

      return {
        ...prev,
        categories: newCategories,
        dailyCompletionRate: newRate
      };
    });
  };

  const handleEditClick = () => {
    setEditFormData(userInfo);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditFormData(userInfo);
  };

  const handleSaveClick = () => {
    setUserInfo(editFormData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = (e) => {
    e.stopPropagation();
    setEditFormData((prev) => ({
      ...prev,
      profileImage: null,
    }));
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-grid">
        {/* User Info Section (Full Width) */}
        <section className="card profile-card">
          <div className="profile-summary">
            <div className={`avatar-wrapper ${isEditing ? 'editable' : ''}`} onClick={handleAvatarClick}>
              <Avatar
                name={isEditing ? editFormData.userName : userInfo.userName}
                image={isEditing ? editFormData.profileImage : userInfo.profileImage}
                className="profile-image"
              />
              {isEditing && (
                <div className="avatar-overlay">
                  <Camera size={24} color="white" />
                  {editFormData.profileImage && (
                    <button
                      type="button"
                      className="avatar-delete-btn"
                      onClick={handleImageDelete}
                      title="기본 이미지로 변경"
                    >
                      <Trash2 size={16} color="white" />
                    </button>
                  )}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className="profile-details">
              {isEditing ? (
                <div className="edit-form">
                  <input
                    type="text"
                    name="userName"
                    value={editFormData.userName}
                    onChange={handleInputChange}
                    className="edit-input name-input"
                    placeholder="이름"
                  />
                  <select
                    name="userStatus"
                    value={editFormData.userStatus}
                    onChange={handleInputChange}
                    className="edit-input status-input"
                    placeholder="상태 (예: 취업 준비 중)"
                  >
                    <option value="">상태 선택</option>
                    <option value="취업 준비 중">취업 준비 중</option>
                    <option value="재직 중">재직 중</option>
                    <option value="퇴사">퇴사</option>
                  </select>
                  <textarea
                    name="userDescription"
                    value={editFormData.userDescription}
                    onChange={handleInputChange}
                    className="edit-input description-input"
                    placeholder="자기소개"
                    rows={2}
                  />
                </div>
              ) : (
                <>
                  <h3 className="profile-name">
                    {userInfo.userName}
                    <span className="status-badge">{userInfo.userStatus}</span>
                  </h3>
                  <p className="profile-description">{userInfo.userDescription}</p>
                </>
              )}
            </div>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <div className="action-buttons">
                <button className="btn btn-secondary" onClick={handleCancelClick}>❌ 취소</button>
                <button className="btn btn-primary" onClick={handleSaveClick}>✅ 저장</button>
              </div>
            ) : (
              <button className="btn btn-secondary" onClick={handleEditClick}>✏️ 프로필 수정</button>
            )}
          </div>
          <div className="profile-stats">
            {userInfo.stats.map((stat) => (
              <div className="stat-item" key={stat.id}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-text">
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Left Column */}
        <div className="grid-col-left">
          <section className="card mistakes-card">
            <div className="card-header">
              <h3 className="card-title">자주 하는 실수 TOP 5</h3>
              <button className="btn btn-tertiary" onClick={() => navigate('/feedbacks')}>전체 면접 기록 보기</button>
            </div>
            <p className="card-description">{frequentMistakes.sectionDescription}</p>
            <ul className="mistakes-list">
              {frequentMistakes.mistakes.map((mistake, index) => (
                <li className="mistake-item" key={mistake.id}>
                  <span className="mistake-rank">{index + 1}</span>
                  <span className="mistake-text">{mistake.text}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${mistake.progress}%`, backgroundColor: mistake.color }}
                    ></div>
                  </div>
                  <span className="mistake-count">{mistake.count}회</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="card questions-card">
            <div className="card-header">
              <h3 className="card-title">나에게 자주 나오는 질문</h3>
            </div>
            <ul className="questions-list">
              {frequentQuestions.questions.map((question) => (
                <li className="question-item" key={question.id}>
                  <span className="question-rank">{question.id}</span>
                  <div className="question-content">
                    <p className="question-text">{question.text}</p>
                    <p className="question-tip">{question.tip}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column */}
        <div className="grid-col-right">
          <section className="card mental-care-card">
            <div className="card-header">
              <h3 className="card-title">나에게 가장 효과적인 멘탈 관리법</h3>
            </div>
            <p className="card-description">{mentalCare.sectionDescription}</p>
            <div className="mental-care-methods">
              {mentalCare.methods.map((method) => (
                <div
                  className={`method-item ${method.isTopMethod ? 'top-method' : ''}`}
                  key={method.id}
                >
                  {method.isTopMethod && (
                    <div className="top-method-header">
                      <span>👑 가장 효과적인 방법</span>
                      <span>면접 직전 긴장 완화 기준</span>
                    </div>
                  )}
                  <div className="method-body">
                    <div className="method-name">
                      <span className="method-icon">{method.icon}</span>
                      {method.methodName}
                      <span className="method-rank-badge">{method.badge}</span>
                    </div>
                    <div className="method-effect">
                      효과 <span className="effect-score">{method.effectScore}</span>
                      <span className="star-rating">{'★'.repeat(Math.round(method.effectScore))}{'☆'.repeat(5 - Math.round(method.effectScore))}</span>
                    </div>
                  </div>
                  <p className="method-description">{method.description}</p>
                </div>
              ))}
            </div>
            <div className="recommended-routine">
              <p className="routine-title">✨ 추천 루틴</p>
              <p className="routine-description">{mentalCare.recommendedRoutine.description}</p>
            </div>
          </section>
        </div>

        {/* Mission Section (Full Width) */}
        <section className="card missions-card">
          <div className="card-header">
            <h3 className="card-title">역량 향상 및 보완 미션</h3>
          </div>
          <p className="card-description">{missions.sectionDescription}</p>
          <div className="mission-categories-grid">
            {missions.categories.map((category) => (
              <div className="mission-category" key={category.id}>
                <div className="mission-category-header">
                  <span className="mission-category-icon">{category.icon}</span>
                  <div className="mission-category-title">
                    <h4>{category.categoryName}</h4>
                    <p>{category.categoryDescription}</p>
                  </div>
                  <span className="mission-category-status">{category.statusText}</span>
                </div>
                <ul className="mission-list">
                  {category.missions.map((mission) => (
                    <li
                      key={mission.id}
                      className={`mission-item ${mission.completed ? 'completed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="mission-category-checkbox"
                        id={`mission-${mission.id}`}
                        checked={mission.completed}
                        onChange={() => handleToggleMission(category.id, mission.id)}
                      />
                      <label htmlFor={`mission-${mission.id}`} className="mission-item-content">
                        <span className="mission-title">{mission.title}</span>
                        <span className="mission-detail">{mission.detail}</span>
                        <span className="mission-deadline">{mission.deadline}</span>
                      </label>
                      <span className={`mission-status-tag ${mission.status.replace(/\s+/g, '-').toLowerCase()}`}>{mission.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="missions-footer">
            <div className="daily-progress">
              <label>🧮 미션 완료율</label>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${missions.dailyCompletionRate}%` }}
                ></div>
              </div>
              <span className="progress-percentage">{missions.dailyCompletionRate}%</span>
            </div>
          </div>
        </section>
      </main>
    </div >
  );
};

export default MyPage;