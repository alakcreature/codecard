import React from 'react'
import { Route, Switch } from 'react-router-dom';
import Profile from '../../pages/ProfilePage/Profile';

function ProtectedRoute() {
    console.log("hey");
    return (
        <>
        <Switch>
            <Route exact path="/profile">
                <Profile />
            </Route>

            {/* <Route exact path="/leaderboard">
                <Leaderboard />
            </Route> */}
        </Switch>
        </>
    )
}

export default ProtectedRoute
