import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyPage from './pages/MyPage'; // Gemini가 만들어준 파일 경로
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 기본 경로는 간단한 환영 메시지 */}
          <Route path="/" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>Skillseeker 프로젝트에 오신 걸 환영합니다!</h1>
              <p>마이페이지를 확인하려면 주소 뒤에 <b>/mypage</b>를 입력하세요.</p>
              <a href="/mypage" style={{ color: '#007bff', textDecoration: 'underline' }}>마이페이지로 이동하기</a>
            </div>
          } />

          {/* 마이페이지 경로 연결 */}
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;