import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {connect} from 'react-redux';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import './Contest.css';
import http from "../../services/httpCall";
import apis from "../../services/apis";
import staticimages from "../staticImagesLink";
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import {profileloader} from '../../actions/profileLoaderAction';


function Contest({dark,error,success,warning,info,loader, profileloader}) {
    let history = useHistory();
    let [contestdata,setcontestdata] = useState([]);

    const fetchContests = ()=>{
        // loader(true);
        profileloader(true);
        http.get(apis.UPCOMING_CONTESTS)
        .then((result)=>{
            // loader();
            if(result.data.status===200){
                setcontestdata([...result.data.data]);
            }else{
                // console.log(result.data.error);
                error("There is some problem now, you can try after sometime,thanks for your patience.");
            }
        })
        .catch(err=>{
            console.log(err);
            // Handle Error
            if(!navigator.onLine){
                history.push("/networkerror");
            }
            error("so sorry, please try after sometime");
        }).finally(()=>{
            profileloader();
        })
    }

    useEffect(()=>{
        window.scrollTo(0,0);
        fetchContests();
        // eslint-disable-next-line
    },[]);

    useEffect(()=>{console.log(contestdata)},[contestdata]);
    return (
            // Main Content
            <div className="container">
                <div className="container-fluid main-content">
                    {/* Contest Header Box */}
                    <div className="contest-box-header">
                    {/* Contest Box  */}
                    {contestdata.length===0
                    ?
                    <div className="contest-box-skeleton">
                        <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                            <p>
                                <Skeleton count={5}/>
                            </p>
                        </SkeletonTheme>
                    </div>
                :
                    <div className="contest-box-header-content">
                        <header>Upcoming Contests</header>
                        <hr />
                        <p>Participate in various contests and hop-in the train of your competitive programming journey. What do you think about me, am I beautiful?</p>
                        {/* <h4>All you need is a little push</h4>  */}
                        <h6>- Mr. Bean</h6>
                    </div>
                    }
                    <div className="contest-box-header-img">
                        {contestdata.length===0
                        ?
                        <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                            <p>
                                <Skeleton count={1} circle={true} width={200} height={200}/>
                            </p>
                        </SkeletonTheme>
                        :
                        <img src={staticimages.Bean} alt="bean" />
                        }
                    </div>
                    </div>
                    {/* Contest Table */}
                    <div className="contest-table">
                        {contestdata.length===0
                        ?
                        <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                            <p>
                                <Skeleton count={22} />
                            </p>
                        </SkeletonTheme>
                        :
                        <table className="table table-sm">
                            <thead style={{backgroundColor: "rgb(194, 215, 228)"}}>
                                <tr>
                                    <th scope="col">S/N</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Register</th>
                                    <th scope="col">Start</th>
                                    <th scope="col last_row">Duration/End</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <tr>
                                    <th scope="row">1</th>
                                    <td>DSA Learning Series</td>
                                    <td className="website-logo">
                                    <Link to="#" tabIndex="0"
                                        className="btn"
                                        role="button"
                                        data-toggle="popover" 
                                        data-placement="top" 
                                        data-trigger="hover"
                                        data-content="Online">
                                        <i className="fa fa-circle fa-xs" aria-hidden="true"></i>
                                    </Link>
                                    <Link to="#" target="_blank">
                                        <img src={Codechef} alt="cc" />
                                    </Link>
                                    </td>
                                    <td>30 Mar 2020  00:00:00</td>
                                    <td>30 Mar 2021  00:00:00</td>
                                </tr> */}

                                {contestdata && contestdata.map((contest,index)=>(
                                    <tr key={index}>
                                        <th scope="row">{index+1}</th>
                                        <td className="contest-name">
                                            <Link to={{pathname: contest.contest_link_registration_days_left}} target="_blank">
                                                {contest.name}
                                            </Link>
                                        </td>
                                        <td className={`website-logo ${contest.active?"":"offline"}`}>
                                            <Link to="#" data-tip="React-tooltip" data-for={contest.active?"online":"offline"}>
                                                    <i className="fa fa-circle fa-xs" aria-hidden="true"></i>
                                            </Link>
                                            {contest.active?(
                                                <ReactTooltip id="online" place="top" type="dark" effect="solid">
                                                    <span>Online</span>
                                                </ReactTooltip>    
                                            ):(
                                                <ReactTooltip id="offline" place="top" type="dark" effect="solid">
                                                    <span>Offline</span>
                                                </ReactTooltip>
                                            )}
                                            {/* <ReactTooltip place="top" type="dark" effect="solid">
                                            </ReactTooltip> */}

                                            {(contest.website==="codechef" && (
                                                <Link to={{pathname: contest.contest_link_registration_days_left}} target="_blank">
                                                    <img src={staticimages.Codechef} alt="cc" />
                                                </Link>
                                            ))||(contest.website==="codeforces" && (
                                                <Link to={{pathname: contest.contest_link_registration_days_left}} target="_blank">
                                                    <img src={staticimages.Codeforces} alt="cc" />
                                                </Link>
                                            ))||(contest.website==="hackerearth" && (
                                                <Link to={{pathname: contest.contest_link_registration_days_left}} target="_blank">
                                                    <img src={staticimages.Hackerearth} alt="cc" />
                                                </Link>
                                            ))}
                                        </td>
                                        <td>{(contest.start?contest.start:"--")}</td>
                                        <td>{(contest.duration_end ? contest.duration_end:"--")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        }
                    </div>

                    {/* Contest Bottom Box  */}
                    <div className="contest-bottom-box">
                    <div className="contest-bottom-box-content">
                        {contestdata.length===0
                        ?
                        <div className="contest-bottom-skeleton">
                            <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                <p>
                                    <Skeleton count={2}/>
                                </p>
                            </SkeletonTheme>
                        </div>
                        :
                        <>
                        <p>Yogyata hai aur saabit bhi karenge <Link to="/practice">practice</Link> karke.</p>
                        <h6>- Munna Bhaiya</h6>
                        </>
                        }
                    </div>
                    <div className="contest-bottom-box-img">
                    {contestdata.length===0
                        ?
                        <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                            <p>
                                <Skeleton count={1} circle={true} width={200} height={200}/>
                            </p>
                        </SkeletonTheme>
                        :
                        <img src={staticimages.MunnaBhaiya} alt="munnabhaiya" />
                        }
                    </div>
                    </div>
                </div>
            </div>
    )
}

const mapStateToProps= (state) => (
    {
        Loader:state.Loader
    }
)

export default connect(mapStateToProps, {
    loader,
    profileloader,
    dark,
    error,
    success,
    warning,
    info
})(Contest);
