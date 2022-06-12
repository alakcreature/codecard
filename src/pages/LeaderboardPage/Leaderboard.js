import React,{useState, useEffect, useRef, useCallback} from 'react';
import { Link, useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {connect} from 'react-redux';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import './Leaderboard.css';
import http from "../../services/httpCall";
import apis from "../../services/apis";
import Mirzapur from '../static/mirzapur.png';
import India from '../static/india.png';
import Minion from '../static/minion.png';
import Bottompic from '../static/bottom-pic.svg';
import {logout} from "../../actions/authAction";
import {loader} from "../../actions/loaderAction";
import {profileloader} from '../../actions/profileLoaderAction';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



// Handle when country will different from India
function Leaderboard({dark,error,success,warning,info,loader,profileloader,Auth}) {
    // let history= useHistory();
    let [leaderboarddata, setleaderboarddata] = useState([]);
    let [totalpages, settotalpages] = useState(0);
    let [pagenumber,setpagenumber] = useState(1);
    let [category, setcategory] = useState();
    let [leaderboardenquiry, setleaderboardenquiry] = useState();
    let [fetching, setfetching] = useState(false);
    let [hasmore,sethasmore] = useState(true);
    let history = useHistory();

    // eslint-disable-next-line
    const pages = new Array(totalpages).fill(null).map((v,i)=>i);

    

    const fetchsortedleaderboard = async()=>{
        try{
            // profileloader(true);
            setfetching(true);
            let response = await http.get(`${apis.SORTED_LEADERBOARD}?category=${category}&leaderboardenquiry=${leaderboardenquiry}&page=${pagenumber}`)
            
            if(response.data.status===200){
                setleaderboarddata(prevboarddata => {
                    return [...new Set([...prevboarddata, ...response.data.data.sortedboard])]
                });
                settotalpages(Math.ceil(response.data.data.totalcount/20));
                if(response.data.data.totalcount===leaderboarddata.length){
                    sethasmore(false);
                };
            }else if(response.data.status===500){
                error("server error, please try again after sometime")
            }else{
                dark("so sorry, please try again after sometime")
            }
        }
        catch(err){
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
            }
            error("so, sorry please try again after sometime")
        }finally{
            setfetching(false);
            // profileloader();
        }
    }

    const handlesearch = (e)=>{
        e.preventDefault();
        if(!category || category==="Select Category"){
            return error("please select the category")
        }
        if(!leaderboardenquiry){
            return error("please type your enquiry")
        }
        fetchsortedleaderboard();
        e.target.reset();
    }

    const observer = useRef();
    const lastuserfetched = useCallback(node => {
        // console.log(fetching)
        if(fetching)return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries=>{
            if(entries[0].isIntersecting && hasmore){
                setpagenumber(prevpagenumber=>prevpagenumber+1);
            }
        })
        if(node){
            observer.current.observe(node);
        }
        // console.log("Visible");
        // eslint-disable-next-line
    },[fetching]);

    

    useEffect(()=>{
        if(category==="Select Category"){
            setleaderboardenquiry(undefined);
        }

        fetchsortedleaderboard();
        // eslint-disable-next-line
    },[category,pagenumber]);


    return (
        <div className="container">
            <div className="container-fluid leaderboard-main-content ">
                <div className="leaderboard-main-content-inner">
                    {/* Leaderboard Header Box */}
                    <div className="leaderboard-box-header">
                        <div className="leaderboard-box-header-img">
                            {leaderboarddata.length===0
                            ?
                                <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                    <p>
                                        <Skeleton count={1} circle={true} width={200} height={200}/>
                                    </p>
                                </SkeletonTheme>
                            :
                                <img src={Mirzapur} alt="kaleen bhaiya" />
                            }
                        </div>
                        <div className="leaderboard-box-header-main">
                            {leaderboarddata.length===0
                            ?
                                <div className="leaderboard-box-header-skeleton">
                                    <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                        <p>
                                            <Skeleton count={5}/>
                                        </p>
                                    </SkeletonTheme>
                                </div>
                            :
                                <div className="leaderboard-box-header-content">
                                    <header>Leaderboard</header>
                                    <hr />
                                    <p>Beginner hai ye important nhi</p>
                                    <p>Board pe aana hai ye important hai.</p>
                                    <h6>- Kaleen Bhaiya</h6>
                                </div>
                            }
                        </div>
                    </div>

                    {/* Search Box */}
                    <div className="search-info">
                        <div className="search-info-text">
                            <p>Search for programmer in your institute/country</p>
                        </div>
                        <div className="search-box-dropdown container-fluid">
                            <div className="dropdown container">
                                <select 
                                    onClick={(e)=>{
                                        setcategory(e.target.value);
                                    }}
                                    className="form-select form-select-sm"
                                    aria-label="Default select example"
                                >
                                    <option value={undefined}>Select Category</option>
                                    <option value="college">College</option>
                                    <option value="country">Country</option>
                                </select>
                            </div>
                            <div className="search-box">
                                <form className="d-flex" onSubmit={handlesearch}>
                                    <input
                                        onChange={(e)=>{
                                            setleaderboardenquiry(e.target.value);
                                        }}
                                        className="form-control form-control-sm me-2" 
                                        type="search"
                                        placeholder="Search your friends." 
                                        aria-label="Search"
                                    />
                                    <button className="leaderboard-searchbox-btn" type="submit">Search</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    {/* Scroll Up */}
                    <div className="scrollup">
                        <FontAwesomeIcon icon="angle-double-down"/>
                        <p>Scroll down the list buddy</p>
                    </div>
                    {/* Leaderboard Table */}
                    <div className="leaderboard-table">
                        {leaderboarddata.length===0
                        ?
                        <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                            <p>
                                <Skeleton count={37} />
                            </p>
                        </SkeletonTheme>
                        :
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Rank</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">College</th>
                                    <th scope="col">Country</th>
                                    <th scope="col">Codec Score</th>
                                    <th scope="col">Per Day Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboarddata && leaderboarddata.map((board_el,index)=>{
                                    if(leaderboarddata.length===index+1){
                                        return (
                                            <tr key={index} ref={lastuserfetched}>
                                                <td>{index+1}</td>
                                                <td>
                                                    {/* <Link to={`/user/${board_el._id}`} className="td-name" data-tip="React-tooltip" data-for={`ccusername ${board_el.codecard_username}`}>
                                                        {board_el.firstname}
                                                    </Link > */}
                                                    <Link to={Auth.userdetails && Auth.userdetails._id===board_el._id ?"/profile":`/profile/${board_el.codecard_username}`} className="td-name" data-tip="React-tooltip" data-for={`ccusername ${board_el.codecard_username}`} target="_blank">
                                                        {board_el.firstname}
                                                    </Link >
                                                    <ReactTooltip place="top" id={`ccusername ${board_el.codecard_username}`} type="dark" effect="float">
                                                        <span> codecard handle: {board_el.codecard_username}</span>
                                                    </ReactTooltip>
                                                </td>
                                                <td>{board_el.college && (board_el.college===undefined || board_el.college==="undefined" || board_el.college==="" ? "-" : board_el.college)}</td>
                                                <td className="country-td-tag"><img src={India} alt="India" /></td>
                                                <td>{board_el.profiledata.overall_rating}</td>
                                                <td className={`td-perdaychange ${board_el.profiledata.last_perday_change>0?"":board_el.profiledata.last_perday_change===0?"neutral":"offline"}`}>
                                                    <FontAwesomeIcon icon={`arrow-${board_el.profiledata.last_perday_change>=0?"up":"down"}`}/>
                                                    <span>{board_el.profiledata.last_perday_change}</span>
                                                </td>
                                            </tr>
                                        )
                                    }else{
                                        return (
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>
                                                    {/* <Link to={`/user/${board_el._id}`} className="td-name" data-tip="React-tooltip" data-for={`ccusername ${board_el.codecard_username}`}>
                                                        {board_el.firstname}
                                                    </Link > */}
                                                    <Link to={Auth.userdetails && Auth.userdetails._id===board_el._id ?"/profile":`/profile/${board_el.codecard_username}`} className="td-name" data-tip="React-tooltip" data-for={`ccusername ${board_el.codecard_username}`} target="_blank">
                                                        {board_el.firstname}
                                                    </Link >
                                                    <ReactTooltip place="top" id={`ccusername ${board_el.codecard_username}`} type="dark" effect="float">
                                                        <span> codecard handle: {board_el.codecard_username}</span>
                                                    </ReactTooltip>
                                                </td>
                                                <td>{board_el.college && (board_el.college===undefined || board_el.college==="undefined" || board_el.college==="" ? "-" : board_el.college)}</td>
                                                <td className="country-td-tag"><img src={India} alt="India" /></td>
                                                <td>{board_el.profiledata.overall_rating}</td>
                                                <td className={`td-perdaychange ${board_el.profiledata.last_perday_change>0?"":board_el.profiledata.last_perday_change===0?"neutral":"offline"}`}>
                                                    <FontAwesomeIcon icon={`arrow-${board_el.profiledata.last_perday_change>=0?"up":"down"}`}/>
                                                    <span>{board_el.profiledata.last_perday_change}</span>
                                                </td>
                                            </tr>
                                        )}
                            })}
                            </tbody>
                        </table>
                        }
                    </div>

                    {/* Scroll Up */}
                    <div className="scrollup">
                        <FontAwesomeIcon icon="angle-double-down"/>
                        <p>Scroll down the list buddy</p>
                    </div>

                   {/* Quote Section */}
                    <div className="quote-container container">
                        <div className="character-img">
                            {leaderboarddata.length===0
                            ?
                                <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                    <p>
                                        <Skeleton count={1} circle={true} width={200} height={200}/>
                                    </p>
                                </SkeletonTheme>
                            :
                                <img src={Minion} alt="minion" />
                            }
                        </div>
                        {leaderboarddata.length===0
                        ?
                            <div className="character-content-skeleton">
                                <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                    <p>
                                        <Skeleton count={5}/>
                                    </p>
                                </SkeletonTheme>
                            </div>
                        :
                            <div className="character-content">
                                <p>Sirf tadhte hi rahoge ya </p>
                                <p>board pe bhi aaoge kabhi.</p>
                                <h6> - H3 Boys, Chhichhore</h6>
                            </div>
                        }
                    </div>
                </div>
          </div>
        </div>
    )
}

const mapStateToProps= (state) => (
    {
        Loader:state.Loader,
        Auth:state.Auth
    }
)

export default connect(mapStateToProps, {
    logout,
    profileloader,
    loader,
    dark,
    error,
    success,
    warning,
    info
})(Leaderboard);
