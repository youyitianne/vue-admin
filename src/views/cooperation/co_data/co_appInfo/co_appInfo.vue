<template>
  <div class="app-container">
    <el-button @click="showAddApp()" style="margin-bottom: 20px">添加应用</el-button>
    <el-dialog
      :close-on-click-modal=false
      append-to-body
      width="500px"
      title="添加应用"
      :visible.sync="addAppDialogVisible">
      <el-form ref="AppInfo" :model="AppInfo" label-position="left" label-width="150px" :inline="true"
               style="margin-left:50px;" status-icon id="form-custom">
        <el-form-item label="应用名" :rules="{required: true, message: '应用名不能为空', trigger: 'blur'}"
                      prop="AppName">
          <el-input v-model="AppInfo.AppName" placeholder="请输入应用名~"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAppDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addApp()" :loading="adButtonLoading">添加应用</el-button>
      </div>
    </el-dialog>
    <template>
      <el-table
        :data="AppInfolist"
        stripe
        border
        height="750px"
        style="width: 100%">
        <el-table-column
          prop="app_id"
          label="appID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="app_name"
          label="应用名称"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          width="350">
          <template slot-scope="scope">
            <span><el-button @click="delAppInfo(scope.row)" type="info" :loading="delbuttonLoading">删除</el-button></span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="totalPages"
      :current-page="currentPage"
      @current-change="pageChange">
    </el-pagination>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {listAppMeth, addAppMeth,delAppMeth} from '@/api/cooperation/co_appInfo'

  export default {
    data() {
      return {
        delbuttonLoading:false,
        adButtonLoading: false,
        AppInfolist: [],
        creator: '',
        AppInfo: {},
        pageSize: 20,
        totalPages: 0,
        addAppDialogVisible: false,
        currentPage: 1,
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    mounted() {
      this.pageChange(1);
    },
    created() {
      this.creator = this.name
    },
    methods: {
      delAppInfo(param){
        console.log('删除参数',param)
        let tothis=this
        this.$confirm('确认删除吗？')
          .then(() => {
            tothis.delbuttonLoading=true
            delAppMeth(param).then(response=>{
              tothis.$notify({
                title: '成功',
                message: '删除应用信息成功',
                type: 'success',
                duration: 2000
              })
              tothis.delbuttonLoading=false
              tothis.pageChange(tothis.currentPage)
            }).catch(error=>{
              console.error(error)
              tothis.$notify({
                title: '失败',
                message: '请刷新页面后重试',
                type: 'error',
                duration: 2000
              })
              tothis.delbuttonLoading=false
            })
          }).catch(() => {});
      },//删除应用信息
      addApp() {
        this.$refs['AppInfo'].validate((valid) => {
          if (valid) {
            this.adButtonLoading = true
            let tothis = this
            let submitInfo = {
              appName: this.AppInfo.AppName,
            }
            console.log('添加的应用信息', submitInfo)
            addAppMeth(submitInfo).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '添加应用成功',
                  type: 'success',
                  duration: 2000
                })
                this.pageChange(this.currentPage)
                this.addAppDialogVisible = false;
              } else {
                tothis.$notify({
                  title: '失败',
                  message: '请刷新页面后重试',
                  type: 'error',
                  duration: 2000
                })
              }
              this.adButtonLoading = false
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '失败',
                message: '请刷新页面后重试',
                type: 'error',
                duration: 2000
              })
              this.adButtonLoading = false
            })
          }
        });

      },//添加应用
      showAddApp() {
        this.AppInfo = {}
        this.$nextTick(() => {
          this.$refs['AppInfo'].clearValidate()
        })
        this.addAppDialogVisible = true;
      },//展示添加应用对话框
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
        }
        listAppMeth(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.AppInfolist = response.data
            console.log("项目列表--------", this.AppInfolist)
            this.totalPages = response.total
          } else {
            tothis.$notify({
              title: '失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error => {
          this.listLoading = false
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//分页切换
      checkPermission
    }
  }
</script>

<style>
  .demo-table-expand label {
    width: 300px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    padding-left: 25px;
    margin-left: 10px;
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
    border-bottom: #d3dce6 solid 1px;
    border-left: #d3dce6 solid 1px;
  }

</style>
