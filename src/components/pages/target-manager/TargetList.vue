<template>
<!--  指标维护列表-->
  <div class="table_wrap" ref="tableWrap">
    <div class="table_bar">
      <el-button type="primary" class="el-icon-plus fr" @click="handleEdit('add')">新建指标</el-button>
    </div>
    <div class="table_content" v-infinite-scroll="load" :infinite-scroll-distance="20">
      <el-table
        :data="tableData"
        :max-height="maxTableHeight"
        :empty-text="emptyText"
        style="width: 100%">
        <el-table-column
          v-for="(item,index) in columnLists"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width">
        </el-table-column>
        <el-table-column
          width="340"
          label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.canEdit" class="operation_button" @click="handleEdit('edit', scope.row)">编辑</span>
            <span v-if="scope.row.canEdit" class="operation_button" @click="handleDel(scope.row)">删除</span>
            <span v-if="!scope.row.canEdit" class="default_message">默认项无法进行操作</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <OperationDrawer :belong="belong" ref="operationDrawer" @refresh="refresh"/>
  </div>
</template>

<script>
import OperationDrawer from './OperationDrawer'
export default {
  name: 'TargetList',
  props: ['belong'],
  components: {
    OperationDrawer
  },
  watch: {
    belong (newVal) {
      this.pageNo = 1
      this.tableData = []
      this.getTableData('cover')
    }
  },
  data () {
    return {
      pageNo: 1,
      pageSize: 15,
      total: 0,
      maxTableHeight: 100,
      tableData: [],
      columnLists: [{
        prop: 'index',
        label: '序号',
        width: '200'
      }, {
        prop: 'name',
        label: '指标名称',
        width: ''
      }],
      loadFlag: false, // 表格数据是否加载完毕
      emptyText: ' '
    }
  },
  methods: {
    // 编辑
    handleEdit (type, row) {
      this.$nextTick(() => {
        this.$refs.operationDrawer.init(type, row)
      })
    },
    // 删除
    handleDel (row) {
      this.$confirm('是否要删除此指标？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.axios({
          method: 'get',
          url: '/admin/property/delete',
          params: {
            id: row.id
          }
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功！',
            offset: 90
          })
          this.pageNo = 1
          this.getTableData('cover')
        })
      })
    },
    // 获取列表数据 type = 'cover'列表数据重置否则列表数据叠加
    getTableData (type) {
      this.emptyText = ' '
      this.axios({
        method: 'get',
        url: '/admin/property/queryProperty',
        params: {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          belong: this.belong
        }
      }).then((data) => {
        this.loadFlag = true
        data.data.forEach((item, index) => {
          item.index = (data.page.pageNo - 1) * data.page.pageSize + index + 1
        })
        if (type === 'cover') {
          document.querySelector('.el-table__body-wrapper').scrollTop = 0
          this.tableData = data.data
        } else {
          this.tableData = this.tableData.concat(data.data)
        }
        if (this.tableData.length === 0) {
          this.emptyText = '暂无数据'
        }
        this.total = data.page.total
      })
    },
    // 滚动条滚到底部加载数据
    load () {
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
    refresh () {
      this.pageNo = 1
      this.getTableData('cover')
    }
  },
  mounted () {
    this.getTableData()
    this.$nextTick(() => {
      this.maxTableHeight = this.$refs.tableWrap.offsetHeight - 80 - 20;
      this.load()
    })
    const _this =this
    window.onresize = function () {
        _this.maxTableHeight = _this.$refs.tableWrap.offsetHeight - 80 - 60 - 20;
    }
  }
}
</script>

<style scoped>
.default_message{
  color: #666;
}
</style>
