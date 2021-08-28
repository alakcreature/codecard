import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import {dark,warning} from './actions/alertAction';
import { useEffect } from 'react';



function PrivateRoute({ children,Auth, path, dark, warning, ...rest }) {
    // console.log("Yes,here");
    // console.log(path);
    console.log(Auth.isLoggedIn);
    useEffect(()=>{
        if(!Auth.isLoggedIn){
            warning("Please sign in first.")
        }
        // eslint-disable-next-line
    },[]);
    return (
        <Route
            {...rest}
            render={() =>
                Auth.isLoggedIn ? (
                    children
                ) : (
                <Redirect
                    to={{
                        pathname: "/signin",
                        previousroute: path
                    }}
                />
                )
            }
        />
    );
}

const mapStateToProps = (state) => ({
    Auth : state.Auth
});

export default connect(mapStateToProps,{
    warning,
    dark
})(PrivateRoute);