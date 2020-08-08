import React, { useState } from 'react';
import { connect } from 'react-redux';

import { MuiThemeProvider } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import muiTheme from '../../const/muiTheme';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grow from '@material-ui/core/Grow';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';

import GeneralError from '../utils/GeneralError';
import soonmeetApiAuthorized from '../../api/soonmeetApiAuthorized';

const ChangePasswordDialog = props => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const textFieldGap = { marginBottom: 10 };

  const onSubmit = () => {
    soonmeetApiAuthorized(props.authToken)
      .patch('/user_email_password/', {
        old_password: oldPassword,
        new_password: newPassword
      })
      .then(() => {
        setSnackbarOpen(true);
        setOldPassword('');
        setNewPassword('');
        setRepeatNewPassword('');
        props.onClose();
      })
      .catch(error => {
        if (error.response.status === 400) {
          setErrorMsg('Current password is incorrect.');
        } else {
          setErrorMsg(error.toString());
        }
      });
  };

  const invalidPasswords = () => {
    return newPassword !== repeatNewPassword;
  };

  const blankPassword = () => {
    return oldPassword.length === 0 || newPassword.length === 0;
  };

  const onClose = () => {
    setSnackbarOpen(false);
    setOldPassword('');
    setNewPassword('');
    setRepeatNewPassword('');
    setErrorMsg(null);
    props.onClose();
  };

  return (
    <div>
      <MuiThemeProvider theme={muiTheme}>
        <Dialog
          TransitionComponent={Grow}
          open={props.open}
          fullWidth
          onClose={onClose}
        >
          <DialogTitle>Change password</DialogTitle>
          <DialogContent dividers>
            <TextField
              value={oldPassword}
              onChange={event => setOldPassword(event.target.value)}
              type="password"
              label="Current password"
              fullWidth
              style={textFieldGap}
            />
            <TextField
              value={newPassword}
              onChange={event => setNewPassword(event.target.value)}
              type="password"
              error={invalidPasswords()}
              label="New password"
              fullWidth
              style={textFieldGap}
            />
            <TextField
              value={repeatNewPassword}
              onChange={event => setRepeatNewPassword(event.target.value)}
              type="password"
              error={invalidPasswords()}
              label="Repeat new password"
              fullWidth
              style={textFieldGap}
            />
            {errorMsg ? GeneralError(errorMsg) : ''}
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button
              className="organize-button"
              variant="outlined"
              color="primary"
              onClick={onSubmit}
              disabled={invalidPasswords() || blankPassword()}
            >
              {invalidPasswords()
                ? 'Passwords do not match'
                : 'Change password'}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          message={<span>Password has been changed successfully.</span>}
        />
      </MuiThemeProvider>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    authToken: state.authReducer.authToken
  };
};

export default connect(
  mapStateToProps,
  {}
)(ChangePasswordDialog);
