import React from 'react';
import './Avatar.css';

const Avatar = ({ name, image, size = '72px', className = '' }) => {
  const initial = name ? name.charAt(0) : '?';

  return (
    <div
      className={`avatar-container ${className}`}
      style={{ width: size, height: size, fontSize: `calc(${size} / 2)` }}
    >
      {image ? (
        <img src={image} alt={name} className="avatar-image" />
      ) : (
        initial
      )}
    </div>
  );
};

export default Avatar;
