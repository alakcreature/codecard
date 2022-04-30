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
    let [feedbackmodal, setfeedbackmodal] = useState(false);

    let websiteratingarray = Array.from({length: 10}).fill(['1']).flat();
    let recommendcparray = Array.from({length: 10}).fill(['1']).flat();

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
            setfeedbackmodal(false);
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

    useEffect(()=>{
        window.onclick = (e)=>{
            let modalContent = document.querySelector("#infomodal");
           
            if(e.target === modalContent){
                // console.log("outside modal div clicked")
                setfeedbackmodal(false);
            }
        }
    },[feedbackmodal]);



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
                        <li className="nav-item navbar-new-icon">
                            <Link className="nav-link" to={{pathname: "https://blogs.codecard.in"}} target="__blank">Blogs</Link>
                            <div className="icon-new">new</div>
                        </li>
                        <li className="nav-item feedbackbtn">
                            <Link className="nav-link" to="#" onClick={()=>setfeedbackmodal(true)}>Feedback</Link>
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
                                    <i className="fas fa-code-branch" onClick={()=>setshowupdatebox(!showupdatebox)}>
                                    </i>
                                    {showupdatebox && (
                                        <div className="update-box">
                                            <header className="update-header">
                                                All Updates
                                            </header>
                                            <div className="update-inner">
                                                <div className="update-content">
                                                    <span>
                                                        2 Days Ago
                                                    </span>
                                                    <p>Hackerearth handle has been added in profile section</p>
                                                </div>
                                                <div className="update-content">
                                                    <span>5 Days Ago</span>
                                                    <p>Contests Fetch Bug Fixed</p>
                                                </div>
                                                <div className="update-content">
                                                    <span>40 Days Ago</span>
                                                    <p>Blog on Cron Job Scheduler has been published</p>
                                                </div>
                                                <div className="update-content">
                                                    <span>50 Days Ago</span>
                                                    <p>Sheet 180 has been added</p>
                                                </div>
                                                <div className="update-content">
                                                    <span>61 Days Ago</span>
                                                    <p>Various filters has been added for pratice questions</p>
                                                </div>
                                                <div className="update-content">
                                                    <span>65 Days Ago</span>
                                                    <p>Social Media OAuth Added (Google)</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </li>
                                
                                <li>
                                    <Link to="/profile" onClick={()=>setnavbutton(!navbutton)}>
                                        <i className="fas fa-user"></i>
                                    </Link>
                                </li>

                                <li>
                                    {Auth.isLoggedIn 
                                        ?
                                        (
                                            <Link to="#" onClick={()=>{
                                                setnavbutton(!navbutton);
                                                handlesignout();
                                            }}>
                                                <i className="fas fa-sign-out"></i>
                                            </Link>
                                        )
                                        :
                                        (
                                            <Link to="/signin" onClick={()=>{
                                                setnavbutton(!navbutton);
                                            }}>
                                                <i className="fas fa-sign-in"></i>
                                            </Link>
                                        )
                                        }
                                </li>
                            </ul>
                        </>
                    )}
                    {/* {showsearchbar && (
                        <form className="d-flex homepage-search-form" onSubmit={handlenavsearch}>
                            <input onChange={(e)=>setnavsearch(e.target.value)} className="form-control form-control-sm mr-2" type="search" placeholder="Search problems by name,tags..." aria-label="Search" />
                            <button className="btn btn-sm btn-outline-warning" type="submit" >Search</button>
                        </form>
                    )} */}

                </div>
            </div>
        </nav>
        
        {feedbackmodal &&
            (
                <div className="feedback-info-modal" id="infomodal">
                    <div className="info-modal-main">
                        <span className="info-closebtn" onClick={()=>{setfeedbackmodal(false)}}>&times;</span>
                        <div className="info-modal-inner">
                            <div className="info-header">
                                <h2>What do you think about us?</h2>
                                <hr/>
                            </div>
                            <div className="info-content">
                                <div className="main-feedback">
                                    <div className="main-feedback-inner">
                                        <form onSubmit={handlefeedback}>

                                            <div className="q1">
                                                <h3>1. On a scale of 1 - 10 how much satisfied you were with the website?</h3>
                                                {websiteratingarray.map((d,index)=>(
                                                    <div className="form-check form-check-inline" key={index}>
                                                        <input onChange={(e)=>{
                                                            setwebsiterating(e.target.value);
                                                        }} className="form-check-input" type="radio" name="websiterating" id="websiterating" value={index+1} />
                                                        <label className="form-check-label" htmlFor="websiterating">{index+1}</label>
                                                    </div>    
                                                ))}
                                            </div>

                                            <div className="q2">
                                                <h3>2. What was the best feature you came across?</h3>
                                                <select
                                                className="form-select form-select-sm"
                                                aria-label=".form-select-sm example"
                                                onClick={(e)=> setfeature(e.target.value)}
                                                >
                                                    <option value="Practice">Practice</option>
                                                    <option value="Overall Ratings System">Overall Ratings System</option>
                                                    <option value="Leaderboard">Leaderboard</option>
                                                </select>
                                            </div>

                                            <div className="q3">
                                                <h3>3. On what domain you want us to improve?</h3>
                                                <select 
                                                className="form-select form-select-sm" 
                                                aria-label=".form-select-sm example"
                                                onClick={(e)=> setdomain(e.target.value)}
                                                >
                                                    <option value="UI">UI</option>
                                                    <option value="UX">UX</option>
                                                    <option value="Functionality">Functionality</option>
                                                </select>
                                            </div>

                                            <div className="q4">
                                                <h3>4. Any important feature you think we are missing out?</h3>
                                                <textarea 
                                                className="form-control" 
                                                name="question4" 
                                                cols="30" 
                                                rows="4"
                                                onChange={(e)=> setadditional_feature(e.target.value)}
                                                ></textarea>
                                            </div>

                                            <div className="q5">
                                                <h3>5. How likely are you going to suggest this website as a CP manager to your peers?</h3>
                                                {recommendcparray.map((d,index)=>(
                                                    <div className="form-check form-check-inline" key={index}>
                                                        <input onChange={(e)=>{
                                                            setrecommend_cp(e.target.value);
                                                        }} className="form-check-input" type="radio" name="recommendcp" id="recommendcp" value={index+1} />
                                                        <label className="form-check-label" htmlFor="recommendcp">{index+1}</label>
                                                    </div>    
                                                ))}
                                            </div>

                                            <div className="q6">
                                                <h3>6. That was a lot but if you still have something, let us know below:</h3>
                                                <textarea 
                                                className="form-control" 
                                                name="question4" 
                                                cols="30" 
                                                rows="4"
                                                onChange={(e)=>{setanything_else(e.target.value);}}
                                                ></textarea>
                                            </div>

                                            <div className="q4">
                                                <h3>
                                                    7. We want to credit your valuable suggestion, 
                                                    if you can share your codecard username?
                                                </h3>
                                                <textarea 
                                                className="form-control" 
                                                name="question4" 
                                                cols="30" 
                                                rows="4"
                                                onChange={(e)=>{setcodecard_username(e.target.value);}}
                                                ></textarea>
                                            </div>

                                            <button type="submit">Submit</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
