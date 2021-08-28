import React from 'react'
import { useState } from 'react';
import {connect} from 'react-redux';
import apis from '../../services/apis';
import http from '../../services/httpCall';
import './ForgotPassword.css';
import {dark,error,success,warning,info} from '../../actions/alertAction';
// import {loader} from "../../actions/loaderAction";
import {profileloader} from "../../actions/profileLoaderAction";
import staticimages from "../../pages/staticImagesLink";
import { useHistory } from 'react-router-dom';

function ForgotPassword(props) {
    let history = useHistory();
    let [registeredemail,setregisteredemail] = useState("");

    let submit = async(e)=>{
        e.preventDefault();
        try{
            props.profileloader(true);
            if(!registeredemail){
                // Handle the blank registeredemail part.
                window.alert("Enter your mail id first");
            }else{
                // console.log(registeredemail);
                let response = await http.post(apis.FORGOT_PASSWORD,{
                    email:registeredemail
                });

                if(response.data.status===200){
                    props.warning(response.data.message);
                }else{
                    props.error(response.data.error);
                }
            }
        }
        catch(err){
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
            }
            props.error("so sorry, please try after sometime");
        }finally{
            props.profileloader();
        }
    }

    return (
        <div className="container">
            <div className="container-fluid main-content">
                <div className="forgot-main-content-inner">
                    <div className="form-box">
                        <form onSubmit={submit} className="forgot-form">
                            <h3>Enter your registered email ID.</h3>
                            {/* <input type="text" onChange={(e)=>{
                                setregisteredemail(e.target.value);
                            }}/> */}
                            <div className="col input-group mb-3">
                                <input type="email" value={registeredemail} onChange={(e)=>setregisteredemail(e.target.value)} className="form-control form-control-sm" placeholder="Registered Email*" aria-label="registeredemail" aria-describedby="registeredemail" required/>
                                <button className="btn btn-warning btn-sm" type="submit" id="registeredemail">Send me the reset link</button>
                            </div>
                         </form>
                    </div>
                    <div className="forgot-character-box">
                        <div className="forgot-img">
                            <img src={staticimages.Bhoola} alt=""/>
                        </div>
                        <div className="forgot-box-content">
                            <p>Bhoolaa...</p>
                            <h6>No worries, you change your password here.</h6>
                        </div>
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
    profileloader,
    dark,
    error,
    success,
    warning,
    info
})(ForgotPassword);
