import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    userName: '김지원',
    userStatus: '취업 준비 중',
    userDescription: '최근 6개월 동안의 면접 복기를 기반으로 한 개인 맞춤 인사이트입니다.',
    profileImage: null,
    stats: [
      { id: 1, value: '18회', label: '누적 면접 횟수', icon: '📝' },
      { id: 2, value: '1.8일', label: '멘탈 회복 평균', icon: '😊' },
      { id: 3, value: '76%', label: '피드백 반영률', icon: '⚡' },
    ],
  });

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};
