import React, { useEffect } from 'react';
import {Redirect,Route} from 'react-router-dom';
import {connect} from "react-redux";

function LoginWrapper({ children,Auth, ...rest }) {

    
    return (
        <Route
        {...rest}
        render={({ location }) =>
            !Auth.isLoggedIn ?
            (
            children
            )
            :
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
