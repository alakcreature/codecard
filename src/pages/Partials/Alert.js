import React, { useEffect } from 'react';
import './Alert.css';
import {connect} from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {dark,error,success} from '../../actions/alertAction';

function Alert(props) {

    const success = ()=>{
        toast.success(props.Alert.message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }

    const error = ()=>{
        toast.error(props.Alert.message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }

    const dark = ()=>{
        // console.log(props.Alert.message)
        toast.dark(props.Alert.message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }

    const warning = ()=>{
        toast.warn(props.Alert.message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }

    const info = ()=>{
        toast.info(props.Alert.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
    }

    useEffect(()=>{
        // setTimeout(() => {
        //     setshowalerttype("dark");
        // }, 2000);
    },[]);

    useEffect(()=>{
        // console.log(props.Alert);
    },[props.Alert]);

    return (
        <>
        {props.Alert.type==="ERROR" && error()}
        {props.Alert.type==="DARK" && dark()}
        {props.Alert.type==="SUCCESS" && success()}
        {props.Alert.type==="WARNING" && warning()}
        {props.Alert.type==="INFO" && info()}
        <div className="global-alert">
            <ToastContainer
                toastClassName={props.Alert.type}
                newestOnTop
            />
      </div>
      </>
    )
}


const mapStateToProps= (state) => {
    return {
        Alert:state.Alert
    }
}

export default connect(mapStateToProps, {
    dark,
    success,
    error
})(Alert);
