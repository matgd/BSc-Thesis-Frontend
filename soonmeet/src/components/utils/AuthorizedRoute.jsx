import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


const AuthorizedRoute = ({ component: Component, isSignedIn, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
         isSignedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

function mapStateToProps(state) {
  const { isSignedIn } = state.authReducer;
  return { isSignedIn };
}

export default connect(mapStateToProps, {})(AuthorizedRoute);
