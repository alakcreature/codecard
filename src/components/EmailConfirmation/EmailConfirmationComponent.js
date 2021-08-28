import React from 'react'
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {connect} from 'react-redux';
import apis from '../../services/apis';
import http from '../../services/httpCall';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import './EmailConfirmationComponent.css';
import staticimages from "../../pages/staticImagesLink";

function EmailConfirmationComponent(props) {
    let history = useHistory();
    let params = useParams();
    const {token} = params;
    // console.log(token);
    
    const emailconfirm = ()=>{
        props.loader(true);
        http.get(`${apis.EMAILCONFIRM}/${token}`)
        .then((result)=>{
            props.loader();
            console.log(result);
            if(result.data.status===200){
                props.info(result.data.message);
                history.push("/signin");
            }else{
                props.error(result.data.error);
                history.push("/signin");
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
            history.push("/signin");
        });
    }

    useEffect(()=>{
        emailconfirm();
        // eslint-disable-next-line
    },[]);
    return (
        <div className="container">
            <div className="container-fluid main-content">
                {/* Confirming your acocunting. */}
                <div className="emailconfirm-main-content-inner">
                    <h2>Thanks for having patience.</h2>
                    <h4>We are confirming your account...</h4>
                    <h4>It will be redirected to the signin page...</h4>
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
    loader,
    dark,
    error,
    success,
    warning,
    info
})(EmailConfirmationComponent);
