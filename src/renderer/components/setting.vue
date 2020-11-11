<template>
  <div class="setting-container">

    <el-form ref="form" :model="form" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="网关IP">
            <el-input v-model="form.bindIP" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="网关端口">
            <el-input v-model="form.bindPort" size="mini"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8" :offset="4">
          <el-form-item label="开机启动">
            <el-switch v-model="form.startup" active-color="#000"
                       @click.native="handleChange" size="mini"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row class="botton-bar">
        <el-col :offset="16">
          <el-form-item>
            <!--          <el-button>重置</el-button>-->
            <el-button type="primary" size="mini" @click="saveSetting">保存</el-button>

          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import launcher from "../../core/startup.js";

export default {
  name: "setting",
  data(){
    return {
      form: {
        bindIP:null,
        bindPort:null,
        startup:true
      },
    }
  },
  methods:{
    loadSettings: async function (){
      let globalSetting = JSON.parse(localStorage.getItem("settings"))
      this.form.bindIP = globalSetting.bindIP
      this.form.bindPort = globalSetting.bindPort
      this.form.startup = await launcher.isStartup().then()
    },
    handleChange:function (e){
      e.preventDefault()
      let status = !this.form.startup
      console.log()
      if(status){
        launcher.disable()
      }
      else{
        launcher.enable()
      }
    },
    saveSetting:function (){
      localStorage.setItem("settings",JSON.stringify({
        bindIP:this.form.bindIP,
        bindPort:this.form.bindPort
      }))

    }

  },
  mounted() {
    this.loadSettings()
    console.log(this.form.startup)
  }
}
</script>

<style scoped>
.setting-container{
  width: 100%;
  height: 100%;
  padding: 40px 0px 0px 20px;
}

.botton-bar{
  margin-top: 100px;
}
</style>