<template>
<!--  行业维护-->
    <div class="industry_manager">
      <!--<div class="header_wrap">
        <span>企业信息数据库</span>
      </div>-->
      <div class="content_warp">
        <ul class="content_left">
          <li :class="belong === '1' ?'active_second_menu': ''" @click="menuSelect('1')">企业行业</li>
          <li :class="belong === '2' ?'active_second_menu': ''" @click="menuSelect('2')">机构行业</li>
        </ul>
        <div class="content_right">
          <IndustryList :belong="belong"/>
        </div>
      </div>
    </div>
</template>

<script>
import IndustryList from '../components/pages/industry-manager/IndustryList'
export default {
  name: 'IndustryManager',
  components: {
    IndustryList
  },
  data () {
    return {
      belong: '1' // 页面展示 1企业行业，2机构行业
    }
  },
  methods: {
    // 页面展示切换
    menuSelect (val) {
      this.belong = val;
    }
  }
}
</script>

<style lang="less" scoped>
.industry_manager{

}
</style>
