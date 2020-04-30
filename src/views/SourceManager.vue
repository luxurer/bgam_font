<template>
  <!--  所属维护-->
  <div class="source_manager">
    <!--<div class="header_wrap">
      <span>社团信息数据库</span>
    </div>-->
    <div class="content_warp">
      <ul class="content_left">
        <li :class="belong === '1' ?'active_second_menu': ''" @click="menuSelect('1')">院级维护</li>
        <li :class="belong === '2' ?'active_second_menu': ''" @click="menuSelect('2')">资源管理</li>
      </ul>
      <div class="content_right">
        <sourceList :belong="belong"/>
      </div>
    </div>
  </div>
</template>

<script>
  import sourceList from '../components/pages/source-manager/SourceList'

  export default {
    name: 'SourceManager',
    components: {
      sourceList
    },
    data() {
      return {
        belong: '1' // 页面展示 1社团所属，2活动所属
      }
    },
    methods: {
      // 页面展示切换
      menuSelect(val) {
        this.belong = val
      }
    }
  }
</script>

<style lang="less" scoped>
  .source_manager {

  }
</style>
