import React from 'react';

import timeManagement from '../../img/time_management.svg';


const LikeNeverBeforeBox = () => {
  return (
    <div style={{marginTop: "90px"}}>
      <h1 className="text-center" data-aos="fade-down" data-aos-duration="900" data-aos-once="true">
        Plan meetings like never before
      </h1>
      <img data-aos="fade" data-aos-duration="1000"
           data-aos-delay="500" src={timeManagement}
           alt="Woman sitting on big clock."
           style={{display: "block",
                   marginLeft: "auto",
                   marginRight: "auto",
                   height: "55vh",
                   marginTop: "5%",
                   width: "100%"}} />
    </div>
  );
};

export default LikeNeverBeforeBox;

