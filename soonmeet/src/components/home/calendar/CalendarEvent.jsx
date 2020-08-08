import React from 'react';
import { connect } from 'react-redux';

import {
  timeStartEndString,
  timeMinuteDifference,
  minutesElapsedFromMidnight
} from '../../utils/dateTimeUtils';

import AddEventDialog from './AddEventDialog';
import { EDIT_CALENDAR_EVENT } from '../../../actions/types';
import { determineActualStartEnd } from '../../utils/dateTimeUtils';
import {
  ACCEPTED,
  READ,
  REJECTED,
  SENT
} from '../../../const/attendanceStatus';
import MeetingDialog from './MeetingDialog';

const CalendarEvent = props => {
  let start = new Date(props.start);
  let end = new Date(props.end);
  let height = timeMinuteDifference(start, end);
  let top = minutesElapsedFromMidnight(start);

  let [actualStart, actualEnd] = determineActualStartEnd(
    props.start,
    props.events,
    props.end,
    props.id
  );

  const [editingEvent, setEditingEvent] = React.useState(false);

  const onEventClick = event => {
    if (event.target === event.currentTarget) {
      setEditingEvent(true);
    }
  };

  let classNames = `calendar-event${props.meeting ? ' calendar-meeting' : ''}`;
  if (props.meeting) {
    switch (props.attendanceStatus) {
      case REJECTED:
        classNames += ' meeting-rejected';
        break;
      case ACCEPTED:
        classNames += ' meeting-accepted';
        break;
      case SENT || READ:
        classNames += ' meeting-pending';
        break;
      default:
    }
  }

  return (
    <div
      className={classNames}
      onClick={onEventClick}
      style={{
        display: props.start !== undefined ? 'block' : 'none',
        height: !isNaN(height) ? height : 0,
        top: !isNaN(top) ? top : 0
      }}
    >
      <b onClick={onEventClick}>{timeStartEndString(start, end)}</b>
      {props.meeting ? (
        <span>
          <br />
          <i onClick={onEventClick}>Meeting</i>
        </span>
      ) : (
        ''
      )}
      <br />
      <span onClick={onEventClick}>{props.description}</span>
      {!props.meeting && editingEvent ? (
        <AddEventDialog
          title="Edit event"
          onAcceptAction={EDIT_CALENDAR_EVENT}
          calendarEventId={props.id}
          eventDateId={props.eventDateId}
          description={props.description}
          location={props.location}
          defaultStart={actualStart}
          defaultEnd={actualEnd}
          frequency={props.frequency}
          open={editingEvent}
          onAcceptFunctionCall={() => setEditingEvent(false)}
          onClose={() => setEditingEvent(false)}
        />
      ) : (
        ''
      )}
      {props.meeting && editingEvent ? (
        <MeetingDialog
          title="Meeting details"
          open={editingEvent}
          onClose={() => setEditingEvent(false)}
          meetingId={props.id}
          attendanceStatus={props.attendanceStatus}
          organizer={props.organizer}
          eventDate={props.eventDate}
          location={props.location}
          start={props.start}
          end={props.end}
          actualStart={props.actualStart}
          actualEnd={props.actualEnd}
        />
      ) : (
        ''
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return { events: { ...state.calendarEventsReducer } };
};

export default connect(
  mapStateToProps,
  {}
)(CalendarEvent);
