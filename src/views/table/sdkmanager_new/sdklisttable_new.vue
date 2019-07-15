<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;margin-right: 20px" type="primary" icon="el-icon-edit"
                 @click="handleCreate">添加SDK
      </el-button>
      <el-input placeholder="根据SDK类型名称二次筛选" v-model="sdk_type_name_search"
                style="width: 200px;margin-top: 10px;margin-left: 20px" class="filter-item" clearable/>
      <el-input placeholder="根据SDK类型标记二次筛选" v-model="sdk_type_tag_search"
                style="width: 200px;margin-top: 10px;margin-left: 10px" class="filter-item" clearable/>
      <el-button @click="searchTable()">搜索</el-button>
      <el-button border style="" @click="dialogMessageVisible=true" type="info">SDK模版添加说明</el-button>
    </div>
    <el-table
      height="740"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      highlight-current-row>
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope1">
          {{ ++scope1.$index }}
        </template>
      </el-table-column>
      <el-table-column label="SDK名称" prop="sdk_type_name">
      </el-table-column>
      <el-table-column label="SDK搜索标记" prop="sdk_type_tag">
      </el-table-column>
      <el-table-column label="版本" prop="sdk_type_version">
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width"
                       v-if="checkPermission(['admin','director'])">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editSDKType(scope.row)">{{ "编辑" }}</el-button>
          <el-button size="mini" type="danger" @click="handleDel(scope.row)">删除</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%" :close-on-click-modal=false>
      <el-form ref="dataForm" :model="sdk_type" label-position="left" label-width="150px" :inline="true"
               style="margin-left:50px;" status-icon>
        <el-form-item label="SDK类型名称" class="filter-item" :rules="[{ required: true, message: 'SDK类型名称不能为空'}]"
                      prop="sdk_type_name"
                      style="margin-right: 80px">
          <el-input v-model="sdk_type.sdk_type_name" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="SDK类型标记" :rules="[{ required: true, message: 'SDK类型标记不能为空'}]" prop="sdk_type_tag"
                      label-width="120px">
          <el-input v-model="sdk_type.sdk_type_tag" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="SDK类型版本" :rules="[{ required: true, message: '版本不能为空'}]" prop="sdk_type_version"
                      style="margin-right: 83px">
          <el-input v-model="sdk_type.sdk_type_version" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <br/>
        <el-button @click="addDomain" style="margin-bottom: 15px" type="primary">新增参数</el-button>
        <br/>
        <!--动态增减表单项-->
        <el-form-item v-for="(domain, index) in sdk_type.domains" :key="domain.sdk_param_type_guid+index">
          <div>
            <span style="font-weight: 700;font-family:Microsoft YaHei;font: 14px bolder;color: #606266;">参数名：</span>
            <el-input v-model="domain.sdk_param_type_name" style="width: 300px;margin-right: 5px" placeholder="必填"/>
            <span style="font-weight: 900;font-family:Microsoft YaHei;font: 14px bolder;color: #606266;">类型：</span>
            <el-select v-model="domain.sdk_param_type_type" style="width: 150px" value=0>
              <el-option
                v-for="item in options"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            
            <span style="font-weight: 700;font-family:Microsoft YaHei;font: 14px bolder;color: #606266;">权重：</span>
            <el-input-number v-model="domain.sdk_param_type_weight"   label="描述文字" disabled></el-input-number>
            <el-button @click.prevent="moveUp(index)" style="margin-right: 35px">上移
            </el-button>

            <el-button @click.prevent="removeDomain(domain)" style="margin-right: 35px"
                       class="el-button el-button--danger">删除
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消'}}</el-button>
        <el-button type="primary" v-if="dialogStatus==='create'" @click="createData()">{{ '确认添加' }}</el-button>
        <el-button type="primary" v-if="dialogStatus==='update'" @click="updateData()">{{ '确认修改' }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogMessageVisible" width="60%">
      <h1 style="margin-left:30px ">SDK模版添加说明</h1>
      <div style="background-color: #d3dce6;padding: 20px;border-radius: 10px;border-bottom: #001528 solid 1px">
        <span style="font-size: x-large">注意：   <br>
         1.参数和参数名中 - 和 ; 具有特殊含义，注意使用  <br>
         2.类型为输入框时，参数无效（默认即可）  <br>
        </span><br>
      </div>
      <div style="font-size: 16px;font-family:Helvetica Neue">
        <div style="background-color:#d3dce6;padding: 20px;border-radius: 10px;border-bottom: #001528 solid 1px">
          <span>1.SDK模版普通   </span><br>
          <span>正常填写即可，类型默认选择输入框，效果如下 ：  ↘  </span><br>
          <img src="@/assets/message/普通.png" style="margin-left: 30px"><br/>
        </div>
        <div style="background-color: #d3dce6;padding: 20px;border-radius: 10px;border-bottom: #001528 solid 1px ">
          <span>2.SDK模版下拉框   </span><br>
          <img src="@/assets/message/下拉选框.png" style="margin-left: 30px"><br/>
          <span style="font-size: x-large">方法：参数部分的各个选项用输入法英文状态下的分号(;)分割 ，默认值为第一个参数，同时类型选择选择器 </span><br>
          <span style="font-size: x-large">如下：  ↘ </span><br>
          <img src="@/assets/message/下拉选框编辑.png" style="margin-left: 30px"><br/>
        </div>
        <div style="background-color:#d3dce6;padding: 20px;border-radius: 10px;border-bottom: #001528 solid 1px">
          <span>3.SDK模版输入框可选按钮   </span><br>
          <img src="@/assets/message/输入框可选按钮.gif" style="margin-left: 30px"><br>
          <span style="font-size: x-large">方法：参数名部分用输入法英文状态下的破折号(-)分割 ，同时类型选择输入框 </span><br>
          <span style="font-size: x-large">如下：  ↘ </span><br>
          <img src="@/assets/message/输入框可选框.png" style="margin-left: 30px"><br/>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {
    addSDKTypeMeth,
    getSDKTypeMeth,
    editSDKTypeMeth,
    delSDKTypeMeth,
    getSDKParamTypeMeth,
    delSDKParamTypeMeth
  } from '@/api/sdkmanager_new/sdklisttable_new'


  export default {
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
        sdk_type_param: [],
        sdk_type: {
          sdk_type_name: '',
          sdk_type_tag: '',
          sdk_type_version: '',
          domains: [],
        },
        sdk_type_name_search: '',
        sdk_type_tag_search: '',
        pageSize: 30,
        totalPages: 0,
        currentPage: 1,
        dialogMessageVisible: false,
        options: [{
          value: '0',
          label: '输入框'
        }, {
          value: '2',
          label: '布尔值'
        }, {
          value: '3',
          label: '广告位'
        }],
        value: '',
        update_flag: true,
        checked1: false,
        dataForm: {
          name: '',
          version: '',
          mark: '',
        },
        secondary_sdk_name: '',
        secondary_sdk_mark: '',
        list: [],
        listLoading: false,
        dialogStatus: '',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        sdk: {
          id: '',
          name: '',
          version: '',
          mark: '',
          sdkstatus: '1',
          form: {
            domains: [],
          }
        },
        hidlist: ''
      }
    },
    created() {
      this.pageChange(1)
    },
    methods: {
      weightReset(){
          //将domains内数组每个sdk_param_type_weight的值改为其数组的位置
          for(let i = 0 ; i <this.sdk_type.domains.length;i++){
            this.$set(this.sdk_type.domains[i],'sdk_param_type_weight',i)
          }
      },//重新设置权重
      moveUp(i){
        console.log(i)
        if(i!=0){
          let tempOption = this.sdk_type.domains[i - 1];
          this.$set(this.sdk_type.domains, i - 1, this.sdk_type.domains[i]);
          this.$set(this.sdk_type.domains, i,tempOption)
          this.weightReset()
        }
      },//sdk参数类型上移
      handleDel(param) {
        let tothis = this
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('删除对象', param)
          delSDKTypeMeth(param).then(response => {
            if (response.repcode === 3000) {
              tothis.$notify({
                title: '成功',
                message: '删除sdk类型成功',
                type: 'success',
                duration: 2000
              })
              //对话框关闭
              this.dialogFormVisible = false
              this.pageChange(this.currentPage)
            } else {
              console.error(response.data)
            }
          }).catch(error => {
            console.error(error)
            tothis.$notify({
              title: '失败',
              message: '删除sdk类型失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(()=>{})
      },//删除sdk类型
      searchTable() {
        this.pageChange(1)
      },//搜索sdk类型
      editSDKType(param) {
        let tothis=this
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.sdk_type = {
          id:param.id,
          sdk_type_guid: param.sdk_type_guid,
          sdk_type_name: param.sdk_type_name,
          sdk_type_tag: param.sdk_type_tag,
          sdk_type_version: param.sdk_type_version,
          domains:[]
        }
        console.log('编辑对象', param)
        this.dialogStatus = 'update'
        let getParam={
          sdk_type_guid: param.sdk_type_guid
        }
        getSDKParamTypeMeth(getParam).then(response=>{
          console.log('编辑对象参数类型', response.data)
          tothis.sdk_type.domains=response.data;
          tothis.weightReset()
        }).catch(error=>{
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//编辑sdk类型
      checkPermission,
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
          sdk_type_name: this.sdk_type_name_search,
          sdk_type_tag: this.sdk_type_tag_search,
        }
        getSDKTypeMeth(param).then(response => {
          if (response.repcode === 3000) {
            console.log(response)
            this.list = response.data
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
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//分页切换
      createData() {
        let tothis = this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //验证每个参数列表的每个参数名是否填写
            let domains = this.sdk_type.domains
            for (let i = 0; i < domains.length; i++) {
              if (domains[i].sdk_param_type_name === '') {
                this.$notify({
                  title: '警告！',
                  message: '第' + (i + 1) + '条参数参数名未填写',
                  type: 'error',
                  duration: 2000
                })
                return
              }
            }
            console.log('创建sdk类型对象', this.sdk_type)
            addSDKTypeMeth(this.sdk_type).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '创建sdk类型成功',
                  type: 'success',
                  duration: 2000
                })
                //对话框关闭
                this.dialogFormVisible = false
                this.pageChange(this.currentPage)
              } else {
                console.error(response.data)
              }
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '失败',
                message: '添加失败',
                type: 'error',
                duration: 2000
              })
            })
          } else {
            return false;
          }
        })
      },//添加sdk类型
      updateData() {
        let tothis = this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            //验证每个参数列表的每个参数名是否填写
            let domains = this.sdk_type.domains
            for (let i = 0; i < domains.length; i++) {
              if (domains[i].sdk_param_type_name === '') {
                this.$notify({
                  title: '警告！',
                  message: '第' + (i + 1) + '条参数参数名未填写',
                  type: 'error',
                  duration: 2000
                })
                return
              }
            }
            console.log('更新的sdk类型对象', this.sdk_type)
            editSDKTypeMeth(this.sdk_type).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '更新sdk类型成功',
                  type: 'success',
                  duration: 2000
                })
                //对话框关闭
                this.dialogFormVisible = false
                this.pageChange(this.currentPage)
              } else {
                console.error(response.data)
              }
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '失败',
                message: '添加失败',
                type: 'error',
                duration: 2000
              })
            })

          } else {
            return false;
          }
        })
      },//编辑方法
      removeDomain(item) {
        let tothis=this
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSDKParamTypeMeth(item).then(response=>{
            if (response.repcode===3000){
              let index = this.sdk_type.domains.indexOf(item)
              if (index !== -1) {
                this.sdk_type.domains.splice(index, 1)
              }
            } else {
               console.error(response)
            }
          }).catch(error=>{
            console.error(error)
            tothis.$notify({
              title: '失败',
              message: '添加失败',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(()=>{})
      },//删除参数行
      addDomain() {
        let obj = {
          sdk_param_type_guid: new Date().getTime()+'',
          sdk_param_type_type: '0',
          sdk_param_type_name: '',
          sdk_param_type_weight:0,
        }
        let list = []
        list = list.concat(this.sdk_type.domains)
        list.push(obj)
        this.sdk_type.domains = list;
        console.log(this.sdk_type)
      },//添加参数行
      resetTemp() {
        this.sdk_type = {
          sdk_type_name: '',
          sdk_type_tag: '',
          sdk_type_version: '',
          domains: [],
        }
      },//重置sdk
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },//创建对话框
    }
  }
</script>
<style>
  .dia-input {
    width: 300px;
  }

  .demo-table-expand {
    font-size: 0;

  }

  .demo-table-expand label {
    width: 300px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    border-bottom: #d3dce6 solid 1px;
  }

</style>
