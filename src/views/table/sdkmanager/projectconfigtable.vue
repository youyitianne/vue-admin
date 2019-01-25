<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;margin-right: 20px" type="primary" icon="el-icon-edit" v-if="checkPermission(['operator','admin','leader'])"
                 @click="handleCreate">添加配置表
      </el-button>
      <span style="margin-left: 15px;margin-right: 5px">游戏:</span>
      <el-select v-model="secondary_game" @change="getDatawithParam">
        <el-option key="全部" label="全部" value="">
        </el-option>
        <el-option v-for="item in app_name_list" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <span style="margin-left: 15px;margin-right: 5px">渠道:</span>
      <el-select v-model="secondary_channel" @change="getDatawithParam">
        <el-option key="全部" label="全部" value="">
        </el-option>
        <el-option v-for="item in channel_mark_list" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <!--<el-checkbox v-model="checked" border style="margin-left: 15px" @change="getDatawithParam">展示正常</el-checkbox>-->
      <!--<el-checkbox v-model="checked1" border style="margin-left: 15px" @change="getDatawithParam">显示删除状态配置表-->
      <!--</el-checkbox>-->
    </div>
    <!--<button @click="test">aasdasaaaaa</button>-->
    <el-table
      height="850"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :expand-row-keys="expands"
      :row-key='getRowKeys'
      fit
      stripe
      border
      highlight-current-row
      @expand-change="expandrowhandler">
      <el-table-column type="expand"  label="展开" width="100px">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="游戏名:">
              <span>{{ props.row.app_name }}</span>
            </el-form-item>
            <el-form-item label="包名:">
              <span>{{ props.row.package_name }}</span>
            </el-form-item>
            <el-form-item label="渠道标记:">
              <span>{{ props.row.channel_mark }}</span>
            </el-form-item>
            <el-form-item label="外部版本-在线:">
              <span>{{ props.row.version_online }}</span>
            </el-form-item>
            <el-form-item label="内部版本-在线:">
              <span>{{ props.row.versioncode_online_version }}</span>
            </el-form-item>
            <el-form-item label="外部版本-更新:">
              <span>{{ props.row.version_update }}</span>
            </el-form-item>
            <el-form-item label="内部版本_更新:">
              <span>{{ props.row.versioncode_update_version }}</span>
            </el-form-item>
          </el-form>
          <div>
            <el-table
              stripe
              border
              :data="props.row.paramter"
              style="width: 100%;margin-bottom: 30px;"
              :span-method="objectSpanMethod">
              <el-table-column
                prop="mark"
                label="模块名"
                style="width: 15%">
              </el-table-column>
              <el-table-column
                prop="param_name1"
                label="参数名"
                style="width: 15%">
              </el-table-column>
              <el-table-column
                prop="param"
                label="参数"
                style="width: 25%">
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
      <el-table-column label="包名" prop="package_name" width="400px">
      </el-table-column>
      <el-table-column label="应用名" prop="app_name">
      </el-table-column>
      <el-table-column label="渠道" prop="channel_mark">
      </el-table-column>
      <el-table-column label="外部版本-在线" prop="version_online">
      </el-table-column>
      <el-table-column label="外部版本-更新" prop="version_update">
      </el-table-column>
      <el-table-column label="内部版本-在线" prop="versioncode_online_version">
      </el-table-column>
      <el-table-column label="内部版本-更新" prop="versioncode_update_version">
      </el-table-column>

      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width"
                       v-if="checkPermission(['operator','admin','leader'])">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)" >{{ "编辑" }}</el-button>
          <!--<el-button type="success" size="mini" @click="publish(scope.row)">发布</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%" :close-on-click-modal=false>
      <el-form ref="dataForm" :model="sdk" label-position="left" label-width="150px" :inline="true"
               style="margin-left:50px;" status-icon id="form-custom">
        <el-form-item label="时间" class="filter-item" v-if="this.dialogStatus === '1'">
          <el-date-picker v-model="sdk.timevalue" type="datetime" :disabled=true>
          </el-date-picker>
        </el-form-item>
        <div>
          <el-form-item label="游戏名" :rules="[{ required: true, message: '游戏名不能为空'}]" prop="app_name" v-if="this.dialogStatus === 'update'">
            <el-input v-model="sdk.app_name" placeholder="必填~" class="dia-input"/>
          </el-form-item>
        </div>
        <el-form-item label="包名" :rules="[{ required: true, message: '包名不能为空'}]" prop="package_name" v-if="this.dialogStatus === 'update'" >
          <el-input v-model="sdk.package_name" placeholder="必填~" class="dia-input" disabled/>
        </el-form-item>
        <el-form-item label="渠道标记" :rules="[{ required: true, message: '渠道不能为空'}]" prop="channel_mark" v-if="this.dialogStatus === 'update'" >
          <el-select v-model="sdk.channel_mark" disabled>
            <el-option
              v-for="item in channel_mark_list_dia"
              :key="item.name"
              :label="item.program_mark"
              :value="item.program_mark">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="包名" :rules="[{ required: true, message: '包名不能为空'}]" prop="package_name" v-if="this.dialogStatus === 'create'" >
          <el-input v-model="sdk.package_name" placeholder="必填~" class="dia-input"  />
        </el-form-item>
        <el-form-item label="渠道标记" :rules="[{ required: true, message: '渠道不能为空'}]" prop="channel_mark" v-if="this.dialogStatus === 'create'" >
          <el-select v-model="sdk.channel_mark"   >
            <el-option
              v-for="item in channel_mark_list_dia"
              :key="item.name"
              :label="item.program_mark"
              :value="item.program_mark">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外部版本-在线" class="filter-item" :rules="[{ required: true, message: '外部版本-在线不能为空'}]" v-if="this.dialogStatus === 'update'"
                      prop="version_online_version">
          <el-input v-model="sdk.version_online_version" placeholder="必填~" class="dia-input" onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')" />
        </el-form-item>
        <el-form-item label="外部版本-更新" :rules="[{ required: true, message: '外部版本-更新不能为空'}]"v-if="this.dialogStatus === 'update'"
                      prop="version_update_version">
          <el-input v-model="sdk.version_update_version" placeholder="必填~" class="dia-input"  onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')" />
        </el-form-item>
        <el-form-item label="内部版本-在线" :rules="[{ required: true, message: '内部版本-在线不能为空'}]" v-if="this.dialogStatus === 'update'"
                      prop="versioncode_online_version">
          <el-input v-model="sdk.versioncode_online_version" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="内部版本_更新" :rules="[{ required: true, message: '内部版本_更新不能为空'}]" v-if="this.dialogStatus === 'update'"
                      prop="versioncode_update_version">
          <el-input v-model="sdk.versioncode_update_version" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <br/>
        <!--筛选输入框-->
        <el-input placeholder="SDK模版筛选" v-model="sdk_template_name" v-if="this.dialogStatus === 'update'"
                  style="width: 200px;margin-bottom: 10px" class="filter-item" clearable @keyup.native="getchannelmarklist"
                  @change="getchannelmarklist"/>
        <!--多选框 sdk模版控制-->
        <el-checkbox-group v-model="checkedSdkTemplate" style="border-bottom: 15px" size="mini"  v-if="this.dialogStatus === 'update'">
          <el-checkbox v-for="name in sdkTemplate" :label="name.mark" :key="name.mark" @change="findSdkTemplate" :value="name.name" border>
            <div class="grid-content bg-purple-light" style="width: 107px;margin-bottom: 15px">{{name.mark}}</div>
          </el-checkbox>
        </el-checkbox-group>
        <br/>
        <!--标签页-->
        <el-tabs tab-position="left" style="width: 95%;background-color: #f4f4f5;height: 500px;padding: 1px" id="test1" v-if="this.dialogStatus === 'update'"
                 @tab-click="findtabname" type="border-card">
          <el-tab-pane v-for="name in checkedSdkTemplate" :label="name" :key="name"
                       style="font-size: 14px;font-family: Microsoft YaHei;width: 100%">
            <div name="pane_form" style="height: 500px;overflow: auto;">
              <!--标签页内多选框-->
              <el-checkbox-group
                size="mini"
                v-model="dialog_secondary_checked"
                v-if="dialog_secondary_visual"
                style="margin-bottom: 15px">
                <el-checkbox-button v-for="name in dialog_secondary_list" :label="name" :key="name"
                                    style="margin-left: 0px">{{name}}
                </el-checkbox-button>
              </el-checkbox-group>
              <template v-for="option in options">
                <div style="font-size: 16px;font-family: Microsoft YaHei;margin-top: 8px;margin-bottom: 8px"
                     v-if="test1(option.sdk_name)">
                  {{option.param_name}}:
                  <el-select v-model="option.value">
                    <el-option
                      v-for="item in option.param"
                      :key="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </template>

              <!--标签页内表单-->
              <el-form-item v-for="(domain, index) in sdk.form.domains" :key="domain.key+index"
                            v-if="form_item_filter(domain)" style="margin-right: 1px"
                            v-model="page_name">
                <div>
                  <span style="margin-right: 20px;font-size: 14px;font-family: Microsoft YaHei">
                    {{domain.param_name1}}：
                  </span>
                  <el-input v-model="domain.param" style="width: 300px;margin-right: 25px" placeholder="必填"/>
                </div>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogFormVisible = false">{{ '取消'}}</el-button>-->
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ '确认' }}</el-button>
        <el-button type="success" @click="test()" v-if="dialogStatus==='update'">发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {
    getProjectConfigPublish,
    createProjectConfig,
    getProjectConfig,
    updateProjectConfig,
    getSdkTemplate,
    getChannel
  } from '@/api/table/sdkmanager/projectconfigtable'
  import {getName, getResourceName} from '@/api/table/sdkmanager/projectconfigtable'

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
        rowvalue:'',
        tag_name: '',
        options: [],
        value: [],
        page_name: '',  //初始值  一直为 ''
        dialog_secondary_checked: [],
        dialog_secondary_list: [],
        dialog_secondary_visual: false,
        app_name_list: [],
        spanArr: [],
        filter_form_name: '暂无',
        update_flag: true,
        create_flag: true,
        sdk_template_name: '',
        channel_mark_list: [],
        sdkTemplatelibrary: [],
        checkedSdkTemplate: [],
        sdkTemplate: [],
        hidsdkTemplate: [],
        checked: true,
        checked1: false,
        dataForm: {
          app_name: '',
          package_name: '',
          channel_mark: '',
          version_online_version: '',
          version_update_version: '',
          versioncode_online_version: '',
          versioncode_update_version: '',
          sdk_config: '',
        },
        secondary_channel: '',
        secondary_game: '',
        chooseName: '选择游戏',
        listLoading: true,
        names: [],
        tableData: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        directives: {waves},
        downloadLoading: false,
        layout: '',
        timevalue: '',
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
        dialogStatus: '',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        sdk: {
          second_checked:[],
          checked:[],
          id: '',
          timevalue: '',
          app_name: '',
          package_name: '',
          channel_mark: '',
          version_online_version: '',
          version_update_version: '',
          versioncode_online_version: '',
          versioncode_update_version: '',
          sdk_config: '',
          sdkstatus: '1',
          sdk_require: '',
          note: '',
          publish: '0',
          form: {
            domains: [],
            select: []
          }
        },
        hidlist: '',
        channel_mark_list_dia: [],
        publishlist: [],
        expands: [],
        getRowKeys(row) {
          return row.id
        },
      }
    },
    created() {
      this.initchannel()  //获取渠道
      this.initTemplate()   //获取sdk模版
      this.initDate()   //初始化日期查询数据
    },
    methods: {
      test1(name) {
        if (name === this.tag_name) {
          return true
        }
        return false
      },
      test() {
       this.publish(this.rowvalue)
      },
      findtabname(tab, event) {
        this.tag_name = tab.label
        this.change_pagename(tab.label)
      },//获取对话框内标签页 名触发事件
      publish(param) {
        let tothis = this
        // this.sdk.id = param.id
        // this.sdk.timevalue = param.date
        // this.sdk.app_name = param.app_name
        // this.sdk.package_name = param.package_name
        // this.sdk.channel_mark = param.channel_mark
        // this.sdk.version_online_version = param.version_online
        // this.sdk.version_update_version = param.version_update
        // this.sdk.versioncode_online_version = param.versioncode_online_version
        // this.sdk.versioncode_update_version = param.versioncode_update_version
        // this.sdk.sdk_config = param.sdk_config
        // this.sdk.sdk_require = param.sdk_require
        // this.sdk.note = param.note
        // this.sdk.checked = param.checked.split(',')
        //未勾选的去掉  start
        // this.sdk.form.domains = param.paramter
        let newdomains = []
        for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
          for (let j = 0; j < this.sdk.form.domains.length; j++) {
            if (this.sdk.form.domains[j].param_name.split('-')[0] === this.checkedSdkTemplate[i]) {
              newdomains.push(this.sdk.form.domains[j])
            }
          }
        }

        // //二级未勾选的去掉
        // let second_newdomains=[]
        // for (let i = 0; i < newdomains.length; i++) {
        //   if(newdomains[i].param_name.split('-').length===3){
        //     for (let j=0;j<param.second_checked.length;j++){
        //       if (param.second_checked[j]===newdomains[i].param_name[1]){
        //         second_newdomains.push(newdomains[i])
        //       }
        //     }
        //   }else {
        //     second_newdomains.push(newdomains[i])
        //   }
        // }
        // this.sdk.form.domains = second_newdomains

        //二级未勾选的去掉
        let second_newdomains=[]
        for (let i = 0; i < newdomains.length; i++) {
          if(newdomains[i].param_name.split('-').length===3){
            for (let j=0;j<this.dialog_secondary_checked.length;j++){
              if (this.dialog_secondary_checked[j]===newdomains[i].param_name.split('-')[1]){
                second_newdomains.push(newdomains[i])
              }
            }
          }else {
            second_newdomains.push(newdomains[i])
          }
        }
        this.sdk.form.domains = second_newdomains
        //end

        //选择器提交
        let select = []
        for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
          for (let j = 0; j < this.options.length; j++) {
            if (this.options[j].sdk_name===this.checkedSdkTemplate[i]){
            let param_name = this.options[j].sdk_name
            let newele = {
              param_name: this.options[j].sdk_name + '-' + this.options[j].param_name,
              param: this.options[j].value,
              sdk_type: '1',
            }
            if (select.length === 0) {
              select.push(newele)
            } else {
              let flag = true
              for (let x = 0; x < select.length; x++) {
                if (select[x].param_name === newele.param_name) {
                  select[x].param_name = newele.param_name
                  flag = false
                }
              }
              if (flag) {
                select.push(newele)
              }
            }
            }
          }
        }
        this.sdk.form.select = []
        this.sdk.form.select = select

        this.sdk.sdkstatus = '1'
        this.sdk.publish = '1'

        console.log(this.sdk.form.domains)
        console.log(this.sdk.form.select)
        console.log('----------------------')

        getProjectConfigPublish().then(response => {
          this.publishlist = response.data
          if (!this.valideSdkForm()) {
            return
          }
          let timestamp = (new Date()).getTime()
          this.sdk.timevalue = timestamp
          createProjectConfig(this.sdk).then(response => {
            this.create_flag = true
            this.initDate()
            this.$notify({
              title: '成功',
              message: '发布成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible=false
            this.handleFilter()
          }).catch(rs => {
            this.create_flag = true
            tothis.$notify({
              title: '失败',
              message: '请稍后重试',
              type: 'error',
              duration: 2000
            })
          })
        }).catch(function (rs) {
          tothis.$notify({
            title: '警告！',
            message: '验证失败，请稍后重试！',
            type: 'error',
            duration: 2000
          })
          return false
        })
      },//发布按钮
      valideSdkForm() {
          let num=new RegExp('^[0-9]*$')
          if (!num.test(this.sdk.versioncode_online_version)&&!num.test(this.sdk.versioncode_update_version)) {
            this.$notify({
              title: '警告！',
              dangerouslyUseHTMLString: true,
              message: '内部版本号格式错误,请及时修改！<br>必须为正整数。',
              type: 'warning',
              duration: 2000
            })
            return false
          }
          let arr2 = this.sdk.version_update_version.split('.');//外版本号
          let arr3 = this.sdk.version_online_version.split('.');//外版本号
          let arr2test=false
          let arr3test=false
          for (let i=0;i<arr2.length;i++){
            if (!num.test(arr2[i])){
              arr2test=true
            }
          }
          for (let i=0;i<arr3.length;i++){
            if (!num.test(arr3[i])){
              arr3test=true
            }
          }
          if (arr2.length < 3||arr3.length<3||arr2test||arr3test) {
            this.$notify({
              title: '警告！',
              dangerouslyUseHTMLString: true,
              message: '外部版本号格式不正确,请及时修改！<br>例如:1.0.0',
              type: 'warning',
              duration: 2000
            })
            return false
          }
          if (parseInt(this.sdk.versioncode_update_version) <= parseInt(this.sdk.versioncode_online_version)) {
            this.$notify({
              title: '警告！',
              message: '内部版本号更新必须大于在线,请及时修改！',
              type: 'warning',
              duration: 2000
            })
            return false
          }
          let diff = this.compareVersion(this.sdk.version_online_version, this.sdk.version_update_version)
          if (diff >= 0) {
            this.$notify({
              title: '警告！',
              message: '外版本号更新必须大于在线,请及时修改！',
              type: 'warning',
              duration: 2000
            })
            return false
          }
        for (let i = 0; i < this.publishlist.length; i++) {
          if (this.publishlist[i].channel_mark === this.sdk.channel_mark && this.publishlist[i].package_name === this.sdk.package_name) {
            if (parseInt(this.publishlist[i].versioncode_update_version) >= parseInt(this.sdk.versioncode_update_version)) {//内版本号
              this.$notify({
                title: '警告！',
                dangerouslyUseHTMLString: true,
                message: '最大的内部版本号为：' + this.publishlist[i].versioncode_update_version + ',<br>请及时修改！',
                type: 'warning',
                duration: 2000
              })
              return false
            }
          }
        }
        return true
      },  //发布验证
      form_item_filter(domain) {
        let param = domain.param_name
        let checked = this.dialog_secondary_checked
        let names = param.split('-')
        if (names[0] === this.filter_form_name) {
          if (names.length < 3) {
            return true
          } else {
            let flag = false
            for (let i = 0; i < checked.length; i++) {
              if (names[1] === checked[i]) {
                flag = true
              }
            }
            if (flag) {
              return true
            } else {
              return false
            }
          }
        } else {
          return false
        }
      },//根据sdk名称展示对话框内sdk列表
      getchannelmarklist() {
        let list = []
        let name = ''
        if (this.sdk_template_name === 'base') {
          name = '屏蔽系统bugly统计分享互推广告锁屏广告支付广告'
        }
        for (let i = 0; i < this.hidsdkTemplate.length; i++) {
          if (name.search(this.hidsdkTemplate[i]) != -1) {
            list.push(this.hidsdkTemplate[i])
          }
        }
        for (let i = 0; i < this.hidsdkTemplate.length; i++) {
          if (this.hidsdkTemplate[i].name.search(this.sdk_template_name) != -1) {
            list.push(this.hidsdkTemplate[i])
          }
        }
        this.sdkTemplate = list
      },//根据对话框内搜索框改变sdk多选框
      initchannel() {
        getChannel().then(response => {
          this.channel_mark_list_dia = response.data
        })
      }, //初始化渠道标记
      initDate() {
        const date = new Date("1994/04/06 03:23:55");
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        this.timevalue = [this.formatDate(date, 'yyyy-MM-dd'), this.formatDate(new Date(), 'yyyy-MM-dd')]
        this.handleFilter()
      },  //初始化日期，用于获取数据
      initTemplate() {
        this.listLoading = true
        getSdkTemplate().then(response => {
          this.sdkTemplate = response.name_list     //对话框内sdk模版列表
          this.hidsdkTemplate = response.name_list   //对话框内sdk模版列表
          this.sdkTemplatelibrary = response.list
          this.options = response.select_list
          this.listLoading = false
        })
      },//获取sdk模版
      change_pagename(name) {
        this.dialog_secondary_visual = false
        this.dialog_secondary_list = []
        let visual;
        let list = this.dialog_secondary_list;
        for (let i = 0; i < this.sdk.form.domains.length; i++) {
          let data = this.sdk.form.domains[i].param_name
          if (data.split('-').length > 2 && data.split('-')[0] === name) {
            visual = true
            if (list.length === 0) {
              list.push(data.split('-')[1])
            } else {
              let flag = true
              for (let x = 0; x < list.length; x++) {
                if (list[x].search(data.split('-')[1]) != -1) {
                  flag = false
                }
              }
              if (flag) {
                list.push(data.split('-')[1])
              }
            }
          }
        }

        this.dialog_secondary_visual = visual;
        this.dialog_secondary_list = list;
        this.filter_form_name = name  //联动对话框内标签页内容展示
      },//根据点击的标签页名，渲染
      findSdkTemplate() {
        this.tag_name = ''
        this.sdk.form.domains = []
        for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
          for (let j = 0; j < this.sdkTemplatelibrary.length; j++) {
            if (this.sdkTemplatelibrary[j].keymark === this.checkedSdkTemplate[i]) {
              if (this.sdk.form.domains.length === 0) {
                this.sdk.form.domains = this.sdkTemplatelibrary[j].keyform
              } else {
                this.sdk.form.domains = this.sdk.form.domains.concat(this.sdkTemplatelibrary[j].keyform)
              }
            }
          }
        }
        this.filter_form_name = this.page_name
        this.change_pagename(this.page_name)
      },//sdk模版根据多选框变动
      createData() {
        //dia 选择器提交
        let select = []
        for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
          let checkedname = this.checkedSdkTemplate[i]
          for (let j = 0; j < this.options.length; j++) {
            let param_name = this.options[j].sdk_name
            if (checkedname === param_name) {
              let newele = {
                param_name: this.options[j].sdk_name + '-' + this.options[j].param_name,
                param: this.options[j].value,
                sdk_type: '1',
              }
              if (select.length === 0) {
                select.push(newele)
              } else {
                let flag = true
                for (let x = 0; x < select.length; x++) {
                  if (select[x].param_name === newele.param_name) {
                    select[x].param_name = newele.param_name
                    flag = false
                  }
                }
                if (flag) {
                  select.push(newele)
                }
              }
            }
          }
        }

        this.sdk.form.select = []
        this.sdk.form.select = this.sdk.form.select.concat(select)
        //

        let tothis = this
        let dellist = []
        for (let i = 0; i < this.sdk.form.domains.length; i++) {
          if (this.sdk.form.domains[i].param_name === '' || this.sdk.form.domains[i].param === '') {
            let names = this.sdk.form.domains[i].param_name.split('-')
            let show_flag = false
            if (names.length < 3) {
              show_flag = true
            } else {
              let checked_falg = true
              for (let j = 0; j < this.dialog_secondary_checked.length; j++) {
                let checked = this.dialog_secondary_checked[j]
                if (checked === names[1]) {
                  checked_falg = false
                  show_flag = true
                }
              }
              if (checked_falg) {
                dellist.push(i)
              }
            }
            if (show_flag) {
              this.$notify({
                title: '警告！',
                dangerouslyUseHTMLString: true,
                message: 'KEY表有参数没填！' + '' +
                  ' <br> -->' + this.sdk.form.domains[i].param_name,
                type: 'error',
                duration: 2000
              })
              return
            }
          }
        }

        let newlist = []
        for (let j = 0; j < this.sdk.form.domains.length; j++) {
          let flag = true
          for (let i = 0; i < dellist.length; i++) {
            if (dellist[i] === j) {
              flag = false
            }
          }
          if (flag) {
            newlist.push(this.sdk.form.domains[j])
          }
        }
        this.sdk.form.domains = newlist

        if (this.sdk.sdk_require === '') {
          this.sdk.sdk_require = '暂无'
        }
        if (this.sdk.note === '') {
          this.sdk.note = '暂无'
        }
        if (this.sdk.sdk_config === '') {
          this.sdk.sdk_config = '暂无'
        }

        if (this.sdk.app_name === '') {
          this.sdk.app_name = '暂无'
        }
        if (this.sdk.version_online_version === '') {
          this.sdk.version_online_version = '暂无'
        }
        if (this.sdk.version_update_version === '') {
          this.sdk.version_update_version = '暂无'
        }
        if (this.sdk.versioncode_online_version === '') {
          this.sdk.versioncode_online_version = '暂无'
        }
        if (this.sdk.versioncode_update_version === '') {
          this.sdk.versioncode_update_version = '暂无'
        }

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let timestamp = (new Date(this.sdk.timevalue)).getTime()
            this.sdk.timevalue = timestamp
            if (this.create_flag) {
              this.create_flag = false
              createProjectConfig(this.sdk).then(response => {
                if (response.data==='成功'){
                  this.create_flag = true
                  this.initDate()
                  this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success',
                    duration: 2000
                  })
                  this.handleFilter()
                  this.dialogFormVisible = false
                } else {
                  this.create_flag = true
                  this.$notify({
                    title: '失败',
                    message: '表单已存在',
                    type: 'error',
                    duration: 2000
                  })
                }
              }).catch(rs => {
                this.create_flag = true
                tothis.$notify({
                  title: '失败',
                  message: '请稍后重试',
                  type: 'error',
                  duration: 2000
                })
                this.dialogFormVisible = false
              })
            }
          } else {
            this.listLoading = false;
            return false;
          }
        })
      },//添加方法
      resetTemp() {
        this.checkedSdkTemplate = []
        for (let j = 0; j < this.sdkTemplatelibrary.length; j++) {
          for (let x = 0; x < this.sdkTemplatelibrary[j].keyform.length; x++) {
            this.sdkTemplatelibrary[j].keyform[x].param = ''
          }
        }
        this.sdk = {
          second_checked:[],
          checked:[],
          id: '',
          timevalue: '',
          app_name: '',
          package_name: '',
          channel_mark: '',
          version_online_version: '',
          version_update_version: '',
          versioncode_online_version: '',
          versioncode_update_version: '',
          sdk_config: '',
          sdkstatus: '1',
          sdk_require: '',
          note: '',
          publish: '0',
          form: {
            domains: [],
          }
        }
      }, //重置对话框
      handleCreate() {
        this.resetTemp()
        const date = new Date();
        this.sdk.publish = '0'
        this.sdk.timevalue = date
        this.sdk.form.domains = []
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }, //创建对话框展示
      handleUpdate(param) {
        this.resetTemp()
        this.tag_name = ''
        let paramter = param.paramter
        for (let i = 0; i < paramter.length; i++) {
          let sdk_name = paramter[i].mark
          let param_name = paramter[i].param_name.split('-')[1]
          if (paramter[i].sdk_type === '1') {
            for (let j = 0; j < this.options.length; j++) {
              if (sdk_name === this.options[j].sdk_name && param_name === this.options[j].param_name) {
                this.options[j].value = paramter[i].param
              }
            }
          }
        }
        //对话框二级表单展示
        let checked = []
        for (let i = 0; i < param.paramter.length; i++) {
          let names = param.paramter[i].param_name
          let name = ''
          if (names.split('-').length > 2) {
            name = names.split('-')[1]
            if (checked.length === 0) {
              checked.push(name)
            } else {
              let flag = true
              for (let x = 0; x < checked.length; x++) {
                if (checked[x] === name) {
                  flag = false
                }
              }
              if (flag) {
                checked.push(name)
              }
            }
          }
        }
        this.dialog_secondary_checked = checked
        //结束
        this.handleCreate()
        this.sdk.id = param.id
        this.sdk.timevalue = param.date
        this.sdk.channel_mark = param.channel_mark
        this.sdk.package_name = param.package_name
        this.sdk.app_name = param.app_name==='暂无'?'':param.app_name
        this.sdk.version_online_version = param.version_online==='暂无'?'':param.version_online
        this.sdk.version_update_version = param.version_update==='暂无'?'':param.version_update
        this.sdk.versioncode_online_version = param.versioncode_online_version==='暂无'?'':param.versioncode_online_version
        this.sdk.versioncode_update_version = param.versioncode_update_version==='暂无'?'':param.versioncode_update_version
        this.sdk.sdk_config = param.sdk_config
        this.sdk.sdk_require = param.sdk_require
        this.sdk.note = param.note
        this.sdk.publish = '0'
        //this.sdk.form.domains = param.paramter
        let marks_list = []
        for (let i = 0; i < param.paramter.length; i++) {
          if (marks_list.length === 0) {
            marks_list.push(param.paramter[i].mark)
          } else {
            let flag = true
            for (let j = 0; j < marks_list.length; j++) {
              if (marks_list[j] === param.paramter[i].mark) {
                flag = false
              }
            }
            if (flag) {
              marks_list.push(param.paramter[i].mark)
            }
          }

        }
        let list = []
        for (let i = 0; i < marks_list.length; i++) {
          for (let j = 0; j < this.sdkTemplatelibrary.length; j++) {
            if (marks_list[i] === this.sdkTemplatelibrary[j].keymark) {
              list = list.concat(this.sdkTemplatelibrary[j].keyform)
            }
          }
        }
        this.sdk.form.domains = list
        if (param.sdk_status === 1) {
          this.sdk.sdkstatus = '1'
        } else {
          this.sdk.sdkstatus = '0'
        }
        for (let i = 0; i < param.paramter.length; i++) {
          let paramter_name = param.paramter[i].param_name   //****************
          let name = param.paramter[i].param_name.split('-')[0]
          let flag = false
          for (let j = 0; j < this.checkedSdkTemplate.length; j++) {
            if (this.checkedSdkTemplate[j] === name) {
              flag = true
              continue
            }
          }
          if (flag === false) {
            this.checkedSdkTemplate.push(name)
          }
          for (let j = 0; j < this.sdkTemplatelibrary.length; j++) {
            if (name === this.sdkTemplatelibrary[j].keymark) {
              for (let x = 0; x < this.sdkTemplatelibrary[j].keyform.length; x++) {
                if (this.sdkTemplatelibrary[j].keyform[x].param_name === paramter_name) {
                  this.sdkTemplatelibrary[j].keyform[x].param = param.paramter[i].param
                }
              }
            }
          }
        }
        this.filter_form_name = this.page_name
        this.change_pagename(this.page_name)
        //展示时sdk模版多选框等于checked start
        let checked1=param.checked.split(',')
        let newchecked1=[]
        for (let i=0;i<checked1.length;i++){
          if (checked1[i]!=='暂无'){
            newchecked1.push(checked1[i])
          }
        }
        this.checkedSdkTemplate=newchecked1

        let checked2=param.second_checked.split(',')
        let newchecked2=[]
        for (let i=0;i<checked2.length;i++){
          if (checked2[i]!=='暂无'){
            newchecked2.push(checked2[i])
          }
        }
        this.dialog_secondary_checked=newchecked2
        //end
        this.rowvalue=param
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      }, //更新对话框展示
      updateData() {
        // //dia 选择器提交
        // let select = []
        // for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
        //   let checkedname = this.checkedSdkTemplate[i]
        //   for (let j = 0; j < this.options.length; j++) {
        //     let param_name = this.options[j].sdk_name
        //     if (checkedname === param_name) {
        //       let newele = {
        //         param_name: this.options[j].sdk_name + '-' + this.options[j].param_name,
        //         param: this.options[j].value,
        //         sdk_type: '1',
        //       }
        //       if (select.length === 0) {
        //         select.push(newele)
        //       } else {
        //         let flag = true
        //         for (let x = 0; x < select.length; x++) {
        //           if (select[x].param_name === newele.param_name) {
        //             select[x].param_name = newele.param_name
        //             flag = false
        //           }
        //         }
        //         if (flag) {
        //           select.push(newele)
        //         }
        //       }
        //     }
        //   }
        // }
        // this.sdk.form.select = []
        // this.sdk.form.select = this.sdk.form.select.concat(select)
        // //

        //未勾选的去掉  start
        let newdomains1 = []
        for (let i = 0; i < this.sdk.checked.length; i++) {
          for (let j = 0; j < this.sdk.form.domains.length; j++) {
            if (this.sdk.form.domains[j].param_name.split('-')[0] === this.sdk.checked[i]) {
              newdomains1.push(this.sdk.form.domains[j])
            }
          }
        }

        //二级未勾选的去掉
        let second_newdomains=[]
        for (let i = 0; i < newdomains1.length; i++) {
          if(newdomains1[i].param_name.split('-').length===3){
            for (let j=0;j<this.sdk.second_checked.length;j++){
              if (this.sdk.second_checked[j]===newdomains1[i].param_name[1]){
                second_newdomains.push(newdomains1[i])
              }
            }
          }else {
            second_newdomains.push(newdomains1[i])
          }
        }
        this.sdk.form.domains = second_newdomains
        //end

        let tothis = this
        let del = []
        for (let i = 0; i < this.sdk.form.domains.length; i++) {
          let judge = this.sdk.form.domains[i].param_name === '' || this.sdk.form.domains[i].param === ''
          let names = this.sdk.form.domains[i].param_name.split('-')
          if (judge) {
            let show_flag = false
            if (names.length < 3) {
              show_flag = true
            } else {
              let checked_falg = true
              for (let j = 0; j < this.dialog_secondary_checked.length; j++) {
                let checked = this.dialog_secondary_checked[j]
                if (checked === names[1]) {
                  checked_falg = false
                  show_flag = true
                }
              }
            }
            if (show_flag) {
              this.$notify({
                title: '警告！',
                dangerouslyUseHTMLString: true,
                message: 'KEY表有参数没填！' + '' +
                  ' <br> -->' + this.sdk.form.domains[i].param_name,
                type: 'error',
                duration: 2000
              })
              return
            }
          }

          if (names.length > 2) {
            let checked_falg = true
            for (let j = 0; j < this.dialog_secondary_checked.length; j++) {
              let checked = this.dialog_secondary_checked[j]
              if (checked === names[1]) {
                checked_falg = false
              }
            }
            if (checked_falg) {
              del.push(i)
            }
          }
        }
        let newdomain = []
        for (let i = 0; i < this.sdk.form.domains.length; i++) {
          let newflag = true
          for (let j = 0; j < del.length; j++) {
            if (i === del[j]) {
              newflag = false
            }
          }
          if (newflag) {
            newdomain.push(this.sdk.form.domains[i])
          }
        }
        this.sdk.form.domains = newdomain

        if (this.sdk.sdk_require === '') {
          this.sdk.sdk_require = '暂无'
        }
        if (this.sdk.note === '') {
          this.sdk.note = '暂无'
        }
        if (this.sdk.sdk_config === '') {
          this.sdk.sdk_config = '暂无'
        }
        //把所有有值的一起提交
        let newdomains=[]
        for (let i=0;i<this.sdkTemplatelibrary.length;i++){
          for (let j=0;j<this.sdkTemplatelibrary[i].keyform.length;j++){
            if (this.sdkTemplatelibrary[i].keyform[j].param!==''){
              newdomains.push(this.sdkTemplatelibrary[i].keyform[j])
            }
          }
        }
        this.sdk.form.domains=newdomains
        //把二级表单的checked一起保存
        //保留checkedSdkTemplate
        this.sdk.checked=this.checkedSdkTemplate
        this.sdk.second_checked=this.dialog_secondary_checked
        //选择器提交
        let select = []
        for (let j = 0; j < this.options.length; j++) {
          let param_name = this.options[j].sdk_name
          let newele = {
            param_name: this.options[j].sdk_name + '-' + this.options[j].param_name,
            param: this.options[j].value,
            sdk_type: '1',
          }
          if (select.length === 0) {
            select.push(newele)
          } else {
            let flag = true
            for (let x = 0; x < select.length; x++) {
              if (select[x].param_name === newele.param_name) {
                select[x].param_name = newele.param_name
                flag = false
              }
            }
            if (flag) {
              select.push(newele)
            }
          }
        }
        this.sdk.form.select = []
        this.sdk.form.select = select

        getProjectConfigPublish().then(response => {
          this.publishlist = response.data
          if (!this.valideSdkForm()) {
            return
          }

        if (!this.update_flag) {
          return
        }
        this.update_flag = false

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            updateProjectConfig(this.sdk).then(response => {
              this.listLoading = true
              if (this.hidtimevalue != '') {
                this.timevalue = this.hidtimevalue
                this.handleFilter();
              }
              // this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.handleFilter()
              this.update_flag = true
            }).catch(err => {
              tothis.$notify({
                title: '失败',
                message: '请稍后重试',
                type: 'error',
                duration: 2000
              })
            })
          }
          this.update_flag = true
        })

        })
      }, //更新方法
      getDatawithParam() {
        this.listLoading = true
        let param = this.secondary_channel
        let data = []
        for (let i = 0; i < this.hidlist.length; i++) {
          if (this.hidlist[i].channel_mark.search(param) != -1) {
            data.push(this.hidlist[i])
          }
        }
        let game = this.secondary_game
        let data1 = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].app_name.search(game) != -1) {
            data1.push(data[i])
          }
        }
        let statuse = this.checked
        let data2 = []
        if (statuse === true) {
          for (let i = 0; i < data1.length; i++) {
            if (data1[i].sdk_status === 1) {
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
            if (data2[i].sdk_status === 0) {
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
      }, //table二次筛选  页面上方按钮
      handleFilter() {
        this.hidtimevalue = this.timevalue
        this.listParam.start = this.timevalue[0]
        this.listParam.end = this.timevalue[1]
        let tothis = this
        this.listLoading = true
        getProjectConfig(this.listParam).then(response => {
          console.log(response.data)
          console.log('+++++++++++++++++++')
          this.list = response.data
          this.hidlist = response.data
          this.listLoading = false
          this.getDatawithParam()
          this.initfilterlist()
        }).catch(function (rs) {
          tothis.listLoading = false
        })
      },  //查询数据
      compareVersion(param1, param2) {
        let arr1 = param1.split('.');
        let arr2 = param2.split('.');
        //将两个版本号拆成数字
        let minL = Math.min(arr1.length, arr2.length);
        let pos = 0;        //当前比较位
        let diff = 0;        //当前为位比较是否相等
        //逐个比较如果当前位相等则继续比较下一位
        while (pos < minL) {
          diff = parseInt(arr1[pos]) - parseInt(arr2[pos]);
          if (diff != 0) {
            break;
          }
          pos++;
        }
        if (diff === 0 && arr1.length > arr2.length) {
          diff = 1
        }
        if (diff === 0 && arr1.length < arr2.length) {
          diff = -1
        }

        return diff
      },//比较版本号
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
      }, //日期转换
      checkPermission,
      padLeftZero(str) {
        return ('00' + str).substr(str.length);
      },//日期转换
      initfilterlist() {
        this.channel_mark_list=[]
        this.app_name_list=[]
        for (let i = 0; i < this.hidlist.length; i++) {
          if (this.channel_mark_list.length === 0) {
            this.channel_mark_list.push(this.hidlist[i].channel_mark)
          } else {
            let channel_flag = true
            for (let x = 0; x < this.channel_mark_list.length; x++) {
              if (this.channel_mark_list[x] === this.hidlist[i].channel_mark) {
                channel_flag = false
              }
            }
            if (channel_flag) {
              this.channel_mark_list.push(this.hidlist[i].channel_mark)
            }
          }
          if (this.app_name_list.length === 0) {
            this.app_name_list.push(this.hidlist[i].app_name)
          } else {
            let name_flag = true
            for (let y = 0; y < this.app_name_list.length; y++) {
              if (this.app_name_list[y].search(this.hidlist[i].app_name) != -1) {
                name_flag = false
              }
            }
            if (name_flag) {
              this.app_name_list.push(this.hidlist[i].app_name)
            }
          }
        }
      },//table查询条件初始化
      expandrowhandler(row, expandedRows) {
        let that = this
        if (expandedRows.length) {
          that.expands = []
          if (row) {
            that.expands.push(row.id)
          }
        } else {
          that.expands = []
        }
        if (expandedRows.length < 1) {
          return
        }
        let index = expandedRows.length - 1
        this.getSpanArr(expandedRows[index].paramter)
      },//展开行变化时触发
      getSpanArr(data) {
        this.spanArr.length = 0
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            this.spanArr.push(1);
            this.pos = 0
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i].mark === data[i - 1].mark) {
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            } else {
              this.spanArr.push(1);
              this.pos = i;
            }
          }
        }
      },//获取合并单元格判断数据
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col

          }
        }
      },//合并单元格
    }
  }

</script>
<style>
  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 1px;
    margin-bottom: 5px;
  }

  #form-custom .el-form-item {
    margin-right: 250px;
  }

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

  .el-tabs__nav-scroll {
    width: 180px;
  }

</style>



