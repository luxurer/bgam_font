<template>
<!--  高级筛选-->
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
      <el-form ref="form" :model="formData" label-width="150px">
        <template v-for="(item,index) in this.formData.items">
          <el-form-item
            v-if="item.type === 1 && item.code !== 'A000002' && item.code !== 'A000005'"
            :key="index"
            :label="item.name">
            <el-input v-model.trim="item.value" maxLength="10"></el-input>
          </el-form-item>
          <el-form-item
            :key="index"
            v-if="item.type === 2 && item.code !== 'A000002' && item.code !== 'A000005'"
            :label="item.name"
            :prop="'items.' + index + '.value'"
            :rules="[
            { validator: valueFormate, trigger: 'blur' },
          ]">
            <el-input class="number_start" placeholder="最小值" v-model.trim="item.value.start" maxLength="13"></el-input>
            <span class="number_cut">~</span>
            <el-input class="number_end" placeholder="最大值" v-model.trim="item.value.end" maxLength="13"></el-input>
          </el-form-item>
          <el-form-item
            :key="index"
            v-if="item.type === 3 && item.code !== 'A000002' && item.code !== 'A000005'"
            :label="item.name">
            <el-date-picker
              v-model="item.date"
              type="daterange"
              range-separator="~"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item
            :key="index"
            v-if="item.code === 'A000002' || item.code === 'A000005'"
            :label="item.name">
            <el-select v-model="item.value" placeholder="请选择" :clearable="true">
              <el-option label="全部" value=""></el-option>
              <el-option
                v-for="v in industryLists"
                :key="v.id"
                :label="v.name"
                :value="v.id">
              </el-option>
            </el-select>
          </el-form-item>
        </template>

      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="resetForm(targetList)">重 置</el-button>
        <el-button @click="reset">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'HighSearch',
  props: ['targetList', 'industryLists'],
  data () {
    return {
      title: '高级筛选',
      drawer: false,
      direction: 'rtl',
      formData: {
        items: []
      }
    }
  },
  watch: {
    targetList: {
      handler: function (newVal) {
        this.resetForm(newVal)
      },
      deep: true
    }
  },
  methods: {
    // 数字输入框输入限制
    valueFormate (rule, value, cb) {
      if (!value) return cb()
      if (value.start || value.end) {
        if (value.start !== '' && !(/^\d+\.?\d{0,2}$/.test(value.start))) {
          // eslint-disable-next-line standard/no-callback-literal
          return cb('只能输入数字，可以有两位小数')
        }
        if (value.end !== '' && !(/^\d+\.?\d{0,2}$/.test(value.end))) {
          // eslint-disable-next-line standard/no-callback-literal
          return cb('只能输入数字，可以有两位小数')
        }
        if (value.end && Number(value.start) > Number(value.end)) {
          // eslint-disable-next-line standard/no-callback-literal
          return cb('最小值不能大于最大值')
        }
      }
      cb()
    },
    // 初始化
    init (highSearchList) {
      if (highSearchList.length > 0) {
        this.formData.items = highSearchList
      }
      this.drawer = true
    },
    // 提交按钮事件
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('setHighSearch', this.formData.items)
          this.drawer = false
        }
      })
    },
    // 表单数据重置
    resetForm (targetList) {
      this.formData.items = []
      targetList.forEach((item) => {
        if (item.type === 1) {
          this.formData.items.push({
            code: item.code,
            name: item.name,
            type: item.type,
            value: ''
          })
        } else {
          this.formData.items.push({
            code: item.code,
            name: item.name,
            type: item.type,
            value: {
              start: '',
              end: ''
            },
            date: ''
          })
        }
      })
    },
    // 表单状态重置
    reset () {
      this.$refs.form.resetFields()
      this.resetForm(this.targetList)
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
    .el-form-item{
      display: flex;
      align-items: center;
      position: relative;
      .number_start, .number_end{
        width: 108px;
      }
      .number_cut{
        padding: 0 10px;
      }
    }
    /deep/ .el-form-item__label{
      padding-left: 30px;
      padding-right: 0;
      text-align: right;
      line-height: 1;
      font-size: 12px;
    }
    /deep/ .el-form-item__content{
      margin-left: 20px!important;
      .el-form-item__error{
        left: 3px
      }
    }
    .el-input, .el-select{
      width: 540px;
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
