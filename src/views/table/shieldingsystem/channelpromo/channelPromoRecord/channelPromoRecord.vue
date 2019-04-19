<template>
  <div class="components-container">
    <el-card shadow="always" style="margin: 20px">
      <el-table
        height="780"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          width="80"
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="promoName"
          label="应用名">
        </el-table-column>
        <el-table-column
          prop="channelPackage"
          label="渠道包名">
        </el-table-column>
        <el-table-column
          prop="channelRule"
          label="跳转规则">
        </el-table-column>
        <el-table-column
          prop="promoPackageName"
          label="互推包名">
        </el-table-column>
        <el-table-column
          prop="promoIconUrl"
          label="互推图片链接">
        </el-table-column>
        <el-table-column
          width="80"
          prop="promoValue"
          label="权重">
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalPages"
        @current-change="pageChange">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
  import {getToken} from '@/utils/auth'
  import {uploadFodder, listFodder} from '@/api/shieldingsystem/channelPromo'
  import {getPromoChannel, addPromoChannel, editPromoChannel} from '@/api/shieldingsystem/promoChannel'
  import {listChannelPromoRecordMeth,listChannelPromoRecordLimitMeth} from '@/api/shieldingsystem/channelPromoRecord'


  export default {
    name: 'DropzoneDemo',
    data() {
      return {
        pageSize:20,
        totalPages:0,
        currentPage:1,
        tableData: [],
        hidtableData: [],
      }
    },
    mounted() {
        this.pageChange(1)
    },
    methods: {
      initTable() {
        listChannelPromoRecordMeth().then(response => {
          if (response.repcode === 3000) {
            this.hidtableData = response.data
            this.totalPages=response.data.length
            this.pageChange(1)
          } else {
            this.$message({
              message: '表格初始化失败！',
              type: 'warning'
            });
          }
        }).catch(error => {
          this.$message({
            message: '表格初始化失败！',
            type: 'warning'
          });
        })
      },
      pageChange(page){
        this.currentPage=page
        let tothis=this
        let param={
          page:page,
          limit:this.pageSize,
        }
        listChannelPromoRecordLimitMeth(param).then(response=>{
          if(response.repcode===3000){
            this.tableData=response.data
            this.totalPages=response.total
          }else {
            tothis.$notify({
              title: '失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error=>{
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//分页切换
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dia-input {
    width: 300px;
  }

  .filter_input {
    margin-right: 15px;
  }

  .filter_text {
    margin-right: 7px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 14px Base
  }

  #filter_title {
    margin-right: 40px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 13px Small;
  }

  .ts-title {
    font-size: 15px;
    font-weight: bolder
  }
</style>


