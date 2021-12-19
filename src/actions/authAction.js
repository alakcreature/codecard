import http from "../services/httpCall";

export const login = (token,userdetails) => {
    http.defaults.headers.common['Authorization']='Bearer '+ token;
    localStorage.setItem("Token",token);
    return {
        type: 'LOGIN',
        token : token,
        payload : userdetails
    };
};

export const logout = () => {
    delete http.defaults.headers.common['Authorization'];
    // console.log(http.defaults.headers);
    localStorage.removeItem("Token");
    return {
        type: 'LOGOUT'
    };
};

  
export const setUserDetails = (user)=>{
    return {
        type : 'SET_USER_DETAILS',
        payload : user
    }
}