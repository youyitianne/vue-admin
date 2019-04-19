<template>
  <div class="components-container">
    <div class="editor-container">
      <el-button border style="margin: 20px" @click="addDialogMessage()" type="info"
                 v-if="checkPermission(['admin','director'])"
                 size="mini">添加
      </el-button>
    </div>
    <el-card shadow="always" v-loading="listLoading">
      <el-table
        height="780"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="companyName"
          label="公司名称">
        </el-table-column>
        <el-table-column
          prop="keystoreName"
          label="keystore名称">
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin','director'])"
          label="操作">
          <template slot-scope="scope">
            <span>
            <el-button @click="handleEdit(scope.row)" type="text" >编辑</el-button>
            <!--<el-button @click="handleDelete(scope.row)" type="text" >删除</el-button>-->
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="titleName"
      :visible.sync="dialogMessageVisible"
      width="600px">
      <el-form :model="form" status-icon ref="form" label-width="100px" class="demo-ruleForm" :inline="false">
        <div>
          <el-form-item label="公司名称" prop="companyName" label-width="200px"
                        :rules="[{ required: true, message: '公司名称不能为空'}]">
            <el-input v-model="form.companyName" style="width: 300px;" placeholder="必选"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="keystore名称" prop="keystoreName" label-width="200px"
                        :rules="[{ required: true, message: 'keystore不能为空'}]">
            <el-select v-model="form.keystoreName" placeholder="必选" style="width: 300px" filterable>
              <el-option
                v-for="item in keystoreList"
                :key="item.keystoreName"
                :label="item.keystoreName"
                :value="item.keystoreName">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button type="primary"
                     v-if="titleName==='添加公司信息'"
                     @click="addForm('form')"
                     v-loading="editLoading"
          >添加</el-button>
          <el-button type="primary"
                     v-if="titleName==='编辑公司信息'"
                     @click="submitForm('form')"
                     v-loading="editLoading"
          >编辑</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Dropzone from '@/components/Dropzone'
  import {getToken} from '@/utils/auth'
  import {fetchKeystoreInfo, getFile, delFile, updateKeystore} from '@/api/fileupload'
  import {getcompanyInfoMeth, addcompanyInfoMeth, updatecompanyInfoMeth} from '@/api/table/sdkmanager/companyInfo'
  import checkPermission from '@/utils/permission' // 权限判断函数

  export default {
    name: 'DropzoneDemo',
    components: {Dropzone},
    data() {
      return {
        editLoading:false,
        tableData: [],
        listLoading: false,
        titleName: '添加公司信息',
        dialogMessageVisible: false,
        form: {},
        keystoreList: [],
      }
    },
    mounted() {
      this.listKeyStoreInfo();//初始化keystore
      this.listCompanyInfo();//初始化公司信息
    },
    methods: {
      addDialogMessage() {
        this.titleName = '添加公司信息'
        this.dialogMessageVisible = true
        this.form = {}
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
        })
      },
      checkPermission,
      addForm(formName) {
        this.editLoading=true
        let tothis = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param={
              companyName:this.form.companyName,
              keystoreName:this.form.keystoreName
            }
            addcompanyInfoMeth(param).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '添加公司信息成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogMessageVisible=false
                this.listCompanyInfo();//初始化公司信息
              } else {
                tothis.$notify({
                  title: '添加公司信息失败',
                  message: response.data,
                  type: 'error',
                  duration: 2000
                })
              }
              tothis.editLoading=false
            }).catch(error => {
              tothis.editLoading=false
              console.error(error)
              tothis.$notify({
                title: '添加公司信息失败',
                message: '刷新试试',
                type: 'error',
                duration: 2000
              })
            })

          } else {
            return false;
          }
        });
      },//添加公司信息
      submitForm(formName){
        this.editLoading=true
        let tothis = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param={
              id:this.form.id,
              companyName:this.form.companyName,
              keystoreName:this.form.keystoreName
            }

            updatecompanyInfoMeth(param).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '修改公司信息成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogMessageVisible=false
                this.listCompanyInfo();//初始化公司信息
              } else {
                tothis.$notify({
                  title: '修改公司信息失败',
                  message: response.data,
                  type: 'error',
                  duration: 2000
                })
              }
              tothis.editLoading=false
            }).catch(error => {
              tothis.editLoading=false
              console.error(error)
              tothis.$notify({
                title: '修改公司信息失败',
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
        this.titleName='编辑公司信息'
        this.dialogMessageVisible = true
        this.form = {
          id:param.id,
          companyName: param.companyName,
          keystoreName: param.keystoreName,
        }
        this.$nextTick(() => {
          this.$refs['form'].clearValidate()
        })
      },
      handleDelete(param) {
        let tothis = this;
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          return false
        }).catch(error =>{
          return false
        });
      },//删除 todo
      listKeyStoreInfo() {
        let tothis = this;
        fetchKeystoreInfo().then(response => {
          if (response.repcode === 0) {
            this.keystoreList = response.data
            console.log(this.keystoreList)
          }else {
            tothis.$notify({
              title: '初始化keystore失败',
              message: '刷新试试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(function (rs) {
          console.log(rs)
          tothis.$notify({
            title: '初始化keystore失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//获取keystore信息
      listCompanyInfo() {
        let tothis = this;
        getcompanyInfoMeth().then(response => {
          if (response.repcode === 3000) {
            this.tableData = response.data
          } else {
            tothis.$notify({
              title: '初始化公司信息失败',
              message: '刷新试试',
              type: 'error',
              duration: 2000
            })
          }
          this.listLoading = false
        }).catch(function (rs) {
          tothis.listLoading = false
          console.log(rs)
          tothis.$notify({
            title: '初始化公司信息失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//获取公司信息
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ts-title {
    font-size: 15px;
    font-weight: bolder
  }
</style>


