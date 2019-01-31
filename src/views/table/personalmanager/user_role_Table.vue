<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">{{addButton}}
      </el-button>

      <el-input placeholder="根据账号查找" v-model="inputName" style="width: 200px;" class="filter-item" clearable @blur="getRolewithName"/>


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
      <el-table-column label="帐号" width="300" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="300" align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.role_name }}
        </template>
      </el-table-column>
      <el-table-column label="角色标识" width="300" align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column label="角色描述" width="300" align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.role_describe }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          <el-button size="mini" type="primary" @click="handlePerm(scope.row)">权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="app" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="帐号">
          <el-select v-model="app.username" class="filter-item" placeholder="帐号" v-if="dialogStatus==='create'">
            <el-option v-for="item in userlist" :key="item.username" :label="item.username" :value="item.username"/>
          </el-select>
          <el-select v-model="app.username" class="filter-item" placeholder="帐号" v-if="dialogStatus==='update'"
                     disabled>
            <el-option v-for="item in userlist" :key="item.username" :label="item.username" :value="item.username"/>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名字">
          <el-input v-model="app.role_name" placeholder="必填" value="无"/>
        </el-form-item>

        <el-form-item label="角色标识">
          <el-select v-model="app.role" class="filter-item" placeholder="请选择权限">
            <el-option v-for="item in roleOptions" :key="item.key" :label="item.key" :value="item.val"/>
          </el-select>
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input v-model="app.role_describe" placeholder="必填" value="无"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="app.note" placeholder="必填" value="无"/>
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
    <!--权限-->

    <el-dialog :title="textMap.perm" :visible.sync="permFormVisible" :detectionid="detectionid" v-if="hackReset">
      <el-tree
        ref="tree"
        :data="data2"
        node-key="id"
        :default-checked-keys="grade.check"
        :default-expanded-keys="grade.check"
        show-checkbox
        highlight-current
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permFormClose()">{{ '取消'}}</el-button>
        <el-button type="primary" @click="handleUpdatePerm()">{{ '确认' }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
  import {getAccount} from '@/api/table/personalmanager/accountTable'
  import {getRole, creatRole, updateRole, deleteRole, getPerms, createPerms} from '@/api/table/personalmanager/user_role_Table'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  const roleOptions = [
    {key: '管理员', val: 'admin'},
    {key: '运营', val: 'operator'},
    {key: '商务', val: 'market'},
    {key: '策划', val: 'planner'},
    {key: '技术', val: 'developer'},
    {key: '组长', val: 'leader'},
  ]


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
        create_flag_perm:true,
        create_flag_role:true,
        update_flag_role:true,
        inputName:'',
        detectionid: 12,
        hackReset: false,
        checkedlist: [],
        hidlist:[],
        data2: [{
          id: 'fileupload-operate',
          label: '上传文件',
        }, {
          label: '数据管理',
          children: [{
            id: 'addata-operate',
            label: '广告数据管理'
          }, {
            id: 'yixindata-operate',
            label: '移信数据下载'
          }]
        }, {
          label: '项目管理',
          children: [{
            label: '应用管理',
            children: [{
              id: 'app-canList',
              label: '应用展示'
            }, {
              id: 'app-canCreate',
              label: '应用添加'
            }, {
              id: 'app-canEdit',
              label: '应用修改'
            }, {
              id: 'app-canDelete',
              label: '应用删除'
            }]
          }, {
            label: '渠道管理',
            children: [{
              id: 'channel-canList',
              label: '渠道展示'
            }, {
              id: 'channel-canCreate',
              label: '渠道添加'
            }, {
              id: 'channel-canEdit',
              label: '渠道修改'
            }, {
              id: 'channel-canDelete',
              label: '渠道删除'
            }]
          }, {
            label: '广告类型管理',
            children: [{
              id: 'adtype-canList',
              label: '广告类型展示'
            }, {
              id: 'adtype-canCreate',
              label: '广告类型添加'
            }, {
              id: 'adtype-canEdit',
              label: '广告类型修改'
            }, {
              id: 'adtype-canDelete',
              label: '广告类型删除'
            }]
          }]
        }, {
          label: '系统管理',
          children: [{
            label: '用户管理',
            children: [{
              id: 'user-canList',
              label: '用户展示'
            }, {
              id: 'user-canCreate',
              label: '用户添加'
            }, {
              id: 'user-canEdit',
              label: '用户修改'
            }, {
              id: 'user-canDelete',
              label: '用户删除'
            }]
          }, {
            label: '角色管理',
            children: [{
              id: 'role-canList',
              label: '角色展示'
            }, {
              id: 'role-canCreate',
              label: '角色添加'
            }, {
              id: 'role-canEdit',
              label: '角色修改'
            }, {
              id: 'role-canDelete',
              label: '角色删除'
            }]
          }, {
            label: '权限管理',
            children: [{
              id: 'permission-canList',
              label: '权限展示'
            }, {
              id: 'permission-canCreate',
              label: '权限添加'
            }, {
              id: 'permission-canEdit',
              label: '权限修改'
            }, {
              id: 'permission-canDelete',
              label: '权限删除'
            }]
          }, {
            label: '资源管理管理',
            children: [{
              id: 'resource-canList',
              label: '资源展示'
            }, {
              id: 'resource-canCreate',
              label: '资源添加'
            }, {
              id: 'resource-canEdit',
              label: '资源修改'
            }, {
              id: 'resource-canDelete',
              label: '资源删除'
            }]
          }, {
            label: 'SDK管理',
            children: [{
              id: 'sdk-canList',
              label: 'SDK展示'
            }, {
              id: 'sdk-canCreate',
              label: 'SDK创建'
            },{
              id: 'sdk-canEdit',
              label: 'SDK编辑'
            }]
          }
          ],
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },

        grade: {
          box: false,
          check: []
        },
        permFormVisible: false,
        roleOptions,
        introduce: '介绍',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        addButton: '添加角色',
        directives: {waves},
        downloadLoading: false,
        layout: '',
        timevalue: '',
        searchName: '搜索',
        tableKey: 0,
        list: null,
        userlist: null,
        total: 0,
        listLoading: true,
        importanceOptions: [1, 2, 3],
        names: [],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        dialogStatus: '',
        dialogFormVisible: false,
        app: {
          id: undefined,
          name: undefined,
          system: undefined,
          icon: undefined,
          introduce: undefined,
        },
        textMap: {
          update: '编辑',
          create: '创建',
          perm: '权限编辑',
        },
        rules: {
          title: [{required: true, message: '必须有名字！', trigger: 'blur'}]
        },
        dialogPvVisible: false,
        permlist: null,
        pvData: [],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
      }
    },
    mounted() {
      this.handleFilter();
      this.getUsernames();
    },
    methods: {
      permFormClose() {
        this.permFormVisible = false
      },
      handleUpdatePerm() {
        let tothis = this;
        let data = {
          username: this.permlist.username,
          id: this.permlist.id,
          username_mark: this.permlist.username_mark,
          permissions: this.$refs.tree.getCheckedKeys().toString(),
        }
        if (!this.create_flag_perm) {
          return
        }
        this.create_flag_perm=false
        createPerms(data).then(() => {
          this.handleFilter();
          this.permFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.create_flag_perm=true
        }).catch(function (rs) {
          tothis.permFormClose();
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
          this.create_flag_perm=true
        })
      },
      handlePerm(row) {
        this.hackReset = false
        let tothis = this;
        this.permlist = row;
        this.dialogStatus = 'update'
        getPerms(row).then(rs => {
          if (this.$refs.tree != undefined) {
            this.$refs.tree.store.setCheckedKeys([])
          }
          this.grade.check = rs.data;
          this.hackReset = true
          this.permFormVisible = true;
        }).catch(function (rs) {
          console.err(rs)
        })
      },
      getUsernames() {
        getAccount().then(response => {
          this.userlist = response.data
          this.listLoading = false
        }).catch(function (rs) {
          console.err(rs)
        })
      },
      createData() {
        if (this.app.username === '' || this.app.role === '' || this.app.note === '' || this.app.role_name === '' || this.app.role_describe === '') {
          this.open3()
          return
        }
        let username = this.app.username
        let username_mark = null
        for (let i = 0; i < this.userlist.length; i++) {
          if (username == this.userlist[i].username) {
            username_mark = this.userlist[i].id
          }
        }
        let tothis = this;
        if (!this.create_flag_role){
          return
        }
        this.create_flag_role=false
        creatRole(this.app, username_mark).then(() => {
          this.handleFilter();
          this.list.unshift(this.app)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.create_flag_role=true
        }).catch(function (rs) {
          tothis.dialogFormVisible = false
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
          this.create_flag_role=true
        })
      },
      updateData() {
        const tempData = Object.assign({}, this.app)
        if (tempData.username === '' || tempData.role === '' || tempData.note === '' || tempData.role_name === '' || tempData.role_describe === '') {
          this.open3()
          return
        }
        let tothis = this;
        if (!this.update_flag_role){
          return
        }
        this.update_flag_role=false
        updateRole(tempData).then(() => {
          this.handleFilter();
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.update_flag_role=true
          this.dialogFormVisible = false
        }).catch(function (rs) {
          tothis.dialogFormVisible = false
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
          this.update_flag_role=true
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
        let tothis = this;
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(row).then(() => {
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
          username: "",
          role: "",
          note: "",
          role_name: "",
          role_describe: "",
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
        let tothis = this
        getRole().then(response => {
          let todolist=response.data
          let newlist=[]
          for (let i=0;i<todolist.length;i++){
            if (newlist.length===0){
              newlist.push(todolist[i])
            } else {
              let flag=true
              for (let j=0;j<newlist.length;j++){
                if (todolist[i].username===newlist[j].username){
                  flag=false
                }
              }
              if (flag){
                newlist.push(todolist[i])
              }
            }
          }
          this.list = newlist
          this.hidlist= newlist
          this.listLoading = false
        }).catch(function (rs) {
          console.log(rs)
          tothis.listLoading = false
        })
      },
      getRolewithName(){
        this.listLoading=true
        let param=this.inputName
        if (param==''){
          this.list=this.hidlist;
          this.listLoading=false
          return
        }
        let data=[]
        for (let i=0;i<this.hidlist.length;i++){
          if (this.hidlist[i].username.search(param)!=-1){
            data.push(this.hidlist[i])
          }
        }
        this.list = data
        this.listLoading=false
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
