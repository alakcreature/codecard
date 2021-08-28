import React from 'react';
import { Link } from 'react-router-dom';
// import India from "../static/india.png"
import staticimages from "../staticImagesLink";
import './Footer.css';

function Footer() {
    return (
        // Footer
        // Bottom is not responsive
        <footer className="footer container-fluid">
            <hr />
            <div className="footer-inner">
                <div className="footer-left-side">
                    <span className="copyright">Copyright © 2021 Codecard</span>
                    <ul>
                        {/* <li><Link to="/surprise">Surprise Me</Link></li> */}
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contactus">Contact Us</Link></li>
                        <li><Link to="/terms">Terms</Link></li>
                        <li><Link to="/privacypolicy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div className="footer-middle">
                    <p>Made by Shubham 
                    <Link to={{pathname: "https://www.linkedin.com/in/subham-kumar-88593814a/"}} target="_blank">
                                    <i className="fab fa-linkedin" aria-hidden="true"></i>
                    </Link>
                    & Ojas
                    <Link to={{pathname: "https://www.linkedin.com/in/ojas-vishwakarma-067300147/"}} target="_blank">
                                    <i className="fab fa-linkedin" aria-hidden="true"></i>
                    </Link>
                    Team
                    </p>
                </div>
                <div className="footer-right-side">
                <img src={staticimages.India} alt="India" />
                <span>India</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
