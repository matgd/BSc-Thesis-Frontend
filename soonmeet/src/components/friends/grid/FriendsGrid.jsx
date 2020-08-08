import React from 'react';

import Grid from '@material-ui/core/Grid';

import GridPaper from '../../utils/GridPaper';
import GridPaperFriends from './GridPaperFriends';
import GridPaperSearch from './GridPaperSearch';

// eslint-disable-next-line
import style from '../../../css/friends.css';

const FriendsGrid = props => {
  return (
    <div className="grid-container">
      <Grid container spacing={3}>
        <Grid item lg={8} md={7} sm={12} xs={12} className="grid-item">
          <GridPaper subheader="Search results">
            <GridPaperSearch/>
          </GridPaper>
        </Grid>
        <Grid item lg={4} md={5} sm={12} xs={12} className="grid-item">
          <GridPaper subheader="Friends">
            <GridPaperFriends/>
          </GridPaper>
        </Grid>
      </Grid>
    </div>
  );
};

export default FriendsGrid;
