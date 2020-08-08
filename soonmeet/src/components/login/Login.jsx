import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import soonmeetApi from '../../api/soonmeetApi';
import GeneralError from '../utils/GeneralError';
import {
  signIn,
  getUserInfo,
  loadFriendList,
  getPendingFriendInvites
} from '../../actions';
import { PRIMARY_COLOR } from '../../const/colors';

// eslint-disable-next-line
import style from '../../css/Login-Form-Clean.css';

class Login extends React.Component {
  state = {
    errorMessage: undefined,
  };

  /**
   * If user is already logged in redirect him to homepage.
   */
  componentDidMount() {
    if (this.props.isSignedIn && this.props.authToken) {
      this.props.history.push('/home');
    }
  }

  onFormSubmit = async event => {
    event.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    const response = await soonmeetApi
      .post('/login/', { username, password })
      .catch(error => {
        if (error.response) {
          if (error.response.status === 400) {
            this.setState({
              errorMessage: 'Invalid credentials, please try again.'
            });
          } else {
            this.setState({
              errorMessage: 'Unexpected error, please try again later.'
            });
          }
        }
      });

    if (response) {
      // success
      const authToken = response.data.token;
      this.props.signIn(username, response.data.token);
      this.props.getUserInfo(username);
      this.props.loadFriendList(authToken);
      this.props.getPendingFriendInvites(authToken);
    }
  };

  render() {
    return (
      <div className="login-clean">
        <form onSubmit={this.onFormSubmit}>
          <h2 className="sr-only">Login Form</h2>
          <div className="illustration">
            <Link to="/">
              <i className="far fa-calendar-check"></i>
            </Link>
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              required=""
              name="username"
              id="username"
              placeholder="Username"
              autoFocus=""
              autoComplete="on"
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              autoComplete="on"
              required=""
              minLength="1"
            />
          </div>
          <div className="form-group" style={{ textAlign: 'center' }}>
            {this.state.errorMessage !== undefined
              ? GeneralError(this.state.errorMessage)
              : ''}
            <span style={{ color: PRIMARY_COLOR }}>
              {new URLSearchParams(window.location.search.slice(1)).get(
                'signup'
              ) === 'true'
                ? 'Login with created account.'
                : ''}
            </span>
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block" type="submit">
              Log In
            </button>
          </div>
          <Link className="forgot" to="/signUp">
            Don't have an account?
          </Link>
          {/*<Link className="forgot" to="/restoreAccount">Forgot your email or password?</Link>*/}
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { authToken, isSignedIn } = state.authReducer;
  return { authToken, isSignedIn };
}

export default connect(
  mapStateToProps,
  {
    signIn,
    getUserInfo,
    loadFriendList,
    getPendingFriendInvites
  }
)(Login);
