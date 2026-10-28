import { createRouter, createWebHistory } from 'vue-router'
import AuthView from './views/AuthView.vue'
import TodayView from './views/TodayView.vue'
import RecordsView from './views/RecordsView.vue'
import ProjectView from './views/ProjectView.vue'
import SettingsView from './views/SettingsView.vue'
export const router=createRouter({history:createWebHistory(import.meta.env.BASE_URL),routes:[
  {path:'/',redirect:'/today'},
  {path:'/auth/:mode?',component:AuthView,meta:{title:'Account'}},
  {path:'/today',component:TodayView,meta:{title:'Today'}},
  {path:'/clients',component:RecordsView,meta:{title:'Clients'}},
  {path:'/projects',component:RecordsView,meta:{title:'Projects'}},
  {path:'/projects/:id',component:ProjectView,meta:{title:'Projects'}},
  {path:'/settings',component:SettingsView,meta:{title:'Settings'}},
  {path:'/:pathMatch(.*)*',redirect:'/today'},
],scrollBehavior:()=>({top:0})})
