<template>
  <div class="setting-container">

    <el-form :model="form" label-width="80px">
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

      <div class="botton-bar">
          <el-form-item>
            <!--          <el-button>重置</el-button>-->
            <el-button type="primary" size="mini" @click="saveSetting">保存</el-button>

          </el-form-item>
      </div>

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
  }
}
</script>

<style scoped>
.setting-container{
  width: 100%;
  height: 100%;
  padding: 40px 0 0 20px;

  position: relative;
}

.botton-bar{
  position: absolute;
  right: 40px;
  bottom: 0px;
}
</style>