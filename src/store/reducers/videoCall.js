const INITIAL_STATE = {
    showModal: false,
    userToCall: {}
}

export default function videoCall(state = INITIAL_STATE, action) {
    if(action.type === "SHOW_MODAL") {
        return {
            ...state,
            showModal: action.showModal
        }
    }
    else if(action.type === "USER_TO_CALL") {
        return {
            ...state,
            userToCall: action.userToCall
        }
    }
    
    return state;
}
