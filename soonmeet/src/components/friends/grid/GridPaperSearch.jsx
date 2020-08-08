import React from 'react';
import { connect } from 'react-redux';
import FriendSearchItem from './FriendSearchItem';

const GridPaperSearch = props => {
  const renderSearchList = () => {
    return props.profiles.map(profile => {
      const username = profile.username;
      const firstName = profile.first_name;
      const lastName = profile.last_name;

      return (
        <FriendSearchItem
          key={profile.id}
          id={profile.id}
          username={username}
          firstName={firstName}
          lastName={lastName}
        />
      );
    });
  };

  return (
    <div className="grid-paper-content" style={{ marginRight: 10 }}>
      {renderSearchList()}
    </div>
  );
};

const mapStateToProps = state => {
  const profiles = [...state.friendsSearchReducer];
  return { profiles };
};

export default connect(
  mapStateToProps,
  {}
)(GridPaperSearch);
