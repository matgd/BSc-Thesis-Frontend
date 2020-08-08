import React from 'react';
import { connect } from 'react-redux';

import Menu from '@material-ui/core/Menu';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Badge from '@material-ui/core/Badge';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { MuiThemeProvider } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import EventIcon from '@material-ui/icons/Event';
import muiTheme from '../../../const/muiTheme';
import {
  calendarSelectedDayWeek,
  patchMeetingInvitation
} from '../../../actions';
import ListItem from '@material-ui/core/ListItem';
import { PRIMARY_COLOR } from '../../../const/colors';
import ListItemText from '@material-ui/core/ListItemText';
import DoneIcon from '@material-ui/icons/Done';
import Divider from '@material-ui/core/Divider';
import { timeStartEndString } from '../../utils/dateTimeUtils';
import { ACCEPTED, REJECTED } from '../../../const/attendanceStatus';

const menuItemsDense = true;

const NavBarCalendar = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(Date.today());
  const weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  function handleDateChange(date) {
    setSelectedDate(date);
    if (date instanceof Date && isFinite(date)) {
      props.calendarSelectedDayWeek(date.toJSON());
      document
        .getElementById(`weekday-${weekdays[date.getDay()]}`)
        .scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  /**
   * Sets anchor to IconButton for Menu.
   * @param event
   */
  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  /**
   * Clears anchor element for Menu.
   */
  function handleClose() {
    setAnchorEl(null);
  }

  const rejectMeetingInvite = inviteId => {
    props.patchMeetingInvitation(props.authToken, inviteId, REJECTED);
  };

  const acceptMeetingInvite = inviteId => {
    props.patchMeetingInvitation(props.authToken, inviteId, ACCEPTED);
  };

  const menuItemStartEndDate = (start, end) => {
    let startDateString = new Date(start).toDateString();
    let endDateString = new Date(end).toDateString();

    if (startDateString === endDateString) return startDateString;

    return `${startDateString} - ${endDateString}`;
  };

  const MeetingInviteMenuItem = React.forwardRef((props, ref) => {
    return (
      <>
        <ListItem dense={menuItemsDense} ref={ref}>
          <IconButton
            size="small"
            style={{ color: PRIMARY_COLOR }}
            onClick={() => acceptMeetingInvite(props.id)}
          >
            <DoneIcon />
          </IconButton>
          <IconButton
            size="small"
            style={{ marginLeft: '5px', marginRight: '15px', color: 'red' }}
            onClick={() => rejectMeetingInvite(props.id)}
          >
            <ClearIcon />
          </IconButton>
          <ListItemText
            primary={menuItemStartEndDate(props.start, props.end)}
            secondary={timeStartEndString(
              new Date(props.start),
              new Date(props.end)
            )}
          />
          <IconButton
            size="small"
            style={{ marginLeft: '10px' }}
            onClick={() => handleDateChange(new Date(props.start))}
          >
            <EventIcon />
          </IconButton>
        </ListItem>
      </>
    );
  });

  const renderInvitesList = () => {
    return props.pendingInvites.map(invite => {
      return (
        <MeetingInviteMenuItem
          key={invite.id}
          id={invite.id}
          start={invite.event_date__start_date}
          end={invite.event_date__end_date}
          authToken={props.authToken}
        />
      );
    });
  };

  return (
    <>
      <MuiThemeProvider theme={muiTheme}>
        <Badge
          badgeContent={props.invitesCount}
          color="primary"
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          overlap="circle"
        >
          <IconButton
            onClick={handleClick}
            size={props.size}
            style={props.style}
            aria-label="calendar"
          >
            <CalendarTodayIcon />
          </IconButton>
        </Badge>
        <Menu
          id="calendar-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          getContentAnchorEl={null}

          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          {renderInvitesList()}
          {props.invitesCount !== 0 ? <Divider variant="middle" /> : ''}
          <MenuItem dense={menuItemsDense} disableTouchRipple={true}>
            {/*<ListItemIcon*/}
            {/*  style={props.invitesCount !== 0 ? { marginLeft: '22px' } : {}}*/}
            {/*>*/}
            {/*  <PeopleIcon />*/}
            {/*</ListItemIcon>*/}
            <KeyboardDatePicker
              fullWidth
              margin="normal"
              id="date-picker-dialog"
              label="Jump to date"
              format="dd/MM/yyyy"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </MenuItem>
        </Menu>
      </MuiThemeProvider>
    </>
  );
};

const mapStateToProps = state => {
  const { pendingInvites } = state.meetingInvitesReducer;
  const { authToken } = state.authReducer;

  return { pendingInvites, invitesCount: pendingInvites.length, authToken };
};

export default connect(
  mapStateToProps,
  { calendarSelectedDayWeek, patchMeetingInvitation }
)(NavBarCalendar);
