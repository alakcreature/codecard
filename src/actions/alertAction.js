export const error = (message)=>{
    return {
        type:"ERROR",
        payload:message
    }
}

export const success = (message)=>{
    return {
        type:"SUCCESS",
        payload:message
    }
}

export const dark = (message)=>{
    return {
        type:"DARK",
        payload:message
    }
}

export const warning = (message)=>{
    return {
        type:"WARNING",
        payload:message
    }
}

export const info = (message)=>{
    return {
        type:"INFO",
        payload:message
    }
}