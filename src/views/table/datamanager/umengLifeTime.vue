<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-date-picker
        v-model="timevalue"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions0">>
      </el-date-picker>
      <el-select v-model="select_value" filterable placeholder="请选择应用" value-key="name" @change="changeselect">
        <el-option
          v-loading.fullscreen.lock="fullscreenLoading"
          v-for="item in options"
          :key="item.appkey"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>

      <el-select v-model="channel_value" filterable placeholder="请选择渠道" value-key="id">
        <el-option
          v-loading.fullscreen.lock="fullscreenLoading"
          v-for="item in channelList"
          :key="item.id"
          :label="item.channel"
          :value="item.id">
        </el-option>
      </el-select>

      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search"
                 @click="handleFilter">{{ searchName }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        {{'下载'}}
      </el-button>
    </div>
    <el-card
      style="margin-bottom: 10px"
      shadow="always">
      <el-tag>统计数据(平均值)</el-tag>
      <el-tag type="success">次日留存：{{average.one}}</el-tag>
      <el-tag type="success">三日留存：{{average.three}}</el-tag>
      <el-tag type="success">七日留存：{{average.seven}}</el-tag>
      <el-tag type="success">十四日留存：{{average.fourteen}}</el-tag>
      <el-tag type="success">三十日留存：{{average.thirty}}</el-tag>
      <el-tag type="success">生命周期：{{average.lt}}</el-tag>
    </el-card>
    <el-table
      height="700"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
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

      <el-table-column align="center" label="次日留存" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.oneDay }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="二日留存" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.twoDay }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="三日留存" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.threeDay }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="四日留存" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.fourDay }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="五日留存" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.fiveDay }}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="六日留存" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.sixDay }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="七日留存" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.sevenDay }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="十四日留存" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.halfmonth }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="三十日留存" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.onemonth }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="生命周期(lt)" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.lt }}</span>
        </template>
      </el-table-column>
    </el-table>
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
    },
    methods: {
      checkPermission,
      changeselect() {
        let tothis = this
        getumengchannels(this.select_value.appkey).then(response => {
          this.channelList = response.data.data
          let add = [{
            id: '全部',
            channel: '全部',
          }]
          this.channelList = add.concat(this.channelList)
          this.channel_value = '全部'
          console.log(this.channelList)
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
          console.log('++++++++++')
          console.log(optionlist)
          //根据资源分配调整项目列表start
          let valid = this.checkPermission(['director']) || this.checkPermission(['admin']) || this.checkPermission(['operatorleader']) || this.checkPermission(['sdksuport'])
          console.log(valid)
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
        this.listParam.start = this.timevalue[0]
        this.listParam.end = this.timevalue[1]
        this.listParam.name = this.select_value.name
        this.listParam.appkey = this.select_value.appkey
        this.listParam.channel = this.channel_value
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
      },
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
        console.log(this.list)
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['时间', '次日留存', '二日留存', '三日留存', '四日留存', '五日留存', '六日留存', '七日留存', '十四日留存', '三十日留存', '生命周期']
          const filterVal = ['date', 'oneDay', 'twoDay', 'threeDay', 'fourDay', 'fiveDay', 'sixDay', 'sevenDay', 'halfmonth', 'onemonth', 'lt']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '友盟留存'
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
