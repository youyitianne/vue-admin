<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <!--<span style="margin-left: 15px;margin-right: 5px">游戏:</span>-->
      <!--<el-select v-model="secondary_game" @change="getDatawithParam" filterable>-->
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
      <el-select v-model="secondary_channel" @change="getDatawithParam" filterable>
        <el-option key="全部" label="全部" value="">
        </el-option>
        <el-option v-for="(item,index) in channel_mark_list" :key="index" :label="item" :value="item">
        </el-option>
      </el-select>
      <span style="margin-left: 15px;margin-right: 5px">包名:</span>
      <el-input placeholder="根据包名查找" v-model="secondary_package" style="width: 200px" class="filter-item" clearable
                @blur="getDatawithParam"/>
      <el-checkbox v-model="checked" border style="margin-left: 15px" @change="getDatawithParam">展示最新配置表
      </el-checkbox>
    </div>
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
        <!--<template slot-scope="props" style="margin: 60px">-->
          <!--<el-form label-position="left" inline class="demo-table-expand">-->
            <!--<el-form-item label="时间:">-->
              <!--<span>{{ props.row.date1}}</span>-->
            <!--</el-form-item>-->
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
            <!--<el-form-item label="备注:">-->
              <!--<span>{{ props.row.note }}</span>-->
            <!--</el-form-item>-->
            <!--&lt;!&ndash;<el-form-item label="sdk配置:">&ndash;&gt;-->
            <!--&lt;!&ndash;<span>{{ props.row.sdk_config }}</span>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-form-item label="渠道特别要求:">&ndash;&gt;-->
            <!--&lt;!&ndash;<span>{{ props.row.sdk_require }}</span>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
            <!--&lt;!&ndash;<el-form-item label="备注:">&ndash;&gt;-->
            <!--&lt;!&ndash;<span>{{ props.row.note }}</span>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
          <!--</el-form>-->
          <!--<div style="margin-bottom: 70px">-->
            <!--<el-table-->
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
          <!--<HR style="border:3px double #001528" width="95%" color=#987cb9 SIZE=3></HR>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="序号" align="center" width="60">-->
        <!--<template slot-scope="scope1">-->
          <!--{{ ++scope1.$index }}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="发布时间" prop="date1" width="200">
      </el-table-column>
      <el-table-column label="应用名" prop="app_name" width="150">
      </el-table-column>
      <el-table-column label="渠道" prop="channel_mark" width="100px">
      </el-table-column>
      <el-table-column label="包名" prop="package_name" width="300px">
      </el-table-column>
      <el-table-column label="外部版本-在线" prop="version_update" width="120px">
      </el-table-column>
      <el-table-column label="内部版本-更新" prop="versioncode_update_version"  width="120px">
      </el-table-column>
      <el-table-column label="备注" prop="note">
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)" v-if="checkPermission(['director','admin','sdksuport','operatorleader'])">{{ "删除" }}</el-button>
          <el-button type="success" size="mini" @click="handleView(scope.row)" >{{ "查看" }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :close-on-click-modal=false
      title="详情"
      :visible.sync="dialogVisible"
      width="70%">
      <el-form label-position="left" inline class="demo-table-expand" :model="dialogForm" label-width="150px">
        <el-form-item label="时间:">
          <span>{{ dialogForm.date1}}</span>
        </el-form-item>
        <el-form-item label="游戏名:">
          <span>{{ dialogForm.app_name }}</span>
        </el-form-item>
        <el-form-item label="包名:">
          <span>{{ dialogForm.package_name }}</span>
        </el-form-item>
        <el-form-item label="渠道标记:">
          <span>{{ dialogForm.channel_mark }}</span>
        </el-form-item>
        <el-form-item label="外部版本-在线:">
          <span>{{ dialogForm.version_online }}</span>
        </el-form-item>
        <el-form-item label="内部版本-在线:">
          <span>{{ dialogForm.versioncode_online_version }}</span>
        </el-form-item>
        <el-form-item label="外部版本-更新:">
          <span>{{ dialogForm.version_update }}</span>
        </el-form-item>
        <el-form-item label="内部版本_更新:">
          <span>{{ dialogForm.versioncode_update_version }}</span>
        </el-form-item>
        <el-form-item label="icon:">
          <span>{{ dialogForm.icon }}</span>
        </el-form-item>
        <el-form-item label="splash:">
          <span>{{ dialogForm.splash }}</span>
        </el-form-item>
        <el-form-item label="keystorePath:">
          <span>{{ dialogForm.keystorePath }}</span>
        </el-form-item>
        <el-form-item label="keystorePass:">
          <span>{{ dialogForm.keystorePass }}</span>
        </el-form-item>
        <el-form-item label="keyaliasName:">
          <span>{{ dialogForm.keyaliasName }}</span>
        </el-form-item>
        <el-form-item label="keyaliasPass:">
          <span>{{ dialogForm.keyaliasPass }}</span>
        </el-form-item>
        <el-form-item label="备注:">
          <span>{{ dialogForm.note }}</span>
        </el-form-item>
      </el-form>
      <el-table
        stripe
        border
        :data="projectObject.paramter"
        style="width: 90%;margin-bottom: 30px;margin-top: 30px"
        :span-method="objectSpanMethod">
        <el-table-column
          prop="mark"
          label="模块名"
          style="width: 200px">
        </el-table-column>
        <el-table-column
          prop="param_name1"
          label="参数名"
          style="width: 300px">
        </el-table-column>
        <el-table-column
          prop="param"
          label="参数">
        </el-table-column>
      </el-table>

      <span>
          复制Key表链接:&nbsp&nbsp<el-input v-model="link" placeholder="Please input" style="max-width:100%;width: 900px" disabled/>
        <el-button v-clipboard:copy="link" v-clipboard:success="clipboardSuccess" type="primary" icon="document">复制</el-button>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
    </el-dialog>



  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  //import {getSdkTemplate,getChannel} from '@/api/table/sdkmanager/projectconfigtable'
  import {updateProjectConfig,getProjectConfigPublish,getResourceName,getProject} from '@/api/table/sdkmanager/projectconfigtable_publish'
  import store from '@/store'

  import clipboard from '@/directive/clipboard/index' // use clipboard by v-directive


  export default {
    directives: {
      clipboard
    },
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
        link:'',
        dialogForm:{},
        projectObject:{},
        dialogVisible:false,
        projectList: [],
        projectlist_select: [],
        secondary_project: '',
        secondary_package: '',
        tag_name: '',
        options: [],
        value: [],
        page_name: '',  //初始值  一直为 ''
        dialog_secondary_checked: [],
        dialog_secondary_list: [],
        dialog_secondary_visual: false,
        app_name_list: [],
        spanArr: [],
        filter_form_name: '无',
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
      //this.fetchName()
      this.routeWithParam()  //带参跳转
      //this.initchannel()  //获取渠道
      //this.initTemplate()   //获取sdk模版
      this.initDate()   //初始化日期查询数据
    },
    methods: {
      handleCopy(text, event) {
        clip(text, event)
      },
      clipboardSuccess() {
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1500
        })
      },
      handleView(value){
        console.log(value)
        //this.link='http://192.168.1.144:8085/sdkapi?timestamp='+value.timestamp+'&app='+value.app_name+'&channel='+value.channel_mark
        this.link='http://192.168.1.144:8085/sdkapi?package_name='+value.package_name+'&channel_mark='+value.channel_mark
        this.dialogForm=value
        this.getSpanArr(value.paramter)
        this.projectObject=value
        this.dialogVisible=true

      },//查看按钮
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
      handleDelete(data) {
        let tothis = this
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateProjectConfig(data).then(response => {
            this.handleFilter();
          }).catch(rs => {
            tothis.$notify({
              title: '删除失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 2000
            })
          })
        })
      },//删除方法
      test1(name) {
        if (name === this.tag_name) {
          return true
        }
        return false
      },
      findtabname(tab, event) {
        this.tag_name = tab.label
        this.change_pagename(tab.label)
      },//获取对话框内标签页 名触发事件
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
          if (this.hidsdkTemplate[i].search(this.sdk_template_name) != -1) {
            list.push(this.hidsdkTemplate[i])
          }
        }
        this.sdkTemplate = list
      },//根据对话框内搜索框改变sdk多选框
      // handleCreateByTemplate(param) {
      //   this.dialog_secondary_checked = []
      //   this.handleCreate()
      //   this.handleUpdate(param)
      //   const date = new Date();
      //   this.sdk.timevalue = date
      //   this.dialogStatus = 'create'
      // },//以为模版创建
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
            if (this.sdkTemplatelibrary[j].name.keymark === this.checkedSdkTemplate[i]) {
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
      resetTemp() {
        this.checkedSdkTemplate = []
        for (let j = 0; j < this.sdkTemplatelibrary.length; j++) {
          for (let x = 0; x < this.sdkTemplatelibrary[j].keyform.length; x++) {
            this.sdkTemplatelibrary[j].keyform[x].param = ''
          }
        }
        this.sdk = {
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
        console.log(param)
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
        this.sdk.app_name = param.app_name
        this.sdk.package_name = param.package_name
        this.sdk.channel_mark = param.channel_mark
        this.sdk.version_online_version = param.version_online
        this.sdk.version_update_version = param.version_update
        this.sdk.versioncode_online_version = param.versioncode_online_version
        this.sdk.versioncode_update_version = param.versioncode_update_version
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
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      }, //更新对话框展示
      updateData() {
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
        if (!this.update_flag) {
          return
        }
        this.update_flag = false
        updateProjectConfig(this.sdk).then(response => {
          this.listLoading = true
          if (this.hidtimevalue != '') {
            this.timevalue = this.hidtimevalue
            this.handleFilter();
          }
          this.dialogFormVisible = false
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
            title: '编辑失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
          this.update_flag = true
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

        let statuse = this.checked       //最新
        let data2 = []
        if (statuse === true) {
          for (let i = 0; i < data1.length; i++) {
            let flag = true
            for (let j = 0; j < data2.length; j++) {
              if (data1[i].channel_mark === data2[j].channel_mark && data1[i].package_name === data2[j].package_name) {
                flag = false
              }
            }
            if (flag) {
              data2.push(data1[i])
            }
          }
        } else {
          data2 = data1
        }
        let packageName = this.secondary_package
        let package_data = []
        for (let i = 0; i < data2.length; i++) {
          if (data2[i].package_name.search(packageName) != -1) {
            package_data.push(data2[i])
          }
        }
        let project = this.secondary_project
        let project_list = []
        //console.log(package_data)   //package_name   channel_mark
        //console.log(project.applist)  //package_name   channel
        if (project === '') {
          this.list = package_data
          this.listLoading = false
        } else {
          for (let i = 0; i < package_data.length; i++) {
            for (let j = 0; j < project.applist.length; j++) {
              if (package_data[i].package_name === project.applist[j].package_name && package_data[i].channel_mark === project.applist[j].channel) {
                project_list.push(package_data[i])
                break
              }
            }
          }
          this.list = project_list
          this.listLoading = false
        }
      }, //table二次筛选  页面上方按钮
      handleFilter() {
        let tothis = this
        this.listLoading = true
        let accountName = store.getters && store.getters.name
        let name = {
          username: accountName
        }
        getProjectConfigPublish().then(response => {
          let projectPublishList = response.data
          let valid = this.checkPermission(['director']) || this.checkPermission(['admin']) || this.checkPermission(['operatorleader']) || this.checkPermission(['sdksuport'])
          getResourceName(name).then(response => {
            let projectlist = response.data
            //获取资源分配列表
            this.projectList = projectlist
            getProject().then(response => {
              let todolist = response.data
              if (!valid) {
                //根据资源分配列表筛选项目选择栏
                let newProjectList = []
                for (let i = 0; i < projectlist.length; i++) {
                  for (let j = 0; j < todolist.length; j++) {
                    if (projectlist[i] === todolist[j].project_name) {
                      newProjectList.push(todolist[j])
                    }
                  }
                }
                this.projectlist_select = newProjectList
              }else {
                this.projectlist_select=todolist
              }
              //
              let newlist = []
              if (!valid) {
                for (let i = 0; i < todolist.length; i++) {
                  for (let j = 0; j < projectlist.length; j++) {
                    if (todolist[i].project_name === projectlist[j]) {
                      newlist = newlist.concat(todolist[i].applist)
                      break
                    }
                  }
                }
                let validlist = []
                for (let i = 0; i < newlist.length; i++) {
                  for (let j = 0; j < projectPublishList.length; j++) {
                    if (newlist[i].package_name === projectPublishList[j].package_name && newlist[i].channel === projectPublishList[j].channel_mark) {
                      validlist.push(projectPublishList[j])
                    }
                  }
                }
                this.list = validlist
                this.hidlist = validlist
                this.listLoading = false
                this.getDatawithParam()
                this.initfilterlist()
              } else {
                this.list = projectPublishList
                this.hidlist = projectPublishList
                this.listLoading = false
                this.getDatawithParam()
                this.initfilterlist()
              }
            })
          }).catch(rs => {
            console.error(rs)
          })
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
        console.log(row)
        console.log(expandedRows)
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



