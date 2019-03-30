<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">


      <!--<span style="margin-left: 15px;margin-right: 5px">游戏:</span>-->
      <!--<el-select v-model="secondary_game" @change="getDatawithParam">-->
      <!--<el-option key="全部" label="全部" value="">-->
      <!--</el-option>-->
      <!--<el-option v-for="(item,index) in app_name_list" :key="index" :label="item" :value="item">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <span style="margin-left: 15px;margin-right: 5px">项目:</span>
      <el-select v-model="secondary_project" @change="getDatawithParam" value-key="project_name" filterable>
        <el-option key="全部" label="全部" value="">
        </el-option>
        <el-option v-for="(item,index) in projectlist_select" :key="index" :label="item.project_name" :value="item">
        </el-option>
      </el-select>
      <span style="margin-left: 15px;margin-right: 5px">渠道:</span>
      <el-select v-model="secondary_channel" @change="getDatawithParam">
        <el-option key="全部" label="全部" value="">
        </el-option>
        <el-option v-for="(item,index) in channel_mark_list" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
      <span style="margin-left: 15px;margin-right: 5px">包名:</span>
      <el-input placeholder="根据包名查找" v-model="secondary_package" style="width: 200px" class="filter-item" clearable
                @blur="getDatawithParam"/>
      <!--<el-checkbox v-model="checked" border style="margin-left: 15px" @change="getDatawithParam">展示正常</el-checkbox>-->
      <!--<el-checkbox v-model="checked1" border style="margin-left: 15px" @change="getDatawithParam">显示删除状态配置表</el-checkbox>-->
    </div>
    <!--<button @click="test">aasdasaaaaa</button>-->
    <el-table
      height="780"
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
      <!--<el-table-column type="expand" label="展开" width="100px">-->
      <!--<template slot-scope="props">-->
      <!--<el-form label-position="left" inline class="demo-table-expand">-->
      <!--<el-form-item label="游戏名:">-->
      <!--<span>{{ props.row.app_name }}</span>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="包名:">-->
      <!--<span>{{ props.row.package_name }}</span>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="渠道标记:">-->
      <!--<span>{{ props.row.channel_mark }}</span>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="外部版本-在线:">-->
      <!--<span>{{ props.row.version_online }}</span>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="内部版本-在线:">-->
      <!--<span>{{ props.row.versioncode_online_version }}</span>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="外部版本-更新:">-->
      <!--<span>{{ props.row.version_update }}</span>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="内部版本_更新:">-->
      <!--<span>{{ props.row.versioncode_update_version }}</span>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div>-->
      <!--<el-table-->
      <!--v-if="false"-->
      <!--stripe-->
      <!--border-->
      <!--:data="props.row.paramter"-->
      <!--style="width: 100%;margin-bottom: 30px;"-->
      <!--:span-method="objectSpanMethod">-->
      <!--<el-table-column-->
      <!--prop="mark"-->
      <!--label="模块名"-->
      <!--style="width: 15%">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--prop="param_name1"-->
      <!--label="参数名"-->
      <!--style="width: 15%">-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
      <!--prop="param"-->
      <!--label="参数"-->
      <!--style="width: 25%">-->
      <!--</el-table-column>-->
      <!--</el-table>-->
      <!--</div>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column align="center" label="序号" width="60">-->
      <!--<template slot-scope="scope1">-->
      <!--{{ ++scope1.$index }}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="包名" prop="package_name" width="300px">
      </el-table-column>
      <el-table-column label="应用名" prop="app_name" width="150">
      </el-table-column>
      <el-table-column label="渠道" prop="channel_mark" width="100">
      </el-table-column>
      <!--<el-table-column label="外部版本-在线" prop="version_online">-->
      <!--</el-table-column>-->
      <el-table-column label="外部版本-更新" prop="version_update" width="120">
      </el-table-column>
      <!--<el-table-column label="内部版本-在线" prop="versioncode_online_version">-->
      <!--</el-table-column>-->
      <el-table-column label="内部版本-更新" prop="versioncode_update_version" width="120">
      </el-table-column>
      <el-table-column label="备注" prop="note">
      </el-table-column>
      <el-table-column label="操作" align="center" width="250px" class-name="small-padding fixed-width"
                       v-if="checkPermission(['operatorleader','admin','sdksuport','director','operator'])">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleUpdate(scope.row)">{{ "编辑" }}</el-button>
          <el-button @click="link_Check(scope.row)" size="mini" type="info">查看配置表发布记录</el-button>
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
        <el-form-item label="包名" :rules="[{ required: true, message: '包名不能为空'}]" prop="package_name"
                      v-if="this.dialogStatus === 'update'">
          <el-input v-model="sdk.package_name" placeholder="必填~" class="dia-input" disabled/>
        </el-form-item>
        <el-form-item label="渠道标记" :rules="[{ required: true, message: '渠道不能为空'}]" prop="channel_mark"
                      v-if="this.dialogStatus === 'update'">
          <el-select v-model="sdk.channel_mark" disabled>
            <el-option
              v-for="item in channel_mark_list_dia"
              :key="item.name"
              :label="item.program_mark"
              :value="item.program_mark">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="游戏名" :rules="[{ required: true, message: '游戏名不能为空'}]" prop="app_name"
                      v-if="this.dialogStatus === 'update'">
          <el-input v-model="sdk.app_name" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="keystore" v-if="this.dialogStatus === 'update'"
                      prop="keystore">
          <el-select v-model="sdk.keystore" placeholder="请选择" class="dia-input" filterable value-key="keystoreguid">
            <el-option
              v-for="item in keystoreList"
              :key="item.keystoreguid"
              :label="item.keystoreName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <div></div>

        <el-form-item label="包名" :rules="[{ required: true, message: '包名不能为空'}]" prop="package_name"
                      v-if="this.dialogStatus === 'create'">
          <el-input v-model="sdk.package_name" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="渠道标记" :rules="[{ required: true, message: '渠道不能为空'}]" prop="channel_mark"
                      v-if="this.dialogStatus === 'create'">
          <el-select v-model="sdk.channel_mark" filterable>
            <el-option
              v-for="item in channel_mark_list_dia"
              :key="item.name"
              :label="item.program_mark"
              :value="item.program_mark">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外部版本-在线" class="filter-item" :rules="[{ required: true, message: '外部版本-在线不能为空'}]"
                      v-if="this.dialogStatus === 'update'"
                      prop="version_online_version">
          <el-input v-model="sdk.version_online_version" placeholder="必填~" class="dia-input"
                    onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"/>
        </el-form-item>
        <el-form-item label="外部版本-更新" :rules="[{ required: true, message: '外部版本-更新不能为空'}]"
                      v-if="this.dialogStatus === 'update'"
                      prop="version_update_version">
          <el-input v-model="sdk.version_update_version" placeholder="必填~" class="dia-input"
                    onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"/>
        </el-form-item>
        <el-form-item label="内部版本-在线" :rules="[{ required: true, message: '内部版本-在线不能为空'}]"
                      v-if="this.dialogStatus === 'update'"
                      prop="versioncode_online_version">
          <el-input v-model="sdk.versioncode_online_version" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="内部版本_更新" :rules="[{ required: true, message: '内部版本_更新不能为空'}]"
                      v-if="this.dialogStatus === 'update'"
                      prop="versioncode_update_version">
          <el-input v-model="sdk.versioncode_update_version" placeholder="必填~" class="dia-input"/>
        </el-form-item>

        <el-form-item label="备注" :rules="[{ required: true, message: '默认填写暂无'}]"
                      v-if="this.dialogStatus === 'update'"
                      prop="note">
          <el-input v-model="sdk.note" placeholder="必填~" class="dia-input" type="textarea"
                    :rows="3"/>
        </el-form-item>
        <div></div>

        <!--<el-form-item label="ketstorePWD" :rules="[{ required: true, message: 'ketstorePWD不能为空'}]"-->
        <!--v-if="this.dialogStatus === 'update'"-->
        <!--prop="ketstorePWD">-->
        <!--<el-input v-model="sdk.ketstorePWD" placeholder="必填~" class="dia-input"/>-->
        <!--</el-form-item>-->

        <!--<el-form-item label="icon"-->
        <!--v-if="this.dialogStatus === 'update'"-->
        <!--prop="icon">-->
        <!--<el-input v-model="sdk.icon" placeholder="必填~" class="dia-input" disabled/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="splash" -->
        <!--v-if="this.dialogStatus === 'update'"-->
        <!--prop="splash">-->
        <!--<el-input v-model="sdk.splash" placeholder="必填~" class="dia-input" disabled/>-->
        <!--</el-form-item>-->
        <div style="text-align: center">
          <el-upload
            style="margin: 20px;width: 40%;display: inline-block"
            class="avatar-uploader"
            action="http://192.168.1.144:8087/file"
            accept=".png,.jpg"
            :show-file-list="false"
            :on-success="uploadSuccess_icon"
            :before-upload="beforeUpload_icon">
            <img v-if="imageUrl_icon" :src="imageUrl_icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">此处上传icon,<a style="text-decoration:underline" :href="this.imageUrl_icon+'&name=icon'"   target="_blank"  title="点击查看大图">点击查看大图</a>
            </div>
          </el-upload>
          <!--<el-upload-->
          <!--style="margin: 20px;width: 40%;display: inline-block"-->
          <!--action="http://192.168.1.144:8087/file"-->
          <!--accept=".png,.jpg"-->
          <!--:before-upload="beforeUpload_icon"-->
          <!--:on-success="uploadSuccess_icon"-->
          <!--:file-list="fileList_icon"-->
          <!--list-type="picture">-->
          <!--<el-button size="small" type="primary">上传ICON</el-button>-->
          <!--<div slot="tip" class="el-upload__tip">只能上传一张jpg/png文件，若无法上传，点击下方图片右上角的X</div>-->
          <!--</el-upload>-->
          <el-upload
            style="margin: 20px;width: 50%;display: inline-block"
            class="avatar-uploader"
            action="http://192.168.1.144:8087/file"
            accept=".png,.jpg"
            :show-file-list="false"
            :on-success="uploadSuccess_splash"
            :before-upload="beforeUpload_splash">
            <img v-if="imageUrl_splash" :src="imageUrl_splash" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">此处上传splash,<a style="text-decoration:underline"  :href="this.imageUrl_splash+'&name=splash'" target="_blank"  title="点击查看大图">点击查看大图</a>
            </div>
          </el-upload>

          <!--<el-upload-->
          <!--style="margin: 20px;width: 40%;display: inline-block;margin-left: 90px"-->
          <!--action="http://192.168.1.144:8087/file"-->
          <!--accept=".png,.jpg"-->
          <!--:before-upload="beforeUpload_splash"-->
          <!--:on-success="uploadSuccess_splash"-->
          <!--:file-list="fileList_splash"-->
          <!--list-type="picture">-->
          <!--<el-button size="small" type="primary">上传SPLASH</el-button>-->
          <!--<div slot="tip" class="el-upload__tip">只能上传一张jpg/png文件，若无法上传，点击下方图片右上角的X</div>-->
          <!--</el-upload>-->
        </div>
        <br/>
        <!--筛选输入框-->
        <el-input placeholder="SDK模版筛选" v-model="sdk_template_name" v-if="this.dialogStatus === 'update'"
                  style="width: 200px;margin-bottom: 10px" class="filter-item" clearable
                  @keyup.native="getchannelmarklist"
                  @change="getchannelmarklist"/>
        <!--多选框 sdk模版控制-->
        <el-checkbox-group v-model="checkedSdkTemplate" style="border-bottom: 15px" size="mini"
                           v-if="this.dialogStatus === 'update'">
          <el-checkbox v-for="name in sdkTemplate" :label="name.mark" :key="name.name" @change="findSdkTemplate"
                       :value="name.name" border>
            <div class="grid-content bg-purple-light" style="width: 107px;margin-bottom: 15px">{{name.mark}}</div>
          </el-checkbox>
        </el-checkbox-group>
        <br/>
        <!--标签页-->
        <el-tabs tab-position="left" style="width: 95%;background-color: #f4f4f5;height: 500px;padding: 1px" id="test1"
                 v-if="this.dialogStatus === 'update'" v-model="tabname"
                 @tab-click="findtabname" type="border-card">
          <el-tab-pane v-for="name in checkedSdkTemplate" :label="name" :key="name" :name="name"
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
                     v-if="validName(option.sdk_name)">
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
                <div style="width: 700px">
                  <span
                    style="margin-right: 20px;font-size: 14px;font-family: Microsoft YaHei;width:200px;display: inline-block">
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
        <el-button type="primary" @click="createData()" v-if="dialogStatus==='create'">{{ '确认' }}</el-button>
        <el-button type="primary" @click="updateData(true)" v-if="dialogStatus==='update'">{{ '保存' }}</el-button>
        <el-button type="success" @click="publishHandler()" v-if="dialogStatus==='update'">发布</el-button>
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
    getChannel,
    getProject
  } from '@/api/table/sdkmanager/projectconfigtable'
  import {getName, getResourceName} from '@/api/table/sdkmanager/projectconfigtable'
  import {fetchFileInfo, getFile, delFile, fetchKeystoreInfo} from '@/api/fileupload'
  import {getToken} from '@/utils/auth'

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
        imageUrl_splash: '',
        imageUrl_icon: '',
        keystoreList: [],
        dataObj: {
          'Authorization': ''
        },
        fileList_icon: [],
        fileList_splash: [],
        tabname: '',
        projectlist_select: [],
        secondary_project: '',
        secondary_package: '',
        rowvalue: '',
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
          second_checked: [],
          checked: [],
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
          icon: '',
          splash: '',
          keystore: '',
          ketstorePWD: "",
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
      this.routeWithParam()//跳转赋值
      this.listKeyStoreInfo()//获取keystore列表
    },
    methods: {
      listKeyStoreInfo() {
        let tothis = this;
        fetchKeystoreInfo().then(response => {
          if (response.repcode === 0) {
            this.keystoreList = response.data
            console.log(this.keystoreList)
          }
          this.listLoading = false
        }).catch(function (rs) {
          tothis.$notify({
            title: '失败',
            message: '获取keystore列表失败',
            type: 'error',
            duration: 4000
          })
          tothis.listLoading = false
          console.log(rs)
        })
      },//获取keystore列表
      beforeUpload_icon(file) {
        this.dataObj.Authorization = 'Bearer ' + getToken()
      },//icon上传前事件
      beforeUpload_splash(file) {
        this.dataObj.Authorization = 'Bearer ' + getToken()
      },//splash上传前事件
      uploadSuccess_icon(response) {
        console.log(response)
        this.sdk.icon = response.data
        this.imageUrl_icon = "http://192.168.1.144:8087/getFile?path=" + response.data
        console.log(response.data)
      },//icon上传成功事件
      uploadSuccess_splash(response) {
        console.log(response)
        this.sdk.splash = response.data
        this.imageUrl_splash = "http://192.168.1.144:8087/getFile?path=" + response.data
        console.log(response.data)
      },//splash上传成功事件
      link_Check(val) {
        let routeData = this.$router.resolve({
          name: 'ProjectConfigList',
          query: {package_name: val.package_name, channel: val.channel}
        });
        window.open(routeData.href, '_blank');
      },//跳转方法
      routeWithParam() {
        let name = this.$route.query.package_name
        if (typeof(name) != 'undefined') {
          this.secondary_package = name
        }
        let channel = this.$route.query.channel
        if (typeof(channel) != 'undefined') {
          this.secondary_channel = channel
        }
      },//带参跳转
      validName(name) {
        if (name === this.tag_name) {
          return true
        }
        return false
      },//验证Name
      publishHandler() {
        this.updateData(false)
        //this.publish()
      },//发布按钮处理
      findtabname(tab, event) {
        this.tag_name = tab.label
        this.change_pagename(tab.label)
      },//获取对话框内标签页 名触发事件
      publish() {
        let tothis = this
        let newdomains = []
        for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
          for (let j = 0; j < this.sdk.form.domains.length; j++) {
            if (this.sdk.form.domains[j].param_name.split('-')[0] === this.checkedSdkTemplate[i]) {
              newdomains.push(this.sdk.form.domains[j])
            }
          }
        }
        //二级未勾选的去掉
        let second_newdomains = []
        for (let i = 0; i < newdomains.length; i++) {
          if (newdomains[i].param_name.split('-').length === 3) {
            for (let j = 0; j < this.dialog_secondary_checked.length; j++) {
              if (this.dialog_secondary_checked[j] === newdomains[i].param_name.split('-')[1]) {
                second_newdomains.push(newdomains[i])
              }
            }
          } else {
            second_newdomains.push(newdomains[i])
          }
        }
        for (let i = 0; i < second_newdomains.length; i++) {

          if (second_newdomains[i].param === '') {
            tothis.$notify({
              title: '发布失败',
              dangerouslyUseHTMLString: true,
              message: 'KEY表有参数没填！' + '' +
                ' <br> -->' + second_newdomains[i].param_name,
              type: 'error',
              duration: 4000
            })
            return
          }

        }
        this.sdk.form.domains = second_newdomains
        //end
        //选择器提交
        let select = []
        for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
          for (let j = 0; j < this.options.length; j++) {
            if (this.options[j].sdk_name === this.checkedSdkTemplate[i]) {
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
        getProjectConfigPublish().then(response => {
          this.publishlist = response.data
          if (!this.valideSdkForm()) {
            //this.dialogFormVisible = false
            return
          }
          let timestamp = (new Date()).getTime()
          this.sdk.timevalue = timestamp
          this.sdk.keystore.filepath = this.sdk.keystore.keystoreguid
          console.log(this.sdk)

          createProjectConfig(this.sdk).then(response => {
            this.create_flag = true
            this.initDate()
            this.$notify({
              title: '成功',
              message: '发布成功',
              type: 'success',
              duration: 4000
            })
            this.dialogFormVisible = false
            this.handleFilter()
          }).catch(rs => {
            this.create_flag = true
            tothis.$notify({
              title: '发布失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 4000
            })
          })
        }).catch(function (rs) {
          tothis.$notify({
            title: '发布失败',
            message: '获取验证信息失败，请刷新页面后重试！',
            type: 'error',
            duration: 4000
          })
          return false
        })
      },//发布方法
      valideSdkForm() {
        let num = new RegExp('^[0-9]*$')
        if (!num.test(this.sdk.versioncode_online_version) && !num.test(this.sdk.versioncode_update_version)) {
          this.$notify({
            title: '发布失败！',
            dangerouslyUseHTMLString: true,
            message: '内部版本号格式错误,请及时修改！<br>必须为正整数。',
            type: 'error',
            duration: 4000
          })
          return false
        }
        let arr2 = this.sdk.version_update_version.split('.');//外版本号
        let arr3 = this.sdk.version_online_version.split('.');//外版本号
        let arr2test = false
        let arr3test = false
        for (let i = 0; i < arr2.length; i++) {
          if (!num.test(arr2[i])) {
            arr2test = true
          }
        }
        for (let i = 0; i < arr3.length; i++) {
          if (!num.test(arr3[i])) {
            arr3test = true
          }
        }
        if (arr2.length < 3 || arr3.length < 3 || arr2test || arr3test) {
          this.$notify({
            title: '发布失败！',
            dangerouslyUseHTMLString: true,
            message: '外部版本号格式不正确,请及时修改！<br>例如:1.0.0',
            type: 'error',
            duration: 4000
          })
          return false
        }
        if (parseInt(this.sdk.versioncode_update_version) <= parseInt(this.sdk.versioncode_online_version)) {
          this.$notify({
            title: '发布失败！',
            message: '内部版本号更新必须大于在线,请及时修改！',
            type: 'error',
            duration: 4000
          })
          return false
        }
        let diff = this.compareVersion(this.sdk.version_online_version, this.sdk.version_update_version)
        if (diff >= 0) {
          this.$notify({
            title: '发布失败！',
            message: '外版本号更新必须大于在线,请及时修改！',
            type: 'error',
            duration: 4000
          })
          return false
        }
        for (let i = 0; i < this.publishlist.length; i++) {
          if (this.publishlist[i].channel_mark === this.sdk.channel_mark && this.publishlist[i].package_name === this.sdk.package_name) {
            if (parseInt(this.publishlist[i].versioncode_update_version) >= parseInt(this.sdk.versioncode_update_version)) {//内版本号
              this.$notify({
                title: '发布失败！',
                dangerouslyUseHTMLString: true,
                message: '最大的内部版本号为：' + this.publishlist[i].versioncode_update_version + ',<br>请及时修改！',
                type: 'error',
                duration: 4000
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
        // if (this.sdk_template_name === 'base') {
        //   name = '屏蔽系统bugly统计分享互推广告锁屏广告支付广告'
        // }
        for (let i = 0; i < this.hidsdkTemplate.length; i++) {
          if (name.search(this.hidsdkTemplate[i]) != -1) {
            list.push(this.hidsdkTemplate[i])
          }
        }
        for (let i = 0; i < this.hidsdkTemplate.length; i++) {
          if (this.hidsdkTemplate[i].name.search(this.sdk_template_name) != -1 || this.hidsdkTemplate[i].mark.search(this.sdk_template_name) != -1) {
            list.push(this.hidsdkTemplate[i])
          }
        }
        this.sdkTemplate = list
      },//根据对话框内搜索框改变sdk多选框
      initchannel() {
        getChannel().then(response => {
          let list = response.data
          let newlist = []
          for (let i = 0; i < list.length; i++) {
            let flag = true
            for (let j = 0; j < newlist.length; j++) {
              if (list[i].program_mark === newlist[j].program_mark) {
                flag = false
              }
            }
            if (flag) {
              newlist.push(list[i])
            }
          }
          this.channel_mark_list_dia = newlist
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
        if (this.tag_name === '暂无' && this.checkedSdkTemplate.length > 0) {
          this.tag_name = this.checkedSdkTemplate[0]
        }
        this.change_pagename(this.tag_name)
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
                duration: 4000
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
                if (response.data === '成功') {
                  this.create_flag = true
                  this.initDate()
                  this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success',
                    duration: 4000
                  })
                  this.handleFilter()
                  this.dialogFormVisible = false
                } else {
                  this.create_flag = true
                  this.$notify({
                    title: '创建失败',
                    message: '该表已存在',
                    type: 'error',
                    duration: 4000
                  })
                }
              }).catch(rs => {
                this.create_flag = true
                tothis.$notify({
                  title: '失败',
                  message: '请刷新页面后重试',
                  type: 'error',
                  duration: 4000
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
        let def_keystore = this.keystoreList[0]
        for (let i = 0; i < this.keystoreList.length; i++) {
          if (this.keystoreList[i].keystoreName === 'tomatojoy.keystore') {
            def_keystore = this.keystoreList[i]
            break
          }
        }
        this.sdk = {
          second_checked: [],
          checked: [],
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
          icon: '暂无',
          splash: '暂无',
          keystore: def_keystore,
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
        this.sdk.app_name = param.app_name === '暂无' ? '' : param.app_name
        this.sdk.version_online_version = param.version_online === '暂无' ? '' : param.version_online
        this.sdk.version_update_version = param.version_update === '暂无' ? '' : param.version_update
        this.sdk.versioncode_online_version = param.versioncode_online_version === '暂无' ? '' : param.versioncode_online_version
        this.sdk.versioncode_update_version = param.versioncode_update_version === '暂无' ? '' : param.versioncode_update_version
        this.sdk.sdk_config = param.sdk_config
        this.sdk.sdk_require = param.sdk_require
        this.sdk.note = param.note
        this.sdk.publish = '0'

        this.sdk.icon = param.icon
        this.sdk.splash = param.splash
        for (let i = 0; i < this.keystoreList.length; i++) {
          if (this.keystoreList[i].keystoreguid === param.keystorePath) {
            this.sdk.keystore = this.keystoreList[i]
            console.log('keystore匹配成功')
            break;
          }
        }
        console.log(param.icon)
        if (param.icon !== '暂无') {
          this.imageUrl_icon='http://192.168.1.144:8087/getFile?path=' + param.icon + '&name=icon'
        } else {
          this.imageUrl_icon=''
        }
        console.log(param.splash)
        if (param.splash !== '暂无') {
          this.imageUrl_splash='http://192.168.1.144:8087/getFile?path=' + param.splash + '&name=splash'
        } else {
          this.imageUrl_splash=''
        }
        console.log(param)

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
        //展示时sdk模版多选框等于checked start
        let checked1 = param.checked.split(',')
        let newchecked1 = []
        for (let i = 0; i < checked1.length; i++) {
          if (checked1[i] !== '暂无') {
            newchecked1.push(checked1[i])
          }
        }
        this.checkedSdkTemplate = newchecked1
        let checked2 = param.second_checked.split(',')
        let newchecked2 = []
        for (let i = 0; i < checked2.length; i++) {
          if (checked2[i] !== '暂无') {
            newchecked2.push(checked2[i])
          }
        }
        this.dialog_secondary_checked = newchecked2
        //end
        //当模版勾选未填值时，页面无法渲染的问题 start
        let nulllist = []
        for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
          let flag = true
          for (let j = 0; j < list.length; j++) {
            if (list[j].param_name.indexOf(this.checkedSdkTemplate[i]) != -1) {
              flag = false
            }
          }
          if (flag) {
            nulllist.push(this.checkedSdkTemplate[i])
          }
        }

        for (let i = 0; i < nulllist.length; i++) {
          for (let j = 0; j < this.sdkTemplatelibrary.length; j++) {
            if (nulllist[i] === this.sdkTemplatelibrary[j].keymark) {
              this.sdk.form.domains = this.sdk.form.domains.concat(this.sdkTemplatelibrary[j].keyform)
            }
          }
        }

        //end
        this.rowvalue = param
        this.dialogStatus = 'update'
        //获取row 参数中的checked
        if (param.checked.split(',').length > 0) {
          let data = param.checked.split(',')[0]
          this.tag_name = data
          this.change_pagename(data)
        }

        //标签页焦点按钮与实际内容不匹配 start
        this.tag_name = this.tabname
        this.change_pagename(this.tag_name)
        //end

        //当sdk模版删除时，标签页不显示sdk名
        for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
          let flag = true
          for (let j = 0; j < this.sdkTemplate.length; j++) {
            if (this.sdkTemplate[j].mark === this.checkedSdkTemplate[i]) {
              flag = false
            }
          }
          if (flag) {
            this.checkedSdkTemplate.splice(i, 1)
          }
        }

        //筛选条件清空
        this.sdk_template_name = ''
        this.getchannelmarklist()

        this.dialogFormVisible = true
      }, //更新对话框展示
      updateData(val) {
        let tothis = this
        let valid_newdomains = []
        for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
          for (let j = 0; j < this.sdk.form.domains.length; j++) {
            if (this.sdk.form.domains[j].param_name.split('-')[0] === this.checkedSdkTemplate[i]) {
              valid_newdomains.push(this.sdk.form.domains[j])
            }
          }
        }
        //二级未勾选的去掉
        let second_newdomains = []
        for (let i = 0; i < valid_newdomains.length; i++) {
          if (valid_newdomains[i].param_name.split('-').length === 3) {
            for (let j = 0; j < this.dialog_secondary_checked.length; j++) {
              if (this.dialog_secondary_checked[j] === valid_newdomains[i].param_name.split('-')[1]) {
                second_newdomains.push(valid_newdomains[i])
              }
            }
          } else {
            second_newdomains.push(valid_newdomains[i])
          }
        }
        for (let i = 0; i < second_newdomains.length; i++) {
          if (!val) {//保存是不判断
            if (second_newdomains[i].param === '') {
              tothis.$notify({
                title: '发布失败',
                dangerouslyUseHTMLString: true,
                message: 'KEY表有参数没填！' + '' +
                  ' <br> -->' + second_newdomains[i].param_name,
                type: 'error',
                duration: 4000
              })
              return
            }
          }


        }

        let submit_object = {
          app_name: this.sdk.app_name,
          channel_mark: this.sdk.channel_mark,
          checked: [],
          form: {
            select: [],
            domains: this.sdk.form.domains
          },
          id: this.sdk.id,
          package_name: this.sdk.package_name,
          publish: '0',
          icon: this.sdk.icon,
          splash: this.sdk.splash,
          keystore: {
            filepath: this.sdk.keystore.keystoreguid,
            keystorePass: this.sdk.keystore.keystorePass,
            keyaliasName: this.sdk.keystore.keyaliasName,
            keyaliasPass: this.sdk.keystore.keyaliasPass,
          },
          sdk_config: 'config_unused',
          sdk_require: 'require_unused',
          sdkstatus: this.sdk.sdkstatus,
          second_checked: [],
          timevalue: this.sdk.timevalue,
          version_online_version: this.sdk.version_online_version,
          version_update_version: this.sdk.version_update_version,
          versioncode_online_version: this.sdk.versioncode_online_version,
          versioncode_update_version: this.sdk.versioncode_update_version,
          note: this.sdk.note
        };
        //把所有有值的一起提交
        if (this.sdk.icon === null) {
          submit_object.icon = '暂无'
        }
        if (this.sdk.splash === null) {
          submit_object.splash = '暂无'
        }
        let newdomains = []
        for (let i = 0; i < this.sdkTemplatelibrary.length; i++) {
          for (let j = 0; j < this.sdkTemplatelibrary[i].keyform.length; j++) {
            if (this.sdkTemplatelibrary[i].keyform[j].param !== '') {
              newdomains.push(this.sdkTemplatelibrary[i].keyform[j])
            }
          }
        }
        //this.sdk.form.domains = newdomains
        submit_object.form.domains = newdomains
        //把二级表单的checked一起保存
        //保留checkedSdkTemplate
        //this.sdk.checked = this.checkedSdkTemplate
        // this.sdk.second_checked = this.dialog_secondary_checked
        submit_object.checked = this.checkedSdkTemplate
        submit_object.second_checked = this.dialog_secondary_checked


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
        //this.sdk.form.select = []
        //this.sdk.form.select = select
        submit_object.form.select = select


        // console.log(this.sdk)
        // console.log(submit_object)
        // return

        // let num = new RegExp('^[0-9]*$')
        // if (!num.test(this.sdk.versioncode_online_version) && !num.test(this.sdk.versioncode_update_version)) {
        //   this.$notify({
        //     title: '警告！',
        //     dangerouslyUseHTMLString: true,
        //     message: '内部版本号格式错误,请及时修改！<br>必须为正整数。',
        //     type: 'warning',
        //     duration: 4000
        //   })
        //   return
        // }

        if (!this.update_flag) {
          return
        }
        this.update_flag = false
        if (val) {  //保存是不判断
          console.log(submit_object)

          updateProjectConfig(submit_object).then(response => {
            this.listLoading = true
            if (this.hidtimevalue != '') {
              this.timevalue = this.hidtimevalue
              this.handleFilter();
            }
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 4000
            })
            if (val) {
              this.handleFilter()
              this.dialogFormVisible = false
            } else {
              this.publish()
            }
            this.update_flag = true
          }).catch(err => {
            console.error(err)
            tothis.$notify({
              title: '失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 4000
            })
          })


        } else {
          console.log(123)
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              console.log(submit_object)
              updateProjectConfig(submit_object).then(response => {
                this.listLoading = true
                if (this.hidtimevalue != '') {
                  this.timevalue = this.hidtimevalue
                  this.handleFilter();
                }
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 4000
                })
                if (val) {
                  this.handleFilter()
                  this.dialogFormVisible = false
                } else {
                  this.publish()
                }
                this.update_flag = true
              }).catch(err => {
                tothis.$notify({
                  title: '失败',
                  message: '请刷新页面后重试',
                  type: 'error',
                  duration: 4000
                })
              })


            }
            this.update_flag = true
          })
        }


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


        let packageName = this.secondary_package
        let package_data = []
        for (let i = 0; i < data3.length; i++) {
          if (data2[i].package_name.search(packageName) != -1) {
            package_data.push(data3[i])
          }
        }


        let project = this.secondary_project
        let project_list = []
        if (project === '') {
          this.list = package_data
          this.listLoading = false
        } else {
          for (let i = 0; i < package_data.length; i++) {
            for (let j = 0; j < project.applist.length; j++) {
              if (package_data[i].package_name === project.applist[j].package_name && package_data[i].channel_mark === project.applist[j].channel) {
                project_list.push(package_data[i])
              }
            }
          }
          this.list = project_list
          this.listLoading = false
        }


      }, //table二次筛选  页面上方按钮
      handleFilter() {
        this.hidtimevalue = this.timevalue
        this.listParam.start = this.timevalue[0]
        this.listParam.end = this.timevalue[1]
        let tothis = this
        this.listLoading = true


        getProjectConfig(this.listParam).then(response => {
          this.list = response.data
          this.hidlist = response.data
          this.listLoading = false
          this.getDatawithParam()
          this.initfilterlist()
          getProject().then(response => {    //根据项目二次筛选
            let todolist = response.data
            this.projectlist_select = todolist
          });
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
        this.channel_mark_list = []
        this.app_name_list = []
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>



