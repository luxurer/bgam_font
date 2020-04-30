import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// import 'element-ui/lib/theme-chalk/drawer.css'
// import './assets/theme/index.css'
import './assets/css/base.css'
import './assets/css/common.css'
import Router from 'vue-router'
import service from './utils/request.js'

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.axios = service

//路由跳转前
router.beforeEach(((to, from, next) => {
  let isLogin = sessionStorage.getItem('bgam_font_isLogin');
  //已登录，放行
  if (isLogin != null) {
    next();
  }
  //注销
  if (to.path == '/logout') {
    sessionStorage.clear();
    next({path: '/login'});
  } else if (to.path == '/login') {
    //已登录，送到主页
    if (isLogin != null) {
      next({path: '/home'})
    }
    //未登录
    next();
  } else if (isLogin == null) {
    next({path: '/login'});
  }
}));

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
