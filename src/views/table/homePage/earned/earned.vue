<template>
  <div class="app-container">
    <div class="filter-container"
         style="margin: 15px;margin-top: -5px">
      <el-tabs type="border-card"
               v-loading="tabLoading"
               element-loading-text="信息获取中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-tab-pane label="收益概览">
          <div style="margin-bottom: 0px">
            <el-row :gutter="40" class="panel-group" style="margin-left: 0%">
              <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="earned1" class-name="card-panel-icon"/>
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">总收益</div>
                    <count-to :start-val="0" :end-val="statistical_data.earned_to" :duration="10"
                              class="card-panel-num"/>
                  </div>
                  <div style="margin-top: 20px;margin-left: 50px;font-size: 14px;font-weight: bolder">
                    对比总收益：{{statistical_data.earned_yes}}<br><br>
                    同比:
                    <span style="color: limegreen" v-if="statistical_data.earned_change<0">↘ &nbsp;{{statistical_data.earned_change}}%</span>
                    <span style="color:  hotpink" v-if="statistical_data.earned_change>0">↗ &nbsp;{{statistical_data.earned_change}}%</span>
                    <span style="color: grey" v-if="statistical_data.earned_change==0"> &nbsp;≈&nbsp;0&nbsp;%</span>
                  </div>
                </div>
              </el-col>

              <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="people" class-name="card-panel-icon"/>
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">总新增</div>
                    <count-to :start-val="0" :end-val="statistical_data.newuser_to" :duration="10"
                              class="card-panel-num"/>
                  </div>
                  <div style="margin-top: 20px;margin-left: 50px;font-size: 14px;font-weight: bolder">
                    对比总新增：{{statistical_data.newuser_yes}}<br><br>
                    同比:
                    <span style="color: limegreen" v-if="statistical_data.newuser_change<0">↘ &nbsp;{{statistical_data.newuser_change}}%</span>
                    <span style="color:  hotpink" v-if="statistical_data.newuser_change>0">↗ &nbsp;{{statistical_data.newuser_change}}%</span>
                    <span style="color: grey" v-if="statistical_data.newuser_change==0"> &nbsp;≈&nbsp;0&nbsp;%</span>
                  </div>
                </div>
              </el-col>

              <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">总活跃</div>
                    <count-to :start-val="0" :end-val="statistical_data.activeuser_to" :duration="10"
                              class="card-panel-num"/>
                  </div>
                  <div style="margin-top: 20px;margin-left: 50px;font-size: 14px;font-weight: bolder">
                    对比总活跃：{{statistical_data.activeuser_yes}}<br><br>
                    同比:
                    <span style="color: limegreen" v-if="statistical_data.activeuser_change<0">↘ &nbsp;{{statistical_data.activeuser_change}}%</span>
                    <span style="color:  hotpink" v-if="statistical_data.activeuser_change>0">↗ &nbsp;{{statistical_data.activeuser_change}}%</span>
                    <span style="color: grey" v-if="statistical_data.activeuser_change==0"> &nbsp;≈&nbsp;0&nbsp;%</span>
                  </div>
                </div>
              </el-col>

              <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                  <div class="card-panel-icon-wrapper icon-people">
                    <svg-icon icon-class="arpu" class-name="card-panel-icon"/>
                  </div>
                  <div class="card-panel-description">
                    <div class="card-panel-text">总ARPU</div>
                    <count-to :start-val="0" :end-val="statistical_data.arpu_to" :duration="10" class="card-panel-num"/>
                  </div>
                  <div style="margin-top: 20px;margin-left: 50px;font-size: 14px;font-weight: bolder">
                    对比ARPU：{{statistical_data.arpu_yes}}<br><br>
                    同比:
                    <span style="color: limegreen" v-if="statistical_data.arpu_change<0">↘ &nbsp;{{statistical_data.arpu_change}}%</span>
                    <span style="color:  hotpink" v-if="statistical_data.arpu_change>0">↗ &nbsp;{{statistical_data.arpu_change}}%</span>
                    <span style="color: grey" v-if="statistical_data.arpu_change==0"> &nbsp;≈&nbsp;0&nbsp;%</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-date-picker
            style="margin-left: 10%;margin-top: -40px"
            @change="daily_download1"
            size="mini"
            v-model="daily_download_value"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions0">>
          </el-date-picker>
          <el-tabs type="border-card" style="margin-top: 10px;width: 80%;margin-left: 10%">
            <el-tab-pane label="总收益">
              <div v-if="true" class="line-chart" style="margin-right: 100px;margin-top: 40px">
                <div class="font_cline" style="margin-left: 10px">七日收益趋势</div>
                <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px">
                  <line-chart :chart-data="earned_chart_list" :title="1"/>
                </el-row>
              </div>
              <table class="gridtable">
                <tr v-for="(outer,index) in earnedList">
                  <td v-for="(inner,index1) in outer">
                    <el-button size="mini" v-if="index!==0&&index1==0" @click="showdialog_earned(inner)">{{inner}}</el-button>
                    <span v-if="!(index!==0&&index1==0)">{{inner}}</span></td>
                </tr>
              </table>
            </el-tab-pane>

            <el-tab-pane label="ARPU">
              <div v-if="true" class="line-chart" style="margin-right: 100px;margin-top: 40px">
                <div class="font_cline" style="margin-left: 10px">七日ARPU趋势</div>
                <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px">
                  <line-chart :chart-data=" arpu_chart_list" :title="1"/>
                </el-row>
              </div>
              <table class="gridtable">
                <tr v-for="(outer,index) in arpuList">
                  <td v-for="(inner,index1) in outer">
                    <el-button size="mini" v-if="index!==0&&index1==0" @click="showdialog_arpu(inner)">{{inner}}</el-button>
                    <span v-if="!(index!==0&&index1==0)">{{inner}}</span></td>
                </tr>
              </table>
            </el-tab-pane>

            <el-tab-pane label="DAU">
              <div v-if="true" class="line-chart" style="margin-right: 100px;margin-top: 40px">
                <div class="font_cline" style="margin-left: 10px">七日活跃趋势</div>
                <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px">
                  <line-chart :chart-data=" dau_chart_list" :title="1"/>
                </el-row>
              </div>
              <table class="gridtable">
                <tr v-for="outer in dauList">
                  <td v-for="inner in outer">{{inner}}</td>
                </tr>
              </table>
            </el-tab-pane>

            <el-tab-pane label="DNU">
              <div v-if="true" class="line-chart" style="margin-right: 100px;margin-top: 40px">
                <div class="font_cline" style="margin-left: 10px">七日新增趋势</div>
                <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px">
                  <line-chart :chart-data=" dnu_chart_list" :title="1"/>
                </el-row>
              </div>
              <table class="gridtable">
                <tr v-for="outer in dnuList">
                  <td v-for="inner in outer">{{inner}}</td>
                </tr>
              </table>
            </el-tab-pane>

          </el-tabs>
        </el-tab-pane>
        <el-dialog
          :close-on-click-modal=false
          title="收益详情"
          :visible.sync="dialogVisible"
          width="70%">
          <table class="gridtable" style="margin-top: 20px">
            <tr v-for="(outer,index) in dataList">
              <td v-for="inner in outer" v-if="index===0||index===5||index===6||index===7||index===4||(index-5)%9===0||
                    (index-6)%9===0||(index-7)%9===0||(index-4)%9===0">{{inner}}
              </td>
            </tr>
          </table>
        </el-dialog>

        <el-dialog
          :close-on-click-modal=false
          title="arpu详情"
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
      </el-tabs>
    </div>
  </div>

</template>

<script>
  import CountTo from 'vue-count-to'
  import {
    getProjectList,
    getResourceName,
    getName,
    getarpufile_preview
  } from '@/api/table/datamanager/addata'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {mapGetters} from 'vuex'
  import {
    getDailyMsg1,
  } from '@/api/table/datamanager/earnedtable'
  import LineChart from '@/views/table/homePage/earned/admin_components/LineChart'

  export default {
    components: {
      CountTo,
      LineChart,
    },
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
        dataList1:[],
        dialogVisible1:false,
        tabLoading: false,
        project_name_list: [],
        dataList: [],
        original: [],
        dialogVisible: false,
        earned_chart_list: {
          name: ["总收益(单位:元)"],
          time: [],
          firstData: [],
        },
        dau_chart_list: {
          name: ["总活跃"],
          time: [],
          firstData: [],
        },
        dnu_chart_list: {
          name: ["总新增"],
          time: [],
          firstData: [],
        },
        arpu_chart_list: {
          name: ["总ARPU"],
          time: [],
          firstData: [],
        },
        statistical_data: {
          earned_to: 0,
          earned_yes: 1,
          earned_change: 2,
          newuser_to: 3,
          newuser_yes: 4,
          newuser_change: 5,
          activeuser_to: 6,
          activeuser_yes: 7,
          activeuser_change: 8,
          arpu_to: 9,
          arpu_yes: 10,
          arpu_change: 11,
        },
        arpuList: [],
        dauList: [],
        dnuList: [],
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
        names: [],
      }
    },
    created() {
      this.fetchName()
      this.fetchProject()
    },
    mounted() {
    },
    methods: {
      showdialog_earned(value) {
        this.tabLoading = true
        let nameList = this.app_name_list
        for (let i = 0; i < nameList.length; i++) {
          if (nameList[i].project_name === value) {
            this.arpu_preview(this.daily_download_value[0], this.daily_download_value[1], nameList[i]);
            return
          }
        }


      },
      showdialog_arpu(value) {
        this.tabLoading = true
        let nameList = this.app_name_list
        for (let i = 0; i < nameList.length; i++) {
          if (nameList[i].project_name === value) {
            this.arpu_preview1(this.daily_download_value[0], this.daily_download_value[1], nameList[i]);
            return
          }
        }
      },
      initdate() {
        const end = new Date();
        const start = new Date();
        // start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
        // end.setTime(end.getTime());
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
        this.daily_download_value.push(start)
        this.daily_download_value.push(end)
        this.daily_download1()
      },//页面渲染初始化日期
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
        this.earnedList = []
        this.dauList = []
        this.arpuList = []
        this.dnuList = []
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
            let dnuList1 = response.data.dnu
            for (let j = 0; j < dnuList1[0].length; j++) {
              let newList = []
              for (let i = 0; i < dnuList1.length; i++) {
                newList.push(dnuList1[i][j])
              }
              this.dnuList.push(newList)
            }
            let dauList1 = response.data.dau
            for (let j = 0; j < dauList1[0].length; j++) {
              let newList = []
              for (let i = 0; i < dauList1.length; i++) {
                newList.push(dauList1[i][j])
              }
              this.dauList.push(newList)
            }
            //活跃用户 统计
            let dau_today = 0
            let dau_yesterday = 0
            for (let i = 1; i < this.dauList.length; i++) {
              dau_today += parseInt(this.dauList[i][this.dauList[i].length - 1])
              dau_yesterday += parseInt(this.dauList[i][this.dauList[i].length - 2])
            }

            this.statistical_data.activeuser_to = (dau_today)
            this.statistical_data.activeuser_yes = (dau_yesterday)
            if (((dau_today - dau_yesterday) / dau_today * 100).toFixed(2) == '-Infinity') {
              this.statistical_data.activeuser_change = -999
            } else if (((dau_today - dau_yesterday) / dau_today * 100).toFixed(2) == 'Infinity') {
              this.statistical_data.activeuser_change = 999
            } else {
              this.statistical_data.activeuser_change = parseFloat((dau_today - dau_yesterday) / dau_today * 100).toFixed(2)
            }

            //新增用户 统计
            let dnu_today = 0
            let dnu_yesterday = 0
            for (let i = 1; i < this.dnuList.length; i++) {
              dau_today += parseInt(this.dnuList[i][this.dnuList[i].length - 1])
              dnu_yesterday += parseInt(this.dnuList[i][this.dnuList[i].length - 2])
            }

            this.statistical_data.newuser_to = (dnu_today)
            this.statistical_data.newuser_yes = (dnu_yesterday)
            if (((dnu_today - dnu_yesterday) / dnu_today * 100).toFixed(2) == '-Infinity') {
              this.statistical_data.newuser_change = -999
            } else if (((dnu_today - dnu_yesterday) / dnu_today * 100).toFixed(2) == 'Infinity') {
              this.statistical_data.newuser_change = 999
            } else {
              this.statistical_data.newuser_change = parseFloat((dnu_today - dnu_yesterday) / dnu_today * 100).toFixed(2)
            }


            let earnedList1 = response.data.earned
            let time_table = []
            let earned_table = []
            let dau_table = []
            let dnu_table = []
            let arpu_table = []
            let earned_today = 0
            let earned_yesterday = 0
            for (let i = 1; i < earnedList1.length; i++) {
              let earned_one = 0;
              let dau_one = 0
              let dnu_one = 0
              let arpu_one = []
              for (let j = 0; j < earnedList1[i].length; j++) {
                if (j === 0) {
                  time_table.push(earnedList1[i][j])
                } else {
                  dau_one += parseInt(dauList1[i][j])
                  dnu_one += parseInt(dnuList1[i][j])
                  earned_one += parseFloat(earnedList1[i][j])
                  arpu_one.push(arpuList1[i][j])
                }
              }
              dau_table.push(dau_one)
              dnu_table.push(dnu_one)
              earned_table.push(earned_one.toFixed(2))
              //新总的除以总的
              arpu_table.push((earned_one/dau_one).toFixed(4))
              //旧  加起来求平均值
              //arpu_table.push(this.list_to_average(arpu_one))
            }
            //收益表
            this.earned_chart_list.time = time_table
            this.earned_chart_list.firstData = earned_table
            //新增表
            this.dnu_chart_list.time = time_table
            this.dnu_chart_list.firstData = dnu_table
            //活跃表
            this.dau_chart_list.time = time_table
            this.dau_chart_list.firstData = dau_table
            //arpu
            this.arpu_chart_list.time = time_table
            this.arpu_chart_list.firstData = arpu_table


            for (let j = 0; j < earnedList1[0].length; j++) {
              let newList = []
              for (let i = 0; i < earnedList1.length; i++) {
                newList.push(earnedList1[i][j])
              }
              this.earnedList.push(newList)
            }
            for (let i = 0; i < this.earnedList.length; i++) {
              if (i > 0) {
                earned_today += parseFloat(this.earnedList[i][this.earnedList[i].length - 1])
                earned_yesterday += parseFloat(this.earnedList[i][this.earnedList[i].length - 2])
                let earned_sum = 0
                for (let j = 1; j < this.earnedList[i].length; j++) {
                  earned_sum += parseFloat(this.earnedList[i][j])
                }
                this.earnedList[i].splice(1, 0, earned_sum.toFixed(2))
              } else {
                this.earnedList[i].splice(1, 0, "统计")
              }
            }

            this.statistical_data.earned_to = parseFloat((earned_today).toFixed(2))
            this.statistical_data.earned_yes = parseFloat((earned_yesterday).toFixed(2))
            if (((earned_today - earned_yesterday) / earned_today * 100).toFixed(2) == '-Infinity') {
              this.statistical_data.earned_change = -999
            } else if (((earned_today - earned_yesterday) / earned_today * 100).toFixed(2) == 'Infinity') {
              this.statistical_data.earned_change = 999
            } else {
              this.statistical_data.earned_change = ((earned_today - earned_yesterday) / earned_today * 100).toFixed(2)
            }


            let arputo = this.statistical_data.activeuser_to === 0 ? 0 : this.statistical_data.earned_to / this.statistical_data.activeuser_to
            let arpuyes = this.statistical_data.activeuser_yes === 0 ? 0 : this.statistical_data.earned_yes / this.statistical_data.activeuser_yes
            this.statistical_data.arpu_to = parseFloat((arputo).toFixed(4))
            this.statistical_data.arpu_yes = parseFloat((arpuyes).toFixed(4))
            if (((arputo - arpuyes) / arputo).toFixed(2) == '-Infinity') {
              this.statistical_data.arpu_change = -999
            } else if (((arputo - arpuyes) / arputo).toFixed(2) == 'Infinity') {
              this.statistical_data.arpu_change = 999
            } else {
              this.statistical_data.arpu_change = ((arputo - arpuyes) / arputo).toFixed(2)
            }


            this.downloadLoading = false
            tothis.tabLoading = false
          }
        ).catch(function (rs) {
          console.log(rs.toString() + '')
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
      fetchName() {
        let tothis = this
        this.tabLoading = true
        getName().then(response => {
          this.names = response.data
        }).catch(function (rs) {
          tothis.tabLoading = false
          console.log(rs)
        })

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
      list_to_average(list) {
        if (list.length < 1) {
          return 0
        }
        let sum = 0
        for (let i = 0; i < list.length; i++) {
          sum += parseFloat(list[i])
        }
        return (sum / list.length).toFixed(4)
      },
      formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
          try {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
          }catch (e) {
            date=new Date(date)
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
          }


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
      },
      arpu_preview(date1, date2, name) {
        console
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
            newList.push(inner)
          }
          this.dataList = newList
          this.dialogVisible = true
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
      arpu_preview1(date1, date2, name) {
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
            newList.push(inner)
          }
          this.dataList1 = newList
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
        list.push(channel + '-总arpu	')
        return list
      },
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

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shopping {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shopping {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 25px 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;

      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>


