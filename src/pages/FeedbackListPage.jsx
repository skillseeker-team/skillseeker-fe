import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase } from 'lucide-react';
import { getInterviews } from '../api/interviewApi';

function FeedbackListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        const data = await getInterviews();
        // API returns { items: [...] }
        setReports(data.items || []);
      } catch (err) {
        console.error('Error fetching interviews:', err);
        setError('면접 기록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) return <div className="container" style={{ textAlign: 'center', paddingTop: '40px' }}>Loading...</div>;
  if (error) return <div className="container" style={{ textAlign: 'center', paddingTop: '40px', color: 'red' }}>{error}</div>;

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
                  {report.interviewDate}
                </span>
                <ArrowRight size={18} color="var(--text-muted)" />
              </div>

              <h3 style={{ fontSize: '1.2rem', margin: '0 0 8px 0', fontWeight: '700' }}>{report.company || '회사명 미입력'}</h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
                <Briefcase size={14} />
                {report.role || '직무 미입력'}
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{color: 'var(--text-muted)'}}>질문 수</span>
                <span style={{fontWeight: '600', color: '#666'}}>
                  {report.questionCount || 0}개
                </span>
                <span style={{color: 'var(--text-muted)'}}>등록일</span>
                <span style={{fontWeight: '600', color: '#666'}}>
                  {new Date(report.createdAt).toLocaleDateString()}
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