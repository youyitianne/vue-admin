<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;margin-right: 20px" type="primary" icon="el-icon-edit"
                 @click="handleCreate">{{addButton}}
      </el-button>
      <el-input placeholder="根据应用名查找" v-model="secondary_appName" style="width: 200px" class="filter-item" clearable/>
      <el-input placeholder="根据项目名查找" v-model="secondary_projectName" style="width: 200px" class="filter-item" clearable/>
      <el-button class="filter-item" style="margin-left: 10px;margin-right: 20px" @click="searchApp">搜索</el-button>
    </div>
    <el-table
      height="720"
      stripe
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope" prop="id">
          {{ ++scope.$index }}
        </template>
      </el-table-column>
      <!--<el-table-column label="id" width="110" style="display: none">-->
      <!--<template slot-scope="scope">-->
      <!--{{ scope.row.id }}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="应用名" width="250" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="项目" prop="advertising_type" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.project }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台" width="250  " align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.system }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ '编辑' }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ '删除' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="totalPages"
      :current-page="currentPage"
      @current-change="pageChange">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="app" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="应用名" v-if="this.dialogStatus === 'update'">
          <el-input v-model="app.name" placeholder="请输入游戏名字~" disabled/>
        </el-form-item>
        <el-form-item label="应用名" v-if="this.dialogStatus === 'create'">
          <el-input v-model="app.name" placeholder="请输入游戏名字~"/>
        </el-form-item>
        <el-form-item label="项目">
          <!--<el-input v-model="app.project" placeholder="比如别称~"/>-->
          <el-select v-model="app.project" placeholder="请选择" value-key="project_name" filterable>
            <el-option
              v-for="item in projectlist"
              :key="item.project_name"
              :label="item.project_name"
              :value="item.project_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台">
          <el-input v-model="app.system" placeholder="默认填写安卓~"/>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="app.icon" placeholder="暂无此功能~" value="无"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消'}}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ '确认' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getApp, createApp, updateApp, deleteApp, getProject,getProjectLimitMeth} from '@/api/table/projectmanager/appTable'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    components: {Pagination},
    directives: {waves},
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        pageSize:20,
        totalPages:0,
        currentPage:1,
        projectlist: [],
        create_flag: true,
        update_flag: true,
        hidlist: [],
        addButton: '添加应用',
        directives: {waves},
        layout: '',
        list: null,
        total: 0,
        listLoading: false,
        dialogStatus: '',
        dialogFormVisible: false,
        app: {
          id: undefined,
          name: undefined,
          system: undefined,
          icon: undefined,
          project: undefined,
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        secondary_appName:'',
        secondary_projectName:''
      }
    },
    mounted() {
      this.pageChange(1);
      this.initProjectList();

    },
    methods: {
      searchApp(){
        this.currentPage=1
        this.pageChange(1)
      },
      pageChange(page){
        this.currentPage=page
        let tothis=this
        let param={
          page:page,
          limit:this.pageSize,
          appName:this.secondary_appName,
          projectName:this.secondary_projectName
        }
        getProjectLimitMeth(param).then(response=>{
          if(response.repcode===3000){
            console.log(response.data)
            this.totalPages=response.total
            this.hidlist=response.data
            this.list = response.data
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
      initProjectList() {
        getProject().then(response => {
          this.projectlist = response.data
        })
      },//初始化项目列表
      createData() {
        for (let i = 0; i < this.hidlist.length; i++) {
          if (this.hidlist[i].name === this.app.name) {
            this.$message({
              message: '该应用已存在~',
              type: 'warning'
            });
            return
          }
        }
        if (this.app.project === '' || this.app.name === '' || this.app.icon === '' || this.app.system === '') {
          this.open3()
          return
        }
        let tothis = this
        if (!this.create_flag) {
          return
        }
        this.create_flag = false
        createApp(this.app).then(() => {
          this.pageChange(this.currentPage);
          this.list.unshift(this.app)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          tothis.create_flag = true
        }).catch(function (rs) {
          tothis.dialogFormVisible = false
          tothis.$notify({
            title: '失败',
            message: '请稍后重试' + rs,
            type: 'error',
            duration: 2000
          })
          tothis.create_flag = true
        })
      },//创建应用
      updateData() {
        let tothis = this
        const tempData = Object.assign({}, this.app)
        if (tempData.project === '' || tempData.name === '' || tempData.icon === '' || tempData.system === '') {
          this.open3()
          return
        }
        if (!this.update_flag) {
          return
        }
        this.update_flag = false
        updateApp(tempData).then(() => {
          this.dialogFormVisible = false
          this.pageChange(this.currentPage);
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          tothis.update_flag = true
        }).catch(function (rs) {
          tothis.$notify({
            title: '失败',
            message: '请稍后重试' + rs,
            type: 'error',
            duration: 2000
          })
          tothis.update_flag = true
        })
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.app = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleDelete(row) {
        let tothis = this
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteApp(row).then(() => {
            this.pageChange(this.currentPage);
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          }).catch(function (rs) {
            tothis.$notify({
              title: '失败',
              message: '请稍后重试',
              type: 'error',
              duration: 2000
            })
          })
        });
      },
      resetTemp() {
        this.app = {
          id: undefined,
          name: '',
          system: '安卓',
          icon: '无',
          project: this.projectlist[0].project_name,
        }
      },
      open3() {
        this.$message({
          message: '记得选择查询范围~',
          type: 'warning'
        });
      },

      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      open3() {
        this.$message({
          message: '内容不能为空~',
          type: 'warning'
        });
      },
    }
  }
</script>
