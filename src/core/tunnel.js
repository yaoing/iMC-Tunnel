const request = require('request')
const iconv = require('iconv-lite');


async function login(account,password,ip,port){
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

                        if(connectionTest())
                            resolve({
                                msg:'上线成功',
                                userDevPort:data.userDevPort,
                                portalLink:data.portalLink,
                                serialNo:data.serialNo,
                                userStatus:data.userStatus
                            })

                        else{
                            //TODO
                        }
                    }

                    else
                        resolve('请求失败')
                }catch (e){
                    // console.log(e,new Date().getTime())
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

async function connectionTest(host='https://www.baidu.com/'){
    //"http://i.baidu.com/msg/message/get/"  to  "https://www.baidu.com/"
    return new Promise(function (resolve,reject){
        request.get(host,function (err,res){
            try {
                // console.log(res.statusCode,res.req)
                if(!err && res.statusCode===200)
                    resolve(1)
                else
                    resolve(0)
            }catch (err){
                reject(0)
            }
        })
    })
}


function doHeartBeat(ip,port,userDevPort,userStatus,serialNo){
    var url = `http://${ip}:${port}/portal/page/doHeartBeat.jsp?userip=&basip=&
    userDevPort=${userDevPort}&userStatus=${userStatus}&serialNo=${serialNo}&language=Chinese&e_d=&t=hb`
    var headers = {
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
        'Accept':'text/plain, */*; q=0.01',
        'Accept-Language':'zh-CN,zh;q=0.9',
        'Connection':'keep-alive',
        'Host': `${ip}:${port}`,
        'Upgrade-Insecure-Requests': 1,
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

export default {login,logout,doHeartBeat,connectionTest}

// connectionTest().then((r)=>{
//     console.log(r)
// })
