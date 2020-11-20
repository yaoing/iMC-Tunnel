<template>
  <div id="app">

    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',

}
</script>

<style>

*{
  box-sizing: border-box;
}

html,body{
  margin: 0 auto;
  padding: 0;
  overflow: hidden;
}

#app{
  width: 550px;
  height: 330px;
  position: relative;
  overflow: hidden;
}
</style>
