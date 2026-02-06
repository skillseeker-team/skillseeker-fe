import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase } from 'lucide-react';

function FeedbackListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('interview_records') || '[]');
    setReports(data);
  }, []);

  return (
    <div className="container">
      <div className="title-section">
        <h1>면접 기록 보관함</h1>
        <p>지난 면접의 기록과 분석 리포트를 확인해보세요.</p>
      </div>

      <div className="feedbacks-grid" style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1/-1', color: 'var(--text-muted)' }}>
            <p>아직 기록된 면접이 없습니다.</p>
            <button 
              onClick={() => navigate('/')}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              첫 면접 기록하기
            </button>
          </div>
        ) : (
          reports.map((report) => (
            <div 
              key={report.id} 
              className="card" 
              style={{ 
                cursor: 'pointer', 
                transition: 'transform 0.2s, box-shadow 0.2s',
                padding: '24px'
              }}
              onClick={() => navigate(`/report/${report.id}`)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--card-shadow)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ 
                  fontSize: '0.8rem', 
                  color: 'var(--primary-color)', 
                  fontWeight: '600', 
                  background: '#eef2ff', 
                  padding: '4px 8px', 
                  borderRadius: '4px' 
                }}>
                  {report.date}
                </span>
                <ArrowRight size={18} color="var(--text-muted)" />
              </div>

              <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', fontWeight: '700' }}>{report.company || '회사명 미입력'}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
                <Briefcase size={14} />
                {report.position || '직무 미입력'}
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{color: 'var(--text-muted)'}}>만족도</span>
                <span style={{fontWeight: '600', color: report.satisfaction >= 4 ? 'var(--primary-color)' : '#666'}}>
                  {report.satisfaction}/5
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FeedbackListPage;