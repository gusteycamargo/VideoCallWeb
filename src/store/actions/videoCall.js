export function setShowModal(showModal) {
    return {
        type: "SHOW_MODAl",
        showModal
    };
}

export function setUserToCall(userToCall) {
    return {
        type: "USER_TO_CALL",
        userToCall
    };
}

export function setUserLogged(userLogged) {
    return {
        type: "USER_LOGGED",
        userLogged
    };
}
