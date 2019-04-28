<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <span style="margin-left: 15px;margin-right: 5px">应用名:</span>
      <el-input v-model="secondary_game" style="width: 200px" class="filter-item" clearable/>
      <span style="margin-left: 15px;margin-right: 5px">渠道:</span>
      <el-input v-model="secondary_channel" style="width: 200px" class="filter-item" clearable/>
      <span style="margin-left: 15px;margin-right: 5px">包名:</span>
      <el-input v-model="secondary_package" style="width: 200px" class="filter-item" clearable/>
      <el-button style="margin-left: 20px" @click="searchTable" v-loading.fullscreen.lock="fullscreenLoading">搜索
      </el-button>
    </div>
    <el-table
      height="760"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :row-key='getRowKeys'
      fit
      stripe
      border
      highlight-current-row>
      <el-table-column label="包名" prop="package_name" width="300px">
      </el-table-column>
      <el-table-column label="应用名" prop="app_name" width="150">
      </el-table-column>
      <el-table-column label="渠道" prop="channel_mark" width="100">
      </el-table-column>
      <el-table-column label="外部版本-更新" prop="version_update" width="120">
      </el-table-column>
      <el-table-column label="内部版本-更新" prop="versioncode_update_version" width="120">
      </el-table-column>
      <el-table-column label="备注" prop="note">
      </el-table-column>
      <el-table-column label="操作" align="center" width="250px" class-name="small-padding fixed-width"
                       v-if="checkPermission(['operatorleader','admin','sdksuport','director','operator'])">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleUpdate(scope.row)">{{ "编辑" }}</el-button>
          <el-button @click="link_Check(scope.row)" size="mini" type="info">查看配置表发布记录</el-button>
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
        <el-form-item label="发布账号" v-if="this.dialogStatus === 'update'"
                      prop="keystore">
          <el-select v-model="sdk.keystore" placeholder="请选择" class="dia-input" filterable value-key="keystoreguid">
            <el-option
              v-for="item in keystoreList"
              :key="item.keystoreguid"
              :label="item.companyName"
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
        <div style="text-align: center">
          <el-upload
            style="margin: 20px;width: 40%;display: inline-block"
            class="avatar-uploader"
            :action="resPath"
            accept=".png,.jpg"
            :show-file-list="false"
            :on-success="uploadSuccess_icon"
            :before-upload="beforeUpload_icon">
            <img v-if="imageUrl_icon" :src="imageUrl_icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">此处上传icon,<a style="text-decoration:underline"
                                                               :href="this.imageUrl_icon" target="_blank"
                                                               title="点击查看大图">点击查看大图</a>
            </div>
          </el-upload>
          <el-upload
            style="margin: 20px;width: 50%;display: inline-block"
            class="avatar-uploader"
            :action="resPath"
            accept=".png,.jpg"
            :show-file-list="false"
            :on-success="uploadSuccess_splash"
            :before-upload="beforeUpload_splash">
            <img v-if="imageUrl_splash" :src="imageUrl_splash" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">此处上传splash,<a style="text-decoration:underline"
                                                                 :href="this.imageUrl_splash"
                                                                 target="_blank" title="点击查看大图">点击查看大图</a>
            </div>
          </el-upload>
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
        <el-button type="primary" @click="updateData(true)" >{{ '保存' }}</el-button>
        <el-button type="success" @click="updateData(false)">发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
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
    getProject,
    uploadRes,
    getProjectLimitMeth
  } from '@/api/table/sdkmanager/projectconfigtable'
  import {getName, getResourceName} from '@/api/table/sdkmanager/projectconfigtable'
  import {fetchFileInfo, getFile, delFile, fetchKeystoreInfo} from '@/api/fileupload'
  import {getToken} from '@/utils/auth'
  import {getcompanyInfoMeth} from '@/api/table/sdkmanager/companyInfo'

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
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    data() {
      return {
        fullscreenLoading: false,
        pageSize: 30,
        totalPages: 0,
        currentPage: 1,
        user: '',
        resPath: 'http://192.168.1.144:8091/file',
        imageUrl_splash: '',
        imageUrl_icon: '',
        keystoreList: [],
        dataObj: {
          'Authorization': ''
        },
        tabname: '',
        secondary_package: '',
        rowvalue: '',
        tag_name: '',
        options: [],
        value: [],
        page_name: '',  //初始值  一直为 ''
        dialog_secondary_checked: [],
        dialog_secondary_list: [],
        dialog_secondary_visual: false,
        filter_form_name: '暂无',
        update_flag: true,
        sdk_template_name: '',
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
        listLoading: true,
        names: [],
        layout: '',
        timevalue: '',
        hidtimevalue: '',
        list: null,
        listLoading: false,
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
        getRowKeys(row) {
          return row.id
        },
      }
    },
    created() {
      this.user = this.name
      this.initTemplate()   //获取sdk模版
      this.routeWithParam()//跳转赋值
      this.pageChange(1) //初始化表格
      this.listKeyStoreInfo()//获取keystore列表
    },
    methods: {

      searchTable() {
        this.pageChange(1);
      },//搜索应用
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
          appName: this.secondary_game,
          channelName: this.secondary_channel,
          packageName: this.secondary_package,
        }
        getProjectLimitMeth(param).then(response => {
          if (response.repcode === 3000) {
            this.hidlist = response.data
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
      listKeyStoreInfo() {
        let tothis = this;
        getcompanyInfoMeth().then(response => {
          if (response.repcode === 3000) {
            this.keystoreList = response.data
            console.log('keystore', this.keystoreList)
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
        //icon上传至资源服务器后，返回原文件名和guid 再存储至数据库
        console.log(response.data)
        this.sdk.icon = response.data.guid
        this.imageUrl_icon = this.resPath + "?path=" + response.data.guid
      },//icon上传成功事件
      uploadSuccess_splash(response) {
        console.log(response.data)
        this.sdk.splash = response.data.guid
        this.imageUrl_splash = this.resPath + "?path=" + response.data.guid
      },//splash上传成功事件
      link_Check(val) {
        let routeData = this.$router.resolve({
          name: 'ProjectConfigList',
          query: {package_name: val.package_name, channel: val.channel_mark}
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
        // for (let i = 0; i < second_newdomains.length; i++) {
        //
        //   if (second_newdomains[i].param === '') {
        //     tothis.$notify({
        //       title: '发布失败',
        //       dangerouslyUseHTMLString: true,
        //       message: 'KEY表有参数没填！' + '' +
        //         ' <br> -->' + second_newdomains[i].param_name,
        //       type: 'error',
        //       duration: 4000
        //     })
        //     return
        //   }
        //
        // }
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
        this.sdk.publisher = this.user

        this.sdk.checked = this.checkedSdkTemplate
        this.sdk.second_checked = this.dialog_secondary_checked

        console.log('发布对象', this.sdk)
        getProjectConfigPublish().then(response => {
          this.publishlist = response.data
          if (!this.valideSdkForm()) {
            //this.dialogFormVisible = false
            this.fullscreenLoading=false
            return
          }
          let timestamp = (new Date()).getTime()
          this.sdk.timevalue = timestamp
          this.sdk.keystore.filepath = this.sdk.keystore.keystoreguid
          createProjectConfig(this.sdk).then(response => {
            this.fullscreenLoading = false
            this.pageChange(this.currentPage)
            this.$notify({
              title: '成功',
              message: '发布成功',
              type: 'success',
              duration: 4000
            })

            this.dialogFormVisible = false
            this.listLoading = false
          }).catch(rs => {
            this.fullscreenLoading = false
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
          publisher: '',
          icon: '暂无',
          splash: '暂无',
          keystore: def_keystore,
          publish: '0',
          form: {
            domains: [],
          }
        }
        console.log(this.sdk)
      }, //重置对话框
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
          this.imageUrl_icon = this.resPath + '?path=' + param.icon
        } else {
          this.imageUrl_icon = ''
        }
        console.log(param.splash)
        if (param.splash !== '暂无') {
          this.imageUrl_splash = this.resPath + '?path=' + param.splash
        } else {
          this.imageUrl_splash = ''
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
        // for (let i = 0; i < second_newdomains.length; i++) {
        //   if (!val) {//保存是不判断
        //     if (second_newdomains[i].param === '') {
        //       tothis.$notify({
        //         title: '发布失败',
        //         dangerouslyUseHTMLString: true,
        //         message: 'KEY表有参数没填！' + '' +
        //           ' <br> -->' + second_newdomains[i].param_name,
        //         type: 'error',
        //         duration: 4000
        //       })
        //       return
        //     }
        //   }
        // }

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
            MD5: this.sdk.keystore.MD5,
            SHA1: this.sdk.keystore.SHA1,
            SHA256: this.sdk.keystore.SHA256,
            companyName: this.sdk.keystore.companyName,
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
          note: this.sdk.note,
          publisher: this.user,
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
        submit_object.form.select = select
        console.log('保存对象', submit_object)
        if (!this.update_flag) {
          return
        }
        this.update_flag = false
        if (val) {  //保存是不判断
          this.fullscreenLoading = true
          updateProjectConfig(submit_object).then(response => {
            this.listLoading = true
            if (this.hidtimevalue != '') {
              this.timevalue = this.hidtimevalue
              this.pageChange(this.currentPage)
            }
            this.listLoading = false
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 4000
            })
            this.pageChange(this.currentPage)
            this.dialogFormVisible = false
            this.update_flag = true
            this.fullscreenLoading = false
          }).catch(err => {
            this.fullscreenLoading = false
            console.error(err)
            tothis.$notify({
              title: '失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 4000
            })
          })
        } else {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.fullscreenLoading = true
              console.log(submit_object)
              updateProjectConfig(submit_object).then(response => {
                this.listLoading = true
                if (this.hidtimevalue != '') {
                  this.timevalue = this.hidtimevalue
                  this.pageChange(this.currentPage)
                }
                this.$notify({
                  title: '成功',
                  message: '保存成功',
                  type: 'success',
                  duration: 4000
                })
                this.publish()
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
      checkPermission,
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



