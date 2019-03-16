<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="">
      <el-tab-pane label="项目" name="first">
        <div class="filter-container"
             style="margin: 15px;margin-top: 15px">
          <el-date-picker
            v-model="timevalue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions0">>
          </el-date-picker>
          <el-select v-model="select_value" filterable placeholder="请选择应用" value-key="name" @change=""
                     :multiple-limit=50
                     multiple
                     collapse-tags>
            <el-option
              v-for="item in options"
              :key="item.appkey"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>

          <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search"
                     @click="test2">{{ searchName }}
          </el-button>
          <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload1">
            {{'下载'}}
          </el-button>

          <table class="gridtable" style="margin-top: 20px">
            <tr v-for="(outer,index) in ltList">
              <td v-for="(inner,index1) in outer">
                <span>{{inner}}</span></td>
            </tr>
          </table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="渠道" name="second">


        <div class="filter-container" style="margin: 15px;margin-top: 15px">
          <el-date-picker
            v-model="timevalue1"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions0">>
          </el-date-picker>
          <el-select v-model="select_value1" filterable placeholder="请选择应用" value-key="name" @change="changeselect">
            <el-option
              v-for="item in options"
              :key="item.appkey"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>

          <el-select v-model="channel_value1" filterable placeholder="请选择渠道" value-key="id"
                     :multiple-limit=50
                     multiple
                     collapse-tags>
            <el-option
              v-for="item in f"
              :key="item.id"
              :label="item.channel"
              :value="item">
            </el-option>
          </el-select>

          <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search"
                     @click="test3">{{ searchName }}
          </el-button>
          <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
            {{'下载'}}
          </el-button>
        </div>

        <table class="gridtable" style="margin-top: 20px">
          <tr v-for="(outer,index) in ltList1">
            <td v-for="(inner,index1) in outer">
              <span>{{inner}}</span></td>
          </tr>
        </table>


      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {getResourceName} from "@/api/resourceName"; //根据帐号获取被分配的项目列表
  import store from '@/store'  //获取本地缓存信息
  import {getumengRetention, getumengapp, getumengchannels} from '@/api/table/datamanager/umengLifeTime'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'

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
        ltList1: [],
        timevalue1: '',
        channel_value1: [],
        select_value1: '',
        activeName: 'second',
        ltList: [],
        channel_value: '',
        channelList: [],
        options: '',
        select_value: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        directives: {waves},
        downloadLoading: false,
        layout: '',
        timevalue: '',
        searchName: '搜索',
        tableKey: 0,
        list: [],
        total: 0,
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
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true
        if (this.list === null) {
          this.$message({
            message: '没有信息可以打印~',
            type: 'warning'
          });
          this.downloadLoading = false
          return
        }

        let list = this.ltList1
        let namelist = this.ltList1[0]
        let printList = []
        for (let i = 1; i < list.length; i++) {
          let item={}
          for (let j = 0; j < list[i].length; j++) {
            let name = namelist[j]
            // let newitem = {
            //   [name]: list[i][j],
            // }
            // item.assign(newitem)
            item[name]= list[i][j]

          }
          printList.push(item)
        }
        console.log(printList)
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = namelist
          const filterVal = namelist
          const data = this.formatJson(filterVal,printList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '友盟留存'
          })
          this.downloadLoading = false
        })
      },  //下载请求   多渠道
      handleDownload1() {
        this.downloadLoading = true
        if (this.list === null) {
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
          let item={}
          for (let j = 0; j < list[i].length; j++) {
            let name = namelist[j]
            // let newitem = {
            //   [name]: list[i][j],
            // }
            // item.assign(newitem)
            item[name]= list[i][j]

          }
          printList.push(item)
        }
        console.log(printList)
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = namelist
          const filterVal = namelist
          const data = this.formatJson(filterVal,printList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '友盟留存'
          })
          this.downloadLoading = false
        })
      },  //下载请求   多项目
      checkPermission,
      initapps() {
        let tothis = this
        getumengapp().then(response => {
          let optionlist = response.data.data
          //根据资源分配调整项目列表start
          let valid = this.checkPermission(['director']) || this.checkPermission(['admin']) || this.checkPermission(['operatorleader']) || this.checkPermission(['sdksuport'])
          console.log(valid)
          if (valid) {
            console.log(optionlist)
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
        }).catch(err => {
          tothis.$notify({
            title: '初始化app列表',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        });
      },//获取项目列表
      test2() {
        if (this.select_value.length < 1 || typeof(this.timevalue) === 'undefined' || this.timevalue === null || this.timevalue === '') {
          return
        }
        this.downloadLoading = true
        this.ltList = []

        let start = this.formatDate(new Date(this.timevalue[0]), 'yyyy-MM-dd')
        let end = this.formatDate(new Date(this.timevalue[1]), 'yyyy-MM-dd')
        let appkey = ''
        let channel = '全部'
        let options = this.select_value

        for (let j = 0; j < options.length; j++) {
          appkey = options[j].appkey
          let appname = options[j].name
          this.handleFilter2(start, end, appname, appkey, channel, j, options.length - 1)

        }


      },//搜索按钮  多项目
      test3() {
        if (this.select_value1 === '' || typeof(this.timevalue1) === 'undefined' || this.timevalue1 === null || this.timevalue1 === ''||this.channelList.length<1) {
          return
        }
        this.downloadLoading = true
        this.ltList1=[]

        let start = this.formatDate(new Date(this.timevalue1[0]), 'yyyy-MM-dd')
        let end = this.formatDate(new Date(this.timevalue1[1]), 'yyyy-MM-dd')
        let appkey = this.select_value1.appkey
        let channel = '全部'

        let options = []
        if (this.channel_value1.length > 0) {
          options = this.channel_value1
        } else {
          options = this.channelList
        }
        let appname = this.select_value1.name

        for (let j = 0; j < options.length; j++) {
          channel = options[j].id
          this.handleFilter3(start, end, appname, appkey, channel, j, options.length - 1, options[j].channel)
        }

      },//搜索按钮  多渠道
      handleFilter2(start, end, name, appkey, channel, index, index2) {

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
          if (index === 0) {
            let listindex = []
            listindex.push("日期")
            for (let i = 0; i < list.length; i++) {
              if (index === 0) {
                listindex.push(list[i].date)
              }
            }
            this.ltList.splice(0, 0, listindex)
          }

          for (let i = 0; i < list.length; i++) {
            newlistlt.push(parseFloat(list[i].lt).toFixed(4))
          }


          this.ltList.push(newlistlt)
          console.log(this.ltList.length)

          if (index === index2) {
            this.downloadLoading = false
          }

        }).catch(function (rs) {
          console.error(rs)

        })
      },//查询
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
          let newlistlt = []
          newlistlt.push(channelName)
          if (index === 0) {
            let listindex = []
            listindex.push("日期")
            for (let i = 0; i < list.length; i++) {
              if (index === 0) {
                listindex.push(list[i].date)
              }
            }
            this.ltList1.splice(0, 0, listindex)
          }

          for (let i = 0; i < list.length; i++) {
            newlistlt.push(parseFloat(list[i].lt).toFixed(4))
          }


          this.ltList1.push(newlistlt)
          console.log(this.ltList1.length)

          if (index === index2) {
            this.downloadLoading = false
          }

        }).catch(function (rs) {
          console.error(rs)

        })
      },//查询
      setretention(val, listval) {
        for (let i = 0; i < listval.length; i++) {
          let channelName = listval[i].channelName
          let list = listval[i].list
          if (val.channel === channelName) {
            for (let j = 0; j < list.length; j++) {
              if (list[j].install_period === val.date) {
                val.total_install = list[j].retention_rate[0]
                console.log(val)
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
      changeselect() {
        let tothis = this
        getumengchannels(this.select_value1.appkey).then(response => {
          this.channelList = response.data.data
          // let add = [{
          //   id: '全部',
          //   channel: '全部',
          // }]
          // this.channelList = add.concat(this.channelList)
          // this.channel_value1.push('全部')
        }).catch(err => {
          tothis.$notify({
            title: '初始化app列表',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        });
      },//获取友盟单应用的渠道id
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

