<template>
  <div class="components-container">
    <el-button type="primary" style="margin: 20px" @click="fodderDialogVisible=true">添加</el-button>
    <el-card shadow="always" style="margin: 20px;margin-top: -10px">
      <el-table
        height="700"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="date"
          label="上传时间">
        </el-table-column>
        <el-table-column
          prop="qiniu_file_name"
          label="文件名">
        </el-table-column>
        <el-table-column
          label="预览">
          <template slot-scope="scope">
            <span @click="bigPicture(scope.row.qiniu_file_path)" style="width: 100%"><img
              :src="scope.row.qiniu_file_path" min-width="70" height="70"/></span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin','director'])"
          label="操作">
          <template slot-scope="scope">
            <el-button style="margin: 20px" @click="delRecord(scope.row)">删除</el-button>
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
    </el-card>
    <el-dialog
      title="大图预览"
      :visible.sync="previewDialogVisible">
      <img :src=picture
      />
    </el-dialog>
    <el-dialog
      title="素材上传"
      style="height: 600px"
      :visible.sync="fodderDialogVisible">
      <div style="margin: 20px">
        1.只能图片，且不超过100kb<br>
        2.上传图片注意命名格式,命名中应包含游戏名缩写<br>
        例如 MHXXX-ICON1
      </div>
      <el-upload
        :action="uploadQiniuUrl"
        ref="upload"
        list-type="picture-card"
        :before-upload="beforeUpload"
        :auto-upload=false
        :on-success="uploadSuccess1"
        :on-error="uploadFail1"
        :on-preview="handlePictureCardPreview">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

      <el-button type="primary" class="buttonupload" @click="submitUpload" style="margin: 20px">上传图片</el-button>

    </el-dialog>
  </div>
</template>

<script>
  import {getToken} from '@/utils/auth'
  import {uploadFodder, listFodder, getQiNiuToken, listQiNiufodder} from '@/api/shieldingsystem/channelPromo'
  import {delQiniuFileRecordMeth,getQiniuFileLimitMeth} from '@/api/shieldingsystem/channelPromoFodder'
  import checkPermission from '@/utils/permission' // 权限判断函数

  export default {
    name: 'DropzoneDemo',
    data() {
      return {
        pageSize:20,
        totalPages:0,
        currentPage:1,
        dialogVisible: false,
        uploadQiniuUrl: 'http://filehost.tomatojoy.com:8091/qiniufile',
        tableData: [],
        hidtableData: [],
        fodderDialogVisible: false,
        fileList: [],
        previewDialogVisible: false,
        picture: '',
        dialogImageUrl: '',
      }
    },
    mounted() {
      this.pageChange(1);
    },
    methods: {
      beforeUpload(file){
        if (file.size>102400){
          this.$message.error('图片大于100K,请压缩后上传！');
          return false
        }
      },//上传前meth
      delRecord(param) {
        let params = {
          id: param.qiniu_file_guid
        }
        this.$confirm('确认删除？')
          .then(_ => {
            delQiniuFileRecordMeth(params).then(response => {
              if (response.repcode === 3000) {
                this.$message.success('删除本地记录成功！');
                this.pageChange(this.currentPage);
              } else {
                this.$message.error('删除本地记录失败！');
              }
            }).catch(error => {
              console.error(error)
              this.$message.error('删除本地记录失败！');
            })
          })
          .catch(_ => {
            return false
          });
      },//删除本地上传记录
      uploadSuccess1(response, file, fileList) {
        console.log(response)
        this.initTable();//素材库初始化
        this.fodderDialogVisible=false
      },
      uploadFail1(err, file, fileList) {
        console.log(err)
      },
      submitUpload() {   //提交上传
        this.$refs.upload.submit()
      },
      handlePictureCardPreview(file) {   //查看某张图片的原图
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      bigPicture(param) {
        this.previewDialogVisible = true
        this.picture = param
      },//大图预览
      pageChange(page){
        this.currentPage=page
        let tothis=this
        let param={
          page:page,
          limit:this.pageSize,
        }
        getQiniuFileLimitMeth(param).then(response=>{
          if(response.repcode===3000){
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
      checkPermission
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .filter_input {
    margin-right: 15px;
  }

  .filter_text {
    margin-right: 7px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 14px Base
  }

  #filter_title {
    margin-right: 40px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 13px Small;
  }

  .ts-title {
    font-size: 15px;
    font-weight: bolder
  }
</style>


