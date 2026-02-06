import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Printer, ChevronLeft, Zap, Target, CheckCircle, AlertCircle, Wind, Pill, Heart, Moon, Music, Smile, Frown, Meh, Award, Activity } from 'lucide-react';
import { getInterviewById, getFeedback, generateFeedback, updateChecklist } from '../api/interviewApi';

function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Get Interview Data
        const interviewData = await getInterviewById(id);
        setReport(interviewData);

        // 2. Get or Generate Feedback
        // First try to get existing feedback
        try {
            const feedbackData = await getFeedback(id);
            setFeedback(feedbackData);
        } catch (e) {
            // If 404 or empty, try generating
            console.log("Feedback not found, generating...");
            try {
                const newFeedback = await generateFeedback(id);
                setFeedback(newFeedback);
            } catch (genErr) {
                console.error("Failed to generate feedback", genErr);
                // Fallback to null feedback, UI can show partial data or static analysis
            }
        }
      } catch (err) {
        console.error("Error loading report:", err);
        setError("리포트를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChecklistToggle = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE'; // Note: API might only support setting to DONE per spec (PATCH body: {"status":"DONE"}), but let's assume toggle or just DONE for now. 
    // Spec says: PATCH /api/checklists/{itemId} with {"status":"DONE"}. It doesn't explicitly mention untoggling, but typically we want to be able to.
    // However, error spec says "400 : 이미 DONE인 항목" might imply one-way. 
    // Let's assume for MVP we only mark as DONE. If user wants to undo, we might need to check if API supports 'TODO'. 
    // Since spec only shows "status":"DONE" in request example, I'll implement marking as DONE. 
    
    if (currentStatus === 'DONE') return; // If already done, maybe do nothing or try to untoggle if API supports it. Let's assume one-way for now based on spec "400: 이미 DONE인 항목".

    try {
      // Optimistic update
      setFeedback(prev => ({
        ...prev,
        checklistItems: prev.checklistItems.map(item => 
          (item.id === itemId) ? { ...item, status: 'DONE' } : item
        )
      }));

      await updateChecklist(itemId, 'DONE');
    } catch (err) {
      console.error("Failed to update checklist", err);
      // Revert on failure
      setFeedback(prev => ({
        ...prev,
        checklistItems: prev.checklistItems.map(item => 
          (item.id === itemId) ? { ...item, status: currentStatus } : item
        )
      }));
      alert("체크리스트 업데이트 실패");
    }
  };

  if (loading) return <div className="container" style={{textAlign: 'center', paddingTop: '40px'}}>분석 중입니다...</div>;
  if (error) return <div className="container" style={{textAlign: 'center', paddingTop: '40px', color: 'red'}}>{error}<br/><button onClick={() => navigate('/feedbacks')}>목록으로</button></div>;
  if (!report) return null;

  // Adapt API data to UI
  const satisfactionScore = report.atmosphereScore || 3; 

  const isGood = satisfactionScore >= 4;
  const isBad = satisfactionScore <= 2;
  
  const summaryText = feedback?.overallSummary?.join(' ') || 
    (isGood 
    ? "전반적으로 긍정적인 분위기에서 면접이 진행되었습니다. (AI 분석 대기 중)"
    : "아쉬움이 남는 면접이었지만 개선점을 찾을 수 있습니다. (AI 분석 대기 중)");

  const improvement = feedback?.improvementOne || (isBad
    ? "긴장감 관리 및 답변 구조화 필요"
    : "경험을 더 구체적인 수치로 증명하기");
    
  const strategy = feedback?.checklistItems?.[0]?.renderedText || 
    (isBad
    ? "모의 면접을 통해 답변 인출 속도를 높이는 훈련이 필요합니다."
    : "STAR 기법을 적용해 답변 구조를 재점검하세요.");

  const mentalMap = {
    breath: { label: '호흡 조절', icon: <Wind size={16} /> },
    meds: { label: '약물 복용', icon: <Pill size={16} /> },
    mind: { label: '마인드 컨트롤', icon: <Heart size={16} /> },
    sleep: { label: '수면 관리', icon: <Moon size={16} /> },
    music: { label: '음악 감상', icon: <Music size={16} /> },
  };

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/feedbacks')}
          style={{ 
            background: 'none', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            color: 'var(--text-muted)', 
            cursor: 'pointer', 
            marginBottom: '16px',
            padding: 0
          }}
        >
          <ChevronLeft size={16} /> 목록으로 돌아가기
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge">{report.interviewDate}</span>
              <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>{report.role}</span>
            </div>
            <h1 style={{ fontSize: '2rem', margin: '0' }}>{report.company} 면접 분석 리포트</h1>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline"><Share2 size={16} /> 공유하기</button>
            <button className="btn-outline"><Printer size={16} /> PDF 저장</button>
          </div>
        </div>
      </div>

      {/* 1. Hero Summary */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', alignItems: 'center', background: 'linear-gradient(to right, #ffffff, #f8faff)' }}>
        <div style={{ textAlign: 'center', borderRight: '1px solid #eee', paddingRight: '32px' }}>
          <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 16px' }}>
            {/* Simple Circle Chart Mockup */}
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
              <path 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                fill="none" 
                stroke="#6345ff" 
                strokeWidth="3" 
                strokeDasharray={`${satisfactionScore * 20}, 100`} 
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>분위기 점수</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#6345ff' }}>{satisfactionScore * 20}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', color: '#555' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {report.atmosphereScore >= 4 ? <Smile size={16} color="#10b981" /> : report.atmosphereScore <= 2 ? <Frown size={16} color="#ef4444" /> : <Meh size={16} color="#f59e0b" />}
              분위기 {report.atmosphereScore}/5
            </span>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, color: '#6345ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={18} /> 전반적 분석 요약
            </h3>
            <span style={{ fontSize: '0.8rem', background: '#eef2ff', color: '#6345ff', padding: '4px 8px', borderRadius: '4px' }}>AI 자동 분석</span>
          </div>
          <p style={{ lineHeight: '1.6', color: '#333', margin: 0 }}>
            {summaryText}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', margin: '24px 0' }}>
        {/* 2. Main Strategy (Action Plan) */}
        <div className="card" style={{ border: '1px solid #e0e7ff', background: '#fdfdff' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="#ef4444" />
            다음 면접을 위한 핵심 전략
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} /> 개선이 필요한 부분
            </div>
            <div style={{ padding: '16px', background: '#fff1f2', borderRadius: '8px', borderLeft: '4px solid #ef4444', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {improvement}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={14} /> 구체적 실행 전략
            </div>
            <div style={{ padding: '16px', background: '#eff6ff', borderRadius: '8px', borderLeft: '4px solid #2563eb', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {strategy}
            </div>
          </div>
        </div>

        {/* 3. Condition & Mental */}
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="#10b981" />
            컨디션 조절 효과
          </h3>
          
          <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
            면접 전후로 시도한 컨디션 조절 활동에 대한 기록입니다.
            <br />
            나에게 가장 잘 맞는 방법을 찾아보세요.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
            {/* Note: mentalCare data is NOT in the API spec yet. Showing placeholder or static data if not present. 
                If we want to persist this, backend needs update. 
                For now, we'll hide if empty or show a placeholder message. */}
            
            <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '0.9rem', background: '#f9fafb', borderRadius: '8px' }}>
              (API 미지원) 컨디션 관리 기록 기능 준비 중입니다.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Missions & Checklist */}
      <div className="card" style={{ background: '#f8faff', border: '1px solid #eef2ff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} color="#6345ff" />
            실행 미션 체크리스트
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>다음 면접 전까지 완료해보세요</span>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {feedback?.checklistItems ? (
             feedback.checklistItems.map(item => (
                <div className="checklist-item" key={item.id || item.checklistId}>
                    <input 
                      type="checkbox" 
                      id={`chk-${item.id}`} 
                      checked={item.status === 'DONE'} 
                      onChange={() => handleChecklistToggle(item.id, item.status)}
                    />
                    <label htmlFor={`chk-${item.id}`}>
                    <span className="tag">Check</span>
                    <div>
                        <strong>{item.renderedText}</strong>
                    </div>
                    </label>
                </div>
             ))
          ) : (
            <>
                {/* Fallback Static Checklist */}
                <div className="checklist-item">
                    <input type="checkbox" id="m1" />
                    <label htmlFor="m1">
                    <span className="tag patch">Patch</span>
                    <div>
                        <strong>(분석 대기 중) 답변 스크립트 정리하기</strong>
                    </div>
                    </label>
                </div>
            </>
          )}
        </div>
      </div>
      
      {/* Styles for this page only */}
      <style>{`
        .btn-outline {
          background: white;
          border: 1px solid #ddd;
          padding: 8px 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #555;
        }
        .btn-outline:hover {
          background: #f9fafb;
        }
        .badge {
          background: #eef2ff;
          color: #6345ff;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .checklist-item {
          background: white;
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: transform 0.2s;
        }
        .checklist-item:hover {
          transform: translateY(-1px);
        }
        .checklist-item input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #6345ff;
          cursor: pointer;
        }
        .checklist-item label {
          flex: 1;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          cursor: pointer;
        }
        .checklist-item label div strong {
          display: block;
          font-size: 1rem;
          color: #333;
          margin-bottom: 4px;
        }
        .checklist-item label div p {
          margin: 0;
          font-size: 0.85rem;
          color: #666;
        }
        .tag {
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 4px;
          background: #f3f4f6;
          color: #4b5563;
          font-weight: 600;
          white-space: nowrap;
          margin-top: 2px;
        }
        .tag.patch { background: #fee2e2; color: #b91c1c; }
        .tag.mental { background: #d1fae5; color: #059669; }
        .time {
          font-size: 0.8rem;
          color: #9ca3af;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

export default ReportPage;