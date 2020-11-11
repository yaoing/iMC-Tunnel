<template>
  <div class="about-container">
    <p>项目名称： <a>iMC Tunnel</a></p>
    <p>项目地址： <a>https://github.com/yaoing/iMC-Tunnel</a></p>
    <p>项目作者： <a>垚望</a></p>
    <p>当前版本： <a>0.9.9</a></p>
    <el-divider content-position="right">动一动手指
      <el-divider direction="vertical"></el-divider>
      <strong>Star</strong>
      本项目
    </el-divider>
  </div>
</template>

<script>

export default {
  name: "about"
}
</script>


<style scoped>
.about-container{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 80px;
  padding-top: 30px;

  color: #65676c;
  font-size: 14px;
}

a{
  color: #6c74bd;
}
</style>