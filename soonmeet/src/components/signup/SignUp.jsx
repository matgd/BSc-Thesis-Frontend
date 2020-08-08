import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import FormInput from './FormInput';
import soonmeetApi from '../../api/soonmeetApi';
import GeneralError from '../utils/GeneralError';

// eslint-disable-next-line
import style from '../../css/Registration-Form-with-Photo.css';


class SignUp extends React.Component {
  state = {
    firstNameError: undefined,
    lastNameError: undefined,
    emailError: undefined,
    usernameError: undefined,
    passwordError: undefined,
    generalError: undefined,
  };

  /**
   * If user is already logged in redirect him to homepage.
   */
  componentDidMount() {
    if (this.props.isSignedIn) {
      this.props.history.push('/home');
    }
  }

  /**
   * Function that resets states of errors back to undefined.
   */
  clearErrors = () => {
    this.setState({
      firstNameError: undefined,
      lastNameError: undefined,
      emailError: undefined,
      usernameError: undefined,
      passwordError: undefined,
      generalError: undefined
    })
  };

  /**
   * Bind response data from API to specific fields in case of POST request rejection.
   * @param errorResponseData
   */
  bindToErrorMessages = errorResponseData => {
    this.setState({
      firstNameError: errorResponseData['first_name'],
      lastNameError: errorResponseData['last_name'],
      emailError: errorResponseData['email'],
      usernameError: errorResponseData['username'],
      passwordError: errorResponseData['password']
    })
  };

  /**
   * Clear errors and validate errors on client side.
   * @returns {boolean} True if form is valid on client side.
   */
  validateForm = () => {
    this.clearErrors();
    let isValid = true;

    let password = document.getElementById('password').value;
    let repeatedPassword = document.getElementById('password-repeat').value;

    if (password !== repeatedPassword) {
      this.setState({ passwordError: 'Passwords do not match.'});
      isValid = false;
    }

    return isValid;
  };

  /**
   * Make actions regarding form submit.
   * Prevent button from default event, validate form.
   * Send POST request regarding account creation.
   * @param event
   * @returns {Promise<void>}
   */
  onFormSubmit = async event => {
    event.preventDefault();
    if (this.validateForm()) {
      await soonmeetApi.post('/profile/', {
        username: document.getElementById('username').value,
        first_name: document.getElementById('first-name').value,
        last_name: document.getElementById('last-name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      }).then(response => {
        if (response.status === 201) {
          this.props.history.push('/login?signup=true')
        }
      }).catch(error => {
          if (error.response) {
            if (error.response.status === 400) {
              this.bindToErrorMessages(error.response.data);
            } else {
              this.setState({ generalError: 'Unexpected error, please try again later.' });
            }
          }
      });
    }
  };

  render() {
    return (
      <div className="register-photo">
        <div className="shadow-none form-container">
          <div className="image-holder"/>
          <form onSubmit={this.onFormSubmit}>
            <h2 className="text-center"><strong>Create</strong> an account.</h2>
            <FormInput id="first-name" type="text" name="first-name" placeholder="Name" required={true}
                       autoFocus={true} errorMessage={this.state.firstNameError}/>
            <FormInput id="last-name" type="text" name="last-name" placeholder="Surname" required={true}
                       errorMessage={this.state.lastNameError}/>
            <FormInput id="email" type="email" name="email" placeholder="Email" required={true}
                       errorMessage={this.state.emailError}/>
            <FormInput id="username" type="text" name="username" placeholder="Username" required={true}
                       errorMessage={this.state.usernameError}/>
            <FormInput id="password" type="password" name="password" placeholder="Password" required={true}
                       errorMessage={this.state.passwordError}/>
            <FormInput id="password-repeat" type="password" name="password-repeat" placeholder="Password (repeat)" required={true}
                       errorMessage={this.state.passwordError}/>
            <div className="form-group">
              <div className="form-check">
                <label className="form-check-label">
                  <input className="form-check-input" type="checkbox" required/>I agree to the license terms.
                </label>
              </div>
            </div>
            {this.state.generalError !== undefined ? GeneralError(this.state.generalError) : ''}
            <div className="form-group">
              <button className="btn btn-primary btn-block" style={{backgroundColor: '#007bff'}}>Sign Up</button>
            </div>
            <Link className="already" to="/login">You already have an account? Login here.</Link>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { isSignedIn } = state.authReducer;
  return { isSignedIn };
};

export default connect(mapStateToProps, {})(SignUp);