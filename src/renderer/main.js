import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App'
import router from './router'

import startup from "../core/startup.js";

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false;

Vue.use(ElementUI);


//initial setting
if(!localStorage.getItem("settings")){
  localStorage.setItem("settings",JSON.stringify({
    bindIP:'10.10.10.146',
    bindPort:'8080'
  }))
  startup.enable()
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
