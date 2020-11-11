const AutoLaunch = require('auto-launch');

const launcher = new AutoLaunch({
    name: 'iMC Tunnel',
    path: process.execPath,
    isHidden: true,
    mac: {
        useLaunchAgent: false
    }
});

function enable(){
    launcher.isEnabled().then(function (isEnabled){
        if(isEnabled)
            return 0

        launcher.enable();
        return 1
    }).catch(function(err){
        console.log(err)
        return -1
    });
}


function disable(){
    launcher.isEnabled().then(function (isEnabled){
        if(!isEnabled)
            return 0

        launcher.disable();
        return 1
    }).catch(function(err){
        console.log(err)
        return -1
    });
}

function isStartup(){
    return launcher.isEnabled()
}



export default {enable,disable,isStartup}

