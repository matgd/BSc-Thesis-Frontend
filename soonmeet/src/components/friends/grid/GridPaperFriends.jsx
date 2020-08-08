import React from 'react';
import { connect } from 'react-redux';
import FriendListItem from './FriendListItem';

const GridPaperFriends = props => {
  const renderFriendList = () => {
    return props.friends.map(friend => {
      return (
        <FriendListItem
          key={friend.profile}
          id={friend.invitation}
          username={friend.username}
          firstName={friend.first_name}
          lastName={friend.last_name}
        />
      );
    });
  };

  return <div className="grid-paper-content">{renderFriendList()}</div>;
};

const mapStateToProps = state => {
  const friends = [ ...state.friendsReducer ];
  return { friends };
};

export default connect(
  mapStateToProps,
  {}
)(GridPaperFriends);
