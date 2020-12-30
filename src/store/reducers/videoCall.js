const INITIAL_STATE = {
    showModal: false,
    userToCall: {},
    userLogged: ''
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
    else if(action.type === "USER_LOGGED") {
        return {
            ...state,
            userLogged: action.userLogged
        }
    }
    
    return state;
}
