<template>
  <div class="upload_result">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="480px">
      <div class="content">
          <p class="title">{{result.successNum == 0 ? '导入失败':'导入成功'}}</p>
          <p class="result">正确数据{{result.successNum}}条，错误数据{{result.errorNum}}条</p>
          <p class="error" v-if="result.errorNum > 0"><span @click="downloadError">下载错误数据</span></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handelSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { handleExport } from '@/utils/index'
export default {
  name: 'UploadResult',
  props: ['belong'],
  data () {
    return {
      dialogVisible: false,
      result: {}
    }
  },
  methods: {
    init (data) {
      this.dialogVisible = true
      this.result = data
    },
    downloadError () {
      handleExport(this.result.url)
    },
    handelSubmit () {
        this.dialogVisible = false
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="less" scoped>
.upload_result{
  /deep/ .el-dialog{
    margin-top: 30vh!important;
    .content{
      text-align: center;
      .title{
        color: #333;
        font-size: 18px;
      }
      .result{
        font-size: 14px;
        line-height: 40px;
      }
      .error{
        color: #F85959;
        line-height: 40px;
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .el-dialog__body{
      padding: 40px 0 30px;
    }
    .el-dialog__header{
      display: none;
    }
    .el-dialog__footer{
      text-align: center;
    }
  }
}

</style>
