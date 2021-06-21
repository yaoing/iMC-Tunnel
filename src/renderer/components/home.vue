<template>
  <div class="main-container">
    <el-row>
      <el-col :span="12">
        <el-form class="form-box" ref="form" :model="form" label-width="40px">
          <el-form-item>
            <el-autocomplete v-model="form.account" size="small"
                             prefix-icon="el-icon-user"
                             :fetch-suggestions="querySearch"
                             @select="handleSelect"
                             placeholder="请输入学号或教师工号">

            </el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.password" size="small"
                      prefix-icon="el-icon-lock"
                      placeholder="请输入登录密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="!isLogined"
                       @click="logout" size="mini"
                       type="danger" plain>下线</el-button>

            <el-button ref="mainBtn" :loading="loading"
                       @click="loginAndKeepAlive" size="mini" @mousemove.native="handleHover"
                       type="primary">{{status ? status : '上线'}}</el-button>

          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="12">
        <div class="status-box">
          <p class="emotion-success" v-if="isLogined && status">╰(￣▽￣)╭</p>
          <p class="emotion-fail" v-else-if="status">(。_。)</p>

          <p class="time-keep" v-if="isLogined && status">
            <span>{{this.aliveRecorder.value}}</span>
            {{this.aliveRecorder.unit}}
          </p>
        </div>
      </el-col>

    </el-row>
    <div class="bottom-info-bar">
      <!--      <span>{{loginInfo.userDevPort}}</span>-->
    </div>

  </div>
</template>



<script>

import tunnel from "../../core/tunnel.js"
import launcher from "../../core/startup.js";

export default {
  name: "home",
  data(){
    return {
      form: {
        account:null,
        password:null,
      },
      loginInfo: {},
      historys: [],
      loading:false,
      status:null,
      isLogined:false,
      timeLogined:null,
      globalSettings:null,
      aliveRecorder:{
        value:null,
        unit:null
      },
      retryTime:0,

      timer:null,
      heartBeatCounter:0,
    }
  },
  methods:{
    login:async function(){

      if((!this.form.account || !this.form.password) && !this.isLogined){
        this.$notify({
          title:'登录失败',
          message:'未输入帐号密码。',
          type:'warning',
          position:"bottom-right"
        })

        this.form = {
          account: null,
          password: null
        }
      }

      else{
        this.loading = true
        this.updateGlobalSettings()

        let result = await tunnel.login(
            this.form.account,
            this.form.password,
            this.globalSettings.bindIP,
            this.globalSettings.bindPort
        )

        this.loading = false
        if(result instanceof Object && result.msg==='上线成功') {
          this.status = '已上线'
          this.isLogined = true
          this.loginInfo = result

          if(this.aliveRecorder.value===null){
            this.saveRecord()

            this.aliveRecorder={
              value:0,
              unit: '分钟'
            }
          }

          return 1
        }
        else{
          this.status = result

          this.$notify({
            title:'登录失败',
            message:result,
            type:'warning',
            position:"bottom-right"
          })
          return 0
        }
      }

    },
    loginAndKeepAlive:async function (){
      if(this.isLogined)
        return 0

      let result = await this.login()
      if(result===1 && this.timer === null){
        this.timeLogined = new Date().getTime()
        clearInterval(this.timer)
        this.keepAlive()
      }
      else if(result===0){
        this.form = {
          account: null,
          password: null
        }
      }
    },
    logout:async function(){
      this.loading = false

      if(this.isLogined){
        let result =await tunnel.logout(
            this.globalSettings.bindIP,
            this.globalSettings.bindPort
        )

        switch (result){
          case '下线成功':

            this.$notify({
              title:'下线成功',
              message:'',
              type:'success',
              position:"bottom-right"
            })

            this.aliveRecorder={
              value: null,
              unit:null
            }

            break

          default:
            this.$notify({
              title:'下线失败',
              message:result,
              type:'warning',
              position:"bottom-right"
            })

        }

        this.status = null
        this.isLogined = false
        clearInterval(this.timer)
        this.timer = null

      }

    },
    updateGlobalSettings:function (){
      this.globalSettings = JSON.parse(localStorage.getItem("settings"))
    },
    querySearch(queryString, cb) {
      var historys = this.historys
      var results = queryString ? historys.filter(this.createFilter(queryString)) : historys
      cb(results)
    },

    createFilter(queryString) {
      return (history) => {
        return (history.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    saveRecord:function (){
      let data = this.historys
      let flag = false

      if(data.length>2)
        data.splice(0,1)

      data.forEach((item,index)=>{
        if(item.value === this.form.account){
          if(item.value !== this.form.password){
            data[index].password = this.form.password
            localStorage.setItem("localRecords",JSON.stringify(data))
          }
          flag = true
        }
      })

      if(flag)
        return 1

      data.push({
        'value':this.form.account,
        'password':this.form.password
      })

      localStorage.setItem("localRecords",JSON.stringify(data))

      this.loadRecord()
    },
    loadRecord:function (){
      return localStorage.getItem("localRecords") ?
          JSON.parse(localStorage.getItem("localRecords")) :
          []
    },
    initForm:function (){
      if(this.historys.length){
        let his = this.historys.reverse()[0]
        this.form.account = his.value
        this.form.password = his.password
      }
    },
    initLogin: async function (){
      if(!this.form.account || !this.form.account)
        return 0
      let startup = await launcher.isStartup().then()
      if(!startup)
        return 0

      this.loading = true
      this.status = '即将自动连接'
      setTimeout(()=>{
        this.loginAndKeepAlive()
      },6000)
    },
    handleSelect:function (){
      this.historys.forEach((item)=>{
        if(item.value === this.form.account)
          this.form.password = item.password
      })
    },

    handleHover:function (){
      if(this.status && this.status!=='已上线' && this.status!=='即将自动连接')
        this.status='重新连接'
    },

    keepAlive: function (){
      this.timer = setInterval(async ()=>{
        if(!navigator.onLine){
          this.status = '网络未连接'
          this.isLogined = false

          return 0
        }


        this.heartBeatCounter++

        if(this.heartBeatCounter % 1200 == 0){
          this.login()
          this.heartBeatCounter = 0
        }

        else if(this.heartBeatCounter % 50 == 0)
          tunnel.doHeartBeat(
              this.globalSettings.bindIP,
              this.globalSettings.bindPort,
              this.loginInfo.userDevPort,
              this.loginInfo.userStatus.serialNo
          )




        let testResult = await tunnel.connectionTest()
        console.log(testResult)
        if(this.status!=='已上线' || !testResult){
          this.isLogined = false
          // this.status = '意外下线'
          this.retry()
        }


        var sub = (new Date().getTime() - this.timeLogined)/1000


        if(sub<3600){
          this.aliveRecorder={
            value:parseInt(sub/60),
            unit: '分钟'
          }
        }
        else if(sub<86400){
          this.aliveRecorder={
            value:parseInt(sub/3600),
            unit: '小时'
          }
        }
        else{
          this.aliveRecorder={
            value:parseInt(sub/86400),
            unit: '天'
          }
        }

      },10000)
    },
    retry:async function (){
      this.retryTime++

      this.$notify({
        title:'重新连接',
        message:`尝试第${this.retryTime}次连接...`,
        type:'warning',
        position:"bottom-right"
      })
      // console.log('retrying at',new Date().getTime())
      await this.login()

    }
  },
  created() {

  },
  mounted() {
    this.historys = this.loadRecord()
    this.initForm()
    this.initLogin()

  }
}
</script>

<style scoped>

.main-container{
  position: relative;
  height: 100%;
}

.form-box{
  margin:40px 0 0 20px
}

button:nth-child(2){
  width: 126px;
}
button>span{
  /*font-family: "Microsoft YaHei" !important;*/

}

.status-box{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 200px;
  margin: 10px 30px 0 10px;
  /*border: #42b983 solid 2px;*/
  text-align: right;
  color: #409eff;
  user-select: none;

  font-family: Arial,sans-serif;
}

.emotion-success{
  font-size: 40px;
  color: #65676c;
}

.emotion-fail{
  font-size: 40px;
  color: #C0C4CC;
}

.time-keep{
  font-size: 20px;
}
.time-keep>span{
  font-size: 80px;
  font-family: Consolas,sans-serif;

}

.bottom-info-bar{
  position: absolute;
  left: 0;
  bottom: 0;

  width: 100%;
  height: 30px;
  line-height: 30px;

  padding:0 20px

}
</style>