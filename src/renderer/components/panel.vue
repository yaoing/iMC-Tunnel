<template>

    <el-container class="container">
      <el-aside class="side-bar">
        <el-menu class="side-menu"
                 default-active="/home"
                 background-color="#323232"
                 text-color="#fcfcfc" active-text-color="#fff"
                  @select="handleMenu">

              <el-menu-item index="/home">
                <i class="el-icon-discover" ></i>
              </el-menu-item>

              <el-menu-item index="/setting">
                <i class="el-icon-setting"></i>
              </el-menu-item>
              <el-menu-item index="/about">
                <i class="el-icon-guide"></i>
              </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header class="" style="height:40px; -webkit-app-region: drag">
          <span class="brand">iMC Tunnel</span>
          <div id='win-btns'>
            <i class="el-icon-minus" @click='minWin'></i>
            <i class="el-icon-full-screen"></i>
            <i class="el-icon-close" @click='closeWin'></i>
          </div>
        </el-header>
        <div class="main">
          <keep-alive>
            <router-view/>
          </keep-alive>
        </div>
      </el-container>
    </el-container>

</template>

<script>

const { ipcRenderer } = require('electron')

import home from './home'
import setting from "./setting";
import about from "./about";


export default {
  name: 'pannel',
  comments:{home,setting,about},
  data(){
    return {
      form:{

      }
    }
  },
  methods:{
    minWin:function (){
      ipcRenderer.send('minWin')
    },
    closeWin:function (){
      ipcRenderer.send('closeWin')
    },
    handleMenu:function (path){
      this.$router.push(path)
    }
  },
  mounted() {
    this.$router.push('/home').catch(()=>{})
  }

}
</script>

<style scoped>

.container{
  height: 330px;
}

.side-bar{
  width: 46px !important;
  height: 100%;

  overflow: hidden;

  background-color: #959494;
  border-bottom: 2px solid #000;
}

.side-bar > .el-menu{
  width: 100% !important;
}

.el-menu-item:nth-child(2){
  height: 216px;
}

.side-bar li{
  padding-left:10px !important;
}


.side-bar .el-menu-item i{
  font-size: 26px;
}

.side-menu{
  display: flex;
  flex-direction: column;
}


.brand{
  margin-left: 40px;
  line-height: 40px;

  color: #575757;
  font-family: "Comic Sans MS",sans-serif;
  font-size: 20px;
  user-select: none;
}

.main{
  width: 515px;
  height: 290px;

}


#win-btns{
  position: absolute;
  right: 0;
  top:0;
  font-size: 16px;
  line-height: 0px;

  -webkit-app-region: no-drag
}
#win-btns>i{
  padding: 10px;
  }
#win-btns > i:nth-child(even){
  opacity: 0.4;
}
#win-btns > i:nth-child(odd):hover{
  background-color: #C0C4CC;
}



</style>