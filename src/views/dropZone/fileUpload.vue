<template>
  <div class="components-container">
    <el-card shadow="always" v-loading="listLoading">

      <!--<table class="gridtable" style="margin-top: 20px;height: 80%">-->
        <!--<tr>-->
          <!--<td width="">日期-->
          <!--</td>-->
          <!--<td>文件名-->
          <!--</td>-->
          <!--<td>GUID-->
          <!--</td>-->
          <!--<td>预览图-->
          <!--</td>-->
        <!--</tr>-->
        <!--<tr v-for="(outer,index) in tableData">-->
          <!--<td width="">{{outer.date1}}-->
          <!--</td>-->
          <!--<td>{{outer.filename}}-->
          <!--</td>-->
          <!--<td>{{outer.fileguid}}-->
          <!--</td>-->
          <!--<td><img :src=outer.path width="80" height="80" @click="bigPicture(outer.path)" />-->
          <!--</td>-->
        <!--</tr>-->
      <!--</table>-->
      <el-dialog
        title="大图预览"
        :visible.sync="dialogVisible">
        <img :src=picture />
      </el-dialog>
      <el-table
        height="770"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="date1"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="filename"
          label="文件名"
          width="300">
        </el-table-column>
        <el-table-column
          prop="filemd5"
          label="文件MD5"
          width="300">
        </el-table-column>
        <el-table-column
          prop="fileguid"
          label="GUID">
        </el-table-column>
        <el-table-column
          prop="path"
          label="PATH">
        </el-table-column>
        <el-table-column
          label="预览">
          <template slot-scope="scope">
            <span @click="bigPicture(scope.row.path)" style="width: 100%"><img :src="scope.row.path"  min-width="70" height="70" /></span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--label="操作">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button @click="handleDelete(scope.row)" type="text" v-loading="downloadLoading">删除</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <el-pagination
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalPages"
        :current-page="currentPage"
        @current-change="pageChange">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import Dropzone from '@/components/Dropzone'
  import {getToken} from '@/utils/auth'
  import {fetchFileInfo, getFile, delFile,getFileLimitMeth} from '@/api/fileupload'

  export default {
    name: 'DropzoneDemo',
    components: {Dropzone},
    data() {
      return {

        pageSize:20,
        totalPages:0,
        currentPage:1,
        picture:'',
        dialogVisible:false,
        downloadLoading: false,
        listLoading: false,
        tableData: [],
        hidTableData: [],
      }
    },
    mounted() {
      this.pageChange(1)
    },
    methods: {
      pageChange(page){
        this.currentPage=page
        let tothis=this
        let param={
          page:page,
          limit:this.pageSize,
        }
        getFileLimitMeth(param).then(response=>{
          if(response.repcode===3000){
            this.hidlist=response.data
            this.tableData=response.data
            this.totalPages=response.total
          }else {
            tothis.$notify({
              title: '失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error=>{
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//分页切换
      bigPicture(param){
        this.dialogVisible=true
        this.picture=param
      },//大图预览
      handleDelete(param) {
        let tothis = this;
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delFile(param).then(response => {
            console.log(response.toString())
            tothis.downloadLoading = false
            if (response.repcode === 3000) {
              tothis.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            } else {
              tothis.$notify({
                title: '失败',
                message: response.data,
                type: 'error',
                duration: 2000
              })
            }
            this.listFileInfo();
          }).catch(function (rs) {
            console.log(rs.toString())
            tothis.downloadLoading = false
            tothis.$notify({
              title: '删除失败',
              message: '刷新试试',
              type: 'error',
              duration: 2000
            })
          })
        });
      },//删除上传文件
      listFileInfo() {
        let tothis = this;
        fetchFileInfo().then(response => {
          if (response.repcode === 0) {
            this.tableData = response.data
            this.hidTableData = response.data
            this.totalPages=response.data.length
            this.pageChange(1)
            console.log(response.data)
          }
          this.listLoading = false
        }).catch(function (rs) {
          tothis.listLoading = false
          console.log(rs)
        })
      },//展示上传文件表

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ts-title {
    font-size: 15px;
    font-weight: bolder
  }
</style>

<style type="text/css">
  .gridtable {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 14px bolder;
    border-collapse: collapse;
  }

  .gridtable tr {
    border-width: 0px;
    padding: 0px;
    border-style: solid;
    border-color: #99a9bf;
    background-color: #dedede;
  }

  .gridtable td {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    color: #666666;
    margin: 0px;
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #dcdfe6;
    background-color: #ffffff;
  }
</style>


