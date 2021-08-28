import React,{useState} from 'react';
import {connect} from "react-redux";
import { Link, useHistory, useLocation } from 'react-router-dom';
import apis from "../../services/apis";
import http from "../../services/httpCall";
import {login,logout,setUserDetails} from "../../actions/authAction";
import {dark,error,success,warning,info} from '../../actions/alertAction';
import {loader} from "../../actions/loaderAction";
import {profileloader} from "../../actions/profileLoaderAction";
import './LoginComponent.css';
import staticimages from "../staticImagesLink";
import { useEffect } from 'react';



function LoginComponent({dark,error,success,warning,info,profileloader,loader,login,setUserDetails}) {
    let location = useLocation();
    let history = useHistory();
    // console.log(location.previousroute);
    let previousroute = location.previousroute;
    let [checkbox,setcheckbox] = useState(false);
    let [infomodal,setinfomodal] = useState(false);
    let [view,setview] = useState("signin");
    let [firstname,setfirstname] = useState("");
    let [lastname,setlastname] = useState("");
    let [username,setusername] = useState("");
    let [email, setemail] = useState("");
    let [password,setpassword] = useState("");
    let [confirmpassword,setconfirmpassword] = useState("");
    let [image,setimage] = useState();
    let [codecard_username,setcodecardusername] = useState("");
    let [codechef_username,setcodechefusername] = useState();
    let [codeforces_username,setcodeforcesusername] = useState();
    let [gfg_username,setgeeksforgeeksusername] = useState();
    let [leetcode_username,setleetcodeusername] = useState();
    let [about,setabout] = useState();
    let [country,setcountry] = useState("India");
    let [college,setcollege] = useState();

    const togglepassword = ()=>{
        let pel = window.document.querySelectorAll(".password-field");
        pel.forEach((sel)=>{
            if(sel.type==="password"){
                sel.type="text";
            }else{
                sel.type="password";
            }
        });
    }

    const generatePassword = ()=>{
        var length = 10,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&",
            newpassword = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            newpassword += charset.charAt(Math.floor(Math.random() * n));
        }
        setpassword(newpassword);
        setconfirmpassword(newpassword);
        togglepassword();
    }

    let submit =(e)=>{
        e.preventDefault();
        
        if(view==="signin"){
            // Login code
            if(!username || !password){
                return error("please fill in necessary details")
            }

            profileloader(true);
            http.post(apis.LOGIN,{
                username: username,
                password: password
            }).then((result)=>{
                let token=result.data.token;
                if(token && token!=="null" && token!=="undefined"){
                    login(result.data.token);
                    setUserDetails(result.data.user);
                    warning(`Welcome ${result.data.user.firstname}`);
                    if(previousroute){
                        history.push({
                            pathname:previousroute
                        });
                    }
                }else{
                    error(result.data.error);
                }
            })
            .catch(err=>{
                console.log(err);
                if(!navigator.onLine){
                    history.push("/networkerror");
                }
                error("so sorry, please try after sometime");
            }).finally(()=>{
                profileloader();
            })
        }else{
            // Sign up code
            if(password!==confirmpassword){
                return error("please match your password");
            }
            
            profileloader(true);
            // console.log(image);
            const data = new FormData();
            data.append("firstname",firstname);
            data.append("lastname",lastname);
            data.append("email",email);
            data.append("password",password);
            data.append("codecard_username",codecard_username);
            if(image){
                data.append("image",image);
            }
            if(codechef_username){
                data.append("codechef_username",codechef_username);
            }
            if(codeforces_username){
                data.append("codeforces_username",codeforces_username);
            }
            if(gfg_username){
                data.append("gfg_username",gfg_username);
            }
            if(leetcode_username){
                data.append("leetcode_username",leetcode_username);
            }
            if(about){
                data.append("about",about);
            }
            data.append("country",country);

            if(!college || college==="College"){
                data.append("college", undefined);
            }else{
                data.append("college",college);
            }
            console.log(data.get("college"));
            // info(data.get("image"));
            http.post(apis.REGISTER,data)
            .then((result)=>{
                // console.log(result);
                if(result.data.status===200){
                    success(result.data.message);
                    setview("signin");
                }else{
                    error(result.data.error);
                }
            })
            .catch(err=>{
                console.log(err);
                if(!navigator.onLine){
                    history.push("/networkerror");
                }
                error("so sorry, please try again after sometime");
            }).finally(()=>{
                profileloader();
            });
        }
    }

    useEffect(()=>{
        window.scrollTo(0,0);
        window.onclick = (e)=>{
            let modalContent = document.querySelector("#infomodal");
            if(e.target === modalContent){
                setinfomodal(false);
            }
        }
    },[]);

    useEffect(()=>{
        // console.log(college);
    },[checkbox, college]);

    useEffect(()=>{
        console.log(location);
    },[location]);

    return (
        <>
        {infomodal &&
        (
            <div className="info-modal" id="infomodal">
                <div className="info-modal-main">
                <span className="info-closebtn" onClick={()=>{setinfomodal(false)}}>&times;</span>
                <div className="info-modal-inner">
                <div className="info-header">
                    <h2>Why are we taking your details?</h2>
                    <hr/>
                </div>
                <div className="info-content">
                    <p>1. Email - We will be connecting you through emails when needed.</p>
                    <p>2. Password - It's for your security!</p>
                    <p>3. CodeCard username - How you want our community to know you?</p>
                    <p>4. Bio - Do you want us to know more about you? Sure! We are highly enthusiastic about that.</p>
                    <p>
                        5. Your coding profiles - From starting up as a noob to becoming a pro, we
                        believe and have witnessed that these 4 websites play a major role in your 
                        competitive programming journey. Even if you have just started and are afraid 
                        to jump on these websites, trust us there is nothing to fear, be early be smart. 
                        We highly recommend you start solving questions on these platforms if you 
                        haven't yet. So what are you waiting for? Make your account and tell us about it 
                        so that we can integrate it into our system and help you track your progress.
                    </p>
                </div>
                </div>
                </div>
            </div>
        )
        }
        <div className="container">
            <div className="loginpage-main-content">
                {view==="signin"
                ?
                <>
                <div className="signin-main-content-inner">
                    <div className="signin-form">
                        <div className="social-login-container">
                            <div className="social-login">
                                <i className="fab fa-github fa-2x"></i>
                                <a href="https://github.com/login/oauth/authorize?client_id=1945aaec7bd346116630">Sign in with Github</a>
                            </div>
                        </div>
                        <div className="or">
                            <p>or</p>
                        </div>
                        <form onSubmit={submit}>
                            <div className="form-heading">
                                <h2>Signin</h2>
                                <p onClick={()=>setview("signup")}>want to signup?</p>
                            </div>
                            {/* Form Details */}
                            {/* Email */}
                            <div className="row">
                                <div className="col">
                                    <input 
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Email/ CodeCard Username*"
                                    aria-label="Email"
                                    onChange={(e)=>setusername(e.target.value)}
                                    required
                                    />
                                </div>
                            </div>
                            <br/>
                            {/* Password*/}
                            <div className="row">
                                <div className="col">
                                    <input 
                                    type="password" 
                                    className="form-control form-control-sm" 
                                    placeholder="Password*" 
                                    aria-label="password" 
                                    onChange={(e)=>setpassword(e.target.value)}
                                    required
                                    />
                                </div>
                            </div>
                            {/* <br/>
                            <div className="col">
                                    <Link to="#" className="btn btn-sm btn-outline-warning password-field" onClick={togglepasswordsignin}>
                                    show me my entered password
                                    </Link >
                            </div> */}
                            <br/>
                            <Link to="/forgotpassword" className="forgotpassword">Forgot your password?</Link>
                            <button type="submit" className="btn btn-warning signin-btn">Sign in</button>
                        </form>
                    </div>
                    <div className="signin-sidecharacter-box">
                        <div className="signin-sidecharacter-img">
                            <img src={staticimages.Ganesh} alt="gaitonde"/>
                        </div>
                        <div className="signin-sidecharacter-box-content">
                            <p>Jab tak ye login</p>
                            <p>nhi hoga sahab</p>
                            <p>apun idhar-ich hai.</p>
                            <h6>-By Gaitonde</h6>
                        </div>
                    </div>
                </div>
                </>
                :
                <>
                <div className="signup-main-content-inner">
                <div className="sidecharacter-box">
                        <div className="sidecharacter-img">
                            <img src={staticimages.Ganesh} alt="gaitonde"/>
                        </div>
                        <div className="sidecharacter-box-content">
                            <p>Jab tak ye register</p>
                            <p>nhi hoga sahab</p>
                            <p>apun idhar-ich hai.</p>
                            <h6>-By Gaitonde</h6>
                        </div>
                    </div>
                    <div className="signup-form">
                        <form onSubmit={submit}>
                            <div className="form-heading">
                                <h2>Signup</h2>
                                <p onClick={()=>setview("signin")}>already have an account?</p>
                            </div>
                            {/* Form Details */}
                            {/* Firstname & Lastname */}
                            <div className="row">
                                <div className="col">
                                    <input type="text" onChange={(e)=>setfirstname(e.target.value)} className="form-control form-control-sm" placeholder="First name*" aria-label="First name" required/>
                                </div>
                                <div className="col">
                                    <input type="text" onChange={(e)=>setlastname(e.target.value)} className="form-control form-control-sm" placeholder="Last name*" aria-label="Last name" required/>
                                </div>
                            </div>
                            <br/>
                            {/* Email */}
                            <div className="row">
                                <div className="col">
                                    <input type="email" onChange={(e)=>setemail(e.target.value)} className="form-control form-control-sm" placeholder="Email*" aria-label="Email" required/>
                                </div>
                            </div>
                            <br/>
                            {/* Password & Confirm Password */}
                            <div className="row password-div">
                                <div className="col input-group mb-3">
                                    <input type="password" onChange={(e)=>setpassword(e.target.value)} value={password} className="form-control form-control-sm password-field" placeholder="Password*" aria-label="Password" aria-describedby="password" required/>
                                    {/* <i className="fa fa-eye" aria-hidden="true"></i> */}
                                    <button className="btn btn-outline-warning btn-sm" onClick={generatePassword} type="button" id="password">Generate for me</button>
                                </div>
                                <div className="col input-group mb-3">
                                    <input type="password" onChange={(e)=>setconfirmpassword(e.target.value)} value={confirmpassword} className="form-control form-control-sm password-field" placeholder="Confirm Password*" aria-label="Confirm" aria-describedby="password" required/>
                                    {/* <i className="fa fa-eye" aria-hidden="true"></i> */}
                                    <button className="btn btn-outline-warning btn-sm" onClick={togglepassword} type="button" id="password2">Show Password</button>
                                </div>
                            </div>

                            {/* CodeCardUsername & Imageurl*/}
                            <div className="row">
                                <div className="col">
                                    <input type="text" onChange={(e)=>setcodecardusername(e.target.value)} className="form-control form-control-sm" placeholder="CodeCard Username*" aria-label="CodeCard Username*" required/>
                                </div>
                                <div className="col input-group mb-3 image-div">
                                    <input type="file" name="image" onChange={(e)=>{
                                        setimage(e.target.files[0]);
                                    }} className="form-control form-control-sm" id="inputGroupFile02" />
                                    <label className="input-group-text signup-pic-input" htmlFor="inputGroupFile02">{image ? "Uploaded successfully":"Choose your profile pic"} </label>
                                </div>
                            </div>
                            {/* About */}
                            <textarea 
                                className="form-control form-control-sm" 
                                cols="30" 
                                rows="5"
                                placeholder="Your Short Bio (Optional)"
                                onChange={(e)=>setabout(e.target.value)}
                                />
                                <br/>
                            {/* CodechefUsername & CodeforcesUsername */}
                            <div className="row">
                                <div className="col">
                                    <input type="text" onChange={(e)=>setcodechefusername(e.target.value)} className="form-control form-control-sm" placeholder="Codechef Username(optional)" aria-label="Codechef Username"/>
                                </div>
                                <div className="col">
                                    <input type="text" onChange={(e)=>setcodeforcesusername(e.target.value)} className="form-control form-control-sm" placeholder="Codeforces Username(optional)" aria-label="Codeforces Username"/>
                                </div>
                            </div>
                            <br/>
                            {/* Gfgusername & Leetcodeusername */}
                            <div className="row">
                                <div className="col">
                                    <input type="text" onChange={(e)=>setgeeksforgeeksusername(e.target.value)} className="form-control form-control-sm" placeholder="Geeksforgeeks Username(optional)" aria-label="Geeksforgeeks Username"/>
                                </div>
                                <div className="col">
                                    <input type="text" onChange={(e)=>setleetcodeusername(e.target.value)} className="form-control form-control-sm" placeholder="Leetcode Username(optional)" aria-label="Leetcode Username"/>
                                </div>
                            </div>
                            <br/>
                            {/* College & Country */}
                            <div className="row">
                                <div className="col">
                                    <select 
                                    className="form-select form-select-sm" 
                                    aria-label=".form-select-sm example"
                                    onClick={(e)=> setcountry(e.target.value)}
                                    >
                                        <option value="India">India</option>
                                        <option value="Afghanistan">Afghanistan</option>
                                        <option value="Aland Islands">Aland Islands</option>
                                        <option value="Albania">Albania</option>
                                        <option value="Algeria">Algeria</option>
                                        <option value="American Samoa">American Samoa</option>
                                        <option value="Andorra">Andorra</option>
                                        <option value="Angola">Angola</option>
                                        <option value="Anguilla">Anguilla</option>
                                        <option value="Antarctica">Antarctica</option>
                                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Armenia">Armenia</option>
                                        <option value="Aruba">Aruba</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Austria">Austria</option>
                                        <option value="Azerbaijan">Azerbaijan</option>
                                        <option value="Bahamas">Bahamas</option>
                                        <option value="Bahrain">Bahrain</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="Barbados">Barbados</option>
                                        <option value="Belarus">Belarus</option>
                                        <option value="Belgium">Belgium</option>
                                        <option value="Belize">Belize</option>
                                        <option value="Benin">Benin</option>
                                        <option value="Bermuda">Bermuda</option>
                                        <option value="Bhutan">Bhutan</option>
                                        <option value="Bolivia (Plurinational State of)">Bolivia (Plurinational State of)</option>
                                        <option value="Bonaire, Sint Eustatius and Saba">Bonaire, Sint Eustatius and Saba</option>
                                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                        <option value="Botswana">Botswana</option>
                                        <option value="Bouvet Island">Bouvet Island</option>
                                        <option value="Brazil">Brazil</option>
                                        <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                        <option value="Brunei Darussalam">Brunei Darussalam</option>
                                        <option value="Bulgaria">Bulgaria</option>
                                        <option value="Burkina Faso">Burkina Faso</option>
                                        <option value="Burundi">Burundi</option>
                                        <option value="Cabo Verde">Cabo Verde</option>
                                        <option value="Cambodia">Cambodia</option>
                                        <option value="Cameroon">Cameroon</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Cayman Islands">Cayman Islands</option>
                                        <option value="Central African Republic">Central African Republic</option>
                                        <option value="Chad">Chad</option>
                                        <option value="Chile">Chile</option>
                                        <option value="China">China</option>
                                        <option value="Christmas Island">Christmas Island</option>
                                        <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="Comoros">Comoros</option>
                                        <option value="Congo">Congo</option>
                                        <option value="Congo (Democratic Republic of the)">Congo (Democratic Republic of the)</option>
                                        <option value="Cook Islands">Cook Islands</option>
                                        <option value="Costa Rica">Costa Rica</option>
                                        <option value="Cote d'Ivoire">Cote d'Ivoire</option>
                                        <option value="Croatia">Croatia</option>
                                        <option value="Cuba">Cuba</option>
                                        <option value="Curacao">Curacao</option>
                                        <option value="Cyprus">Cyprus</option>
                                        <option value="Czech Republic">Czech Republic</option>
                                        <option value="Denmark">Denmark</option>
                                        <option value="Djibouti">Djibouti</option>
                                        <option value="Dominica">Dominica</option>
                                        <option value="Dominican Republic">Dominican Republic</option>
                                        <option value="Ecuador">Ecuador</option>
                                        <option value="Egypt">Egypt</option>
                                        <option value="El Salvador">El Salvador</option>
                                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                                        <option value="Eritrea">Eritrea</option>
                                        <option value="Estonia">Estonia</option>
                                        <option value="Ethiopia">Ethiopia</option>
                                        <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                        <option value="Faroe Islands">Faroe Islands</option>
                                        <option value="Fiji">Fiji</option>
                                        <option value="Finland">Finland</option>
                                        <option value="France">France</option>
                                        <option value="French Guiana">French Guiana</option>
                                        <option value="French Polynesia">French Polynesia</option>
                                        <option value="French Southern Territories">French Southern Territories</option>
                                        <option value="Gabon">Gabon</option>
                                        <option value="Gambia">Gambia</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="Gibraltar">Gibraltar</option>
                                        <option value="Greece">Greece</option>
                                        <option value="Greenland">Greenland</option>
                                        <option value="Grenada">Grenada</option>
                                        <option value="Guadeloupe">Guadeloupe</option>
                                        <option value="Guam">Guam</option>
                                        <option value="Guatemala">Guatemala</option>
                                        <option value="Guernsey">Guernsey</option>
                                        <option value="Guinea">Guinea</option>
                                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                                        <option value="Guyana">Guyana</option>
                                        <option value="Haiti">Haiti</option>
                                        <option value="Heard Island and McDonald Islands">Heard Island and McDonald Islands</option>
                                        <option value="Holy See">Holy See</option>
                                        <option value="Honduras">Honduras</option>
                                        <option value="Hong Kong">Hong Kong</option>
                                        <option value="Hungary">Hungary</option>
                                        <option value="Iceland">Iceland</option>
                                        <option value="Indonesia">Indonesia</option>
                                        <option value="Iran (Islamic Republic of)">Iran (Islamic Republic of)</option>
                                        <option value="Iraq">Iraq</option>
                                        <option value="Ireland">Ireland</option>
                                        <option value="Isle of Man">Isle of Man</option>
                                        <option value="Israel">Israel</option>
                                        <option value="Italy">Italy</option>
                                        <option value="Jamaica">Jamaica</option>
                                        <option value="Japan">Japan</option>
                                        <option value="Jersey">Jersey</option>
                                        <option value="Jordan">Jordan</option>
                                        <option value="Kazakhstan">Kazakhstan</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="Kiribati">Kiribati</option>
                                        <option value="Korea (Democratic People's Republic of)">Korea (Democratic People's Republic of)</option>
                                        <option value="Korea (Republic of)">Korea (Republic of)</option>
                                        <option value="Kuwait">Kuwait</option>
                                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                                        <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                                        <option value="Latvia">Latvia</option>
                                        <option value="Lebanon">Lebanon</option>
                                        <option value="Lesotho">Lesotho</option>
                                        <option value="Liberia">Liberia</option>
                                        <option value="Libya">Libya</option>
                                        <option value="Liechtenstein">Liechtenstein</option>
                                        <option value="Lithuania">Lithuania</option>
                                        <option value="Luxembourg">Luxembourg</option>
                                        <option value="Macao">Macao</option>
                                        <option value="Macedonia (the former Yugoslav Republic of)">Macedonia (the former Yugoslav Republic of)</option>
                                        <option value="Madagascar">Madagascar</option>
                                        <option value="Malawi">Malawi</option>
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="Maldives">Maldives</option>
                                        <option value="Mali">Mali</option>
                                        <option value="Malta">Malta</option>
                                        <option value="Marshall Islands">Marshall Islands</option>
                                        <option value="Martinique">Martinique</option>
                                        <option value="Mauritania">Mauritania</option>
                                        <option value="Mauritius">Mauritius</option>
                                        <option value="Mayotte">Mayotte</option>
                                        <option value="Mexico">Mexico</option>
                                        <option value="Micronesia (Federated States of)">Micronesia (Federated States of)</option>
                                        <option value="Moldova (Republic of)">Moldova (Republic of)</option>
                                        <option value="Monaco">Monaco</option>
                                        <option value="Mongolia">Mongolia</option>
                                        <option value="Montenegro">Montenegro</option>
                                        <option value="Montserrat">Montserrat</option>
                                        <option value="Morocco">Morocco</option>
                                        <option value="Mozambique">Mozambique</option>
                                        <option value="Myanmar">Myanmar</option>
                                        <option value="Namibia">Namibia</option>
                                        <option value="Nauru">Nauru</option>
                                        <option value="Nepal">Nepal</option>
                                        <option value="Netherlands">Netherlands</option>
                                        <option value="New Caledonia">New Caledonia</option>
                                        <option value="New Zealand">New Zealand</option>
                                        <option value="Nicaragua">Nicaragua</option>
                                        <option value="Niger">Niger</option>
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="Niue">Niue</option>
                                        <option value="Norfolk Island">Norfolk Island</option>
                                        <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                        <option value="Norway">Norway</option>
                                        <option value="Oman">Oman</option>
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="Palau">Palau</option>
                                        <option value="Palestine, State of">Palestine, State of</option>
                                        <option value="Panama">Panama</option>
                                        <option value="Papua New Guinea">Papua New Guinea</option>
                                        <option value="Paraguay">Paraguay</option>
                                        <option value="Peru">Peru</option>
                                        <option value="Philippines">Philippines</option>
                                        <option value="Pitcairn">Pitcairn</option>
                                        <option value="Poland">Poland</option>
                                        <option value="Portugal">Portugal</option>
                                        <option value="Puerto Rico">Puerto Rico</option>
                                        <option value="Qatar">Qatar</option>
                                        <option value="Republic of Kosovo">Republic of Kosovo</option>
                                        <option value="Reunion">Reunion</option>
                                        <option value="Romania">Romania</option>
                                        <option value="Russian Federation">Russian Federation</option>
                                        <option value="Rwanda">Rwanda</option>
                                        <option value="Saint Barthelemy">Saint Barthelemy</option>
                                        <option value="Saint Helena, Ascension and Tristan da Cunha">Saint Helena, Ascension and Tristan da Cunha</option>
                                        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                        <option value="Saint Lucia">Saint Lucia</option>
                                        <option value="Saint Martin (French part)">Saint Martin (French part)</option>
                                        <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                        <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                                        <option value="Samoa">Samoa</option>
                                        <option value="San Marino">San Marino</option>
                                        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="Senegal">Senegal</option>
                                        <option value="Serbia">Serbia</option>
                                        <option value="Seychelles">Seychelles</option>
                                        <option value="Sierra Leone">Sierra Leone</option>
                                        <option value="Singapore">Singapore</option>
                                        <option value="Sint Maarten (Dutch part)">Sint Maarten (Dutch part)</option>
                                        <option value="Slovakia">Slovakia</option>
                                        <option value="Slovenia">Slovenia</option>
                                        <option value="Solomon Islands">Solomon Islands</option>
                                        <option value="Somalia">Somalia</option>
                                        <option value="South Africa">South Africa</option>
                                        <option value="South Georgia and the South Sandwich Islands">South Georgia and the South Sandwich Islands</option>
                                        <option value="South Sudan">South Sudan</option>
                                        <option value="Spain">Spain</option>
                                        <option value="Sri Lanka">Sri Lanka</option>
                                        <option value="Sudan">Sudan</option>
                                        <option value="Suriname">Suriname</option>
                                        <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                        <option value="Swaziland">Swaziland</option>
                                        <option value="Sweden">Sweden</option>
                                        <option value="Switzerland">Switzerland</option>
                                        <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                        <option value="Taiwan, Province of China">Taiwan, Province of China</option>
                                        <option value="Tajikistan">Tajikistan</option>
                                        <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                        <option value="Thailand">Thailand</option>
                                        <option value="Timor-Leste">Timor-Leste</option>
                                        <option value="Togo">Togo</option>
                                        <option value="Tokelau">Tokelau</option>
                                        <option value="Tonga">Tonga</option>
                                        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                        <option value="Tunisia">Tunisia</option>
                                        <option value="Turkey">Turkey</option>
                                        <option value="Turkmenistan">Turkmenistan</option>
                                        <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                        <option value="Tuvalu">Tuvalu</option>
                                        <option value="Uganda">Uganda</option>
                                        <option value="Ukraine">Ukraine</option>
                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                        <option value="United Kingdom of Great Britain and Northern Ireland">United Kingdom of Great Britain and Northern Ireland</option>
                                        <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                        <option value="United States of America">United States of America</option>
                                        <option value="Uruguay">Uruguay</option>
                                        <option value="Uzbekistan">Uzbekistan</option>
                                        <option value="Vanuatu">Vanuatu</option>
                                        <option value="Venezuela (Bolivarian Republic of)">Venezuela (Bolivarian Republic of)</option>
                                        <option value="Viet Nam">Viet Nam</option>
                                        <option value="Virgin Islands (British)">Virgin Islands (British)</option>
                                        <option value="Virgin Islands (U.S.)">Virgin Islands (U.S.)</option>
                                        <option value="Wallis and Futuna">Wallis and Futuna</option>
                                        <option value="Western Sahara">Western Sahara</option>
                                        <option value="Yemen">Yemen</option>
                                        <option value="Zambia">Zambia</option>
                                        <option value="Zimbabwe">Zimbabwe</option>
                                    </select>
                                </div>
                                <div className="col">
                                    <select 
                                        className="form-select form-select-sm" 
                                        aria-label=".form-select-sm example"
                                        onClick={(e)=> setcollege(e.target.value)}
                                    >
                                        <option value={undefined}>College</option>
                                        <option value="Kalyani Government Engineering College">Kalyani Government Engineering College</option>
                                        <option value="Indian Institute of Technology Kharagpur">Indian Institute of Technology Kharagpur</option>
                                        <option value="1337 Coding School">1337 Coding School</option>
                                        <option value="Aalto University">Aalto University</option>
                                        <option value="Abes Engineering college, Ghaziabad">Abes Engineering college, Ghaziabad</option>
                                        <option value="ABES IT Group of Institutions, Ghaziabad">ABES IT Group of Institutions, Ghaziabad</option>
                                        <option value="ABV - Indian Institute of Information Technology and Management Gwalior">ABV - Indian Institute of Information Technology and Management Gwalior</option>
                                        <option value="Academy of Technology, West Bengal">Academy of Technology, West Bengal</option>
                                        <option value="Acropolis Institute of Technology &amp; Research, Indore">Acropolis Institute of Technology &amp; Research, Indore</option>
                                        <option value="ADA University">ADA University</option>
                                        <option value="Adobe Systems">Adobe Systems</option>
                                        <option value="AE high school">AE high school</option>
                                        <option value="Affiliated High School of Fujian Normal University">Affiliated High School of Fujian Normal University</option>
                                        <option value="AGH University of Science and Technology">AGH University of Science and Technology</option>
                                        <option value="Ahsanullah University of Science and Technology">Ahsanullah University of Science and Technology</option>
                                        <option value="Ain-shams university">Ain-shams university</option>
                                        <option value="Ains shams universty">Ains shams universty</option>
                                        <option value="Ajay Kumar Garg Engineering College, Ghaziabad">Ajay Kumar Garg Engineering College, Ghaziabad</option>
                                        <option value="Ajou University">Ajou University</option>
                                        <option value="Aktobe Kazakh -Turkish High School Aktobe Kazakhstan">Aktobe Kazakh -Turkish High School Aktobe Kazakhstan</option>
                                        <option value="Al Akhawayn University">Al Akhawayn University</option>
                                        <option value="Al Akhawayn University,  Ifrane">Al Akhawayn University,  Ifrane</option>
                                        <option value="Al-Baath University">Al-Baath University</option>
                                        <option value="Al-Zaytoonah University of Jordan">Al-Zaytoonah University of Jordan</option>
                                        <option value="Aleppo University">Aleppo University</option>
                                        <option value="Alexandru Ioan Cuza University">Alexandru Ioan Cuza University</option>
                                        <option value="Allame Helli">Allame Helli</option>
                                        <option value="Almaty Kazakh - Turkish High School Almaty Kazakhstan">Almaty Kazakh - Turkish High School Almaty Kazakhstan</option>
                                        <option value="AlternativaPlatform">AlternativaPlatform</option>
                                        <option value="Ambala College of Engineering and Applied Research, Ambala">Ambala College of Engineering and Applied Research, Ambala</option>
                                        <option value="Ambedkar Institute of Advanced Communication Technology &amp; Research">Ambedkar Institute of Advanced Communication Technology &amp; Research</option>
                                        <option value="American International University Bangladesh">American International University Bangladesh</option>
                                        <option value="American University in Bulgaria">American University in Bulgaria</option>
                                        <option value="American University of Armenia">American University of Armenia</option>
                                        <option value="American University of Beirut">American University of Beirut</option>
                                        <option value="Amirkabir University of Technology">Amirkabir University of Technology</option>
                                        <option value="Amity School of Engineering and Technology">Amity School of Engineering and Technology</option>
                                        <option value="Amity University, Noida">Amity University, Noida</option>
                                        <option value="Amrita School of Engineering">Amrita School of Engineering</option>
                                        <option value="Amrita School Of Engineering, Amritapuri">Amrita School Of Engineering, Amritapuri</option>
                                        <option value="Amrita School of Engineering, Coimbatore">Amrita School of Engineering, Coimbatore</option>
                                        <option value="Amrita Vishwa Vidyapeetham">Amrita Vishwa Vidyapeetham</option>
                                        <option value="Amur State University">Amur State University</option>
                                        <option value="Anil Neerukonda Institute of Technology and Sciences">Anil Neerukonda Institute of Technology and Sciences</option>
                                        <option value="Appa Institute Of Engineering and Technology">Appa Institute Of Engineering and Technology</option>
                                        <option value="Arab Academy for Science and Technology">Arab Academy for Science and Technology</option>
                                        <option value="Army Institute of Technology, Pune">Army Institute of Technology, Pune</option>
                                        <option value="Army Public School, Dighi Pune">Army Public School, Dighi Pune</option>
                                        <option value="Asansol Engineering College, West Bengal">Asansol Engineering College, West Bengal</option>
                                        <option value="Ashgabat, Bashkent TTHS">Ashgabat, Bashkent TTHS</option>
                                        <option value="Assiut University">Assiut University</option>
                                        <option value="Astana Kazakh-Turkish high school for gifted boys">Astana Kazakh-Turkish high school for gifted boys</option>
                                        <option value="Astrakhan state university">Astrakhan state university</option>
                                        <option value="Ateneo de Manila University">Ateneo de Manila University</option>
                                        <option value="Ateneo de Naga University">Ateneo de Naga University</option>
                                        <option value="Atharva College of Engineering , Malad">Atharva College of Engineering , Malad</option>
                                        <option value="Atlantik Ahmet Ulusoy College">Atlantik Ahmet Ulusoy College</option>
                                        <option value="Atlantik College">Atlantik College</option>
                                        <option value="AWH Engineering College, Calicut">AWH Engineering College, Calicut</option>
                                        <option value="Azhar University">Azhar University</option>
                                        <option value="B K Birla Institute of Engineering &amp; Technology, Pilani">B K Birla Institute of Engineering &amp; Technology, Pilani</option>
                                        <option value="B P Poddar Institute of Management &amp; Technology, Kolkata">B P Poddar Institute of Management &amp; Technology, Kolkata</option>
                                        <option value="B.V. Bhoomaraddi College of Engineering and Technology, Hubli">B.V. Bhoomaraddi College of Engineering and Technology, Hubli</option>
                                        <option value="Baba Saheb Ambedkar Institute of Technology &amp; Management, Faridabad">Baba Saheb Ambedkar Institute of Technology &amp; Management, Faridabad</option>
                                        <option value="Babaria Institute of Technology, Vadodara">Babaria Institute of Technology, Vadodara</option>
                                        <option value="Babasaheb Naik College of Engineering, Pusad">Babasaheb Naik College of Engineering, Pusad</option>
                                        <option value="Babeș-Bolyai University">Babeș-Bolyai University</option>
                                        <option value="Babu Banarasi Das Educational Society's Group of Institutions">Babu Banarasi Das Educational Society's Group of Institutions</option>
                                        <option value="Baddi University of Emerging Sciences and Technologies">Baddi University of Emerging Sciences and Technologies</option>
                                        <option value="Bakhtiyarpur College of Engineering, Patna">Bakhtiyarpur College of Engineering, Patna</option>
                                        <option value="Baku Turkish Private High School">Baku Turkish Private High School</option>
                                        <option value="Banasthali University">Banasthali University</option>
                                        <option value="Bandung Institute of Technology">Bandung Institute of Technology</option>
                                        <option value="Bangabandhu Sheikh Mujibur Rahman Science and Technology University">Bangabandhu Sheikh Mujibur Rahman Science and Technology University</option>
                                        <option value="Bangalore University">Bangalore University</option>
                                        <option value="Bangladesh Open University">Bangladesh Open University</option>
                                        <option value="Bangladesh University">Bangladesh University</option>
                                        <option value="Bangladesh University of Engineering and Technology">Bangladesh University of Engineering and Technology</option>
                                        <option value="Bangladesh University of Professionals">Bangladesh University of Professionals</option>
                                        <option value="Barazandeh Moghadam">Barazandeh Moghadam</option>
                                        <option value="Barnaul, Gymnasium 42">Barnaul, Gymnasium 42</option>
                                        <option value="Bauman MSTU">Bauman MSTU</option>
                                        <option value="Begum Rokeya University, Rangpur">Begum Rokeya University, Rangpur</option>
                                        <option value="Beihang University">Beihang University</option>
                                        <option value="Beijing Institute of Technology">Beijing Institute of Technology</option>
                                        <option value="Beijing JiaoTong University">Beijing JiaoTong University</option>
                                        <option value="Beijing No.8 Middle School">Beijing No.8 Middle School</option>
                                        <option value="Beijing Normal University, Zhuhai">Beijing Normal University, Zhuhai</option>
                                        <option value="Beijing University of Aeronautics and Astronautics">Beijing University of Aeronautics and Astronautics</option>
                                        <option value="Beijing University of Posts and Telecommunications">Beijing University of Posts and Telecommunications</option>
                                        <option value="Beijing, BUAA">Beijing, BUAA</option>
                                        <option value="Belarussian SUIR">Belarussian SUIR</option>
                                        <option value="Belgrade, School of Electrical Engineering">Belgrade, School of Electrical Engineering</option>
                                        <option value="Benemérita Universidad Autónoma de Puebla">Benemérita Universidad Autónoma de Puebla</option>
                                        <option value="Bengal Institute of Technology, Kolkata">Bengal Institute of Technology, Kolkata</option>
                                        <option value="Beni Suef University, Egypt">Beni Suef University, Egypt</option>
                                        <option value="Bhagwan Parshuram Institute of Technology">Bhagwan Parshuram Institute of Technology</option>
                                        <option value="Bharati Vidyapeeth College of Engineering, Delhi">Bharati Vidyapeeth College of Engineering, Delhi</option>
                                        <option value="Bhilai Institute of Technology Durg">Bhilai Institute of Technology Durg</option>
                                        <option value="Bhilai Institute of Technology, Raipur">Bhilai Institute of Technology, Raipur</option>
                                        <option value="Bilkent University">Bilkent University</option>
                                        <option value="Binus University">Binus University</option>
                                        <option value="Birla Institute of Technology &amp; Science Pilani, Goa Campus">Birla Institute of Technology &amp; Science Pilani, Goa Campus</option>
                                        <option value="Birla Institute of Technology &amp; Science Pilani, Hyderabad Campus">Birla Institute of Technology &amp; Science Pilani, Hyderabad Campus</option>
                                        <option value="Birla Institute of Technology &amp; Science Pilani, Pilani Campus">Birla Institute of Technology &amp; Science Pilani, Pilani Campus</option>
                                        <option value="Birla Institute of Technology Jaipur">Birla Institute of Technology Jaipur</option>
                                        <option value="Birla Institute Of Technology, Mesra">Birla Institute Of Technology, Mesra</option>
                                        <option value="Birla Institute Of Technology, Patna">Birla Institute Of Technology, Patna</option>
                                        <option value="Birsa Institute of Technology, Sindri">Birsa Institute of Technology, Sindri</option>
                                        <option value="Black organization">Black organization</option>
                                        <option value="Black Sabbath">Black Sabbath</option>
                                        <option value="BMS Institute of Technology, Bangalore">BMS Institute of Technology, Bangalore</option>
                                        <option value="BNM Institute of Technology, Bangalore">BNM Institute of Technology, Bangalore</option>
                                        <option value="Bogazici University">Bogazici University</option>
                                        <option value="Brac University">Brac University</option>
                                        <option value="Brest, Gymnasium 1">Brest, Gymnasium 1</option>
                                        <option value="British University In Egypt">British University In Egypt</option>
                                        <option value="Brown University">Brown University</option>
                                        <option value="BUBT-Bangladesh University of Business &amp; Technology">BUBT-Bangladesh University of Business &amp; Technology</option>
                                        <option value="Budge Budge Institute of Technology, Calcutta">Budge Budge Institute of Technology, Calcutta</option>
                                        <option value="Bundelkhand Institute of Engineering &amp; Technology">Bundelkhand Institute of Engineering &amp; Technology</option>
                                        <option value="Buryat State University">Buryat State University</option>
                                        <option value="Business Information System - Helwan University">Business Information System - Helwan University</option>
                                        <option value="BVRIT Hyderabad">BVRIT Hyderabad</option>
                                        <option value="C. V. Raman College of Engineering">C. V. Raman College of Engineering</option>
                                        <option value="C.N. Liviu Rebreanu Bistrita">C.N. Liviu Rebreanu Bistrita</option>
                                        <option value="Cairo University">Cairo University</option>
                                        <option value="Cambridge School Indirapuram">Cambridge School Indirapuram</option>
                                        <option value="Can Tho University">Can Tho University</option>
                                        <option value="Carnegie Mellon University">Carnegie Mellon University</option>
                                        <option value="Caucasus University">Caucasus University</option>
                                        <option value="Central South Univercity">Central South Univercity</option>
                                        <option value="Central South University">Central South University</option>
                                        <option value="Chaitanya Bharathi Institute of Technology, Hyderabad">Chaitanya Bharathi Institute of Technology, Hyderabad</option>
                                        <option value="Chandannagar Banga Vidyalaya Tematha Cngr, Hooghly">Chandannagar Banga Vidyalaya Tematha Cngr, Hooghly</option>
                                        <option value="Chandigarh College of Engineering &amp; Technology">Chandigarh College of Engineering &amp; Technology</option>
                                        <option value="Chandigarh University">Chandigarh University</option>
                                        <option value="ChangAn university">ChangAn university</option>
                                        <option value="Changchun University of Science and Technology">Changchun University of Science and Technology</option>
                                        <option value="Changchun, HSANNU">Changchun, HSANNU</option>
                                        <option value="Changjun High School">Changjun High School</option>
                                        <option value="Changsha University of Science and Technology">Changsha University of Science and Technology</option>
                                        <option value="Changzhou Senior High School of Jiangsu Province">Changzhou Senior High School of Jiangsu Province</option>
                                        <option value="Changzhou University">Changzhou University</option>
                                        <option value="Charles University in Prague">Charles University in Prague</option>
                                        <option value="Charotar University of Science and Technology">Charotar University of Science and Technology</option>
                                        <option value="Chechens Association">Chechens Association</option>
                                        <option value="Chelyabinsk, FML 31">Chelyabinsk, FML 31</option>
                                        <option value="Chelyabinsk, Lyceum№31">Chelyabinsk, Lyceum№31</option>
                                        <option value="Chengdu No.7 High School">Chengdu No.7 High School</option>
                                        <option value="Chengdu University of Information Technology">Chengdu University of Information Technology</option>
                                        <option value="Chennai Mathematical Institute">Chennai Mathematical Institute</option>
                                        <option value="Cherkasy National University">Cherkasy National University</option>
                                        <option value="Cherkasy Physics and Mathematics Lyceum">Cherkasy Physics and Mathematics Lyceum</option>
                                        <option value="Chicken University">Chicken University</option>
                                        <option value="China Rome Organization">China Rome Organization</option>
                                        <option value="China University of Geosciences">China University of Geosciences</option>
                                        <option value="China University of Petroleum">China University of Petroleum</option>
                                        <option value="Chittagong University of Eng and Tech">Chittagong University of Eng and Tech</option>
                                        <option value="Chongqing Bashu Middle School">Chongqing Bashu Middle School</option>
                                        <option value="Chongqing University">Chongqing University</option>
                                        <option value="Christ University,Bangalore">Christ University,Bangalore</option>
                                        <option value="Chu Van An High School">Chu Van An High School</option>
                                        <option value="Chulalongkorn University">Chulalongkorn University</option>
                                        <option value="Chung Ling High School, Penang">Chung Ling High School, Penang</option>
                                        <option value="Chuyen Phan Boi Chau">Chuyen Phan Boi Chau</option>
                                        <option value="ChuyenYb">ChuyenYb</option>
                                        <option value="Citrix Systems">Citrix Systems</option>
                                        <option value="City University, Bangladesh">City University, Bangladesh</option>
                                        <option value="Clements HS">Clements HS</option>
                                        <option value="CMR College of Engineering &amp; Technology, Hyderabad">CMR College of Engineering &amp; Technology, Hyderabad</option>
                                        <option value="CN Fratii Buzesti">CN Fratii Buzesti</option>
                                        <option value="CN Unirea Tg Mures">CN Unirea Tg Mures</option>
                                        <option value="CNILC Ploiesti">CNILC Ploiesti</option>
                                        <option value="CNMV PLOIESTI">CNMV PLOIESTI</option>
                                        <option value="Cochin University of Science and Technology">Cochin University of Science and Technology</option>
                                        <option value="Colegiul National Mircea cel Batran">Colegiul National Mircea cel Batran</option>
                                        <option value="Colegiul National Silvania">Colegiul National Silvania</option>
                                        <option value="College Of Engineering , Guindy">College Of Engineering , Guindy</option>
                                        <option value="College of Engineering and Technology, Bhubaneswar">College of Engineering and Technology, Bhubaneswar</option>
                                        <option value="College of Engineering, Guindy">College of Engineering, Guindy</option>
                                        <option value="College of Engineering, Pune">College of Engineering, Pune</option>
                                        <option value="College of Engineering, Trivandrum">College of Engineering, Trivandrum</option>
                                        <option value="College of Technology and Engineering, Udaipur">College of Technology and Engineering, Udaipur</option>
                                        <option value="College of Technology, Pantnagar">College of Technology, Pantnagar</option>
                                        <option value="Comenius University">Comenius University</option>
                                        <option value="Comilla University">Comilla University</option>
                                        <option value="Cornell University">Cornell University</option>
                                        <option value="CS Academy">CS Academy</option>
                                        <option value="Ctg Cantonment Public College">Ctg Cantonment Public College</option>
                                        <option value="CTU in Prague">CTU in Prague</option>
                                        <option value="Cummins College of Engineering for Women%">Cummins College of Engineering for Women%</option>
                                        <option value="Da Nang University of Technology">Da Nang University of Technology</option>
                                        <option value="Daffodil institute of IT, Bangladesh">Daffodil institute of IT, Bangladesh</option>
                                        <option value="Daffodil International University">Daffodil International University</option>
                                        <option value="Dalian Maritime University">Dalian Maritime University</option>
                                        <option value="Damascus university">Damascus university</option>
                                        <option value="Danang University of Technology">Danang University of Technology</option>
                                        <option value="Danderyds Gymnasium">Danderyds Gymnasium</option>
                                        <option value="Danyang High School">Danyang High School</option>
                                        <option value="Daryn">Daryn</option>
                                        <option value="Dayananda Sagar College of Engineering, Bangalore">Dayananda Sagar College of Engineering, Bangalore</option>
                                        <option value="DCRUST Murthal">DCRUST Murthal</option>
                                        <option value="Delhi Public School R.K.Puram">Delhi Public School R.K.Puram</option>
                                        <option value="Delhi Public School, Dwarka">Delhi Public School, Dwarka</option>
                                        <option value="Delhi Public School, Faridabad">Delhi Public School, Faridabad</option>
                                        <option value="Delhi Technological University">Delhi Technological University</option>
                                        <option value="Dell International Services">Dell International Services</option>
                                        <option value="Deogiri Institute of Engineering and Management Studies, Aurangabad">Deogiri Institute of Engineering and Management Studies, Aurangabad</option>
                                        <option value="Dept Of Civil Engineering, BUET">Dept Of Civil Engineering, BUET</option>
                                        <option value="Dhaka City College">Dhaka City College</option>
                                        <option value="Dhaka Residential Model College">Dhaka Residential Model College</option>
                                        <option value="Dhaka University of Engineering and Technology">Dhaka University of Engineering and Technology</option>
                                        <option value="Dhaneswar Rath Institute of Engineering and Management Studies, Cuttack">Dhaneswar Rath Institute of Engineering and Management Studies, Cuttack</option>
                                        <option value="Dharmsinh Desai University, Nadiad">Dharmsinh Desai University, Nadiad</option>
                                        <option value="Dhirubhai Ambani Institute of Information and Communication Technology">Dhirubhai Ambani Institute of Information and Communication Technology</option>
                                        <option value="Dhote Bandhu Science College, Gondia">Dhote Bandhu Science College, Gondia</option>
                                        <option value="DIT University">DIT University</option>
                                        <option value="Dnepropetrovsk, DOLIFMP">Dnepropetrovsk, DOLIFMP</option>
                                        <option value="Donetsk NU">Donetsk NU</option>
                                        <option value="Donghua University">Donghua University</option>
                                        <option value="Double Ten High School">Double Ten High School</option>
                                        <option value="Duta Wacana CU">Duta Wacana CU</option>
                                        <option value="Duy Tan University">Duy Tan University</option>
                                        <option value="Dwarka International School, Dwarka">Dwarka International School, Dwarka</option>
                                        <option value="Dwarkadas J. Sanghvi College of Engineering">Dwarkadas J. Sanghvi College of Engineering</option>
                                        <option value="Dwarkadas Jivanlal Sanghvi College of Engineering, Mumbai">Dwarkadas Jivanlal Sanghvi College of Engineering, Mumbai</option>
                                        <option value="East China Jiaotong University">East China Jiaotong University</option>
                                        <option value="East China University of Science and Technology">East China University of Science and Technology</option>
                                        <option value="East West University">East West University</option>
                                        <option value="Eastern University of Bangladesh">Eastern University of Bangladesh</option>
                                        <option value="Echelon Institute of Technology, Faridabad">Echelon Institute of Technology, Faridabad</option>
                                        <option value="Ecole Nationale Supérieur d'Arts et Métiers">Ecole Nationale Supérieur d'Arts et Métiers</option>
                                        <option value="Eindhoven University of Technology">Eindhoven University of Technology</option>
                                        <option value="Ekaterinburg, SESC UFU">Ekaterinburg, SESC UFU</option>
                                        <option value="Escuela Superior de Cómputo">Escuela Superior de Cómputo</option>
                                        <option value="ETH Zurich">ETH Zurich</option>
                                        <option value="FACENS - Faculdade de Engenharia de Sorocaba">FACENS - Faculdade de Engenharia de Sorocaba</option>
                                        <option value="Faculty of Science of the University of Lisbon">Faculty of Science of the University of Lisbon</option>
                                        <option value="Far Eastern FU">Far Eastern FU</option>
                                        <option value="Faridpur Engineering College, Bangladesh">Faridpur Engineering College, Bangladesh</option>
                                        <option value="Father Conceicao Rodrigues Institute of Technology, Vashi">Father Conceicao Rodrigues Institute of Technology, Vashi</option>
                                        <option value="Fatih Koleji Bilgisayar Olimpiyat Takımı">Fatih Koleji Bilgisayar Olimpiyat Takımı</option>
                                        <option value="Federal University of Bahia">Federal University of Bahia</option>
                                        <option value="Federal University of Campina Grande">Federal University of Campina Grande</option>
                                        <option value="Federal University of Minas Gerais (UFMG)">Federal University of Minas Gerais (UFMG)</option>
                                        <option value="Federal University of São Carlos">Federal University of São Carlos</option>
                                        <option value="Federal University of Uberlândia">Federal University of Uberlândia</option>
                                        <option value="FEE-Faculty of Electronic Engineering">FEE-Faculty of Electronic Engineering</option>
                                        <option value="Ferdowsi University of Mashhad">Ferdowsi University of Mashhad</option>
                                        <option value="FMI, Universitatea Bucuresti">FMI, Universitatea Bucuresti</option>
                                        <option value="Foreign Language Specialised School - CNN">Foreign Language Specialised School - CNN</option>
                                        <option value="FPT University">FPT University</option>
                                        <option value="Fr. Conceicao Rodrigues College of Engineering, Bandra">Fr. Conceicao Rodrigues College of Engineering, Bandra</option>
                                        <option value="France-IOI">France-IOI</option>
                                        <option value="Free University of Tbilisi">Free University of Tbilisi</option>
                                        <option value="Fudan University">Fudan University</option>
                                        <option value="Fujian Changle No.1 Middle School">Fujian Changle No.1 Middle School</option>
                                        <option value="Fundación Universidad Del Norte">Fundación Universidad Del Norte</option>
                                        <option value="Future Institute of Engineering and Management, Kolkata">Future Institute of Engineering and Management, Kolkata</option>
                                        <option value="Fuzhou No.3 High School">Fuzhou No.3 High School</option>
                                        <option value="FuZhou university">FuZhou university</option>
                                        <option value="G. Narayanamma Institute of Technology and Science, Hyderabad">G. Narayanamma Institute of Technology and Science, Hyderabad</option>
                                        <option value="G.B. Pant Engineering College, Pauri">G.B. Pant Engineering College, Pauri</option>
                                        <option value="Gadjah Mada University">Gadjah Mada University</option>
                                        <option value="Galgotias College of Engineering and Technology">Galgotias College of Engineering and Technology</option>
                                        <option value="Galgotias University">Galgotias University</option>
                                        <option value="Gautam Buddha University">Gautam Buddha University</option>
                                        <option value="Gautam Buddha University, Greater Noida">Gautam Buddha University, Greater Noida</option>
                                        <option value="GD Goenka University, Gurgaon">GD Goenka University, Gurgaon</option>
                                        <option value="GD Goenka World Institute">GD Goenka World Institute</option>
                                        <option value="Georgia Institute of Technology">Georgia Institute of Technology</option>
                                        <option value="Georgia Tech">Georgia Tech</option>
                                        <option value="German University in Cairo">German University in Cairo</option>
                                        <option value="GL Bajaj Institute of Technology and Management, Noida">GL Bajaj Institute of Technology and Management, Noida</option>
                                        <option value="GLA University, Mathura">GLA University, Mathura</option>
                                        <option value="Global College of Technology, Jaipur">Global College of Technology, Jaipur</option>
                                        <option value="Gokaraju Rangaraju Institute of Engineering and Technology, Hyderabad">Gokaraju Rangaraju Institute of Engineering and Technology, Hyderabad</option>
                                        <option value="Goldman Sachs">Goldman Sachs</option>
                                        <option value="Government College Of Engineering, Amravati">Government College Of Engineering, Amravati</option>
                                        <option value="Government College of Engineering, Kannur">Government College of Engineering, Kannur</option>
                                        <option value="Government College of Engineering, Karad">Government College of Engineering, Karad</option>
                                        <option value="Government Engineering College, Ajmer">Government Engineering College, Ajmer</option>
                                        <option value="Government Engineering College, Barton Hill">Government Engineering College, Barton Hill</option>
                                        <option value="Government Engineering College, Thrissur">Government Engineering College, Thrissur</option>
                                        <option value="Govind Ballabh Pant Engineering College, New Delhi">Govind Ballabh Pant Engineering College, New Delhi</option>
                                        <option value="Graphic Era University">Graphic Era University</option>
                                        <option value="Green University of Bangladesh">Green University of Bangladesh</option>
                                        <option value="Guangdong University of Foreign Studies">Guangdong University of Foreign Studies</option>
                                        <option value="Guangdong University of Technology">Guangdong University of Technology</option>
                                        <option value="Guru Gobind Singh Indraprastha University">Guru Gobind Singh Indraprastha University</option>
                                        <option value="Guru Nanak Dev University, Amritsar">Guru Nanak Dev University, Amritsar</option>
                                        <option value="Guru Nanak Institute of Technology, Kolkata">Guru Nanak Institute of Technology, Kolkata</option>
                                        <option value="Guru Tegh Bahadur Institute of Technology, New Delhi">Guru Tegh Bahadur Institute of Technology, New Delhi</option>
                                        <option value="Gurukul Kangri Vishwavidyalaya, Haridwar, India">Gurukul Kangri Vishwavidyalaya, Haridwar, India</option>
                                        <option value="Gyan Ganga Institute of Technology and Sciences">Gyan Ganga Institute of Technology and Sciences</option>
                                        <option value="Gyeonggi Science High School">Gyeonggi Science High School</option>
                                        <option value="Gymnasium Svetozar Marković Niš">Gymnasium Svetozar Marković Niš</option>
                                        <option value="Gymnázium Brno, třída Kapitána Jaroše">Gymnázium Brno, třída Kapitána Jaroše</option>
                                        <option value="Gymnázium Jura Hronca">Gymnázium Jura Hronca</option>
                                        <option value="Ha Noi Open University">Ha Noi Open University</option>
                                        <option value="Hajee Mohammad Danesh Sci. and Tech. University">Hajee Mohammad Danesh Sci. and Tech. University</option>
                                        <option value="Haldia Institute Of Technology">Haldia Institute Of Technology</option>
                                        <option value="Haldia Institute of Technology, West Bengal">Haldia Institute of Technology, West Bengal</option>
                                        <option value="HangZhou Foreign Language School">HangZhou Foreign Language School</option>
                                        <option value="Hangzhou No.2 High School">Hangzhou No.2 High School</option>
                                        <option value="Hangzhou Normal University">Hangzhou Normal University</option>
                                        <option value="Hangzhou Xuejun High School">Hangzhou Xuejun High School</option>
                                        <option value="Hanoi University of Science and Technology">Hanoi University of Science and Technology</option>
                                        <option value="Hanoi-Amsterdam High School">Hanoi-Amsterdam High School</option>
                                        <option value="Hanyang University">Hanyang University</option>
                                        <option value="Harbin Engineering University">Harbin Engineering University</option>
                                        <option value="Harbin Institute of Technology">Harbin Institute of Technology</option>
                                        <option value="Harcourt Butler Technological Institute, Kanpur">Harcourt Butler Technological Institute, Kanpur</option>
                                        <option value="Hazrat Mohammad High School, Iran">Hazrat Mohammad High School, Iran</option>
                                        <option value="HCMUS, High School for The Gifted">HCMUS, High School for The Gifted</option>
                                        <option value="Hefei No1 High School , China">Hefei No1 High School , China</option>
                                        <option value="HeFei University of Technology">HeFei University of Technology</option>
                                        <option value="Heilongjiang University">Heilongjiang University</option>
                                        <option value="Helwan University, Faculty of Computer Science">Helwan University, Faculty of Computer Science</option>
                                        <option value="Hemvati Nandan Bahuguna Garhwal University">Hemvati Nandan Bahuguna Garhwal University</option>
                                        <option value="Henan Experimental High School">Henan Experimental High School</option>
                                        <option value="Heritage Institute of Technology, Kolkata">Heritage Institute of Technology, Kolkata</option>
                                        <option value="High School affiliated to Fudan University">High School affiliated to Fudan University</option>
                                        <option value="High school at Komaba, University of Tsukuba">High school at Komaba, University of Tsukuba</option>
                                        <option value="High School for Gifted students of Vinh University">High School for Gifted students of Vinh University</option>
                                        <option value="Higher School of Communication of Tunis">Higher School of Communication of Tunis</option>
                                        <option value="Higher School of Economics, Russia">Higher School of Economics, Russia</option>
                                        <option value="Higher Technological Institute 10th Of Ramadan">Higher Technological Institute 10th Of Ramadan</option>
                                        <option value="HKBK College of Engineering, Bengaluru">HKBK College of Engineering, Bengaluru</option>
                                        <option value="HKL, Dushanbe">HKL, Dushanbe</option>
                                        <option value="HL High School For Gifted Student">HL High School For Gifted Student</option>
                                        <option value="HMR Institute of Technology and Management">HMR Institute of Technology and Management</option>
                                        <option value="HNUE High School for Gifted Students">HNUE High School for Gifted Students</option>
                                        <option value="Ho Chi Minh City University of Science">Ho Chi Minh City University of Science</option>
                                        <option value="Ho Chi Minh University of Science">Ho Chi Minh University of Science</option>
                                        <option value="Hong Kong University of Science and Technology">Hong Kong University of Science and Technology</option>
                                        <option value="Hooghly Engineering &amp; Technology College, West Bengal">Hooghly Engineering &amp; Technology College, West Bengal</option>
                                        <option value="Huazhong University of Science and Technology">Huazhong University of Science and Technology</option>
                                        <option value="Hunan university of arts and science">Hunan university of arts and science</option>
                                        <option value="Hunan University of Science and Technology">Hunan University of Science and Technology</option>
                                        <option value="Huojian CorpTmp">Huojian CorpTmp</option>
                                        <option value="HY Specialized High School">HY Specialized High School</option>
                                        <option value="I LO Legnica">I LO Legnica</option>
                                        <option value="Imperial College London">Imperial College London</option>
                                        <option value="IMS Engineering College, Ghaziabad, Delhi NCR">IMS Engineering College, Ghaziabad, Delhi NCR</option>
                                        <option value="Independent University, Bangladesh">Independent University, Bangladesh</option>
                                        <option value="Indian Institute of Engineering Science and Technology, Shibpur">Indian Institute of Engineering Science and Technology, Shibpur</option>
                                        <option value="Indian Institute of Information Technology Bhopal">Indian Institute of Information Technology Bhopal</option>
                                        <option value="Indian Institute of Information Technology Design &amp; Manufacturing Kancheepuram">Indian Institute of Information Technology Design &amp; Manufacturing Kancheepuram</option>
                                        <option value="Indian Institute of Information Technology Guwahati">Indian Institute of Information Technology Guwahati</option>
                                        <option value="Indian Institute of Information Technology Pune">Indian Institute of Information Technology Pune</option>
                                        <option value="Indian Institute of Information Technology Senapati, Manipur">Indian Institute of Information Technology Senapati, Manipur</option>
                                        <option value="Indian Institute of Information Technology Una">Indian Institute of Information Technology Una</option>
                                        <option value="Indian Institute of Information Technology Vadodara">Indian Institute of Information Technology Vadodara</option>
                                        <option value="Indian Institute of Information Technology, Allahabad">Indian Institute of Information Technology, Allahabad</option>
                                        <option value="Indian Institute of Information Technology, Bhagalpur">Indian Institute of Information Technology, Bhagalpur</option>
                                        <option value="Indian Institute of Information Technology, Design and Manufacturing, Jabalpur">Indian Institute of Information Technology, Design and Manufacturing, Jabalpur</option>
                                        <option value="Indian Institute of Information Technology, Dharwad">Indian Institute of Information Technology, Dharwad</option>
                                        <option value="Indian Institute of Information Technology, Kalyani">Indian Institute of Information Technology, Kalyani</option>
                                        <option value="Indian Institute of Information Technology, Kolkata">Indian Institute of Information Technology, Kolkata</option>
                                        <option value="Indian Institute of Information Technology, Kota">Indian Institute of Information Technology, Kota</option>
                                        <option value="Indian Institute of Information Technology, Lucknow">Indian Institute of Information Technology, Lucknow</option>
                                        <option value="Indian Institute of Information Technology, Nagpur">Indian Institute of Information Technology, Nagpur</option>
                                        <option value="Indian Institute Of Information Technology, Ranchi">Indian Institute Of Information Technology, Ranchi</option>
                                        <option value="Indian Institute of Information Technology, Sonipat">Indian Institute of Information Technology, Sonipat</option>
                                        <option value="Indian Institute of Information Technology, Sri City">Indian Institute of Information Technology, Sri City</option>
                                        <option value="Indian Institute of Information Technology, Surat">Indian Institute of Information Technology, Surat</option>
                                        <option value="Indian Institute of Science Education and Research, Mohali">Indian Institute of Science Education and Research, Mohali</option>
                                        <option value="Indian Institute of Science, Bangalore">Indian Institute of Science, Bangalore</option>
                                        <option value="Indian Institute of Space Science and Technology, Thiruvananthapuram">Indian Institute of Space Science and Technology, Thiruvananthapuram</option>
                                        <option value="Indian Institute of Technology Bhilai">Indian Institute of Technology Bhilai</option>
                                        <option value="Indian Institute of Technology Bhubaneswar">Indian Institute of Technology Bhubaneswar</option>
                                        <option value="Indian Institute of Technology Bombay">Indian Institute of Technology Bombay</option>
                                        <option value="Indian Institute of Technology Delhi">Indian Institute of Technology Delhi</option>
                                        <option value="Indian Institute Of Technology Dharwad">Indian Institute Of Technology Dharwad</option>
                                        <option value="Indian Institute of Technology Gandhinagar">Indian Institute of Technology Gandhinagar</option>
                                        <option value="Indian Institute of Technology Guwahati">Indian Institute of Technology Guwahati</option>
                                        <option value="Indian Institute of Technology Hyderabad">Indian Institute of Technology Hyderabad</option>
                                        <option value="Indian Institute of Technology Indore">Indian Institute of Technology Indore</option>
                                        <option value="Indian Institute of Technology Jodhpur">Indian Institute of Technology Jodhpur</option>
                                        <option value="Indian Institute of Technology Kanpur">Indian Institute of Technology Kanpur</option>
                                        <option value="Indian Institute of Technology Madras">Indian Institute of Technology Madras</option>
                                        <option value="Indian Institute of Technology Mandi">Indian Institute of Technology Mandi</option>
                                        <option value="Indian Institute of Technology Palakkad">Indian Institute of Technology Palakkad</option>
                                        <option value="Indian Institute of Technology Patna">Indian Institute of Technology Patna</option>
                                        <option value="Indian Institute of Technology Roorkee">Indian Institute of Technology Roorkee</option>
                                        <option value="Indian Institute of Technology Ropar">Indian Institute of Technology Ropar</option>
                                        <option value="Indian Institute Of Technology Tirupati">Indian Institute Of Technology Tirupati</option>
                                        <option value="Indian Institute of Technology, Jammu">Indian Institute of Technology, Jammu</option>
                                        <option value="Indian Institute of Technology, Varanasi">Indian Institute of Technology, Varanasi</option>
                                        <option value="Indian School of Mines Dhanbad, Jharkhand">Indian School of Mines Dhanbad, Jharkhand</option>
                                        <option value="Indira Gandhi Delhi Technical University for Women">Indira Gandhi Delhi Technical University for Women</option>
                                        <option value="Indira Gandhi DTUW, Delhi">Indira Gandhi DTUW, Delhi</option>
                                        <option value="Indraprastha Institute of Information Technology, Delhi">Indraprastha Institute of Information Technology, Delhi</option>
                                        <option value="Industrial University of Ho Chi Minh city">Industrial University of Ho Chi Minh city</option>
                                        <option value="Info Edge India Ltd.">Info Edge India Ltd.</option>
                                        <option value="Inha University">Inha University</option>
                                        <option value="Innopolis University">Innopolis University</option>
                                        <option value="Institute of Engineering &amp; Management, Kolkata">Institute of Engineering &amp; Management, Kolkata</option>
                                        <option value="Institute of Engineering and Technology, Devi Ahilya Vishwavidyalaya">Institute of Engineering and Technology, Devi Ahilya Vishwavidyalaya</option>
                                        <option value="Institute of Engineering and Technology, Lucknow">Institute of Engineering and Technology, Lucknow</option>
                                        <option value="Institute of Informatics and Communication, University of Delhi">Institute of Informatics and Communication, University of Delhi</option>
                                        <option value="Institute of Science and Technology">Institute of Science and Technology</option>
                                        <option value="Institute of Science Trade &amp; Technology, Bangladesh">Institute of Science Trade &amp; Technology, Bangladesh</option>
                                        <option value="Institute of Technical Education &amp; Research, Bhubaneswar">Institute of Technical Education &amp; Research, Bhubaneswar</option>
                                        <option value="Institute of Technology, Nirma University">Institute of Technology, Nirma University</option>
                                        <option value="Instituto Politecnico Nacional">Instituto Politecnico Nacional</option>
                                        <option value="Instituto Técnico Salesiano">Instituto Técnico Salesiano</option>
                                        <option value="Instituto Tecnológico de Aeronáutica">Instituto Tecnológico de Aeronáutica</option>
                                        <option value="Instituto Tecnológico de Lázaro Cárdenas">Instituto Tecnológico de Lázaro Cárdenas</option>
                                        <option value="Instituto Tecnologico de Santo Domingo">Instituto Tecnologico de Santo Domingo</option>
                                        <option value="Instituto Tecnologico Superior del Sur de Guanajuato, Mexico">Instituto Tecnologico Superior del Sur de Guanajuato, Mexico</option>
                                        <option value="Integral University">Integral University</option>
                                        <option value="International High School of Sarajevo">International High School of Sarajevo</option>
                                        <option value="International Institute of Information Technology, Bangalore">International Institute of Information Technology, Bangalore</option>
                                        <option value="International Institute of Information Technology, Bhubaneswar">International Institute of Information Technology, Bhubaneswar</option>
                                        <option value="International Institute of Information Technology, Hyderabad">International Institute of Information Technology, Hyderabad</option>
                                        <option value="International Institute of Professional Studies, Indore">International Institute of Professional Studies, Indore</option>
                                        <option value="International Islamic University, Chittagong">International Islamic University, Chittagong</option>
                                        <option value="IPVCE Luis Urquiza Jorge">IPVCE Luis Urquiza Jorge</option>
                                        <option value="IPVCE-Antonio Maceo">IPVCE-Antonio Maceo</option>
                                        <option value="Irkutsk ISRU">Irkutsk ISRU</option>
                                        <option value="Isfahan University of Technology">Isfahan University of Technology</option>
                                        <option value="Islamic University of Technology (IUT)">Islamic University of Technology (IUT)</option>
                                        <option value="Islamic University,Bangladesh">Islamic University,Bangladesh</option>
                                        <option value="Issyk Kazakh-Turkish High School">Issyk Kazakh-Turkish High School</option>
                                        <option value="IST Austria">IST Austria</option>
                                        <option value="Istanbul Technical University">Istanbul Technical University</option>
                                        <option value="ITESM Campus Monterrey">ITESM Campus Monterrey</option>
                                        <option value="ITESM Queretaro">ITESM Queretaro</option>
                                        <option value="ITM Universe, Vadodara">ITM Universe, Vadodara</option>
                                        <option value="ITM University, Gwalior">ITM University, Gwalior</option>
                                        <option value="ITMO University">ITMO University</option>
                                        <option value="IUBAT, Uttara, Dhaka">IUBAT, Uttara, Dhaka</option>
                                        <option value="J.K Institute of Applied Physics and Technology, Allahabad">J.K Institute of Applied Physics and Technology, Allahabad</option>
                                        <option value="Jabalpur Engineering College">Jabalpur Engineering College</option>
                                        <option value="Jadavpur University">Jadavpur University</option>
                                        <option value="Jagannath University, Dhaka, Bangladesh">Jagannath University, Dhaka, Bangladesh</option>
                                        <option value="Jagiellonian University">Jagiellonian University</option>
                                        <option value="Jahangirnagar University">Jahangirnagar University</option>
                                        <option value="Jaipur Engineering College And Research Centre">Jaipur Engineering College And Research Centre</option>
                                        <option value="Jalpaiguri Government Engineering College, West Bengal">Jalpaiguri Government Engineering College, West Bengal</option>
                                        <option value="Jamia Millia Islamia">Jamia Millia Islamia</option>
                                        <option value="Japan NEET University">Japan NEET University</option>
                                        <option value="Jatiya Kabi Kazi Nazrul Islam University, Bangladesh">Jatiya Kabi Kazi Nazrul Islam University, Bangladesh</option>
                                        <option value="Jawaharlal Nehru Technological University, Kakinada">Jawaharlal Nehru Technological University, Kakinada</option>
                                        <option value="Jawaharlal Nehru Technological University, Vizianagaram">Jawaharlal Nehru Technological University, Vizianagaram</option>
                                        <option value="Jaypee Institute of Information Technology">Jaypee Institute of Information Technology</option>
                                        <option value="Jaypee University Anoopshahr">Jaypee University Anoopshahr</option>
                                        <option value="Jaypee University of Engineering and Technology, Guna">Jaypee University of Engineering and Technology, Guna</option>
                                        <option value="Jaypee University of Information Technology">Jaypee University of Information Technology</option>
                                        <option value="Jessore University of Science and Technology, Bangladesh">Jessore University of Science and Technology, Bangladesh</option>
                                        <option value="Jessore University Science and Technology">Jessore University Science and Technology</option>
                                        <option value="Jiangxi University of Science and Technology">Jiangxi University of Science and Technology</option>
                                        <option value="Jilin University">Jilin University</option>
                                        <option value="Jodhpur Institute of Engineering &amp; Technology">Jodhpur Institute of Engineering &amp; Technology</option>
                                        <option value="Johns Hopkins University">Johns Hopkins University</option>
                                        <option value="Jose Faustino Sanchez Carrion National University">Jose Faustino Sanchez Carrion National University</option>
                                        <option value="JRE Group of Institutions, Greater Noida">JRE Group of Institutions, Greater Noida</option>
                                        <option value="JSS Academy of Technical Education, Noida">JSS Academy of Technical Education, Noida</option>
                                        <option value="JSS Academy of Technical Eduction, Noida">JSS Academy of Technical Eduction, Noida</option>
                                        <option value="JSS Science and Technology University, Karnataka">JSS Science and Technology University, Karnataka</option>
                                        <option value="K L University">K L University</option>
                                        <option value="K. J. Somaiya College of Engineering Vidyanagar, Vidyavihar, Mumbai">K. J. Somaiya College of Engineering Vidyanagar, Vidyavihar, Mumbai</option>
                                        <option value="K. J. Somaiya College of Engineering, Mumbai">K. J. Somaiya College of Engineering, Mumbai</option>
                                        <option value="Kaisei High School">Kaisei High School</option>
                                        <option value="Kalinga Institute of Industrial Technology">Kalinga Institute of Industrial Technology</option>
                                        <option value="Kamla Nehru Institute of Technology, Sultanpur, India">Kamla Nehru Institute of Technology, Sultanpur, India</option>
                                        <option value="Kaohsiung Senior High School">Kaohsiung Senior High School</option>
                                        <option value="Karlsruhe Institute of Technology">Karlsruhe Institute of Technology</option>
                                        <option value="Karp-Chant No.1 High School">Karp-Chant No.1 High School</option>
                                        <option value="Karpagam College of Engineering, Coimbatore">Karpagam College of Engineering, Coimbatore</option>
                                        <option value="Karunya University, Coimbatore">Karunya University, Coimbatore</option>
                                        <option value="Kasetsart University">Kasetsart University</option>
                                        <option value="Kashi Institute Of Technology, Varanasi">Kashi Institute Of Technology, Varanasi</option>
                                        <option value="Kaunas TU">Kaunas TU</option>
                                        <option value="Keio University">Keio University</option>
                                        <option value="Khakas SU">Khakas SU</option>
                                        <option value="Khanty-Mansiysk, UPML">Khanty-Mansiysk, UPML</option>
                                        <option value="Khulna University">Khulna University</option>
                                        <option value="Khulna University of Engineering and Technology">Khulna University of Engineering and Technology</option>
                                        <option value="Khust Gymnasium">Khust Gymnasium</option>
                                        <option value="Kids Tutorial Ramna, Dhaka">Kids Tutorial Ramna, Dhaka</option>
                                        <option value="Kiev, UPML">Kiev, UPML</option>
                                        <option value="Kim Il Sung University">Kim Il Sung University</option>
                                        <option value="KLE Technological University">KLE Technological University</option>
                                        <option value="KLS Gogte Institute of Technology, Belgaum">KLS Gogte Institute of Technology, Belgaum</option>
                                        <option value="Kobe-University">Kobe-University</option>
                                        <option value="Korea University">Korea University</option>
                                        <option value="Kremenchug, POLIT">Kremenchug, POLIT</option>
                                        <option value="Krishna Institute Of Engineering And Technology">Krishna Institute Of Engineering And Technology</option>
                                        <option value="Krishna Institute of Engineering and Technology, Ghaziabad">Krishna Institute of Engineering and Technology, Ghaziabad</option>
                                        <option value="Kyoto University">Kyoto University</option>
                                        <option value="La Martiniere for Boys">La Martiniere for Boys</option>
                                        <option value="Lal Bahadur Shastri Institute of Management, Delhi">Lal Bahadur Shastri Institute of Management, Delhi</option>
                                        <option value="Lalbhai Dalpatbhai College of Engineering, Ahmedabad">Lalbhai Dalpatbhai College of Engineering, Ahmedabad</option>
                                        <option value="Lancaster University">Lancaster University</option>
                                        <option value="LangPrism">LangPrism</option>
                                        <option value="Lausanne, EPFL">Lausanne, EPFL</option>
                                        <option value="LDRP Institute of Technology &amp; Research, Gandhinagar">LDRP Institute of Technology &amp; Research, Gandhinagar</option>
                                        <option value="Le Hong Phong High school">Le Hong Phong High school</option>
                                        <option value="Le Quy Don gifted High School">Le Quy Don gifted High School</option>
                                        <option value="Leading University, Sylhet">Leading University, Sylhet</option>
                                        <option value="Lebanese American University">Lebanese American University</option>
                                        <option value="Leshan NU">Leshan NU</option>
                                        <option value="Liceo Scientifico F. Lussana">Liceo Scientifico F. Lussana</option>
                                        <option value="Liceul AȘM">Liceul AȘM</option>
                                        <option value="Liceul Mihail Kogalniceanu Vaslui">Liceul Mihail Kogalniceanu Vaslui</option>
                                        <option value="Liceul Stefan Procopiu Vaslui">Liceul Stefan Procopiu Vaslui</option>
                                        <option value="Licey 174">Licey 174</option>
                                        <option value="Liuzhou Highschool">Liuzhou Highschool</option>
                                        <option value="LNM Institute of Information Technology">LNM Institute of Information Technology</option>
                                        <option value="Lodz University of Technology">Lodz University of Technology</option>
                                        <option value="Looksery">Looksery</option>
                                        <option value="Losers Club">Losers Club</option>
                                        <option value="Lovely Professional University">Lovely Professional University</option>
                                        <option value="Lviv Ivan Franko University">Lviv Ivan Franko University</option>
                                        <option value="Lviv Polytechnic National University">Lviv Polytechnic National University</option>
                                        <option value="M. J. P. Rohilkhand University, Bareilly">M. J. P. Rohilkhand University, Bareilly</option>
                                        <option value="M. S. Ramaiah Institute of Technology, Bengaluru">M. S. Ramaiah Institute of Technology, Bengaluru</option>
                                        <option value="M.H. Saboo Siddik College of Engineering, Mumbai">M.H. Saboo Siddik College of Engineering, Mumbai</option>
                                        <option value="Madan Mohan Malaviya University of Technology, Gorakhpur">Madan Mohan Malaviya University of Technology, Gorakhpur</option>
                                        <option value="Madhav Institute of Technology and Science, Gwalior">Madhav Institute of Technology and Science, Gwalior</option>
                                        <option value="Magnitogorsk STU">Magnitogorsk STU</option>
                                        <option value="Magtymguly State University">Magtymguly State University</option>
                                        <option value="Maharaja Agrasen Institute of Technology, New Delhi">Maharaja Agrasen Institute of Technology, New Delhi</option>
                                        <option value="Maharaja Surajmal Institute of Technology">Maharaja Surajmal Institute of Technology</option>
                                        <option value="Mahatma Gandhi Institute of Technology">Mahatma Gandhi Institute of Technology</option>
                                        <option value="Mahidolwiittayanusorn school">Mahidolwiittayanusorn school</option>
                                        <option value="Malaviya National Institute of Technology, Jaipur">Malaviya National Institute of Technology, Jaipur</option>
                                        <option value="Malek D4nce Club">Malek D4nce Club</option>
                                        <option value="MAN Insan Cendekia Serpong">MAN Insan Cendekia Serpong</option>
                                        <option value="Manav Rachna International Institute Of Research And Studies">Manav Rachna International Institute Of Research And Studies</option>
                                        <option value="Manipal Institute of Technology, Manipal">Manipal Institute of Technology, Manipal</option>
                                        <option value="Manipal University Jaipur">Manipal University Jaipur</option>
                                        <option value="MAOU LMI">MAOU LMI</option>
                                        <option value="Mar Athanasius College of Engineering, Kothamangalam">Mar Athanasius College of Engineering, Kothamangalam</option>
                                        <option value="Massachusetts Institute of Technology (MIT)">Massachusetts Institute of Technology (MIT)</option>
                                        <option value="Matematicheska Gimnaziya Akademik Kiril Popov, Bulgaria">Matematicheska Gimnaziya Akademik Kiril Popov, Bulgaria</option>
                                        <option value="Maulana Azad National Institute of Technology, Bhopal">Maulana Azad National Institute of Technology, Bhopal</option>
                                        <option value="Mawlana Bhashani Science and Technology University">Mawlana Bhashani Science and Technology University</option>
                                        <option value="Medellín, EAFIT">Medellín, EAFIT</option>
                                        <option value="Medi-Caps University">Medi-Caps University</option>
                                        <option value="Meiji University">Meiji University</option>
                                        <option value="MetaDesign Solutions">MetaDesign Solutions</option>
                                        <option value="Metropolitan University, Sylhet">Metropolitan University, Sylhet</option>
                                        <option value="MG Baba Tonka Ruse">MG Baba Tonka Ruse</option>
                                        <option value="Mianyang Nanshan High School">Mianyang Nanshan High School</option>
                                        <option value="Microsoft">Microsoft</option>
                                        <option value="Military Institute of Science and Technology">Military Institute of Science and Technology</option>
                                        <option value="Minsk, Lyceum BSU">Minsk, Lyceum BSU</option>
                                        <option value="MIT Academy of Engineering, Pune">MIT Academy of Engineering, Pune</option>
                                        <option value="MIT World Peace University">MIT World Peace University</option>
                                        <option value="Mita Senior High School">Mita Senior High School</option>
                                        <option value="MLR Institute of Technology, Hyderabad">MLR Institute of Technology, Hyderabad</option>
                                        <option value="Modern Academy For Engineering and technolngy">Modern Academy For Engineering and technolngy</option>
                                        <option value="Mofid High School">Mofid High School</option>
                                        <option value="Monash University">Monash University</option>
                                        <option value="Moscow Chemical Lyceum">Moscow Chemical Lyceum</option>
                                        <option value="Moscow Institute of Physic and Technology">Moscow Institute of Physic and Technology</option>
                                        <option value="Moscow State University">Moscow State University</option>
                                        <option value="Motilal Nehru National Institute of Technology Allahabad">Motilal Nehru National Institute of Technology Allahabad</option>
                                        <option value="MSU named by M.V.Lomonosov">MSU named by M.V.Lomonosov</option>
                                        <option value="MSU Tashkent">MSU Tashkent</option>
                                        <option value="Mugniram Bangur Memorial Engineering College, Jodhpur">Mugniram Bangur Memorial Engineering College, Jodhpur</option>
                                        <option value="Mymensingh Engineering College, Bangladesh">Mymensingh Engineering College, Bangladesh</option>
                                        <option value="Mytishchi Programming School">Mytishchi Programming School</option>
                                        <option value="Nagoya University">Nagoya University</option>
                                        <option value="Nanchang University">Nanchang University</option>
                                        <option value="Nanjing University">Nanjing University</option>
                                        <option value="Nankai University">Nankai University</option>
                                        <option value="Nanyang Technological University">Nanyang Technological University</option>
                                        <option value="Nara Institute of Science and Technology">Nara Institute of Science and Technology</option>
                                        <option value="Nasca Ltd">Nasca Ltd</option>
                                        <option value="National Central University">National Central University</option>
                                        <option value="National Chiao Tung University">National Chiao Tung University</option>
                                        <option value="National Chung Cheng University">National Chung Cheng University</option>
                                        <option value="National College of Computer Science Tudor Vianu">National College of Computer Science Tudor Vianu</option>
                                        <option value="National Institute of Engineering, Mysore">National Institute of Engineering, Mysore</option>
                                        <option value="National Institute of Science and Technology, Berhampur">National Institute of Science and Technology, Berhampur</option>
                                        <option value="National Institute of Technology Agartala">National Institute of Technology Agartala</option>
                                        <option value="National Institute of Technology Goa">National Institute of Technology Goa</option>
                                        <option value="National Institute of Technology Karnataka">National Institute of Technology Karnataka</option>
                                        <option value="National Institute of Technology Mizoram">National Institute of Technology Mizoram</option>
                                        <option value="National Institute of Technology Patna">National Institute of Technology Patna</option>
                                        <option value="National Institute of Technology Raipur">National Institute of Technology Raipur</option>
                                        <option value="National Institute of Technology Srinagar">National Institute of Technology Srinagar</option>
                                        <option value="National Institute of Technology Tiruchirappalli">National Institute of Technology Tiruchirappalli</option>
                                        <option value="National Institute of Technology Warangal">National Institute of Technology Warangal</option>
                                        <option value="National Institute of Technology, Calicut">National Institute of Technology, Calicut</option>
                                        <option value="National Institute of Technology, Durgapur">National Institute of Technology, Durgapur</option>
                                        <option value="National Institute of Technology, Hamirpur">National Institute of Technology, Hamirpur</option>
                                        <option value="National Institute of Technology, Jalandhar">National Institute of Technology, Jalandhar</option>
                                        <option value="National Institute of Technology, Jamshedpur">National Institute of Technology, Jamshedpur</option>
                                        <option value="National Institute of Technology, Kurukshetra">National Institute of Technology, Kurukshetra</option>
                                        <option value="National Institute of Technology, Nagaland">National Institute of Technology, Nagaland</option>
                                        <option value="National Institute of Technology, Puducherry">National Institute of Technology, Puducherry</option>
                                        <option value="National Institute of Technology, Rourkela">National Institute of Technology, Rourkela</option>
                                        <option value="National Institute of Technology, Silchar">National Institute of Technology, Silchar</option>
                                        <option value="National Institute of Technology, Uttarakhand">National Institute of Technology, Uttarakhand</option>
                                        <option value="National Taipei University">National Taipei University</option>
                                        <option value="National Taiwan University">National Taiwan University</option>
                                        <option value="National Tsing Hua University">National Tsing Hua University</option>
                                        <option value="National University of Colombia">National University of Colombia</option>
                                        <option value="National University of Defense Technology">National University of Defense Technology</option>
                                        <option value="National university of Mongolia">National university of Mongolia</option>
                                        <option value="National University of Singapore">National University of Singapore</option>
                                        <option value="National University, Bangladesh">National University, Bangladesh</option>
                                        <option value="Nazarbayev University">Nazarbayev University</option>
                                        <option value="Netaji Subhas Institute of Technology, New Delhi">Netaji Subhas Institute of Technology, New Delhi</option>
                                        <option value="Netaji Subhash Engineering College, Kolkata">Netaji Subhash Engineering College, Kolkata</option>
                                        <option value="New Bulgarian University">New Bulgarian University</option>
                                        <option value="New Digambar Public School Indore">New Digambar Public School Indore</option>
                                        <option value="New Horizon College of Engineering, Bangalore">New Horizon College of Engineering, Bangalore</option>
                                        <option value="New York University">New York University</option>
                                        <option value="New Zealand Olympiad in Informatics">New Zealand Olympiad in Informatics</option>
                                        <option value="Newcastle University">Newcastle University</option>
                                        <option value="Newspaper">Newspaper</option>
                                        <option value="Niigata University">Niigata University</option>
                                        <option value="Nikan High School">Nikan High School</option>
                                        <option value="Ningbo University">Ningbo University</option>
                                        <option value="Nizhnekamsk ICT">Nizhnekamsk ICT</option>
                                        <option value="Nizhny Novgorod SU">Nizhny Novgorod SU</option>
                                        <option value="Noakhali Science and Technology University">Noakhali Science and Technology University</option>
                                        <option value="Noida Institute of Engineering and Technology">Noida Institute of Engineering and Technology</option>
                                        <option value="North East University Sylhet, Bangladesh">North East University Sylhet, Bangladesh</option>
                                        <option value="North South University">North South University</option>
                                        <option value="North Western University, Khulna">North Western University, Khulna</option>
                                        <option value="North-Caucasus FU">North-Caucasus FU</option>
                                        <option value="North-Eastern Federal University">North-Eastern Federal University</option>
                                        <option value="Northeast Forestry University">Northeast Forestry University</option>
                                        <option value="Northeast Normal University">Northeast Normal University</option>
                                        <option value="Northern India Engineering College, New Delhi">Northern India Engineering College, New Delhi</option>
                                        <option value="Norwegian University of Science and Technology">Norwegian University of Science and Technology</option>
                                        <option value="Notre Dame College">Notre Dame College</option>
                                        <option value="Novosibirsk SU">Novosibirsk SU</option>
                                        <option value="Novosibirsk, Gymnasium №1">Novosibirsk, Gymnasium №1</option>
                                        <option value="NPU Middle School">NPU Middle School</option>
                                        <option value="Ocean University of China">Ocean University of China</option>
                                        <option value="Odessa National Polytechnic University">Odessa National Polytechnic University</option>
                                        <option value="Ohio State University">Ohio State University</option>
                                        <option value="Okinawa National College of Technology">Okinawa National College of Technology</option>
                                        <option value="Orenburg State University">Orenburg State University</option>
                                        <option value="Osaka University">Osaka University</option>
                                        <option value="Osmania University, Hyderabad">Osmania University, Hyderabad</option>
                                        <option value="Pabna University of Science and Technology">Pabna University of Science and Technology</option>
                                        <option value="Pacific Fish University">Pacific Fish University</option>
                                        <option value="Padre Conceicao College of Engineering, Goa">Padre Conceicao College of Engineering, Goa</option>
                                        <option value="Pandit Deendayal Petroleum University">Pandit Deendayal Petroleum University</option>
                                        <option value="Panipat Institute of Engineering &amp; Technology, Haryana">Panipat Institute of Engineering &amp; Technology, Haryana</option>
                                        <option value="Pasargad University">Pasargad University</option>
                                        <option value="Patuakhali Science and Technology University">Patuakhali Science and Technology University</option>
                                        <option value="Pavlodar, school-lyceum 8">Pavlodar, school-lyceum 8</option>
                                        <option value="Payame Noor University of Mashhad">Payame Noor University of Mashhad</option>
                                        <option value="PBBS Bandung">PBBS Bandung</option>
                                        <option value="PCOI, Hong Kong">PCOI, Hong Kong</option>
                                        <option value="PEC University of Technology">PEC University of Technology</option>
                                        <option value="Peking University">Peking University</option>
                                        <option value="PES College of Engineering, Mandya">PES College of Engineering, Mandya</option>
                                        <option value="PES Institute of Technology">PES Institute of Technology</option>
                                        <option value="PES University, Bangalore">PES University, Bangalore</option>
                                        <option value="Phillips Exeter Academy">Phillips Exeter Academy</option>
                                        <option value="Phisical and Mathymayical lyceum">Phisical and Mathymayical lyceum</option>
                                        <option value="Phystech-lyceum">Phystech-lyceum</option>
                                        <option value="Pillai Institute of Information Technology">Pillai Institute of Information Technology</option>
                                        <option value="Pillai Institute of Information Technology, Engineering, Media Studies and Research, Panvel">Pillai Institute of Information Technology, Engineering, Media Studies and Research, Panvel</option>
                                        <option value="Pimpri Chinchwad College of Engineering, Pune">Pimpri Chinchwad College of Engineering, Pune</option>
                                        <option value="Pioneer School of Ariana Tunisia">Pioneer School of Ariana Tunisia</option>
                                        <option value="PNT YURI KONDRATYUK UNIVERSITY">PNT YURI KONDRATYUK UNIVERSITY</option>
                                        <option value="Pontificia Universidad Católica del Perú">Pontificia Universidad Católica del Perú</option>
                                        <option value="Pontificia Universidad Católica Madre y Maestra">Pontificia Universidad Católica Madre y Maestra</option>
                                        <option value="Poornima College Of Engineering">Poornima College Of Engineering</option>
                                        <option value="Poornima College of Engineering, Jaipur">Poornima College of Engineering, Jaipur</option>
                                        <option value="Poornima Institute of Engineering and Technology, Sitapura">Poornima Institute of Engineering and Technology, Sitapura</option>
                                        <option value="Port City International University, Bangladesh">Port City International University, Bangladesh</option>
                                        <option value="Pragmatic Academy, Rangia">Pragmatic Academy, Rangia</option>
                                        <option value="Pranveer Singh Institute of Technology, Kanpur">Pranveer Singh Institute of Technology, Kanpur</option>
                                        <option value="Prasad V Potluri Siddhartha Institute of Technology">Prasad V Potluri Siddhartha Institute of Technology</option>
                                        <option value="Presidency University, Bangalore">Presidency University, Bangalore</option>
                                        <option value="Presidency University, Kolkata">Presidency University, Kolkata</option>
                                        <option value="Princeton University">Princeton University</option>
                                        <option value="Prva kragujevacka gimnazija">Prva kragujevacka gimnazija</option>
                                        <option value="PSG College of Technology, Coimbatore">PSG College of Technology, Coimbatore</option>
                                        <option value="Pune Institute of Computer Technology">Pune Institute of Computer Technology</option>
                                        <option value="Pune Institute of Computer Technology">Pune Institute of Computer Technology</option>
                                        <option value="Punjab Engineering College, Chandigarh">Punjab Engineering College, Chandigarh</option>
                                        <option value="Purdue University">Purdue University</option>
                                        <option value="Qingdao No.2 Middle School">Qingdao No.2 Middle School</option>
                                        <option value="Quang Trung High School">Quang Trung High School</option>
                                        <option value="Quang Trung Specialized and Gifted High School">Quang Trung Specialized and Gifted High School</option>
                                        <option value="Quanzhou No.7 High School">Quanzhou No.7 High School</option>
                                        <option value="Queen's University">Queen's University</option>
                                        <option value="Quoc Hoc High School">Quoc Hoc High School</option>
                                        <option value="Radboud University Nijmegen">Radboud University Nijmegen</option>
                                        <option value="Raghu Engineering College">Raghu Engineering College</option>
                                        <option value="Rajarambapu Institute of Technology">Rajarambapu Institute of Technology</option>
                                        <option value="Rajasthan Technical University, Kota">Rajasthan Technical University, Kota</option>
                                        <option value="Rajdhani College, University of Delhi">Rajdhani College, University of Delhi</option>
                                        <option value="Rajiv Gandhi Proudyogiki Vishwavidyalaya">Rajiv Gandhi Proudyogiki Vishwavidyalaya</option>
                                        <option value="Rajiv Gandhi University of Knowledge Technologies, Nuzvid">Rajiv Gandhi University of Knowledge Technologies, Nuzvid</option>
                                        <option value="Rajiv Gandhi University of Knowledge Technologies, RK Valley">Rajiv Gandhi University of Knowledge Technologies, RK Valley</option>
                                        <option value="Rajshahi University of Engineering and Technology">Rajshahi University of Engineering and Technology</option>
                                        <option value="Raksha Shakti University, Lavad">Raksha Shakti University, Lavad</option>
                                        <option value="Ramakrishna Mission Vidyamandira, West Bengal">Ramakrishna Mission Vidyamandira, West Bengal</option>
                                        <option value="Ramanujan College, University of Delhi">Ramanujan College, University of Delhi</option>
                                        <option value="Rashtreeya Vidyalaya College of Engineering, Bangalore">Rashtreeya Vidyalaya College of Engineering, Bangalore</option>
                                        <option value="RCC Institute of Information Technology, Kolkata">RCC Institute of Information Technology, Kolkata</option>
                                        <option value="Renmin University of China">Renmin University of China</option>
                                        <option value="Reykjavik University">Reykjavik University</option>
                                        <option value="RK University, Rajkot">RK University, Rajkot</option>
                                        <option value="RMD Engineering College, Tamil Nadu">RMD Engineering College, Tamil Nadu</option>
                                        <option value="RMK College of Engineering &amp; Technology, Tiruvallur">RMK College of Engineering &amp; Technology, Tiruvallur</option>
                                        <option value="RMK Engineering College, Tamil Nadu">RMK Engineering College, Tamil Nadu</option>
                                        <option value="Royal Institute of Technology">Royal Institute of Technology</option>
                                        <option value="Russian-Armenian University">Russian-Armenian University</option>
                                        <option value="Rustamji Institute of Technology">Rustamji Institute of Technology</option>
                                        <option value="Rutgers School of Engineering">Rutgers School of Engineering</option>
                                        <option value="RV college of engineering">RV college of engineering</option>
                                        <option value="Ryan International School, Mumbai">Ryan International School, Mumbai</option>
                                        <option value="Rybinsk, Lyceum 2">Rybinsk, Lyceum 2</option>
                                        <option value="Ryukoku University">Ryukoku University</option>
                                        <option value="Sadjad University of Technology">Sadjad University of Technology</option>
                                        <option value="SAI International School">SAI International School</option>
                                        <option value="Saint Petersburg State University">Saint Petersburg State University</option>
                                        <option value="Salam IranZamin">Salam IranZamin</option>
                                        <option value="Samanyolu Bilgisayar Olimpiyat Topluluğu">Samanyolu Bilgisayar Olimpiyat Topluluğu</option>
                                        <option value="Samrat Ashok Technological Institute, Vidisha">Samrat Ashok Technological Institute, Vidisha</option>
                                        <option value="Sant Longowal Institute of Engineering and Technology">Sant Longowal Institute of Engineering and Technology</option>
                                        <option value="Saratov State University">Saratov State University</option>
                                        <option value="Sardar Patel Institute Of Technology, Mumbai">Sardar Patel Institute Of Technology, Mumbai</option>
                                        <option value="Sardar Vallabhbhai National Institute of Technology, Surat">Sardar Vallabhbhai National Institute of Technology, Surat</option>
                                        <option value="SASTRA University">SASTRA University</option>
                                        <option value="Sathyabama Institute of Science and Technology">Sathyabama Institute of Science and Technology</option>
                                        <option value="School of Engineering and Applied Science, Ahmedabad University">School of Engineering and Applied Science, Ahmedabad University</option>
                                        <option value="Sebelas Maret University, Indonesia">Sebelas Maret University, Indonesia</option>
                                        <option value="Semnan University">Semnan University</option>
                                        <option value="Seoul National University">Seoul National University</option>
                                        <option value="Sevastopol State University">Sevastopol State University</option>
                                        <option value="Shahid Babaee school, Qazvin">Shahid Babaee school, Qazvin</option>
                                        <option value="Shahid Bahonar University of Kerman">Shahid Bahonar University of Kerman</option>
                                        <option value="Shahid Beheshti University">Shahid Beheshti University</option>
                                        <option value="Shahjalal University of Science and Technology">Shahjalal University of Science and Technology</option>
                                        <option value="Shahrood University of Technology">Shahrood University of Technology</option>
                                        <option value="Shandong University">Shandong University</option>
                                        <option value="Shanghai University">Shanghai University</option>
                                        <option value="ShanghaiTech University">ShanghaiTech University</option>
                                        <option value="Shanglin middle school">Shanglin middle school</option>
                                        <option value="Shantou Jinshan High School">Shantou Jinshan High School</option>
                                        <option value="Shaoxing No.1 High School">Shaoxing No.1 High School</option>
                                        <option value="Sharda University, Greater Noida">Sharda University, Greater Noida</option>
                                        <option value="Sharif University of Technology">Sharif University of Technology</option>
                                        <option value="Sheikhbahaee University">Sheikhbahaee University</option>
                                        <option value="Shenyang University of Technology">Shenyang University of Technology</option>
                                        <option value="Shenzhen University">Shenzhen University</option>
                                        <option value="Shiraz University">Shiraz University</option>
                                        <option value="Shishi High School">Shishi High School</option>
                                        <option value="Shiv Nadar University">Shiv Nadar University</option>
                                        <option value="Shiv Nadar University, Chithera">Shiv Nadar University, Chithera</option>
                                        <option value="Shivaji College, Delhi">Shivaji College, Delhi</option>
                                        <option value="Shizuoka University">Shizuoka University</option>
                                        <option value="Shkola Shikovi">Shkola Shikovi</option>
                                        <option value="Shoubra Faculty of Engineering">Shoubra Faculty of Engineering</option>
                                        <option value="Shri Govindram Seksaria Institute of Technology and Science">Shri Govindram Seksaria Institute of Technology and Science</option>
                                        <option value="Shri Guru Gobind Singhji Institute of Engineering and Technology, Maharashtra">Shri Guru Gobind Singhji Institute of Engineering and Technology, Maharashtra</option>
                                        <option value="Shri Mata Vaishno Devi University">Shri Mata Vaishno Devi University</option>
                                        <option value="Shri Mata Vaishno Devi University (SMVDU)">Shri Mata Vaishno Devi University (SMVDU)</option>
                                        <option value="Shri Ram Murti Smarak College of Engineering and Technology, Bareilly">Shri Ram Murti Smarak College of Engineering and Technology, Bareilly</option>
                                        <option value="Shri Ramswaroop Memorial College of Engineering and Management">Shri Ramswaroop Memorial College of Engineering and Management</option>
                                        <option value="Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore">Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore</option>
                                        <option value="Shymkent KTL Shymkent, Kazakhstan">Shymkent KTL Shymkent, Kazakhstan</option>
                                        <option value="Siberian state university TI">Siberian state university TI</option>
                                        <option value="Sichuan University">Sichuan University</option>
                                        <option value="Siddaganga Institute Of Technology, Tumakuru">Siddaganga Institute Of Technology, Tumakuru</option>
                                        <option value="Siliguri Institute Of Technology">Siliguri Institute Of Technology</option>
                                        <option value="Sir M Visveswaraya Institute of Technology, Bangalore">Sir M Visveswaraya Institute of Technology, Bangalore</option>
                                        <option value="Sir M. Visvesvaraya Institute of Technology">Sir M. Visvesvaraya Institute of Technology</option>
                                        <option value="Sir Padampat Singhania University, Udaipur">Sir Padampat Singhania University, Udaipur</option>
                                        <option value="SMTL">SMTL</option>
                                        <option value="Sofia University">Sofia University</option>
                                        <option value="Sogang University">Sogang University</option>
                                        <option value="Solapur University, Maharashtra">Solapur University, Maharashtra</option>
                                        <option value="Soochow University">Soochow University</option>
                                        <option value="SOS Hermann Gmeiner School and College, Bangladesh">SOS Hermann Gmeiner School and College, Bangladesh</option>
                                        <option value="South China Algorithm University">South China Algorithm University</option>
                                        <option value="South City International School, Kolkata">South City International School, Kolkata</option>
                                        <option value="South Ural State University">South Ural State University</option>
                                        <option value="Southeast University">Southeast University</option>
                                        <option value="Southern FU (Taganrog)">Southern FU (Taganrog)</option>
                                        <option value="Southwest jiaotong university">Southwest jiaotong university</option>
                                        <option value="Southwest University">Southwest University</option>
                                        <option value="SPb Electrotechnical University">SPb Electrotechnical University</option>
                                        <option value="Sreenidhi Institute(JNTU)">Sreenidhi Institute(JNTU)</option>
                                        <option value="Sri Manakula Vinayagar Engineering College">Sri Manakula Vinayagar Engineering College</option>
                                        <option value="Sri Shakthi Institute of Engineering and Technology">Sri Shakthi Institute of Engineering and Technology</option>
                                        <option value="SRM University">SRM University</option>
                                        <option value="SSN College Of Engineering">SSN College Of Engineering</option>
                                        <option value="St. Joseph's College of Engineering, Chennai">St. Joseph's College of Engineering, Chennai</option>
                                        <option value="Stamford University Bangladesh">Stamford University Bangladesh</option>
                                        <option value="Stanford University">Stanford University</option>
                                        <option value="Stanley College of Engineering and Technology">Stanley College of Engineering and Technology</option>
                                        <option value="Starokostyantinovska Gimnasia">Starokostyantinovska Gimnasia</option>
                                        <option value="State University of Bangladesh">State University of Bangladesh</option>
                                        <option value="Stony Brook University">Stony Brook University</option>
                                        <option value="Suankularb Wittayalai School">Suankularb Wittayalai School</option>
                                        <option value="Sun Yat-Sen Memorial Middle School">Sun Yat-Sen Memorial Middle School</option>
                                        <option value="Sushila Devi Bansal College of Technology, Indore">Sushila Devi Bansal College of Technology, Indore</option>
                                        <option value="Swami Keshvanand Institute of Technology Management &amp; Gramothan">Swami Keshvanand Institute of Technology Management &amp; Gramothan</option>
                                        <option value="Swiss Olympiad in Informatics">Swiss Olympiad in Informatics</option>
                                        <option value="Sylhet Engineering College">Sylhet Engineering College</option>
                                        <option value="Sylhet International University, Bangladesh">Sylhet International University, Bangladesh</option>
                                        <option value="Sylhet Polytechnic Institute, Bangladesh">Sylhet Polytechnic Institute, Bangladesh</option>
                                        <option value="Syrian Virtual University">Syrian Virtual University</option>
                                        <option value="Taizhou University">Taizhou University</option>
                                        <option value="Tajik Turkish Hoji Kamol High School">Tajik Turkish Hoji Kamol High School</option>
                                        <option value="Taldykorgan Kazakh-Turkish High School">Taldykorgan Kazakh-Turkish High School</option>
                                        <option value="Tanta University">Tanta University</option>
                                        <option value="Taraz Kazakh - Turkish High School Taraz, Kazakhstan">Taraz Kazakh - Turkish High School Taraz, Kazakhstan</option>
                                        <option value="Tashkent U of IT">Tashkent U of IT</option>
                                        <option value="Taurida National V.I. Vernadsky University">Taurida National V.I. Vernadsky University</option>
                                        <option value="Technical University of Cluj-Napoca">Technical University of Cluj-Napoca</option>
                                        <option value="Technical University of Iasi">Technical University of Iasi</option>
                                        <option value="Techno India Salt Lake">Techno India Salt Lake</option>
                                        <option value="Techno International new town, Kolkata">Techno International new town, Kolkata</option>
                                        <option value="Telkom University">Telkom University</option>
                                        <option value="Thadomal Shahani Engineering College">Thadomal Shahani Engineering College</option>
                                        <option value="Thakur College of Engineering and Technology">Thakur College of Engineering and Technology</option>
                                        <option value="Thangal Kunju Musaliar College of Engineering, Kollam">Thangal Kunju Musaliar College of Engineering, Kollam</option>
                                        <option value="Thapar University">Thapar University</option>
                                        <option value="The Affiliated High School of Shanxi University">The Affiliated High School of Shanxi University</option>
                                        <option value="The American University in Cairo">The American University in Cairo</option>
                                        <option value="The Enot's Team">The Enot's Team</option>
                                        <option value="The F.M.S in Changsha">The F.M.S in Changsha</option>
                                        <option value="The Hashemite University">The Hashemite University</option>
                                        <option value="The Mongolian University of Science and Technology">The Mongolian University of Science and Technology</option>
                                        <option value="The Nhan - VN">The Nhan - VN</option>
                                        <option value="The Scindia School">The Scindia School</option>
                                        <option value="The University of Hong Kong">The University of Hong Kong</option>
                                        <option value="The University of Tokyo">The University of Tokyo</option>
                                        <option value="Thebes Academy">Thebes Academy</option>
                                        <option value="Tianjin Nankai High School">Tianjin Nankai High School</option>
                                        <option value="Tianjin No.1 High School">Tianjin No.1 High School</option>
                                        <option value="Tianjin Polytechnic University">Tianjin Polytechnic University</option>
                                        <option value="Tianjin University">Tianjin University</option>
                                        <option value="Timber Creek High School">Timber Creek High School</option>
                                        <option value="Tishreen University, Latakia, Syria">Tishreen University, Latakia, Syria</option>
                                        <option value="Tokyo Hot">Tokyo Hot</option>
                                        <option value="Tomsk">Tomsk</option>
                                        <option value="Tomsk SU of CSR">Tomsk SU of CSR</option>
                                        <option value="Tongji University">Tongji University</option>
                                        <option value="Tran Phu High School">Tran Phu High School</option>
                                        <option value="Triam Udom Suksa School">Triam Udom Suksa School</option>
                                        <option value="TriamUdomSuksa School">TriamUdomSuksa School</option>
                                        <option value="Tsinghua University">Tsinghua University</option>
                                        <option value="Tulskii Gu">Tulskii Gu</option>
                                        <option value="Tunisia Polytechnic School">Tunisia Polytechnic School</option>
                                        <option value="Turgut Ozal Turkmen Turkish High School">Turgut Ozal Turkmen Turkish High School</option>
                                        <option value="UFG - Universidade Feredal de Goias">UFG - Universidade Feredal de Goias</option>
                                        <option value="UNIFESO">UNIFESO</option>
                                        <option value="United College of Engineering and Research Allahabad">United College of Engineering and Research Allahabad</option>
                                        <option value="United International University">United International University</option>
                                        <option value="Universidad de las Ciencias Informáticas, Havana">Universidad de las Ciencias Informáticas, Havana</option>
                                        <option value="Universidad de los Andes, Colombia">Universidad de los Andes, Colombia</option>
                                        <option value="Universidad Panamericana Campus Bonaterra">Universidad Panamericana Campus Bonaterra</option>
                                        <option value="Universidad Tecnica de Oruro">Universidad Tecnica de Oruro</option>
                                        <option value="Universidade Federal de Itajubá">Universidade Federal de Itajubá</option>
                                        <option value="Universität des Saarlandes">Universität des Saarlandes</option>
                                        <option value="University  of Rajshahi, Bangladesh">University  of Rajshahi, Bangladesh</option>
                                        <option value='University "Marta Abreu" of Las Villas, Cuba'>University "Marta Abreu" of Las Villas, Cuba</option>
                                        <option value="University at Buffalo, SUNY">University at Buffalo, SUNY</option>
                                        <option value="University College London">University College London</option>
                                        <option value="University Institute of Engineering &amp; Technology, Panjab University">University Institute of Engineering &amp; Technology, Panjab University</option>
                                        <option value="University Institute of Engineering and Technology, Kanpur">University Institute of Engineering and Technology, Kanpur</option>
                                        <option value="University Institute of Information Technology, Shimla">University Institute of Information Technology, Shimla</option>
                                        <option value="University Institute of Technology, Burdwan University">University Institute of Technology, Burdwan University</option>
                                        <option value="University of Aizu">University of Aizu</option>
                                        <option value="University of Alexandria, Faculty of Engineering">University of Alexandria, Faculty of Engineering</option>
                                        <option value="University of Asia Pacific">University of Asia Pacific</option>
                                        <option value="University of Bergen">University of Bergen</option>
                                        <option value="University of Bologna">University of Bologna</option>
                                        <option value="University of Brasilia">University of Brasilia</option>
                                        <option value="University of Bristol">University of Bristol</option>
                                        <option value="University of Bucharest">University of Bucharest</option>
                                        <option value="University of Calgary">University of Calgary</option>
                                        <option value="University of California, Berkeley">University of California, Berkeley</option>
                                        <option value="University of California, San Diego">University of California, San Diego</option>
                                        <option value="University of Cambridge">University of Cambridge</option>
                                        <option value="University of Cape Town">University of Cape Town</option>
                                        <option value="University of Central Florida">University of Central Florida</option>
                                        <option value="University of Chicago">University of Chicago</option>
                                        <option value="University of Chinese Academy of Sciences">University of Chinese Academy of Sciences</option>
                                        <option value="University of Chittagong">University of Chittagong</option>
                                        <option value="University of Delhi, New Delhi">University of Delhi, New Delhi</option>
                                        <option value="University of Dhaka">University of Dhaka</option>
                                        <option value="University of Edinburgh">University of Edinburgh</option>
                                        <option value="University of Engineering and Management, Kolkata">University of Engineering and Management, Kolkata</option>
                                        <option value="University of Engineering and Technology">University of Engineering and Technology</option>
                                        <option value="University of Florida">University of Florida</option>
                                        <option value="University of Havana">University of Havana</option>
                                        <option value="University of Helsinki">University of Helsinki</option>
                                        <option value="University of Illinois at Urbana-Champaign">University of Illinois at Urbana-Champaign</option>
                                        <option value="University of Indonesia">University of Indonesia</option>
                                        <option value="University of Information Technology &amp; Sciences, Bangladesh">University of Information Technology &amp; Sciences, Bangladesh</option>
                                        <option value="University of Isfahan">University of Isfahan</option>
                                        <option value="University of Jinan">University of Jinan</option>
                                        <option value="University of Jordan">University of Jordan</option>
                                        <option value="University of Latvia">University of Latvia</option>
                                        <option value="University of Ljubljana">University of Ljubljana</option>
                                        <option value="University of Manchester">University of Manchester</option>
                                        <option value="University of Michigan">University of Michigan</option>
                                        <option value="University of Minnesota">University of Minnesota</option>
                                        <option value="University of Moratuwa">University of Moratuwa</option>
                                        <option value="University of Mumbai">University of Mumbai</option>
                                        <option value="University of New South Wales">University of New South Wales</option>
                                        <option value="University of Oxford">University of Oxford</option>
                                        <option value="University of Pennsylvania">University of Pennsylvania</option>
                                        <option value="University of Petroleum and Energy Studies, Dehradun">University of Petroleum and Energy Studies, Dehradun</option>
                                        <option value="University of Pune">University of Pune</option>
                                        <option value="University of São Paulo">University of São Paulo</option>
                                        <option value="University of Science and Technology of China">University of Science and Technology of China</option>
                                        <option value="University of Southampton">University of Southampton</option>
                                        <option value="University of Southern California">University of Southern California</option>
                                        <option value="University of Surabaya">University of Surabaya</option>
                                        <option value="University of Sydney">University of Sydney</option>
                                        <option value="University of Tabriz">University of Tabriz</option>
                                        <option value="University of Tartu">University of Tartu</option>
                                        <option value="University of Tehran">University of Tehran</option>
                                        <option value="University of Texas at Austin">University of Texas at Austin</option>
                                        <option value="University of the Philippines">University of the Philippines</option>
                                        <option value="University of Tokyo">University of Tokyo</option>
                                        <option value="University of Toronto">University of Toronto</option>
                                        <option value="University of Tsukuba">University of Tsukuba</option>
                                        <option value="University of Virginia">University of Virginia</option>
                                        <option value="University of Warsaw">University of Warsaw</option>
                                        <option value="University of Washington">University of Washington</option>
                                        <option value="University of Waterloo">University of Waterloo</option>
                                        <option value="University of Waterloo, Canada">University of Waterloo, Canada</option>
                                        <option value="University of Western Australia">University of Western Australia</option>
                                        <option value="University of Wisconsin-Madison">University of Wisconsin-Madison</option>
                                        <option value="University of Wrocław">University of Wrocław</option>
                                        <option value="University of Zagreb">University of Zagreb</option>
                                        <option value="University School of Information Technology">University School of Information Technology</option>
                                        <option value="University Visvesvaraya College of Engineering">University Visvesvaraya College of Engineering</option>
                                        <option value="University Visvesvaraya College of Engineering, Bangalore">University Visvesvaraya College of Engineering, Bangalore</option>
                                        <option value="Ural Federal University">Ural Federal University</option>
                                        <option value="Urmia University">Urmia University</option>
                                        <option value="Utrecht University">Utrecht University</option>
                                        <option value="Varna High School of Mathematics">Varna High School of Mathematics</option>
                                        <option value="Varvakio Piramatiko Gimnasio, Greece">Varvakio Piramatiko Gimnasio, Greece</option>
                                        <option value="Vasavi College of Engineering">Vasavi College of Engineering</option>
                                        <option value="Veer Surendra Sai University of Technology, Orissa">Veer Surendra Sai University of Technology, Orissa</option>
                                        <option value="Veermata Jijabai Technological Institute">Veermata Jijabai Technological Institute</option>
                                        <option value="Velammal Engineering College, Chennai">Velammal Engineering College, Chennai</option>
                                        <option value="Vellore Institute of Technology, Bhopal">Vellore Institute of Technology, Bhopal</option>
                                        <option value="Vellore Institute of Technology, Chennai">Vellore Institute of Technology, Chennai</option>
                                        <option value="Vellore Institute of Technology, Vellore">Vellore Institute of Technology, Vellore</option>
                                        <option value="Vellore Institute of Technology,Vellore">Vellore Institute of Technology,Vellore</option>
                                        <option value="Veltech Multi Tech Dr.Rangarajan Dr.Sakunthala Engineering College, Chennai">Veltech Multi Tech Dr.Rangarajan Dr.Sakunthala Engineering College, Chennai</option>
                                        <option value="Vidyalankar Institute of Technology">Vidyalankar Institute of Technology</option>
                                        <option value="Viet Nam National University">Viet Nam National University</option>
                                        <option value="Vilnius Gediminas Technical university">Vilnius Gediminas Technical university</option>
                                        <option value="Vilnius University">Vilnius University</option>
                                        <option value="Vinh Phuc gifted High School">Vinh Phuc gifted High School</option>
                                        <option value="Vishwakarma Government Engineering College">Vishwakarma Government Engineering College</option>
                                        <option value="Vishwakarma Government Engineering College, Chandkheda">Vishwakarma Government Engineering College, Chandkheda</option>
                                        <option value="Vishwakarma Institute of Technology, Pune">Vishwakarma Institute of Technology, Pune</option>
                                        <option value="Visvesvaraya National Institute of Technology">Visvesvaraya National Institute of Technology</option>
                                        <option value="VIT University, Bhopal">VIT University, Bhopal</option>
                                        <option value="Vivekanand Education Society's Institute Of Technology, Mumbai">Vivekanand Education Society's Institute Of Technology, Mumbai</option>
                                        <option value="VNRVJIET, Hyderabad">VNRVJIET, Hyderabad</option>
                                        <option value="VVP Engineering College, Rajkot">VVP Engineering College, Rajkot</option>
                                        <option value="Walchand College of Engineering, Sangli">Walchand College of Engineering, Sangli</option>
                                        <option value="Warsaw School of Computer Science">Warsaw School of Computer Science</option>
                                        <option value="Warszawa, XIV LO Staszica">Warszawa, XIV LO Staszica</option>
                                        <option value="Waseda University">Waseda University</option>
                                        <option value="Washington University in St. Louis">Washington University in St. Louis</option>
                                        <option value="Wenling High School">Wenling High School</option>
                                        <option value="Wenzhou Middle School">Wenzhou Middle School</option>
                                        <option value="West Bengal University of Technology">West Bengal University of Technology</option>
                                        <option value="West University of Timisoara">West University of Timisoara</option>
                                        <option value="Wroclaw University of Technologies">Wroclaw University of Technologies</option>
                                        <option value="Wuhan University">Wuhan University</option>
                                        <option value="Wuhan University of Science and Technology">Wuhan University of Science and Technology</option>
                                        <option value="Xavier University Bhubaneswar">Xavier University Bhubaneswar</option>
                                        <option value="Xiamen University">Xiamen University</option>
                                        <option value="Xiangtan University">Xiangtan University</option>
                                        <option value="Xiaoshan High School">Xiaoshan High School</option>
                                        <option value="Xidian University">Xidian University</option>
                                        <option value="Yali Middle School">Yali Middle School</option>
                                        <option value="Yamanlar Informatics Society">Yamanlar Informatics Society</option>
                                        <option value="Yarmouk Private University">Yarmouk Private University</option>
                                        <option value="Yarmouk University">Yarmouk University</option>
                                        <option value="Yazd University">Yazd University</option>
                                        <option value="Yerevan Physmath school">Yerevan Physmath school</option>
                                        <option value="Yerevan State University">Yerevan State University</option>
                                        <option value="Yerevan, Quantum college">Yerevan, Quantum college</option>
                                        <option value="Yeshwantrao Chavan College of Engineering College, Nagpur">Yeshwantrao Chavan College of Engineering College, Nagpur</option>
                                        <option value="YMCA University of Science and Technology, Faridabad">YMCA University of Science and Technology, Faridabad</option>
                                        <option value="YMCA UST, Faridabad">YMCA UST, Faridabad</option>
                                        <option value="Yonsei University">Yonsei University</option>
                                        <option value="Young Scholars Club">Young Scholars Club</option>
                                        <option value="Yuyao High School">Yuyao High School</option>
                                        <option value="Zakir Hussain College of Engineering and Technology, Aligarh">Zakir Hussain College of Engineering and Technology, Aligarh</option>
                                        <option value="Zaporizhia NTU">Zaporizhia NTU</option>
                                        <option value="Zhangping No.1 High School">Zhangping No.1 High School</option>
                                        <option value="ZhaoQing University">ZhaoQing University</option>
                                        <option value="Zhejiang University of Technology">Zhejiang University of Technology</option>
                                        <option value="Zheng Zhou University">Zheng Zhou University</option>
                                        <option value="Zhengzhou University">Zhengzhou University</option>
                                        <option value="Zhenhai High School">Zhenhai High School</option>
                                        <option value="Zhongshan(Sun Yat-sen) U">Zhongshan(Sun Yat-sen) U</option>
                                        <option value="Other">Other</option>

                                    </select>
                                </div>
                            </div>
                            <div className="form-check checkbox-div">
                                <div>
                                    <input onChange={()=>setcheckbox(!checkbox)} className="form-check-input" type="checkbox" value="" id="flexCheck" required/>
                                </div>
                                <div className="label-div">
                                    <label className="form-check-label" htmlFor="flexCheck">
                                        I agree to Codecard's Terms and Privacy Policy
                                    </label>
                                </div>
                                <div className="info-icon" onClick={()=>{setinfomodal(!infomodal)}}>
                                    <i className="fas fa-info"></i>
                                </div>
                            </div>
                            <div className="signup-btn">
                                <button type="submit" className="btn btn-warning">
                                    Sign up
                                </button>
                            </div>                            
                        </form>
                    </div>
                </div>
                </>
                }
            </div>
        </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        Auth: state.Auth,
        Loader:state.Loader
    }
}

export default connect(mapStateToProps, {
    login,
    logout,
    setUserDetails,
    profileloader,
    loader,
    dark,
    error,
    success,
    warning,
    info
})(LoginComponent);
