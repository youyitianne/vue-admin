<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <span style="margin-left: 15px;margin-right: 5px">游戏:</span>
      <el-select v-model="secondary_game" @change="getDatawithParam">
        <el-option
          key="全部"
          label="全部"
          value="">
        </el-option>
        <el-option
          v-for="item in app_name_list"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <span style="margin-left: 15px;margin-right: 5px">渠道:</span>
      <el-select v-model="secondary_channel" @change="getDatawithParam">
        <el-option
          key="全部"
          label="全部"
          value="">
        </el-option>
        <el-option
          v-for="item in channel_mark_list"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-checkbox v-model="checked" border style="margin-left: 15px" @change="getDatawithParam">展示最新配置表</el-checkbox>

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
            <el-form-item label="发布时间:">
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
            <el-form-item label="渠道特别要求:">
              <span>{{ props.row.sdk_require }}</span>
            </el-form-item>
            <el-form-item label="备注:">
              <span>{{ props.row.note }}</span>
            </el-form-item>
          </el-form>
          <div style="">
            <el-table
              stripe
              border
              :data="props.row.paramter"
              style="width: 100%;margin-bottom: 30px;background-color: #99a9bf"
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
      <el-table-column label="发布时间" prop="date" width="200px">
      </el-table-column>
      <el-table-column label="应用名" prop="app_name">
      </el-table-column>
      <el-table-column label="渠道" prop="channel_mark">
      </el-table-column>
      <el-table-column label="包名" prop="package_name">
      </el-table-column>
      <el-table-column label="外部版本-在线" prop="version_update">
      </el-table-column>
      <el-table-column label="内部版本-更新" prop="versioncode_update_version">
      </el-table-column>
      <!--<el-table-column label="操作" align="center" width="450" class-name="small-padding fixed-width"-->
      <!--v-if="checkPermission(['operator', 'planner','admin','leader'])">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ "编辑" }}</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
    </el-table>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {
    getProjectConfigPublish,
    getSdkTemplate,
    getChannel
  } from '@/api/table/sdkmanager/projectconfigtable_publish'
  import {getName, getResourceName} from '@/api/table/sdkmanager/projectconfigtable_publish'

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
        spanArr: [],
        app_name_list: [],
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
          sdkstatus: '0',
          sdk_require: '',
          note: '',
          form: {
            domains: [],
          }
        },
        hidlist: '',
        expands: [],
        getRowKeys(row) {
          return row.id
        },
      }
    },
    created() {
      this.initTemplate()
      this.initDate()
    },
    methods: {
      handleFilter() {
        let tothis = this
        this.listLoading = true
        getProjectConfigPublish().then(response => {
          this.list = response.data
          this.hidlist = response.data
          for (let i = 0; i < this.hidlist.length; i++) {
            let data=this.hidlist[i].date.substring(0, this.hidlist[i].date.length - 4)
            let date=this.formatDate(new Date(data), 'yyyy年MM月dd日 hh:mm:ss')
            this.hidlist[i].date = date
            this.list[i].date = date
          }

          this.listLoading = false
          this.getDatawithParam()
          this.initfilterlist()
        }).catch(function (rs) {
          tothis.listLoading = false
        })
      },  //根据时间查询
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
        let name = param.split('-')[0]
        if (name === this.filter_form_name) {
          return true
        } else {
          return false
        }
      },//获取ask参数部分的sdk名称
      findtabname(tab, event) {
        this.filter_form_name = tab.label
      },//获取点击的标签页名
      getchannelmarklist() {
        let list = []
        for (let i = 0; i < this.hidsdkTemplate.length; i++) {
          if (this.hidsdkTemplate[i].search(this.sdk_template_name) != -1) {
            list.push(this.hidsdkTemplate[i])
          }
        }
        this.sdkTemplate = list
      },//标签页随动展示
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
            if (data2.length === 0) {
              data2.push(data1[i])
            }else {
              let flag=true
              for (let j=0;j<data2.length;j++){
                if (data1[i].channel_mark===data2[j].channel_mark&&data1[i].package_name===data2[j].package_name){
                  flag=false
                }
              }
              if (flag){
                data2.push(data1[i])
              }
            }
          }
        } else {
          data2 = data1
        }

        this.list = data2
        this.listLoading = false
      }, //二次筛选
      formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds(),
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
      }, //日期转换
      initfilterlist() {
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
          for (let z=0;z<this.hidlist[i].paramter.length;z++){
            let data=this.hidlist[i].paramter[z].param_name.split('-')
            this.hidlist[i].paramter[z].param_name=data[data.length-1]
          }
        }
      },
    }
  }
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

</style>



