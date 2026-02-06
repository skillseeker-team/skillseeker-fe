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
        rankType: '분석 중',
        title: '긴장도 분석',
        icon: '📊',
        methodName: '평균 긴장도',
        badge: 'Info',
        effectScore: summary?.avgScore?.avg5 || 0,
        description: '낮을수록 안정적입니다 (1~5점 척도)',
        effectNote: '',
        isTopMethod: true,
      }
    ],
    recommendedRoutine: {
      icon: '💡',
      description: '긴장도가 높다면 호흡 조절과 가벼운 산책을 시도해보세요.',
    },
  };

  // Missions (Placeholder using checklistTop)
  const missions = {
    sectionDescription: '자주 등장하는 체크리스트 템플릿입니다.',
    categories: [
      {
        id: 1,
        icon: '📈',
        categoryName: '추천 체크리스트',
        statusText: `상위 ${summary?.checklistTop?.length || 0}개`,
        categoryDescription: '빈도 높은 개선 포인트',
        missions: summary?.checklistTop?.map((item, idx) => ({
          id: idx,
          title: item.checklistId,
          detail: `${item.count}회 추천됨`,
          deadline: '상시',
          status: '권장',
          completed: false,
        })) || [],
      }
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
              {frequentMistakes.mistakes.length > 0 ? frequentMistakes.mistakes.map((mistake, index) => (
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
              )) : <li className="mistake-item">데이터가 부족합니다.</li>}
            </ul>
          </section>

          <section className="card questions-card">
            <div className="card-header">
              <h3 className="card-title">나에게 자주 나오는 질문</h3>
              지             </div>
            <ul className="questions-list">
              {questionsList.length > 0 ? questionsList.slice(0, 5).map((question) => (
                <li className="question-item" key={question.id}>
                  <div className="question-content">
                    <p className="question-text">{question.text}</p>
                    <p className="question-tip">{question.tip}</p>
                  </div>
                </li>
              )) : <li className="question-item">데이터가 부족합니다.</li>}
            </ul>
          </section>
        </div>

        {/* Right Column */}
        <div className="grid-col-right">
          <section className="card mental-care-card">
            <div className="card-header">
              <h3 className="card-title">멘탈 관리 분석</h3>
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
                      <span>👑 분석 요약</span>
                    </div>
                  )}
                  <div className="method-body">
                    <div className="method-name">
                      <span className="method-icon">{method.icon}</span>
                      {method.methodName}
                      <span className="method-rank-badge">{method.badge}</span>
                    </div>
                    <div className="method-effect">
                      점수 <span className="effect-score">{method.effectScore}</span>
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
                  {category.missions.length > 0 ? category.missions.map((mission) => (
                    <li
                      key={mission.id}
                      className={`mission-item ${mission.completed ? 'completed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="mission-category-checkbox"
                        id={`mission-${mission.id}`}
                        checked={mission.completed}
                        readOnly // Read-only for summary view
                      />
                      <label htmlFor={`mission-${mission.id}`} className="mission-item-content">
                        <span className="mission-title">{mission.title}</span>
                        <span className="mission-detail">{mission.detail}</span>
                        <span className="mission-deadline">{mission.deadline}</span>
                      </label>
                      <span className={`mission-status-tag ${mission.status}`}>{mission.status}</span>
                    </li>
                  )) : <li>추천 데이터가 없습니다.</li>}
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