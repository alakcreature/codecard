import React from 'react';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import {connect} from 'react-redux';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
// import http from "./services/httpCall"
// import apis from "./services/apis"
import PrivateRoute from "./PrivateWrapper";
import {login,logout,setUserDetails} from "./actions/authAction";
import LoginWrapper from "./LoginWrapper";
import LoginComponent from "./pages/Loginpage/LoginComponent.jsx";
import ChangePasswordComponent from "./components/ChangePassword/ChangePasswordComponent";
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Navbar from './pages/NavbarPage/Navbar';
import Footer from './pages/FooterPage/Footer';
import Home from './pages/Homepage/Home';
import Contest from './pages/ContestPage/Contest';
import Practice from './pages/PracticePage/Practice';
import Contact from './pages/ContactusPage/Contact';
import PrivacyPolicy from './pages/PrivacyPolicyPage/PrivacyPolicy';
import Terms from './pages/TermsPage/Terms';
import ErrorPage from './pages/ErrorPage/Error';
import About from './pages/AboutPage/About.jsx';
import Loader from './pages/Partials/Loader';
import Alert from './pages/Partials/Alert';
import EmailConfirmationComponent from './components/EmailConfirmation/EmailConfirmationComponent';
import ProfileWrapper from './components/ProfileWrapper/ProfileWrapper';
import ProfileLoader from './pages/Partials/ProfileLoader/ProfileLoader';
import Leaderboard from './pages/LeaderboardPage/Leaderboard';
import SocialLogin from './pages/SocialLoginPage/SocialLogin';
import User from './pages/UserPage/User';
import NewPractice from './pages/NewPracticePage/NewPractice';
// import TestLogin from './pages/TestLogin/TestLogin';

function App(props) {

  //auth check if token exist
  let Token  = localStorage.getItem("Token");
  // console.log(Token);
  if(Token && Token!=="null" && Token!=="undefined"){
    props.login(Token,{});
  }

  return (
    <React.Fragment>
      {/* Global Loader */}
      <Loader />
      <ProfileLoader />
      {/* Global Alerts */}
      <Alert />
      <BrowserRouter>
      {/* Navbar */}
        <Navbar />
        <Switch>
          <LoginWrapper exact path="/signin">
            <LoginComponent />
          </LoginWrapper>
          <Route exact path="/user/sociallogin" component={SocialLogin} />
          {/* <Route exact path="/testlogin" component={TestLogin} /> */}
          <PrivateRoute exact path="/profile">
            <ProfileWrapper />
          </PrivateRoute>
          <Route exact path="/profile/:username" component={User}/>
          <Route exact path="/" component={Home}/>
          <Route path="/practice" component={Practice}/>
          <Route path="/test/practice" exact component={NewPractice}/>
          {/* Make Each Problem Page */}
          {/* <Route exact path="/problem/:problemId" component={Practice}/> */}
          <Route exact path="/contests" component={Contest}/>
          <Route exact path="/contactus" component={Contact}/>
          <Route exact path="/privacypolicy" component={PrivacyPolicy}/>
          <Route exact path="/terms" component={Terms}/>
          <Route exact path="/leaderboard" component={Leaderboard}/>
          <Route exact path="/about" component={About}/>
          <Route exact path="/emailconfirmation/:token" component={EmailConfirmationComponent}/>
          <Route exact path="/changepassword/:resetToken" component={ChangePasswordComponent}/>
          <Route exact path="/forgotpassword" component={ForgotPassword}/>
          {/* <Route exact path="/testloader" component={ProfileLoader}/> */}
          <Route exact path="/networkerror" component={ErrorPage} />
          <Route component={ErrorPage}/>
        </Switch>
        {/* Footer */}
        <Footer />
      </BrowserRouter>
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
