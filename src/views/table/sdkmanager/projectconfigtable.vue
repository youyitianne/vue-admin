<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;margin-right: 20px" type="primary" icon="el-icon-edit"
                 @click="handleCreate">添加配置表
      </el-button>
      <span style="margin-left: 15px;margin-right: 5px">游戏:</span>
      <el-select v-model="secondary_game" @change="getDatawithParam">
        <el-option key="全部" label="全部" value="">
        </el-option>
        <el-option  v-for="item in app_name_list" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <span style="margin-left: 15px;margin-right: 5px">渠道:</span>
      <el-select v-model="secondary_channel" @change="getDatawithParam">
        <el-option key="全部" label="全部" value="">
        </el-option>
        <el-option v-for="item in channel_mark_list" :key="item"  :label="item" :value="item">
        </el-option>
      </el-select>
      <el-checkbox v-model="checked" border style="margin-left: 15px" @change="getDatawithParam">展示可见</el-checkbox>
      <el-checkbox v-model="checked1" border style="margin-left: 15px" @change="getDatawithParam">展示隐藏</el-checkbox>
    </div>
    <el-table
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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="时间:">
              <span>{{ props.row.date}}</span>
            </el-form-item>
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
            <el-form-item label="sdk配置:">
              <span>{{ props.row.sdk_config }}</span>
            </el-form-item>
            <el-form-item label="状态:">
              <span v-if="props.row.sdk_status===0"><el-button size="mini" type="danger">隐藏</el-button></span>
              <span v-if="props.row.sdk_status===1"><el-button size="mini" type="success">可见</el-button></span>
            </el-form-item>
            <el-form-item label="渠道特别要求:">
              <span>{{ props.row.sdk_require }}</span>
            </el-form-item>
            <el-form-item label="备注:">
              <span>{{ props.row.note }}</span>
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
                prop="param_name"
                label="参数名"
                style="width: 15%">
              </el-table-column>
              <el-table-column
                prop="param"
                label="参数"
                style="width: 25%">
              </el-table-column>
              <el-table-column
                prop="note"
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
      <el-table-column label="时间" prop="date" width="200px">
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
      <el-table-column label="状态" align="center" width="130" class-name="small-padding fixed-width" prop="sdk_status"
                       v-if="checkPermission(['operator', 'planner','admin','leader'])">
        <template slot-scope="scope">
          <el-button size="mini" type="success" v-if="scope.row.sdk_status===1">可见</el-button>
          <el-button size="mini" type="danger" v-if=" scope.row.sdk_status===0">隐藏</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="450" class-name="small-padding fixed-width"
                       v-if="checkPermission(['operator', 'planner','admin','leader'])">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCreateByTemplate(scope.row)">{{ "创建新表" }}</el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ "编辑" }}</el-button>
          <el-button type="success" size="mini" @click="publish(scope.row)">发布</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :model="sdk" label-position="left" label-width="150px" :inline="true"
               style="margin-left:50px;" status-icon id="form-custom">
        <el-form-item label="时间" class="filter-item" v-if="this.dialogStatus === 'create'">
          <el-date-picker v-model="sdk.timevalue" type="datetime" :disabled=true>
          </el-date-picker>
        </el-form-item>
        <div>
          <el-form-item label="游戏名" :rules="[{ required: true, message: '游戏名不能为空'}]" prop="app_name">
            <el-input v-model="sdk.app_name" placeholder="必填~" class="dia-input"/>
          </el-form-item>
        </div>
        <el-form-item label="包名" :rules="[{ required: true, message: '包名不能为空'}]" prop="package_name">
          <el-input v-model="sdk.package_name" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="渠道标记" :rules="[{ required: true, message: '渠道不能为空'}]" prop="channel_mark">
          <el-select v-model="sdk.channel_mark" placeholder="请选择">
            <el-option
              v-for="item in channel_mark_list_dia"
              :key="item.name"
              :label="item.program_mark"
              :value="item.program_mark">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外部版本-在线" class="filter-item" :rules="[{ required: true, message: '线上版本—版本-在线版本不能为空'}]"
                      prop="version_online_version">
          <el-input v-model="sdk.version_online_version" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="内部版本-在线" :rules="[{ required: true, message: '线上版本-versioncode-在线版本'}]"
                      prop="versioncode_online_version">
          <el-input v-model="sdk.versioncode_online_version" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="外部版本-更新" :rules="[{ required: true, message: '线上版本-版本-更新版本不能为空'}]"
                      prop="version_update_version">
          <el-input v-model="sdk.version_update_version" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="内部版本_更新" :rules="[{ required: true, message: '线上版本-versioncode-更新版本'}]"
                      prop="versioncode_update_version">
          <el-input v-model="sdk.versioncode_update_version" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="sdk配置" class="filter-item">
          <el-input v-model="sdk.sdk_config" placeholder="" class="dia-input"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="sdk.sdkstatus" active-color="#13ce66" inactive-color="#ff4949"
                     active-value="1" inactive-value="0"
                     active-text="可见" inactive-text="隐藏" >
          </el-switch>
        </el-form-item>
        <el-form-item label="渠道特别要求">
          <el-input type="textarea" v-model="sdk.sdk_require" class="dia-input" maxlength="150" :autosize="{maxRows: 5}"
                    placeholder=""/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="sdk.note" class="dia-input" maxlength="150" :autosize="{maxRows: 5}"
                    placeholder=""/>
        </el-form-item>
        <br/>
        <!--<el-button @click="addDomain" style="margin-bottom: 15px" type="primary">新增</el-button>-->
        <el-input placeholder="SDK模版筛选" v-model="sdk_template_name"
                  style="width: 200px;margin-bottom: 10px" class="filter-item" clearable
                  @blur="getchannelmarklist"/>
        <el-checkbox-group
          v-model="checkedSdkTemplate">
          <!--v-if="this.dialogStatus === 'create'">-->
          <el-checkbox v-for="name in sdkTemplate" :label="name" :key="name" @change="getSdkTemplate">{{name}}
          </el-checkbox>
        </el-checkbox-group>
        <br/>
        <el-tabs tab-position="left" style="width: 95%;background-color: #f4f4f5;height: 500px;padding: 1px"
                 @tab-click="findtabname" type="border-card">
          <el-tab-pane v-for="name in checkedSdkTemplate" :label="name" :key="name"
                       style="font-size: 14px;font-family: Microsoft YaHei;width: 100%">
            <div name="pane_form" style="height: 500px;overflow: auto;">
              <!--对话框内层多选框-->
              <el-checkbox-group
                v-model="dialog_secondary_checked"
                v-if="dialog_secondary_visual">
                <el-checkbox v-for="name in dialog_secondary_list" :label="name" :key="name" @change="dialog_secondary_checked_changed">{{name}}
                </el-checkbox>
              </el-checkbox-group>
              <!--对话框内层多选框-->
              <!--动态增减表单项-->
              <el-form-item v-for="(domain, index) in sdk.form.domains" :key="domain.key+index"
                            v-if="form_item_filter(domain.param_name)" style="margin-right: 1px"
                            inline=true>

                <span style="margin-right: 20px;font-size: 14px;font-family: Microsoft YaHei">{{domain.param_name}}：</span>
                <el-input v-model="domain.param" style="width: 300px;margin-right: 25px" placeholder="必填"/>
                <span style="font-size: 14px;font-family: Microsoft YaHei">备注：</span>
                <el-input type="textarea" v-model="domain.note" style="width: 300px;margin-right: 20px" placeholder="必填"/>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>

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
        dialog_secondary_checked:[],
        dialog_secondary_list:[],
        dialog_secondary_visual:false,
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
        importanceOptions: [1, 2, 3],
        names: [],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
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
          }
        },
        hidlist: '',
        channel_mark_list_dia:[],
        publishlist: [],
        expands: [],
        getRowKeys(row) {
          return row.id
        },
      }
    },
    created() {
      //this.fetchName()
      this.initchannel()
      this.initTemplate()
      this.initDate()
    },
    methods: {
      dialog_secondary_checked_changed(){

      },
      findtabname(tab, event) {
        this.dialog_secondary_visual=false
        this.dialog_secondary_list=[]
        let visual=this.dialog_secondary_visual;
        let list=this.dialog_secondary_list;
        for (let i=0;i<this.sdk.form.domains.length;i++){
          let data=this.sdk.form.domains[i].param_name
          if (data.split('-').length>2&&data.split('-')[0]===tab.label) {
            visual=true
            if (list.length===0){
              list.push(data.split('-')[1])
            } else {
              let flag=true
              for (let x=0;x<list.length;x++){
                if (list[x].search(data.split('-')[1])!=-1){
                  flag=false
                }
              }
              if (flag){
                list.push(data.split('-')[1])
              }
            }
          }
        }
        this.dialog_secondary_visual=visual;
        this.dialog_secondary_list=list;
        this.filter_form_name = tab.label
      },//获取点击的标签页名
      publish(param) {
        let tothis = this
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
        this.sdk.form.domains = param.paramter
        this.sdk.sdkstatus = '1'
        this.sdk.publish = '1'
        getProjectConfigPublish().then(response => {
          this.publishlist = response.data
          if (!this.valideSdkForm()) {
            return
          }
          ;
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
      },
      valideSdkForm() {
        let flag = true
        let tothis = this
        let difference = false
        let out_code = ''
        let in_code = -1
        for (let i = 0; i < this.publishlist.length; i++) {
          if (this.publishlist[i].channel_mark === this.sdk.channel_mark && this.publishlist[i].package_name === this.sdk.package_name) {
            if (this.publishlist[i].version_update >= this.sdk.version_update_version) {  //外版本号
              let arr1 = this.publishlist[i].version_update.split('.');
              let arr2 = this.sdk.version_update_version.split('.');
              if (arr2.length < 2) {
                this.$notify({
                  title: '警告！',
                  message: '外部版本号格式不正确,请及时修改！',
                  type: 'warning',
                  duration: 2000
                })
                return false
              }
              let diff = this.compareVersion(this.publishlist[i].version_update, this.sdk.version_update_version)

              if (diff >= 0) {
                if (out_code === '') {
                  out_code = this.publishlist[i].version_update
                } else {
                  let diff1 = this.compareVersion(this.publishlist[i].version_update, out_code)
                  if (diff1 > 0) {
                    out_code = this.publishlist[i].version_update
                  }
                }
                difference = true
              }
            }
            if (!parseInt(this.sdk.versioncode_update_version) || !parseInt(this.sdk.versioncode_online_version)) {
              this.$notify({
                title: '警告！',
                message: '内部版本号格式不正确,请及时修改！',
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
            if (this.publishlist[i].versioncode_update_version >= this.sdk.versioncode_update_version) { //内版本号
              if (parseInt(this.publishlist[i].versioncode_update_version) > parseInt(in_code)) {
                in_code = this.publishlist[i].versioncode_update_version
              }
              difference = true
            }
          }
        }
        if (difference) {
          let message = ''
          if (out_code != '') {
            message = '最高外版本号为：' + out_code + ' 。';
          }
          if (in_code > 0) {
            message = message + '最高内版本号为：' + in_code + ' 。';
          }
          this.$notify({
            title: '警告！',
            message: '更新版本必须高于在线版本,请及时修改！' + message,
            type: 'warning',
            duration: 2000
          })
          flag = false
        }
        let emptylist = [];
        for (let i = 0; i < this.sdk.form.domains.length; i++) {
          if (this.sdk.form.domains[i].param_name === '' || this.sdk.form.domains[i].param === '' || this.sdk.form.domains[i].note === '') {
            emptylist.push(i + 1)
          }
        }
        if (this.sdk.sdk_require === '') {
          this.sdk.sdk_require = '暂无'
        }
        if (this.sdk.note === '') {
          this.sdk.note = '暂无'
        }
        if (this.sdk.sdk_config === '') {
          this.sdk.sdk_config = '暂无'
        }
        if (emptylist.length != 0) {
          this.$notify({
            title: '警告！',
            message: 'KEY表有参数没填！',
            type: 'error',
            duration: 2000
          })
          this.listLoading = false
          flag = false
        }
        return flag
      },  //发布验证
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
      form_item_filter(param) {
        let checked=this.dialog_secondary_checked
        let names = param.split('-')
        if (names[0] === this.filter_form_name) {
          if (names.length<3){
            return true
          }else {
            let flag=false
            for (let i=0;i<checked.length;i++){
              if (names[1]===checked[i]) {
                flag=true
              }
            }
            if (flag){
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
        for (let i = 0; i < this.hidsdkTemplate.length; i++) {
          if (this.hidsdkTemplate[i].search(this.sdk_template_name) != -1) {
            list.push(this.hidsdkTemplate[i])
          }
        }
        this.sdkTemplate = list
      },//标签页随动展示
      handleCreateByTemplate(param) {
        this.dialog_secondary_checked=[]
        this.handleCreate()
        this.handleUpdate(param)
        const date = new Date();
        this.sdk.timevalue = date
        this.dialogStatus = 'create'
      },//以为模版创建
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
      },  //默认展示
      initTemplate() {
        this.listLoading = true
        getSdkTemplate().then(response => {
          this.sdkTemplate = response.name_list
          this.sdkTemplatelibrary = response.list
          this.hidsdkTemplate = response.name_list
          this.listLoading = false
        })
      },//获取sdk模版
      getSdkTemplate() {
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
        if (this.sdk.form.domains.length !== 0) {
          this.filter_form_name = this.checkedSdkTemplate[0]
        }
      },//sdk模版根据多选框变动
      createData() {
        let tothis = this
        for (let i = 0; i < this.sdk.form.domains.length; i++) {
          if (this.sdk.form.domains[i].param_name === '' || this.sdk.form.domains[i].param === '' || this.sdk.form.domains[i].note === '') {
            let names=this.sdk.form.domains[i].param_name.split('-')
            let show_flag=false
            if (names.length<3){
              show_flag=true
            } else {
              let checked_falg=true
              for (let j=0;j<this.dialog_secondary_checked.length;j++){
                let checked=this.dialog_secondary_checked[j]
                checked
                if (checked===names[1]){
                  checked_falg=false
                  show_flag=true
                }
              }
              if (checked_falg){
                this.sdk.form.domains.splice(i)
              }
            }
            if (show_flag){
              this.$notify({
                title: '警告！',
                dangerouslyUseHTMLString:true,
                message: 'KEY表有参数没填！'+'' +
                  ' <br> -->'+this.sdk.form.domains[i].param_name,
                type: 'error',
                duration: 2000
              })
              return
            }
          }
        }
        if (this.sdk.sdk_require === '') {
          this.sdk.sdk_require = '暂无'
        }
        if (this.sdk.note === '') {
          this.sdk.note = '暂无'
        }
        if (this.sdk.sdk_config === '') {
          this.sdk.sdk_config = '暂无'
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let timestamp = (new Date(this.sdk.timevalue)).getTime()
            this.sdk.timevalue = timestamp
            if (this.create_flag) {
              this.create_flag = false
              createProjectConfig(this.sdk).then(response => {
                this.create_flag = true
                this.initDate()
                this.$notify({
                  title: '成功',
                  message: '添加成功',
                  type: 'success',
                  duration: 2000
                })
                this.dialogFormVisible = false
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
        this.getSdkTemplate()
      }, //创建对话框
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
        return diff
      },//比较版本号
      handleUpdate(param) {
        //对话框二级表单展示
        console.log(param.paramter)
        let checked=[]
        for (let i=0;i<param.paramter.length;i++){
          let names=param.paramter[i].param_name
          let name=''
          if (names.split('-').length>2) {
             name=names.split('-')[1]
            if (checked.length===0){
              checked.push(name)
            } else {
              let flag=true
              for (let x=0;x<checked.length;x++){
                if (checked[x]===name) {
                  flag=false
                }
              }
              if (flag){
                checked.push(name)
              }
            }
          }
        }
        this.dialog_secondary_checked=checked
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
        this.sdk.form.domains = param.paramter
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
            this.filter_form_name = name //添加默认的标签页名
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
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      }, //更新对话框展示
      updateData() {
        let tothis = this
        for (let i = 0; i < this.sdk.form.domains.length; i++) {
          if (this.sdk.form.domains[i].param_name === '' || this.sdk.form.domains[i].param === '' || this.sdk.form.domains[i].note === '') {
            let names=this.sdk.form.domains[i].param_name.split('-')
            let show_flag=false
            if (names.length<3){
              show_flag=true
            } else {
              let checked_falg=true
              for (let j=0;j<this.dialog_secondary_checked.length;j++){
                let checked=this.dialog_secondary_checked[j]
                checked
                if (checked===names[1]){
                  checked_falg=false
                  show_flag=true
                }
              }
              if (checked_falg){
                this.sdk.form.domains.splice(i)
              }
            }
            if (show_flag){
              this.$notify({
                title: '警告！',
                dangerouslyUseHTMLString:true,
                message: 'KEY表有参数没填！'+'' +
                  ' <br> -->'+this.sdk.form.domains[i].param_name,
                type: 'error',
                duration: 2000
              })
              return
            }
          }
        }
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
          this.update_flag = true
        }).catch(err => {
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
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
      }, //二次筛选
      handleFilter() {
        if (this.timevalue === '' || this.timevalue[0] === 'undefined' || this.timevalue[1] === 'undefined') {
          this.open3()
          return
        }
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
        }).catch(function (rs) {
          tothis.listLoading = false
        })
      },  //根据时间查询
      open3() {
        this.$message({
          message: '记得选择查询范围~',
          type: 'warning'
        });
      }, //查询范围提示
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
      } ,//日期转换
      initfilterlist(){
        for (let i = 0; i < this.hidlist.length; i++) {
          if (this.channel_mark_list.length === 0) {
            this.channel_mark_list.push(this.hidlist[i].channel_mark)
          } else {
            let channel_flag=true
            for (let x = 0; x < this.channel_mark_list.length; x++) {
              if (this.channel_mark_list[x]===this.hidlist[i].channel_mark){
                channel_flag=false
              }
            }
            if (channel_flag){
              this.channel_mark_list.push(this.hidlist[i].channel_mark)
            }
          }
          if (this.app_name_list.length === 0) {
            this.app_name_list.push(this.hidlist[i].app_name)
          } else {
            let name_flag=true
            for (let y = 0; y < this.app_name_list.length; y++) {
              if (this.app_name_list[y].search(this.hidlist[i].app_name)!=-1){
                name_flag=false
              }
            }
            if (name_flag){
              this.app_name_list.push(this.hidlist[i].app_name)
            }
          }

        }
      },
    }
  }

  // validUpdate(param) {
  //   if (param.sdk_status === 0) {
  //     this.sdk.id = param.id
  //     this.sdk.timevalue = param.date
  //     this.sdk.app_name = param.app_name
  //     this.sdk.package_name = param.package_name
  //     this.sdk.channel_mark = param.channel_mark
  //     this.sdk.version_online_version = param.version_online
  //     this.sdk.version_update_version = param.version_update
  //     this.sdk.versioncode_online_version = param.versioncode_online_version
  //     this.sdk.versioncode_update_version = param.versioncode_update_version
  //     this.sdk.sdk_config = param.sdk_config
  //     this.sdk.sdk_require = param.sdk_require
  //     this.sdk.note = param.note
  //     this.sdk.form.domains = param.paramter
  //     this.sdk.sdkstatus = '1'
  //     this.updateData()
  //   }
  // },//可见按钮
  // sdk模版样式
  // {
  //   keymark:'友盟统计',
  //     keyform: [
  //   {
  //     key: 'default4',
  //     param_name: '统计-友盟-appkey',
  //     param: '',
  //     note: '暂无'
  //   }, {
  //     key: 'default5',
  //     param_name: '统计-talkingdate-appkey',
  //     param: '',
  //     note: '暂无'
  //   }, {
  //     key: 'default6',
  //     param_name: '统计-热云-APPID',
  //     param: '',
  //     note: '暂无'
  //   }
  // ]
  // }
  // fetchName() {
  //   if (!checkPermission(['admin', 'leader', 'operator'])) {
  //     let data = {
  //       username: this.name
  //     }
  //
  //     let tothis = this
  //     this.listLoading = true
  //     getResourceName(data).then(response => {
  //       this.names = response.data
  //       this.listLoading = false
  //     }).catch(function (rs) {
  //       tothis.listLoading = false
  //       console.error(rs)
  //     })
  //   } else {
  //     let tothis = this
  //     this.listLoading = true
  //     getName().then(response => {
  //       this.names = response.data
  //       this.listLoading = false
  //     }).catch(function (rs) {
  //       tothis.listLoading = false
  //       console.log(rs)
  //     })
  //
  //   }
  // },
</script>
<style>
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
  .el-tabs__nav-scroll{
    width: 180px;
  }

</style>



