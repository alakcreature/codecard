import React,{useEffect, useState, useRef} from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
// import Carousel from '../../components/Carousel/Carousel';
import OwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.min.css'
import 'owl.carousel/dist/assets/owl.theme.default.min.css'
import Table from '../../components/Table/Table';
import "./Sheet.css";
import http from '../../services/httpCall';
import apis from '../../services/apis';
import {connect} from 'react-redux';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import {profileloader} from "../../actions/profileLoaderAction";



function Sheet(props) {
    let {sheetid} = useParams();
    let history = useHistory();
    let [problems, setproblems] = useState([]);
    let [oldproblems, setoldproblems] = useState([]);
    let [category,setcategory] = useState([]);
    let [currenttagid, setcurrenttagid] = useState("");
    let [issubcsribed,setissubcsribed] = useState(false);
    let [sheetdetails, setsheetdetails] = useState({});
    let [startPosition, setstartPosition] = useState(0);


    const lastproblemfetched = useRef();

    let location = useLocation();
    const parsed = queryString.parse(location.search);

    const carousel = useRef();



    const handlecategoryselect = async(categoryid)=>{
        setproblems(el =>{
            let newproblems = oldproblems; 
            return newproblems.filter((op)=>{
                // eslint-disable-next-line
                if(op.categoryid==categoryid){
                    return op;
                }
            });
        })
    }

    const shuffle = (arr)=>{
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }
    

    const handleshuffle = ()=>{
        const x=[...oldproblems];
        let newproblems = shuffle(x);
        setproblems(newproblems);
    }
    

    const handleproblemcheck = async(problemid)=>{
        try{
            // eslint-disable-next-line
            let response = await http.get(`${apis.SOLVEDPROBLEM}/${problemid}`);
            setproblems(prevproblemlist=>{
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
                props.dark("please connect to internet");
            }else{
                props.dark("so sorry, please try after sometime");
            }
        }  
    }

    const problemcheckwrapper = async(problemid)=>{
        if(props.Auth.isLoggedIn){
            handleproblemcheck(problemid);
        }else{
            history.push({
                pathname:"/signin",
                state:{
                    problemid,
                },
                previousroute: `/sheet/${sheetid}`
            });
        }
    }

    const handlesubscribe = async(sheetid)=>{
        try{
            let response = await http.post(apis.SUBSCRIBE, {
                sheetid
            });
            if(response.data.status===200){
                if(response.data.subscriptionstatus){
                    props.success("Congratulations!!, now go ahead to solve the problems");
                }
                setissubcsribed(response.data.status);
            }
        }
        catch(err){
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
                props.dark("please connect to internet");
            }else{
                props.dark("so sorry, please try after sometime");
            }
        }finally{
            fetchsheetinfo();
        }
    }



    const fetchsheetinfo = async()=>{
        try{
            props.profileloader(true);
            let response = await http.get(`${apis.SHEETINFO}/${sheetid}`);
            console.log(response);
            
            setsheetdetails(response.data.data.sheetdetails);
            setcategory(response.data.data.categorylist);
            setoldproblems(response.data.data.problemslist);
            setproblems(response.data.data.problemslist);
            setissubcsribed(response.data.data.issubscribed);
        }
        catch(err){
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
                dark("please connect to internet");
            }else{
                dark("so sorry, please try after sometime");
            }
        }finally{
            props.profileloader();
        }
    }

    useEffect(()=>{
        window.scrollTo(0,0);
        fetchsheetinfo();
        // eslint-disable-next-line
    },[props.Auth.isLoggedIn]);

    useEffect(()=>{
        if(currenttagid){
            history.push({
                pathname: location.pathname,
                search: "?" + new URLSearchParams({categoryid: currenttagid}).toString() + "&" + new URLSearchParams({pos: startPosition}).toString()
            })
        }
        // eslint-disable-next-line
    },[currenttagid]);

    useEffect(()=>{
        if(Object.keys(parsed).length>0){
            setstartPosition(parsed.pos);
            handlecategoryselect(parsed.categoryid);    
        }
        // eslint-disable-next-line
    },[oldproblems]);




    return (
        
        <div className="container">    
            <div className="container-fluid mainsheet">
                <div className="mainsheet-inner">
                    {/* Sheet Header */}
                    <div className="sheetheader about">
                        {sheetdetails && (
                            <>
                                <header>
                                    <h3>{sheetdetails.name} Sheet</h3>
                                </header>
                                <p>
                                    {sheetdetails.description}
                                    <br />
                                    Subscribe to his YouTube <Link to={{pathname: (sheetdetails.channellink)}} target="__blank">channel.</Link>
                                </p>
                            </>
                        )}
                    </div>

                    {/* Sheet Carousel */}
                    <div>
                        <div className="carousel-inner">
                            
                            <OwlCarousel
                            ref={carousel}
                            className="owl-theme"
                            startPosition={startPosition}
                            items="3"
                            loop
                            >
                                {category && category.map((element,index)=>(
                                    <div key={index+1}
                                    className={`${index===startPosition && 'cactive'} categorycarousel`}
                                    onClick={()=>{
                                        setstartPosition(index);
                                        handlecategoryselect(element._id);
                                        setcurrenttagid(element._id);
                                    }}
                                    >
                                        <p>{element.name}</p>
                                    </div>
                                ))}
                            </OwlCarousel>
                        </div>
                    </div>

                    {/* Shuffle section */}
                    <div className="shuffle"
                        onClick={()=>{
                            handleshuffle();
                        }}
                    >
                        <label id="shuffle" htmlFor="shuffle">Shuffle</label>
                    </div>

                    {/* Table */}
                    <div className="sheet-table">
                
                            {!props.Auth.isLoggedIn 
                            ?
                                (
                                   <div className="sheet-tableouter">
                                            <button className="sheetbtn" 
                                            onClick={()=>{                                               
                                                history.push({
                                                    pathname:"/signin",
                                                    previousroute: window.location.href
                                                });
                                            }}
                                            >
                                                Login to solve the sheet
                                            </button>
                                   </div> 
                                )
                            : !issubcsribed && (
                                    <div className="sheet-tableouter">
                                        <button className="sheetbtn" 
                                        onClick={()=>{
                                            handlesubscribe(sheetid);
                                        }}
                                        >
                                            Subscribe Sheet
                                        </button>
                                    </div>
                            )}

                        {problems && 
                            <Table 
                                problemlist={problems}
                                problemcheckwrapper={problemcheckwrapper} 
                                lastelement={lastproblemfetched}
                            />
                        }
                    </div>
                    
                </div>
            </div>
        </div>
    )
}


const mapStateToProps= (state) => (
    {
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
})(Sheet);
