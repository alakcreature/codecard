import React from 'react';
import './ProfileLoader.css';
import {connect} from 'react-redux';


function ProfileLoader({ProfileLoader}) {
    return (
        <>
        {ProfileLoader.profile_loader_active!==0
        && (
            <div className="guarded-loader">
                <div className="guard-loader-inner">
                    <svg>
                        <g>
                        <path d="M 50,100 A 1,1 0 0 1 50,0"/>
                        </g>
                        <g>
                        <path d="M 50,75 A 1,1 0 0 0 50,-25"/>
                        </g>
                        <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor:"#FF56A1", stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:"#FF9350",stopOpacity:1}} />
                        </linearGradient>
                        </defs>
                    </svg>
                    
                </div>
                <div className="guard-loader-content">
                    <p>Hang on, we are fetching details for one of the best coders . . .</p>
                </div>
            </div>
        )
        }
        </>
    )
}


const mapStateToProps= (state) => (
    {
        ProfileLoader:state.ProfileLoader
    }
)

export default connect(mapStateToProps, {
    // profileloader
})(ProfileLoader);
