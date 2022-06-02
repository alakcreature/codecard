import React,{useState, useEffect, useRef, useCallback} from 'react';
import "./Practice.css";
import OwlCarousel from "react-owl-carousel";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import staticimages from "../staticImagesLink";
import {connect} from 'react-redux';
import {Link, useHistory, useLocation} from "react-router-dom"
import 'owl.carousel/dist/assets/owl.carousel.min.css'
import 'owl.carousel/dist/assets/owl.theme.default.min.css'
import Table from '../../components/Table/Table';
import Carousel from '../../components/Carousel/Carousel';
import http from '../../services/httpCall';
import apis from '../../services/apis';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import {profileloader} from "../../actions/profileLoaderAction";


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const levels = ["Level","School","Basic","Easy","Medium","Hard"];

// Show tags, shuffle button, carousel set to standard.
function Practice({error, info, warning, dark, success, loader, profileloader,Auth}) {
    let history = useHistory();
    let navsearch = useQuery();
    let problemsearch = navsearch.get("problemsearch");
    let [problemlist,setproblemlist] = useState([]);
    // let [tags,settags] = useState([]);
    let [category, setcategory] = useState([]);
    // let [totalpages, settotalpages] = useState(0);
    let [pagenumber,setpagenumber] = useState(1);
    let [level,setlevel] = useState();
    let [currenttag,setcurrenttag] = useState();
    let [problemenquiry,setproblemenquiry] = useState();
    let [searchbox, setsearchbox] = useState("");
    let [fetching, setfetching] = useState(false);
    let [showtags, setshowtags] = useState(false);
    let [hasmore, sethasmore] = useState(true);
    


    const carouselobserver = useRef();

    const handleshuffle = ()=>{
        if(currenttag){
            setcurrenttag(undefined);
        }
        if(level && level!=="Level"){
            setlevel("Level");
        }
        if(problemenquiry){
            setproblemenquiry(undefined);
        }

        if(searchbox){
            setsearchbox("");
        }

        if(carouselobserver && carouselobserver.current && carouselobserver.current.active!==-1){
            carouselobserver.current.setactive(-1);
        }
    }
    
    const handleproblemcheck = async(problemid)=>{
        try{
            // eslint-disable-next-line
            let response = await http.get(`${apis.SOLVEDPROBLEM}/${problemid}`);
            // console.log(response);
            setproblemlist(prevproblemlist=>{
                return prevproblemlist.map((op)=>{
                    // eslint-disable-next-line
                    if(op._id==problemid){
                        op.issolved=!op.issolved;
                    }
                    return op;
                });
            })
        }catch(err){
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
                dark("please connect to internet");
            }else{
                dark("so sorry, please try after sometime");
            }
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
            // profileloader(true);
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

            
            let response;
            if(problemsearch!==null){
                response = await http.post(`${apis.SORTED_PROBLEM}?problemsearch=${problemsearch}&page=${pagenumber}`,body);
            }else{
                response = await http.post(apis.SORTED_PROBLEM+`?page=${pagenumber}`,body); 
            }
            if(response.data.status===200){
                // console.log(response);
                if(response.data.totalcount===0){
                    if(currenttag){
                        setcurrenttag();   
                    }
                    if(level && level!=="Level"){
                        setlevel("Level");
                    }
                    if(problemenquiry){
                        // console.log(problemenquiry)
                        setproblemenquiry(undefined);
                    }

                    info("sorry, no such question exists. Try with some other query")
                    return;
                }

                setcategory(response.data.categorylist);

                setproblemlist(prevproblemlist=>{
                    return [...prevproblemlist,...response.data.problemlist];
                })

                // settags(response.data.tagelements);
                // settotalpages(Math.ceil(response.data.totalcount/20));
                if(response.data.totalcount===problemlist.length){
                    sethasmore(false);
                }
            }else if(response.data.status===206){
                setproblemlist(response.data.problemlist);
                // settags(response.data.tagelements);
                // settotalpages(Math.ceil(response.data.totalcount/20));
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
            // profileloader();
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
        // eslint-disable-next-line
    },[fetching]);



    useEffect(()=>{
        setpagenumber(1);
        setproblemlist([]);
    },[level, currenttag, problemenquiry, problemsearch,Auth.isLoggedIn]);

    useEffect(()=>{
        fetchsortedproblems();
        // eslint-disable-next-line
    },[level, currenttag, problemenquiry, problemsearch,Auth.isLoggedIn,pagenumber]);

    


    return (
        <>
            <div className="container">
                <div className="fluid-container">
                    <div className="practice-inner">
                        {/* Practice Header Section */}
                        <div className="practice-box-header">
                            <div className="practice-box-header-img">
                                {/* {problemlist.length!==0 */}
                                {false
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
                                {/* {problemlist.length===0 */}
                                {false
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
                                <h6 className="practice-box-header-quote">- Joker</h6>
                                </>
                                }
                            </div>
                        </div>

                        {/* Sheet's List section */}
                        <div className="sheets">
                            <OwlCarousel
                            className="owl-theme"
                            items="2"
                            autoplay
                            loop
                            >
                                <Link to="/sheet/613357f5c5ba32358c202fc1">
                                    <div className="sheetname sheet1">
                                        <p>Striver's 180</p>
                                    </div>
                                </Link>
                                <Link to="/sheet/627551d9a0859b16e87c800b">
                                    <div className="sheetname sheet2">
                                        <p>DSA 450</p>
                                    </div>
                                </Link>
                                <Link to="/sheets">
                                    <div className="sheetname sheet3">
                                        <p>View All</p>
                                    </div>
                                </Link>
                            </OwlCarousel>
                        </div>

                        {/* Category Wise Section */}
                        <Carousel 
                        data={category} 
                        method={setcurrenttag}
                        // currenttag={currenttag}
                        ref={carouselobserver}
                        />
                        
                        {/* Filters Section */}
                        <div className="practice-filter-box">
                            <div className="check">
                                <div className="shuffle"
                                onClick={()=>{
                                    handleshuffle();
                                }}
                                >
                                    <label id="shuffle" htmlFor="shuffle">Shuffle</label>
                                </div>
                                <div className="showtags">
                                    <input type="checkbox" value=""
                                    onChange={()=>{
                                        setshowtags(!showtags);
                                    }}
                                    />
                                    <label id="show" htmlFor="show">Show Tags on hover</label>
                                </div>
                            </div>
                            <div className="rightfilters">
                                <div className="dropdown-box-content container">
                                    <select
                                        onClick={(e)=>{
                                            setlevel(e.target.value);
                                        }}

                                        className="form-select form-select-sm"
                                        aria-label="Default select example"
                                    >
                                        {levels.map((l,index)=>(
                                            <option key={index} value={l} selected={l===level}>{l}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="problem-search-box">
                                    <form className="d-flex" onSubmit={handlesearch}>
                                        <input 
                                            onChange={(e)=>{
                                                setsearchbox(e.target.value)
                                            }}
                                            value={searchbox}
                                            className="form-control form-control-sm me-2" 
                                            type="search" 
                                            placeholder="Search problems by name or description" 
                                            aria-label="Search" 
                                        />
                                        <button className="problem-searchbox-btn" type="submit">Search</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Scroll Up */}
                        <div className="scrollup">
                            <i className="fas fa-angle-double-down"></i>
                            <p>Scroll down the list buddy</p>
                        </div>

                        {/* Table */}
                        <Table 
                        problemlist={problemlist}
                        problemcheckwrapper={problemcheckwrapper} 
                        lastelement={lastproblemfetched}
                        showtags={showtags} />

                        {/* Scroll Up */}
                        <div className="scrollup">
                            <i className="fas fa-angle-double-down"></i>
                            <p>Scroll down the list buddy</p>
                        </div>


                        {/* Bottom Section */}
                        <div className="practice-box-bottom">
                            <div className="practice-box-bottom-header">
                                {/* {problemlist.length===0 */}
                                {false
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
                                {/* {problemlist.length===0 */}
                                {false
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
        </>
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
