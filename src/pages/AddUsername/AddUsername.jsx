import React, {useState} from 'react'
import './AddUsername.css'
import staticimages from "../../pages/staticImagesLink";
import {connect} from 'react-redux';
import apis from '../../services/apis';
import http from '../../services/httpCall';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {setUserDetails} from "../../actions/authAction";
import {profileloader} from "../../actions/profileLoaderAction";
import { useHistory } from 'react-router-dom';


function AddUsername({dark, error, profileloader, setUserDetails}) {
    const history = useHistory();
    const [username, setusername] = useState("");

    const submit = async(e)=>{
        try{
            e.preventDefault()
            profileloader(true)
            let response = await http.post(apis.ADD_CODECARDUSERNAME, {
                username
            });
            console.log(response.data)
            if(response.data.status===200){
                setUserDetails(response.data.user)
                warning(response.data.message)
                history.push("/profile")
            }else{
                error(response.data.message)
            }
        }
        catch(err){
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
            }
            error("so sorry, please try after sometime");
        }finally{
            profileloader();
        }
    }


    return (
        <>

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
