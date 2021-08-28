import React from 'react';
import {connect} from 'react-redux';
// import {loader} from "../../actions/loaderAction";
import './Loader.css';

function LoaderPage({Loader}) {
    // let [showloader,setshowloader] = useState(0);

    return (
        <>
        {Loader.loading_active!==0
        &&
        <div className="loader-comp">
            <div className="animated yt-loader"></div>
            <div className="mask">
            <div className="simpleloader-content">
                <p>Thanks for showing your patience.</p>
            </div>
            </div>
        </div>
        }
        </>
    )
}


const mapStateToProps= (state) => (
    {
        Loader:state.Loader
    }
)

  export default connect(mapStateToProps, {

  })(LoaderPage);
