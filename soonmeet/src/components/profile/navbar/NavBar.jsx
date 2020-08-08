import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import NavBarAvatar from '../../home/navbar/NavBarAvatar';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import history from '../../../history';

// eslint-disable-next-line
import style from '../../../css/home-navbar.css';

const NavBar = props => {
  const iconButtonStyle = {
    color: 'white'
  };
  const iconButtonSize = 'medium';

  return (
    <div>
      <nav
        className="navbar navbar-dark navbar-expand fixed-top text-white bg-dark shadow navigation-clean-button"
        style={{ padding: 2 }}
      >
        <div className="container">
          <Link className="navbar-brand" id="brand" to="/">
            SoonMeet
          </Link>
          <button
            data-toggle="collapse"
            className="navbar-toggler"
            data-target="#navcol-1"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navcol-1">
            <span
              className="navbar-text"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              <IconButton
                onClick={() => {
                  history.push('/home');
                }}
                style={{ marginRight: 10 }}
              >
                <ArrowBackIcon
                  size={iconButtonSize}
                  style={iconButtonStyle}
                />
              </IconButton>
            </span>
            <ul className="nav navbar-nav mr-auto">
            </ul>
            <span className="navbar-text actions">
              <span>
                <NavBarAvatar
                  username={props.username}
                  first_name={props.first_name}
                  last_name={props.last_name}
                />
              </span>
              <span
                id="user-username"
                style={{
                  verticalAlign: 'middle',
                  color: 'rgba(255,255,255,0.75)',
                  marginLeft: '0', // 10px
                  fontSize: '0' // 1rem
                }}
              >
                {props.username !== null ? props.username : 'unknown'}
              </span>
            </span>
          </div>
        </div>
      </nav>
    </div>
  );
};

const mapStateToProps = state => {
  const { username, first_name, last_name } = state.loggedInUserInfoReducer;
  return { username, first_name, last_name };
};

export default connect(
  mapStateToProps,
  {}
)(NavBar);
