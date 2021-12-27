import React from 'react';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import {connect} from 'react-redux';
import './App.css';
// import http from "./services/httpCall"
// import apis from "./services/apis"
import {login,logout,setUserDetails} from "./actions/authAction";
import Loader from './pages/Partials/Loader';
import Alert from './pages/Partials/Alert';
import ProfileLoader from './pages/Partials/ProfileLoader/ProfileLoader';
import RouteGuard from './components/RouteGuard/RouteGuard';


function App(props) {

  //auth check if token exist
  let Token  = localStorage.getItem("Token");
  // console.log(Token);
  if(Token && Token!=="null" && Token!=="undefined"){
    props.login(Token,{});
  }

  return (
    <React.Fragment>
      {/* Global Alerts */}
      <Alert />
      {/* Global Loader */}
      <Loader />
      <ProfileLoader />

      <RouteGuard />
    </React.Fragment>
  );
}

const mapStateToProps= (state) => {
  return {}
}

export default connect(mapStateToProps, {
  login,
  logout,
  setUserDetails
})(App);
