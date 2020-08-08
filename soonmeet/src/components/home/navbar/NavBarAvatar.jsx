import React from 'react';
import { connect } from 'react-redux';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import SettingsIcon from '@material-ui/icons/Settings';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

import { signOut } from '../../../actions';
import history from '../../../history';
import UserAvatar from '../../utils/UserAvatar';

const menuItemsDense = true;

/**
 * Clickable Avatar for NavBar.
 * @param props
 * @returns {*}
 * @constructor
 */
const NavBarAvatar = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <UserAvatar
        id="user-avatar"
        onClick={handleClick}
        className="nav-bar-component"
        first_name={props.first_name}
        last_name={props.last_name}
      />
      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <MenuItem
          dense={menuItemsDense}
          onClick={() => history.push('/profile')}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="Edit profile" secondary={props.username} />
        </MenuItem>
        <MenuItem onClick={handleClose} dense={menuItemsDense} disabled>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Preferences" />
        </MenuItem>
        <MenuItem onClick={props.signOut} dense={menuItemsDense}>
          <ListItemIcon>
            <MeetingRoomIcon />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </MenuItem>
      </Menu>
    </>
  );
};

export default connect(
  null,
  { signOut }
)(NavBarAvatar);
