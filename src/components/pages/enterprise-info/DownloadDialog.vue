<template>
  <div class="download_dialog">
    <el-dialog
      title="导出"
      :visible.sync="dialogVisible"
      width="600px">
      <div class="content">
        <div>
          <div><span class="numbers">1</span></div>
          <img
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="导出数据准备中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
            src="@/assets/img/download_normal.png"
            alt="点击导出数据"
            @click="handleExport">
          <div>点击导出数据</div>
        </div>
        <div>
          <div><span class="numbers">2</span></div>
          <img src="@/assets/img/download_excel.png" alt="点击导出EXCEL模板" @click="exportTemplate">
          <div>点击导出EXCEL模板</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { handleExport } from '@/utils/index'
let loading2 = null
export default {
  name: 'DownloadDialog',
  props: ['belong', 'searchKey', 'highSearchData'],
  data () {
    return {
      dialogVisible: false,
      fullscreenLoading: false
    }
  },
  methods: {
    init (data) {
      this.dialogVisible = true
    },
    // 导出模板
    exportTemplate () {
      this.axios({
        method: 'get',
        url: '/admin/property/getExcelTemplate',
        params: {
          belong: this.belong
        }
      }).then(({data}) => {
        handleExport(data.url)
      })
    },
    // 导出当前数据
    handleExport () {
      this.axios({
        method: 'post',
        url: '/admin/enterprisOrOrgan/getData',
        data: {
          belong: this.belong,
          searchKey: this.searchKey,
          highSearch: this.highSearchData
        }
      }).then(({data}) => {
        this.fullscreenLoading = true;
        this.queryExportState(data)
      })
    },
    // 获取导出状态
    queryExportState (token) {
      this.axios({
        method: 'get',
        url: '/admin/enterprisOrOrgan/queryExportState',
        params: {
          token: token,
        }
      }).then(({data}) => {
        if (data.finish) {
          handleExport(data.url)
          setTimeout(() => {
            this.$message({
              type:'success',
              message: '导出成功！'
            })
            this.fullscreenLoading = false;
          },2000)
        } else {
          setTimeout(() => {
            this.queryExportState(token)
          },1000)
        }
      }).catch(() => {
        this.fullscreenLoading = false;
      })
    }
  }
}
</script>

<style lang="less" scoped>
.download_dialog{
  /deep/.el-dialog{
    margin-top: 25vh!important;
    .content{
      padding: 40px 106px 60px;
      display: flex;
      justify-content: space-between;
      img{
        cursor: pointer;
      }
      div{
        text-align: center;
        margin: 20px 0;
        color: #999999;
        .numbers{
          display: inline-block;
          width: 22px;
          height: 22px;
          line-height: 22px;
          background: #599BF8;
          border-radius: 50%;
          color: #fff;
        }
      }
    }
    .el-dialog__header{
      .el-dialog__headerbtn .el-dialog__close{
        font-size: 24px;
      }
    }
    .el-dialog__body{
      padding: 0;
    }
  }
}
</style>
