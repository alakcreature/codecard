const initialState = {
    profile_loader_active : 0
}

export default (state = initialState, action )=>{
    switch(action.type){
        case 'PROFILELOADER':
            let lc = state.profile_loader_active;
            if(action.payload){
                lc++;
            }
            else{
                lc = lc===0?0:lc-1;
            }
            return {
                ...state,
                profile_loader_active : lc          
            };
        default:
            return state;
    }
}