import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { getAvatarInitials } from './stringUtils';
import { PRIMARY_COLOR } from '../../const/colors';

const avatarStyle = {
  display: 'inline-flex',
  verticalAlign: 'sub',
  backgroundColor: PRIMARY_COLOR,
  cursor: 'pointer'
};

const UserAvatar = props => {
  return (
    <Avatar
      id={props.id}
      onClick={props.onClick}
      component="span"
      style={{
        ...avatarStyle,
        backgroundColor: props.bgColor
          ? props.bgColor
          : avatarStyle.backgroundColor
      }}
      className={props.className}
    >
      {getAvatarInitials(props.first_name, props.last_name)}
    </Avatar>
  );
};

export default UserAvatar;
