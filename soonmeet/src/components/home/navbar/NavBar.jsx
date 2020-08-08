import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import LeftRightNav from '../../utils/LeftRightNav';

import NavBarFriends from './NavBarFriends';
import NavBarAvatar from './NavBarAvatar';
import NavBarCalendar from './NavBarCalendar';
import {
  calendarPreviousWeek,
  calendarNextWeek,
  calendarCurrentWeek
} from '../../../actions';

// eslint-disable-next-line
import style from '../../../css/home-navbar.css';
import OrganizeMeetingDialog from './OrganizeMeetingDialog';

/**
 * Returns string for usage on NavBar for displaying current's week month and year.
 * @param monday (Date object)
 * @param sunday (Date object)
 * @returns {*}
 */
const datesToNavbarMonth = (monday, sunday) => {
  const MONTHS = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  };

  let startMonth = MONTHS[monday.getMonth()];
  let endMonth = MONTHS[sunday.getMonth()];
  let startYear = monday.getFullYear();
  let endYear = sunday.getFullYear();

  let navBarInfo = startMonth;
  if (startMonth !== endMonth) {
    navBarInfo += '/' + endMonth;
  }
  navBarInfo += ' ' + startYear;
  if (startYear !== endYear) {
    navBarInfo += '/' + endYear;
  }

  return navBarInfo;
};

/**
 * Navigation bar shown after log-in.
 * @param props
 * @returns {*}
 * @constructor
 */
const NavBar = props => {
  const [organizeDialogOpen, setOrganizeDialogOpen] = useState(false);

  const iconButtonStyle = {
    color: 'white'
  };
  const iconButtonSize = 'medium';

  return (
    <div>
      <nav
        className="navbar navbar-dark navbar-expand-lg fixed-top text-white bg-dark shadow navigation-clean-button"
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
              {datesToNavbarMonth(
                new Date(props.monday),
                new Date(props.sunday)
              )}
            </span>
            <ul className="nav navbar-nav mr-auto">
              <li className="nav-item" role="presentation" />
            </ul>
            <span className="navbar-text actions">
              <button
                className="btn btn-primary"
                style={{ marginRight: '10px' }}
                type="button"
                onClick={() => setOrganizeDialogOpen(true)}
              >
                <strong>Let's meet!</strong>
              </button>
              <LeftRightNav
                onLeftClick={props.calendarPreviousWeek}
                onRightClick={props.calendarNextWeek}
                color="white"
                size={iconButtonSize}
              />
              <button
                className="btn btn-primary btn-sm"
                style={{ marginLeft: '5px' }}
                type="button"
                onClick={props.calendarCurrentWeek}
              >
                Today
              </button>
              <NavBarCalendar
                size={iconButtonSize}
                style={{ ...iconButtonStyle, marginLeft: '20px' }}
              />
              <NavBarFriends size={iconButtonSize} style={iconButtonStyle} />
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
      <OrganizeMeetingDialog
        open={organizeDialogOpen}
        onClose={() => setOrganizeDialogOpen(false)}
      />
    </div>
  );
};

const mapStateToProps = state => {
  const { username, first_name, last_name } = state.loggedInUserInfoReducer;
  const { monday, sunday } = state.calendarReducer;
  return { username, first_name, last_name, monday, sunday };
};

export default connect(
  mapStateToProps,
  { calendarNextWeek, calendarPreviousWeek, calendarCurrentWeek }
)(NavBar);
