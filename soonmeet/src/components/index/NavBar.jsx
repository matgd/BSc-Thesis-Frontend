import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div>
      <nav className="navbar navbar-dark navbar-expand-md fixed-top text-white bg-dark shadow navigation-clean-button"
           style={{padding: '2px'}}>
        <div className="container">
          <Link className="navbar-brand" to="/">SoonMeet</Link>
          <button data-toggle="collapse" className="navbar-toggler" data-target="#navcol-1">
            <span className="sr-only">
              Toggle navigation
            </span>
            <span className="navbar-toggler-icon">
            </span>
          </button>
          <div className="collapse navbar-collapse" id="navcol-1">
            <ul className="nav navbar-nav mr-auto">
              <li className="nav-item" role="presentation">
                <Link className="nav-link" to="/faq">F.A.Q.</Link>
              </li>
              <li className="nav-item" role="presentation">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
            </ul>
            <span className="navbar-text actions">
              <Link className="btn btn-primary" role="button" to="/login">Sign In</Link>
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;

