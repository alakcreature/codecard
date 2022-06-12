import React from 'react';
import { Link } from 'react-router-dom';
import staticimages from "../staticImagesLink";
import './Footer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Footer() {
    return (
        // Footer
        // Bottom is not responsive
        <footer className="footer container-fluid">
            <hr />
            <div className="footer-inner">
                <div className="footer-left-side">
                    <span className="copyright">Copyright © 2021-2022 Codecard</span>
                    <ul>
                        {/* <li><Link to="/surprise">Surprise Me</Link></li> */}
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contactus">Contact Us</Link></li>
                        <li><Link to="/terms">Terms</Link></li>
                        <li><Link to="/privacypolicy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div className="footer-middle">
                    <p>Made by Alak 
                    <Link to={{pathname: "https://www.linkedin.com/in/subham-kumar-88593814a/"}} target="_blank">
                        <FontAwesomeIcon icon={["fab","linkedin"]}/>
                    </Link>
                    </p>
                </div>
                <div className="footer-right-side">
                    With <FontAwesomeIcon icon="heart" style={{color:'red'}}/> from
                    <img src={staticimages.India} alt="India" />
                </div>
            </div>
        </footer>
    )
}

export default Footer;
