<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: 15px">
      <el-date-picker
        @change="resetTime"
        v-model="timevalueLtv"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions0">>
      </el-date-picker>

      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search"
                 @click="getltv">{{ searchName }}
      </el-button>


    </div>

    <el-tabs v-model="activeName1" @tab-click="">
      <el-tab-pane label="ltv" name="first">
        <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="ltvdownLoad"
                   size="mini">
          {{'下载'}}
        </el-button>


        <table class="gridtable" style="margin-top: 20px">
          <tr v-for="(outer,index) in ltvList">
            <td v-for="(inner,index1) in outer">
              <el-button size="mini" v-if="index!==0&&index1==0" @click="showdialog(inner)">{{inner}}</el-button>
              <span v-if="!(index!==0&&index1==0)">{{inner}}</span></td>
            <!--<span>{{inner}}</span></td>-->
          </tr>
        </table>
      </el-tab-pane>
      <el-tab-pane label="lt" name="second">
        <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="ltdownLoad"
                   size="mini">
          {{'下载'}}
        </el-button>


        <table class="gridtable" style="margin-top: 20px">
          <tr v-for="(outer,index) in ltList">
            <td v-for="(inner,index1) in outer">
              <span>{{inner}}</span></td>
          </tr>
        </table>

      </el-tab-pane>
    </el-tabs>

    <el-dialog
      :close-on-click-modal=false
      title="ltv详情"
      :visible.sync="dialogVisible1"
      width="70%">
      <table class="gridtable" style="margin-top: 20px">
        <tr v-for="(outer,index) in dataList1">
          <td v-for="inner in outer" v-if="index===0||index===9||index===10||index===11||index===12||
              index%9===0||(index-1)%9===0||(index-2)%9===0||(index-3)%9===0">{{inner}}
          </td>
        </tr>
      </table>
    </el-dialog>


  </div>
</template>

<script>
  import {
    getProjectList,
    getName,
    getarpufile_preview
  } from '@/api/table/datamanager/addata'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {getResourceName} from "@/api/resourceName"; //根据帐号获取被分配的项目列表
  import store from '@/store'  //获取本地缓存信息
  import {getumengRetention, getumengapp, getumengchannels} from '@/api/homepage/ltv'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import {
    getDailyMsg1,
  } from '@/api/table/datamanager/earnedtable'

  export default {
    directives: {waves},
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
        hiddataList1: [],
        dataList1: [],
        dialogVisible1: false,
        ltList: [],
        activeName1: 'first',
        timeFlag: true,
        ltvList: [],
        timevalueLtv: [],
        activeName: 'second',
        arpuList: [],
        daily_download_value: [],
        app_name_list: [],
        channel_value: '',
        channelList: [],
        average: {
          one: 0,
          three: 0,
          seven: 0,
          fourteen: 0,
          thirty: 0,
          lt: '0',
        },
        fullscreenLoading: false,
        options: '',
        select_value: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6 - 24 * 60 * 60 * 1000 * 2
          }
        },
        directives: {waves},
        downloadLoading: false,
        layout: '',
        timevalue: [],
        searchName: '获取ltv',
        tableKey: 0,
        list: [],
        total: 0,
        listLoading: false,
        listQuery: {
          importance: undefined,
          title: undefined,
          type: undefined,
        },
        listParam: {
          start: '',
          end: '',
          name: '',
          appkey: '',
          channel: ''
        },
        importanceOptions: [1, 2, 3],
        names: [],
        sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],
        statusOptions: ['published', 'draft', 'deleted'],
      }
    },
    mounted() {
      this.initapps()
      this.fetchProject()
    },
    methods: {
      getchannelid(value) {
        let appkey = ''
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].name.indexOf(value) != -1) {
            appkey = this.options[i].appkey
            break
          }
        }
        if (appkey === '') {
          this.$notify({
            title: '获取appkey失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
          return
        }
        this.changeselect(appkey, value)
      },
      test3(appName, appkey, channelId, channelName) {
        let start = this.formatDate(new Date(this.daily_download_value[0]), 'yyyy-MM-dd')
        let end = this.formatDate(new Date(this.daily_download_value[1]), 'yyyy-MM-dd')

        this.handleFilter3(start, end, appName, appkey, channelId, 1, 1000, channelName)
      },//搜索按钮  多渠道
      handleFilter3(start, end, name, appkey, channel, index, index2, channelName) {
        let tothis = this
        let param = {
          start: start,  //"2019-03-01"
          end: end,  //"2019-03-01"
          name: name,
          appkey: appkey,
          channel: channel
        }
        console.log('method start')
        getumengRetention(param).then(response => {
          let result = response.data.data
          let resultList = []
          let one = 0;
          let three = 0;
          let seven = 0;
          let fourteen = 0;
          let thirty = 0;
          let list = []
          console.log('method success')
          for (let i = 0; i < result.length; i++) {
            let date = result[i].install_period
            let retention_rate = result[i].retention_rate
            let oneDay = typeof(retention_rate[0]) === 'undefined' ? 0 : retention_rate[0]
            let twoDay = typeof(retention_rate[1]) === 'undefined' ? 0 : retention_rate[1]
            let threeDay = typeof(retention_rate[2]) === 'undefined' ? 0 : retention_rate[2]
            let fourDay = typeof(retention_rate[3]) === 'undefined' ? 0 : retention_rate[3]
            let fiveDay = typeof(retention_rate[4]) === 'undefined' ? 0 : retention_rate[4]
            let sixDay = typeof(retention_rate[5]) === 'undefined' ? 0 : retention_rate[5]
            let sevenDay = typeof(retention_rate[6]) === 'undefined' ? 0 : retention_rate[6]
            let halfmonth = typeof(retention_rate[7]) === 'undefined' ? 0 : retention_rate[7]
            let onemonth = typeof(retention_rate[8]) === 'undefined' ? 0 : retention_rate[8]
            let ltvalue = ((((threeDay + sevenDay) * 1.5 + (sevenDay + halfmonth) * 3 + (halfmonth + onemonth) * 7.5 + oneDay + threeDay + sevenDay + halfmonth + onemonth) / oneDay) * oneDay / 100 + 1).toFixed(4)
            let oneday = {
              date: date,
              lt: window.isNaN(ltvalue) ? 0 : ltvalue,
            }

            list.push(oneday)
          }
          console.log('valuation start')
          console.log(list)
          if (channelName === 'oppo') {
            let arpulist = this.hiddataList1
            let newlist = []
            newlist.push(arpulist[0][0])
            for (let i = 0; i < list.length; i++) {
              newlist.push((arpulist[0][i + 1] * list[i].lt).toFixed(4))
            }
            this.dataList1.push(newlist)
          }

          if (channelName === 'vivo') {
            let arpulist = this.hiddataList1
            let newlist = []
            newlist.push(arpulist[1][0])
            for (let i = 0; i < list.length; i++) {
              newlist.push((arpulist[1][i + 1] * list[i].lt).toFixed(4))
            }
            this.dataList1.push(newlist)
          }

          if (channelName === 'huawei') {
            let arpulist = this.hiddataList1
            let newlist = []
            newlist.push(arpulist[2][0])
            for (let i = 0; i < list.length; i++) {
              newlist.push((arpulist[2][i + 1] * list[i].lt).toFixed(4))
            }
            this.dataList1.push(newlist)
          }

        }).catch(function (rs) {
          console.error(rs)

        })
      },//查询
      showdialog(value) {
        this.dialogVisible1 = true
        let nameList = this.app_name_list
        for (let i = 0; i < nameList.length; i++) {
          if (nameList[i].project_name === value) {
            this.arpu_preview1(this.daily_download_value[0], this.daily_download_value[1], nameList[i], value);
            return
          }
        }
      },
      arpu_preview1(date1, date2, name, value) {
        let tothis = this
        let param = {
          start: this.formatDate(date1, 'yyyy-MM-dd'),
          end: this.formatDate(date2, 'yyyy-MM-dd'),
          name: name
        }
        console.log(param)
        getarpufile_preview(param).then(response => {
          if (!response) {
            return
          }
          let dataList = response.data
          let nameList = this.initList()
          let newList = []
          for (let i = 0; i < nameList.length; i++) {
            let inner = []
            inner.push(nameList[i])
            for (let j = 0; j < dataList.length; j++) {
              inner.push(dataList[j][i])
            }
            if (i === 12 || i === 21 || i === 30)
              newList.push(inner)
          }
          console.log('三个渠道的arpu', newList)
          this.getchannelid(value)
          this.hiddataList1 = newList
          this.dialogVisible1 = true
          this.tabLoading = false
        }).catch(function (rs) {
          console.log(rs.toString())
          tothis.downloadLoading = false
          tothis.$notify({
            title: '获取详细信息失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },
      ltvdownLoad() {
        this.downloadLoading = true
        if (this.ltvList === null || this.ltvList.length < 1) {
          this.$message({
            message: '没有信息可以打印~',
            type: 'warning'
          });
          this.downloadLoading = false
          return
        }

        let list = this.ltvList
        let namelist = this.ltvList[0]
        let printList = []
        for (let i = 1; i < list.length; i++) {
          let item = {}
          for (let j = 0; j < list[i].length; j++) {
            let name = namelist[j]
            // let newitem = {
            //   [name]: list[i][j],
            // }
            // item.assign(newitem)
            item[name] = list[i][j]

          }
          printList.push(item)
        }
        console.log(printList)
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = namelist
          const filterVal = namelist
          const data = this.formatJson(filterVal, printList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '友盟留存'
          })
          this.downloadLoading = false
        })
      },
      ltdownLoad() {
        this.downloadLoading = true
        if (this.ltList === null || this.ltList.length < 1) {
          this.$message({
            message: '没有信息可以打印~',
            type: 'warning'
          });
          this.downloadLoading = false
          return
        }

        let list = this.ltList
        let namelist = this.ltList[0]
        let printList = []
        for (let i = 1; i < list.length; i++) {
          let item = {}
          for (let j = 0; j < list[i].length; j++) {
            let name = namelist[j]
            // let newitem = {
            //   [name]: list[i][j],
            // }
            // item.assign(newitem)
            item[name] = list[i][j]

          }
          printList.push(item)
        }
        console.log(printList)
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = namelist
          const filterVal = namelist
          const data = this.formatJson(filterVal, printList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '友盟留存'
          })
          this.downloadLoading = false
        })
      },
      initList() {
        let list = []
        list.push('日期')
        list.push('总收益')
        list.push('总活跃')
        list.push('总arpu	')
        let channel = 'oppo'
        list = this.initchannel(list, channel)
        channel = 'vivo'
        list = this.initchannel(list, channel)
        channel = '华为'
        list = this.initchannel(list, channel)
        channel = '4399'
        list = this.initchannel(list, channel)
        channel = 'qihoo'
        list = this.initchannel(list, channel)
        channel = '魅族'
        list = this.initchannel(list, channel)
        channel = '小米'
        list = this.initchannel(list, channel)
        channel = '头条'
        list = this.initchannel(list, channel)
        channel = 'yyb'
        list = this.initchannel(list, channel)
        channel = '中兴'
        list = this.initchannel(list, channel)
        channel = '好游'
        list = this.initchannel(list, channel)
        channel = 'taptap'
        list = this.initchannel(list, channel)
        channel = '三星'
        list = this.initchannel(list, channel)
        channel = '联想'
        list = this.initchannel(list, channel)
        channel = '九游'
        list = this.initchannel(list, channel)
        channel = '百度'
        list = this.initchannel(list, channel)
        channel = '天资'
        list = this.initchannel(list, channel)
        channel = '努比亚'
        list = this.initchannel(list, channel)
        return list
      },
      initchannel(list, channel) {
        list.push(channel + '-头条收益	')
        list.push(channel + '-渠道收益	')
        list.push(channel + '-广点通收益	')
        list.push(channel + '-总收益	')
        list.push(channel + '-活跃人数	')
        list.push(channel + '-头条arpu	')
        list.push(channel + '-渠道arpu	')
        list.push(channel + '-广点通arpu	')
        list.push(channel + '-总ltv	')
        return list
      },
      resetTime() {
        if (typeof (this.timevalueLtv) === 'undefined' || this.timevalueLtv === null) {
          this.$message({
            message: '记得选择查询范围~',
            type: 'warning'
          });
          return
        }
        this.timeFlag = false
        this.ltList = []
        this.ltvList = []
        this.fetchProject()
      },
      getltv() {
        this.downloadLoading = true
        this.ltList = []
        this.ltvList = []
        this.ltList.push(this.arpuList[0])
        this.ltvList.push(this.arpuList[0])
        let start = this.formatDate(new Date(this.timevalueLtv[0]), 'yyyy-MM-dd')
        let end = this.formatDate(new Date(this.timevalueLtv[1]), 'yyyy-MM-dd')
        let appkey = ''
        let channel = '全部'
        let list = this.arpuList
        let options = this.options
        console.log(options)
        //for (let i = 1; i < 3; i++) {
        for (let i = 1; i < list.length; i++) {
          let appname = list[i][0]
          let appkey = ''
          let flag = false
          console.log(appname)
          for (let j = 0; j < options.length; j++) {
            if (options[j].name.indexOf(appname) != -1) {
              console.log(options[j].name, appname)
              appkey = options[j].appkey
              flag = true
              break
            }
          }
          if (flag) {
            this.handleFilter1(start, end, appname, appkey, channel, i, list.length - 1)
          }
        }
      },
      test2() {
        this.ltvList.push(this.arpuList[0])
        this.ltList.push(this.arpuList[0])
        let start = this.formatDate(new Date(this.timevalueLtv[0]), 'yyyy-MM-dd')
        let end = this.formatDate(new Date(this.timevalueLtv[1]), 'yyyy-MM-dd')
        let appkey = ''
        let channel = '全部'
        let options = this.options

        for (let j = 0; j < options.length; j++) {
          appkey = options[j].appkey
          let appname = options[j].name
          this.handleFilter2(start, end, appname, appkey, channel, '')
        }
      },
      initdate() {
        if (this.timeFlag) {
          const end = new Date();
          const start = new Date();
          // start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
          // end.setTime(end.getTime());
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 8);
          end.setTime(end.getTime() - 3600 * 1000 * 24 * 2);
          this.daily_download_value.push(start)
          this.daily_download_value.push(end)
          this.timevalueLtv.push(start)
          this.timevalueLtv.push(end)
        } else {
          this.daily_download_value[0] = (new Date(this.timevalueLtv[0].getTime() + 3600 * 1000 * 24 * 1))
          this.daily_download_value[1] = (new Date(this.timevalueLtv[1].getTime() + 3600 * 1000 * 24 * 1))
          console.log(this.daily_download_value)
          this.timeFlag = true
        }
        this.daily_download1()
      },//页面渲染初始化日期
      fetchProject() {
        let tothis = this
        getProjectList().then(response => {
          this.app_name_list = response.data
          this.initdate()
        }).catch(function (rs) {
          console.log(rs)
          tothis.tabLoading = false
        })
      },//获取项目名
      daily_download1() {
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
        this.arpuList = []
        getDailyMsg1(param).then(response => {
            if (!response) {
              return
            }
            this.original = response.data.original
            let arpuList1 = response.data.arpu
            for (let j = 0; j < arpuList1[0].length; j++) {
              let newList = []
              for (let i = 0; i < arpuList1.length; i++) {
                newList.push(arpuList1[i][j])
              }
              this.arpuList.push(newList)
            }
            let arpulist = this.arpuList

            this.downloadLoading = false
            tothis.tabLoading = false
          }
        ).catch(function (rs) {
          console.error(rs.toString() + '')
          tothis.downloadLoading = false
          tothis.tabLoading = false
          tothis.$notify({
            title: '获取失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//日常收益，arpu表下载
      checkPermission,
      changeselect(appkey, value) {
        let tothis = this
        getumengchannels(appkey).then(response => {
          this.channelList = response.data.data
          console.log('++++++++++++')
          console.log(this.channelList)
          console.log(this.channelList.length)
          this.dataList1 = []
          this.dataList1.push(this.arpuList[0])
          for (let i = 0; i < this.channelList.length; i++) {
            if (this.channelList[i].channel === 'oppo') {
              console.log(this.channelList[0])
              console.log(this.channelList[i].id)
              this.test3(value, appkey, this.channelList[i].id, 'oppo')
            }
            if (this.channelList[i].channel === 'vivo') {
              console.log(this.channelList[1])
              console.log(this.channelList[i].id)
              this.test3(value, appkey, this.channelList[i].id, 'vivo')
            }
            if (this.channelList[i].channel === 'huawei') {
              console.log(this.channelList[2])
              console.log(this.channelList[i].id)
              this.test3(value, appkey, this.channelList[i].id, 'huawei')
            }
          }

        }).catch(err => {
          tothis.$notify({
            title: '初始化app列表',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        });
      },
      initapps() {

        let tothis = this
        tothis.fullscreenLoading = true
        getumengapp().then(response => {
          let optionlist = response.data.data
          //根据资源分配调整项目列表start
          let valid = this.checkPermission(['director']) || this.checkPermission(['admin']) || this.checkPermission(['operatorleader']) || this.checkPermission(['sdksuport'])
          if (valid) {
            this.options = optionlist
          } else {
            let newoptionlist = []
            let accountName = store.getters && store.getters.name
            let name = {
              username: accountName
            }
            getResourceName(name).then(response => {
              let projectlist = response.data
              for (let i = 0; i < optionlist.length; i++) {
                let flag = false
                for (let j = 0; j < projectlist.length; j++) {
                  if (optionlist[i].name.indexOf(projectlist[j]) != -1) {
                    flag = true
                  }
                }
                if (flag) {
                  newoptionlist.push(optionlist[i])
                }
              }
            });
            this.options = newoptionlist
          }
          //end
          tothis.fullscreenLoading = false
        }).catch(err => {
          tothis.$notify({
            title: '初始化app列表',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
          tothis.fullscreenLoading = false
        });
      },
      handleFilter() {
        this.list = []   //清空原来的list
        let tothis = this
        this.downloadLoading = true
        if (this.timevalue === '' || this.timevalue == null || this.timevalue[0] === 'undefined' || this.timevalue[1] === 'undefined' || this.select_value === '') {
          this.$message({
            message: '记得选择查询范围~',
            type: 'warning'
          });
          this.downloadLoading = false
          return
        }
        let time = 30 * 24 * 60 * 60 * 1000
        let startdate = new Date(this.timevalue[0]).getTime()
        let enddate = new Date(this.timevalue[1]).getTime()
        if (enddate - startdate > time) {
          tothis.$notify({
            title: '',
            message: '时间范围最多选择30天',
            type: 'warning',
            duration: 2000
          })
          this.downloadLoading = false
          return
        }
        this.listParam.start = this.timevalue[0]//"2019-03-01"
        this.listParam.end = this.timevalue[1]
        this.listParam.name = this.select_value.name//  吃鸡大英雄
        this.listParam.appkey = this.select_value.appkey//5b6126cea40fa317d100000f
        this.listParam.channel = this.channel_value//5b6b999b8f4a9d1f8800004d
        this.listLoading = true
        getumengRetention(this.listParam).then(response => {
          console.log(response.data.data)
          let result = response.data.data
          let resultList = []
          let one = 0;
          let three = 0;
          let seven = 0;
          let fourteen = 0;
          let thirty = 0;
          for (let i = 0; i < result.length; i++) {
            let date = result[i].install_period
            let retention_rate = result[i].retention_rate
            let oneDay = typeof(retention_rate[0]) === 'undefined' ? 0 : retention_rate[0]
            let twoDay = typeof(retention_rate[1]) === 'undefined' ? 0 : retention_rate[1]
            let threeDay = typeof(retention_rate[2]) === 'undefined' ? 0 : retention_rate[2]
            let fourDay = typeof(retention_rate[3]) === 'undefined' ? 0 : retention_rate[3]
            let fiveDay = typeof(retention_rate[4]) === 'undefined' ? 0 : retention_rate[4]
            let sixDay = typeof(retention_rate[5]) === 'undefined' ? 0 : retention_rate[5]
            let sevenDay = typeof(retention_rate[6]) === 'undefined' ? 0 : retention_rate[6]
            let halfmonth = typeof(retention_rate[7]) === 'undefined' ? 0 : retention_rate[7]
            let onemonth = typeof(retention_rate[8]) === 'undefined' ? 0 : retention_rate[8]
            let oneday = {
              date: date,
              oneDay,
              twoDay,
              threeDay,
              fourDay,
              fiveDay,
              sixDay,
              sevenDay,
              halfmonth,
              onemonth,
              lt: ((((threeDay + sevenDay) * 1.5 + (sevenDay + halfmonth) * 3 + (halfmonth + onemonth) * 7.5 + oneDay + threeDay + sevenDay + halfmonth + onemonth) / oneDay) * oneDay / 100 + 1).toFixed(4),
            }
            one = one + oneDay
            three = three + threeDay
            seven = seven + sevenDay
            fourteen = fourteen + halfmonth
            thirty = thirty + onemonth
            this.list.push(oneday)
          }
          let oneDay = (one / result.length)
          let threeDay = (three / result.length)
          let sevenDay = (seven / result.length)
          let halfmonth = (fourteen / result.length)
          let onemonth = (thirty / result.length)
          this.average = {
            one: (one / result.length).toFixed(2),
            three: (three / result.length).toFixed(2),
            seven: (seven / result.length).toFixed(2),
            fourteen: (fourteen / result.length).toFixed(2),
            thirty: (thirty / result.length).toFixed(2),
            lt: ((((threeDay + sevenDay) * 1.5 + (sevenDay + halfmonth) * 3 + (halfmonth + onemonth) * 7.5 + oneDay + threeDay + sevenDay + halfmonth + onemonth) / oneDay) * oneDay / 100 + 1).toFixed(4),
          },
            this.listLoading = false
          this.downloadLoading = false
        }).catch(function (rs) {
          console.error(rs)
          tothis.listLoading = false
          tothis.downloadLoading = false
        })
      },//获取留存方法
      handleFilter1(start, end, name, appkey, channel, index, index1) {
        let tothis = this
        let param = {
          start: start,  //"2019-03-01"
          end: end,  //"2019-03-01"
          name: name,
          appkey: appkey,
          channel: channel
        }
        getumengRetention(param).then(response => {
          let result = response.data.data
          let resultList = []
          let one = 0;
          let three = 0;
          let seven = 0;
          let fourteen = 0;
          let thirty = 0;
          let list = []
          for (let i = 0; i < result.length; i++) {
            let date = result[i].install_period
            let retention_rate = result[i].retention_rate
            let oneDay = typeof(retention_rate[0]) === 'undefined' ? 0 : retention_rate[0]
            let twoDay = typeof(retention_rate[1]) === 'undefined' ? 0 : retention_rate[1]
            let threeDay = typeof(retention_rate[2]) === 'undefined' ? 0 : retention_rate[2]
            let fourDay = typeof(retention_rate[3]) === 'undefined' ? 0 : retention_rate[3]
            let fiveDay = typeof(retention_rate[4]) === 'undefined' ? 0 : retention_rate[4]
            let sixDay = typeof(retention_rate[5]) === 'undefined' ? 0 : retention_rate[5]
            let sevenDay = typeof(retention_rate[6]) === 'undefined' ? 0 : retention_rate[6]
            let halfmonth = typeof(retention_rate[7]) === 'undefined' ? 0 : retention_rate[7]
            let onemonth = typeof(retention_rate[8]) === 'undefined' ? 0 : retention_rate[8]
            let ltvalue = ((((threeDay + sevenDay) * 1.5 + (sevenDay + halfmonth) * 3 + (halfmonth + onemonth) * 7.5 + oneDay + threeDay + sevenDay + halfmonth + onemonth) / oneDay) * oneDay / 100 + 1).toFixed(4)
            let oneday = {
              date: date,
              lt: window.isNaN(ltvalue) ? 0 : ltvalue,
            }

            list.push(oneday)
          }
          let newlist = []
          let newlistlt = []
          newlist.push(name)
          newlistlt.push(name)
          for (let i = 0; i < list.length; i++) {
            newlist.push((parseFloat(this.arpuList[index][i + 1]) * parseFloat(list[i].lt)).toFixed(4))
            newlistlt.push(parseFloat(list[i].lt).toFixed(4))

          }
          this.ltList.push(newlistlt)
          this.ltvList.push(newlist)
          console.log(index, index1)

          if (index === index1) {
            this.downloadLoading = false
            this.listLoading = false
          }
        }).catch(function (rs) {
          console.error(rs)
          tothis.listLoading = false
          tothis.downloadLoading = false
        })
      },
      handleFilter2(start, end, name, appkey, channel, index) {
        let tothis = this
        let param = {
          start: start,  //"2019-03-01"
          end: end,  //"2019-03-01"
          name: name,
          appkey: appkey,
          channel: channel
        }
        console.log('method start')
        getumengRetention(param).then(response => {
          let result = response.data.data
          let resultList = []
          let one = 0;
          let three = 0;
          let seven = 0;
          let fourteen = 0;
          let thirty = 0;
          let list = []
          console.log('method success')
          for (let i = 0; i < result.length; i++) {
            let date = result[i].install_period
            let retention_rate = result[i].retention_rate
            let oneDay = typeof(retention_rate[0]) === 'undefined' ? 0 : retention_rate[0]
            let twoDay = typeof(retention_rate[1]) === 'undefined' ? 0 : retention_rate[1]
            let threeDay = typeof(retention_rate[2]) === 'undefined' ? 0 : retention_rate[2]
            let fourDay = typeof(retention_rate[3]) === 'undefined' ? 0 : retention_rate[3]
            let fiveDay = typeof(retention_rate[4]) === 'undefined' ? 0 : retention_rate[4]
            let sixDay = typeof(retention_rate[5]) === 'undefined' ? 0 : retention_rate[5]
            let sevenDay = typeof(retention_rate[6]) === 'undefined' ? 0 : retention_rate[6]
            let halfmonth = typeof(retention_rate[7]) === 'undefined' ? 0 : retention_rate[7]
            let onemonth = typeof(retention_rate[8]) === 'undefined' ? 0 : retention_rate[8]
            let ltvalue = ((((threeDay + sevenDay) * 1.5 + (sevenDay + halfmonth) * 3 + (halfmonth + onemonth) * 7.5 + oneDay + threeDay + sevenDay + halfmonth + onemonth) / oneDay) * oneDay / 100 + 1).toFixed(4)
            let oneday = {
              date: date,
              lt: window.isNaN(ltvalue) ? 0 : ltvalue,
            }

            list.push(oneday)
          }
          console.log('valuation start')
          let newlistlt = []
          newlistlt.push(name)
          for (let i = 0; i < list.length; i++) {
            newlistlt.push(parseFloat(list[i].lt).toFixed(4))
          }
          this.ltList.push(newlistlt)
          console.log(this.ltList.length)


          this.listLoading = false
          this.downloadLoading = false
        }).catch(function (rs) {
          console.error(rs)
          tothis.listLoading = false
          tothis.downloadLoading = false
        })
      },
      setretention(val, listval) {
        for (let i = 0; i < listval.length; i++) {
          let channelName = listval[i].channelName
          let list = listval[i].list
          if (val.channel === channelName) {
            for (let j = 0; j < list.length; j++) {
              if (list[j].install_period === val.date) {
                val.total_install = list[j].retention_rate[0]
                val.total_install_rate = 0
                return val
              }
            }
          }
        }
        val.total_install = 0
        val.total_install_rate = 0
        return val
      },
      handleDownload() {   //下载请求
        this.downloadLoading = true
        if (this.list === null) {
          this.$message({
            message: '没有信息可以打印~',
            type: 'warning'
          });
          this.downloadLoading = false
          return
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['时间', '应用名', '渠道', '新增人数', '活跃人数', '启动次数', '单次启动时长', '次日留存率', '版本']
          const filterVal = ['date', 'id', 'channel', 'install', 'active_user', 'launch', 'duration', 'total_install', 'total_install_rate']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '友盟3'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }, formatDate(date, fmt) {
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
      }, padLeftZero(str) {
        return ('00' + str).substr(str.length);
      }
    }
  }
</script>


<style type="text/css">
  .gridtable {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 14px bolder;
    border-collapse: collapse;
  }

  .gridtable tr {
    border-width: 0px;
    padding: 0px;
    border-style: solid;
    border-color: #99a9bf;
    background-color: #dedede;
  }

  .gridtable td {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    color: #666666;
    margin: 0px;
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #dcdfe6;
    background-color: #ffffff;
  }
</style>
