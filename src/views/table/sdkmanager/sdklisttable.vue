<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;margin-right: 20px" type="primary" icon="el-icon-edit"
                 @click="handleCreate">添加SDK
      </el-button>
      <!--<el-select v-model="chooseName" :placeholder="'选择游戏'" style="width: 140px" class="filter-item">-->
      <!--<el-option v-for="item in names" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <el-input placeholder="根据SDK名称二次筛选" v-model="secondary_sdk_name"
                style="width: 200px;margin-top: 10px;margin-left: 10px" class="filter-item" clearable
                @blur="getDatawithParam"/>
      <el-input placeholder="根据SDK标记二次筛选" v-model="secondary_sdk_mark"
                style="width: 200px;margin-top: 10px;margin-left: 20px" class="filter-item" clearable
                @blur="getDatawithParam"/>
      <el-checkbox v-model="checked" border style="margin-left: 15px" @change="change">展示可见</el-checkbox>
      <el-checkbox v-model="checked1" border style="margin-left: 15px" @change="change">展示隐藏</el-checkbox>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      border
      highlight-current-row>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="sdk名称:">
              <span>{{ props.row.sdk_name }}</span>
            </el-form-item>
            <el-form-item label="sdk标记:">
              <span>{{ props.row.sdk_mark }}</span>
            </el-form-item>
            <el-form-item label="版本:">
              <span>{{ props.row.sdk_version }}</span>
            </el-form-item>
            <el-form-item label="状态:">
              <span v-if="props.row.sdk_status==='0'"><el-button size="mini" type="danger">隐藏</el-button></span>
              <span v-if="props.row.sdk_status==='1'"><el-button size="mini" type="success">可见</el-button></span>
            </el-form-item>
          </el-form>
          <div>
            <el-table
              :data="props.row.paramter"
              style="width: 100%;margin-bottom: 30px;">
              <el-table-column
                prop="sdk_paramter_name"
                label="参数名"
                style="width: 15%">
              </el-table-column>
              <el-table-column
                prop="sdk_note"
                label="说明"
                style="width: 30%">
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope1">
          {{ ++scope1.$index }}
        </template>
      </el-table-column>
      <el-table-column label="SDK名称" prop="sdk_name">
      </el-table-column>
      <el-table-column label="SDK标记" prop="sdk_mark">
      </el-table-column>
      <el-table-column label="版本" prop="sdk_version">
      </el-table-column>
      <el-table-column label="状态" align="center" width="230" class-name="small-padding fixed-width" prop="sdk_status">
        <template slot-scope="scope">
          <el-button size="mini" type="success" v-if="scope.row.sdk_status==='1'">可见</el-button>
          <el-button size="mini" type="danger" v-if=" scope.row.sdk_status==='0'">隐藏</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ "编辑" }}</el-button>
          <el-button size="mini" type="success" @click="validUpdate(scope.row)">可见</el-button>
          <el-button size="mini" type="danger" @click="invalidUpdate(scope.row)">隐藏</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :model="sdk" label-position="left" label-width="100px" :inline="true"
               style="margin-left:50px;" status-icon>
        <el-form-item label="名称" :rules="[{ required: true, message: '名称不能为空'}]" prop="name" style="margin-right: 100px">
          <el-input v-model="sdk.name" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="版本" :rules="[{ required: true, message: '版本不能为空'}]" prop="version">
          <el-input v-model="sdk.version" placeholder="必填~" class="dia-input"/>
        </el-form-item><br>
        <el-form-item label="标记" class="filter-item" :rules="[{ required: true, message: '标记不能为空'}]" prop="mark" style="margin-right: 100px" v-if="this.dialogStatus === 'create'">
          <el-input v-model="sdk.mark" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="sdk.sdkstatus" active-color="#13ce66" inactive-color="#ff4949"
                     active-value="1" inactive-value="0"
                     active-text="有效" inactive-text="无效">
          </el-switch>
        </el-form-item>
        <br/>
        <el-button @click="addDomain" style="margin-bottom: 15px" type="primary">新增</el-button>
        <br/>
        <!--动态增减表单项-->
        <el-form-item v-for="(domain, index) in sdk.form.domains" :key="domain.key+index">
          <div>
            <span style="font-weight: 700;font-family:Microsoft YaHei;font: 14px bolder;color: #606266;">参数名：</span>
            <el-input v-model="domain.sdk_paramter_name" style="width: 150px;margin-right: 5px" placeholder="必填"/>
            <!--<span style="font-weight: 700;font-family:Microsoft YaHei;font: 14px bolder;color: #606266;">参数：</span>-->
            <!--<el-input v-model="domain.param" style="width: 320px;margin-right: 5px" placeholder="必填"/>-->
            <span style="font-weight: 900;font-family:Microsoft YaHei;font: 14px bolder;color: #606266;">备注：</span>
            <el-input type="textarea" v-model="domain.sdk_note" style="width: 500px;margin-right: 5px"
                      placeholder="必填"/>
            <el-button @click.prevent="removeDomain(domain)" style="margin-right: 35px"
                       class="el-button el-button--danger el-button--mini">删除
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消'}}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ '确认' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {createSdk, getSdk, updateSdk, getChannel} from '@/api/table/sdkmanager/sdklisttable'
  import {getName, getResourceName} from '@/api/table/sdkmanager/sdklisttable'

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
        update_flag:true,
        create_flag:true,
        checked: true,
        checked1: false,
        dataForm: {
          name: '',
          version: '',
          mark: '',
        },
        secondary_sdk_name: '',
        secondary_sdk_mark: '',
        chooseName: '选择游戏',
        tableData: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        layout: '',
        hidtimevalue: '',
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          importance: undefined,
          title: undefined,
          type: undefined,
        },
        listParam: {
          start: '',
          end: ''
        },
        names: [],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
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
          sdkstatus: '0',
          form: {
            domains: [],
          }
        },
        hidlist: ''
      }
    },
    created() {
      this.listdata()
    },
    methods: {
      validUpdate(param) {
        if (param.sdk_status === '0') {
          this.sdk.id = param.id
          this.sdk.form.domains = param.paramter
          this.sdk.name = param.sdk_name
          this.sdk.mark = param.sdk_mark
          this.sdk.sdkstatus = param.sdk_status
          this.sdk.version = param.sdk_version
          this.sdk.sdkstatus = '1'
          this.updateData()
          this.listdata()
        }
      },//有效按钮
      invalidUpdate(param) {
        if (param.sdk_status === '1') {
          this.sdk.id = param.id
          this.sdk.form.domains = param.paramter
          this.sdk.name = param.sdk_name
          this.sdk.mark = param.sdk_mark
          this.sdk.sdkstatus = param.sdk_status
          this.sdk.version = param.sdk_version
          this.sdk.sdkstatus = '0'
          this.updateData()
          this.listdata()
        }
      },//无效按钮
      listdata() {
        let tothis = this
        tothis.listLoading = true
        getSdk().then(response => {
          this.list = response.data
          this.hidlist = response.data
          this.getDatawithParam()
          tothis.listLoading = false
        }).catch(result => {
          tothis.$notify({
            title: '失败',
            message: '获取sdk模版列表失败',
            type: 'error',
            duration: 2000
          })
        })
      },//展示sdk模版
      change() {
        this.getDatawithParam()
      },//二次筛选方法
      createData() {
        let tothis = this
        if (!this.valideSdkForm()) {
          return
        }
        if (!this.create_flag){
          return
        }
        this.create_flag=false
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createSdk(this.sdk).then(response => {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.listdata()
              this.dialogFormVisible = false
            }).catch(result => {
              tothis.$notify({
                title: '失败',
                message: '添加失败',
                type: 'error',
                duration: 2000
              })
            })
            this.dialogFormVisible = false
          } else {
            return false;
          }
        })
        setTimeout(()=>{
          this.create_flag=true
        },1500)
      },//添加sdk模版
      removeDomain(item) {
        var index = this.sdk.form.domains.indexOf(item)
        if (index !== -1) {
          this.sdk.form.domains.splice(index, 1)
        }
      },//删除参数行
      addDomain() {
        this.sdk.form.domains.push({
          key: '',
          sdk_paramter_name: '',
          sdk_note: '暂无'
        });
      },//添加参数行
      resetTemp() {
        this.sdk = {
          id: '',
          name: '',
          version: '',
          mark: '',
          sdkstatus: '0',
          form: {
            domains: [],
          }
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
      valideSdkForm() {
        let flag=true
        let difference=false
        for (let i=0;i<this.hidlist.length;i++){
          if (this.hidlist[i].sdk_mark===this.sdk.mark){
            difference=true
          }
        }
        if (difference&&this.dialogStatus === 'create'){
          this.$notify({
            title: '警告！',
            message: 'SDK标记不允许重复,请及时修改！',
            type: 'warning',
            duration: 2000
          })
          if( this.dialogStatus !== 'update'){
            flag=false
          }
        }
        let emptylist = [];
        for (let i = 0; i < this.sdk.form.domains.length; i++) {
          if (this.sdk.form.domains[i].sdk_paramter_name === '' || this.sdk.form.domains[i].sdk_note === '') {
            emptylist.push(i + 1)
          }
        }
        if (emptylist.length != 0) {
          this.$notify({
            title: '警告！',
            message: '第' + emptylist + '条参数存在空值',
            type: 'error',
            duration: 2000
          })
          flag=false
        }
        return flag
      },//对话框验证
      handleUpdate(param) {
        this.sdk.id = param.id
        this.sdk.form.domains = param.paramter
        this.sdk.name = param.sdk_name
        this.sdk.mark = param.sdk_mark
        this.sdk.sdkstatus = param.sdk_status
        this.sdk.version = param.sdk_version
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },//对话框展示
      updateData() {
        let tothis=this
        if (!this.valideSdkForm()){
          return
        }
        if (!this.update_flag){
          return
        }
        this.update_flag=false
        updateSdk(this.sdk).then(response => {
          this.update_flag=true
          this.listdata()
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.listLoading = false
          this.dialogFormVisible = false
        }).catch(err => {
          this.update_flag=true
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
        })

      },//更新sdk
      getDatawithParam() {
        this.listLoading = true
        let sdk_name = this.secondary_sdk_name
        let data = []
        for (let i = 0; i < this.hidlist.length; i++) {
          if (this.hidlist[i].sdk_name.search(sdk_name) != -1) {
            data.push(this.hidlist[i])
          }
        }
        let sdk_mark = this.secondary_sdk_mark
        let data1 = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].sdk_mark.search(sdk_mark) != -1) {
            data1.push(data[i])
          }
        }

        let statuse = this.checked
        let data2 = []
        if (statuse === true) {
          for (let i = 0; i < data1.length; i++) {
            if (data1[i].sdk_status === '1') {
              data2.push(data1[i])
            }
          }
        } else {
          data2 = data1
        }

        let statuse1 = this.checked1
        let data3 = []
        if (statuse1 === true) {
          for (let i = 0; i < data2.length; i++) {
            if (data2[i].sdk_status === '0') {
              data3.push(data2[i])
            }
          }
        } else {
          data3 = data2
        }
        if (statuse1 === true && statuse === true) {
          data3 = data1
        }
        this.list = data3
        this.listLoading = false
      },//二次筛选
      // formatJson(filterVal, jsonData) {
      //   return jsonData.map(v => filterVal.map(j => v[j]))
      // },
      formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        };
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
          }
        }
        return fmt;
      },//时间转换
      padLeftZero(str) {
        return ('00' + str).substr(str.length);
      }//时间转换
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
