<template>
  <!--  社团信息列表-->
  <div class="enterprise_list table_wrap" ref="tableWrap">
    <div class="table_bar">
      <div class="fl form_box">
        <!--<el-input prefix-icon="el-icon-search" v-model.trim="keyWord" :clearable="true"
                  placeholder="请输入关键词进行搜索"></el-input>-->
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
        <!--<span class="high_search" @click="highSearch">高级筛选</span>-->
      </div>
      <div class="fr button_box">
        <el-button class="el-icon-download" type="primary" @click="handleExport">导出</el-button>
        <el-button class="el-icon-plus" type="primary" @click="handleEdit('add')">新增{{belong === '1' ? '社团': '活动'}}信息
        </el-button>
        <!--<el-upload
          class="upload_demo"
          ref="upload"
          action=""
          accept=".xls"
          :multiple="false"
          :show-file-list="false"
          :on-change="handleChange"
          :http-request="handleUpload"
        >
          <el-button
            slot="trigger"
            type="primary"
            class="upload
              el-icon-upload2"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="正在导入中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
          >
            批量导入
          </el-button>
        </el-upload>-->
      </div>
    </div>
    <!--<div class="message">此分类下共{{total}}个{{belong === '1' ? '社团': '活动'}}，{{sourceCount}}个所属 <span
      class="fr high_search" @click="clearAll" v-if="showClearAll">清空高级筛选</span></div>-->
    <!--    <div class="table_content" v-infinite-scroll="load" :infinite-scroll-distance="20">-->
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
    <!--<UploadResult :belong="belong" ref="uploadResult" @refresh="refresh"/>-->
    <DownloadDialog :belong="belong" :searchKey="keyWord" :highSearchData="highSearchData" ref="downloadDialog"/>
    <!--<HighSearch :targetList="targetList" :sourceLists="sourceLists" @setHighSearch="setHighSearch"
                ref="highSearch"/>-->
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
      /*UploadResult,*/
      DownloadDialog,
      /*HighSearch,*/
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
        keyWord: '',
        source: '',
        tableData: [],
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
        this.getsource()
        this.getColumns()
        /*this.getTableData('cover')*/
        //睡眠后运行
        setTimeout(this.getTableData('cover'), 500)
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
      /*// 高级筛选
      highSearch() {
        if (this.targetList.length > 0) {
          this.$refs.highSearch.init(this.highSearchList)
        } else {
          this.$message({
              type: 'error',
              message: '暂无可用筛选项',
              offset: 90
            }
          )
        }
      },*/
      /*// 设置高级筛选
      setHighSearch(data) {
        this.highSearchList = data
        this.highSearchData.searchList = []
        data.forEach((item) => {
          if (item.type === 3) {
            this.highSearchData.searchList.push({
              code: item.code,
              type: item.type,
              value: {
                start: item.date[0] ? item.date[0] : '',
                end: item.date[1] ? item.date[1] : ''
              }
            })
          } else {
            this.highSearchData.searchList.push({
              code: item.code,
              type: item.type,
              value: item.value
            })
          }
        })
        this.getTableData('cover')
      },
      // 清空高级筛选
      clearAll() {
        this.highSearchList = []
        this.highSearchData.searchList = []
        this.$refs.highSearch.resetForm(this.targetList)
        this.getTableData('cover')
      },*/
      // 导出
      handleExport() {
        this.$refs.downloadDialog.init()
      },
      /*// 选择文件
      handleChange(file) {
        this.files = file.raw
      },*/
      /*// 获取导入进度
      queryImportState(token) {
        this.axios({
          method: 'get',
          url: '/admin/asscaiationOrActivity/queryImportState',
          params: {
            token: token,
          }
        }).then(({data}) => {
          if (data.finish) {
            /!*this.$refs.uploadResult.init(data)*!/
            this.fullscreenLoading = false;
          } else {
            setTimeout(() => {
              this.queryImportState(token)
            }, 1000)
          }
        }).catch(() => {
          this.fullscreenLoading = false;
        })
      },*/
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
          console.log(JSON.stringify(data));
          //console.log(JSON.stringify(data.data.list[0]));
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
      let count = 0
      let timer = setInterval(() => {

        if (sessionStorage.getItem('token')) {
          this.getsource()
          this.getColumns()
          this.getTableData()
          this.$nextTick(() => {
            this.maxTableHeight = this.$refs.tableWrap.offsetHeight - 80 - 60 - 20;
            this.load()
          })
          clearInterval(timer)
        } else {
          count++
        }
        if (count >= 10) {
          this.getsource()
          this.getColumns()
          this.getTableData()
          this.$nextTick(() => {
            this.maxTableHeight = this.$refs.tableWrap.offsetHeight - 80 - 60 - 20;
            this.load()
          })
          clearInterval(timer)
        }
      }, 100)
      const _this = this
      window.onresize = function () {
        _this.maxTableHeight = _this.$refs.tableWrap.offsetHeight - 80 - 60 - 20;
      }
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
