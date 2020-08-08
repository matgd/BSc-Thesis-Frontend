import React from 'react';

import NavBar from './navbar/NavBar';
import Calendar from './calendar/Calendar';

/**
 * HomePage page, should be rendered when user is logged in.
 * @returns {*}
 * @constructor
 */
const HomePage = () => {
  return (
    <div>
      <NavBar/>
      <Calendar/>
    </div>
  );
};

export default HomePage;