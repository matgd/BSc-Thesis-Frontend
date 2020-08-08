import React from 'react';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';

const GridPaper = props => {
  return (
    <Paper className="grid-paper">
      <List
        subheader={<ListSubheader className="list-subheader" component="div">{props.subheader}<Divider/></ListSubheader>}
      >
        {props.children}
      </List>
    </Paper>
  );
};

export default GridPaper;
