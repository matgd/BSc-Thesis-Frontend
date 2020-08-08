// This should be split into separate files.

import history from '../history';
import {
  SIGN_IN,
  SIGN_OUT,
  GET_USER_INFO,
  LOAD_FRIEND_LIST,
  GET_PENDING_FRIEND_INVITES,
  ACCEPT_FRIEND_INVITATION,
  REJECT_FRIEND_INVITATION,
  CALENDAR_PREVIOUS_WEEK,
  CALENDAR_NEXT_WEEK,
  CALENDAR_CURRENT_WEEK,
  CALENDAR_SELECTED_DAY_WEEK,
  LOAD_CALENDAR_EVENTS,
  SEARCH_FOR_FRIENDS,
  DELETE_FROM_FRIEND_LIST,
  CREATE_CALENDAR_EVENT,
  CLEAR_CALENDAR_EVENT_STORE,
  LOAD_MEETING_INVITES,
  REJECT_MEETING_INVITATION,
  ACCEPT_MEETING_INVITATION,
  ADD_MEETING_INVITE_TO_CALENDAR
} from './types';
import soonmeetApi from '../api/soonmeetApi';
import soonmeetApiAuthorized from '../api/soonmeetApiAuthorized';
import startOfWeek from 'date-fns/startOfWeek';
import { splitEventToDays } from '../components/utils/dateTimeUtils';
import { NONE } from '../const/eventFrequency';
import { DEFAULT_EVENT_TYPE_ID } from '../const/eventDate';
import { READ, REJECTED, SENT, ACCEPTED } from '../const/attendanceStatus';

/**
 * Sign in action.
 * @param username
 * @param authToken
 * @returns {Function}
 */
export const signIn = (username, authToken) => dispatch => {
  dispatch({
    type: SIGN_IN,
    payload: { username: username, authToken: authToken }
  });
  history.push('/home');
};

/**
 * Sign out action.
 * @returns {{type: *}}
 */
export const signOut = () => {
  return { type: SIGN_OUT };
};

/**
 * Action fetching logged in user information.
 * @param username
 * @returns {Function}
 */
export const getUserInfo = username => async dispatch => {
  const response = await soonmeetApi.get(`/profile/?search=${username}`);
  let userData = response.data.filter(u => u.username === username)[0];
  dispatch({ type: GET_USER_INFO, payload: { ...userData } });
};

export const updateUserInfo = userInfo => {
  return { type: GET_USER_INFO, payload: { ...userInfo } };
};

/**
 * Action fetching friend list of logged in user.
 * @param authToken
 * @returns {Function}
 */
export const loadFriendList = authToken => async dispatch => {
  const response = await soonmeetApiAuthorized(authToken).get(`/friend_list/`);
  let friends = response.data;
  dispatch({ type: LOAD_FRIEND_LIST, payload: friends });
};

/**
 * Action fetching pending invites (SENT or READ) of logged in user.
 * @param authToken
 * @returns {Function}
 */
export const getPendingFriendInvites = authToken => async dispatch => {
  const response = await soonmeetApiAuthorized(authToken).get(
    `/pending_friend_invites/`
  );

  let invites = {};
  let data = response.data;
  for (let i = 0; i < data.length; i++) {
    const inviting_user = await soonmeetApiAuthorized(authToken).get(
      `/profile/${data[i]['inviting_user']}/`
    );
    invites[data[i]['friend_invitation']] = {
      friend_invitation: data[i]['friend_invitation'],
      inviting_user__id: data[i]['inviting_user'],
      inviting_user__username: inviting_user.data['username'],
      inviting_user__first_name: inviting_user.data['first_name'],
      inviting_user__last_name: inviting_user.data['last_name'],
      invitation_status: data[i]['invitation_status']
    };
  }
  dispatch({ type: GET_PENDING_FRIEND_INVITES, payload: invites });
};

/**
 * Action handling accepting friend invitation.
 * @param authToken
 * @param invitationId
 * @param inviterId
 * @param inviterUsername
 * @param inviterFirstName
 * @param inviterLastName
 * @returns {Function}
 */
export const acceptFriendInvitation = (
  authToken,
  invitationId,
  inviterId,
  inviterUsername,
  inviterFirstName,
  inviterLastName
) => async dispatch => {
  let getResponse = await soonmeetApiAuthorized(authToken).get(
    `/friend_invitation/${invitationId}/`
  );

  let friendInvitationData = {
    ...getResponse.data,
    invitation_status: 'ACCEPTED'
  };

  await soonmeetApiAuthorized(authToken).patch(
    `/friend_invitation/${invitationId}/`,
    { ...friendInvitationData }
  );
  dispatch({
    type: ACCEPT_FRIEND_INVITATION,
    payload: {
      invitationId,
      inviterId,
      inviterUsername,
      inviterFirstName,
      inviterLastName
    }
  });
};

/**
 * Action handling rejection of user invitation.
 * @param authToken
 * @param invitationId
 * @returns {Function}
 */
export const rejectFriendInvitation = (
  authToken,
  invitationId
) => async dispatch => {
  let getResponse = await soonmeetApiAuthorized(authToken).get(
    `/friend_invitation/${invitationId}/`
  );

  let friendInvitationData = {
    ...getResponse.data,
    invitation_status: 'REJECTED'
  };

  await soonmeetApiAuthorized(authToken).patch(
    `/friend_invitation/${invitationId}/`,
    { ...friendInvitationData }
  );
  dispatch({ type: REJECT_FRIEND_INVITATION, payload: invitationId });
};

export const deleteFriendInvitation = (
  authToken,
  invitationId
) => async dispatch => {
  let deleteResponse = await soonmeetApiAuthorized(authToken).delete(
    `/friend_invitation/${invitationId}/`
  );

  if (deleteResponse.status === 204) {
    dispatch({ type: DELETE_FROM_FRIEND_LIST, payload: invitationId });
  }
};

/**
 * Switch state of calendar to previous week.
 * @returns {{type: *}}
 */
export const calendarPreviousWeek = () => {
  return { type: CALENDAR_PREVIOUS_WEEK };
};

/**
 * Switch state of calendar to next week.
 * @returns {{type: *}}
 */
export const calendarNextWeek = () => {
  return { type: CALENDAR_NEXT_WEEK };
};

/**
 * Switch state of calendar to current week.
 * @returns {{type: *}}
 */
export const calendarCurrentWeek = () => {
  return { type: CALENDAR_CURRENT_WEEK };
};

/**
 * Switch calendar to week containing selected day.
 * @param date
 * @returns {{payload: {sunday: *, saturday: *, tuesday: *, wednesday: *, thursday: *, friday: *, monday: *}, type: *}}
 */
export const calendarSelectedDayWeek = date => {
  let weekStartDay = startOfWeek(new Date(date), { weekStartsOn: 1 });

  return {
    type: CALENDAR_SELECTED_DAY_WEEK,
    payload: {
      monday: weekStartDay.toJSON(),
      tuesday: weekStartDay.tuesday().toJSON(),
      wednesday: weekStartDay.wednesday().toJSON(),
      thursday: weekStartDay.thursday().toJSON(),
      friday: weekStartDay.friday().toJSON(),
      saturday: weekStartDay.saturday().toJSON(),
      sunday: weekStartDay.sunday().toJSON()
    }
  };
};

/**
 * Loads calendar events with details about event date.
 * @param loggedUserId
 * @param authToken
 * @returns {Function}
 */
export const loadCalendarEvents = (
  loggedUserId,
  authToken
) => async dispatch => {
  const response = await soonmeetApiAuthorized(authToken).get(
    `/calendar_event/?user=${loggedUserId}`
  );

  let events = {};
  let data = response.data;
  for (let i = 0; i < data.length; i++) {
    const event_date = await soonmeetApiAuthorized(authToken).get(
      `/event_date/${data[i]['event_date']}/`
    );
    let eventDateString = new Date(
      event_date.data['start_date']
    ).toDateString();
    if (events[eventDateString] === undefined) {
      events[eventDateString] = [];
    }
    let eventToAdd = {
      ...data[i],
      event_date__type: event_date.data['type'],
      event_date__start_date: event_date.data['start_date'],
      event_date__end_date: event_date.data['end_date'],
      event_date__frequency: event_date.data['frequency'],
      event_date__location: event_date.data['location']
    };
    splitEventToDays(eventToAdd).forEach(event => {
      let currentEventDate = new Date(
        event.event_date__start_date
      ).toDateString();
      if (events[currentEventDate] === undefined) {
        events[currentEventDate] = [];
      }
      if (event_date.data['frequency'] !== NONE) {
        event['actual_start_date'] = event.event_date__start_date;
        event['actual_end_date'] = event.event_date__end_date;
      }
      events[currentEventDate].push(event);
    });
  }
  dispatch({ type: LOAD_CALENDAR_EVENTS, payload: events });
};

/**
 * Fetches given number of profiles to look up.
 * @param profilesToFetch
 * @param searchQuery
 * @param omitUsername
 * @returns {Function}
 */
export const searchForFriends = (
  profilesToFetch,
  searchQuery,
  omitUsername = undefined
) => async dispatch => {
  const response = await soonmeetApi.get(
    `/profile_pagination/?limit=${profilesToFetch}&search=${searchQuery}`
  );
  let data = response.data;
  if (data) {
    let results = data.results;
    if (omitUsername) {
      results = results.filter(profile => profile.username !== omitUsername);
    }
    dispatch({ type: SEARCH_FOR_FRIENDS, payload: results });
  }
};

/**
 * Function handling creation of EventDate and related CalendarEvent.
 * @param authToken
 * @param description
 * @param location
 * @param startDate
 * @param endDate
 * @param frequency
 * @returns {Function}
 */
export const createCalendarEvent = (
  authToken,
  description,
  location,
  startDate,
  endDate,
  frequency
) => async dispatch => {
  const postEventDateResponse = await soonmeetApiAuthorized(authToken)
    .post('/event_date/', {
      type: DEFAULT_EVENT_TYPE_ID,
      start_date: startDate,
      end_date: endDate,
      frequency,
      location
    })
    .catch(error => {
      console.log(error);
    });

  if (postEventDateResponse && postEventDateResponse.status === 201) {
    const postCalendarEventResponse = await soonmeetApiAuthorized(authToken)
      .post('/calendar_event/', {
        event_date: postEventDateResponse.data['id'],
        description
      })
      .catch(error => {
        console.log(error);
      });

    if (postCalendarEventResponse && postCalendarEventResponse.status === 201) {
      let eventToAdd = {
        ...postCalendarEventResponse.data,
        event_date__type: postEventDateResponse.data['type'],
        event_date__start_date: postEventDateResponse.data['start_date'],
        event_date__end_date: postEventDateResponse.data['end_date'],
        event_date__frequency: postEventDateResponse.data['frequency'],
        event_date__location: postEventDateResponse.data['location']
      };
      let events = {};
      splitEventToDays(eventToAdd).forEach(event => {
        let currentEventDate = new Date(
          event.event_date__start_date
        ).toDateString();
        if (events[currentEventDate] === undefined) {
          events[currentEventDate] = [];
        }
        events[currentEventDate].push(event);
      });
      dispatch({ type: CREATE_CALENDAR_EVENT, payload: events });
    } else {
      alert("Couldn't create calendar event. Try again later.");
    }
  }
};

/**
 * Edit calendar event with POST request on EventDate and PATCH request on CalendarEvent.
 * Edited event is removed from Redux store and added again after modification
 * @param authToken
 * @param description
 * @param location
 * @param startDate
 * @param endDate
 * @param frequency
 * @param calendarEventId
 * @param prevStart
 * @param prevEnd
 * @returns {Function}
 */
export const editCalendarEvent = (
  authToken,
  description,
  location,
  startDate,
  endDate,
  frequency,
  calendarEventId,
  prevStart,
  prevEnd
) => async dispatch => {
  const postEventDateResponse = await soonmeetApiAuthorized(authToken)
    .post('/event_date/', {
      type: DEFAULT_EVENT_TYPE_ID,
      start_date: startDate,
      end_date: endDate,
      frequency,
      location
    })
    .catch(error => {
      console.log(error);
    });

  if (postEventDateResponse && postEventDateResponse.status === 201) {
    const postCalendarEventResponse = await soonmeetApiAuthorized(authToken)
      .patch(`/calendar_event/${calendarEventId}/`, {
        event_date: postEventDateResponse.data['id'],
        description
      })
      .catch(error => {
        console.log(error);
      });

    if (postCalendarEventResponse && postCalendarEventResponse.status === 200) {
      let eventToAdd = {
        ...postCalendarEventResponse.data,
        event_date__type: postEventDateResponse.data['type'],
        event_date__start_date: postEventDateResponse.data['start_date'],
        event_date__end_date: postEventDateResponse.data['end_date'],
        event_date__frequency: postEventDateResponse.data['frequency'],
        event_date__location: postEventDateResponse.data['location']
      };
      let events = {};
      splitEventToDays(eventToAdd).forEach(event => {
        let currentEventDate = new Date(
          event.event_date__start_date
        ).toDateString();
        if (events[currentEventDate] === undefined) {
          events[currentEventDate] = [];
        }
        events[currentEventDate].push(event);
      });
      dispatch({
        type: CLEAR_CALENDAR_EVENT_STORE,
        payload: { eventId: calendarEventId, start: prevStart, end: prevEnd }
      });
      dispatch({ type: CREATE_CALENDAR_EVENT, payload: events });
    } else {
      alert("Couldn't edit calendar event. Try again later.");
    }
  }
};

/**
 * Delete calendar event with DELETE request. EventDate won't be touched.
 * @param authToken
 * @param calendarEventId
 * @param eventStart
 * @param eventEnd
 * @returns {Function}
 */
export const deleteCalendarEvent = (
  // without bound deleting EventDate
  authToken,
  calendarEventId,
  eventStart,
  eventEnd
) => async dispatch => {
  const deleteResponse = await soonmeetApiAuthorized(authToken).delete(
    `/calendar_event/${calendarEventId}/`
  );
  if (deleteResponse && deleteResponse.status === 204) {
    dispatch({
      type: CLEAR_CALENDAR_EVENT_STORE,
      payload: { eventId: calendarEventId, start: eventStart, end: eventEnd }
    });
  } else {
    alert("Couldn't delete event. Try again later.");
  }
};

export const loadMeetingInvites = (
  loggedUserId,
  authToken
) => async dispatch => {
  const response = await soonmeetApiAuthorized(authToken).get(
    `/meeting_invitation/?invited_user=${loggedUserId}`
  );

  let events = {};
  let pending = [];
  let data = response.data;
  for (let i = 0; i < data.length; i++) {
    const event_date = await soonmeetApiAuthorized(authToken).get(
      `/event_date/${data[i]['event_date']}/`
    );
    let eventDateString = new Date(
      event_date.data['start_date']
    ).toDateString();
    if (events[eventDateString] === undefined) {
      events[eventDateString] = [];
    }
    let eventToAdd = {
      ...data[i],
      event_date__type: event_date.data['type'],
      event_date__start_date: event_date.data['start_date'],
      event_date__end_date: event_date.data['end_date'],
      event_date__frequency: event_date.data['frequency'],
      event_date__location: event_date.data['location']
    };
    if (
      data[i].attendance_status === SENT ||
      data[i].attendance_status === READ
    )
      pending.push(eventToAdd);

    splitEventToDays(eventToAdd).forEach(event => {
      let currentEventDate = new Date(
        event.event_date__start_date
      ).toDateString();
      if (events[currentEventDate] === undefined) {
        events[currentEventDate] = [];
      }
      event['actual_start_date'] = event_date.data['start_date'];
      event['actual_end_date'] = event_date.data['end_date'];
      events[currentEventDate].push(event);
    });
  }
  dispatch({
    type: LOAD_MEETING_INVITES,
    payload: { invites: events, pendingInvites: pending }
  });
};

export const addMeetingInviteToCalendar = (
  meetingData,
  eventDateData
) => dispatch => {
  let events = {};
  let pending = [];

  let eventDateString = new Date(eventDateData['start_date']).toDateString();

  if (events[eventDateString] === undefined) {
    events[eventDateString] = [];
  }

  let eventToAdd = {
    ...meetingData,
    event_date__type: eventDateData['type'],
    event_date__start_date: eventDateData['start_date'],
    event_date__end_date: eventDateData['end_date'],
    event_date__frequency: eventDateData['frequency'],
    event_date__location: eventDateData['location']
  };
  if (
    meetingData.attendance_status === SENT ||
    meetingData.attendance_status === READ
  )
    pending.push(eventToAdd);

  splitEventToDays(eventToAdd).forEach(event => {
    let currentEventDate = new Date(
      event.event_date__start_date
    ).toDateString();
    if (events[currentEventDate] === undefined) {
      events[currentEventDate] = [];
    }
    // if (eventDateData['frequency'] !== NONE) {
    event['actual_start_date'] = eventDateData['start_date'];
    event['actual_end_date'] = eventDateData['end_date'];
    // }
    events[currentEventDate].push(event);
  });

  dispatch({
    type: ADD_MEETING_INVITE_TO_CALENDAR,
    payload: {
      invites: events,
      pendingInvites: pending
    }
  });
};

export const patchMeetingInvitation = (
  authToken,
  invitationId,
  attendanceStatus
) => async dispatch => {
  let actionType = null;
  switch (attendanceStatus) {
    case REJECTED:
      actionType = REJECT_MEETING_INVITATION;
      break;
    case ACCEPTED:
      actionType = ACCEPT_MEETING_INVITATION;
      break;
    default:
      attendanceStatus = null;
      actionType = null;
  }
  const getResponse = await soonmeetApiAuthorized(authToken).get(
    `/meeting_invitation/${invitationId}/`
  );

  const meetingInvitationData = {
    ...getResponse.data,
    attendance_status: attendanceStatus
  };

  await soonmeetApiAuthorized(authToken)
    .patch(`/meeting_invitation/${invitationId}/`, { ...meetingInvitationData })
    .then(dispatch({ type: actionType, payload: invitationId }))
    .catch(error => {
      alert(error);
    });
};
