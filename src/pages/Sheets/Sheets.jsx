import React,{useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import "./Sheets.css";
import Meena from "../static/meena.png";
import http from '../../services/httpCall';
import apis from '../../services/apis';
import {connect} from 'react-redux';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import {profileloader} from "../../actions/profileLoaderAction";

// import staticimages from "../staticImagesLink";


function Sheets({dark,error,success,warning,info,loader, profileloader, Auth}) {
    let [sheets, setsheets] = useState([]);
    const history = useHistory();
    // let [sheetname, setsheetname] = useState("");


    const fetchsheets = async()=>{
        try{
            profileloader(true);
            let response = await http.get(apis.SHEETS);
            // console.log(response);
            setsheets(response.data.data);
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
            profileloader();
        }
    }

    const subscribetosheet = async(sheetid)=>{
        try{
            let response = await http.post(apis.SUBSCRIBE, {
                sheetid
            });
            if(response.data.status===200){
                if(response.data.subscriptionstatus){
                    success("Congratulations!!, now go ahead to solve the problems");
                }else{
                    info("We hope to hear from you soon");
                }
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
            fetchsheets();
        }
    }

    const handlesubscribe = (sheetid)=>{
        if(Auth.isLoggedIn){
            subscribetosheet(sheetid);
        }else{
            history.push({
                pathname:"/signin",
                previousroute: "/sheets"
            })
        }
    }

    useEffect(()=>{
        window.scrollTo(0,0);
        fetchsheets();
        // eslint-disable-next-line
    },[Auth.isLoggedIn]);



    return (
        <>
            <div className="container">
                <div className="container-fluid">
                    <div className="sheet-inner">
                        {/* Meme Header */}
                        <div className="sheet-box-header">
                            <div className="sheet-box-header-content">
                                <div className="sheet-content-inner">
                                    <p>
                                        So you are not able to track your progress on your favourite DSA sheets? We have a solution for you. Here, all of your favourite DSA sheets are  well consolidated. All problems are listed according to the tags. Here is a bonus for you, subscribe to the sheets for free and get a graphical representation of your progress. 
                                    </p>
                                    <h4 className="sheet-box-header-quote">Kitna competitive mahaul hai</h4>
                                    <h4 className="sheet-box-header-quote">- Meenal</h4>
                                </div>
                            </div>
                            <div className="sheet-box-header-img">
                                <img src={Meena} alt="panda" />
                            </div>
                        </div>

                        {/* Sheet1 Overview */}
                        {sheets && sheets.map((sheet,index)=>(
                            <div key={index+1} className="sheet1-container">
                                <div className="sheet1-inner">
                                    <Link to={`/sheet/${sheet._id}`}>
                                        <div className="sheet-name">
                                            <p>{sheet.name}</p>
                                        </div>
                                    </Link>
                                    <div className="sheet-description">
                                        <div className="sharebtns">
                                            <div className="youtube">
                                                <Link to={{pathname: (sheet.channellink)}} target="__blank">
                                                    <i className="fab fa-youtube fa-2x"></i>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="info">
                                            {sheet.description}
                                            <div>
                                                You can checkout his YouTube channel by clicking the above icon or you can subscribe this sheet to solve and track your progress in your profile.
                                            Get more info about this sheet's <Link to={`/sheet/${sheet._id}`}>problems</Link>.
                                            </div>
                                        </div>
                                        <div className="subscribe">
                                                <button className="subscribebtn" 
                                                onClick={()=>{
                                                    handlesubscribe(sheet._id);
                                                }}
                                                >
                                                    {!sheet.issubscribed?'Subscribe Sheet':'Unsubscribe Sheet'}
                                                </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    
                    </div>
                </div>
            </div>
        </>
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
})(Sheets);
