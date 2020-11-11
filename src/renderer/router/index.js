import Vue from 'vue'
import Router from 'vue-router'

import panel from "@/components/panel";
import home from '@/components/home'
import setting from "@/components/setting";
import about from "@/components/about";

Vue.use(Router);


export default new Router({
  mode:'hash',
  routes:[
    {
      path:'/',
      name:'panel',
      component:panel,
      children:[
        {
          path:'home',
          name:'home',
          component:home,
        },
        {
          path:'setting',
          name:'setting',
          component:setting,
        },
        {
          path:'about',
          name:'about',
          component:about,
        }
      ]
    },


  ]
})