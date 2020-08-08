import React from 'react';

import NavBar from './NavBar';
import LikeNeverBeforeBox from './LikeNeverBeforeBox';
import BoxContainer from './BoxContainer';

// eslint-disable-next-line
import style from '../../css/index.css';


const Index = () => {
  return (
    <div>
      <NavBar/>
      <BoxContainer>
        <LikeNeverBeforeBox/>
      </BoxContainer>
    </div>
  );
};

export default Index;
