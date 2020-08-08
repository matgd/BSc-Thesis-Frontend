import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { MuiThemeProvider } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { KeyboardTimePicker } from '@material-ui/pickers';

import Select from 'react-select';

import muiTheme from '../../../const/muiTheme';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grow from '@material-ui/core/Grow';
import FormHelperText from '@material-ui/core/FormHelperText';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import TimerIcon from '@material-ui/icons/Timer';
import TextField from '@material-ui/core/TextField';

import {
  DEFAULT_EVENT_FREQUENCY,
  DEFAULT_EVENT_TYPE_ID
} from '../../../const/eventDate';
import { addMeetingInviteToCalendar } from '../../../actions';
import soonmeetApiAuthorized from '../../../api/soonmeetApiAuthorized';

const OrganizeMeetingDialog = props => {
  const friendOptions = props.friends.map(friend => {
    return {
      label: `${friend.first_name} ${friend.last_name} (${friend.username})`,
      value: friend.profile
    };
  });
  const [overflowVisible, setOverflowVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const DEFAULT_MEETING_LENGTH = new Date();
  DEFAULT_MEETING_LENGTH.setHours(1);
  DEFAULT_MEETING_LENGTH.setMinutes(0);

  const DEFAULT_AWAIT_LENGTH = new Date();
  DEFAULT_AWAIT_LENGTH.setHours(0);
  DEFAULT_AWAIT_LENGTH.setMinutes(30);

  const [meetingLength, setMeetingLength] = useState(DEFAULT_MEETING_LENGTH);
  const [awaitLength, setAwaitLength] = useState(DEFAULT_AWAIT_LENGTH);

  const [valid, setValid] = useState(false);
  const [meetingLengthError, setMeetingLengthError] = useState(null);
  const [awaitLengthError, setAwaitLengthError] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [location, setLocation] = React.useState(
    props.location ? props.location : ''
  );

  const handleParticipantsChange = value => {
    setSelected(value);
  };

  const onSubmit = async () => {
    // here instead in actions 'cause of snackbar
    const meetingResponse = await soonmeetApiAuthorized(props.authToken)
      .post('/propose_meeting/', {
        participants: selected.map(p => p.value),
        minutes: meetingLength.getHours() * 60 + meetingLength.getMinutes(),
        min_buffer_minutes:
          awaitLength.getHours() * 60 + awaitLength.getMinutes()
      })
      .catch(error => {
        alert(error);
      });
    if (meetingResponse && meetingResponse.status === 200) {
      const dateResponse = await soonmeetApiAuthorized(props.authToken)
        .post('/event_date/', {
          type: DEFAULT_EVENT_TYPE_ID,
          start_date: meetingResponse.data['start_time'],
          end_date: meetingResponse.data['end_time'],
          frequency: DEFAULT_EVENT_FREQUENCY,
          location
        })
        .catch(error => {
          alert(error);
        });

      if (dateResponse && dateResponse.status === 201) {
        meetingResponse.data['participants'].forEach(pid => {
          soonmeetApiAuthorized(props.authToken)
            .post('/meeting_invitation/', {
              invited_user: pid,
              event_date: dateResponse.data['id'],
              attendance_status: 'SENT'
            })
            .then(meetingInviteResponse => {
              if (
                props.loggedUserId ===
                meetingInviteResponse.data['invited_user']
              ) {
                props.addMeetingInviteToCalendar(
                  meetingInviteResponse.data,
                  dateResponse.data
                );
              }
            })
            .catch(error => {
              alert(error);
              return false;
            });
        });
      }
      props.onClose();
      setSnackbarOpen(true);
    }
  };

  const onMeetingLengthChange = value => {
    setMeetingLength(value);
  };

  const onAwaitLengthChange = value => {
    setAwaitLength(value);
  };

  const setToDefaultState = () => {
    setMeetingLength(DEFAULT_MEETING_LENGTH);
    setAwaitLength(DEFAULT_AWAIT_LENGTH);
    setSelected(null);
    setMeetingLengthError(null);
    setAwaitLengthError(null);
    setValid(false);
    setLocation('');
  };

  const onClose = () => {
    setToDefaultState();
    props.onClose();
  };

  useEffect(() => {
    const inputValid = () => {
      if (
        meetingLength instanceof Date &&
        isFinite(meetingLength.getTime()) &&
        (awaitLength instanceof Date && isFinite(awaitLength.getTime()))
      ) {
        if (meetingLength.getHours() === 0 && meetingLength.getMinutes() < 10) {
          setMeetingLengthError('Meeting has to last at least 10 minutes.');
        } else {
          setMeetingLengthError(null);
        }

        if (awaitLength.getHours() === 0 && awaitLength.getMinutes() < 30) {
          setAwaitLengthError("Can't be less than 30 minutes.");
        } else {
          setAwaitLengthError(null);
        }

        return (
          meetingLengthError === null &&
          awaitLengthError === null &&
          selected !== null
        );
      }

      return false;
    };

    setValid(inputValid());
  }, [
    meetingLength,
    awaitLength,
    selected,
    meetingLengthError,
    awaitLengthError
  ]);

  return (
    <div>
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          TransitionComponent={Grow}
          open={props.open}
          fullWidth
          onClose={onClose}
          PaperProps={{ style: { overflow: 'visible' } }}
        >
          <DialogTitle>Organize meeting</DialogTitle>
          <DialogContent
            dividers
            style={{ overflow: overflowVisible ? 'visible' : 'auto' }}
          >
            <Select
              placeholder="Add friends..."
              options={friendOptions}
              isMulti
              onMenuOpen={() => setOverflowVisible(true)}
              onMenuClose={() => setOverflowVisible(false)}
              onChange={handleParticipantsChange}
            />
            <TextField
              value={location}
              onChange={event => setLocation(event.target.value)}
              id="organize-meeting-event-location"
              label="Location"
              fullWidth
            />
            <div className="time-pickers">
              <div>
                <FormHelperText>Meeting length</FormHelperText>
                <KeyboardTimePicker
                  className="length-picker"
                  ampm={false}
                  variant="inline"
                  mask="__:__"
                  value={meetingLength}
                  keyboardIcon={<TimerIcon />}
                  onChange={onMeetingLengthChange}
                  fullWidth
                  error={
                    meetingLengthError !== null ||
                    !(
                      meetingLength instanceof Date &&
                      isFinite(meetingLength.getTime())
                    )
                  }
                />
                {meetingLengthError ? (
                  <FormHelperText style={{ color: 'red', width: '100%' }}>
                    {meetingLengthError}
                  </FormHelperText>
                ) : (
                  ''
                )}
              </div>
              <div>
                <Tooltip
                  title="Meeting won't take place in the next given hours"
                  placement="top-start"
                >
                  <FormHelperText>Minimal voting/arrival length</FormHelperText>
                </Tooltip>
                <KeyboardTimePicker
                  className="length-picker"
                  ampm={false}
                  variant="inline"
                  value={awaitLength}
                  keyboardIcon={<TimerIcon />}
                  onChange={onAwaitLengthChange}
                  fullWidth
                  error={
                    awaitLengthError !== null ||
                    !(
                      awaitLength instanceof Date &&
                      isFinite(awaitLength.getTime())
                    )
                  }
                />
                {awaitLengthError ? (
                  <FormHelperText style={{ color: 'red', width: '100%' }}>
                    {awaitLengthError}
                  </FormHelperText>
                ) : (
                  ''
                )}
              </div>
            </div>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button
              className="organize-button"
              variant={valid ? 'outlined' : 'text'}
              color="primary"
              disabled={!valid}
              onClick={onSubmit}
            >
              Organize meeting!
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          message={<span>Meeting time has been proposed.</span>}
        />
      </MuiThemeProvider>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    friends: [...state.friendsReducer],
    authToken: state.authReducer.authToken,
    loggedUserId: state.loggedInUserInfoReducer.id
  };
};

export default connect(
  mapStateToProps,
  { addMeetingInviteToCalendar }
)(OrganizeMeetingDialog);
