<template>
  <div class="app-container">
    <div class="filter-container"
         style="margin: 15px;margin-top: -5px"
         v-if="checkPermission(['admin','operatorleader','director'])">
      <el-date-picker
        v-model="daily_download_value"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions0">>
      </el-date-picker>

      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"
                 @click="daily_download1">
        {{'预览'}}
      </el-button>

      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"
                 @click="daily_download">
        {{'下载收益表'}}
      </el-button>

      <el-tabs type="border-card" style="margin-top: 20px">
        <el-tab-pane label="总收益预览">
          <table class="gridtable">
            <tr v-for="outer in earnedList">
              <td v-for="inner in outer">{{inner}}</td>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane label="ARPU预览">
          <table class="gridtable">
            <tr v-for="outer in arpuList">
              <td v-for="inner in outer">{{inner}}</td>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane label="DAU预览">
          <table class="gridtable">
            <tr v-for="outer in dauList">
              <td v-for="inner in outer">{{inner}}</td>
            </tr>
          </table>
        </el-tab-pane>
      </el-tabs>


    </div>
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
  } from '@/api/table/datamanager/addata'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {mapGetters} from 'vuex'
  import {
    getDailyMsg1,
  } from '@/api/table/datamanager/earnedtable'

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
        arpuList: [],
        dauList: [],
        earnedList: [],
        daily_download_value: [],
        app_name_list: [],
        secondary_project: '选择项目',
        hackReset: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        directives: {waves},
        downloadLoading: false,
        download_value: '',
        downloadParam: {
          start: undefined,
          end: undefined,
          name: undefined,
          namelist: '',
          list: []
        },
        list: null,
        listLoading: true,
        names: [],
      }
    },
    created() {
      this.fetchName()
      this.fetchProject()
    },
    methods: {
      daily_download() {
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
          console.log(rs.toString() + 'asdasdas')
          tothis.downloadLoading = false
          tothis.$notify({
            title: '下载失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//日常收益，arpu表下载
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
        this.earnedList=[]
        this.dauList=[]
        this.arpuList=[]
        getDailyMsg1(param).then(response => {
          if (!response) {
            return
          }
          let arpuList1 = response.data.arpu
          for (let j = 0; j < arpuList1[0].length; j++) {
            let newList=[]
            for (let i = 0; i < arpuList1.length; i++) {
              newList.push(arpuList1[i][j])
            }
            this.arpuList.push(newList)
          }
          let dauList1 = response.data.dau
          for (let j = 0; j < dauList1[0].length; j++) {
            let newList=[]
            for (let i = 0; i < dauList1.length; i++) {
              newList.push(dauList1[i][j])
            }
            this.dauList.push(newList)
          }

          let earnedList1 = response.data.earned
          for (let j = 0; j < earnedList1[0].length; j++) {
            let newList=[]
            for (let i = 0; i < earnedList1.length; i++) {
              newList.push(earnedList1[i][j])
            }
            this.earnedList.push(newList)
          }


          this.downloadLoading = false
        }).catch(function (rs) {
          console.log(rs.toString() + 'asdasdas')
          tothis.downloadLoading = false
          tothis.$notify({
            title: '下载失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//日常收益，arpu表下载
      fetchProject() {
        let tothis = this
        this.listLoading = true
        getProjectList().then(response => {
          this.app_name_list = response.data
        }).catch(function (rs) {
          console.log(rs)
          tothis.listLoading = false
        })
      },//获取项目名
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
      , handleDownloadAll() {
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
      },//总表下载对话框
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
      ,
      open3() {
        this.$message({
          message: '请选择查询范围~',
          type: 'warning'
        });
      }
    }
  }
</script>

<style type="text/css">
  .gridtable {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font:14px bolder;
    border-collapse: collapse;
  }
  .gridtable tr {
    border-width: 1px;
    padding: 0px;
    border-style: solid;
    border-color: #99a9bf;
    background-color: #dedede;
  }
  .gridtable td {
    margin: 0px;
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #ffffff;
  }
</style>

