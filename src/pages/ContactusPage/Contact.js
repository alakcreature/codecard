import React from 'react';
import './Contact.css';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import http from '../../services/httpCall';
import apis from '../../services/apis';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import {profileloader} from "../../actions/profileLoaderAction";
import { useHistory } from 'react-router-dom';
import staticimages from "../staticImagesLink";

// Handle error alerts
function Contact({dark,error,success,warning,info,profileloader,loader}) {
    let history = useHistory();
    let [name,setname] = useState("");
    let [email, setemail] = useState("");
    let [suggestions, setsuggestions] = useState("");
    let [codecard_username, setcodecard_username] = useState("");
    let [connectwithus, setconnectwithus] = useState("");

    const handlesubmit = (e)=>{
        profileloader(true);
        e.preventDefault();
        http.post(apis.CONTACT,{
            name,
            email,
            suggestions,
            codecard_username,
            connectwithus
        })
        .then((result)=>{
            // console.log(result);
            if(result.data.status===200){
                info("Thanks for your time and valuable suggestions.");
            }else{
                error("Some error has occured,please try after some time.");
            }
        })
        .catch((err)=>{
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
            }
            error(err.message);
        }).finally(()=>{
            profileloader();
        });
        e.target.reset();
    }
    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);
    return (
        <div className="container">
            <div className="container-fluid main-content ">
                <div className="contact-main-content-inner">
                    {/* Contact Header Box */}
                    <div className="contact-box-header">
                        <div className="contact-box-header-content">
                            <header>Contact Us (contactus@codecard.co.in)</header>
                            <hr />
                            <p>
                            We would love to hear from you about how you are enjoying using our website
                            and fall in love with competitive programming. You can add a little spice in it by
                            sharing your valuable suggestions with us so that we can serve you better.
                            Thanks again for your time because...
                            </p>
                            <h4 className="contact-box-header-quote">All we need is your love</h4>
                            <h6 className="contact-box-header-quote">- By Joker Bhaiya</h6>
                        </div>
                        <div className="contact-box-header-img">
                            <img src={staticimages.ContactPanda} alt="" />
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form">
                        <div className="contact-form-inner">
                            <form id="contactform" onSubmit={handlesubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input 
                                    type="text" 
                                    className="form-control" 
                                    id="name" 
                                    aria-describedby="name"
                                    onChange={(e)=>{setname(e.target.value);}}
                                    required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="emailid" className="form-label">Email</label>
                                    <input 
                                    type="email" 
                                    className="form-control" 
                                    id="emailid" 
                                    aria-describedby="email"
                                    onChange={(e)=>{setemail(e.target.value);}}
                                    />
                                    <div id="email" className="form-text">By your email, we can get in touch with you and we will never share your email with anyone else.</div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="suggestion" className="form-label">
                                        Suggestions to improve the site so that we can give you the best experience 
                                    </label>
                                    <textarea 
                                    className="form-control" 
                                    id="suggestion" 
                                    cols="30" 
                                    rows="4"
                                    onChange={(e)=>{setsuggestions(e.target.value);}}
                                    required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="connectwithus" className="form-label">
                                        We really want to credit your valuable suggestions, if you can share your codecard username
                                    </label>
                                    <input 
                                    type="text" 
                                    className="form-control" 
                                    id="name" 
                                    aria-describedby="name"
                                    placeholder="(Optional)"
                                    onChange={(e)=>{setcodecard_username(e.target.value);}}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="connectwithus" className="form-label">
                                        Write us how you can connect with us as a competitive
                                        programmer or as a developer?
                                    </label>
                                    <textarea 
                                    className="form-control" 
                                    id="connectwithus" 
                                    cols="30" 
                                    rows="4" 
                                    placeholder="(Optional)"
                                    onChange={(e)=>{setconnectwithus(e.target.value);}}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-warning">Submit</button>
                            </form>
                            
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
    loader,
    dark,
    error,
    success,
    warning,
    info
})(Contact);
