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
      <el-form ref="form" :model="formData" :rules="rules" label-width="240px">
<!--        固定表单项-->
        <el-form-item :label="fixColumnName.name" prop="name">
          <el-input v-model.trim="formData.name" maxLength="50" placeholder="50个字以内"></el-input>
        </el-form-item>
        <el-form-item :label="fixColumnName.industry" prop="industry">
          <el-select v-model="formData.industry" placeholder="请选择">
            <el-option
              v-for="item in industryLists"
              :key="item.id"
              :clearable="true"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="belong === '2'"
          :label="fixColumnName.level"
          prop="level"
          :rules="[
                { required: true, message: '请输入'+fixColumnName.level, trigger: 'blur' },
                ]"
        >
          <el-input v-model.trim="formData.level" maxLength="50" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item :label="fixColumnName.address" prop="address">
          <el-input v-model="formData.address" readonly placeholder="请选择地图对应位置" @click.native="openMap" suffix-icon="el-icon-location"></el-input>
        </el-form-item>
<!--        动态表单项-->
        <template v-for="(item,index) in this.formData.items">
          <el-form-item
            v-if="item.type === 1"
            :key="index"
            :label="item.name">
            <el-input type="textarea" :autosize="{ minRows: 2}" v-model="item.value" maxLength="300" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item
            v-if="item.type === 2"
            :key="index"
            :label="item.name"
            :prop="'items.' + index + '.value'"
            :rules="[
                { pattern: /^\d+\.?\d{0,2}$/, message: '只能输入数字，可以有两位小数', trigger: 'blur' },
                ]"
          >
            <el-input v-model.trim="item.value" maxLength="13"></el-input>
          </el-form-item>
          <el-form-item
            v-if="item.type === 3"
            :key="index"
            :label="item.name"
            :prop="'items.' + index + '.value'"
          >
            <el-date-picker
              v-model="item.value"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </template>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="reset">取 消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </div>
    <MapDialog ref="mapDialog" @setAddress="setAddress"/>
  </el-drawer>
</template>

<script>
import MapDialog from './MapDialog'
export default {
  name: 'OperationDrawer',
  components: {
    MapDialog
  },
  props: ['belong', 'industryLists', 'columnLists'],
  data () {
    return {
      dialogType: '',
      currentRowData: {},
      title: '',
      drawer: false,
      direction: 'rtl',
      fixColumnName: { // 固定表单项的名称
        address: '',
        industry: '',
        name: '',
        level: '',
      },
      formData: {
        name: '',
        industry: '',
        address: '',
        level: '',
        items: []
      },
      lngLat: [],
      rules: {
        name: [
          { required: true, message: '50个字以内', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择所属所属', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请选择地址', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 初始化
    init (type, row) {
      this.dialogType = type
      let titleEnd = '社团信息'
      this.currentRowData = {}
      if (this.belong === '2') {
        titleEnd = '活动信息'
      }
      this.lngLat = []
      this.title = '新增' + titleEnd
      if (type === 'edit') {
        this.title = '编辑' + titleEnd
        this.currentRowData = row
        if (row.lng && row.lat) {
          this.lngLat = [row.lng, row.lat]
        }
      }
      this.resetForm(this.columnLists)
      this.drawer = true
    },
    // 打开地图
    openMap () {
      this.$refs.mapDialog.init(this.formData.address, this.lngLat)
    },
    // 获取地址
    setAddress (address, lngLat) {
      this.formData.address = address
      this.lngLat = lngLat
    },
    // 提交按钮事件
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let url = '/admin/enterprisOrOrgan/addOrEdit'
          let message = '新增成功！'
          let data = {
            belong: Number(this.belong),
            lat: this.lngLat[1],
            lng: this.lngLat[0],
            propertyList: []
          }
          // 社团、活动名称
          data.propertyList.push({
            code: this.belong === '1' ? 'A000001' : 'A000004',
            value: this.formData.name,
            type: 1
          })
          // 社团、活动所属
          data.propertyList.push({
            code: this.belong === '1' ? 'A000002' : 'A000005',
            value: this.formData.industry,
            type: 1
          })
          // 社团、活动地址
          data.propertyList.push({
            code: this.belong === '1' ? 'A000003' : 'A000007',
            value: this.formData.address,
            type: 1
          })
          // 活动网点名称
          if (this.formData.level) {
            data.propertyList.push({
              code: 'A000006',
              value: this.formData.level,
              type: 1
            })
          }
          this.formData.items.forEach(item => {
            data.propertyList.push({
              code: item.code,
              value: item.value ? item.value.replace(/\n|\r/g, '<br/>') : '',
              type: item.type
            })
          })
          if (this.dialogType === 'edit') {
            message = '编辑成功！'
            data.id = this.currentRowData.id
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
    // 表单数据重置
    resetForm (targetList) {
      this.formData.name = ''
      this.formData.address = ''
      this.formData.industry = ''
      this.formData.level = ''
      this.formData.items = []
      targetList.forEach(item => {
        if (item.code !== 'A000001' && item.code !== 'A000002' && item.code !== 'A000003' && item.code !== 'A000004' && item.code !== 'A000005' && item.code !== 'A000006' && item.code !== 'A000007') {
          this.formData.items.push({
            code: item.code,
            name: item.name,
            type: item.type,
            value: this.currentRowData[item.code] ? this.currentRowData[item.code].replace(/<br\s*\/?>/gi,'\n') : ''
          })
        }
          if (item.code === 'A000003' || item.code === 'A000007') {
            this.fixColumnName.address = item.name
            if (this.dialogType === 'edit') {
              this.formData.address = this.currentRowData[item.code].replace(/<br\s*\/?>/gi,'')
            }
          }
          if (item.code === 'A000002' || item.code === 'A000005') {
            this.fixColumnName.industry = item.name
            if (this.dialogType === 'edit') {
              this.formData.industry = this.currentRowData[item.code]
            }
          }
          if (item.code === 'A000001' || item.code === 'A000004') {
            this.fixColumnName.name = item.name
            if (this.dialogType === 'edit') {
              this.formData.name = this.currentRowData[item.code].replace(/<br\s*\/?>/gi,'')
            }
          }
          if (item.code === 'A000006') {
            this.fixColumnName.level = item.name
            if (this.dialogType === 'edit') {
              this.formData.level = this.currentRowData[item.code].replace(/<br\s*\/?>/gi,'')
            }
          }
      })
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 表单状态重置
    reset () {
      this.resetForm(this.columnLists)
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
      }
      /deep/ .el-form-item__label{
        padding-left: 30px;
        text-align: right;
        line-height: 14px;
        font-size: 12px;
      }
      /deep/ .el-form-item__content{
        margin-left: 0px!important;
        .el-form-item__error{
          left: 3px
        }
      }
      .el-input, .el-select, .el-input-number, .el-textarea{
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
