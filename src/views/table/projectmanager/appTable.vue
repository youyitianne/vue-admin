<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">{{addButton}}
      </el-button>
      <el-input placeholder="根据应用名查找" v-model="inputName" style="width: 200px" class="filter-item" clearable @blur="getDatawithName"/>
      <el-input placeholder="根据项目名查找" v-model="projectName" style="width: 200px" class="filter-item" clearable @blur="getDatawithName"/>
    </div>
    <el-table
      height="850"
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


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="app" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="应用名" v-if="this.dialogStatus === 'update'">
          <el-input v-model="app.name" placeholder="请输入游戏名字~" disabled/>
        </el-form-item>
        <el-form-item label="应用名" v-if="this.dialogStatus === 'create'">
          <el-input v-model="app.name" placeholder="请输入游戏名字~" />
        </el-form-item>


        <el-form-item label="项目">
          <!--<el-input v-model="app.project" placeholder="比如别称~"/>-->
          <el-select v-model="app.project" placeholder="请选择" filterable value-key="project_name">
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
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ '219' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getApp, createApp, updateApp, deleteApp,getProject} from '@/api/table/projectmanager/appTable'
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
        projectName:'',
        projectlist:[],
        create_flag:true,
        update_flag:true,
        inputName:'',
        hidlist:[],
        introduce: '介绍',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        addButton:'添加应用',
        directives: {waves},
        downloadLoading: false,
        layout: '',
        timevalue: '',
        searchName: '搜索',
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        importanceOptions: [1, 2, 3],
        names: [],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
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
        rules: {
          title: [{required: true, message: '必须有名字！', trigger: 'blur'}]
        },
        dialogPvVisible: false,
        pvData: [],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
      }
    },
    mounted() {
      this.handleFilter();
      this.initProjectList();
    },
    methods: {
      initProjectList(){
        getProject().then(response => {
          this.projectlist=response.data
        })
      },//初始化项目列表
      createData() {
        for (let i=0;i<this.hidlist.length;i++){
          if (this.hidlist[i].name===this.app.name) {
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
        let tothis=this
        if (!this.create_flag) {
          return
        }
        this.create_flag=false
        createApp(this.app).then(() => {
          this.handleFilter();
          this.list.unshift(this.app)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          tothis.create_flag=true
        }).catch(function (rs) {
          tothis.dialogFormVisible = false
          tothis.$notify({
            title: '失败',
            message: '请稍后重试'+rs,
            type: 'error',
            duration: 2000
          })
          tothis.create_flag=true
        })
      },//创建应用
      updateData() {
        let tothis=this
        const tempData = Object.assign({}, this.app)
        if (tempData.project === '' || tempData.name === '' || tempData.icon === '' || tempData.system === '') {
          this.open3()
          return
        }
        if (!this.update_flag){
          return
        }
        this.update_flag=false
        updateApp(tempData).then(() => {
          this.dialogFormVisible = false
          this.handleFilter();
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          tothis.update_flag=true
        }).catch(function (rs) {
          tothis.$notify({
            title: '失败',
            message: '请稍后重试'+rs,
            type: 'error',
            duration: 2000
          })
          tothis.update_flag=true
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
        let tothis=this
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteApp(row).then(() => {
            this.handleFilter();
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
          project: '无',
        }
      },
      open3() {
        this.$message({
          message: '记得选择查询范围~',
          type: 'warning'
        });
      },
      open4() {
        this.$message({
          message: '没有信息可以打印~',
          type: 'warning'
        });
      },
      handleFilter() {
        this.listLoading=true
        let tothis=this;
        getApp().then(response => {
          this.hidlist = response.data
          this.list = response.data
          this.listLoading = false
        }).catch(function (rs) {
          console.log(rs)
          this.listLoading = false
        })
      },
      getDatawithName(){
        this.listLoading=true
        let param=this.inputName
        let data=[]
        if (param===''){
          data=this.hidlist;
        }else {
          for (let i=0;i<this.hidlist.length;i++){
            if (this.hidlist[i].name.search(param)!==-1){
              data.push(this.hidlist[i])
            }
          }
        }

        let project=this.projectName
        let data1=[]
        if (project===''){
          this.list = data
          this.listLoading=false
        } else {
          for (let i=0;i<data.length;i++){
            if (data[i].project.search(project)!==-1){
              data1.push(data[i])
            }
          }
          this.list = data1
          this.listLoading=false
        }


      },//根据关键词筛选
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
