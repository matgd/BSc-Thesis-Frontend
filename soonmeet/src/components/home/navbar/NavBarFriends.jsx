import React from 'react';
import { connect } from 'react-redux';

import Menu from '@material-ui/core/Menu';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import PeopleIcon from '@material-ui/icons/People';
import { MuiThemeProvider } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import history from '../../../history';
import { acceptFriendInvitation, deleteFriendInvitation } from '../../../actions';
import { PRIMARY_COLOR } from '../../../const/colors';
import muiTheme from '../../../const/muiTheme';

const theme = muiTheme;
const menuItemsDense = true;

/**
 * Component handling sending user to friend-page and accepting and rejecting invitations to friend-list.
 * @param props
 * @returns {*}
 * @constructor
 */
const NavBarFriends = props => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const authToken = props.authToken;

  /**
   * Wrapper for accepting friend invitation for FriendInvitationMenuItem.
   * @param invitationId
   */
  const acceptInvite = (invitationId, inviterId, inviterUsername, inviterFirstName, inviterLastName) => {
    props.acceptFriendInvitation(authToken, invitationId, inviterId, inviterUsername, inviterFirstName, inviterLastName);
  };

  /**
   * Wrapper for rejecting friend invitation for FriendInvitationMenuItem.
   * @param invitationId
   */
  const rejectInvite = invitationId => {
    props.deleteFriendInvitation(authToken, invitationId);
  };

  /**
   * Component responsible for accepting and rejecting pending user invite.
   * @type {React.ForwardRefExoticComponent<React.PropsWithoutRef<{}> & React.RefAttributes<unknown>>}
   */
  const FriendInvitationMenuItem = React.forwardRef((props, ref) => {
    return (
      <>
        <ListItem dense={menuItemsDense} ref={ref}>
          <IconButton
            onClick={() => acceptInvite(props.invitationId, props.inviter_id, props.username, props.first_name, props.last_name)}
            size="small"
            style={{ color: PRIMARY_COLOR }}
          >
            <DoneIcon />
          </IconButton>
          <IconButton
            onClick={() => rejectInvite(props.invitationId)}
            size="small"
            style={{ marginLeft: '5px', marginRight: '15px', color: 'red' }}
          >
            <ClearIcon />
          </IconButton>
          <ListItemText
            primary={props.username}
            secondary={props.first_name + ' ' + props.last_name}
          />
        </ListItem>
      </>
    );
  });

  /**
   * Function rendering multiple FriendInvitationMenuItem components in Menu.
   * @returns {*[]}
   */
  const renderInvitesList = () => {
    return Object.keys(props.invites).map(inviteId => {
      return (
        <FriendInvitationMenuItem
          key={inviteId}
          invitationId={inviteId}
          inviter_id={props.invites[inviteId]['inviting_user__id']}
          username={props.invites[inviteId]['inviting_user__username']}
          first_name={props.invites[inviteId]['inviting_user__first_name']}
          last_name={props.invites[inviteId]['inviting_user__last_name']}
        />
      );
    });
  };

  /**
   * Sets anchor to IconButton for Menu.
   * @param event
   */
  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  /**
   * Clears anchor element for Menu.
   */
  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <MuiThemeProvider theme={theme}>
        <Badge
          badgeContent={props.invitesCount}
          color="primary"
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          overlap="circle"
        >
          <IconButton
            onClick={handleClick}
            size={props.size}
            style={props.style}
            aria-label="friends"
          >
            <PeopleIcon />
          </IconButton>
        </Badge>
      </MuiThemeProvider>
      <Menu
        id="friends-menu"
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
        {renderInvitesList()}
        {props.invitesCount !== 0 ? <Divider variant="middle" /> : ''}
        <MenuItem
          onClick={() => history.push('/friends')}
          dense={menuItemsDense}
        >
          <ListItemIcon
            style={props.invitesCount !== 0 ? { marginLeft: '22px' } : {}}
          >
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Manage friends" />
        </MenuItem>
      </Menu>
    </>
  );
};

const mapStateToProps = state => {
  const invites = { ...state.friendInvitesReducer };
  const invitesCount = Object.keys(invites).length;
  const authToken = state.authReducer.authToken;

  return { invites, invitesCount, authToken };
};

export default connect(
  mapStateToProps,
  { acceptFriendInvitation, deleteFriendInvitation }
)(NavBarFriends);
