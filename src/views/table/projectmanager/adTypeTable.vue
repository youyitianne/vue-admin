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
      stripe
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
      <el-table-column label="广告类型名称" width="110" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告类型标记" width="110" align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.program_mark }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="介绍" prop="advertising_type">
        <template slot-scope="scope">
          <span>{{ scope.row.introduce }}</span>
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
      <el-form ref="dataForm" :model="adtype" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="广告类型名称" v-if="this.dialogStatus==='update'">
          <el-input v-model="adtype.name" placeholder="请输入广告类型名称~" disabled/>
        </el-form-item>

        <el-form-item label="广告类型名称" v-if="this.dialogStatus==='create'">
          <el-input v-model="adtype.name" placeholder="请输入广告类型名称~"/>
        </el-form-item>

        <el-form-item label="广告类型标记">
          <el-input v-model="adtype.program_mark" placeholder="默认填写安卓~"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="adtype.note" placeholder="暂无此功能~" value="无"/>
        </el-form-item>
        <el-form-item label="介绍">
          <el-input v-model="adtype.introduce" placeholder="比如别称~"/>
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
  import {getAdType, createAdType, updateAdType, deleteAdType} from '@/api/table/projectmanager/adTypeTable'
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
        addButton:'添加广告类型',
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
        adtype: {
          id: undefined,
          name: undefined,
          program_mark: undefined,
          note: undefined,
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
        create_flag:true,
        update_flag:true,
      }
    },
    mounted() {
      this.handleFilter();
    },
    methods: {
      createData() {
        let tothis=this
        for (let i=0;i<this.list.length;i++){
          if (this.list[i].name===this.adtype.name) {
            this.$message({
              message: '该广告类型已存在~',
              type: 'warning'
            });
            return
          }
        }
        if (this.adtype.name === '' ||this.adtype.introduce === '' || this.adtype.program_mark === '' || this.adtype.note === '' || this.adtype.system === '') {
          this.open3()
          return
        }
        if (!this.create_flag){
          return
        }
        this.create_flag=false
        createAdType(this.adtype).then(() => {
          this.handleFilter();
          this.list.unshift(this.adtype)
          this.dialogFormVisible = false
          this.$notify({
            title: '成功',
            message: '创建成功',
            type: 'success',
            duration: 2000
          })
          this.create_flag=true
        }).catch(function (rs) {
          tothis.dialogFormVisible = false
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
          this.create_flag=true
        })
      },
      updateData() {
        let tothis=this;
        const tempData = Object.assign({}, this.adtype)
        if (tempData.introduce === '' || tempData.note === '' || tempData.program_mark === '' || tempData.system === ''|| tempData.name === '') {
          this.open3()
          return
        }
        if (!this.update_flag){
          return
        }
        this.update_flag=false
        updateAdType(tempData).then(() => {
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
          this.dialogFormVisible = false
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
          this.update_flag=true
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
        this.adtype = Object.assign({}, row) // copy obj
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
          deleteAdType(row).then(() => {
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
        this.adtype = {
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
        this.listLoading=true
        let tothis=this
        getAdType().then(response => {
          this.list = response.data
          console.log(this.list)
          this.listLoading = false
        }).catch(function (rs) {
          console.log(rs)
          this.listLoading = false
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
