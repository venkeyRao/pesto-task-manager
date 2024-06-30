import React from 'react';
import { Link } from 'react-router-dom';

function Header({ user, onLogout }) {
  return (
    <header className="main-header">
      <div className="header-left">
        <h3>Task Manager using React</h3>
      </div>
      <div className="header-right">
        Welcome {user ? user : 'Guest'},
        <Link onClick={onLogout} className="btn-edit" to="#" style={{ marginLeft: '10px', color: 'white' }}>Logout</Link>
      </div>
    </header>
  );
}

export default Header;
