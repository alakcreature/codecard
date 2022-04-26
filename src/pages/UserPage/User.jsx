import React,{useState, useEffect} from 'react'
import "./User.css";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import staticimages from "../staticImagesLink";
import { Link, useHistory, useParams } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {connect} from 'react-redux';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {profileloader} from "../../actions/profileLoaderAction";
import http from '../../services/httpCall';
import apis from '../../services/apis';


// Change api end point in fetch details funtion.
function User({dark,error,success,warning,info, profileloader}) {
    let history = useHistory();
    let [hidespan,sethidespan] = useState(false);
    let [showfullabout,setshowfullabout] = useState(false);
    let [userdetails,setuserdetails] = useState({});
    let [solved, setsolved]= useState([]);
    let [showscoremodal, setshowscoremodal] = useState(false);
    let {username} = useParams();

    let fetchUserDetails = async()=>{
        try{
            profileloader(true);
            let response = await http.get(`${apis.GET_OTHER_USER_INFO}/${username}`);
            console.log(response.data.data);

            if(response.data.status===200){
                setsolved(response.data.data.problemsolved);
                setuserdetails(response.data.data);
                if(response.data.data.error &&response.data.data.error.length>0){
                    response.data.data.error.forEach((error_el)=>{
                        error(error_el);
                    })
                }
            }else if(response.data.status===409){
                // console.log(result.data.error);
                dark("profile not found");
                history.push("/networkerror");
            }

        }
        catch(err){
            // console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
                dark("please connect to internet");
            }else{
                dark("so sorry, please try after sometime");
            }
        }finally{
            profileloader();
        }

    }

    useEffect(()=>{
        fetchUserDetails();
        // eslint-disable-next-line
    },[]);

    return (
        <>
            {showscoremodal && (
            <div className="scoreinfo-modal" id="scoreinfomodal">
                <div className="scoreinfo-modal-main">
                <div className="scoreinfo-modal-inner">
                    <span className="scoreinfo-closebtn" onClick={()=>{setshowscoremodal(false)}}>&times;</span>
                    <div className="scoreinfo-header">
                        <h2>Well, what's your codec score?</h2>
                        <hr/>
                    </div>
                    <div className="scoreinfo-content">
                        <p>This place is all about your growth.
                            Our Codec score is a very comprehensive tool that lets you monitor your performance and lets you track your growth.
                            The backbone of this tool is a very sophisticated algorithm that considers a bunch of features related to every question you solve,
                            how did you solve it, and a lot of other factors. Guess what? 
                            This is not the end, this tool will also help you by projecting where you 
                            would stand if you keep going at the same rate.
                        </p>
                    </div>
                </div>
                </div>
            </div>
        )}

            <div className="user-main-div">
                <div className="container">
                    {/* Main Content */}
                    <div className="container-fluid main-content ">
                        <div className="profile-main-content-inner">
                            <div className="profile-info">
                                <div className="profile-img" >
                                    {Object.keys(userdetails).length===0
                                    ?
                                    <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                        <p style={{margin:0}}>
                                            <Skeleton circle={true} width={140} height={140}/>
                                        </p>
                                    </SkeletonTheme>
                                    :
                                        userdetails.imageurl===""
                                        ?
                                        (
                                            <img src={staticimages.UserAvatar} alt="username"></img>
                                        )
                                        :
                                        <img src={userdetails.imageurl} alt="username"/>
                                    }
                                </div>
                                <div className="user-info">
                                    <div className="username-div">
                                        {
                                            Object.keys(userdetails).length===0
                                            ?
                                            <div className="username-div-skeleton">
                                                <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                                    <p>
                                                        <Skeleton count={1}/>
                                                    </p>
                                                </SkeletonTheme>
                                            </div>
                                            :
                                            <>
                                            <h4>{userdetails && userdetails.firstname} {userdetails && userdetails.lastname}</h4>
                                            </>
                                        }
                                    </div>
                                    
                                    <div className="collegename-div">
                                        {
                                            Object.keys(userdetails).length===0
                                            ?
                                            <div className="collegename-div-skeleton">
                                                <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                                    <p>
                                                        <Skeleton count={1}/>
                                                    </p>
                                                </SkeletonTheme>
                                            </div>
                                            :
                                            <>
                                            
                                            <h6>{userdetails && (userdetails.college===undefined || userdetails.college==="undefined" || userdetails.college==="") ? "-": userdetails.college}</h6>
                                            {/* {showeditoptions &&
                                            <i className="fas fa-pen" onClick={()=>setupdatecollege(!updatecollege)}></i>
                                            } */}
                                            </>
                                        }
                                    </div>
                                    
                                </div>
                            </div>

                            {/* About Section */}
                            <div className={`about ${showfullabout?"a-tag-expand":""}`}>
                                <header>
                                    <div className="about-div">
                                        <h3>About</h3>
                                        {/* {showeditoptions &&
                                        <i className="fas fa-pen" onClick={()=>setupdateabout(true)}></i>
                                        } */}
                                    </div>

                                </header>
                                {Object.keys(userdetails).length===0
                                ?
                                <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                    <p>
                                        <Skeleton count={3}/>
                                    </p>
                                </SkeletonTheme>
                                :
                                <p className="about-p">
                                    {userdetails.about}
                                </p>
                                
                                }

                                {Object.keys(userdetails).length===0
                                ?
                                <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                    <p>
                                        <Skeleton count={1}/>
                                    </p>
                                </SkeletonTheme>
                                :
                                <span className={`about-span-tag ${hidespan?"hide":""}`}>
                                    ...
                                    <Link to="#" className="about-a-tag"
                                        onClick={()=>{
                                            sethidespan(true);
                                            setshowfullabout(true);
                                        }}
                                    >
                                        see more
                                    </Link>
                                </span>
                                }
                            </div>

                            {/* Problems Solved Section */}
                            <div className="problemsolvedmain">
                                <header>
                                    <div className="problemsolvedinner">
                                        <h3>Problems Solved</h3>
                                        {/* {showeditoptions &&
                                        <i className="fas fa-pen" onClick={()=>setupdateabout(true)}></i>
                                        } */}
                                    </div>

                                </header>

                                <div className="solvedproblemslist">
                                    {/* <ul>
                                    {solved  && solved.length!==0 && solved.map((problem,index)=>(
                                        <li key={index}><Link to={{pathname: (problem.link)}}>{problem.name}</Link></li>
                                    ))
                                    }
                                    </ul> */}
                                    {solved  && solved.length!==0 ?
                                    <ul>
                                    {solved.map((problem,index)=>(
                                        <li key={index}><Link to={{pathname: (problem.link)}} target="_blank">{problem.name}</Link></li>
                                    ))
                                    }
                                    </ul>
                                    :
                                    <p>Hold on for a moment, this ship is yet to sail.</p>
                                    }
                                </div>

                            </div>

                            {/* Profile Ratings */}
                            <div className="ratings">
                                <header>
                                <div className="rating-heading">
                                    <h3>Profile Ratings</h3>
                                </div>
                                </header>

                                <div className="user-ratings">
                                    <ul>
                                        <li>
                                            {userdetails && userdetails.codechef && userdetails.codechef===-1 ?
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="codechef" className="user-ratings-btn">
                                                        <img src={staticimages.Codechef} alt="codechef rating" />
                                                    </button>
                                                    <ReactTooltip place="top" id="codechef" type="info" effect="float">
                                                            <span>CC handle not added</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            )
                                            :
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="codechef" className="user-ratings-btn">
                                                        <img src={staticimages.Codechef} alt="codechef rating" />
                                                    </button>
                                                    <ReactTooltip place="top" id="codechef" type="info" effect="float">
                                                            <span>Your codechef rating: {userdetails.codechef}</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            )
                                            }
                                        </li>

                                        <li>
                                            {userdetails && userdetails.codeforces && userdetails.codeforces===-1 ?
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="codeforces" className="user-ratings-btn">
                                                        <img src={staticimages.Codeforces} alt="codeforces rating" />
                                                    </button>
                                                    <ReactTooltip place="top" id="codeforces" type="info" effect="float">
                                                            <span>CF handle not added</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            )
                                            :
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="codeforces" className="user-ratings-btn">
                                                        <img src={staticimages.Codeforces} alt="codeforces rating" />
                                                    </button>
                                                    <ReactTooltip place="top" id="codeforces" type="info" effect="float">
                                                            <span>Your codeforces rating: {userdetails.codeforces}</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            )
                                            }
                                        </li>

                                        <li>
                                            {userdetails && userdetails.leetcode && userdetails.leetcode===-1 ?
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="leetcode" className="user-ratings-btn">
                                                        <img src={staticimages.Leetcode} alt="leetcode problem solved" />
                                                    </button>
                                                    <ReactTooltip place="top" id="leetcode" type="info" effect="float">
                                                            <span>LC handle not added</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            )
                                            :
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="leetcode" className="user-ratings-btn">
                                                        <img src={staticimages.Leetcode} alt="leetcode problem solved" />
                                                    </button>
                                                    <ReactTooltip place="top" id="leetcode" type="info" effect="float">
                                                            <span>Your leetcode problem solved: {userdetails.leetcode}</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            )
                                            }
                                            
                                        </li>

                                        <li>
                                            {userdetails && userdetails.geeksforgeeks && userdetails.geeksforgeeks===-1 ?
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="geeksforgeeks" className="user-ratings-btn">
                                                        <img src={staticimages.GeeksforGeeks} alt="geeksforgeeks problem solved" />
                                                    </button>
                                                    <ReactTooltip place="top" id="geeksforgeeks" type="info" effect="float">
                                                            <span>GeeksforGeeks handle not addd</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            )
                                            :
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="geeksforgeeks" className="user-ratings-btn">
                                                        <img src={staticimages.GeeksforGeeks} alt="geeksforgeeks problem solved" />
                                                    </button>
                                                    <ReactTooltip place="top" id="geeksforgeeks" type="info" effect="float">
                                                            <span>Your geeksforgeeks problem solved: {userdetails.geeksforgeeks}</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            )
                                            }
                                        </li>

                                        <li>
                                            {userdetails && userdetails.hackerearth && userdetails.hackerearth===-1 ?
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="hackerearth" className="user-ratings-btn">
                                                        <img src={staticimages.Hackerearth} alt="hackerearth problem solved" />
                                                    </button>
                                                    <ReactTooltip place="top" id="hackerearth" type="info" effect="float">
                                                            <span>Hackerearth handle not addd</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            )
                                            :
                                            (userdetails.hackerearth===-2
                                            ?
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="hackerearth" className="user-ratings-btn">
                                                        <img src={staticimages.Hackerearth} alt="hackerearth problem solved" />
                                                    </button>
                                                    <ReactTooltip place="top" id="hackerearth" type="info" effect="float">
                                                            <span>{`${userdetails.hackerearth_username} score will be updated in 24 hours`}</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            )
                                            :
                                            (
                                                <React.Fragment>
                                                    <button data-tip="React-tooltip" data-for="hackerearth" className="user-ratings-btn">
                                                        <img src={staticimages.Hackerearth} alt="hackerearth problem solved" />
                                                    </button>
                                                    <ReactTooltip place="top" id="hackerearth" type="info" effect="float">
                                                            <span>Your hackerearth problem solved: {userdetails.hackerearth}</span>
                                                    </ReactTooltip>
                                                </React.Fragment>
                                            ))
                                            }
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="overall-progress">
                                <div className="overall-contest-rating">
                                <h4 data-tip="React-tooltip" data-for="score-info" onClick={()=>{setshowscoremodal(true)}}>
                                    Codec Score:
                                </h4>
                                <ReactTooltip place="top" id="score-info" type="warning" effect="solid">
                                        <span>Click here to know more about it.</span>
                                </ReactTooltip>
                                    {Object.keys(userdetails).length===0
                                    ?
                                    <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                        <p>
                                            <Skeleton width={110} count={1}/>
                                        </p>
                                    </SkeletonTheme>
                                    :
                                    <h5>{userdetails.overall_rating}</h5>
                                    }
                                </div>
                                <div className={`per-day ${userdetails && userdetails.last_perday_change<0?"i-negative":""}`}>
                                    <h4>Per Day Change</h4>
                                    <h5>
                                        <i className={`fa fa-angle-${userdetails && userdetails.last_perday_change>0?"up":"down"}`}></i>
                                        {Object.keys(userdetails).length===0
                                        ?
                                        <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                            <span>
                                            <p style={{margin:0}}>
                                                <Skeleton width={110} count={1}/>
                                            </p>
                                            </span>
                                        </SkeletonTheme>
                                        :
                                        <span>{userdetails.last_perday_change}</span>
                                        }
                                        {/* <span>0.105</span> */}
                                    </h5>
                                </div>
                                <div className="per-day-illustration-right">
                                <img src={staticimages.Skateboard} alt="skateboard" />
                                </div>
                                <div className="per-day-illustration-left">
                                <img src={staticimages.Happy} alt="happy" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


const mapStateToProps= (state) => (
    {
        Loader:state.Loader
    }
)

export default connect(mapStateToProps, {
    profileloader,
    dark,
    error,
    success,
    warning,
    info
})(User);