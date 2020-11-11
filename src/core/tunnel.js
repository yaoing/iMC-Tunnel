const request = require('request')
const iconv = require('iconv-lite');


async function login(account,password,ip,port){
    // console.log(account,password,ip,port)
    var url = `http://${ip}:${port}/portal/pws?t=li`
    var headers = {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
        'Accept':'text/plain, */*; q=0.01',
        'Accept-Language':'zh-CN,zh;q=0.9',
        'Connection':'keep-alive',
        'Host': `${ip}:${port}`
    }
    var form = {
        'userName':`${account}`,
        'userPwd':Buffer.from(password).toString('base64'),
        'userDynamicPwd':'',
        'userDynamicPwdd':'',
        'serviceType':'',
        'userurl':'',
        'userip':'',
        'basip':'',
        'language':'Chinese',
        'usermac':'null',
        'wlannasid':'',
        'wlanssid':'',
        'entrance':'null',
        'loginVerifyCode':'',
        'userDynamicPwddd':'',
        'customPageId':'0',
        'pwdMode':'0',
        'portalProxyIP':`${ip}`,
        'portalProxyPort':'50200',
        'dcPwdNeedEncrypt':'1',
        'assignIpType':'0',
        'appRootUrl':`http://${ip}:${port}/portal/`,
        'manualUrl':'',
        'manualUrlEncryptKey':''
    }

    return new Promise(function (resolve,reject){
        request.post(
            {
                url:url,
                headers:headers,
                form: form
            },function(err,httpResponse,body){
                try{
                    var data = decodeMsg(body)

                    if(err)
                        reject('请求失败')
                    if(data.errorNumber ==="-1"){
                        var errorDescription = iconv.decode(data.errorDescription, 'utf-8')
                        reject(errorDescription)
                    }

                    else if(data.errorNumber ==="1"){
                        sendOnline(ip,port,data.portalLink)
                        sendHeartBeat(ip,port,data.portalLink)

                        if(connectionTest())
                            resolve({
                                msg:'上线成功',
                                userDevPort:data.userDevPort,
                                portalLink:data.portalLink
                            })

                        else{
                            //TODO
                        }
                    }

                    else
                        resolve('请求失败')
                }catch (e){
                    console.log(e)
                    resolve('未知错误')
                }

            })
    })
}

async function logout(ip,port){
    var url = `http://${ip}:${port}/portal/pws?t=lo`
    var headers = {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
        'Accept':'text/plain, */*; q=0.01',
        'Accept-Language':'zh-CN,zh;q=0.9',
        'Connection':'keep-alive',
    }

    var form = {
        language: 'Chinese',
        userip:'',
        basip:'',
    }

    return new Promise(function (resolve,reject){
        request.post(
            {
                url:url,
                headers:headers,
                form: form
            },function(err,httpResponse,body){
                try{
                    var data = decodeMsg(body)
                    if(data.errorNumber ==="-1"){
                        var errorDescription = iconv.decode(data.errorDescription, 'utf-8')
                        resolve(errorDescription)
                    }

                    else if(data.errorNumber ==="1")
                        if(connectionTest())
                            resolve('下线成功')

                        else{
                            //TODO
                        }
                    else
                        resolve('请求失败')
                }catch (e){
                    resolve('未知错误')
                }

            })
    })
}
async function connectionTest(host='https://www.baidu.com/favicon.ico'){
    request.get(host,function (err,res){
        if(!err && res.statusCode===200)
            return 1
        else
            console.log(err)
            return 0
    })
}



function sendOnline(ip,port,pl){
    var url = `http://${ip}:${port}/portal/page/online.jsp?st=2&
        pl=${pl}&custompath=&uamInitCustom=1&customCfg=MQ&uamInitLogo=H3C&userName=null&userPwd=null&loginType=3&innerStr=null&outerStr=null&v_is_selfLogin=0`
    var headers = {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
        'Accept':'text/plain, */*; q=0.01',
        'Accept-Language':'zh-CN,zh;q=0.9',
        'Connection':'keep-alive',
        'Host': `${ip}:${port}`
    }

    return new Promise(function (resolve,reject){
        request.post(
            {
                url:url,
                headers:headers,
            },function(err,res){

                if(!err && res.statusCode===200)
                    resolve(1)

                else
                    reject(0)

            })
    })
}

function sendHeartBeat(ip,port,pl){
    var url = `http://${ip}:${port}/portal/page/online_heartBeat.jsp?pl=${pl}&custompath=&uamInitCustom=1&uamInitLogo=H3C`
    var headers = {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
        'Accept':'text/plain, */*; q=0.01',
        'Accept-Language':'zh-CN,zh;q=0.9',
        'Connection':'keep-alive',
    }

    return new Promise(function (resolve,reject){
        request.post(
            {
                url:url,
                headers:headers,
            },function(err,res){

                if(!err && res.statusCode===200)
                    resolve(1)

                else
                    reject(0)

            })
    })
}

function doHeartBeat(ip,port,userDevPort){
    var url = `http://${ip}:${port}/portal/page/doHeartBeat.jsp?userip=&basip=&
    userDevPort=${userDevPort}&userStatus=99&serialNo=-19400&language=Chinese&e_d=&t=hb`
    var headers = {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
        'Accept':'text/plain, */*; q=0.01',
        'Accept-Language':'zh-CN,zh;q=0.9',
        'Connection':'keep-alive',
        'Host': `${ip}:${port}`
    }

    return new Promise(function (resolve,reject){
        request.post(
            {
                url:url,
                headers:headers,
            },function(err,res){

                if(!err && res.statusCode===200)
                    resolve(1)

                else
                    reject(0)

            })
    })
}

function decodeMsg(msg){

    var urlCode,resposeData
    urlCode = Buffer.from(msg,'base64')
    resposeData = unescape(urlCode)

    return JSON.parse(resposeData)
}

function test(){
    var url = `http://10.10.10.146:8080/portal/page/online.jsp`
    var headers = {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
        'Accept':'text/plain, */*; q=0.01',
        'Accept-Language':'zh-CN,zh;q=0.9',
        'Connection':'keep-alive',
    }

    return new Promise(function (resolve,reject){
        request.post(
            {
                url:url,
                headers:headers,
            },function(err,res,body){

                if(!err && res.statusCode===200)
                    resolve(1)

                else
                    reject(0)

            })
    })
}

// test()
export default {login,logout,doHeartBeat,connectionTest}

