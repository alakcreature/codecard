import React from 'react';
import {connect} from 'react-redux';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import PrivateRoute from "../../PrivateWrapper";
import {login,logout,setUserDetails} from "../../actions/authAction";
import LoginWrapper from "../../LoginWrapper";
import LoginComponent from "../../pages/Loginpage/LoginComponent.jsx";
import ChangePasswordComponent from "../ChangePassword/ChangePasswordComponent";
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import Navbar from '../../pages/NavbarPage/Navbar';
import Footer from '../../pages/FooterPage/Footer';
import Home from '../../pages/Homepage/Home';
import Contest from '../../pages/ContestPage/Contest';
import Contact from '../../pages/ContactusPage/Contact';
import PrivacyPolicy from '../../pages/PrivacyPolicyPage/PrivacyPolicy';
import Terms from '../../pages/TermsPage/Terms';
import ErrorPage from '../../pages/ErrorPage/Error';
import About from '../../pages/AboutPage/About.jsx';
import EmailConfirmationComponent from '../EmailConfirmation/EmailConfirmationComponent';
import ProfileWrapper from '../ProfileWrapper/ProfileWrapper';
import Leaderboard from '../../pages/LeaderboardPage/Leaderboard';
import SocialLogin from '../../pages/SocialLoginPage/SocialLogin';
import User from '../../pages/UserPage/User';
import Sheets from '../../pages/Sheets/Sheets';
import Sheet from '../../pages/Sheet/Sheet';
import Practice from '../../pages/PracticePage/Practice';
import AddUsername from '../../pages/AddUsername/AddUsername';

function AuthGuard(props) {

    //auth check if token exist
    let Token  = localStorage.getItem("Token");
    // console.log(Token);
    if(Token && Token!=="null" && Token!=="undefined"){
        props.login(Token,{});
    }


    return (
        <React.Fragment>
            <BrowserRouter>
                {/* Navbar */}
                <Navbar />
                <Switch>
                <LoginWrapper exact path="/signin">
                    <LoginComponent />
                </LoginWrapper>
                <Route exact path="/user/sociallogin" component={SocialLogin} />
                <PrivateRoute exact path="/profile">
                    <ProfileWrapper />
                </PrivateRoute>
                <Route exact path="/addusername" component={AddUsername} />
                {/* <Route exact path="/profile/:username" component={User}/> */}
                <Route exact path="/" component={Home}/>
                <Route path="/sheets" component={Sheets}/>
                <Route exact path="/sheet/:sheetid" component={Sheet}/>
                <Route path="/practice" component={Practice}/>
                <Route exact path="/contests" component={Contest}/>
                <Route exact path="/contactus" component={Contact}/>
                <Route exact path="/privacypolicy" component={PrivacyPolicy}/>
                <Route exact path="/terms" component={Terms}/>
                <Route exact path="/leaderboard" component={Leaderboard}/>
                <Route exact path="/about" component={About}/>
                <Route exact path="/emailconfirmation/:token" component={EmailConfirmationComponent}/>
                <Route exact path="/changepassword/:resetToken" component={ChangePasswordComponent}/>
                <Route exact path="/forgotpassword" component={ForgotPassword}/>
                <Route exact path="/:username" component={User}/>
                <Route exact path="/networkerror" component={ErrorPage} />
                <Route component={ErrorPage}/>
                </Switch>
                {/* Footer */}
                <Footer />
            </BrowserRouter>
        </React.Fragment>
    )
}


const mapStateToProps= (state) => {
    return {}
  }
  
  export default connect(mapStateToProps, {
    login,
    logout,
    setUserDetails
  })(AuthGuard);
