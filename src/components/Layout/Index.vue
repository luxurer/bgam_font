<template>
  <div class="main-container">
    <div class="top-nav">
      <div class="nav-list clearfix">
        <span class="fl">
          <img style="vertical-align: middle;"  height="90px" width="240px" alt="社团管理平台"
               src="@/assets/img/haut_logo.jpg">
        </span>
        <ul class="fl" style="margin-left: 79px;">
          <li v-for="(item, index) in sidebarData" :class="$route.path.indexOf(item.url) !== -1 ? 'active' : ''"
              :key="index"
              @click="changeSidebar(index)">
            <div>{{ item.name }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="content">
      <router-view class="right-content"/>
    </div>
  </div>
</template>

<script>
  import path from 'path'
  import {asyncRouterMap} from '@/router'
  import {getUrlParams} from '@/utils/index.js'

  export default {
    data() {
      return {
        basePath: '',
        filterRouter: '',
        topNav: '',
        sidebarData: [],
        msgCount: 0
      }
    },
    created() {
      const params = getUrlParams(window.location.href)
      if (params.token) {
        sessionStorage.setItem('token', params.token)
        this.$router.push('/')
      }
    },
    mounted() {
      this.initRouter(this.$route)
    },
    methods: {
      initRouter(routerList) {
        this.sidebarData = []
        routerList.matched.some((item, index) => {
          this.filterRouter = asyncRouterMap.filter(innerItem => {
            return innerItem.path === item.path
          })
          return this.filterRouter.length > 0
        })
        this.topNav = this.filterRouter[0].meta.title
        this.basePath = this.filterRouter[0].path
        this.filterRouter[0].children.forEach((item, index) => {
          if (!item.meta.hidden) {
            this.sidebarData.push({
              url: this.resolvePath(item.path),
              name: item.meta.title
            })
          }
        })
      },
      changeSidebar(index) {
        this.$router.push({path: this.sidebarData[index].url})
      },
      resolvePath(...paths) {
        return path.resolve(this.basePath, ...paths)
      }
    },
    watch: {
      '$route': function (newVal, oldVal) {
        this.initRouter(newVal)
      }
    }
  }
</script>
<style scoped lang="less">
  @activeColor: #599BF8;
  .main-container {
    margin: 100px auto 0px auto;
    padding-top: 20px;
    width: 1400px;
    height: calc(100% - 100px);
  }

  .top-nav {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    min-width: 1400px;
    background: #ffffff;
    height: 100px;
  }

  .nav-list {
    margin: 0 auto;
    width: 1400px;
    line-height: 100px;
  }

  .nav-list li {
    display: inline-block;
    height: 100px;
    line-height: 100px;
    font-size: 18px;
    box-sizing: border-box;
    margin-right: 50px;
    cursor: pointer;
  }

  .nav-list li.active {
    color: @activeColor;
    border-bottom: 4px solid @activeColor;
  }

  .content {
    height: 100%;
    background: #ffffff;
  }

  .right-content {
    overflow: auto;
    height: 100%;
  }
</style>
<style>
  .el-badge__content.is-fixed {
    top: 24px !important;
  }
  img{
    background-color: #f0f9eb;
  }

</style>>
