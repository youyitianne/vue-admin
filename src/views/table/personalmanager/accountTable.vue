<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">{{addButton}}
      </el-button>
      <el-input placeholder="根据账号查找" v-model="inputName" style="width: 200px;" class="filter-item" clearable @blur="getDatawithName"/>
    </div>
    <el-table
      height="850"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row>
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope" prop="id">
          {{ ++scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="300" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" width="300" align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.psd }}
        </template>
      </el-table-column>
      <el-table-column label="所属部门"  align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.department }}
        </template>
      </el-table-column>
      <el-table-column label="职位"  align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>
      <!--<el-table-column label="盐" align="center" width="575" prop="channel">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.password_salt }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="备注" align="center"  prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="195" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ '编辑' }}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ '删除' }}</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="app" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">

        <el-form-item label="帐号" class="filter-item" v-if="dialogStatus==='create'">
          <el-input v-model="app.username" placeholder="必填~"/>
        </el-form-item>
        <el-form-item label="帐号" class="filter-item" v-if="dialogStatus==='update'">
          <el-input v-model="app.username" placeholder="必填~" disabled/>
        </el-form-item>

        <el-form-item label="密码">
          <el-input v-model="app.psd" placeholder="必填~" v-on:blur="passwordLenth()"/>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-input v-model="app.department" placeholder="必填~"/>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="app.position" placeholder="必填~"/>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="app.note" placeholder="必填~" value="暂无"/>
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
  import {getAccount, creatAccount, updateAccount, deleteAccount} from '@/api/table/personalmanager/accountTable'
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
        addButton:'添加帐号',
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
          introduce: undefined,
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
    },
    methods: {
      createData() {
        let tothis=this
        for (let i=0;i<this.hidlist.length;i++){
          if (this.hidlist[i].username===this.app.username) {
            this.$message({
              message: '该用户已存在~',
              type: 'warning'
            });
            return
          }
        }
        if (this.app.username === '' || this.app.psd === '' || this.app.note === ''|| this.app.department === '' || this.app.position === '') {
          this.open3()
          return
        }
        if (!this.create_flag){
          return
        }
        this.create_flag=false
        creatAccount(this.app).then(() => {
          this.handleFilter();
          this.list.unshift(this.app)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '添加成功',
            type: 'success',
            duration: 2000
          })
          this.create_flag=true
        }).catch(function (rs) {
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
          this.create_flag=true
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
      updateData() {
        let tothis=this
        const tempData = Object.assign({}, this.app)
        if (tempData.note === '' || tempData.username === '' || tempData.psd === ''|| tempData.department === '' || tempData.position === '') {
          this.open3()
          return
        }
        if (!this.update_flag){
          return
        }
        this.update_flag=false
        updateAccount(tempData).then(() => {
          this.dialogFormVisible = false
          this.handleFilter();
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.update_flag=true
        }).catch(function (rs) {
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
          this.update_flag=true
        })
      },
      handleDelete(row) {
        let tothis=this
          this.$confirm('是否确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteAccount(row).then(() => {
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
          username:"",
          psd:"",
          note:"",
          department:"",
          position:"",
        }
      },
      passwordLenth(){
        const tempData = Object.assign({}, this.app)
        if(tempData.psd.length<5){
          this.passwordTip();
          this.app.psd="";
        }
      },
      passwordTip() {
        this.$message({
          message: '密码必须大于5位~',
          type: 'warning'
        });
      },
      handleFilter() {
        let tothis=this;
        getAccount().then(response => {
          this.list = response.data
          this.hidlist= response.data
          console.log(this.hidlist)
          this.listLoading = false
        }).catch(function (rs) {
          tothis.listLoading = false
          console.log(rs)
        })
      },
      getDatawithName(){
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
