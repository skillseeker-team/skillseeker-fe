import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Sparkles, Plus, Send, User, ChevronDown, Activity, Heart, Music, Pill, Wind, Moon } from 'lucide-react';
import './App.css';

function App() {
  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      company: '',
      position: '',
      atmosphere: 3,
      questions: [{ question: '', answer: '', memo: '' }],
      satisfaction: 3,
      review: '',
      mentalCare: [],
      tension: 3
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions"
  });

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);
    alert("기록이 완료되었습니다! 콘솔에서 데이터를 확인하세요.");
  };

  const mentalOptions = [
    { id: 'breath', label: '호흡 조절', icon: <Wind size={16} /> },
    { id: 'meds', label: '약물 복용', icon: <Pill size={16} /> },
    { id: 'mind', label: '마인드 컨트롤', icon: <Heart size={16} /> },
    { id: 'sleep', label: '수면 관리', icon: <Moon size={16} /> },
    { id: 'music', label: '음악 감상', icon: <Music size={16} /> },
  ];

  const currentMental = watch('mentalCare');

  const toggleMental = (id) => {
    const newVal = currentMental.includes(id) 
      ? currentMental.filter(item => item !== id)
      : [...currentMental, id];
    setValue('mentalCare', newVal);
  };

  return (
    <div className="min-h-screen">
      <header className="header">
        <div className="logo">
          <div style={{ background: '#6345ff', padding: '4px', borderRadius: '4px' }}>
            <Activity color="white" size={20} />
          </div>
          MindView
        </div>
        <nav className="nav">
          <a href="#" className="nav-item">피드백</a>
          <a href="#" className="nav-item">기업 공고</a>
          <a href="#" className="nav-item">마이페이지</a>
          <div className="profile-img"></div>
        </nav>
      </header>

      <main className="container">
        <div className="title-section">
          <h1>오늘의 면접 기록하기</h1>
          <p>면접의 생생한 기억이 사라지기 전에 5분만 투자해보세요.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card">
          {/* Section 1: 기본 정보 */}
          <section className="section-group">
            <div className="section-title">
              <span className="section-number">1</span>
              기본 정보
            </div>
            
            <div className="form-row">
              <div className="input-group">
                <label>면접 날짜</label>
                <input type="date" {...register('date')} />
              </div>
              <div className="input-group">
                <label>회사명</label>
                <input type="text" placeholder="예: 마인드코퍼레이션" {...register('company')} />
              </div>
            </div>
            
            <div className="input-group" style={{ marginBottom: '24px' }}>
              <label>지원 직무</label>
              <input type="text" placeholder="예: 서비스 기획자" {...register('position')} />
            </div>

            <div className="input-group">
              <label>면접 분위기 <span style={{ color: 'var(--primary-color)' }}>보통 (3)</span></label>
              <div className="scale-container">
                {[1, 2, 3, 4, 5].map(val => (
                  <button 
                    key={val} 
                    type="button"
                    className={`scale-btn ${watch('atmosphere') === val ? 'active' : ''}`}
                    onClick={() => setValue('atmosphere', val)}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="scale-labels">
                <span>경직됨</span>
                <span>편안함</span>
              </div>
            </div>
          </section>

          {/* Section 2: 면접 내용 */}
          <section className="section-group">
            <div className="section-title">
              <span className="section-number">2</span>
              면접 내용
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              면접 질문 및 상세 메모 <span style={{ float: 'right' }}>질문별로 정리해보세요</span>
            </p>

            {fields.map((field, index) => (
              <div key={field.id} className="question-card">
                <div className="question-header">
                  <span className="q-label">Q{index + 1}</span>
                  <ChevronDown size={18} color="var(--text-muted)" />
                </div>
                
                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label>질문</label>
                  <input 
                    type="text" 
                    placeholder="예: 자기소개와 지원 동기를 말씀해 주세요." 
                    {...register(`questions.${index}.question`)}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: '16px' }}>
                  <label>나의 답변</label>
                  <textarea 
                    placeholder="당시 어떻게 답변했는지 최대한 구체적으로 적어보세요." 
                    rows="3"
                    {...register(`questions.${index}.answer`)}
                  />
                </div>

                <div className="input-group">
                  <label>메모 (선택)</label>
                  <input 
                    type="text" 
                    placeholder="면접관 반응, 아쉬운 점 등을 적어보세요." 
                    {...register(`questions.${index}.memo`)}
                  />
                </div>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} style={{ marginTop: '10px', fontSize: '0.7rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>삭제</button>
                )}
              </div>
            ))}

            <button type="button" className="add-btn" onClick={() => append({ question: '', answer: '', memo: '' })}>
              <Plus size={16} /> 질문 추가하기
            </button>

            <div className="input-group" style={{ marginTop: '24px' }}>
              <label>내 답변 만족도 <span style={{ color: 'var(--primary-color)' }}>충분히 답변함 (4)</span></label>
              <div className="scale-container">
                {[1, 2, 3, 4, 5].map(val => (
                  <button 
                    key={val} 
                    type="button"
                    className={`scale-btn ${watch('satisfaction') === val ? 'active' : ''}`}
                    onClick={() => setValue('satisfaction', val)}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="scale-labels">
                <span>답변 못함</span>
                <span>충분히 답변함</span>
              </div>
            </div>

            <div className="input-group" style={{ marginTop: '24px' }}>
              <label>한 줄 회고 (선택)</label>
              <input type="text" placeholder="오늘 면접을 한 마디로 정의한다면?" {...register('review')} />
            </div>
          </section>

          {/* Section 3: 컨디션 및 멘탈 케어 */}
          <section className="section-group">
            <div className="section-title">
              <span className="section-number">3</span>
              컨디션 및 멘탈 케어
            </div>

            <div className="input-group">
              <label>컨디션 조절 방법 (중복 선택 가능)</label>
              <div className="chip-container">
                {mentalOptions.map(opt => (
                  <div 
                    key={opt.id} 
                    className={`chip ${currentMental.includes(opt.id) ? 'active' : ''}`}
                    onClick={() => toggleMental(opt.id)}
                  >
                    {opt.icon}
                    {opt.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="input-group" style={{ marginTop: '32px' }}>
              <label>긴장도 변화 <span style={{ color: 'var(--primary-color)' }}>약간 완화됨 (4)</span></label>
              <div className="scale-container">
                {[1, 2, 3, 4, 5].map(val => (
                  <button 
                    key={val} 
                    type="button"
                    className={`scale-btn ${watch('tension') === val ? 'active' : ''}`}
                    onClick={() => setValue('tension', val)}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="scale-labels">
                <span>오히려 긴장됨</span>
                <span>크게 완화됨</span>
              </div>
            </div>
          </section>

          <button type="submit" className="submit-btn">
            <Sparkles size={18} /> 저장 및 분석하기
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '16px' }}>
            분석 리포트는 마이페이지에서 다시 확인할 수 있습니다.
          </p>
        </form>
      </main>
    </div>
  );
}

export default App;