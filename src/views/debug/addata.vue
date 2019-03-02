<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-date-picker
        v-model="select_value"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions0"
        @change="secondart_date_change">
      </el-date-picker>

      <el-select v-model="chooseName" :placeholder="'选择游戏'" style="width: 140px" class="filter-item" filterable>
        <el-option v-for="item in names" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search"
                 @click="handleFilter">{{ searchName }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        {{'下载'}}
      </el-button>
      <br>
    </div>

    <div style="margin-top: -10px">
      <el-input placeholder="根据渠道二次筛选" v-model="secondary_channel"
                style="width: 200px;margin-left: 15px;margin-bottom: 10px;margin-top: -10px" class="filter-item"
                clearable @blur="getDatawithName"/>
      <el-select v-model="secondary_adtype" placeholder="根据广告类型二次筛选" @change="getDatawithName">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="secondary_date" placeholder="根据时间二次筛选" @change="getDatawithName" style="width: 170px">
        <el-option v-for="item in secondary_datelist" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-input placeholder="根据平台二次筛选" v-model="secondary_platform"
                style="width: 200px;margin-bottom: 10px;margin-top: -10px" class="filter-item" clearable
                @blur="getDatawithName"/>
    </div>

    <!--<div class="filter-container"-->
         <!--style="margin: 15px;margin-top: -5px"-->
         <!--v-if="checkPermission(['admin','operator','leader'])">-->
      <!--<el-date-picker-->
        <!--v-model="download_value"-->
        <!--type="daterange"-->
        <!--range-separator="-"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--:picker-options="pickerOptions0">>-->
      <!--</el-date-picker>-->

      <!--&lt;!&ndash;<el-select v-model="chooseNamed" :placeholder="'选择游戏'" style="width: 140px" class="filter-item" filterable>&ndash;&gt;-->
      <!--&lt;!&ndash;<el-option v-for="item in names" :key="item" :label="item" :value="item"/>&ndash;&gt;-->
      <!--&lt;!&ndash;</el-select>&ndash;&gt;-->

      <!--<el-select v-model="secondary_project" style="margin-right: 20px" @change="" value-key="project_name"-->
                 <!--:placeholder="'选择项目'" filterable>-->
        <!--<el-option v-for="item in app_name_list" :key="item.project_name" :label="item.project_name" :value="item">-->
        <!--</el-option>-->
      <!--</el-select>-->


      <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownloadAll">-->
        <!--{{'下载总表'}}-->
      <!--</el-button>-->
      <!--<br>-->
    <!--</div>-->

    <!--<div class="filter-container"-->
         <!--style="margin: 15px;margin-top: -5px"-->
         <!--v-if="checkPermission(['admin','operator','leader'])">-->
      <!--<el-date-picker-->
        <!--v-model="arpu_download_value"-->
        <!--type="daterange"-->
        <!--range-separator="-"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--value-format="timestamp"-->
        <!--:picker-options="pickerOptions0">>-->
      <!--</el-date-picker>-->
      <!--&lt;!&ndash;value-format="yyyy-MM-dd"&ndash;&gt;-->
      <!--<el-select v-model="aupu_chooseNamed" style="margin-right: 20px" @change="" value-key="project_name"-->
                 <!--:placeholder="'选择项目'" filterable>-->
        <!--<el-option v-for="item in app_name_list" :key="item.project_name" :label="item.project_name" :value="item">-->
        <!--</el-option>-->
      <!--</el-select>-->
      <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"-->
                 <!--@click="arpu_handleDownloadAll">-->
        <!--{{'下载收益表'}}-->
      <!--</el-button>-->
      <!--<br>-->
    <!--</div>-->

    <!--<div class="filter-container"-->
         <!--style="margin: 15px;margin-top: -5px"-->
         <!--v-if="checkPermission(['admin','operator','leader'])">-->
      <!--<el-date-picker-->
        <!--v-model="daily_download_value"-->
        <!--type="daterange"-->
        <!--range-separator="-"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--:picker-options="pickerOptions0">>-->
      <!--</el-date-picker>-->

      <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"-->
                 <!--@click="daily_download">-->
        <!--{{'下载产品日常信息表'}}-->
      <!--</el-button>-->
      <!--<br>-->
    <!--</div>-->

    <!--<div class="filter-container"-->
         <!--style="margin: 15px;margin-top: -5px"-->
         <!--v-if="checkPermission(['admin','operator','leader'])">-->
      <!--<el-date-picker-->
        <!--v-model="daily_adtype_download_value"-->
        <!--type="daterange"-->
        <!--range-separator="-"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--:picker-options="pickerOptions0">>-->
      <!--</el-date-picker>-->

      <!--<el-select v-model="daily_adtype_chooseNamed" style="margin-right: 20px" @change="" value-key="project_name"-->
                 <!--:placeholder="'选择项目'" filterable>-->
        <!--<el-option v-for="item in app_name_list" :key="item.project_name" :label="item.project_name" :value="item">-->
        <!--</el-option>-->
      <!--</el-select>-->

      <!--<el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"-->
                 <!--@click="daily_adtype_download">-->
        <!--{{'下载广告形式细分展次表'}}-->
      <!--</el-button>-->
      <!--<br>-->
    <!--</div>-->


    <el-dialog
      title="选择需要去除的部分"
      :visible.sync="hackReset"
      width="40%">
      <el-button @click="chooseyixin()">模板一</el-button>
      <el-button @click="rechoose()">还原</el-button>
      <el-tree
        ref="tree"
        :data="data2"
        node-key="id"
        show-checkbox
        highlight-current>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hackReset=false">{{ '取消'}}</el-button>
        <el-button type="primary" @click="getnumlist">{{ '确认' }}</el-button>
      </div>
    </el-dialog>

    <el-table
      height="850"
      stripe
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      fixed
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope" prop="id">
          {{ ++scope.$index }}
        </template>
      </el-table-column>
      <!--<el-table-column label="id" width="110" style="display: none">-->
      <!--<template slot-scope="scope">-->
      <!--{{ scope.row.id }}-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="时间" width="110" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="游戏名" width="110" align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.app_name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="渠道" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.channel }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="广告类型" prop="advertising_type">
        <template slot-scope="scope">
          <span>{{ scope.row.advertising_type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收入" prop="earned">
        <template slot-scope="scope">
          <span>{{ scope.row.earned }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击率" prop="clickrate">
        <template slot-scope="scope">
          <span>{{ scope.row.click_rate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ecpm" prop="ecpm">
        <template slot-scope="scope">
          <span>{{ scope.row.ecpm }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="展示次数" prop="impression">
        <template slot-scope="scope">
          <span>{{ scope.row.impression }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击次数" prop="click">
        <template slot-scope="scope">
          <span>{{ scope.row.click }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="填充率" prop="fill_rate">
        <template slot-scope="scope">
          <span>{{ scope.row.fill_rate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" prop="platform" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台" prop="platform">
        <template slot-scope="scope">
          <span>{{ scope.row.platform }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>

</template>

<script>
  import {
    getProjectList,
    getList,
    getListdata,
    getdownload,
    getResourceName,
    getName,
    getarpufile,
    getarpufile1,
    getDailyMsg,
    getDailyAdtypeMsg
  } from '@/api/debug/addata'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {mapGetters} from 'vuex'


  export default {
    directives: {waves},
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
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
        daily_adtype_download_value: [],
        daily_adtype_chooseNamed: '选择项目',
        daily_download_value: [],
        app_name_list: [],
        secondary_project: '选择项目',
        data2: [
          {
            label: 'oppo',
            children: [{
              id: '6+9',
              label: '统计'
            }, {
              id: '10+29',
              label: '广点通'
            }, {
              id: '30+54',
              label: '渠道'
            }, {
              id: '55+79',
              label: '移信'
            }, {
              id: '80+104',
              label: '头条'
            }]
          }, {
            label: '小米',
            children: [{
              id: '105+108',
              label: '统计'
            }, {
              id: '109+128',
              label: '广点通'
            }, {
              id: '129+153',
              label: '渠道'
            }, {
              id: '154+178',
              label: '移信'
            }, {
              id: '179+203',
              label: '头条'
            }]
          }, {
            label: 'vivo',
            children: [{
              id: '204+207',
              label: '统计'
            }, {
              id: '208+227',
              label: '广点通'
            }, {
              id: '228+252',
              label: '渠道'
            }, {
              id: '253+277',
              label: '移信'
            }, {
              id: '278+302',
              label: '头条'
            }]
          }, {
            label: '魅族',
            children: [{
              id: '303+306',
              label: '统计'
            }, {
              id: '307+326',
              label: '广点通'
            }, {
              id: '327+351',
              label: '渠道'
            }, {
              id: '352+376',
              label: '移信'
            }, {
              id: '377+401',
              label: '头条'
            }]
          }, {
            label: 'qihoo',
            children: [{
              id: '402+405',
              label: '统计'
            }, {
              id: '406+425',
              label: '广点通'
            }, {
              id: '426+450',
              label: '渠道'
            }, {
              id: '451+475',
              label: '移信'
            }, {
              id: '476+500',
              label: '头条'
            }]
          }, {
            label: '三星',
            children: [{
              id: '501+504',
              label: '统计'
            }, {
              id: '505+524',
              label: '广点通'
            }, {
              id: '525+549',
              label: '渠道'
            }, {
              id: '550+574',
              label: '移信'
            }, {
              id: '575+599',
              label: '头条'
            }]
          }, {
            label: '联想',
            children: [{
              id: '600+603',
              label: '统计'
            }, {
              id: '604+623',
              label: '广点通'
            }, {
              id: '624+648',
              label: '渠道'
            }, {
              id: '649+673',
              label: '移信'
            }, {
              id: '674+698',
              label: '头条'
            }]
          }, {
            label: '九游',
            children: [{
              id: '699+702',
              label: '统计'
            }, {
              id: '703+722',
              label: '广点通'
            }, {
              id: '723+747',
              label: '渠道'
            }, {
              id: '748+772',
              label: '移信'
            }, {
              id: '773+797',
              label: '头条'
            }]
          }, {
            label: '4399',
            children: [{
              id: '798+801',
              label: '统计'
            }, {
              id: '802+821',
              label: '广点通'
            }, {
              id: '822+846',
              label: '渠道'
            }, {
              id: '847+871',
              label: '移信'
            }, {
              id: '872+896',
              label: '头条'
            }]
          }, {
            label: '应用汇',
            children: [{
              id: '897+900',
              label: '统计'
            }, {
              id: '901+920',
              label: '广点通'
            }, {
              id: '921+945',
              label: '渠道'
            }, {
              id: '946+970',
              label: '移信'
            }, {
              id: '971+995',
              label: '头条'
            }]
          }, {
            label: '应用宝',
            children: [{
              id: '996+999',
              label: '统计'
            }, {
              id: '1000+1019',
              label: '广点通'
            }, {
              id: '1020+1044',
              label: '渠道'
            }, {
              id: '1045+1069',
              label: '移信'
            }, {
              id: '1070+1094',
              label: '头条'
            }]
          }, {
            label: '百度',
            children: [{
              id: '1095+1098',
              label: '统计'
            }, {
              id: '1099+1118',
              label: '广点通'
            }, {
              id: '1119+1143',
              label: '渠道'
            }, {
              id: '1144+1168',
              label: '移信'
            }, {
              id: '1169+1193',
              label: '头条'
            }]
          }, {
            label: '酷派',
            children: [{
              id: '1194+1197',
              label: '统计'
            }, {
              id: '1198+1217',
              label: '广点通'
            }, {
              id: '1218+1242',
              label: '渠道'
            }, {
              id: '1243+1267',
              label: '移信'
            }, {
              id: '1268+1292',
              label: '头条'
            }]
          }, {
            label: '金立游戏',
            children: [{
              id: '1293+1296',
              label: '统计'
            }, {
              id: '1297+1316',
              label: '广点通'
            }, {
              id: '1317+1341',
              label: '渠道'
            }, {
              id: '1342+1366',
              label: '移信'
            }, {
              id: '1367+1391',
              label: '头条'
            }]
          }, {
            label: '华为',
            children: [{
              id: '1392+1395',
              label: '统计'
            }, {
              id: '1396+1415',
              label: '广点通'
            }, {
              id: '1416+1440',
              label: '渠道'
            }, {
              id: '1441+1465',
              label: '移信'
            }, {
              id: '1466+1490',
              label: '头条'
            }]
          }, {
            label: '中兴',
            children: [{
              id: '1491+1494',
              label: '统计'
            }, {
              id: '1495+1514',
              label: '广点通'
            }, {
              id: '1515+1539',
              label: '渠道'
            }, {
              id: '1540+1564',
              label: '移信'
            }, {
              id: '1565+1589',
              label: '头条'
            }]
          }, {
            label: 'taptap',
            children: [{
              id: '1590+1593',
              label: '统计'
            }, {
              id: '1594+1613',
              label: '广点通'
            }, {
              id: '1614+1638',
              label: '渠道'
            }, {
              id: '1639+1663',
              label: '移信'
            }, {
              id: '1664+1688',
              label: '头条'
            }]
          }, {
            label: '好游快爆',
            children: [{
              id: '1689+1692',
              label: '统计'
            }, {
              id: '1693+1712',
              label: '广点通'
            }, {
              id: '1713+1737',
              label: '渠道'
            }, {
              id: '1738+1762',
              label: '移信'
            }, {
              id: '1763+1787',
              label: '头条'
            }]
          },
        ],
        hackReset: false,
        secondary_platform: '',
        secondary_date: '',
        secondary_channel: '',
        secondary_adtype: '',
        secondary_datelist: [],
        hidlist: [],
        options: [{
          value: '全部',
          label: '全部'
        }, {
          value: '横幅',
          label: '横幅'
        }, {
          value: '开屏',
          label: '开屏'
        }, {
          value: '插屏',
          label: '插屏'
        }, {
          value: '视频',
          label: '视频'
        }],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        directives: {waves},
        downloadLoading: false,
        layout: '',
        chooseName: '选择游戏',
        chooseNamed: '选择游戏',
        aupu_chooseNamed: '选择项目',
        select_value: '',
        download_value: '',
        arpu_download_value: '',
        downloadParam: {
          start: undefined,
          end: undefined,
          name: undefined,
          namelist: '',
          list: []
        },
        aupu_downloadParam: {
          start: undefined,
          end: undefined,
          name: undefined,
        },
        searchName: '搜索',
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          importance: undefined,
          title: undefined,
          type: undefined,
        },
        listParam: {
          start: undefined,
          end: undefined,
          name: undefined,
        },
        importanceOptions: [1, 2, 3],
        names: [],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
      }
    },
    created() {
      this.fetchName()
      this.fetchProject()
    },
    methods: {
      arpu_handleDownloadAll() {    //下载收益表
        let tothis = this
        let time = 6 * 24 * 60 * 60 * 1000
        if (this.aupu_downloadParam === null) {
          this.open3()
          return
        }
        if (this.aupu_downloadParam.name === '选择项目') {
          this.open3()
          return
        }
        if (this.arpu_download_value[0] === undefined) {
          this.open3()
          return
        }
        if (this.arpu_download_value[1] === undefined) {
          this.open3()
          return
        }
        if (this.arpu_download_value[1] - this.arpu_download_value[0] > time) {
          tothis.$notify({
            title: '',
            message: '时间范围最多选择7天',
            type: 'warning',
            duration: 2000
          })
          return
        }
        this.aupu_downloadParam.start = this.formatDate(new Date(this.arpu_download_value[0]), 'yyyy-MM-dd')
        this.aupu_downloadParam.end = this.formatDate(new Date(this.arpu_download_value[1]), 'yyyy-MM-dd')
        this.aupu_downloadParam.name = this.aupu_chooseNamed
        //this.aupu_downloadParam.name = '全部'  //收益表为下载所有
        this.downloadLoading = true
        getarpufile1(this.aupu_downloadParam).then(data => {
          if (!data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.aupu_downloadParam.start + '_' + this.aupu_downloadParam.end + this.aupu_downloadParam.name.project_name + '_arpu.xls')
          document.body.appendChild(link)
          link.click()
          this.downloadLoading = false
        }).catch(function (rs) {
          console.log(rs.toString())
          tothis.downloadLoading = false
          tothis.$notify({
            title: '下载失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      }//日常产品总收益表下载方法
      , daily_download() {
        let tothis = this
        if (this.daily_download_value === null) {
          this.open3()
          return
        }
        if (this.daily_download_value[0] === undefined) {
          this.open3()
          return
        }
        if (this.daily_download_value[1] === undefined) {
          this.open3()
          return
        }
        this.downloadLoading = true

        let param = {
          start: this.daily_download_value[0],
          end: this.daily_download_value[1],
          list: this.app_name_list
        }
        getDailyMsg(param).then(data => {
          if (!data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', param.start + '_' + param.end + '_产品收益表.xls')
          document.body.appendChild(link)
          link.click()
          this.downloadLoading = false
        }).catch(function (rs) {
          console.log(rs.toString())
          tothis.downloadLoading = false
          tothis.$notify({
            title: '下载失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      }//日常收益，arpu表下载
      , daily_adtype_download() {
        // daily_adtype_download_value:[],
        // daily_adtype_chooseNamed:'',
        let tothis = this
        if (this.daily_adtype_download_value === null) {
          this.open3()
          return
        }
        if (this.daily_adtype_chooseNamed.name === '选择项目') {
          this.open3()
          return
        }
        if (this.daily_adtype_download_value[0] === undefined) {
          this.open3()
          return
        }
        if (this.daily_adtype_download_value[1] === undefined) {
          this.open3()
          return
        }
        this.downloadLoading = true

        let param = {
          start: this.daily_adtype_download_value[0],
          end: this.daily_adtype_download_value[1],
          list: this.daily_adtype_chooseNamed
        }
        getDailyAdtypeMsg(param).then(data => {
          if (!data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', param.start + '_' + param.end + param.list.project_name + '_arpu.xls')
          document.body.appendChild(link)
          link.click()
          this.downloadLoading = false
        }).catch(function (rs) {
          console.log(rs.toString())
          tothis.downloadLoading = false
          tothis.$notify({
            title: '下载失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//广告形式细分表下载
      fetchProject() {
        let tothis = this
        this.listLoading = true
        getProjectList().then(response => {
          //console.log(response.data)
          this.app_name_list = response.data
        }).catch(function (rs) {
          console.log(rs)
          tothis.listLoading = false
        })
      },//获取项目名
      getnumlist() {
        this.hackReset = false
        this.downloadLoading = true
        let tothis = this
        let checked = this.$refs.tree.getCheckedKeys();
        let list = []
        for (let i = 0; i < checked.length; i++) {
          if (typeof(checked[i]) === 'undefined') {
            continue
          }
          let numlist = this.getNum(parseInt(checked[i].split('+')[0]), parseInt(checked[i].split('+')[1]))
          list = list.concat(numlist)
        }
        this.downloadParam.list = list

        getdownload(this.downloadParam).then(data => {
          if (!data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.downloadParam.start + '_' + this.downloadParam.end + '_' + this.downloadParam.name.project_name + '.xls')
          document.body.appendChild(link)
          link.click()
          this.downloadLoading = false
        }).catch(function (rs) {
          tothis.downloadLoading = false
          tothis.$notify({
            title: '下载失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      }, //总表下载方法
      getNum(num1, num2) {
        let list = []
        list.push(num1)
        for (let i = num1 + 1; i <= num2; i++) {
          list.push(i)
        }
        return list
      },//获得两个数字间的所有数字
      chooseyixin() {
        this.$refs.tree.setCheckedKeys([
          '80+104',
          '179+203',
          '278+302',
          '377+401',
          '476+500',
          '575+599',
          '674+698',
          '773+797',
          '872+896',
          '971+995',
          '1070+1094',
          '1169+1193',
          '1268+1292',
          '1367+1391',
          '55+79',
          '154+178',
          '253+277',
          '352+376',
          '451+475',
          '550+574',
          '649+673',
          '748+772',
          '847+871',
          '946+970',
          '1045+1069',
          '1144+1168',
          '1243+1267',
          '1342+1366',
          '1441+1465',
          '1540+1564',
          '1639+1663',
          '1738+1762',
          '921+945',
          '1020+1044',
          '1218+1242',
          '1317+1341',
          '1416+1440',
          '1515+1539',
          '1614+1638',
          '1713+1737',
          '897+900',
          '1194+1197',
          '1293+1296',
          '1392+1395']);
      },//总表下载对话框 模版一
      rechoose() {
        this.$refs.tree.setCheckedKeys([])
      },//总表下载对话框 还原
      fetchName() {
        if (!checkPermission(['admin', 'leader', 'operator'])) {
          let data = {
            username: this.name
          }
          let tothis = this
          this.listLoading = true
          getResourceName(data).then(response => {
            this.names = response.data
            this.listLoading = false
          }).catch(function (rs) {
            tothis.listLoading = false
            console.error(rs)
          })
        } else {
          let tothis = this
          this.listLoading = true
          getName().then(response => {
            this.names = response.data
            this.listLoading = false
          }).catch(function (rs) {
            tothis.listLoading = false
            console.log(rs)
          })
        }
      }//获取应用名
      ,
      handleFilter() {
        this.downloadLoading = true
        let tothis = this
        this.listParam.name = this.chooseName
        if (this.listParam.name === '选择游戏' || this.select_value === '' || this.select_value == null) {
          this.open3()
          this.downloadLoading = false
          return
        }
        this.listParam.start = this.select_value[0]
        this.listParam.end = this.select_value[1]
        this.listLoading = true
        getListdata(this.listParam).then(response => {
          console.log()
          this.list = response.data
          this.hidlist = response.data
          this.listLoading = false
          this.downloadLoading = false
        }).catch(function (rs) {
          tothis.listLoading = false
          tothis.downloadLoading = false
        })
      } // 表格查找数据
      ,
      getDatawithName() {
        if (this.hidlist === []) {
          return
        }
        let data = []
        this.listLoading = true
        let adtype = this.secondary_adtype
        if (adtype == '' || adtype == null) {
          data = this.hidlist
        } else {
          for (let i = 0; i < this.hidlist.length; i++) {
            if (this.hidlist[i].advertising_type.search(adtype) != -1) {
              data.push(this.hidlist[i])
            }
          }
        }
        let data1 = []
        let channel = this.secondary_channel
        if (channel == '') {
          data1 = data
        } else {
          for (let i = 0; i < data.length; i++) {
            if (data[i].channel.search(channel) != -1) {
              data1.push(data[i])
            }
          }
        }
        let data2 = []
        let date = this.secondary_date
        if (date == '' || date == '全部') {
          data2 = data1
        } else {
          for (let i = 0; i < data1.length; i++) {
            if (data1[i].date.search(date) != -1) {
              data2.push(data1[i])
            }
          }
        }

        let data3 = []
        let platform = this.secondary_platform
        if (platform == '' || platform == null) {
          data3 = data2
        } else {
          for (let i = 0; i < data2.length; i++) {
            if (data2[i].platform.search(platform) != -1) {
              data3.push(data2[i])
            }
          }
        }

        this.list = data3
        this.listLoading = false
      }//表格数据筛选
      ,
      handleDownloadAll() {
        let tothis = this
        if (this.download_value === null) {
          this.open3()
          return
        }
        this.downloadParam.start = this.download_value[0]
        this.downloadParam.end = this.download_value[1]
        this.downloadParam.name = this.secondary_project
        if (this.downloadParam.name === '选择项目') {
          this.open3()
          return
        }
        if (this.downloadParam.start === undefined) {
          this.open3()
          return
        }
        if (this.downloadParam.end === undefined) {
          this.open3()
          return
        }
        this.hackReset = true
      }//总表下载对话框
      ,

      handleDownload() {   //下载请求
        this.downloadLoading = true
        if (this.list === null) {
          this.open4()
          this.downloadLoading = false
          return
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['id', 'date', 'app_name', 'channel', 'advertising_type', 'earned', 'click_rate', 'ecpm', 'impression', 'click', 'fill_rate', 'platform']
          const filterVal = ['id', 'date', 'app_name', 'channel', 'advertising_type', 'earned', 'click_rate', 'ecpm', 'impression', 'click', 'fill_rate', 'platform']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      }
      ,
      /**
       * 获取指定日期(字符串类型)到当前时间的天数
       * @param {Object} sDate1 格式:2018-01-04
       */
      secondart_date_change() {
        if (this.select_value === null) {
          return
        }
        this.secondary_datelist = this.getdate(new Date(this.select_value[0]), new Date(this.select_value[1]))
      }
      ,

      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
      ,
      checkPermission,
      parseTime,
      getdate(startDate, endDate) {
        const dateList = []
        dateList.push('全部')
        dateList.push(this.formatDate(startDate, 'yyyy-MM-dd'))
        //dateList.push(new Date(startDate))
        while (true) {
          startDate.setDate(startDate.getDate() + 1)
          if (startDate.getTime() < endDate.getTime()) {
            dateList.push(this.formatDate(startDate, 'yyyy-MM-dd'))
            //dateList.push(new Date(startDate))
          } else {
            break
          }
        }
        if (!dateList.includes(this.formatDate(endDate, 'yyyy-MM-dd'))) {
          dateList.push(this.formatDate(endDate, 'yyyy-MM-dd'))
        }
        //dateList.push(new Date(endDate))
        return dateList
      }
      ,
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
      },padLeftZero(str) {
        return ('00' + str).substr(str.length);
      }
      ,
      open3() {
        this.$message({
          message: '请选择查询范围~',
          type: 'warning'
        });
      }
      ,
      open4() {
        this.$message({
          message: '没有信息可以打印~',
          type: 'warning'
        });
      }

    }
  }
</script>
