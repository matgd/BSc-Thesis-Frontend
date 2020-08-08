import React, { useState } from 'react';
import { connect } from 'react-redux';

import Input from '@material-ui/core/Input';
import { MuiThemeProvider } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from 'lodash';

import { searchForFriends } from '../../../actions';
import darkMuiTheme from '../../../const/muiThemeDark';

const PROFILE_FETCH_COUNT = 8;
const MINIMAL_LENGTH_TO_SEARCH = 0;

const FriendsSearch = props => {
  const [loading, setLoading] = useState(false);

  const onInputChange = event => {
    if (event.target.value.length >= MINIMAL_LENGTH_TO_SEARCH) {
      setLoading(true);
      debouncedSearch(event.target.value);
    }
  };

  const debouncedSearch = _.debounce(query => {
    props.searchForFriends(PROFILE_FETCH_COUNT, query, props.username);
    setLoading(false);
  }, 1000);

  return (
    <MuiThemeProvider theme={darkMuiTheme}>
      <Input
        style={{ width: props.width, marginRight: 10 }}
        id="friends-search-bar"
        placeholder="Search for friends..."
        inputProps={{
          'aria-label': 'Search for friends.'
        }}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        onChange={onInputChange}
      />
      {loading && <CircularProgress size={32}/>}
    </MuiThemeProvider>
  );
};

const mapStateToProps = state => {
  const { username } = state.loggedInUserInfoReducer;
  return { username };
};

export default connect(
  mapStateToProps,
  { searchForFriends }
)(FriendsSearch);
