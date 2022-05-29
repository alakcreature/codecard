import React, {useEffect, useState} from 'react'
import './AddUsername.css'
import staticimages from "../../pages/staticImagesLink";
import {connect} from 'react-redux';
import apis from '../../services/apis';
import http from '../../services/httpCall';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {setUserDetails} from "../../actions/authAction";
import {profileloader} from "../../actions/profileLoaderAction";
import { useHistory } from 'react-router-dom';
import ProfileLoader from '../Partials/ProfileLoader/ProfileLoader';
import { Redirect } from 'react-router-dom';


function AddUsername(props) {
    const history = useHistory();
    const [username, setusername] = useState("");

    const submit = async(e)=>{
        try{
            e.preventDefault()
            props.profileloader(true)
            let response = await http.post(apis.ADD_CODECARDUSERNAME, {
                username
            });
            console.log(response.data)
            if(response.data.status===200){
                props.setUserDetails(response.data.user)
                props.warning(response.data.message)
                history.push("/profile")
            }else{
                props.error(response.data.message)
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
            {!props.Auth.isLoggedIn?
                <>
                    <Redirect to="/signin"/>
                </>
            :    
            (!(props.Auth.userdetails && Object.keys(props.Auth.userdetails).length>0)) ?
                <ProfileLoader />
            :
                <>
                    {props.Auth.userdetails.codecard_username?
                        <Redirect to="/profile"/>
                    :
                    <div className="container-fluid main-content">
                        <div className="addusername-main-content-inner">
                            <div className="form-box">
                                <form onSubmit={submit} className="addusername-form">
                                    <h3>You are just one step away.</h3>
                                    <div className="col input-group mb-3">
                                        <input type="text" value={username} onChange={(e)=>setusername(e.target.value)} className="form-control form-control-sm" placeholder="CodeCard username" aria-label="registeredemail" aria-describedby="registeredemail" required/>
                                        <button className="btn btn-warning btn-sm" type="submit" id="registeredemail">Add Here</button>
                                    </div>
                                </form>
                            </div>
                            <div className="addusername-character-box">
                                <div className="addusername-img">
                                    <img src={staticimages.Confirm} alt=""/>
                                </div>
                                <div className="addusername-box-content">
                                    <p>CodeCard Identity</p>
                                    <h6>Welcome to our ecosystem</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </>
            }
        </>
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
    info,
    setUserDetails
})(AddUsername);
