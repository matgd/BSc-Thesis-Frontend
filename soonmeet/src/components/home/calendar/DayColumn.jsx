import React from 'react';
import { connect } from 'react-redux';

import AddEventDialog from './AddEventDialog';
import { CREATE_CALENDAR_EVENT } from '../../../actions/types';
import TimeMarker from './TimeMarker';

/**
 * Renders column's header.
 * @param weekday (e.g. Friday)
 * @param date (e.g. 17)
 * @return header
 */
const renderWeekdayHeader = (weekday, date) => {
  let header = weekday.slice(0, 3);
  if (date) {
    header += ', ' + date;
    let datePostfix = date % 10;
    switch (datePostfix) {
      case 1:
        header += 'st';
        break;
      case 2:
        header += 'nd';
        break;
      case 3:
        header += 'rd';
        break;
      default:
        header += 'th';
    }
  }
  return header;
};



/**
 * Day column used in Calendar component.
 * @param props
 * @returns {*}
 * @constructor
 */
const DayColumn = props => {
  const [addEventOpen, setAddEventOpen] = React.useState(false);

  const onColumnClick = event => {
    if (event.target === event.currentTarget) {
      setAddEventOpen(true);
    }
  };


  return (
    <div className={`day-column ${props.active ? 'day-column-active' : ''}`}>
      <div className="weekday-header" id={`weekday-${props.weekday}`}>
        {renderWeekdayHeader(props.weekday, props.date)}
      </div>
      <div className="weekday-header weekday-header-short">
        {props.date}
      </div>
      <div className="weekday-events" onClick={onColumnClick}>
        {props.children}
        {props.active ? <TimeMarker/> : ''}
      </div>
      <AddEventDialog
        title="Add new event"
        onAcceptAction={CREATE_CALENDAR_EVENT}
        onAcceptFunctionCall={() => setAddEventOpen(false)}
        onDeleteFunctionCall={() => setAddEventOpen(false)}
        key={props[props.weekday.toLowerCase()]}
        defaultStart={props[props.weekday.toLowerCase()]}
        onClose={() => {
          setAddEventOpen(false);
        }}
        open={addEventOpen}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return { ...state.calendarReducer };
};

export default connect(mapStateToProps, {})(DayColumn);
