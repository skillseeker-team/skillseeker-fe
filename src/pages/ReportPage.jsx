import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, Printer, ChevronLeft, Zap, Target, CheckCircle, AlertCircle, Wind, Pill, Heart, Moon, Music, Smile, Frown, Meh, Award, Activity } from 'lucide-react';

function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const reports = JSON.parse(localStorage.getItem('interview_records') || '[]');
    const found = reports.find(r => r.id === id);
    if (found) {
      setReport(found);
    } else {
      alert("리포트를 찾을 수 없습니다.");
      navigate('/feedbacks');
    }
  }, [id, navigate]);

  if (!report) return <div className="container">Loading...</div>;

  // Mock Analysis Logic (Simple Rules based on input)
  const isGood = report.satisfaction >= 4;
  const isBad = report.satisfaction <= 2;
  
  const summaryText = isGood 
    ? "전반적으로 자신감 있게 답변했으며, 준비한 역량을 충분히 보여준 면접이었습니다. 특히 직무 관련 경험을 설명할 때 구체적인 성과를 언급한 점이 돋보였습니다. 다만 일부 예상치 못한 질문에서 잠시 당황하는 모습이 보였으나, 빠르게 평정심을 되찾고 논리적으로 대응했습니다."
    : isBad
      ? "긴장감으로 인해 준비한 내용을 충분히 전달하지 못한 아쉬움이 남습니다. 핵심 질문에 대해 답변이 다소 짧게 끝나는 경향이 있었으며, 두괄식 표현이 부족하여 메시지 전달력이 약해질 수 있었습니다. 하지만 태도 면에서는 끝까지 경청하는 좋은 자세를 유지했습니다."
      : "무난하게 진행된 면접이었으나, 답변의 구체성이 다소 부족했습니다. 질문의 의도는 잘 파악했으나, 이를 뒷받침할 경험적 근거를 제시하는 데 시간이 걸렸습니다. 분위기는 편안했으나, 강렬한 인상을 남기기 위한 '한 방'이 필요한 시점입니다.";

  const improvement = isBad
    ? "답변이 막힐 때 '음...', '어...' 하는 습관 줄이기"
    : "성과를 수치로 표현하여 신뢰도 높이기";
    
  const strategy = isBad
    ? "모의 면접을 통해 답변 인출 속도를 높이는 훈련이 필요합니다."
    : "STAR 기법(Situation, Task, Action, Result)을 적용해 답변 구조를 재점검하세요.";

  const mentalMap = {
    breath: { label: '호흡 조절', icon: <Wind size={16} /> },
    meds: { label: '약물 복용', icon: <Pill size={16} /> },
    mind: { label: '마인드 컨트롤', icon: <Heart size={16} /> },
    sleep: { label: '수면 관리', icon: <Moon size={16} /> },
    music: { label: '음악 감상', icon: <Music size={16} /> },
  };

  return (
    <div className="container" style={{ maxWidth: '1000px' }}>
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
              <span className="badge">{report.date}</span>
              <span className="badge" style={{ background: '#f3f4f6', color: '#374151' }}>{report.position}</span>
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
                strokeDasharray={`${report.satisfaction * 20}, 100`} 
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>만족도</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#6345ff' }}>{report.satisfaction * 20}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', color: '#555' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {report.atmosphere >= 4 ? <Smile size={16} color="#10b981" /> : report.atmosphere <= 2 ? <Frown size={16} color="#ef4444" /> : <Meh size={16} color="#f59e0b" />}
              분위기 {report.atmosphere}/5
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
            {report.mentalCare && report.mentalCare.length > 0 ? (
              report.mentalCare.map(key => {
                const info = mentalMap[key] || { label: key, icon: <Activity size={16} /> };
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f9fafb', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: 'white', padding: '8px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        {info.icon}
                      </div>
                      <span style={{ fontWeight: '600', color: '#374151' }}>{info.label}</span>
                    </div>
                    {/* Mock Effect Tag based on tension */}
                    <span style={{ fontSize: '0.8rem', padding: '4px 8px', borderRadius: '12px', background: report.tension >= 4 ? '#d1fae5' : '#fee2e2', color: report.tension >= 4 ? '#059669' : '#b91c1c' }}>
                      {report.tension >= 4 ? '효과 좋음' : '효과 미미'}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '0.9rem', background: '#f9fafb', borderRadius: '8px' }}>
                기록된 컨디션 관리 활동이 없습니다.
              </div>
            )}
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
          {/* Patch Mission (Fixed) */}
          <div className="checklist-item">
            <input type="checkbox" id="m1" />
            <label htmlFor="m1">
              <span className="tag patch">Patch</span>
              <div>
                <strong>'공백기' 질문에 대한 답변 스크립트 작성하기</strong>
                <p>2~3개의 버전으로 작성 후, 가장 자연스러운 버전을 선택해 말로 5회 이상 반복 연습합니다.</p>
              </div>
            </label>
            <span className="time">약 25분</span>
          </div>

          {/* Mental Mission (Fixed) */}
          <div className="checklist-item">
            <input type="checkbox" id="m2" />
            <label htmlFor="m2">
              <span className="tag mental">Mental</span>
              <div>
                <strong>면접 후 스스로에게 칭찬 3가지 적어보기</strong>
                <p>결과와 상관없이 오늘 내가 잘한 점을 찾아 긍정적인 마무리를 짓습니다.</p>
              </div>
            </label>
            <span className="time">약 10분</span>
          </div>

           {/* Additional Checklist */}
           <div className="checklist-item">
            <input type="checkbox" id="m3" />
            <label htmlFor="m3">
              <span className="tag">준비</span>
              <div>
                <strong>자기소개 60초/90초 버전으로 구조화하기</strong>
                <p>"결론 → 핵심 경험 2개 → 현재 강점" 순으로 스크립트를 만들고, 녹음 후 말 속도를 점검합니다.</p>
              </div>
            </label>
            <span className="time">약 30분</span>
          </div>
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