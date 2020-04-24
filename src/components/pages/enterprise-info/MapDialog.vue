<template>
  <el-dialog
    title="选择地图对应位置"
    custom-class="map_dialog"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="600px">
    <div id="container" class="map_box"></div>
    <div class="search_box">
      <el-input v-model.trim="address" prefix-icon="el-icon-search" :clearable="true" maxLength="50" placeholder="请输入需要查找的地址"></el-input>
      <span class="search_btn" @click="handleSearch">搜索</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Zuobiao from '@/assets/img/ic_zuobiao.png'
import { getGeo } from '@/utils/index'
let map
export default {
  name: 'MapDialog',
  data () {
    return {
      dialogVisible: false,
      address: '',
      lngLat: {},
      currentAddress: '', // 当前地图展示地址
      geoUrl: '',
      geoKey: ''
    }
  },
  methods: {
    init (address, lngLat) {
      this.address = address
      this.lngLat = lngLat
      this.dialogVisible = true
      this.$nextTick(() => {
        this.mapInit()
        if (lngLat.length > 0) {
          this.markByLngLat(lngLat)
        }
      })
    },
    handleSearch () {
      if (this.address) {
        map.clearMap();
        this.markByAddress(this.address)
      }
    },
    mapInit () {
      map = new AMap.Map('container', {
        zooms: [10, 17],
        resizeEnable: true
      })
      AMap.plugin([
        'AMap.ToolBar'
      ], function () {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar({
          // 简易缩放模式，默认为 false
          liteStyle: true
        }))
      })
    },
    // 根据输入地址标记点
    markByAddress (address) {
      const _this = this
      getGeo(_this.geoUrl + '?address=' + address + '&key=' + _this.geoKey, (result) => {
        if (result.status === '1' && result.geocodes.length && result.geocodes.length > 0) {
          let lnglat = result.geocodes[0].location.split(',')
          _this.lngLat = lnglat
          _this.markByLngLat(lnglat)
          _this.currentAddress = _this.address
        } else {
          _this.lngLat = {}
          _this.currentAddress = ''
          _this.$message({
            type: 'error',
            message: '地址查询失败',
            offset: 90
          })
        }
      })
    },
    // 根据经纬度标记点
    markByLngLat (lnglat) {
      const _this = this
      let marker = new AMap.Marker({
        position: lnglat,
        icon: Zuobiao,
        iconStyle: 'black',
      })
      map.add(marker)
      map.setFitView(marker)
      map.on('click', function (e) {
        lnglat = e.lnglat
        _this.lngLat = [lnglat.lng, lnglat.lat]
        map.remove(marker)
        marker = new AMap.Marker({
          icon: Zuobiao,
          position: lnglat
        })
        map.add(marker)
      })
    },
    handleSubmit () {
      let lngLat = this.lngLat
      if (!this.address) {
        lngLat = []
      }
      if (this.address && lngLat.length < 1){
        this.$message({
          type: 'error',
          message: '请点击搜索获取经纬度信息',
          offset: 90
        })
        return false
      }
      this.$emit('setAddress', this.address, lngLat)
      this.dialogVisible = false
    },
    // 获取高德地图的url和key
    queryGeoUrl () {
      this.axios({
        method: 'get',
        url: '/admin/enterprisOrOrgan/queryGeoUrl'
      }).then(({ data }) => {
        this.geoUrl = data.url
        this.geoKey = data.key
      })
    }
  },
  mounted () {
    this.queryGeoUrl()
  }
}
</script>

<style lang="less" scoped>
/deep/.map_dialog{
  margin-top: 20vh!important;
  .search_box{
    width: 90%;
    margin-left: 5%;
    position: absolute;
    top: 10px;
    .search_btn{
      position: absolute;
      top: 10px;
      right: 10px;
      color: #599BF8;
      cursor: pointer;
    }
    .el-input--suffix .el-input__inner{
      padding-right: 65px;
    }
    .el-input__suffix{
      right: 40px;
    }
  }
  .map_box{
    height: 430px;
  }
  .el-dialog__header{
    .el-dialog__headerbtn .el-dialog__close{
      font-size: 24px;
    }
  }
  .el-dialog__body{
    padding: 0;
    position: relative;
  }
  .el-dialog__footer{
    text-align: center;
  }
}
/deep/ .amap-indoormap-floorbar-control{
  display: none!important;
}
</style>
