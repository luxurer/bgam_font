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
        <el-form-item label="指标名称：" prop="name">
          <el-input v-model.trim="formData.name" maxLength="20" placeholder="20个字以内"></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="type">
          <el-select v-model="formData.type" placeholder="请选择" :disabled="dialogType === 'edit'">
            <el-option label="文本" :value="1"></el-option>
            <el-option label="数字" :value="2"></el-option>
            <el-option label="日期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" prop="orderNum" class="orderNum">
          <el-input-number v-model="formData.orderNum" :min="0" :max="999" :controls="false"></el-input-number>
        </el-form-item>
        <el-form-item class="keyWord">
          <el-checkbox v-model="formData.isSearchKey">支持关键字搜索</el-checkbox>
        </el-form-item>
        <el-form-item class="isSearch">
          <el-checkbox v-model="formData.isSearch">支持高级筛选</el-checkbox>
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
        name: '',
        type: '',
        orderNum: '',
        isSearchKey: false,
        isSearch: false
      },
      rules: {
        name: [
          { required: true, message: '20个字以内', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        orderNum: [
          { required: true, message: '排序不能为空', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    // 初始化
    init (type, row) {
      this.title = '新增指标'
      this.dialogType = type
      if (type === 'edit') {
        this.title = '编辑指标'
        this.currentRowData = row
        this.formData.name = row.name
        this.formData.type = row.type
        this.formData.orderNum = row.orderNum
        this.formData.isSearchKey = row.isSearchKey ? true : false
        this.formData.isSearch = row.isSearch ? true : false
      } else {
        this.currentRowData = {}
      }
      this.drawer = true
    },
    // 提交按钮事件
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = '/admin/property/add'
          let message = '新增指标成功！'
          let data = {}
          if (this.dialogType === 'edit') {
            url = '/admin/property/edit'
            message = '编辑指标成功！'
            data.id = this.currentRowData.id
            data.name = this.formData.name
            data.orderNum = this.formData.orderNum
            data.isSearch = this.formData.isSearch ? 1 : 0
            data.isSearchKey = this.formData.isSearchKey ? 1 : 0
          } else {
            data.belong = Number(this.belong)
            data.name = this.formData.name
            data.isSearch = this.formData.isSearch ? 1 : 0
            data.isSearchKey = this.formData.isSearchKey ? 1 : 0
            data.type = this.formData.type
            data.orderNum = this.formData.orderNum
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
      this.drawer = false
      this.formData = {
        name: '',
        type: '',
        orderNum: '',
        isSearchKey: false,
        isSearch: false
      }
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
      .el-input, .el-select, .el-input-number{
        width: 400px;
      }
      /deep/ .el-input-number .el-input__inner{
        text-align: left;
      }
      .el-checkbox{
        margin-left: -37px;
        /deep/ .el-checkbox__label{
          padding-left: 24px;
        }
      }
      .orderNum{
        margin-bottom: 10px;
      }
      .keyWord{
        margin-bottom: -4px;
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
