<template>
  <!--  社团信息列表-->
  <div class="enterprise_list table_wrap" ref="tableWrap">
    <div class="table_bar">
      <div class="fl form_box">
        <span class="form_label">{{this.belong === '1' ? '所属学院：': '占用资源：'}}</span>
        <el-select v-model="source" placeholder="请选择" :clearable="true">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in sourceLists"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="fr button_box">
        <el-button class="el-icon-download" type="primary" @click="handleExport">导出</el-button>
        <el-button class="el-icon-plus" type="primary" @click="handleEdit('add')">新增{{belong === '1' ? '社团': '活动'}}信息
        </el-button>
      </div>
    </div>
    <div class="table_content">
      <el-table
        :data="tableData"
        :max-height="maxTableHeight"
        :empty-text="emptyText"
        style="width: 100%">
        <el-table-column
          prop="index"
          label="序号"
          fixed
          width="60">
        </el-table-column>
        <el-table-column
          v-if="belong === '1'"
          prop="name"
          :label="fixColumnName.name"
          fixed
          width="200">
          <template slot-scope="scope">
            <span v-html="scope.row.name"></span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="belong === '2'"
          prop="name"
          :label="fixColumnName.name"
          fixed
          width="200">
          <template slot-scope="scope">
            <span v-html="scope.row.name"></span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="belong === '2'"
          prop="level"
          :label="fixColumnName.level"
          fixed
          width="200">
          <template slot-scope="scope">
            <span v-html="scope.row.level"></span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in columnLists"
          :key="index"
          :prop="item.code"
          :width="item.width"
          :label="item.name">
          <template slot-scope="scope">
            <!--<span v-html="scope.row[item.code]"></span>-->
            <!--需要所属资源NAME，而主表存的是是ID-->
            <span v-if="item.code === 'A000002' || item.code === 'A000005'">{{scope.row.sourceInfo.name}}</span>
            <!--其他指标值-->
            <span v-else v-html="scope.row[item.code]"></span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <span class="operation_button" @click="handleEdit('edit', scope.row)">编辑</span>
            <span class="operation_button" @click="handleDel(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <DownloadDialog :belong="belong" :searchKey="keyWord" :highSearchData="highSearchData" ref="downloadDialog"/>
    <OperationDrawer :belong="belong" :sourceLists="sourceLists" :columnLists="allTargetList" ref="operationDrawer"
                     @refresh="refresh"/>
  </div>
</template>

<script>
  import DownloadDialog from './DownloadDialog'
  import OperationDrawer from './OperationDrawer'

  export default {
    name: 'CenterManager',
    components: {
      DownloadDialog,
      OperationDrawer
    },
    props: ['belong'],
    data() {
      return {
        pageNo: 1,
        pageSize: 15,
        total: 0,
        sourceCount: 0, // 所属数量
        maxTableHeight: 100,
        keyWord: '',//未用
        source: '',//资源：所属学院/占用资源
        tableData: [],//动态属性值
        columnLists: [], // 动态表头项
        sourceLists: [], // 所有所属数据
        allTargetList: [], // 所有指标数据
        targetList: [], // 所有可被筛选的指标数据
        highSearchList: [], // 高级筛选组件返回的数据
        highSearchData: {
          sourceList: [],
          searchList: []
        },
        fixColumnName: { // 固定表头项的名称
          name: '',
          level: ''
        },
        files: {},
        loadFlag: false, // 表格数据是否加载完毕
        emptyText: ' ',
        fullscreenLoading: false
      }
    },
    computed: {
      showClearAll() {
        if (this.highSearchData.searchList.length === 0) {
          return false
        }
        const result = this.highSearchData.searchList.some((item) => {
          if (item.type !== 1) {
            return item.value.start !== '' || item.value.end !== ''
          } else {
            return item.value !== ''
          }
        })
        if (result) return true
        return false
      }
    },
    watch: {
      belong(newVal) {
        this.tableData = []
        this.columnLists = []
        this.sourceLists = []
        this.targetList = []
        this.highSearchList = []
        this.pageNo = 1
        this.total = 0
        this.sourceCount = 0
        this.highSearchData = {
          sourceList: [],
          searchList: []
        }
        this.keyWord = ''
        this.source = ''
        //获取所属学院/占用资源
        this.getsource()
        //获取表头
        this.getColumns()
        //获取表身
        this.getTableData('cover')
        //睡眠后运行
        /*setTimeout(this.getTableData('cover'), 500)*/
      },
      keyWord() {
        this.getTableData('cover')
      },
      source(newVal) {
        let sourceList = []
        if (newVal) {
          sourceList.push(newVal)
        }
        this.highSearchData.sourceList = sourceList
        this.getTableData('cover')
      }
    },
    methods: {
      // 导出
      handleExport() {
        this.$refs.downloadDialog.init()
      },
      // 新增、编辑
      handleEdit(type, row) {
        this.$refs.operationDrawer.init(type, row)
      },
      // 删除
      handleDel(row) {
        this.$confirm('是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.axios({
            method: 'get',
            url: '/admin/asscaiationOrActivity/delete',
            params: {
              id: row.id,
              belong: this.belong
            }
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功',
              offset: 90
            })
            this.refresh()
          })
        })
      },
      // 获取所有所属
      getsource() {
        const belong = this.belong
        this.axios({
          method: 'get',
          url: '/admin/source/queryList',
          params: {
            pageNo: 1,
            pageSize: 999,
            belong: this.belong
          }
        }).then((data) => {
          if (belong === this.belong) {  // 防止数据未加载完时切换菜单，造成数据错乱
            this.sourceLists = data.data
          }
        })
      },
      // 获取动态表头
      getColumns() {
        const belong = this.belong
        this.axios({
          method: 'get',
          url: '/admin/property/queryProperty',
          params: {
            pageNo: 1,
            pageSize: 999,
            belong: this.belong
          }
        }).then((data) => {
          if (belong === this.belong) {  // 防止数据未加载完时切换菜单，造成数据错乱
            this.targetList = []
            this.columnLists = []
            if (this.belong === '1') {
              data.data.forEach((item) => {
                if (data.data.length > 6) {
                  item.width = '150'
                }
                /*if (item.isSearch) {
                  this.targetList.push(item)
                }*/
                //不为社团名称固定项，就插入到columnLists
                if (item.code !== 'A000001') {
                  this.columnLists.push(item)
                } else {
                  this.fixColumnName.name = item.name
                }
              })
            } else {
              data.data.forEach((item) => {
                if (data.data.length > 7) {
                  item.width = '150'
                }
                if (item.isSearch) {
                  this.targetList.push(item)
                }
                //不为活动名称、规模固定项，就插入到columnLists
                if (item.code === 'A000004') {
                  this.fixColumnName.name = item.name
                } else if (item.code === 'A000006') {
                  this.fixColumnName.level = item.name
                } else {
                  this.columnLists.push(item)
                }
              })
            }
            this.allTargetList = data.data
          }
        })
      },
      // 获取列表数据 type = 'cover'列表数据重置否则列表数据叠加
      getTableData(type) {
        this.emptyText = ' '
        if (type === 'cover') {
          this.pageNo = 1
        }
        const belong = this.belong
        this.axios({
          method: 'post',
          url: '/admin/asscaiationOrActivity/queryList',
          data: {
            searchKey: this.keyWord,
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            belong: belong,
            highSearch: this.highSearchData
          }
        }).then((data) => {
          if (belong === this.belong) {  // 防止数据未加载完时切换菜单，造成数据错乱
            this.loadFlag = true
            data.data.list.forEach((item, index) => {
              item.index = (data.page.pageNo - 1) * data.page.pageSize + index + 1
              item.propertyList.forEach(innerItem => {
                item[innerItem.code] = innerItem.value
                //规模(级别)
                if (innerItem.code === 'A000006') {
                  item.level = innerItem.value
                }
              })
            })
            if (type === 'cover') {
              document.querySelector('.el-table__body-wrapper').scrollTop = 0
              this.tableData = data.data.list
            } else {
              this.tableData = this.tableData.concat(data.data.list)
            }
            if (this.tableData.length === 0) {
              this.emptyText = '暂无数据'
            }
            this.total = data.page.total
            this.sourceCount = data.data.sourceCount
          }
        })
      },
      // 滚动条滚到底部加载数据
      load() {
        const _this = this
        let dom = document.querySelector('.el-table__body-wrapper')
        dom.addEventListener('scroll', function () {
          let sign = 20
          const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
          if (scrollDistance <= sign) {
            if (_this.pageNo < Math.ceil(_this.total / _this.pageSize) && _this.loadFlag) {
              _this.loadFlag = false
              _this.pageNo++
              _this.getTableData()
            }
          }
        })
      },
      //刷新页面
      refresh() {
        this.getTableData('cover')
      }
    },
    mounted() {
      /*let timer = setInterval(() => {*/
      this.getsource()
      this.getColumns()
      this.getTableData()
      //更新完DOM操作DOM
      this.$nextTick(() => {
        let offsetHeight = this.$refs.tableWrap.offsetHeight;
        this.maxTableHeight = this.$refs.tableWrap.offsetHeight - 100/* 80 - 60 - 20*/;
        this.load()
      })
      /*clearInterval(timer)
    }, 100)*/
    }
  }
</script>

<style lang="less" scoped>
  .enterprise_list {
    height: 100%;
    padding: 0 20px 20px 40px;

    .form_box {
      .el-input {
        width: 200px;
      }

      .form_label {
        margin: 0 10px 0 20px;
      }
    }

    .button_box {
      .el-button {
        /deep/ span {
          margin-left: 5px;
        }
      }

      .el-icon-download,
      .el-icon-upload2 {
        width: 120px;
      }

      .upload_demo {
        display: inline-block;
        margin-left: 20px
      }
    }

    .message {
      margin-bottom: 20px;
      padding: 0 20px 0 25px;
      background: #EEF5FE;
      line-height: 40px;
    }
  }

  .high_search {
    margin-left: 20px;
    color: #599BF8;
    cursor: pointer;
  }
</style>
