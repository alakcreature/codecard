import React from 'react';
import './Error.css';
// import error from '../static/404.svg';
import { Link } from 'react-router-dom';
import error from "../static/404.svg";
import { useEffect } from 'react';
import { dark } from '../../actions/alertAction';
import {connect} from 'react-redux';


function Error({dark}) {

    useEffect(()=>{
        window.scrollTo(0,0);
        if(!navigator.onLine){
            dark("Please connect to the internet and try again.")
        }
        // eslint-disable-next-line
    },[]);

    return (
        <div className="container">
            <div className="main-content">
                <div className="error-main-inner">
                    <div className="error-main">
                        <div className="error-pic">
                            <img src={error} alt="404" />
                        </div>
                        <h3>Oops! Page not Found</h3>
                        <div className="error-p-content">
                            <p>
                                Sorry, we are unable to find the page you are looking for. Try going to our
                                <span>
                                    <Link to="/practice">practice page</Link>
                                </span>
                                to get your hands dirty in your programming journey.
                            </p>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            </div>
        </div>
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
    dark
})(Error);
