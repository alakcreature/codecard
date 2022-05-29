import React from 'react'
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import apis from '../../services/apis';
import http from '../../services/httpCall';
import staticimages from "../../pages/staticImagesLink";
import {login,setUserDetails} from "../../actions/authAction";
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {profileloader} from "../../actions/profileLoaderAction";
import './SocialLogin.css';
import { connect } from 'react-redux';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function SocialLogin({login,profileloader,setUserDetails,error,warning}) {
    // It will help to get the access token by sending 'code' what we have got in the url.
    let params = useQuery();
    let history = useHistory();


    const getuserdata = async()=>{
        try{
            profileloader(true);
            let code=params.get("code");
            // apis.GITHUBAUTHENTICATION
            let response = await http.post(apis.GITHUBAUTHENTICATION,{
                code
            });
            // console.log(response);
            if(response.data.status===200){
                warning(response.data.message);
                login(response.data.token);
                history.push("/signin");
            }else if(response.data.status===500){
                // console.log(response.data.error);
                history.push("/signin");
                warning(response.data.error);
            }
        }catch(err){
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
            }
            error("so sorry, please try again after sometime");
        }finally{
            profileloader();
        }
    }

    useEffect(()=>{
        getuserdata();
         // eslint-disable-next-line
    },[]);

    return (
        <div className="container">
            <div className="container-fluid main-content">
                {/* Confirming your acocunting. */}
                <div className="emailconfirm-main-content-inner">
                    <h2>Thanks for having patience.</h2>
                    <h4>We are confirming your account.</h4>
                    <h4>It will be redirected to your profile page.</h4>
                    <div className="confirm-img-left">
                        <img src={staticimages.Welcome} alt="welcome"/>
                    </div>
                    <div className="confirm-img-right">
                        <img src={staticimages.Confirm} alt="confirm"/>
                    </div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        Auth: state.Auth,
        Loader:state.Loader
    }
}

export default connect(mapStateToProps, {
    login,
    setUserDetails,
    profileloader,
    dark,
    error,
    success,
    warning,
    info
})(SocialLogin);