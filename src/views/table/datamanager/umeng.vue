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
      <el-select v-model="select_value1"
                 style="width: 200px"
                 filterable
                 placeholder="请选择应用"
                 value-key="name"
                 multiple
                 :multiple-limit=20
                 collapse-tags>
        <el-option
          v-loading.fullscreen.lock="fullscreenLoading"
          v-for="item in options"
          :key="item.appkey"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search"
                 @click="handleFilter1">{{ searchName }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        {{'友盟下载'}}
      </el-button>
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="getgdthandler">
        {{'广点通下载'}}
      </el-button>
    </div>
    <el-table
      height="850"
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

      <el-table-column align="center" label="应用名" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="渠道" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.channel }}</span>
        </template>
      </el-table-column>

      <el-table-column label="活跃人数" width="110" align="center" prop="active_user">
        <template slot-scope="scope">
          {{ scope.row.active_user }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="新增人数" prop="install">
        <template slot-scope="scope">
          <span>{{ scope.row.install }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="启动次数" prop="launch">
        <template slot-scope="scope">
          <span>{{ scope.row.launch }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单次启动时长" prop="duration">
        <template slot-scope="scope">
          <span>{{ scope.row.duration }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="次留率(%)" prop="total_install">
        <template slot-scope="scope">
          <span>{{ scope.row.total_install }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="r3" prop="total_install">
        <template slot-scope="scope">
          <span>{{ scope.row.r3 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="r7" prop="total_install">
        <template slot-scope="scope">
          <span>{{ scope.row.r7 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="r14" prop="total_install">
        <template slot-scope="scope">
          <span>{{ scope.row.r14 }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="r30" prop="total_install">
        <template slot-scope="scope">
          <span>{{ scope.row.r30 }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>


</template>

<script>
  import {getumeng, getumengapp, getgdt} from '@/api/table/datamanager/umeng'
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
        gdtlist: [],
        select_value1: [],
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
          end: '',
          name: '',
          appkey: ''
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
      getgdthandler() {
        if (this.timevalue === '' || this.timevalue == null || this.timevalue[0] === 'undefined' || this.timevalue[1] === 'undefined') {
          this.$message({
            message: '记得选择查询范围~',
            type: 'warning'
          });
          this.downloadLoading = false
          return
        }
        let param = {
          start_date: this.timevalue[0],
          end_date: this.timevalue[1],
        }
        this.downloadLoading=true
        getgdt(param).then(response => {
          this.downloadLoading=false
          if (response.repcode === 3000) {
            this.gdtlist=response.data
            this.handlegdtDownload()

          } else {
            console.error(response)
          }
        }).catch(error => {
          this.downloadLoading=false
          console.error(error)
        })
      },
      initapps() {
        let tothis = this
        tothis.fullscreenLoading = true
        getumengapp().then(response => {
          let optionlist = response.data.data
          this.options = optionlist
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
      handleFilter1() {
        let tothis = this
        this.downloadLoading = true
        if (this.timevalue === '' || this.timevalue == null || this.timevalue[0] === 'undefined' || this.timevalue[1] === 'undefined' || this.select_value1 === []) {
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
        this.listLoading = true
        let data = {
          data: this.select_value1,
          start: this.timevalue[0],
          end: this.timevalue[1]
        }
        getumeng(data).then(response => {
          let z = 0
          let newlist = []
          let list = response.data.data
          let channel = response.data.channel
          for (let i = 0; i < list.length; i++) {
            let name = list[i].app_name;
            let list1 = list[i].list
            for (let j = 0; j < list1.length; j++) {
              let object = list1[j];
              object.id = name
              if (typeof (object.launch) === 'undefined') {
                object.launch = '--'
              }
              if (typeof (object.duration) === 'undefined') {
                object.duration = '--'
              }
              object = this.setretention1(object, channel, z++)
              newlist.push(object)
            }
          }
          this.list = newlist
          this.listLoading = false
          this.downloadLoading = false
        }).catch(function (rs) {
          tothis.listLoading = false
          tothis.downloadLoading = false
        })
      },
      // setretention(val, listval) {
      //   for (let i = 0; i < listval.length; i++) {
      //     let channelName = listval[i].channelName
      //     let list = listval[i].list
      //     if (val.channel === channelName) {
      //       for (let j = 0; j < list.length; j++) {
      //         if (list[j].install_period === val.date) {
      //
      //           val.total_install = list[j].retention_rate[0]
      //           val.total_install_rate = 0
      //           return val
      //         }
      //       }
      //     }
      //   }
      //   val.total_install = 0
      //   val.total_install_rate = 0
      //   return val
      // },
      setretention1(val, listval) {
        //total_install_rate 版本号
        //total_install 次留
        for (let i = 0; i < listval.length; i++) {
          let channelName = listval[i].channelName
          let appName = listval[i].list.appName
          let list = listval[i].list.channelList
          val.total_install = 0
          val.r3 = 0
          val.r7 = 0
          val.r14 = 0
          val.r30 = 0
          if (val.channel === channelName && appName === val.id) {
            for (let j = 0; j < list.length; j++) {
              if (list[j].install_period === val.date) {
                val.total_install = list[j].retention_rate[0]
                val.r3 = typeof (list[j].retention_rate[2]) === 'undefined' ? 0 : list[j].retention_rate[2]
                val.r7 = typeof (list[j].retention_rate[6]) === 'undefined' ? 0 : list[j].retention_rate[6]
                val.r14 = typeof (list[j].retention_rate[7]) === 'undefined' ? 0 : list[j].retention_rate[7]
                val.r30 = typeof (list[j].retention_rate[8]) === 'undefined' ? 0 : list[j].retention_rate[8]
                val.total_install_rate = 0
                console.log(val)
                return val
              }
            }
          }
        }
        val.total_install = 0
        val.total_install_rate = 0
        return val
      },
      handleDownload() {   //友盟下载请求
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
          const tHeader = ['时间', '应用名', '渠道', '新增人数', '活跃人数', '启动次数', '单次启动时长', '次日留存率', '版本', 'r3', 'r7', 'r14', 'r30']
          const filterVal = ['date', 'id', 'channel', 'install', 'active_user', 'launch', 'duration', 'total_install', 'total_install_rate', 'r3', 'r7', 'r14', 'r30']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '友盟3'
          })
          this.downloadLoading = false
        })
      },
      handlegdtDownload() {   //广点通下载请求
        this.downloadLoading = true
        if (this.gdtlist === null) {
          this.$message({
            message: '没有信息可以打印~',
            type: 'warning'
          });
          this.downloadLoading = false
          return
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['时间', '广告位类型', '广告位', '广告展示数', '点击量', '预计收入', '千次展示收益', '点击率','广告位ID']
          const filterVal = ['Date', 'PlacementType', 'PlacementName', 'Pv', 'Click', 'Revenue', 'ECPM', 'ClickRate','PlacementId']
          const data = this.formatJson(filterVal, this.gdtlist)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '广点通'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
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
      }, padLeftZero(str) {
        return ('00' + str).substr(str.length);
      }
    }
  }
</script>
