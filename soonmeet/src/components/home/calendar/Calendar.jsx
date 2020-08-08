import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import DayColumn from './DayColumn';
import { loadCalendarEvents, loadMeetingInvites } from '../../../actions';
import CalendarEvent from './CalendarEvent';
import { datesAreOverlapping } from '../../utils/dateTimeUtils';
import LinearProgress from '@material-ui/core/LinearProgress';
import { MuiThemeProvider } from '@material-ui/core/styles';
import muiTheme from '../../../const/muiTheme';

// eslint-disable-next-line
import style from '../../../css/home-calendar.css';

/**
 * Calendar component build on base of 7-columns grid.
 * @returns {*}
 * @constructor
 */

const Calendar = props => {
  const renderEventsForDate = dateString => {
    let calendarEventsRaw = [];
    let meetingEventDates = []; // in order to not show event related to meeting

    let date = new Date(dateString);
    let startDate = date.toDateString();
    if (props.meetingEvents[startDate] !== undefined) {
      calendarEventsRaw = calendarEventsRaw.concat(
        props.meetingEvents[startDate].map(meetingEvent => {
          meetingEventDates.push(meetingEvent.event_date);
          return { ...meetingEvent, meeting: true };
        })
      );
    }
    if (props.events[startDate] !== undefined)
      calendarEventsRaw = calendarEventsRaw.concat(props.events[startDate]);

    calendarEventsRaw.sort((a, b) => {
      let _a = new Date(a.event_date__start_date);
      let _b = new Date(b.event_date__start_date);
      return +_a - +_b;
    });

    let noMeetingEventsRaw = [];

    let calendarEvents = calendarEventsRaw.map((event, index) => {
      if (meetingEventDates.includes(event.event_date) && !event.meeting) {
        return undefined;
      } else {
        noMeetingEventsRaw.push(event);
        return (
          <CalendarEvent
            key={index}
            id={event.id}
            eventDate={event.event_date}
            start={event.event_date__start_date}
            end={event.event_date__end_date}
            description={event.description}
            location={event.event_date__location}
            meeting={event.meeting}
            actualStart={event.actual_start_date}
            actualEnd={event.actual_end_date}
            organizer={event.inviting_user}
            attendanceStatus={event.attendance_status}
          />
        );
      }
    });
    calendarEvents = calendarEvents.filter(ce => ce !== undefined);
    let startedOverlapping = false;
    let groupedEvents = [];
    for (let i = 0; i < noMeetingEventsRaw.length; i++) {
      if (!startedOverlapping) {
        groupedEvents.push([calendarEvents[i]]);
      } else {
        groupedEvents[groupedEvents.length - 1].push(calendarEvents[i]);
      }
      if (i === noMeetingEventsRaw.length - 1) {
        continue;
      }
      startedOverlapping = datesAreOverlapping(
        noMeetingEventsRaw[i].event_date__start_date,
        noMeetingEventsRaw[i].event_date__end_date,
        noMeetingEventsRaw[i + 1].event_date__start_date,
        noMeetingEventsRaw[i + 1].event_date__end_date
      );
    }
    return groupedEvents.map((eventList, index) => {
      return (
        <div
          className={eventList.length === 1 ? '' : 'multiple-events-container'}
          key={index}
        >
          {eventList}
        </div>
      );
    });
  };

  const renderLoadBar = () => {
    if (!props.events.loaded) {
      return (
        <MuiThemeProvider theme={muiTheme}>
          <LinearProgress
            className="linear-progress"
            style={{ position: 'fixed' }}
          />
        </MuiThemeProvider>
      );
    }
  };

  let loggedUserId = props.loggedUserId;
  let authToken = props.authToken;
  const [eventsLoaded, setEventsLoaded] = useState(props.events.loaded);
  const [meetingsLoaded, setMeetingsLoaded] = useState(props.invitesLoaded);
  const loadCalendarEvents = props.loadCalendarEvents;
  const loadMeetingInvites = props.loadMeetingInvites;

  useEffect(() => {
    if (loggedUserId && authToken && !eventsLoaded) {
      loadCalendarEvents(loggedUserId, authToken);
      setEventsLoaded(true);
    }
    if (loggedUserId && authToken && !meetingsLoaded) {
      loadMeetingInvites(loggedUserId, authToken);
      setMeetingsLoaded(true);
    }
  }, [
    authToken,
    eventsLoaded,
    meetingsLoaded,
    loggedUserId,
    loadCalendarEvents,
    loadMeetingInvites
  ]);

  return (
    <div>
      {renderLoadBar()}
      <div id="calendar">
        <DayColumn
          weekday="Monday"
          date={new Date(props.monday).getDate()}
          active={props.monday === props.today}
        >
          {props.events && renderEventsForDate(props.monday)}
        </DayColumn>
        <DayColumn
          weekday="Tuesday"
          date={new Date(props.tuesday).getDate()}
          active={props.tuesday === props.today}
        >
          {props.events && renderEventsForDate(props.tuesday)}
        </DayColumn>
        <DayColumn
          weekday="Wednesday"
          date={new Date(props.wednesday).getDate()}
          active={props.wednesday === props.today}
        >
          {props.events && renderEventsForDate(props.wednesday)}
        </DayColumn>
        <DayColumn
          weekday="Thursday"
          date={new Date(props.thursday).getDate()}
          active={props.thursday === props.today}
        >
          {props.events && renderEventsForDate(props.thursday)}
        </DayColumn>
        <DayColumn
          weekday="Friday"
          date={new Date(props.friday).getDate()}
          active={props.friday === props.today}
        >
          {props.events && renderEventsForDate(props.friday)}
        </DayColumn>
        <DayColumn
          weekday="Saturday"
          date={new Date(props.saturday).getDate()}
          active={props.saturday === props.today}
        >
          {props.events && renderEventsForDate(props.saturday)}
        </DayColumn>
        <DayColumn
          weekday="Sunday"
          date={new Date(props.sunday).getDate()}
          active={props.sunday === props.today}
        >
          {props.events && renderEventsForDate(props.sunday)}
        </DayColumn>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const {
    today,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday
  } = state.calendarReducer;

  const events = { ...state.calendarEventsReducer };
  const meetingEvents = { ...state.meetingInvitesReducer.invites };
  const invitesLoaded = state.meetingInvitesReducer.meta.invites_loaded;

  return {
    today,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    loggedUserId: state.loggedInUserInfoReducer.id,
    authToken: state.authReducer.authToken,
    events,
    meetingEvents,
    invitesLoaded
  };
};

export default connect(
  mapStateToProps,
  { loadCalendarEvents, loadMeetingInvites }
)(Calendar);
