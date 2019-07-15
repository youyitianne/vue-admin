<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 v-if="checkPermission(['director','operatorleader','admin'])"
                 @click="handleCreate">{{addButton}}
      </el-button>
      <el-input placeholder="根据项目名查找" v-model="inputName" style="width: 200px;margin-left: 20px" class="filter-item"
                clearable/>
      <el-button @click="searchTable">搜索</el-button>
    </div>
    <el-table
      height="740"
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
            <div style="padding-top: 15px">
              <el-table
                stripe
                border
                :data="props.row.applist"
                style="width: 100%;margin-bottom: 30px">
                <el-table-column
                  label="图标">
                  <template slot-scope="scope">
                    <span @click="bigPicture(scope.row.path)" style="width: 100%" v-if="scope.row.icon==='暂无'||scope.row.icon===''">暂无</span>
                         <span @click="bigPicture(scope.row.path)" style="width: 100%" v-else>
                      <img :src="iconPath+scope.row.icon"  min-width="70" height="70" /></span>
                  </template>
                </el-table-column>
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
                  width="350"
                  prop="package_name"
                  label="包名">
                </el-table-column>
                <el-table-column
                  label="链接"
                  width="350">
                  <template slot-scope="scope2">
                    <span>
                    <el-button @click="link_Edit(scope2.row)" type="success">详情</el-button>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="项目ID" prop="pid" width="100"></el-table-column>
      <el-table-column label="项目名" prop="project_name">
      </el-table-column>
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
    <el-pagination
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="totalPages"
      :current-page="currentPage"
      @current-change="pageChange">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%" :close-on-click-modal=false>
      <el-form ref="dataForm" :model="project" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="项目名" :rules="{required: true, message: '项目名不能为空', trigger: 'blur'}"
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
          :close-on-click-modal=false
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
            </div>
            <span>
              <el-dialog
                :close-on-click-modal=false
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

                        <el-form-item
                          prop="keystoreguid"
                          label="公司名称"
                          :rules="[{required: true, message: '请输入公司名称', trigger: 'blur' }]">
                          <el-select v-model="dialogForm.keystoreguid" placeholder="请选择" style="width:200px" filterable>
                            <el-option
                              v-for="item in companyList"
                              :key="item.keystoreguid"
                              :label="item.companyName"
                              :value="item.keystoreguid">
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
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()"
                   v-loading.fullscreen.lock="fullscreenLoading">{{ '确认3' }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {getChannel,  createProject, getProjectConfig,
    updateProject, deleteProject,  createProjectConfig_pro, getProjectLimit
  } from '@/api/table/projectmanager/projectTable'
  import waves from '@/directive/waves'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import {getcompanyInfoMeth} from '@/api/table/sdkmanager/companyInfo'
  import {listAppInfo} from '@/api/table/sdkmanager/appInfo'

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
        iconPath:'http://filehost.tomatojoy.com/file?path=',
        picture: '',
        previewDialogVisible: false,
        uploadPath: 'http://filehost.tomatojoy.com:8091/file',
        //uploadPath: 'http://192.168.1.1:8091/file',
        pageSize: 15,
        totalPages: 0,
        currentPage: 1,
        fullscreenLoading: false,
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
        expands: [],
        getRowKeys(row) {
          return row.id
        },
        inputName: '',
        hidlist: [],
        addButton: '创建项目',
        list: [],
        listLoading: false,
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
        companyList: [],
        textMap: {
          update: '编辑',
          create: '创建'
        },
      }
    },
    mounted() {
      this.pageChange(1);//初始化项目列表
      this.fetchchannel();//初始化渠道列表
      this.initProjectList();//初始化应用列表
      this.listCompanyInfo();//初始化公司信息
    },
    methods: {
      bigPicture(param) {
        this.previewDialogVisible = true
        this.picture = param
      },//大图预览
      searchTable() {
        this.pageChange(1);
      },//查询按钮时间
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
          projectName: this.inputName,
        }
        getProjectLimit(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.list = response.data
            console.log("项目列表--------",this.list)
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
      listCompanyInfo() {
        let tothis = this;
        getcompanyInfoMeth().then(response => {
          if (response.repcode === 3000) {
            this.companyList = response.data
            console.log('公司信息列表',this.companyList)
          } else {
            tothis.$notify({
              title: '初始化公司信息失败',
              message: '刷新试试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(function (rs) {
          console.log(rs)
          tothis.$notify({
            title: '初始化公司信息失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//获取公司信息
      addconfig() {
        this.dialogForm = {}
        this.$nextTick(() => {
          this.$refs['dynamicValidateForm'].clearValidate()
        })
        this.innerestVisible = true
      },//添加配置
      addconfigList() {
        let tothis = this
        this.$refs['dynamicValidateForm'].validate((valid) => {
          if (valid) {
            this.dialogForm.date = Date.now()
            let guid = this.guid();
            let createtableParam = {
              channel_mark: this.dialogForm.channel_mark,
              date: this.dialogForm.date,
              keystoreguid: this.dialogForm.keystoreguid,
              package_name: this.dialogForm.package_name,
              sdkguid: guid
            }
            console.log('创建的配置表', createtableParam)
            createProjectConfig_pro(createtableParam).then(response => {
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
                package_name: this.dialogForm.package_name.trim(),
                sdkguid: guid,
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
      guid() {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
      },//生成guid
      link_Edit(val) {
        let routeData = this.$router.resolve({
          name: 'yyliebiao',
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
        //todo
        let app_info = {
          app_name: this.project_value.app_name,
          channel: this.project_value.channel_mark,
          sdkguid: this.project_value.app_guid,
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
        listAppInfo().then(response => {
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
              data1[i]['name'] = data1[i].app_name + '_' + data1[i].channel_mark + '_' + data1[i].package_name
              data2.push(data1[i])
            }
          }
          console.log('应用列表',data2)
          this.project_list = data2
        })
      },//初始化配置表list
      closedialog() {
        this.dialogFormVisible = false
      },//关闭对话框
      fetchchannel() {
        let tothis = this
        this.listLoading = true
        getChannel().then(response => {
          this.channel_list = response.data
          console.log('渠道列表',this.channel_list)
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
      removeDomain(item) {
        let index = this.project.applist.indexOf(item)
        if (index !== -1) {
          this.project.applist.splice(index, 1)
        }
      },//删除应用
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
      },//展开行变化时触发
      createData() {
        this.fullscreenLoading = true
        let tothis = this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let flag = true
            if (flag) {
              createProject(this.project).then(response => {
                if (response.data === 'ok') {
                  this.dialogFormVisible = false
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                } else if (response.data === 'repeat') {
                  this.$notify({
                    title: '注意',
                    message: '项目名重复请修改！',
                    type: 'warning',
                    duration: 2000
                  })
                }
                console.log(123)
                tothis.pageChange(this.currentPage);
                tothis.fullscreenLoading = false
              }).catch(function (rs) {
                tothis.fullscreenLoading = false
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
        this.fullscreenLoading = true
        let tothis = this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let flag = true
            let list = this.project.applist
            if (flag) {
              console.log('更新项目对象\n', this.project)
              updateProject(this.project).then(() => {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
                tothis.fullscreenLoading = false
              }).catch(function (rs) {
                tothis.fullscreenLoading = false
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
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            tothis.pageChange(this.currentPage);
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
      checkPermission
    }
  }
</script>

<style>
  .detail_title {
    font-size: large;
    font-weight: bolder;
    font-size: 16px;
  }

  .detail_span {
    font-size: 14px;
    font-family: "微软雅黑";
  }

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
