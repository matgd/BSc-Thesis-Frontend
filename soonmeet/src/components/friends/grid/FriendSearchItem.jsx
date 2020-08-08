import React from 'react';
import { connect } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';
import { ListItemAvatar } from '@material-ui/core';
import UserAvatar from '../../utils/UserAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import soonmeetApiAuthorized from '../../../api/soonmeetApiAuthorized';
import { PRIMARY_COLOR } from '../../../const/colors';

const FriendSearchItem = props => {
  const [info, setInfo] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  const handleAddFriend = async () => {
    if (props.friendsIds.includes(props.id.toString())) {
      infoError('Already in friend list.');
    } else {
      const response = await soonmeetApiAuthorized(props.authToken)
        .post('/friend_invitation/', {
          inviting_user: props.loggedUserId,
          invited_user: props.id,
          invitation_status: 'SENT'
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 400) {
              infoError('Invitation already sent.');
            } else {
              infoError(`Couldn't sent invitation. ${error.response.status}`);
            }
          }
        });
      if (response) {
        infoSuccess('Invitation sent.');
      }
    }
  };

  const infoSuccess = message => {
    setInfo(message);
    setIsError(false);
  };

  const infoError = message => {
    setInfo(message);
    setIsError(true);
  };

  return (
    <ListItem dense={true}>
      <IconButton
        style={{ marginRight: 10 }}
        size="medium"
        onClick={handleAddFriend}
      >
        <PersonAddIcon />
      </IconButton>
      <ListItemAvatar>
        <UserAvatar
          first_name={props.firstName}
          last_name={props.lastName}
          bgColor="green"
        />
      </ListItemAvatar>
      <ListItemText
        primary={props.username}
        secondary={`${props.firstName} ${props.lastName}`}
      />
      <ListItemText
        style={{ display: 'contents' }}
        secondary={info}
        secondaryTypographyProps={
          isError
            ? { style: { color: 'red' } }
            : { style: { color: PRIMARY_COLOR } }
        }
      />
    </ListItem>
  );
};

const mapStateToProps = state => {
  const friendsIds = state.friendsReducer.map(friend => { return friend.profile });
  const { authToken } = state.authReducer;
  const loggedUserId = state.loggedInUserInfoReducer.id;
  return { friendsIds, authToken, loggedUserId };
};

export default connect(
  mapStateToProps,
  {}
)(FriendSearchItem);
