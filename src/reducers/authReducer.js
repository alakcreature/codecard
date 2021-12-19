const initialState = {
    isLoggedIn : false,
    token : null,
    userdetails : null          
}

export default (state = initialState, action )=>{
    switch(action.type){
        case 'LOGIN':
            console.log(state);
            return {
                ...state,
                isLoggedIn : true,
                token : action.token,
                userdetails : action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn : false,
                token : null,
                userdetails : null
            }
        case 'SET_USER_DETAILS':
            return{
                ...state,
                userdetails : action.payload
            }
        default:
            return state;
    }
}