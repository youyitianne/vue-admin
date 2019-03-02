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
      <el-select v-model="select_value" filterable placeholder="请选择应用" value-key="name">
        <el-option
          v-loading.fullscreen.lock="fullscreenLoading"
          v-for="item in options"
          :key="item.appkey"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search"
                 @click="handleFilter">{{ searchName }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">
        {{'下载'}}
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
    </el-table>

  </div>


</template>

<script>
  import {getumeng, getumengapp} from '@/api/table/datamanager/umeng'
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
      handleFilter() {
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
        this.listLoading = true
        getumeng(this.listParam).then(response => {
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
              object = this.setretention(object, channel)
              newlist.push(object)
            }
          }
          this.list = newlist
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
