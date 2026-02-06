import React, { useEffect, useState } from 'react';
import '../App.css';
import { getMyPageSummary, getMyPageNarrative } from '../api/interviewApi';

const MyPage = () => {
  const [summary, setSummary] = useState(null);
  const [narrative, setNarrative] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summaryData, narrativeData] = await Promise.all([
          getMyPageSummary(),
          getMyPageNarrative()
        ]);
        setSummary(summaryData);
        setNarrative(narrativeData);
      } catch (err) {
        console.error("Failed to fetch MyPage data", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="dashboard-container" style={{textAlign:'center', paddingTop: '40px'}}>데이터 로딩 중...</div>;
  if (error) return <div className="dashboard-container" style={{textAlign:'center', paddingTop: '40px', color: 'red'}}>{error}</div>;

  // Map API data to UI structure
  // User Info (Narrative)
  const userInfo = {
    userName: '김지원', // Placeholder as API doesn't return user name
    userStatus: '취업 준비 중',
    userDescription: narrative?.narratives?.join(' ') || '아직 충분한 데이터가 없습니다.',
    profileImage: '/visuals/profile_placeholder.png',
    stats: [
      { id: 1, value: `${summary?.checklistIncompleteCount || 0}개`, label: '미완료 체크리스트', icon: '📝' },
      { id: 2, value: `${summary?.avgScore?.avg5 || 0}점`, label: '최근 평균 긴장도', icon: '😊' },
      { id: 3, value: 'N/A', label: '피드백 반영률', icon: '⚡' },
    ],
  };

  // Frequent Mistakes
  const frequentMistakes = {
    sectionDescription: '최근 면접 복기 내용을 기반으로 분석된 주요 약점입니다.',
    mistakes: summary?.topMistakes?.map((m, idx) => ({
      id: idx,
      text: m.label,
      count: m.count,
      progress: Math.min(m.count * 20, 100), // Simple scaling
      color: ['#FF6B6B', '#FFD166', '#06D6A0'][idx % 3]
    })) || []
  };

  // Frequent Questions
  const questionsList = [];
  if (summary?.topQuestionsByCategory) {
    Object.entries(summary.topQuestionsByCategory).forEach(([category, questions]) => {
      questions.forEach((q, idx) => {
        questionsList.push({
          id: `${category}-${idx}`,
          text: `[${category}] ${q.questionKey}`, // questionKey might be a code, ideally mapped to text
          tip: `자주 등장하는 ${category} 질문입니다.`,
        });
      });
    });
  }

  // Mental Care (Placeholder / Partial)
  // API avgScore.type could be 'tension'
  const mentalCare = {
    sectionDescription: `최근 5회 면접의 평균 긴장도는 ${summary?.avgScore?.avg5 || 0}점입니다.`,
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
    dailyCompletionRate: 0, 
  };

  return (
    <div className="dashboard-container">
      <main className="dashboard-grid">
        {/* User Info Section (Full Width) */}
        <section className="card profile-card">
          <div className="profile-summary">
            <img src={userInfo.profileImage} alt="Profile" className="profile-image" />
            <div className="profile-details">
              <h3 className="profile-name">
                {userInfo.userName}
                <span className="status-badge">{userInfo.userStatus}</span>
              </h3>
              <p className="profile-description">{userInfo.userDescription}</p>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn btn-secondary">✏️ 프로필 수정</button>
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
              <h3 className="card-title">자주 하는 실수 TOP 3</h3>
              <button className="btn btn-tertiary">전체 보기</button>
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
              <h3 className="card-title">자주 나오는 질문 유형</h3>
            </div>
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
              <button className="btn btn-primary-light">루틴으로 저장</button>
            </div>
          </section>
        </div>

        {/* Mission Section (Full Width) */}
        <section className="card missions-card">
          <div className="card-header">
            <h3 className="card-title">추천 체크리스트 (빈도 상위)</h3>
            <div>
              <button className="btn btn-primary">➕ 미션 추가</button>
            </div>
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
        </section>
      </main>
    </div >
  );
};

export default MyPage;