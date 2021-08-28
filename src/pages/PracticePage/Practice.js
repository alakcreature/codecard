import React, { useEffect, useState, useRef } from 'react';
import './Practice.css';
import {connect} from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import staticimages from "../staticImagesLink";
import http from '../../services/httpCall';
import apis from '../../services/apis';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import {profileloader} from "../../actions/profileLoaderAction";
import { useCallback } from 'react';



function useQuery() {
    return new URLSearchParams(useLocation().search);
}

// loader(true) error info warning success dark
function Practice({error, info, warning, dark, success, loader, profileloader,Auth}) {
    let history = useHistory();
    let navsearch = useQuery();
    let problemsearch = navsearch.get("problemsearch");
    // let [navbarsearch, setnavbarsearch] = useState(true);
    let [problemlist,setproblemlist] = useState([]);
    let [checkproblem, setcheckproblem] = useState(false);
    let [tags,settags] = useState([]);
    let [totalpages, settotalpages] = useState(0);
    let [pagenumber,setpagenumber] = useState(1);
    let [level,setlevel] = useState();
    let [currenttag,setcurrenttag] = useState();
    let [problemenquiry,setproblemenquiry] = useState();
    let [searchbox, setsearchbox] = useState();
    let [fetching, setfetching] = useState(false);
    let [hasmore, sethasmore] = useState(true);


    // const pages = new Array(totalpages).fill(null).map((v,i)=>i);

    const handleproblemcheck = async(problemid)=>{
        try{
            // console.log("handleproblemcheck fired");
            let response = await http.get(`${apis.SOLVEDPROBLEM}/${problemid}`);
            // console.log(response);
            setcheckproblem(true);
        }catch(err){
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
                dark("please connect to internet");
            }else{
                dark("so sorry, please try after sometime");
            }
        }finally{
            fetchsortedproblems();
        }   
    }

    const problemcheckwrapper = async(problemid)=>{
        if(Auth.isLoggedIn){
            handleproblemcheck(problemid);
        }else{
            history.push({
                pathname:"/signin",
                state:{
                    problemid,
                    pagenumber
                },
                previousroute: "/practice"
            });
        }
    }


    const fetchsortedproblems = async()=>{
        try{
            profileloader(true);
            setfetching(true);
            let body={
                level,
                tags:currenttag,
                problemenquiry
            }
            if(level==="Level"){
                body.level=undefined;
            }
            if(currenttag==="All Tags"){
                body.tags=undefined;
            }

            // console.log(body);
            let response;
            if(problemsearch!==null){
                response = await http.post(`${apis.SORTED_PROBLEM}?problemsearch=${problemsearch}&page=${pagenumber}`,body);
            }else{
                response = await http.post(apis.SORTED_PROBLEM+`?page=${pagenumber}`,body); 
            }
            if(response.data.status===200){
                if(response.data.totalcount===0){
                    setcurrenttag("All Tags");
                    warning("sorry, no such question exists. Try with some other query")
                    return;
                }

                let newlist = response.data.problemlist;
                if(!checkproblem){
                    console.log("no")
                    setproblemlist(prevlist => {
                        return [...new Set([...prevlist,...newlist])];
                    })
                }else{
                    console.log("yes")
                    let prevdata = problemlist.map((problem)=>{
                        for(let i=0;i<response.data.problemlist.length;i++){
                            if(problem.issolved===response.data.problemlist[i].issolved){
                                return problem;
                            }else{
                                return response.data.problemlist[i];
                            }
                        }
                    })
                    console.log(prevdata);
                    setproblemlist(prevdata);
                }

                // setproblemlist(prevproblemlist=>{
                //     // return [...new Set([...prevproblemlist,...response.data.problemlist])];
                    
                //     if(!checkproblem){
                //         return [...new Set([...prevproblemlist,...response.data.problemlist])];
                //     }
                //     let prevdata = prevproblemlist.map((problem)=>{
                //         for(let i=0;i<response.data.problemlist.length;i++){
                //             if(problem.issolved===response.data.problemlist[i].issolved){
                //                 return problem;
                //             }else{
                //                 return response.data.problemlist[i];
                //             }
                //         }
                //     })

                //     return prevdata;
                // });
                settags(response.data.tagelements);
                settotalpages(Math.ceil(response.data.totalcount/20));
                if(response.data.totalcount===problemlist.length){
                    sethasmore(false);
                }
            }else if(response.data.status===206){
                setproblemlist(response.data.problemlist);
                settags(response.data.tagelements);
                settotalpages(Math.ceil(response.data.totalcount/20));
                info("sorry, we couldn't find your query, try another one");
            }
            else{
                error(response.data.error);
            }
        }
        catch(err){
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
                dark("please connect to internet");
            }else{
                dark("so sorry, please try after sometime");
            }
        }
        finally{
            setfetching(false);
            setcheckproblem(false);
            profileloader();
        }
    }

    const handlesearch = (e)=>{
        e.preventDefault();
        // set the searchbox to the input onChange and in this function set problemenquiry
        // and set useeffect for the change of problemenquiry, level & tags.
        setproblemenquiry(searchbox);
    }

    const observer = useRef();
    const lastproblemfetched = useCallback(node => {
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
    },[fetching]);



    useEffect(()=>{
        setpagenumber(1);
        setproblemlist([]);
    },[level, currenttag, problemenquiry, problemsearch,Auth.isLoggedIn]);

    useEffect(()=>{
        fetchsortedproblems();
    },[level, currenttag, problemenquiry, problemsearch,Auth.isLoggedIn,pagenumber]);


    useEffect(()=>{
        console.log(problemlist);
    },[problemlist]);

    useEffect(()=>{
        console.log(checkproblem);
    },[checkproblem]);


    return (
        <div className="container">
            <div className="container-fluid main-content">
                <div className="practicemain-content-inner">
                    {/* Practice Header Box */}
                    <div className="practice-box-header">
                        <div className="practice-box-header-img">
                            {problemlist.length===0
                            ?
                            <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                <p>
                                    <Skeleton count={1} circle={true} width={200} height={200} />
                                </p>
                            </SkeletonTheme>
                            :
                            <img src={staticimages.Panda} alt="panda" />
                            }
                        </div>
                        <div className="practice-box-header-content">
                            {problemlist.length===0
                            ?
                            <div className="practice-box-header-skeleton">
                                <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                    <p>
                                        <Skeleton count={5}/>
                                    </p>
                                </SkeletonTheme>
                            </div>
                            :
                            <>
                            <header>Practice</header>
                            <hr />
                            <p>
                            This place is to test yourself on the basis of your overall performance.
                            Practice from various websites and get your report from all of your competitive coding profiles.
                            Get better, and better prepare yourself for the competitions because...
                            </p>
                            <h4 className="practice-box-header-quote">All you need is a little push</h4>
                            <h6 className="practice-box-header-quote">- By Joker Bhaiya</h6>
                            </>
                            }
                        </div>
                    </div>

                    {/* Practice Sortby Section */}
                    <div className="practice-sortby-box">
                        <h5>Find the problems based on level/tags:-</h5>
                        <div className="dropdown-box-content container">
                            <select
                                onClick={(e)=>{
                                    setlevel(e.target.value);
                                }}

                                className="form-select form-select-sm"
                                aria-label="Default select example"
                            >
                                <option value={undefined}>Level</option>
                                <option value="School">School</option>
                                <option value="Basic">Basic</option>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>

                            <select 
                                onClick={(e)=>{
                                    setcurrenttag(e.target.value);
                                }}
                                className="form-select form-select-sm" 
                                aria-label="Default select example"
                            >
                            <option value={undefined}>All Tags</option>
                            {tags && tags.map((single_tag,i)=>{
                                if(single_tag.tag!==""){
                                    return (
                                        <option key={i} value={single_tag.tag}>{single_tag.tag}</option>
                                    )
                                }
                            })}
                            </select>
                        </div>
                        <div className="problem-search-box">
                            <form className="d-flex" onSubmit={handlesearch}>
                                <input 
                                    onChange={(e)=>{setsearchbox(e.target.value)}}
                                    className="form-control form-control-sm me-2" 
                                    type="search" 
                                    placeholder="Search problems by name or description" 
                                    aria-label="Search" 
                                />
                                <button className="problem-searchbox-btn" type="submit">Search</button>
                            </form>
                        </div>
                    </div>

                    {/* Scroll Up */}
                    <div className="scrollup">
                        <i className="fas fa-angle-double-down"></i>
                        <p>Scroll down the list buddy</p>
                    </div>
                        
                    {/* Practice Table */}
                    <div className="pratice-table">
                        {problemlist.length===0
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
                                    <th scope="col">Solved</th>
                                    <th scope="col">S/N</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Website</th>
                                    <th scope="col">Level</th>
                                    <th scope="col">Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {problemlist && problemlist.map((problem,index)=>{
                                    if(problemlist.length===index+1){
                                        return <tr key={index+1} ref={lastproblemfetched}>
                                                    <td className="solved">
                                                        <input type="checkbox" 
                                                        checked={problem.issolved}
                                                        onChange={()=>{
                                                            // handleproblemcheck(problem._id);
                                                            problemcheckwrapper(problem._id);
                                                        }}
                                                        />
                                                    </td>
                                                    <th scope="row">{index+1}</th>
                                                    <td className="td-title">
                                                        {/* <React.Fragment> */}
                                                                <Link to={{pathname: (problem.link)}} target="_blank">
                                                                <div data-tip="React-tooltip" data-for={`problem${index+1}`}>
                                                                    {problem.name}
                                                                </div>
                                                                </Link>
                                                                <ReactTooltip place="top" id={`problem${index+1}`} type="dark" effect="float">
                                                                    <span>Tags: {problem.tags.map((tag_el, tagelindex)=>(
                                                                        <div key={tagelindex}>{tag_el}</div>
                                                                    ))}</span>
                                                                </ReactTooltip>
                                                        {/* </React.Fragment> */}
                                                    </td>
                                                    <td className="website-logo">
                                                        <Link to={{pathname: (problem.link)}} target="_blank">
                                                            {problem.website==="geeksforgeeks"
                                                            ?
                                                            (<img src={staticimages.GeeksforGeeks} alt="gfg" />)
                                                            :
                                                            problem.website==="leetcode"
                                                            ?
                                                            (<img src={staticimages.Leetcode} alt="lc" />)
                                                            :
                                                            (<img src={staticimages.Codechef} alt="cc" />)
                                                            }
                                                        </Link>
                                                    </td>
                                                    <td>{problem.level}</td>
                                                    <td className="link-a">
                                                        <Link to={{pathname: (problem.link)}} target="_blank">
                                                            <i className="fa fa-link" aria-hidden="true"></i>
                                                        </Link>
                                                    </td>
                                                </tr>
                                    }else{
                                        return <tr key={index+1}>
                                            <td className="solved">
                                                <input type="checkbox" 
                                                checked={problem.issolved}
                                                onChange={()=>{
                                                    // handleproblemcheck(problem._id);
                                                    problemcheckwrapper(problem._id);
                                                }}
                                                />
                                            </td>
                                            <th scope="row">{index+1}</th>
                                            <td className="td-title">
                                                {/* <React.Fragment> */}
                                                        <Link to={{pathname: (problem.link)}} target="_blank">
                                                        <div data-tip="React-tooltip" data-for={`problem${index+1}`}>
                                                            {problem.name}
                                                        </div>
                                                        </Link>
                                                        <ReactTooltip place="top" id={`problem${index+1}`} type="dark" effect="float">
                                                            <span>Tags: {problem.tags.map((tag_el, tagelindex)=>(
                                                                <div key={tagelindex}>{tag_el}</div>
                                                            ))}</span>
                                                        </ReactTooltip>
                                                {/* </React.Fragment> */}
                                            </td>
                                            <td className="website-logo">
                                                <Link to={{pathname: (problem.link)}} target="_blank">
                                                    {problem.website==="geeksforgeeks"
                                                    ?
                                                    (<img src={staticimages.GeeksforGeeks} alt="gfg" />)
                                                    :
                                                    problem.website==="leetcode"
                                                    ?
                                                    (<img src={staticimages.Leetcode} alt="lc" />)
                                                    :
                                                    (<img src={staticimages.Codechef} alt="cc" />)
                                                    }
                                                </Link>
                                            </td>
                                            <td>{problem.level}</td>
                                            <td className="link-a">
                                                <Link to={{pathname: (problem.link)}} target="_blank">
                                                    <i className="fa fa-link" aria-hidden="true"></i>
                                                </Link>
                                            </td>
                                        </tr>
                                }})}

                                

                            </tbody>
                        </table>
                        }
                    </div>
                    
                    {/* Scroll Up */}
                    <div className="scrollup">
                        <i className="fas fa-angle-double-down"></i>
                        <p>Scroll down the list buddy</p>
                    </div>

                    <div className="practice-box-bottom">
                        <div className="practice-box-bottom-header">
                            {problemlist.length===0
                            ?
                            <div className="practice-box-bottom-header">
                                <div className="practice-box-bottom-header-skeleton">
                                    <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                        <p>
                                            <Skeleton count={1} />
                                        </p>
                                    </SkeletonTheme>
                                </div>
                            </div>
                            :
                            <p>
                                Check the <span><Link to="/leaderboard">leaderboard</Link></span> to see where your boat sails.
                            </p>
                            }
                        </div>
                        <div className="practice-box-bottom-img">
                            {problemlist.length===0
                            ?
                            <div className="practice-box-bottom-skeleton">
                                <SkeletonTheme color="#bbb7b0" highlightColor="rgb(194, 188, 174)">
                                    <p>
                                        <Skeleton count={1} height={200}/>
                                    </p>
                                </SkeletonTheme>
                            </div>
                            :
                            <img src={staticimages.Popeye} alt="popeye" />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps= (state) => (
    {
        Loader:state.Loader,
        ProfileLoader:state.ProfileLoader,
        Auth:state.Auth
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
})(Practice);
