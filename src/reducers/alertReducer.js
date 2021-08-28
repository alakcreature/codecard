const initialState = {
    type:"default",
    message:"This is default alert message"
}

// error success warning info dark
export default (state=initialState,action)=>{
    switch(action.type){
        case "ERROR":
            return {
                ...initialState,
                type:"ERROR",
                message:action.payload
            }
        
        case "SUCCESS":
            return {
                ...initialState,
                type:"SUCCESS",
                message:action.payload
            }

        case "DARK":
            return {
                ...initialState,
                type:"DARK",
                message:action.payload
            }

        case "WARNING":
        return {
            ...initialState,
            type:"WARNING",
            message:action.payload
        }
        
        case "INFO":
        return {
            ...initialState,
            type:"INFO",
            message:action.payload
        }
        default:
            return state;
    }
}