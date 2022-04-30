import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

// Change the facebook page link
function About() {

    

    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);

    return (
        <div className="container">
            <div className="container-fluid main-content">
                <div className="about-main-inner">
                    <h4><strong>About Us</strong></h4>
                    <div id="border">
                    </div>
                    <div className="about-content-section">  
                        <p>Hello Coders,</p>
                        <p>We are a small team of people devoted to bringing the one stop solution for your competitive coding kickoff.</p>
                        <p>Now you don't need to go and hunt down every competitive coding platform
                        by yourself,
                        </p>
                        <p>
                         we are bringing them all at a single place on <Link to="/">CodeCard</Link>.
                        </p>
                        <p>From exploring question on different platforms to analysing your
                           progress each day
                        </p>
                        <p>&</p>
                        <p> a bunch of motivational memes for motivating you.
                        </p>
                        <p>
                            <Link to="/">CodeCard</Link> is ready to guide you through your whole competitive coding
                            journey.
                        </p>
                        <p> Stay tuned for new features!.
                        </p>
                    </div>
                    <div className="socialmedia-section">
                        <ul>
                            <li>
                                <Link to={{pathname: "https://t.me/codecard"}} target="_blank">
                                    <i className="fab fa-telegram" aria-hidden="true"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to={{pathname: "https://www.youtube.com/channel/UCoWPZGojQB9elA9kXHbtJFw"}} target="_blank">
                                    <i className="fab fa-youtube" aria-hidden="true"></i>
                                </Link>
                            </li>
                            <li>
                                <Link to={{pathname: "https://www.linkedin.com/company/codecard"}} target="_blank">
                                    <i className="fab fa-linkedin" aria-hidden="true"></i>
                                </Link>
                            </li> 
                            <li>
                                <Link to={{pathname: "https://twitter.com/codecardoffcl"}} target="_blank">
                                    <i className="fab fa-twitter" aria-hidden="true"></i>
                                </Link>
                            </li>                        
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
