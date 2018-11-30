<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">{{addButton}}
      </el-button>

    </div>
    <el-table
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
      <el-table-column label="帐号" width="300" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="300" align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>

      <el-table-column label="备注" align="center" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
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
        <el-form-item label="帐号">
          <el-input v-model="app.username" placeholder="请填写帐号~"/>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="app.role" placeholder="请填写要帐号的角色名~"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="app.note" placeholder="写点什么备忘吧~" value="无"/>
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
  import {getRole, creatRole, updateRole, deleteRole} from '@/api/user_role_Table'
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
        introduce: '介绍',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        addButton:'添加资源',
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
        if (this.app.username === '' || this.app.role === '' || this.app.note === '') {
          this.open3()
          return
        }
        creatRole(this.app).then(() => {
          this.handleFilter();
          this.list.unshift(this.app)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
        }).catch(function () {
          this.$notify({
            title: '失败',
            message: '请检查网络',
            type: 'warning',
            duration: 2000
          })
        })
      },
      updateData() {

        const tempData = Object.assign({}, this.app)
        if (tempData.introduce === '' || tempData.name === '' || tempData.icon === '' || tempData.system === '') {
          this.open3()
          return
        }
        updateRole(tempData).then(() => {
          this.dialogFormVisible = false
          this.handleFilter();
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        }).catch(function () {
          this.$notify({
            title: '失败',
            message: '请检查网络',
            type: 'warning',
            duration: 2000
          })
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
        deleteRole(row).then(() => {
          this.handleFilter();
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch(function () {
          this.$notify({
            title: '失败',
            message: '请检查网络',
            type: 'warning',
            duration: 2000
          })
        })
      },
      resetTemp() {
        this.app = {
          id: undefined,
          name: '',
          system: '安卓',
          icon: '无',
          introduce: '无',
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
        getRole().then(response => {
          this.list = response.data
          console.log(this.list)
          this.listLoading = false
        }).catch(function (rs) {
          console.log(rs)
        })
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
