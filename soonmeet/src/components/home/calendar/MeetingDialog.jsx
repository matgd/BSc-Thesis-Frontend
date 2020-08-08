import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { MuiThemeProvider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import soonmeetApiAuthorized from '../../../api/soonmeetApiAuthorized';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import muiTheme from '../../../const/muiTheme';
import UserAvatar from '../../utils/UserAvatar';
import {
  ACCEPTED,
  READ,
  REJECTED,
  SENT
} from '../../../const/attendanceStatus';
import {
  MEETING_PENDING,
  MEETING_REJECTED,
  PRIMARY_COLOR
} from '../../../const/colors';
import { patchMeetingInvitation } from '../../../actions';
import DialogContentText from '@material-ui/core/DialogContentText';
import { timeStartEndString } from '../../utils/dateTimeUtils';

const MeetingDialog = props => {
  const [participants, setParticipants] = useState([]);
  const [participantsOutsideFriends, setParticipantsOutsideFriends] = useState(
    {}
  );
  const authToken = props.authToken;
  const meetingOver = new Date(props.end) < new Date();

  useEffect(() => {
    if (props.open) {
      soonmeetApiAuthorized(authToken)
        .get(
          `/meeting_invitation/?inviting_user=${props.organizer}&event_date=${props.eventDate}`
        )
        .catch(error => alert(error))
        .then(response => {
          setParticipants(response.data);
          if (Object.keys(participantsOutsideFriends).length === 0) {
            response.data.forEach(p => {
              if (!props.participants[p.invited_user]) {
                soonmeetApiAuthorized(authToken)
                  .get(`/profile/${p.invited_user}`)
                  .catch(error => console.log(error))
                  .then(response => {
                    console.log(participantsOutsideFriends);
                    setParticipantsOutsideFriends({
                      ...participantsOutsideFriends,
                      [response.data.id]: { ...response.data }
                    });
                    console.log(participantsOutsideFriends);
                  });
              }
            });
          }
        });
    }

  }, [
    props.open,
    props.organizer,
    props.eventDate,
    props.participants,
    participantsOutsideFriends,
    authToken
  ]);

  const renderParticipants = () => {
    return participants.map((p, index) => {
      // handle not in someone not in friend list
      let username = 'unknown';
      let firstName = 'Unknown';
      let lastName = 'Unknown';
      let avatarColor = '';
      if (props.participants[p.invited_user]) {
        username = props.participants[p.invited_user].username;
        firstName = props.participants[p.invited_user].first_name;
        lastName = props.participants[p.invited_user].last_name;
      } else if (participantsOutsideFriends[p.invited_user]) {
        username = participantsOutsideFriends[p.invited_user].username;
        firstName = participantsOutsideFriends[p.invited_user].first_name;
        lastName = participantsOutsideFriends[p.invited_user].last_name;
      }
      switch (p.attendance_status) {
        case SENT || READ:
          avatarColor = MEETING_PENDING;
          break;
        case REJECTED:
          avatarColor = MEETING_REJECTED;
          break;
        default:
          avatarColor = PRIMARY_COLOR;
      }


      return (
        <ListItem key={index} style={username === 'unknown' ? {display: 'none'} : {}} className="animated fadeIn fast">
          <ListItemAvatar>
            <UserAvatar
              className="meeting-dialog-user-avatar"
              first_name={firstName}
              last_name={lastName}
              bgColor={avatarColor}
            />
          </ListItemAvatar>
          <ListItemText
            primary={username}
            secondary={`${firstName} ${lastName}`}
          />
        </ListItem>
      );
    });
  };

  const rejectMeetingInvite = () => {
    props.patchMeetingInvitation(authToken, props.meetingId, REJECTED);
    soonmeetApiAuthorized(authToken)
      .get(`/calendar_event/?event_date=${props.eventDate}`)
      .catch(error => {
        alert(error);
      })
      .then(response => {
        if (response.data.length > 0) {
          soonmeetApiAuthorized(authToken)
            .delete(`/calendar_event/${response.data[0]['id']}/`)
            .catch(error => alert(error));
        }
      });

    props.onClose();
  };

  const acceptMeetingInvite = () => {
    props.patchMeetingInvitation(authToken, props.meetingId, ACCEPTED);
    soonmeetApiAuthorized(authToken)
      .post('/calendar_event/', {
        event_date: props.eventDate,
        description: 'Meeting'
      })
      .catch(error => {
        alert(error);
      });
    props.onClose();
  };

  return (
    <div>
      <MuiThemeProvider theme={muiTheme}>
        <Dialog open={props.open} onClose={props.onClose}>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              <b>
                {timeStartEndString(
                  new Date(props.actualStart),
                  new Date(props.actualEnd)
                )}
              </b>
              {props.location ? (
                <span>
                  <br />
                  {props.location}
                </span>
              ) : (
                ''
              )}
            </DialogContentText>
            <List dense style={{ padding: 0 }}  key={1}>
              {renderParticipants()}
            </List>
            {meetingOver ? (
              <i className="meeting-over-msg">Meeting is over.</i>
            ) : (
              ''
            )}
          </DialogContent>
          <DialogActions style={{ marginLeft: 10, marginRight: 10 }}>
            <Button
              className="dialog-button-cancel"
              onClick={props.onClose}
              style={{ color: 'gray' }}
            >
              Cancel
            </Button>
            <div style={{ width: '100%' }} />
            <Button
              // style={{ color: 'red' }}
              color="secondary"
              variant="outlined"
              disabled={
                props.attendanceStatus === REJECTED ||
                (meetingOver && props.attendanceStatus === ACCEPTED)
              }
              onClick={rejectMeetingInvite}
              fullWidth
            >
              Reject
            </Button>
            <Button
              color="primary"
              variant="outlined"
              disabled={
                props.attendanceStatus === ACCEPTED ||
                (meetingOver && props.attendanceStatus === REJECTED)
              }
              onClick={acceptMeetingInvite}
              fullWidth
            >
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </MuiThemeProvider>
    </div>
  );
};

const mapStateToProps = state => {
  const { authToken } = state.authReducer;
  const loggedUser = state.loggedInUserInfoReducer;
  const friendList = [...state.friendsReducer];
  const participants = {};
  friendList.forEach(f => {
    participants[f.profile] = { ...f };
  });
  participants[loggedUser.id] = { ...loggedUser, invited_user: loggedUser.id };
  return { authToken, participants };
};

export default connect(
  mapStateToProps,
  { patchMeetingInvitation }
)(MeetingDialog);
