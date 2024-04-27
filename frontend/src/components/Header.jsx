import React from 'react';
import { Link } from 'react-router-dom';

function Header({ user, onLogout }) {
  return (
    <header>
      <div>
        Task Manager using React
      </div>
      <div>
        Welcome {user ? user : 'Guest'}, 
        <Link onClick={onLogout} className="btn-edit" href="#" style={{ marginLeft: '10px', color: 'white'}}>Logout</Link>
      </div>
      <hr />
    </header>
  );
}

export default Header;