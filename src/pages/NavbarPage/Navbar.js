import React from 'react';
import { useState } from 'react';
import {connect} from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import {logout} from "../../actions/authAction";
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {profileloader} from "../../actions/profileLoaderAction";
import './Navbar.css';

import { useEffect } from 'react';
import http from '../../services/httpCall';
import apis from '../../services/apis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Navbar({ Auth,logout,dark,error,success,warning,info, profileloader }) {
    // if(Auth.isLoggedIn){console.log("logged in")}
    let history = useHistory();
    let [navbutton,setnavbutton] = useState(false);
    let [navsearch, setnavsearch] = useState();
    let [website_rating, setwebsiterating] = useState();
    let [feature, setfeature] = useState();
    let [domain, setdomain] = useState();
    let [additional_feature, setadditional_feature] = useState();
    let [recommend_cp, setrecommend_cp] = useState();
    let [anything_else, setanything_else] = useState();
    let [codecard_username, setcodecard_username] = useState();
    let [showsearchbar,setshowsearchbar] = useState(true);
    let [showupdatebox,setshowupdatebox] = useState(false);

    const handlenavsearch = (e)=>{
        e.preventDefault();
        // console.log(navsearch);
        history.push(`/practice?problemsearch=${navsearch}`);
    }

    const handlefeedback = async(e)=>{
        e.preventDefault();
        try{
            // loader(true);
            profileloader(true);
            let response = await http.post(apis.FEEDBACK,{
                website_rating,
                feature,
                domain,
                additional_feature,
                recommend_cp,
                anything_else,
                codecard_username
            })

            // console.log(response);
            if(response.data.status===200){
                // console.log(result);
                success("Your reponse has been recorded, thanks for your feedback.");
            }else{
                error("sorry its our fault, your time & feedback truely matters to us, please try after sometime");                
            }
        }catch(err){
            console.log(err);
            // internet disconnected
            if(!navigator.onLine){
                history.push("/networkerror");
            }
            error("so sorry, please try again after sometime")
        }finally{
            profileloader();
        }
    }
    
    const handlesignout = ()=>{
        logout();
        warning("Thanks for your visit")
    }

    useEffect(()=>{
        let element = window.document.querySelector("#navbarSupportedContent");
        element.className="collapse navbar-collapse"
    },[navbutton]);


    return (
        // Header Section
        <>
        <nav className="navbar navbar-expand-lg navbar-light" >
            <div className="container-fluid">
                <div className="navbar-brand">
                    <Link to="/">CodeCard</Link>
                </div>
                <button className="navbar-toggler" type="button" onClick={()=>{
                        setshowsearchbar(false);
                    }} data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto mb-2 mb-lg-0 navbar-inner">
                        <li className="nav-item">
                            <Link className="nav-link" to="/practice" onClick={()=>setnavbutton(!navbutton)}>Practice</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contests" onClick={()=>setnavbutton(!navbutton)}>Contests</Link>
                        </li>
                        <li className="nav-item navbar-new-icon">
                            <Link className="nav-link" to="/sheets" onClick={()=>setnavbutton(!navbutton)}>Sheets</Link>
                        </li>
                        {!showsearchbar && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile" onClick={()=>setnavbutton(!navbutton)}>Profile</Link>
                                </li>

                                {Auth.isLoggedIn 
                                ?
                                (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="#" onClick={()=>{
                                            setnavbutton(!navbutton);
                                            handlesignout();
                                        }}>Sign Out</Link>
                                    </li>
                                )
                                :
                                (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/signin" onClick={()=>{
                                            setnavbutton(!navbutton);
                                        }}>Sign In</Link>
                                    </li>
                                )
                                }
                            </>
                        )}
                        <li className="nav-item">
                            <Link className="nav-link" to="/leaderboard" onClick={()=>setnavbutton(!navbutton)}>Leaderboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about" onClick={()=>setnavbutton(!navbutton)}>About</Link>
                        </li>
                        <li className="nav-item feedbackbtn">
                            <Link className="nav-link" to={{pathname: "https://codecard.canny.io/feedback"}} 
                            target="_blank"
                            >Feedback</Link>
                        </li>
                    </ul>
                    {showsearchbar && (
                        <>
                            <form className="d-flex homepage-search-form" onSubmit={handlenavsearch}>
                                <input onChange={(e)=>setnavsearch(e.target.value)} className="form-control form-control-sm mr-2" type="search" placeholder="Search problems by name,tags..." aria-label="Search" />
                                <button className="btn btn-sm btn-outline-warning" type="submit" >Search</button>
                            </form>
                            <ul className="navbar-icons">
                                <li className="update-li">
                                    <FontAwesomeIcon 
                                        icon="bell" 
                                        className="update-icon"
                                        onClick={()=>setshowupdatebox(!showupdatebox)}
                                    >
                                        {/* <div></div> */}
                                    </FontAwesomeIcon>

                                    {showupdatebox && (
                                        <div className="update-box">
                                            <header className="update-header">
                                                All Updates
                                            </header>
                                            <div className="update-inner">
                                                <div className="update-content">
                                                    <span>
                                                        May 21, 2022
                                                    </span>
                                                    <p>
                                                        <Link to="/sheet/627551d9a0859b16e87c800b">
                                                            DSA 450 sheet has been added. Check it out now.
                                                            <FontAwesomeIcon icon="link"/>
                                                        </Link>
                                                    </p>
                                                </div>
                                                <div className="update-content">
                                                    <span>
                                                        April 15, 2022
                                                    </span>
                                                    <p>Hackerearth handle has been added in profile section</p>
                                                </div>
                                                <div className="update-content">
                                                    <span>
                                                        April 2, 2022
                                                    </span>
                                                    <p>Contests Fetch Bug Fixed</p>
                                                </div>
                                                <div className="update-content">
                                                    <span>March 2, 2022</span>
                                                    <p>Blog on Cron Job Scheduler has been published</p>
                                                </div>
                                                <div className="update-content">
                                                    <span>January 9, 2022</span>
                                                    <p>Sheet 180 has been added</p>
                                                </div>
                                                <div className="update-content">
                                                    <span>November 15, 2022</span>
                                                    <p>Various filters has been added for pratice questions</p>
                                                </div>
                                                <div className="update-content">
                                                    <span>November 10, 2022</span>
                                                    <p>Social Media OAuth Added (Google)</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </li>
                                
                                {Auth.isLoggedIn 
                                    ?
                                    <>
                                        <li>
                                            <Link to="/profile" onClick={()=>setnavbutton(!navbutton)}>
                                                <FontAwesomeIcon icon="user" />
                                            </Link>
                                        </li>

                                        <li>
                                            <Link to="#" onClick={()=>{
                                                    setnavbutton(!navbutton);
                                                    handlesignout();
                                                }}>
                                                <FontAwesomeIcon icon="arrow-right-from-bracket"/>
                                            </Link>
                                        </li>
                                    </>
                                    :
                                    <li>
                                        <Link to="/signin" onClick={()=>{
                                                setnavbutton(!navbutton);
                                            }}>
                                                <FontAwesomeIcon icon="user" />
                                        </Link>
                                    </li>
                                }
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </nav>
            </>
    )
}

const mapStateToProps= (state) => {
    return {
        Auth: state.Auth
    }
  }
  
  export default connect(mapStateToProps, {
    profileloader,
    logout,
    dark,
    error,
    success,
    warning,
    info
  })(Navbar);
