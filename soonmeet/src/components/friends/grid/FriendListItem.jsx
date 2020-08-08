import React from 'react';
import { connect } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';
import { ListItemAvatar } from '@material-ui/core';
import UserAvatar from '../../utils/UserAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import { rejectFriendInvitation, deleteFriendInvitation } from '../../../actions';

const FriendListItem = props => {
  const onClearClick = () => {
    // eslint-disable-next-line
    if (confirm(`Are you sure you want to remove ${props.username} from you friend list?`))
      props.deleteFriendInvitation(props.authToken, props.id);
  };

  return (
    <ListItem dense={true}>
      <ListItemAvatar>
        <UserAvatar
          first_name={props.firstName}
          last_name={props.lastName}
          bgColor="#00AA00"
        />
      </ListItemAvatar>
      <ListItemText
        primary={props.username}
        // secondary={`${firstName} ${lastName}`}
      />
      <IconButton size="small" style={{ color: 'red' }} onClick={onClearClick}>
        <ClearIcon />
      </IconButton>
    </ListItem>
  );
};

const mapStateToProps = state => {
  const { authToken } = state.authReducer;
  return { authToken };
};

export default connect(
  mapStateToProps,
  { rejectFriendInvitation, deleteFriendInvitation }
)(FriendListItem);
