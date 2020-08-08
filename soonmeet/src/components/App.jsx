import React from 'react';
import { Router, Route } from 'react-router-dom';

import Index from './index/Index';
import Login from './login/Login';
import SignUp from './signup/SignUp';
import HomePage from './home/HomePage';
import history from '../history';
import FriendsPage from './friends/FriendsPage';
import ProfilePage from './profile/ProfilePage';
import AuthorizedRoute from './utils/AuthorizedRoute';


const App = () => {
  return (
    <div>
      <Router history={history}>
        <div>
          <Route path="/" exact component={Index} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={SignUp}/>
          <AuthorizedRoute path='/home' exact component={HomePage}/>
          <AuthorizedRoute path='/friends' exact component={FriendsPage}/>
          <AuthorizedRoute path='/profile' exact component={ProfilePage} />
        </div>
      </Router>
    </div>
  );
};

export default App;
