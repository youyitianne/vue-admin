<template>
  <div class="components-container">
    <el-card shadow="always" v-loading="listLoading">

      <table class="gridtable" style="margin-top: 20px">
        <tr>
          <td width="">日期
          </td>
          <td>文件名
          </td>
          <td>GUID
          </td>
          <td>预览图
          </td>
        </tr>
        <tr v-for="(outer,index) in tableData">
          <td width="">{{outer.date1}}
          </td>
          <td>{{outer.filename}}
          </td>
          <td>{{outer.fileguid}}
          </td>
          <td><img :src=outer.path width="80" height="80" @click="bigPicture(outer.path)" />
          </td>
        </tr>
      </table>


      <el-dialog
        title="提示"
        :visible.sync="dialogVisible">
        <img :src=picture />
      </el-dialog>



      <!--<el-table-->
        <!--height="770"-->
        <!--border-->
        <!--:data="tableData"-->
        <!--style="width: 100%">-->
        <!--<el-table-column-->
          <!--prop="date1"-->
          <!--label="日期"-->
          <!--width="180">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="filename"-->
          <!--label="文件名"-->
          <!--width="300">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="fileguid"-->
          <!--label="GUID">-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="path"-->
          <!--label="PATH">-->

          <!--<image definitionURL="http://192.168.1.144:8091/file?path=6fdedf38-1e9b-4fb7-9524-f0475cd94c6b"> </image>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--label="操作">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button @click="handleDelete(scope.row)" type="text" v-loading="downloadLoading">删除</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
    </el-card>


  </div>
</template>

<script>
  import Dropzone from '@/components/Dropzone'
  import {getToken} from '@/utils/auth'
  import {fetchFileInfo, getFile, delFile} from '@/api/fileupload'

  export default {
    name: 'DropzoneDemo',
    components: {Dropzone},
    data() {
      return {
        picture:'',
        dialogVisible:false,
        downloadLoading: false,
        listLoading: false,
        tableData: [],
        hidTableData: [],
        dialogMessageVisible: false,
        dataObj: {
          'Authorization': ''
        },
        token: {
          Authorization: 'Bear ' + getToken()
        },
        root: "els",
        version: "1.0.0",
        value: "",
        value1: "",
      }
    },
    mounted() {
      this.listFileInfo();
    },
    methods: {
      bigPicture(param){
        this.dialogVisible=true
        this.picture=param
      },
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
            console.log(this.tableData)
          }
          this.listLoading = false
        }).catch(function (rs) {
          tothis.listLoading = false
          console.log(rs)
        })
      },//展示上传文件表
      beforeUpload(file) {
        this.dataObj.Authorization = 'Bearer ' + getToken()
      },//上传前事件
      dropzoneS(response) {
        console.log(response)
        let data = response.data;
        this.value = data + "<br>" + this.value;
        this.$message({message: data, type: 'success'})
        this.listFileInfo();
      },//上传成功时间
      dropzoneR(response) {
        this.$message({message: '移除成功~', type: 'success'})
      },//上传文件资源列表


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


