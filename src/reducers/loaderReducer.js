const initialState = {
    loading_active : 0
}

export default (state = initialState, action )=>{
    switch(action.type){
        case 'LOADER':
            let lc = state.loading_active;
            if(action.payload){
                lc++;
            }
            else{
                lc = lc===0?0:lc-1;
            }
            return {
                ...state,
                loading_active : lc          
            };
        default:
            return state;
    }
}