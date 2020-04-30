import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // 模拟进度条
import 'nprogress/nprogress.css'
import Layout from '@/components/Layout/Index'
import Login from '../components/Layout/login'

Vue.use(Router)

export const asyncRouterMap = [
  {
    //登录页
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录页'
    },
    component: Login
  },
  {
    path: '/',
    redirect: '/eis/enterpriseInfo',
    name: 'home',
  },
  {
    path: '/eis',
    component: Layout,
    meta: {
      title: '管理系统'
    },
    children: [{
      path: 'enterpriseInfo',
      component: () => import('../views/CenterInfo'),
      meta: {
        title: '管理中心'
      }
    }, {
      path: 'targetManager',
      component: () => import('../views/TargetManager'),
      meta: {
        title: '指标维护'
      }
    }, {
      path: 'sourceManager',
      component: () => import('../views/SourceManager'),
      meta: {
        title: '配置管理'
      }
    }]
  }
]

const router = new Router({
  routes: asyncRouterMap
})

// 守卫前置
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

// 守卫后置
router.afterEach((to, form) => {
  window.document.title = to.meta.title
  NProgress.done()
})

export default router
