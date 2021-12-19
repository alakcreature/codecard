import React,{ useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { TwitterTweetEmbed } from 'react-twitter-embed'
import './Home.css';
import {dark,error,success,warning,info} from '../../actions/alertAction';
import staticimages from "../staticImagesLink";


function Home({loader, success}) {
    let [showscoremodal, setshowscoremodal] = useState(false);
    

    useEffect(()=>{
        window.scrollTo(0,0);
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
        <div className="homepage-container">
            <div className="homepage-main-content">
                <div className="home-main-content-inner">
                    <div className="home-main-content">

                        {/* Before Header Section */}
                        <div className="before_header">
                            <div className="content">
                                <h3>CodeCard</h3>
                            </div>
                            <div className="before-header-content">
                                <p>Your</p>
                                <p>Competitive Programming</p>
                                <p>Report Card.</p>
                            </div>
                        </div>

                        {/* Rating Section */}
                        <div className="rating-main">
                            <div className="rating-content">
                                <div className="rating-content-bubble">  
                                </div>
                                <div className="rating-content-bubble2">  
                                </div>
                                <div className="rating-content-inner">
                                    <p>
                                        Monitor your coding performance with our <Link to="#">
                                            codec score</Link>
                                            <i className="fas fa-info fa-xs" onClick={()=>setshowscoremodal(true)}></i>
                                    </p>
                                </div>
                            </div>
                            <div className="rating-img">
                                <img src={staticimages.Rating} alt="rating" />
                            </div>
                        </div>

                        {/* Meme1 Section */}
                        <div className="meme-main">
                            <div className="meme-content">
                                <p>Rating hi rating hogi.</p>
                                <h6>-By Raju Bhai</h6>
                            </div>
                            <div className="meme-img">
                                <img src={staticimages.Raju} alt="raju-bhai" />
                            </div>
                        </div>

                        {/* Practice Section */}
                        <div className="practice-main">
                            <div className="practice-content">
                                <div className="practice-content-bubble">  
                                </div>
                                <div className="practice-content-bubble2">  
                                </div>
                                <div className="practice-content-inner">
                                    <p>Become better version of yourself by more <Link to="#">practice</Link>.</p>
                                </div>
                            </div>
                            <div className="practice-img">
                                <img src={staticimages.Practice} alt="raju-bhai" />
                            </div>
                        </div>
                    
                        {/* Munna Meme Section */}
                        <div className="munnameme-main">
                            <div className="munnameme-content">
                                <p>Tension kyun leta hai,</p>
                                <p>Ye le practice kar.</p>
                                <h6>-By Munna Bhai</h6>
                            </div>
                            <div className="munnameme-img">
                                <img src={staticimages.Munna} alt="munna-bhai" />
                            </div>
                        </div>

                        {/* Problem Search */}
                        <div className="problemsearch-main">
                            <div className="problemsearch-content">
                                <div className="problemsearch-content-bubble">  
                                </div>
                                <div className="problemsearch-content-bubble2">  
                                </div>
                                <div className="problemsearch-content-inner">
                                    <p>Find various problems based on Tags & Difficulty</p>
                                </div>
                            </div>
                            <div className="problemsearch-img">
                                <img src={staticimages.ProblemSearch} alt="problemsearch" />
                            </div>
                        </div>

                        {/* Krishna Section */}
                        <div className="motivate">
                            <div className="motivate-content">
                                <h3>If you fail to achieve your goal,</h3>
                                <h3>change the strategy, not the goal.</h3>
                                <h6>- Lord Krishna</h6>
                            </div>
                            <div className="motivate-img">
                                <img src={staticimages.Monk1} alt="krishna" />
                            </div>
                        </div>
                        {/* Leaderboard */}
                        <div className="leaderboard-main">
                            <div className="leaderboard-content">
                                <div className="leaderboard-content-bubble">  
                                </div>
                                <div className="leaderboard-content-bubble2">  
                                </div>
                                <div className="leaderboard-content-inner">
                                    <p>Check yourself where you lie?</p>
                                </div>
                            </div>
                            <div className="leaderboard-img">
                                <img src={staticimages.LeaderboardPic} alt="raju-bhai" />
                            </div>
                        </div>

                        {/* Meme2 Section */}
                        <div className="meme2-main">
                            <div className="meme2-content">
                                <p>Agar apan 1-2 mahine cp kare,</p>
                                <p>aur contests mein participate karey,</p>
                                <p>to pakka leaderboard pe aa jayenge.</p>
                                <h6>-By Magician Adi</h6>
                            </div>
                            <div className="meme2-img">
                                <img src={staticimages.Dhamaal} alt="magicianadi" />
                            </div>
                        </div>

                        {/* Collegemate Section */}
                        <div className="collegemate-main">
                            <div className="collegemate-content">
                                <div className="collegemate-content-bubble">  
                                </div>
                                <div className="collegemate-content-bubble2">  
                                </div>
                                <div className="collegemate-content-inner">
                                    <p>Check how your friends are doing?</p>
                                </div>
                            </div>
                            <div className="collegemate-img">
                                <img src={staticimages.Friends} alt="friends" />
                            </div>
                        </div>

                        {/* Main Bottom Box */}
                        <div className="main-content-bottom">
                            <h3>Do you have your codecard profile yet?</h3>
                            <p>If not, <Link to="/profile">register</Link> now to kickstart your programming journey with us.</p>
                        </div> 
                        </div>
                    
                    <div className="tweet">
                        <div className="tweet-inner">
                        <TwitterTweetEmbed
                        tweetId={'1470379693647937542'}
                        />
                        <TwitterTweetEmbed
                        tweetId={'1470289452568178688'}
                        />
                        <TwitterTweetEmbed
                        tweetId={'1427920275404824578'}
                        />
                        <TwitterTweetEmbed
                        tweetId={'1377216337999585280'}
                        />
                        <TwitterTweetEmbed
                        tweetId={'1401055321150222341'}
                        />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}


const mapStateToProps = (state) => {
    return {
        Auth: state.Auth,
        Loader:state.Loader,
        Alert:state.Alert
    }
}

export default connect(mapStateToProps, {
    dark,
    error,
    success,
    warning,
    info
})(Home);
