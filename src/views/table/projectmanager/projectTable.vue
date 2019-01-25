<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px" v-if="checkPermission(['operator', 'planner','admin','leader','market'])">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">{{addButton}}
      </el-button>
      <!--<el-input placeholder="根据项目名查找" v-model="inputName" style="width: 200px" class="filter-item" clearable-->
                <!--@blur="getDatawithName"/>-->
    </div>
    <el-table
      height="850"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :expand-row-keys="expands"
      :row-key='getRowKeys'
      fit
      stripe
      border
      @expand-change="expandrowhandler"
      highlight-current-row>
      <el-table-column type="expand" label="展开" width="100px">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="项目名:">
              <span>{{ props.row.project_name }}</span>
            </el-form-item>
            <el-form-item label="预热:">
              <span>{{ props.row.preheat }}</span>
            </el-form-item>
            <el-form-item label="排期:">
              <span>{{ props.row.schedule }}</span>
            </el-form-item>
            <el-form-item label="竞品:">
              <span>{{ props.row.compete_good }}</span>
            </el-form-item>
            <el-form-item label="版本计划:">
              <span>{{ props.row.version_plan }}</span>
            </el-form-item>
            <el-form-item label="备注:">
              <span>{{ props.row.note }}</span>
            </el-form-item>
            <div style="padding-top: 15px">
              <el-table
                stripe
                border
                :data="props.row.applist"
                style="width: 100%;margin-bottom: 30px">
                <el-table-column
                  prop="app_name"
                  label="应用名"
                  style="width: 15%">
                </el-table-column>
                <el-table-column
                  prop="channel"
                  label="渠道"
                  style="width: 15%">
                </el-table-column>
                <el-table-column
                  label="链接"
                  style="width: 25%">
                  <template slot-scope="scope2">
                    <el-button @click="linkhandler(scope2.row)">查看key表</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope1">
          {{ ++scope1.$index }}
        </template>
      </el-table-column>
      <el-table-column label="项目名" prop="project_name">
      </el-table-column>
      <el-table-column label="预热" prop="preheat">
      </el-table-column>
      <el-table-column label="排期" prop="schedule">
      </el-table-column>
      <el-table-column label="竞品" prop="compete_good">
      </el-table-column>
      <el-table-column label="版本计划" prop="version_plan">
      </el-table-column>
      <el-table-column label="备注" prop="note">
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width"  v-if="checkPermission(['operator', 'planner','admin','leader','market'])">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="updateHandler(scope.row)">{{ "编辑" }}</el-button>
          <div v-if="checkPermission(['admin'])">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)" >{{ "删除" }}</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :model="project" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="项目名" :rules="{required: true, message: '项目名不能为空', trigger: 'blur'}"  v-if="dialogStatus==='update'"
                      prop="project_name">
          <el-input v-model="project.project_name" placeholder="请输入项目名~" disabled/>
        </el-form-item>
        <el-form-item label="项目名" :rules="{required: true, message: '项目名不能为空', trigger: 'blur'}" v-if="dialogStatus==='create'"
                      prop="project_name">
          <el-input v-model="project.project_name" placeholder="请输入项目名~"/>
        </el-form-item>
        <el-form-item label="预热" :rules="{required: true, message: '预热名不能为空', trigger: 'blur'}" prop="preheat">
          <el-input v-model="project.preheat"/>
        </el-form-item>
        <el-form-item label="排期" :rules="{required: true, message: '排期名不能为空', trigger: 'blur'}" prop="schedule">
          <el-input v-model="project.schedule"/>
        </el-form-item>
        <el-form-item label="竞品" :rules="{required: true, message: '竞品不能为空', trigger: 'blur'}" prop="compete_good">
          <el-input v-model="project.compete_good"/>
        </el-form-item>
        <el-form-item label="版本计划" :rules="{required: true, message: '版本计划不能为空', trigger: 'blur'}" prop="version_plan">
          <el-input v-model="project.version_plan"/>
        </el-form-item>
        <el-form-item label="备注" :rules="{required: true, message: '备注不能为空', trigger: 'blur'}" prop="note">
          <el-input v-model="project.note"/>
        </el-form-item>
        <el-button @click="addDomain">新增应用</el-button>
        <el-form-item
          style="margin-top: 15px;width: 400px"
          v-for="(domain, index) in project.applist"
          :label="'应用名'"
          :key="domain.key">
          <div style="width: 600px">
            <el-select v-model="domain.app_name" placeholder="请选择" style="width: 150px">
              <el-option
                v-for="item in app_name_list"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <span style="font-weight: bolder">渠道：</span>
            <el-select v-model="domain.channel" placeholder="请选择" style="width: 150px">
              <el-option
                v-for="item in channel_list"
                :key="item.name"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </div>
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
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {getName, getChannel,getProject,createProject,updateProject,deleteProject} from '@/api/table/projectmanager/projectTable'
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
        channel_list: [],
        app_name_list: [],
        expands: [],
        getRowKeys(row) {
          return row.id
        },
        create_flag: true,
        update_flag: true,
        inputName: '',
        hidlist: [],
        introduce: '介绍',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        addButton: '创建项目',
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
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        dialogStatus: '',
        dialogFormVisible: false,
        project: {
          project_name: undefined,
          preheat: undefined,
          schedule: undefined,
          compete_good: undefined,
          version_plan: undefined,
          note: undefined,
          applist: [{
            app_name: '',
            channel: ''
          }],
        },
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          title: [{required: true, message: '必须有名字！', trigger: 'blur'}]
        },
        pvData: [],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
      }
    },
    mounted() {
      this.handleFilter();
      this.fetchname();
      this.fetchchannel();
    },
    methods: {
      fetchchannel() {
        if (!this.checkPermission(['operator', 'planner','admin','leader'])){
          return
        }
        let tothis = this
        this.listLoading = true
        getChannel().then(response => {
          this.channel_list = response.data
        }).catch(function (rs) {
          tothis.listLoading = false
          tothis.$notify({
            title: '',
            message: '渠道列表获取失败',
            type: 'error',
            duration: 2000
          })
        })
      },//获取渠道名列表
      fetchname() {
        let tothis = this
        this.listLoading = true
        getName().then(response => {
          this.app_name_list = response.data
          this.listLoading = false
        }).catch(function (rs) {
          tothis.listLoading = false
          tothis.$notify({
            title: '',
            message: '应用列表获取失败',
            type: 'error',
            duration: 2000
          })
        })
      },//获取应用名列表
      removeDomain(item) {
        var index = this.project.applist.indexOf(item)
        if (index !== -1) {
          this.project.applist.splice(index, 1)
        }
      },//删除应用
      addDomain() {
        this.project.applist.push({
          app_name: '',
          channel: '',
          key: Date.now()
        });
      },//添加应用
      linkhandler(val) {
        let routeData = this.$router.resolve({name: 'ProjectConfigList', query: {app_name: val.app_name,channel:val.channel}});
        window.open(routeData.href, '_blank');
      },//跳转方法
      expandrowhandler(row, expandedRows) {
        let that = this
        if (expandedRows.length) {
          that.expands = []
          if (row) {
            that.expands.push(row.id)
          }
        } else {
          that.expands = []
        }
        if (expandedRows.length < 1) {
          return
        }
        let index = expandedRows.length - 1
      },//展开行变化时触发
      createData() {
        let tothis=this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let flag=true
            let list=this.project.applist
            for (let i=0;i<list.length;i++){
              if (list[i].app_name==''){
                flag=false
                tothis.$notify({
                  title: '警告',
                  message: '第'+(i+1)+'个应用的应用名未选择！',
                  type: 'warning'
                });
                return
              }
             if (list[i].channel==''){
               flag=false
               tothis.$notify({
                 title: '警告',
                 message: '第'+(i+1)+'个应用的渠道未选择！',
                 type: 'warning'
               });
               return
             }
            }
            if (flag){
              createProject(this.project).then(response => {
                if (response.data==='ok') {
                  this.dialogFormVisible = false
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                }else if (response.data==='repeat'){
                  this.$notify({
                    title: '注意',
                    message: '项目名重复请修改！',
                    type: 'warning',
                    duration: 2000
                  })
                }
              }).catch(function (rs) {
                tothis.$notify({
                  title: '失败',
                  message: '请稍后重试',
                  type: 'error',
                  duration: 2000
                })
                console.error(rs.toString())
              })

            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },//创建方法
      updateData() {
        let tothis=this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let flag=true
            let list=this.project.applist
            for (let i=0;i<list.length;i++){
              if (list[i].app_name==''){
                flag=false
                tothis.$notify({
                  title: '警告',
                  message: '第'+(i+1)+'个应用的应用名未选择！',
                  type: 'warning'
                });
                return
              }
              if (list[i].channel==''){
                flag=false
                tothis.$notify({
                  title: '警告',
                  message: '第'+(i+1)+'个应用的渠道未选择！',
                  type: 'warning'
                });
                return
              }
            }
            if (flag){
              updateProject(this.project).then(() => {
                this.handleFilter();
                this.dialogFormVisible=false
                this.$notify({
                  title: '成功',
                  message: '更新成功',
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
                console.error(rs.toString())
              })
            }
          } else {
            return false;
          }
        })
      },//更新方法
      handleDelete(row) {
        let tothis = this
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProject(row).then(() => {
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
      },//删除方法
      handleFilter() {
        this.listLoading = true
        getProject().then(response => {
          this.hidlist = response.data
          this.list = response.data
          this.listLoading = false
        }).catch(function (rs) {
          console.log(rs)
          this.listLoading = false
        })
      },//查询方法
      updateHandler(val){
        this.dialogStatus='update'
        this.dialogFormVisible=true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.project=val
      },//更新对话框展示
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },//创建对话框展示
      resetTemp() {
        this.project = {
          project_name: '',
          preheat: '暂无',
          schedule: '暂无',
          compete_good: '暂无',
          version_plan: '暂无',
          note: '暂无',
          applist: [{
            app_name: '',
            channel: ''
          }],
        }
      },//重置对话框内容
      getDatawithName() {
        this.listLoading = true
        let param = this.inputName
        if (param == '') {
          this.list = this.hidlist;
          this.listLoading = false
          return
        }
        let data = []
        for (let i = 0; i < this.hidlist.length; i++) {
          if (this.hidlist[i].name.search(param) != -1) {
            data.push(this.hidlist[i])
          }
        }
        this.list = data
        this.listLoading = false
      },//二次筛选方法
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
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
