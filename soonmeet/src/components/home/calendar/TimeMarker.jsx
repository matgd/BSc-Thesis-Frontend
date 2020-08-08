import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from '@material-ui/core';

import { minutesElapsedFromMidnight } from '../../utils/dateTimeUtils';

const TimeMarker = props => {
  const [minutesFromMidnight, setMinutesFromMidnight] = useState(
    minutesElapsedFromMidnight(new Date())
  );

  useEffect(() => {
    let timeout = null;
    const calculateMinutes = () => {
      let currentDate = new Date();
      setMinutesFromMidnight(minutesElapsedFromMidnight(currentDate));
      timeout = setTimeout(calculateMinutes, 60000);
    };
    calculateMinutes();
    
    return function cleanup() {
      clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    if (!props.loaded)
      document
        .getElementById('time-marker')
        .scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [props.loaded]);

  return (
    <Tooltip
      title={new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}
      placement="bottom"
    >
      <div id="time-marker" style={{ top: minutesFromMidnight - 4 }} />
    </Tooltip>
  ); // minutesFromMidnight - 4 because of height
};

const mapStateToProps = state => {
  return { loaded: state.calendarEventsReducer.loaded };
};

export default connect(
  mapStateToProps,
  {}
)(TimeMarker);
