import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';
import '../../styles/global.css'; // Global styles for basic layout and typography

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="app-logo">Skillseeker</Link>
      </div>
      <div className="header-right">
        {/* Placeholder for notification icon */}
        <span className="notification-icon">🔔</span>
        {/* Placeholder for profile image */}
        <Avatar
          name="김지원"
          image="/visuals/profile_placeholder.png" // Using the same placeholder as MyPage for consistency
          size="32px"
          className="profile-thumbnail"
        />
      </div>
    </header>
  );
};

export default Header;