<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="handleCreate">{{addButton}}
      </el-button>
      <el-input placeholder="根据渠道名称查找" v-model="inputName" style="width: 200px;margin-bottom: 15px" class="filter-item" clearable @blur="getDatawithName"/>
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
      <el-table-column label="渠道名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道标记" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.program_mark }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注">
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
      <el-form ref="dataForm" :model="channel" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="渠道名称">
          <el-input v-model="channel.name" placeholder="请输入渠道名字~"/>
        </el-form-item>

        <el-form-item label="渠道标记" v-if="this.dialogStatus==='create'">
          <el-input v-model="channel.program_mark" placeholder="渠道的英文名称~"/>
        </el-form-item>
        <el-form-item label="渠道标记" v-if="this.dialogStatus==='update'">
          <el-input v-model="channel.program_mark" placeholder="渠道的英文名称~" disabled/>
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="channel.note" placeholder="介绍一个这个渠道吧~" value="无"/>
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
  import {getChannel, createChannel, updateChannel, deleteChannel} from '@/api/table/projectmanager/channelTable'
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
        addButton:'添加渠道',
        directives: {waves},
        downloadLoading: false,
        layout: '',
        timevalue: '',
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
        channel: {
          id: undefined,
          name: undefined,
          program_mark: undefined,
          note: undefined,
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
        let tothis=this;
        for (let i=0;i<this.hidlist.length;i++){
          if (this.hidlist[i].name===this.channel.name) {
            this.$message({
              message: '该渠道已存在~',
              type: 'warning'
            });
            return
          }
        }
        if (this.channel.name === '' || this.channel.program_mark === '' || this.channel.note === '') {
          this.open3()
          return
        }
        if (!this.create_flag) {
          return
        }
        this.create_flag=false
        createChannel(this.channel).then(() => {
          this.handleFilter();
          this.list.unshift(this.channel)
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
        let tothis=this
        const tempData = Object.assign({}, this.channel)
        if (tempData.program_mark === '' || tempData.name === '' || tempData.note === '') {
          this.open3()
          return
        }
        if (!this.update_flag) {
          return
        }
        this.update_flag=false
        updateChannel(tempData).then(() => {
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
          tothis.dialogFormVisible = false
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
        this.channel = Object.assign({}, row) // copy obj
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
          deleteChannel(row).then(() => {
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
              type: 'success',
              duration: 2000
            })
          })
        });
      },
      resetTemp() {
        this.channel = {
          id: undefined,
          name: '',
          program_mark: '',
          note: '无',
        }
      },
      handleFilter() {
        let tothis=this
        getChannel().then(response => {
          this.list = response.data
          this.hidlist = response.data
          this.listLoading = false
        }).catch(function (rs) {
          tothis.listLoading = false
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
          if (this.hidlist[i].name.search(param)!=-1){
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
