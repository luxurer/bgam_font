<template>
<!--  指标维护-->
  <div class="target_manager">
    <!--<div class="header_wrap">
      <span>企业信息数据库</span>
    </div>-->
    <div class="content_warp">
      <ul class="content_left">
        <li :class="belong === '1' ?'active_second_menu': ''" @click="menuSelect('1')">企业指标</li>
        <li :class="belong === '2' ?'active_second_menu': ''" @click="menuSelect('2')">机构指标</li>
      </ul>
      <div class="content_right">
        <TargetList :belong="belong"/>
      </div>
    </div>
  </div>
</template>

<script>
import TargetList from '../components/pages/target-manager/TargetList'
export default {
  name: 'TargetManager',
  components: {
    TargetList
  },
  data () {
    return {
      belong: '1' // 页面展示 1企业行业，2机构行业
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

<style scoped>

</style>
