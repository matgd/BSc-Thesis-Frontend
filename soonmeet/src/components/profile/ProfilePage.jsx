import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core';

import NavBar from './navbar/NavBar';
import GridPaper from '../utils/GridPaper';
import soonmeetApiAuthorized from '../../api/soonmeetApiAuthorized';
import muiTheme from '../../const/muiTheme';
import GeneralError from '../utils/GeneralError';
import { PRIMARY_COLOR } from '../../const/colors';
import { updateUserInfo } from '../../actions';

// eslint-disable-next-line
import style from '../../css/friends.css';
import ChangePasswordDialog from './ChangePasswordDialog';

const ProfilePage = props => {
  const [email, setEmail] = useState('unknown');
  const [firstName, setFirstName] = useState(
    props.first_name ? props.first_name : 'unknown'
  );
  const [lastName, setLastName] = useState(
    props.last_name ? props.last_name : 'unknown'
  );
  const textFieldGap = { marginTop: 10 };
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const applyDisabled = () => {
    return (
      firstName === '' ||
      lastName === '' ||
      (firstName === props.first_name && lastName === props.last_name)
    );
  };

  useEffect(() => {
    if (props.authToken) {
      soonmeetApiAuthorized(props.authToken)
        .get('/user_email_password/')
        .then(response => {
          setEmail(response.data['email']);
        })
        .catch(error => {
          alert(error);
        });
    }
  }, [props.authToken]);

  const onApply = () => {
    soonmeetApiAuthorized(props.authToken)
      .patch(`/profile/${props.id}/`, {
        id: props.id,
        username: props.username,
        first_name: firstName,
        last_name: lastName
      })
      .then(response => {
        props.updateUserInfo({ ...response.data });
        setSuccessMsg('Profile data successfully changed.');
      })
      .catch(error => {
        setErrorMsg(error.toString());
      });
  };

  return (
    <div>
      <NavBar />
      <MuiThemeProvider theme={muiTheme}>
        <div className="grid-container">
          <Grid container spacing={3}>
            <Grid item lg={12} md={12} sm={12} xs={12} className="grid-item">
              <GridPaper subheader="Edit profile">
                <div
                  className="grid-paper-content"
                  style={{ paddingLeft: 16, paddingRight: 16 }}
                >
                  <TextField
                    className="text-field"
                    label="Username"
                    value={props.username ? props.username : 'unknown'}
                    fullWidth
                    disabled
                  />
                  <TextField
                    style={{ ...textFieldGap }}
                    label="Email"
                    value={email}
                    disabled
                    fullWidth
                  />
                  <TextField
                    style={{ ...textFieldGap }}
                    label="Name"
                    value={firstName}
                    fullWidth
                    onChange={event => {
                      setFirstName(event.target.value);
                    }}
                  />
                  <TextField
                    style={{ ...textFieldGap }}
                    label="Surname"
                    value={lastName}
                    fullWidth
                    onChange={event => {
                      setLastName(event.target.value);
                    }}
                  />
                  <div
                    style={{
                      marginTop: 20,
                      display: 'grid',
                      justifyContent: 'center',
                      textAlign: 'center'
                    }}
                  >
                    {errorMsg ? GeneralError(errorMsg) : ''}
                    {successMsg ? (
                      <small style={{ color: PRIMARY_COLOR }}>
                        {successMsg}
                      </small>
                    ) : (
                      ''
                    )}
                    <Button
                      color="primary"
                      variant="outlined"
                      disabled={applyDisabled()}
                      onClick={onApply}
                      style={{ marginBottom: 10, marginTop: 5 }}
                    >
                      Apply
                    </Button>
                    <br />
                    <br />
                    <Button
                      variant="outlined"
                      onClick={() => setOpenChangePassword(true)}
                    >
                      Change password
                    </Button>
                  </div>
                </div>
              </GridPaper>
            </Grid>
          </Grid>
        </div>
      </MuiThemeProvider>
      <ChangePasswordDialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </div>
  );
};

const mapStateToProps = state => {
  const { authToken } = state.authReducer;
  return { ...state.loggedInUserInfoReducer, authToken };
};

export default connect(
  mapStateToProps,
  { updateUserInfo }
)(ProfilePage);
