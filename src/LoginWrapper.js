import React from 'react';
import {Redirect,Route} from 'react-router-dom';
import {connect} from "react-redux";

function LoginWrapper({ children,Auth, ...rest }) {
    console.log(Auth);
    // console.log({...rest});
    return (
        <Route
        {...rest}
        render={({ location }) =>
            !Auth.isLoggedIn ?
            (
            children
            )
            :
            !location.previousroute &&           
            (
                <Redirect to="/profile" />
            )
        }
        />
    );
}

const mapStateToProps = (state) => ({
    Auth : state.Auth
});

export default connect(mapStateToProps,{})(LoginWrapper);
