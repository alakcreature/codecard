import { combineReducers } from 'redux'; 
import Auth from "./authReducer";
import Loader from "./loaderReducer";
import Alert from "./alertReducer";
import ProfileLoader from "./profileLoaderReducer";

export default combineReducers({
    Auth,
    Loader,
    ProfileLoader,
    Alert
});