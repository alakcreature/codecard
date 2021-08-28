import React,{useState} from 'react';
import {useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import './ProfileWrapper.css';
import http from "../../services/httpCall";
import apis from "../../services/apis";
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import {logout} from "../../actions/authAction";
import { useEffect } from 'react';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import ProfileLoader from '../../pages/Partials/ProfileLoader/ProfileLoader';


function ProfileWrapper({dark,error,success,warning,info,loader,logout}) {
    let history = useHistory();
    let [loadcomponent,setloadcomponent] = useState(false);

    const checkvalidity = ()=>{
        http.get(apis.VALIDATION)
        .then((result)=>{
            console.log(result);
            if(result.data.status===502){
                // Invalid Token
                logout();
            }else{
                setloadcomponent(true);
            }
        })
        .catch((err)=>{
            console.log(err);
            if(err.message==="Network Error"){
                error("Network Error");
                history.push("/networkerror");
            }else{
                error(err.message);
            }
        })
    }

    useEffect(()=>{
        checkvalidity();
        // eslint-disable-next-line
    },[]);

    useEffect(()=>{console.log(loadcomponent)},[loadcomponent]);

    return (
        <>
        {!loadcomponent ?
        <ProfileLoader />
        :
        <ProtectedRoute />
        }
        </>
    )
}


const mapStateToProps= (state) => (
    {
        Loader:state.Loader
    }
)

export default connect(mapStateToProps, {
    logout,
    loader,
    dark,
    error,
    success,
    warning,
    info
})(ProfileWrapper);
