<template>
  <div class="components-container" style="padding-top: 10px">
    <div style="margin-left: 50px">
      <span style="margin-left: 15px;margin-right: 5px">应用名:</span>
      <el-input v-model="appName" style="width: 200px" class="filter-item" clearable/>
      <span style="margin-left: 15px;margin-right: 5px">包名:</span>
      <el-input v-model="packageName" style="width: 200px" class="filter-item" clearable/>
      <el-button style="margin-left: 20px" @click="pageChange(1)">搜索
      </el-button>
    </div>
    <el-card shadow="always" style="margin: 20px">
      <el-table
        v-loading="tableLoading"
        height="700"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          v-if="checkPermission(['admin'])"
          width="50"
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          label="ICON"
          width="100px">
          <template slot-scope="scope">
          <span style="width: 100%"><img
            :src="iconPath+scope.row.icon" min-width="70" height="70"/></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="appName"
          label="应用名">
        </el-table-column>
        <el-table-column
          prop="channelName"
          label="渠道名">
        </el-table-column>
        <el-table-column
          prop="versionCode"
          label="版本号">
        </el-table-column>
        <el-table-column
          prop="packageName"
          label="包名">
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin'])"
          prop="appKey"
          label="友盟key">
        </el-table-column>
        <el-table-column
          prop="remindDate"
          label=通知时间>
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="remindState"-->
          <!--label="提醒状态">-->
        <!--</el-table-column>-->
        <el-table-column
          v-if="checkPermission(['1'])"
          prop="sdkguid"
          label="发布记录guid">
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['1'])"
          prop="configguid"
          label="配置表guid">
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
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {getRemindedAppMeth} from '@/api/table/sdkmanager/RemindedApp'

  export default {
    name: 'DropzoneDemo',
    data() {
      return {
        tableLoading:false,
        iconPath: 'http://filehost.tomatojoy.com/file?path=',
        uploadDialogVisible:false,
        pageSize:20,
        totalPages:0,
        currentPage:1,
        tableData: [],
        hidtableData: [],
        appName:'',
        packageName:'',
      }
    },
    mounted() {
      this.pageChange(1)
    },
    methods: {
      checkPermission,
      pageChange(page){
        this.currentPage=page
        let tothis=this
        let param={
          page:page,
          limit:this.pageSize,
          appName:this.appName,
          packageName:this.packageName
        }
        console.log('搜索应用参数',param)
        this.tableLoading=true
        getRemindedAppMeth(param).then(response=>{
          if(response.repcode===3000){
            console.log("已提醒应用列表",response.data)
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
          this.tableLoading=false
        }).catch(error=>{
          this.tableLoading=false
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


