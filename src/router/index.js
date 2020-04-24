import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // 模拟进度条
import 'nprogress/nprogress.css'

import Layout from '@/components/Layout/Index'

Vue.use(Router)

export const asyncRouterMap = [
  {
    path: '/',
    redirect: '/eis/enterpriseInfo',
    name: 'home',
  },
  {
    path: '/eis',
    component: Layout,
    meta: {
      title: '耗材管理系统'
    },
    children: [{
      path: 'enterpriseInfo',
      component: () => import('../views/EnterpriseInfo'),
      meta: {
        title: '企业信息'
      },
    }, {
      path: 'targetManager',
      component: () => import('../views/TargetManager'),
      meta: {
        title: '指标维护'
      }
    }, {
      path: 'industryManager',
      component: () => import('../views/IndustryManager'),
      meta: {
        title: '行业维护'
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
