import React,{useState} from 'react';
import {connect} from 'react-redux';
import {useHistory, useParams} from 'react-router-dom';
import apis from '../../services/apis';
import http from '../../services/httpCall';
import './ChangePasswordComponent.css';
// import Bhoola from '../../pages/static/bhoola.png';
import staticimages from "../../pages/staticImagesLink";
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";


function ChangePasswordComponent(props){
    let [newpassword,setnewpassword] = useState("")
    let [confirmnewpassword,setconfirmnewpassword] = useState("")
    let {resetToken} = useParams();
    let history = useHistory();
    console.log(resetToken)

    const togglepassword = ()=>{
        let pel = window.document.querySelectorAll(".password-field");
        pel.forEach((sel)=>{
            if(sel.type==="password"){
                sel.type="text";
            }else{
                sel.type="password";
            }
        });
    }

    const onsubmit = (e) =>{
        e.preventDefault();
        // console.log(token);
        props.loader(true);
        if(newpassword!==confirmnewpassword){
            return props.error("please match your passwords")
        }
        http.post(apis.RESET_PASSWORD,{
            newpassword,
            resetLink:resetToken, 
        })
        .then((result)=>{
            console.log(result);
            props.loader();
            if(result.data.status===200){
                props.info(result.data.message);
                history.push("/signin");
            }else{
                props.error(result.data.error);
            }
        })
        .catch(err=>{
            // Handle the error part.
            props.loader();
            console.log(err);
            if(err.message==="Network Error"){
                props.error("Network Error");
                history.push("/networkerror");
            }else{
                props.error(err.message);
            }
        })
    }

    return (
        <div className="container">
            <div className="container-fluid main-content">
                <div className="changepass-main-content-inner">
                    <div className="changepass-box">
                        <form onSubmit={onsubmit} className="changepass-form">
                            <h3>Enter your new password.</h3>
                            {/* <input type="text" onChange={(e)=>{
                                setregisteredemail(e.target.value);
                            }}/> */}
                            <div className="col input-group mb-3">
                                <input type="password" value={newpassword} onChange={(e)=>setnewpassword(e.target.value)} className="form-control form-control-sm password-field" placeholder="New Password" aria-label="newpassword" aria-describedby="newpassword" required/>
                                {/* <button className="btn btn-warning btn-sm" onClick={togglepassword} type="button" id="newpassword">See it!</button> */}
                            </div>
                            {/* <br/> */}
                            <div className="col input-group mb-3">
                                <input type="password" value={confirmnewpassword} onChange={(e)=>setconfirmnewpassword(e.target.value)} className="form-control form-control-sm password-field" placeholder="Confirm New Password" aria-label="confirmnewpassword" aria-describedby="confirmnewpassword" required/>
                                <button className="btn btn-warning btn-sm" onClick={togglepassword} type="button" id="newpassword">See it!</button>
                            </div>
                            <div className="change-div">
                                <button className="btn btn-warning btn-sm" onClick={onsubmit} type="submit" id="change">Change</button>
                            </div>
                         </form>
                    </div>
                    <div className="changepass-character-box">
                        <div className="changepass-img">
                            <img src={staticimages.Bhoola} alt=""/>
                        </div>
                        <div className="changepass-box-content">
                            <p>Bhoolaa...</p>
                            <h6>No worries, you can change your password here.</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps= (state) => {
    return {
        Auth: state.Auth
    }
  }
  
  export default connect(mapStateToProps, {
    dark,
    error,
    success,
    warning,
    info,
    loader
  })(ChangePasswordComponent);
