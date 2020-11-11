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
html,body{
  width: 560px;
  height: 360px;
  margin: 0 auto;
  padding: 0;

}

#app{
  width: 100%;
  height: 100%;
  position: relative;

}
</style>
