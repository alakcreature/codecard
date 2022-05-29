import React,{useState} from 'react';
import {Redirect, useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import './ProfileWrapper.css';
import http from "../../services/httpCall";
import apis from "../../services/apis";
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import { logout,setUserDetails} from "../../actions/authAction";
import { useEffect } from 'react';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import ProfileLoader from '../../pages/Partials/ProfileLoader/ProfileLoader';


function ProfileWrapper(props) {
    let history = useHistory();

    const checkvalidity = ()=>{
        http.get(apis.VALIDATION)
        .then((result)=>{
            if(result.data.status===502){
                // Invalid Token
                props.logout();
            }else{
                props.setUserDetails(result.data.user);
            }
        })
        .catch((err)=>{
            console.log(err);
            if(err.message==="Network Error"){
                props.error("Network Error");
                history.push("/networkerror");
            }else{
                props.error(err.message);
            }
        })
    }

    useEffect(()=>{
        if(!(props.Auth.userdetails && Object.keys(props.Auth.userdetails).length>0)){
            checkvalidity();
        }
        // eslint-disable-next-line
    },[]);

    return (
        <>
        {!(props.Auth.userdetails && Object.keys(props.Auth.userdetails).length>0)
        ?
            <>
                <ProfileLoader />
            </>
        :
        
        <>
            {props.Auth.userdetails.codecard_username ?
                <>
                    <ProtectedRoute />
                </>
            :
            <>
                {/* {console.log("heeeiiiii")} */}
                <Redirect to="/addusername"/>
            </>
            }
        </>
        // <ProtectedRoute />
        }
        </>
    )
}


const mapStateToProps= (state) => (
    {
        Loader:state.Loader,
        Auth: state.Auth
    }
)

export default connect(mapStateToProps, {
    logout,
    loader,
    dark,
    error,
    success,
    setUserDetails,
    warning,
    info
})(ProfileWrapper);
