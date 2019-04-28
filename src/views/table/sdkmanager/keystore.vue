<template>
  <div class="components-container">

    <div class="editor-container">
      <el-button border style="margin: 20px" @click="dialogMessageVisible=true" type="info" v-if="checkPermission(['admin','director'])"
                 size="mini">上传keystore
      </el-button>
    </div>
    <el-dialog :visible.sync="dialogMessageVisible" width="80%" title="上传keystore" append-to-body>
      <div style="margin: auto">
        <el-upload
          :action="resPath"
          :headers="dataObj"
          :data="param"
          drag
          accept=".keystore"
          :multiple="true"
          :on-success="dropzoneS"
          :before-upload="beforeUpload"
          style="width:360px">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">keystore上传</div>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="uploadresponse" v-html="value"
             style="padding: 30px;font-family: 微软雅黑;line-height: 22px;font-size: 15px"></div>
      </div>
    </el-dialog>

    <el-card shadow="always" v-loading="listLoading">
      <el-table
        height="780"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date1"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="keystoreName"
          label="文件名"
          width="300">
        </el-table-column>
        <el-table-column
          prop="MD5"
          label="MD5"
          width="300">
        </el-table-column>
        <el-table-column
          prop="SHA1"
          label="SHA1"
          width="300">
        </el-table-column>
        <el-table-column
          prop="SHA256"
          label="SHA256">
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin','director'])"
          label="操作">
          <template slot-scope="scope">
            <span>
            <el-button @click="handleEdit(scope.row)" type="text" v-loading="downloadLoading">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" v-loading="downloadLoading">删除</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="编辑"
      :visible.sync="EditDialog"
      width="40%">
      <el-form :model="form" status-icon ref="form" label-width="100px" class="demo-ruleForm" :inline="false">
        <div>
          <el-form-item label="日期" prop="date1" label-width="200px">
            <el-input v-model="form.date1" style="width: 300px;" disabled></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="文件名" prop="filename" label-width="200px">
            <el-input v-model="form.filename" style="width: 300px;" disabled></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="keystorePass" prop="keystorePass"
                        :rules="[{ required: true, message: 'keystorePass不能为空'}]" label-width="200px">
            <el-input v-model="form.keystorePass" style="width: 300px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="keyaliasName" prop="keyaliasName"
                        :rules="[{ required: true, message: 'keyaliasName不能为空'}]" label-width="200px">
            <el-input v-model="form.keyaliasName" style="width: 300px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="keyaliasPass" prop="keyaliasPass"
                        :rules="[{ required: true, message: 'keyaliasPass不能为空'}]" label-width="200px">
            <el-input v-model="form.keyaliasPass" style="width: 300px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="MD5" prop="MD5"
                        :rules="[{ required: true, message: 'MD5不能为空'}]" label-width="200px">
            <el-input v-model="form.MD5" style="width: 300px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="SHA1" prop="SHA1"
                        :rules="[{ required: true, message: 'SHA1不能为空'}]" label-width="200px">
            <el-input v-model="form.SHA1" style="width: 300px;"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="SHA256" prop="SHA256"
                        :rules="[{ required: true, message: 'SHA256不能为空'}]" label-width="200px">
            <el-input v-model="form.SHA256" style="width: 300px;"></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import Dropzone from '@/components/Dropzone'
  import {getToken} from '@/utils/auth'
  import {fetchKeystoreInfo, getFile, delFile, updateKeystore,uploadKeystore,delKeystore} from '@/api/table/sdkmanager/keystore'
  import checkPermission from '@/utils/permission' // 权限判断函数

  export default {
    name: 'DropzoneDemo',
    components: {Dropzone},
    data() {
      return {
        resPath: 'http://192.168.1.144:8091/file',
        form: {},
        EditDialog: false,
        param: {
          'keystore': 'keystore'
        },
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
      checkPermission,
      submitForm(formName) {
        let tothis = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            updateKeystore(this.form).then(response => {
              console.log(response.toString())
              tothis.downloadLoading = false
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '修改除成功',
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
              this.EditDialog = false
              this.listFileInfo();
            }).catch(function (rs) {
              console.log(rs.toString())
              tothis.downloadLoading = false
              tothis.$notify({
                title: '修改失败',
                message: '刷新试试',
                type: 'error',
                duration: 2000
              })
            })
          } else {
            return false;
          }
        });
      },
      handleEdit(param) {

        this.EditDialog = true
        this.form = {
          date1: param.date1,
          filename: param.keystoreName,
          fileguid: param.keystoreguid,
          keystorePass: param.keystorePass,
          keyaliasName: param.keyaliasName,
          keyaliasPass: param.keyaliasPass,
          MD5: param.MD5,
          SHA1: param.SHA1,
          SHA256: param.SHA256,
        }
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
        })
      },
      handleDelete(param) {
        let param1={
          guid:param.keystoreguid
        }
        let tothis = this;
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delKeystore(param1).then(response => {
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
        this.tableData=[]
        fetchKeystoreInfo().then(response => {
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
        let maxsize = 100 * 1024
        if (file.size > maxsize) {
          this.$message.error('上传失败，文件超过100KB');
          return false
        }
        this.dataObj.Authorization = 'Bearer ' + getToken()
      },//上传前事件
      dropzoneS(response) {
        let tothis=this
        console.log(response.data)
        let param={
          finalFilename:response.file,
          guid:response.data.guid
        }
        uploadKeystore(param).then(response=>{
          if (response.repcode===3000){
            this.$message({message: 'keystore 上传成功！', type: 'success'})
            this.listFileInfo();
          } else {
            tothis.$notify({
              title: '上传失败',
              message: '刷新试试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error=>{
          console.error(error)
          tothis.$notify({
            title: '上传失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
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


