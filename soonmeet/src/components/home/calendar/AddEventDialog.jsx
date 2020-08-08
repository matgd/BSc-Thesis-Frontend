import React from 'react';
import { connect } from 'react-redux';

import {
  createCalendarEvent,
  editCalendarEvent,
  deleteCalendarEvent
} from '../../../actions';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider } from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import {
  CREATE_CALENDAR_EVENT,
  EDIT_CALENDAR_EVENT
} from '../../../actions/types';

import muiTheme from '../../../const/muiTheme';

const keyboardDatetimePickerStyles = {
  width: '100%',
  marginTop: 10
};

const AddEventDialog = props => {
  const DEFAULT_START_DATE = new Date(props.defaultStart);
  const [description, setDescription] = React.useState(
    props.description ? props.description : ''
  );
  const [location, setLocation] = React.useState(
    props.location ? props.location : ''
  );
  const [startSelectedDate, setStartSelectedDate] = React.useState(
    DEFAULT_START_DATE
  );
  const [endSelectedDate, setEndSelectedDate] = React.useState(
    props.defaultEnd
      ? new Date(props.defaultEnd)
      : new Date(DEFAULT_START_DATE).addHours(1)
  );
  // eslint-disable-next-line
  const [frequency, setFrequency] = React.useState(
    props.frequency ? props.frequency : ''
  );
  const [endBeforeStart, setEndBeforeStart] = React.useState(false);

  const datesAreValid = () => {
    return (
      startSelectedDate instanceof Date &&
      isFinite(startSelectedDate) &&
      endSelectedDate instanceof Date &&
      isFinite(endSelectedDate) &&
      !endBeforeStart
    );
  };

  const onStartDateChange = date => {
    setStartSelectedDate(date);
    // if (props.onAcceptAction !== EDIT_CALENDAR_EVENT)
    //   setEndSelectedDate(new Date(date).addHours(1));
    setEndBeforeStart(endSelectedDate <= date);
  };

  const onEndDateChange = date => {
    setEndSelectedDate(date);
    setEndBeforeStart(date <= startSelectedDate);
  };

  // const onFrequencyChange = event => {
  //   setFrequency(event.target.value);
  // };

  const onAccept = () => {
    switch (props.onAcceptAction) {
      case CREATE_CALENDAR_EVENT:
        props.createCalendarEvent(
          props.authToken,
          description,
          location,
          startSelectedDate,
          endSelectedDate,
          frequency
        );
        break;
      case EDIT_CALENDAR_EVENT:
        props.editCalendarEvent(
          props.authToken,
          description,
          location,
          startSelectedDate,
          endSelectedDate,
          frequency,
          props.calendarEventId,
          props.defaultStart,
          props.defaultEnd
        );
        break;
      default:
        break;
    }
    setDescription('');
    setLocation('');
    if (props.onAcceptFunctionCall) {
      props.onAcceptFunctionCall();
    }
  };

  const onDelete = () => {
    props.deleteCalendarEvent(
      props.authToken,
      props.calendarEventId,
      props.defaultStart,
      props.defaultEnd
    );
    if (props.onDeleteFunctionCall) {
      props.onDeleteFunctionCall();
    }
  };

  return (
    <div>
      <MuiThemeProvider theme={muiTheme}>
        <Dialog open={props.open} onClose={props.onClose}>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogContent dividers>
            {/*<DialogContentText>*/}
            {/*  Add personal event by filling information like description, date*/}
            {/*  and frequency.*/}
            {/*</DialogContentText>*/}
            <TextField
              autoFocus
              value={description}
              onChange={event => setDescription(event.target.value)}
              id="add-event-description"
              label="Short event description"
              fullWidth
            />
            <TextField
              value={location}
              onChange={event => setLocation(event.target.value)}
              id="add-event-location"
              label="Location"
              fullWidth
            />
            <br />
            <KeyboardDateTimePicker
              style={keyboardDatetimePickerStyles}
              id="add-event-start-datetime"
              variant="inline"
              ampm={false}
              value={startSelectedDate}
              onChange={date => {
                onStartDateChange(date);
              }}
              label="Start - date and time"
              format="dd/MM/yyyy HH:mm"
            />
            <KeyboardDateTimePicker
              style={keyboardDatetimePickerStyles}
              id="add-event-end-datetime"
              variant="inline"
              ampm={false}
              minDate={startSelectedDate}
              minDateMessage=""
              value={endSelectedDate}
              onChange={date => {
                onEndDateChange(date);
              }}
              label="End - date and time"
              format="dd/MM/yyyy HH:mm"
            />
              {endBeforeStart ? (
                <FormHelperText style={{ color: 'red', width: '100%' }}>
                  Event cannot end before start.
                </FormHelperText>
              ) : (
                ''
              )}
              {/*<FormHelperText>Repeat</FormHelperText>*/}
              {/*<RadioGroup row value={frequency} onChange={onFrequencyChange}>*/}
              {/*  <FormControlLabel*/}
              {/*    value={NONE}*/}
              {/*    control={<Radio color="primary" />}*/}
              {/*    label="No"*/}
              {/*    labelPlacement="end"*/}
              {/*  />*/}
              {/*  <FormControlLabel*/}
              {/*    value={WEEKLY}*/}
              {/*    control={<Radio color="primary" />}*/}
              {/*    label="Weekly"*/}
              {/*    labelPlacement="end"*/}
              {/*  />*/}
              {/*  <FormControlLabel*/}
              {/*    value={MONTHLY}*/}
              {/*    control={<Radio color="primary" />}*/}
              {/*    label="Monthly"*/}
              {/*    labelPlacement="end"*/}
              {/*  />*/}
              {/*  <FormControlLabel*/}
              {/*    value={YEARLY}*/}
              {/*    control={<Radio color="primary" />}*/}
              {/*    label="Yearly"*/}
              {/*    labelPlacement="end"*/}
              {/*  />*/}
              {/*</RadioGroup>*/}
          </DialogContent>
          <DialogActions style={{ marginLeft: 10, marginRight: 10 }}>
            {props.onAcceptAction === EDIT_CALENDAR_EVENT ? (
              <Button style={{ color: 'red' }} onClick={onDelete}>
                Delete
              </Button>
            ) : (
              ''
            )}
            <div style={{ width: '100%' }} />
            <Button onClick={props.onClose} style={{ color: 'gray' }}>
              Cancel
            </Button>
            <Button
              onClick={onAccept}
              disabled={!datesAreValid()}
              color="primary"
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
  return { authToken };
};

export default connect(
  mapStateToProps,
  { createCalendarEvent, editCalendarEvent, deleteCalendarEvent }
)(AddEventDialog);
