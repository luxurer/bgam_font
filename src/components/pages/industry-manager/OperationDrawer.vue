<template>
  <el-drawer
    size="800px"
    :close-on-press-escape="false"
    :show-close="false"
    :wrapperClosable="false"
    :visible.sync="drawer"
    :direction="direction"
    :append-to-body="true">
    <template slot="title">
      <div>
        <span>{{title}}</span>
      </div>
    </template>
    <div class="demo-drawer__content">
      <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="行业名称：" prop="name">
          <el-input v-model.trim="formData.name" maxLength="10" placeholder="10个字以内"></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="reset">取 消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'OperationDrawer',
  props: ['belong'],
  data () {
    return {
      title: '',
      drawer: false,
      direction: 'rtl',
      dialogType: '',
      currentRowData: {},
      formData: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '10个字以内', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 初始化
    init (type, row) {
      this.title = '新增行业信息'
      this.dialogType = type
      if (type === 'edit') {
        this.title = '编辑行业信息'
        this.formData.name = row.name
        this.currentRowData = row
      } else {
        this.currentRowData = {}
      }
      this.drawer = true
    },
    // 提交按钮事件
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = '/admin/industry/add'
          let message = '新增行业成功！'
          let data = {}
          if (this.dialogType === 'edit') {
            url = '/admin/industry/edit'
            message = '编辑行业成功！'
            data.id = this.currentRowData.id
            data.name = this.formData.name
          } else {
            data.belong = Number(this.belong)
            data.name = this.formData.name
          }
          this.axios({
            method: 'post',
            url: url,
            data: data
          }).then((data) => {
            this.$message({
              type: 'success',
              message: message,
              offset: 90
            })
            this.$emit('refresh')
            this.reset()
          })
        }
      })
    },
    // 表单状态重置
    reset () {
      this.$refs.form.resetFields()
      this.formData = {
        name: ''
      }
      this.drawer = false
    }
  }
}
</script>

<style lang="less" scoped>
.demo-drawer__content{
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-form{
    flex: 1;
    padding-top: 40px;
    overflow-y: auto;
    /deep/ .el-form-item__label{
      margin-left: 152px;
      padding-right: 0;
      text-align: right;
    }
    /deep/ .el-form-item__content{
      margin-left: 240px!important;
      .el-form-item__error{
        left: 3px
      }
    }
    .el-input{
      width: 400px;
    }
  }
  .demo-drawer__footer{
    text-align: center;
    height: 100px;
    padding-top: 30px;
    border-top: 1px solid #ddd;
    .el-button{
      padding: 12px 43px;
    }
  }
}
</style>
