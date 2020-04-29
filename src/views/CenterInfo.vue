<template>
<!--  社团和活动信息-->
    <div class="enterprise_info">
      <!--<div class="header_wrap">
        <span>社团信息数据库</span>
      </div>-->
      <div class="content_warp">
        <ul class="content_left">
          <li :class="belong === '1' ?'active_second_menu': ''" @click="menuSelect('1')">社团信息</li>
          <li :class="belong === '2' ?'active_second_menu': ''" @click="menuSelect('2')">活动信息</li>
        </ul>
        <div class="content_right">
          <CenterManager :belong="belong"/>
        </div>
      </div>
    </div>
</template>

<script>
import CenterManager from '../components/pages/assocaiation-info/CenterManager'
export default {
  name: 'CenterInfo',
  components: {
    CenterManager
  },
  data () {
    return {
      belong: '1' // 页面展示 1社团信息，2为活动信息
    }
  },
  methods: {
    // 页面展示切换
    menuSelect (val) {
      this.belong = val
    }
  }
}
</script>

<style lang="less" scoped>
.enterprise_info{

}
</style>
