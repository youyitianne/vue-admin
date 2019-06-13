<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 @click="showCreateAdtype">{{addButton}}
      </el-button>

    </div>
    <el-table
      height="750"
      v-loading="listLoading"
      :data="tableList"
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
      <el-table-column label="广告类型名称" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.adtype_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告类型GUID" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.adtype_guid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showUpdateAdtype(scope.row)">{{ '编辑' }}</el-button>
          <el-button size="mini" type="danger" @click="deleteAdtype(scope.row)">{{ '删除' }}</el-button>
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


    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="adtype" label-position="left" label-width="120px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="广告类型名称" :rules="{required: true, message: '广告类型名称不能为空', trigger: 'blur'}" prop="adtype_name">
          <el-input v-model="adtype.adtype_name" placeholder="请输入广告类型名称~"/>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消'}}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createAdtype():updateAdtype()">{{ '确认' }}</el-button>
      </div>
    </el-dialog>

  </div>


</template>

<script>
  import {addAdtypeHandler, getAdtypeHandler,delAdtypeHandler,editAdtypeHandler} from '@/api/table/datamanager/newDataManager/advertiseTypeData'
  import {parseTime} from '@/utils'

  export default {
    data() {
      return {
        pageSize: 20,
        totalPages: 0,
        currentPage: 1,
        listLoading:false,
        addButton:'添加广告位类型',
        tableList:[],
        dialogTitle:'广告位类型',
        adtype:{},
        dialogFormVisible:false,
        dialogStatus:'create',
      }
    },
    mounted() {
      this.pageChange(1)
    },
    methods: {
      showCreateAdtype(){
        this.adtype={}
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.dialogFormVisible=true
        this.dialogStatus='create'
      },//展示添加广告位类型
      createAdtype(){
        console.log('创建广告类型',this.adtype)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let param = {
              adtype_name:this.adtype.adtype_name
            }
            addAdtypeHandler(param).then(response=>{
              if (response.repcode===3000){
                this.$message({
                  type: 'success',
                  message: `添加广告位成功！`
                });
                this.pageChange(this.currentPage)
                this.dialogFormVisible = false
              } else {
                this.$message({
                  type: 'error',
                  message: response.data
                });
                console.error(response)
              }
            }).catch(error=>{
              console.log(error)
              this.$message({
                type: 'error',
                message: `添加广告类型失败！`
              });
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      showUpdateAdtype(param){
        this.adtype=param
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.dialogFormVisible=true
        this.dialogStatus='update'
      },
      updateAdtype(){
        console.log('更新广告类型',this.adtype)
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let param = {
              adtype_name:this.adtype.adtype_name,
              adtype_guid:this.adtype.adtype_guid
            }
            editAdtypeHandler(param).then(response=>{
              if (response.repcode===3000){
                this.$message({
                  type: 'success',
                  message: `编辑广告位成功！`
                });
                this.pageChange(this.currentPage)
                this.dialogFormVisible = false
              } else {
                console.error(response)
              }
            }).catch(error=>{
              console.log(error)
              this.$message({
                type: 'error',
                message: `编辑广告类型失败！`
              });
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      deleteAdtype(paramter){
        this.$confirm('确认删除？')
          .then(()=> {
            let param = {
              adtype_guid:paramter.adtype_guid
            }
            delAdtypeHandler(param).then(response=>{
              if (response.repcode===3000){
                this.$message({
                  type: 'success',
                  message: `删除广告位成功！`
                });
                this.pageChange(this.currentPage)
                this.dialogFormVisible = false
              } else {
                console.error(response)
              }
            }).catch(error=>{
              console.log(error)
              this.$message({
                type: 'error',
                message: `删除广告类型失败！`
              });
            })
          })
          .catch(_ => {});
      },
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
        }
        this.listLoading = true
        getAdtypeHandler(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.tableList = response.data
            console.log("广告类型列表--------", this.tableList)
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
    }
  }
</script>
