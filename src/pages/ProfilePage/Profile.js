import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './Profile.css';
import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {Line} from 'react-chartjs-2';
import {connect} from 'react-redux';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import http from '../../services/httpCall';
import apis from '../../services/apis';
import staticimages from "../staticImagesLink";
import {logout,setUserDetails} from "../../actions/authAction";
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import {profileloader} from "../../actions/profileLoaderAction";
import { useRef } from 'react';
// import { addviews } from '../../../../server/controllers/viewsController';

// Check if token is expired.
// Add edit option for about section.
function Profile({dark,error,success,warning,info,loader, profileloader,logout,setUserDetails}) {
    let history = useHistory();
    let [usernamemodal,setusernamemodal] = useState(false);
    let [hidespan,sethidespan] = useState(false);
    let [showfullabout,setshowfullabout] = useState(false);
    let [userdetails,setuserdetails] = useState({});
    let [website,setwebsite] = useState("codechef");
    let [username,setusername] = useState("");
    let [cropmodal, setcropmodal] = useState(false);
    let [src,selectFile] = useState(null);
    let [image, setImage] = useState(null);
    let [crop, setCrop] = useState({aspect : 1/1});
    let [newprofilepic,setnewprofilepic] = useState();
    let [newabout,setnewabout] = useState();
    let [newcollege, setnewcollege] = useState();
    let [newfirstname, setnewfirstname] = useState();
    let [newlastname, setnewlastname] = useState();
    let [updatename,setupdatename] = useState(false);
    let [updatecollege,setupdatecollege] = useState(false);
    let [updateabout,setupdateabout] = useState(false);
    let [websitetoconnect, setconnectwith] = useState(null);
    let [showeditoptions, setshoweditoptions] = useState(false);
    let [showscoremodal, setshowscoremodal] = useState(false);
    let [solved, setsolved]= useState([]);
    let [subscribedsheetids, setsubscribedsheetids] = useState([]);
    let [sheetprogress, setsheetprogress] = useState([]);
    let [month, setmonth] = useState(new Date().getMonth()+1);
    let [year, setyear] = useState(new Date().getFullYear());
    let[sheetchangeid, setsheetchange] = useState("");
    // let [currentdate, setcurrentdate] = useState(new Date().toLocaleString('en-us', { month: 'long' }));


    const currentdate=new Date().toLocaleString('en-us', { month: 'long' });
    const currentyear=new Date().getFullYear();
    // console.log(currentyear)


    const chartelement = useRef();
    const options = {
        maintainAspectRatio: false
      };

    const dataURLtoBlob = (dataurl)=>{
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    const getCroppedImg = ()=>{
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
       
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        );

        var dataurl = canvas.toDataURL('image/jpeg',0.8);
        if(dataurl==="data:,"){
            return error("please crop the image first");
        }
        let blob = dataURLtoBlob(dataurl);
        let fd = new FormData();
        fd.append("croppedprofilepic", blob, `${userdetails.firstname}_profilepic.jpg`);
        // console.log(fd.get("croppedprofilepic"));
        setnewprofilepic(fd.get("croppedprofilepic"));
    }

    const handleprofilepicchange= (e)=>{
        // selectFile(URL.createObjectURL(e.target.files[0]));
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>{
                selectFile(reader.result)
            });
            reader.readAsDataURL(e.target.files[0]);
        }
        setcropmodal(true);
    }

    let handleedit = ()=>{

        if(!newprofilepic && !newabout && !newcollege && !newfirstname && !newlastname){
            return error("please add your detail which needs to be updated");
        }

        profileloader(true);
        let fieldobj=new FormData();
        if(newprofilepic){
            fieldobj.append("image",newprofilepic);
            fieldobj.append("fieldname","imageurl");
        }else if(newabout){
            fieldobj.append("fieldname","about");
            fieldobj.append("fielddata",newabout);
        }else if(newfirstname){
            
            fieldobj.append("fieldname","firstname");
            fieldobj.append("fielddata",newfirstname);
        }else if(newlastname){
            fieldobj.append("fieldname","lastname")
            fieldobj.append("fielddata",newlastname)
        }
        else if(newcollege){
          
            fieldobj.append("fieldname","college");
            fieldobj.append("fielddata",newcollege);
        }
        
        http.post(apis.UPDATEPROFILEDETAILS,fieldobj)
        .then((result)=>{
            if(result.data.status===200){
                info(result.data.message);
                setuserdetails(result.data.data);
                if(newabout){   
                    setupdateabout(false);
                }
                if(newfirstname){
                    setupdatename(false);
                }
                if(newlastname){
                    setupdatename(false);
                }
                if(newcollege){
                    setupdatecollege(false);
                }
                if(newprofilepic){
                    setcropmodal(false);
                }
            }else{
                error(result.data.error);
            }
        })
        .catch((err)=>{
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
                dark("please connect to internet");
            }else{
                dark("so sorry, please try after sometime");
            }
        }).finally(()=>{
            profileloader();
            setshoweditoptions(false);
        });
    }

    let handlesubmitusername = (e)=>{
        e.preventDefault();
        if(!website || !username){
            return error("please add your username");
        }

        profileloader(true);
        http.post(apis.ADD_USERNAME,{
            website,
            username
        })
        .then((result)=>{
            setusernamemodal(false);
            if(result.data.status===200){
                setuserdetails(result.data.data);
                warning("Your updated data may reflect after 24 hours.")
            }else{
                error(result.data.error);
            }
        })
        .catch((err)=>{
            setusernamemodal(false);
            // Handle Error
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
                dark("please connect to internet")
            }else{
                dark("so sorry, please try after sometime");
            }
        }).finally(()=>{
            profileloader();
        });
    }

    const connectmyprofile= ()=>{
        profileloader(true);
        if(websitetoconnect===null){
            return error("please click on the right profile");
        }
        http.post(apis.CONNECTMYPROFILE,{
            website:websitetoconnect
        }).then((result)=>{
            if(result.data.status===200){
                info(result.data.message);
                setuserdetails(result.data.data);
            }else{
                error(result.data.error);
            }
        }).catch((err)=>{
            // Handle Error
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
                dark("please connect to internet");
            }else{
                dark("so sorry, please try after sometime");
            }
        }).finally(()=>{
            profileloader();
        });
        setconnectwith(null);
    }

    let fetchUserDetails = ()=>{
        profileloader(true);
        
        http.get(apis.GET_USER_INFO)
        .then((result)=>{
            console.log(result.data);
            if(result.data.status===200){
                setsolved(result.data.data.problemsolved);
                setUserDetails(result.data.data);
                setuserdetails(result.data.data);
                setsubscribedsheetids(result.data.data.subscribedsheetids);
                if(result.data.data.error &&result.data.data.error.length>0){
                    result.data.data.error.forEach((error_el)=>{
                        error(error_el);
                    })
                }
            }else{
                info("please signin again");
                logout();
            }
        })
        .catch((err)=>{
            // Handle error by forwarding to error page
            console.log(err);
            if(!navigator.onLine){
                history.push("/networkerror");
                dark("please connect to internet");
            }else{
                dark("so sorry, please try after sometime");
            }
        }).finally(()=>{
            profileloader();
        });
    }

    let fetchSheetProgress = async(sheetid)=>{
        try{
            profileloader(true);
            let response = await http.post(`${apis.SHEETPROGRESS}/${sheetid}`,{
                month: Number(month),
                year: Number(year)
            });

            
            if(response.data.status===200){
                setsheetprogress(prevprogress=>{
                    if(prevprogress.length>0){
                        return prevprogress.map(el=>{
                            if(el.sheetid===response.data.data.sheetid){
                                // console.log("hi");
                                return response.data.data;
                            }else{
                                return el;
                            }
                        });
                    }else{
                        return [...prevprogress,...Array(response.data.data)];
                    }
                });
            }else{
                info(response.data.message);
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
            profileloader();
        }
    }



    let sheetprogresswrapper = async(sheetids)=>{
        for(let i=0;i<sheetids.length;i++){
            if(sheetids[i]){
                await fetchSheetProgress(sheetids[i]);
            }
        }
        
    }


    useEffect(()=>{
        // window.scrollTo(0,0);
        window.onclick = (e)=>{
            let modalContent = document.querySelector("#modalbtn");
            if(e.target === modalContent){
                setusernamemodal(false);
                setupdateabout(false);
            }
        }
        fetchUserDetails();
        // eslint-disable-next-line
    },[]);

    useEffect(()=>{
        sheetprogresswrapper(subscribedsheetids);
        // eslint-disable-next-line
    },[subscribedsheetids]);

    useEffect(()=>{
        if(newprofilepic){
            handleedit();
        }
        // eslint-disable-next-line
    },[newprofilepic]);

    useEffect(()=>{
        if(websitetoconnect){
            connectmyprofile();
        }
        // eslint-disable-next-line
    },[websitetoconnect]);

    useEffect(()=>{
        if(sheetchangeid){
            fetchSheetProgress(sheetchangeid);
        }
        // eslint-disable-next-line
    },[year,month]);

    useEffect(()=>{
        console.log(sheetprogress);
    },[sheetprogress]);


    return (
        <React.Fragment>
        {/* Modal */}
        {cropmodal && (
            <div id="modalbtn" className="cropmodal">
                <div className="cropmodal-main">
                    <div className="cropmodal-main-inner">
                        <span className="closebtncropmodal" onClick={()=>{setcropmodal(false)}}>&times;</span>
                        <div className="cropmodal-content">
                            <ReactCrop src={src} onImageLoaded={setImage} crop={crop} onChange={setCrop} />
                            <button className="btn btn-danger" onClick={getCroppedImg}>Crop</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        {usernamemodal && (
            <div id="modalbtn" className="mymodal">
                <div className="mymodal-content">
                    <span className="closebtn" onClick={()=>{setusernamemodal(false)}}>&times;</span>
                    <div className="mymodal-form-content">
                        <form onSubmit={handlesubmitusername}>
                            <header>
                                Add Your Username
                            </header>
                            <br/>
                            <div className="mb-3">
                                <label htmlFor="websiteinput" className="form-label">Website</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    aria-label=".form-select-sm example"
                                    onChange={(e)=>{
                                        setwebsite(e.target.value);
                                    }}
                                >
                                    <option value="codechef">Codechef</option>
                                    <option value="codeforces">Codeforces</option>
                                    <option value="leetcode">Leetcode</option>
                                    <option value="geeksforgeeks">Geeksforgeeks</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="usernameinput" className="form-label">Username</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    id="usernameinput" 
                                    aria-describedby="username"
                                    onChange={(e)=>{
                                        setusername(e.target.value);
                                    }} 
                                />
                                <div id="username" className="form-text">(enter your username to be added)</div>
                            </div>
                            <button type="submit" className="modal-btn">Add</button>
                        </form>
                    </div>
                </div>
            </div>
        )}
        {updateabout && (
            <div id="modalbtn" className="mymodal">
                <div className="mymodal-content">
                    <span className="closebtn" onClick={()=>{setupdateabout(false)}}>&times;</span>
                    <div className="mymodal-form-content">
                            <header>
                                Update your bio
                            </header>
                            <hr/>
                            <div className="mb-3">
                                <textarea 
                                className="form-control form-control-sm"
                                cols="30" 
                                rows="6"
                                placeholder="Your Short Bio"
                                onChange={(e)=>setnewabout(e.target.value)}
                                />
                            </div>
                            <button type="button" onClick={handleedit} className="modal-btn">Update</button>
                    </div>
                </div>
            </div>
        )}
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
        <div className="container">
            {/* Main Content */}
            <div className="container-fluid main-content ">
                <div className="profile-main-content-inner">
                    <div className="profile-info">
                        <div className="edit-btn">
                                {/* <h5>Edit your details</h5> */}
                                <div data-tip="React-tooltip" data-for="editdetails" className="editdetails">
                                    <i className="fas fa-pen" onClick={()=>{setshoweditoptions(!showeditoptions)}}></i>
                                </div>
                                <ReactTooltip place="top" id="editdetails" type="warning" effect="solid">
                                        <span>Edit your details</span>
                                </ReactTooltip>
                            </div>
                        <div className="profile-img" >
                            <input type="file" className="profile-image-input" 
                            onChange={handleprofilepicchange} id="image"
                            />
                            <label htmlFor="image">
                            <div className="profile-overlay">
                                <div className="profilepic-overlay-inner">
                                    <i className="far fa-camera-retro fa-2x"></i>
                                </div>
                            </div>
                            </label>
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
                            {!updatename
                            ?
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
                                    {showeditoptions &&
                                    <i className="fas fa-pen" onClick={()=>setupdatename(!updatename)}></i>
                                    }
                                    </>
                                }
                            </div>
                            :
                            <div className="col input-group mb-3 usernamechange-div">
                                <input
                                type="text" 
                                className="form-control form-control-sm" 
                                placeholder="Update your firstname*" 
                                aria-label="name" 
                                aria-describedby="name"
                                onChange={(e)=>setnewfirstname(e.target.value)}
                                />
                                {/* <button
                                className="btn btn-outline-warning btn-sm" 
                                id="name" onClick={handleedit}>
                                    Update
                                </button> */}

                                <h5 className="name-divider"> OR</h5>
                                
                                <input 
                                type="text"
                                onChange={(e)=>setnewlastname(e.target.value)} 
                                className="form-control form-control-sm lastnamechange-input" 
                                placeholder="Update your lastname*" 
                                aria-label="name" 
                                aria-describedby="name" 
                                />
                                <button
                                className="btn btn-outline-warning btn-sm lastnamechange-input" 
                                id="name" onClick={handleedit}>
                                    Update
                                </button>
                                <i className="fas fa-pen" onClick={()=>setupdatename(!updatename)}></i>
                            </div>
                            }

                            {!updatecollege
                            ?
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
                                    <h3>{userdetails && (userdetails.college===undefined || userdetails.college==="undefined" || userdetails.college==="") ? "Please update your college name": userdetails.college}</h3>
                                    {showeditoptions &&
                                    <i className="fas fa-pen" onClick={()=>setupdatecollege(!updatecollege)}></i>
                                    }
                                    </>
                                }
                            </div>
                            :
                            <div className="col input-group mb-3 collegechange-div">
                                <input 
                                type="text"
                                onChange={(e)=>setnewcollege(e.target.value)} 
                                className="form-control form-control-sm" 
                                placeholder="Update your college name*" 
                                aria-label="name" 
                                aria-describedby="name" 
                                />
                                <button
                                className="btn btn-outline-warning btn-sm" 
                                id="name" onClick={handleedit}>
                                    Update
                                </button>
                                <i className="fas fa-pen" onClick={()=>setupdatecollege(!updatecollege)}></i>
                            </div>
                            }
                        </div>
                    </div>

                    {/* About Section */}
                    <div className={`about ${showfullabout?"a-tag-expand":""}`}>
                        <header>
                            <div className="about-div">
                                <h3>About</h3>
                                {showeditoptions &&
                                <i className="fas fa-pen" onClick={()=>setupdateabout(true)}></i>
                                }
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

                    {/* Sheets Progress */}
                    {sheetprogress && sheetprogress.length>0 && (
                        <div className="sheetmain">
                            <div className="sheetinner">
                                {sheetprogress.map((sheet,index)=>(
                                    <div key={index} className="sheet-info">
                                        <div className="progressheader">
                                        <h3>
                                            {sheet.sheetdetails.name}
                                             Progress
                                        </h3>
                                        <div className="date">
                                            <select name="year" className="form-select form-select-sm" 
                                                aria-label=".form-select-sm example"
                                                onChange={(e)=>{
                                                    setyear(e.target.value);
                                                    setsheetchange(sheet.sheetid);
                                            }}>
                                                <option selected={currentyear===2019?true:false} value="2019">2019</option>
                                                <option selected={currentyear===2020?true:false} value="2020">2020</option>
                                                <option selected={currentyear===2021?true:false} value="2021">2021</option>
                                            </select>
                                            
                                            <select 
                                                className="form-select form-select-sm" 
                                                aria-label=".form-select-sm example"
                                                onChange={(e)=>{
                                                    setmonth(e.target.value);
                                                    setsheetchange(sheet.sheetid);
                                                }}
                                            >

                                                <option selected={currentdate==="January"?true:false} value="1">January</option>
                                                <option selected={currentdate==="February"?true:false} value="2">February</option>
                                                <option selected={currentdate==="March"?true:false} value="3">March</option>
                                                <option selected={currentdate==="April"?true:false} value="4">April</option>
                                                <option selected={currentdate==="May"?true:false} value="5">May</option>
                                                <option selected={currentdate==="June"?true:false} value="6">June</option>
                                                <option selected={currentdate==="July"?true:false} value="7">July</option>
                                                <option selected={currentdate==="August"?true:false} value="8">August</option>
                                                <option selected={currentdate==="September"?true:false} value="9">September</option>                    
                                                <option selected={currentdate==="October"?true:false} value="10">October</option>
                                                <option selected={currentdate==="November"?true:false} value="11">November</option>
                                                <option selected={currentdate==="December"?true:false} value="12">December</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="progress-info">
                                        <div className="chartmain">
                                            <Line 
                                                ref={chartelement} 
                                                data={
                                                {
                                                    labels: sheet.monthlabel,
                                                    datasets: [
                                                        {
                                                            label: "problem solved",
                                                            data: sheet.sheetprogress,
                                                            backgroundColor: '#F39C13',
                                                            fill:false,
                                                            borderColor: '#d4983d'
                                                        }

                                                    ]
                                                }
                                            }
                                            width={100}
                                            height={300}
                                            options={options} />
                                        </div>
                                    </div>
                                </div>
                                ))}
                                <hr />
                            </div>
                        </div>
                    )}

                    {/* Problems Solved Section */}
                    <div className="problemsolvedmain">
                        <header>
                            <div className="problemsolvedinner">
                                <h3>Problems Solved</h3>
                            </div>

                        </header>

                        <div className="solvedproblemslist">
                            {solved  && solved.length!==0 ?
                                <ul>
                                {solved.map((problem,index)=>(
                                    <li key={index}><Link to={{pathname: (problem.link)}} target="_blank">{problem.name}</Link></li>
                                ))
                                }
                                </ul>
                            :
                                <p>Go ahead champ! Solve your first <Link className="noproblems" to="/practice">problem</Link> </p>
                            }
                        </div>

                    </div>

                    {/* Profile Ratings */}
                    <div className="ratings">
                        <header>
                        <div className="rating-heading">
                            <h3>Profile Ratings</h3>
                            {showeditoptions &&
                            <i className="fas fa-pen" onClick={()=>setusernamemodal(true)}></i>
                            }
                        </div>
                        </header>

                        <div className="user-ratings">
                            <ul>
                                <li>
                                    {/* Render below tooltip only if rating exists but if rating not
                                    exists but username exists, then render tooltip with "connect your profile" */}
                                    {userdetails && userdetails.codechef ? userdetails.codechef===-1 ?
                                    (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="codechef" className="user-ratings-btn"
                                            onClick={()=>{setusernamemodal(true)}}
                                            >
                                                <img src={staticimages.Codechef} alt="codechef rating" />
                                            </button>
                                            <ReactTooltip place="top" id="codechef" type="info" effect="float">
                                                    <span>Please add your username</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ):                                   
                                    (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="codechef" className="user-ratings-btn">
                                                <img src={staticimages.Codechef} alt="codechef rating" />
                                            </button>
                                            <ReactTooltip place="top" id="codechef" type="info" effect="float">
                                                    <span>Your codechef rating: {userdetails.codechef}</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ): (userdetails.codechef_username ? (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="codechef" className="user-ratings-btn"
                                            onClick={()=>{setconnectwith("codechef")}}
                                            >
                                                <img src={staticimages.Codechef} alt="codechef rating" />
                                            </button>
                                            <ReactTooltip id="codechef" place="top" type="info" effect="float">
                                                <span>{`${userdetails.codechef_username}, click on the image to connect your account`}</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ): (
                                        //  Modal to add username
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="codechef" className="user-ratings-btn" onClick={()=>setusernamemodal(true)}>
                                                <img src={staticimages.Codechef} alt="codechef rating" />
                                            </button>
                                            <ReactTooltip id="codechef" place="top" type="info" effect="float">
                                                <span>Add your username</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ))
                                    }
                                </li>

                                <li>
                                    {/* Render below tooltip only if rating exists but if rating not
                                    exists but username exists, then render tooltip with "connect your profile" */}
                                    {userdetails && userdetails.codeforces ? userdetails.codeforces===-1 ?
                                    (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="codeforces" className="user-ratings-btn"
                                            onClick={()=>{setusernamemodal(true)}}
                                            >
                                                <img src={staticimages.Codeforces} alt="codeforces rating" />
                                            </button>
                                            <ReactTooltip place="top" id="codeforces" type="info" effect="float">
                                                    <span>Please add your username</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ): 
                                    
                                    (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="codeforces" className="user-ratings-btn">
                                                <img src={staticimages.Codeforces} alt="codeforces rating" />
                                            </button>
                                            <ReactTooltip place="top" id="codeforces" type="info" effect="float">
                                                    <span>Your codeforces rating: {userdetails.codeforces}</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ): (userdetails.codeforces_username ? (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="codeforces" className="user-ratings-btn"
                                            onClick={()=>{setconnectwith("codeforces")}}
                                            >
                                                <img src={staticimages.Codeforces} alt="codeforces rating" />
                                            </button>
                                            <ReactTooltip place="top" id="codeforces" type="info" effect="float">
                                                <span>{`${userdetails.codeforces_username}, click on the image to connect your account`}</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ): (
                                        //  Modal to add username
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="codeforces" className="user-ratings-btn" onClick={()=>{setusernamemodal(true)}}>
                                                <img src={staticimages.Codeforces} alt="codeforces rating" />
                                            </button>
                                            <ReactTooltip place="top" id="codeforces" type="info" effect="float">
                                                <span>Add your username</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ))
                                    }
                                </li>

                                <li>
                                    {/* Render below tooltip only if rating exists but if rating not
                                    exists but username exists, then render tooltip with "connect your profile" */}
                                    {userdetails && userdetails.leetcode ? userdetails.leetcode===-1 ?
                                    (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="leetcode" className="user-ratings-btn">
                                                <img src={staticimages.Leetcode} alt="leetcode problem solved" />
                                            </button>
                                            <ReactTooltip place="top" id="leetcode" type="info" effect="float">
                                                    <span>Please add your username</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ):
                                    
                                    (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="leetcode" className="user-ratings-btn">
                                                <img src={staticimages.Leetcode} alt="leetcode problem solved" />
                                            </button>
                                            <ReactTooltip place="top" id="leetcode" type="info" effect="float">
                                                    <span>Your leetcode problem solved: {userdetails.leetcode}</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ): (userdetails.leetcode_username ? (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="leetcode" className="user-ratings-btn"
                                            onClick={()=>{setconnectwith("leetcode")}}
                                            >
                                                <img src={staticimages.Leetcode} alt="leetcode problem solved" />
                                            </button>
                                            <ReactTooltip place="top" id="leetcode" type="info" effect="float">
                                                <span>{`${userdetails.leetcode_username}, click on the image to connect your account`}</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ): (
                                        //  Modal to add username
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="leetcode" className="user-ratings-btn" onClick={()=>{setusernamemodal(true)}}>
                                                <img src={staticimages.Leetcode} alt="leetcode problem solved" />
                                            </button>
                                            <ReactTooltip place="top" id="leetcode" type="info" effect="float">
                                                <span>Add your username</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ))
                                    }
                                </li>

                                <li>
                                    {/* Render below tooltip only if rating exists but if rating not
                                    exists but username exists, then render tooltip with "connect your profile" */}
                                    {userdetails && userdetails.geeksforgeeks ? userdetails.geeksforgeeks===-1 ?
                                    (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="geeksforgeeks" className="user-ratings-btn">
                                                <img src={staticimages.GeeksforGeeks} alt="geeksforgeeks problem solved" />
                                            </button>
                                            <ReactTooltip place="top" id="geeksforgeeks" type="info" effect="float">
                                                    <span>Please add your username</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ):
                                    (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="geeksforgeeks" className="user-ratings-btn">
                                                <img src={staticimages.GeeksforGeeks} alt="geeksforgeeks problem solved" />
                                            </button>
                                            <ReactTooltip place="top" id="geeksforgeeks" type="info" effect="float">
                                                    <span>Your geeksforgeeks problem solved: {userdetails.geeksforgeeks}</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ): (userdetails.geeksforgeeks_username ? (
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="geeksforgeeks" className="user-ratings-btn"
                                            onClick={()=>{setconnectwith("geeksforgeeks")}}
                                            >
                                                <img src={staticimages.GeeksforGeeks} alt="geeksforgeeks problem solved" />
                                            </button>
                                            <ReactTooltip place="top" id="geeksforgeeks" type="info" effect="float">
                                                <span>{`${userdetails.geeksforgeeks_username}, click on the image to connect your account`}</span>
                                            </ReactTooltip>
                                        </React.Fragment>
                                    ): (
                                        //  Modal to add username
                                        <React.Fragment>
                                            <button data-tip="React-tooltip" data-for="geeksforgeeks" className="user-ratings-btn" onClick={()=>{setusernamemodal(true)}}>
                                                <img src={staticimages.GeeksforGeeks} alt="geeksforgeeks problem solved" />
                                            </button>
                                            <ReactTooltip place="top" id="geeksforgeeks" type="info" effect="float">
                                                <span>Add your username</span>
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
        </React.Fragment>
    )
}


const mapStateToProps= (state) => (
    {
        Loader:state.Loader
    }
)

export default connect(mapStateToProps, {
    setUserDetails,
    logout,
    loader,
    profileloader,
    dark,
    error,
    success,
    warning,
    info
})(Profile);
