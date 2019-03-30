<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 v-if="checkPermission(['director','operatorleader','admin'])"
                 @click="handleCreate">{{addButton}}
      </el-button>
      <el-input placeholder="根据项目名查找" v-model="inputName" style="width: 200px" class="filter-item" clearable/>
    </div>
    <el-table
      height="780"
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
            <!--<el-form-item label="预热:">-->
            <!--<span>{{ props.row.preheat }}</span>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="排期:">-->
            <!--<span>{{ props.row.schedule }}</span>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="竞品:">-->
            <!--<span>{{ props.row.compete_good }}</span>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="版本计划:">-->
            <!--<span>{{ props.row.version_plan }}</span>-->
            <!--</el-form-item>-->
            <el-form-item label="备注:">
              <span>{{ props.row.note }}</span>
            </el-form-item>
            <!--<el-form-item label="应用:" style="width: 50%">-->
            <!--<span>{{ props.row.names }}</span>-->
            <!--</el-form-item>-->
            <div style="padding-top: 15px">
              <el-table
                stripe
                border
                :data="props.row.applist"
                style="width: 100%;margin-bottom: 30px">
                <el-table-column
                  prop="package_name"
                  label="包名"
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
                    <span>
                      <el-button @click="link_Check(scope2.row)" type="info">查看配置表发布记录</el-button>
                    </span>
                    <span v-if="checkPermission(['director','operatorleader','admin'])">
                    <el-button @click="link_Edit(scope2.row)" type="success">编辑配置表</el-button>
                    </span>
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
      <!--<el-table-column label="预热" prop="preheat">-->
      <!--</el-table-column>-->
      <!--<el-table-column label="排期" prop="schedule">-->
      <!--</el-table-column>-->
      <!--<el-table-column label="竞品" prop="compete_good">-->
      <!--</el-table-column>-->
      <!--<el-table-column label="版本计划" prop="version_plan">-->
      <!--</el-table-column>-->
      <el-table-column label="备注" prop="note">
      </el-table-column>
      <el-table-column label="操作" align="center" width="280px" class-name="small-padding fixed-width"
                       v-if="checkPermission(['director','admin','operatorleader'])">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="updateHandler(scope.row)"
                     v-if="checkPermission(['director','admin','operatorleader'])">{{ "编辑" }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)"
                     v-if="checkPermission(['director','admin'])">{{ "删除" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%">
      <el-form ref="dataForm" :model="project" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="项目名" :rules="{required: true, message: '项目名不能为空', trigger: 'blur'}"
                      v-if="dialogStatus==='update'"
                      prop="project_name">
          <el-input v-model="project.project_name" placeholder="请输入项目名~" disabled/>
        </el-form-item>
        <el-form-item label="项目名" :rules="{required: true, message: '项目名不能为空', trigger: 'blur'}"
                      v-if="dialogStatus==='create'"
                      prop="project_name">
          <el-input v-model="project.project_name" placeholder="请输入项目名~"/>
        </el-form-item>
        <el-form-item label="预热" :rules="{required: true, message: '预热名不能为空', trigger: 'blur'}" prop="preheat"
                      v-if="false">
          <el-input v-model="project.preheat"/>
        </el-form-item>
        <el-form-item label="排期" :rules="{required: true, message: '排期名不能为空', trigger: 'blur'}" prop="schedule"
                      v-if="false">
          <el-input v-model="project.schedule"/>
        </el-form-item>
        <el-form-item label="竞品" :rules="{required: true, message: '竞品不能为空', trigger: 'blur'}" prop="compete_good"
                      v-if="false">
          <el-input v-model="project.compete_good"/>
        </el-form-item>
        <el-form-item label="版本计划" :rules="{required: true, message: '版本计划不能为空', trigger: 'blur'}" prop="version_plan"
                      v-if="false">
          <el-input v-model="project.version_plan"/>
        </el-form-item>
        <el-form-item label="备注" :rules="{required: true, message: '备注不能为空', trigger: 'blur'}" prop="note">
          <el-input v-model="project.note"/>
        </el-form-item>
        <el-button @click="innerVisible = true" type="primary">添加应用</el-button>

        <el-dialog
          style="margin-top: 100px"
          width="40%"
          title="添加应用"
          :visible.sync="innerVisible"
          append-to-body>
          <div style="width: 800px;font-weight: bold">
            <div style="margin-bottom: 20px">
              从已有配置表中添加：
              <el-select v-model="project_value" placeholder="请选择配置表" style="width: 450px" filterable value-key="name">
                <el-option
                  v-for="item in project_list"
                  :key="item.key"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
              <!--<el-button @click="addDomain" type="success">确认添加</el-button>-->
            </div>
            <span>
              <el-dialog
                style="margin-top: 100px"
                width="40%"
                title="添加配置"
                :visible.sync="innerestVisible"
                append-to-body>
                      <el-form :model="dialogForm" ref="dynamicValidateForm" label-width="100px"
                               class="demo-dynamic">
                        <el-form-item
                          prop="package_name"
                          label="包名"
                          :rules="[{required: true, message: '请输入包名', trigger: 'blur' }]">
                        <el-input v-model="dialogForm.package_name" style="width:400px"></el-input>
                      </el-form-item>
                       <el-form-item
                         prop="channel_mark"
                         label="渠道"
                         :rules="[{required: true, message: '请输入渠道', trigger: 'blur' }]">
                        <!--<el-input v-model="dialogForm.channel_mark" style="width:200px"></el-input>-->
                          <el-select v-model="dialogForm.channel_mark" placeholder="请选择" style="width:200px" filterable>
                            <el-option
                              v-for="item in channel_list"
                              :key="item.id"
                              :label="item.program_mark"
                              :value="item.program_mark">
                            </el-option>
                          </el-select>
                      </el-form-item>

                 </el-form>
               <div slot="footer" class="dialog-footer">
                 <el-button @click="innerestVisible = false">{{ '取消'}}</el-button>
                 <el-button type="primary" @click="addconfigList">{{ '确认1' }}</el-button>
               </div>
              </el-dialog>
            <el-button @click="addconfig"> 未发现关联配置表？&nbsp&nbsp&nbsp点击前往添加配置表</el-button>
            </span>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">{{ '取消'}}</el-button>
            <el-button type="primary" @click="addDomain">{{ '确认2' }}</el-button>
          </div>
        </el-dialog>
        <el-form-item
          style="margin-top: 15px;width: 400px"
          v-for="(domain, index) in project.applist"
          :key="domain.key">
          <div style="width: 1300px;margin-left: -100px">
            <span style="font-weight: bolder">渠道：</span>
            <el-input v-model="domain.channel" placeholder="请填写" style="width: 200px" disabled/>
            <span style="font-weight: bolder">包名：</span>
            <el-input v-model="domain.package_name" placeholder="请填写" style="width: 400px" disabled/>
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedialog()">{{ '取消'}}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ '确认3' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {
    getName, getChannel, getProject, createProject, getProjectConfigPublish, getProjectConfig,
    updateProject, deleteProject, getResourceName, createProjectConfig_pro
  } from '@/api/table/projectmanager/projectTable'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import store from '@/store'
  import {getToken} from '@/utils/auth'
  import {fetchFileInfo, getFile, delFile} from '@/api/fileupload'

  export default {
    watch: {
      inputName: function () {
        this.getDatawithName()
      }
    },
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
        dialogForm: {
          package_name: '',
          channel_mark: '',
          date: 0
        },
        innerestVisible: false,
        innerVisible: false,
        project_value: {},
        project_list: [],
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
            channel: '',
            package_name: '无',
            project: {}
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
      this.initProjectList();
    },
    methods: {


      addconfig() {
        this.innerestVisible = true
      },
      addconfigList() {
        let tothis = this
        this.$refs['dynamicValidateForm'].validate((valid) => {
          if (valid) {
            this.dialogForm.date = Date.now()
            createProjectConfig_pro(this.dialogForm).then(response => {
              if (response.data === '添加失败') {
                this.$message({
                  message: '请不要重复添加',
                  type: 'warning'
                });
                return
              }
              let app_info = {
                app_name: '暂无',
                channel: this.dialogForm.channel_mark,
                key: this.dialogForm.date,
                package_name: this.dialogForm.package_name,
                project: {}
              }
              let list = this.project.applist
              console.log(this.project.applist)
              console.log(app_info)
              let flag = true
              for (let i = 0; i < list.length; i++) {
                if (list[i].package_name === app_info.package_name &&
                  list[i].channel === app_info.channel_mark) {
                  console.log(list[i].package_name)
                  console.log(this.project_value.package_name)
                  console.log(list[i].channel)
                  console.log(this.project_value.channel_mark)
                  flag = false
                  break;
                }
              }
              if (flag) {
                this.project.applist.push(app_info);
                this.innerVisible = false
                this.innerestVisible = false
              } else {
                console.log(2)
                this.$message({
                  message: '请不要重复添加',
                  type: 'warning'
                });
                return
              }


              this.$notify({
                title: '成功',
                message: '添加配置表成功',
                type: 'success',
                duration: 2000
              })

            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '',
                message: '添加配置表失败,请检查是否重复！',
                type: 'error',
                duration: 2000
              })
            })
          } else {
            return false;
          }
        });
      },//添加配置表
      link_Edit(val) {
        let routeData = this.$router.resolve({
          name: 'ProjectConfigManager',
          query: {package_name: val.package_name, channel: val.channel}
        });
        window.open(routeData.href, '_blank');
      },//编辑sdk配置表
      addDomain() {
        if (typeof (this.project_value.app_name) === "undefined") {
          this.$message({
            message: '请选择对应的配置表',
            type: 'warning'
          });
          return
        }
        let app_info = {
          app_name: this.project_value.app_name,
          channel: this.project_value.channel_mark,
          key: Date.now(),
          package_name: this.project_value.package_name,
          project: {}
        }
        let list = this.project.applist
        let flag = true
        for (let i = 0; i < list.length; i++) {
          if (list[i].package_name === this.project_value.package_name &&
            list[i].channel === this.project_value.channel_mark) {
            flag = false
          }
        }
        if (flag) {
          this.project.applist.push(app_info);
          this.innerVisible = false
        } else {
          this.$message({
            message: '请不要重复添加',
            type: 'warning'
          });
          return
        }

      },//添加应用
      initProjectList() {
        let name = {
          start: '1',
          end: '2'
        }
        getProjectConfig(name).then(response => {
          let data1 = response.data
          let data2 = []
          for (let i = 0; i < data1.length; i++) {
            let flag = true
            for (let j = 0; j < data2.length; j++) {
              if (data1[i].channel_mark === data2[j].channel_mark &&
                data1[i].package_name === data2[j].package_name) {
                flag = false
              }
            }
            if (flag) {
              data1[i]['name'] =data1[i].app_name+ '_' + data1[i].channel_mark + '_' +  data1[i].package_name
              data2.push(data1[i])
            }
          }
          this.project_list = data2
        })
      },//初始化配置表list
      uichange(list) {
        for (let i = 0; i < list.length; i++) {
          let json = list[i]
          let names = ''
          let newapplist = []
          for (let j = json.applist.length - 1; j >= 0; j--) {
            if (names.search(json.applist[j].app_name) == -1) {
              if (names.length !== 0) {
                names = names + ',' + json.applist[j].app_name
              } else {
                names = json.applist[j].app_name
              }
            }
            let flag = true
            for (let x = 0; x < newapplist.length; x++) {
              if (json.applist[j].channel === newapplist[x].channel) {
                flag = false
              }
            }
            if (flag) {
              newapplist.push(json.applist[j])
            }
          }
          json['applist1'] = newapplist
          json['names'] = names
        }
      },//ui数据改变
      closedialog() {
        this.dialogFormVisible = false
      },//关闭对话框
      fetchchannel() {
        let tothis = this
        this.listLoading = true
        getChannel().then(response => {
          this.channel_list = response.data
          console.log(this.channel_list)
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
      link_Check(val) {
        let routeData = this.$router.resolve({
          name: 'ProjectConfigList',
          query: {package_name: val.package_name, channel: val.channel}
        });
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
        let tothis = this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let flag = true
            let list = this.project.applist
            for (let i = 0; i < list.length; i++) {
              if (list[i].app_name == '') {
                flag = false
                tothis.$notify({
                  title: '警告',
                  message: '第' + (i + 1) + '个应用的应用名未选择！',
                  type: 'warning'
                });
                return
              }
              if (list[i].channel == '') {
                flag = false
                tothis.$notify({
                  title: '警告',
                  message: '第' + (i + 1) + '个应用的渠道未选择！',
                  type: 'warning'
                });
                return
              }
            }
            if (flag) {

              createProject(this.project).then(response => {
                if (response.data === 'ok') {
                  this.handleFilter();
                  this.dialogFormVisible = false
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                } else if (response.data === 'repeat') {
                  this.handleFilter();
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
            console.error('error submit!!');
            return false;
          }
        });
      },//创建方法
      updateData() {
        let tothis = this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let flag = true
            let list = this.project.applist
            for (let i = 0; i < list.length; i++) {
              if (list[i].app_name == '') {
                flag = false
                tothis.$notify({
                  title: '警告',
                  message: '第' + (i + 1) + '个应用的应用名未选择！',
                  type: 'warning'
                });
                return
              }
              if (list[i].channel == '') {
                flag = false
                tothis.$notify({
                  title: '警告',
                  message: '第' + (i + 1) + '个应用的渠道未选择！',
                  type: 'warning'
                });
                return
              }
            }
            if (flag) {
              updateProject(this.project).then(() => {
                this.handleFilter();
                this.dialogFormVisible = false
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
        let accountName = store.getters && store.getters.name
        let name = {
          username: accountName
        }
        getResourceName(name).then(response => {
          let projectlist = response.data
          getProject().then(response => {
            if (this.checkPermission(['director']) || this.checkPermission(['admin']) || this.checkPermission(['operatorleader'])) {
              this.uichange(response.data)

              this.hidlist = response.data
              this.list = response.data
            } else {
              let newlist = []
              let todolist = response.data
              for (let i = 0; i < todolist.length; i++) {
                for (let j = 0; j < projectlist.length; j++) {
                  if (todolist[i].project_name === projectlist[j]) {
                    newlist.push(todolist[i])
                    break
                  }
                }
              }
              this.hidlist = newlist
              this.list = newlist
            }
            this.getDatawithName()
            this.listLoading = false
          }).catch(function (rs) {
            this.getDatawithName()
            console.error(rs)
            this.listLoading = false
          })
        }).catch(function (rs) {
          this.getDatawithName()
          console.error(rs)
          this.listLoading = false
        })
      },//查询方法
      updateHandler(val) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.project = val
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
          applist: [],
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
          if (this.hidlist[i].project_name.search(param) != -1) {
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
