import React from 'react';

class BoxContainer extends React.Component {
  render() {
    return (
      <div style={{marginTop: "4.75rem", marginLeft: "10%", marginRight: "10%"}}>
        {this.props.children}
      </div>
    );
  }

}

export default BoxContainer;

