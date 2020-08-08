import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const LeftRightNav = props => {
  const style = {
    color: props.color
  };

  return (
    <>
      <IconButton
        size={props.size}
        style={style}
        onClick={props.onLeftClick}
        aria-label="left"
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton
        size={props.size}
        style={style}
        onClick={props.onRightClick}
        aria-label="right"
      >
        <ChevronRightIcon />
      </IconButton>
    </>
  );
};

export default LeftRightNav;
