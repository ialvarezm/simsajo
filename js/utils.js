'use strict';

/**
* This file contains functions that can be used throughout the app
*/
var Utils = (function (){

    function checkUserRole() {
        // if(localStorage.currentUser){
        //     var user = JSON.parse(localStorage.currentUser);
        //     if(user.rol !== '1') {
        //         window.location.pathname = config.redirect;
        //     }
        // } else {
        //     window.location.pathname = config.redirect;
        // }
    }

    return {
        checkUserRole: checkUserRole
    }
})();
