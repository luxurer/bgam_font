<template>
<!--  企业和机构信息-->
    <div class="enterprise_info">
      <!--<div class="header_wrap">
        <span>企业信息数据库</span>
      </div>-->
      <div class="content_warp">
        <ul class="content_left">
          <li :class="belong === '1' ?'active_second_menu': ''" @click="menuSelect('1')">企业信息</li>
          <li :class="belong === '2' ?'active_second_menu': ''" @click="menuSelect('2')">机构信息</li>
        </ul>
        <div class="content_right">
          <EnterpriseList :belong="belong"/>
        </div>
      </div>
    </div>
</template>

<script>
import EnterpriseList from '../components/pages/enterprise-info/EnterpriseList'
export default {
  name: 'EnterpriseInfo',
  components: {
    EnterpriseList
  },
  data () {
    return {
      belong: '1' // 页面展示 1企业信息，2为机构信息
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
