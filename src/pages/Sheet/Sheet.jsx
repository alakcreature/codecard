import React,{useEffect, useState, useRef} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
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



function Sheet({dark,error,success,warning,info,loader, profileloader, Auth}) {
    let {sheetid} = useParams();
    let history = useHistory();
    let [problems, setproblems] = useState([]);
    let [oldproblems, setoldproblems] = useState([]);
    let [category,setcategory] = useState([]);
    let [currenttagid, setcurrenttagid] = useState("");
    let [active, setactive] = useState(-1);
    let [issubcsribed,setissubcsribed] = useState(false);
    let [sheetdetails, setsheetdetails] = useState({});


    // const carouselobserver = useRef();
    const lastproblemfetched = useRef();


    const carousel = useRef();


    const handlecategoryselect = async()=>{
        
        setproblems(el =>{
            let problems = oldproblems; 
            return problems.filter((op)=>{
                // eslint-disable-next-line
                if(op.categoryid==currenttagid){
                    return op;
                }
            });
        })
    }
    

    const handleproblemcheck = async(problemid)=>{
        try{
            // eslint-disable-next-line
            let response = await http.get(`${apis.SOLVEDPROBLEM}/${problemid}`);
            // console.log(response);
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
                    // pagenumber
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
                    success("Congratulations!!, now go ahead to solve the problems");
                }
                setissubcsribed(response.data.status);
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
        }finally{
            fetchsheetinfo();
        }
    }



    const fetchsheetinfo = async()=>{
        try{
            profileloader(true);
            let response = await http.get(`${apis.SHEETINFO}/${sheetid}`);
            console.log(response);
            
            setsheetdetails(response.data.data.sheetdetails);
            setcategory(response.data.data.categorylist);
            setoldproblems(response.data.data.problemslist);
            setproblems(response.data.data.problemslist);
            setcurrenttagid(response.data.data.categorylist[0]._id);
            setactive(1);
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
            profileloader();
        }
    }

    useEffect(()=>{
        window.scrollTo(0,0);
        fetchsheetinfo();
        // eslint-disable-next-line
    },[Auth.isLoggedIn]);

    useEffect(()=>{
        handlecategoryselect();
        console.log("currenttag clicked");
    },[currenttagid]);



    return (
        <div className="container">
            <div className="container-fluid mainsheet">
                <div className="mainsheet-inner">
                    {/* Sheet Header */}
                    <div className="sheetheader about">
                        {sheetdetails && (
                            <>
                                <header>
                                    <h3>{sheetdetails.name}</h3>
                                </header>
                                <p>
                                    {sheetdetails.description}
                                    <br />
                                    Subscribe to his YouTube <Link to={{pathname: (sheetdetails.channellink)}} target="__blank">channel.</Link>
                                </p>
                            </>
                        )}
                    </div>
                    
                    {/* Categories Carousel */}
                    {/* <Carousel
                        data={category}
                        method={}
                        method2={setcurrenttag}
                        currenttag={currenttag}
                        ref={carouselobserver}
                    /> */}

                    <div className="maincarousel">
                        <div className="carousel-inner">
                            
                            {/* <div className="arrowleft" onClick={()=>{prev()}}>
                                <i className="fas fa-chevron-left"></i>
                            </div> */}
                            <OwlCarousel
                            ref={carousel}
                            className="owl-theme"
                            items="3"
                            loop
                            autoplay
                            >
                                {category && category.map((element,index)=>(
                                    <div key={index+1}
                                    className={active===index+1?'cactive categorycarousel':'categorycarousel'}
                                    onClick={()=>{
                                        setactive(index+1);
                                        setcurrenttagid(element._id);
                                    }}
                                    >
                                        <p>{element.name}</p>
                                    </div>
                                ))}
                            </OwlCarousel>
                            {/* <div className="arrowright" onClick={()=>{next()}}>
                                <i className="fas fa-chevron-right"></i>
                            </div> */}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="sheet-table">
                
                            {!Auth.isLoggedIn 
                            ?
                                (
                                   <div className="sheet-tableouter">
                                            <button className="sheetbtn" 
                                            onClick={()=>{
                                                history.push({
                                                    pathname:"/signin",
                                                    previousroute: `/sheet/${sheetid}`
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

                        <Table 
                            problemlist={problems}
                            problemcheckwrapper={problemcheckwrapper} 
                            lastelement={lastproblemfetched}
                            />
                    </div>
                    
                </div>
            </div>
        </div>
    )
}


const mapStateToProps= (state) => (
    {
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
})(Sheet);
