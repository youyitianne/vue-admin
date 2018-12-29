<template>

  <div class="dashboard-editor-container">
    <div class="top_condition">
      <span style="font-size: 36px;font-family:'Microsoft YaHei UI';color: dimgray">数据统计<button @click="test()">test</button></span>
      <div style="float: right;width: 85%;margin-bottom: 15px">
        <div
          style="font-size: 14px;color: dimgray;font-family: 微软雅黑;
          font-weight: bolder;margin-bottom: -7px;
          width: 270px;text-align: right;float: right;width: 560px">
          <span style="font-size: 14px;color: dimgray;font-family: 微软雅黑;font-weight: bolder">原始数据：</span>
          <el-date-picker
            size="mini"
            v-model="original_time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            style="margin-top: 5px;margin-right: 0px">
          </el-date-picker >
          <br>
          <span style="font-size: 14px;color: dimgray;font-family: 微软雅黑;font-weight: bolder"> 对比数据：</span>
          <el-date-picker
            size="mini"
            v-model="contrast_time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="margin-top: 5px;margin-right: 0px;margin-bottom: 5px">
          </el-date-picker>
          <br/>
          游戏：
          <el-select v-model="secondary_game"  style="margin-right: 40px" size="mini">
            <el-option key="全部" label="全部" value="">
            </el-option>
            <el-option v-for="item in app_name_list" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          渠道：
          <el-select v-model="secondary_channel"  style="margin-top: -10px" size="mini">
            <el-option key="全部" label="全部" value="">
            </el-option>
            <el-option v-for="item in channel_mark_list" :key="item.name" :label="item.name" :value="item.program_mark">
            </el-option>
          </el-select>
          <br/>
        </div>
      </div>
    </div>

    <div>
      <panel-group
        @handleSetLineChartData="handleSetLineChartData"
        style="margin-bottom: -45px" v-bind:statistical_data="statistical_data"/>
    </div>

    <div class="line-chart" style="margin-right: 100px;margin-top: 40px">
      <span class="font_cline">新增用户</span>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="list1" :title="1"/>
      </el-row>
    </div>
    <div class="line-chart" style="margin-top: 40px">
      <span class="font_cline">活跃用户</span>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="list2"/>
      </el-row>
    </div>
    <div class="line-chart" style="margin-right: 100px;margin-top: -100px">
      <span class="font_cline">展示次数</span>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="list3"/>
      </el-row>
    </div>
    <div class="line-chart" style="margin-top: -100px">
      <span class="font_cline">总流水</span>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="list4"/>
      </el-row>
    </div>
  </div>
</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  import {gettest} from '@/api/lineMarker'
  import {getResourceName,getName,getChannel} from '@/api/complexChart/index'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import formatDate from '@/utils/timetransform'


  let lineChartData = {}

  export default {
    name: 'DashboardAdmin',
    components: {
      PanelGroup,
      LineChart,
    },
    data() {
      return {
        statistical_data: {
          newuser: 1,
          contrast_newuser: 2,
          newuser_change: 50,
          activeuser: 3,
          contrast_activeuser: 4,
          activeuser_change: 60,
          showtimes: 5,
          contrast_showtimes: 6,
          showtimes_change: -50,
          earned: 7,
          contrast_earned: 8,
          earned_change: -90,
        },
        channel_mark_list: [],
        secondary_channel: '全部',
        app_name_list: [],
        secondary_game: '全部',
        original_time: [],
        contrast_time: [],
        list1: {
          name: ["原始数据-新增用户", "对比数据-新增用户"],
          time: ['2018-12-1', 2, 3, 4, 5, 6, 7,8,9, 10, 11, 12, 13, 14,15, 16, 17, 18, 19, 20, 21,22, 23, 24, 25, 26, 27, 28],
          firstData: [530, 140, 141, 142, 145, 150, 160,100, 120, 161, 134, 105, 160, 165,530, 140, 141, 142, 145, 150, 160,530, 140, 141, 142, 145, 150, 160],
          secondData: [100, 120, 161, 134, 105, 160, 165,100, 120, 161, 134, 105, 160, 165,100, 120, 161, 134, 105, 160, 165,100, 120, 161, 134, 105, 160, 165,],
        },
        list2: {
          name: ["原始数据-活跃用户", "对比数据-活跃用户"],
          time: [7, 26, 35, 44, 55, 63, 7],
          firstData: [200, 192, 120, 144, 160, 130, 140],
          secondData: [180, 160, 151, 106, 145, 150, 130],

        },
        list3: {
          name: ["原始数据-展示次数", "对比数据-展示次数"],
          time: [11, 22, 33, 44, 55, 66, 77],
          firstData: [80, 100, 121, 104, 105, 90, 100],
          secondData: [120, 90, 100],
        },
        list4: {
          name: ["原始数据-总流水", "对比数据-总流水"],
          time: [781, 828, 3, 48, 5, 86, 87],
          firstData: [130, 140, 141, 142, 145, 150, 160],
          secondData: [120, 82, 91, 154, 162, 140, 130],
        },
        lineChartData: lineChartData.newVisitis,
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }
          ]
        }
      }
    },
    mounted() {
      this.fetchData()
      this.initdate()
      this.fetchName()
      this.initchannel()
    },
    methods: {

      test(){
        let time=formatDate(new Date(),'yyyy-MM-dd')

        console.log(time)
        console.log(this.secondary_channel)
        console.log(this.secondary_game)
        console.log(formatDate(new Date(this.original_time[0]),'yyyy-MM-dd')+'+++++++++++'+formatDate(new Date(this.original_time[1]),'yyyy-MM-dd'))
        console.log(formatDate(new Date(this.contrast_time[0]),'yyyy-MM-dd')+'+++++++++++'+formatDate(new Date(this.contrast_time[1]),'yyyy-MM-dd'))

      },
      fetchName(){
        if (!checkPermission(['admin','leader','operator'])){
          let data={
            username:this.name
          }
          let tothis=this
          getResourceName(data).then(response => {
            this.app_name_list = response.data
          }).catch(function (rs) {
            console.error(rs)
          })
        }else {
          let tothis=this
          getName().then(response => {
            this.app_name_list = response.data
          }).catch(function (rs) {
            tothis.listLoading = false
            console.log(rs)
          })
        }
      },//初始化游戏名
      initchannel() {
        getChannel().then(response => {
          this.channel_mark_list = response.data
        })
      }, //初始化渠道标记
      initdate(){
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.original_time.push(start)
        this.original_time.push(end)
        const end1 = new Date();
        const start1 = new Date();
        start1.setTime(start1.getTime() - 3600 * 1000 * 24 * 14);
        end1.setTime(end1.getTime() - 3600 * 1000 * 24 * 7);
        this.contrast_time.push(start1)
        this.contrast_time.push(end1)
      },
      fetchData() {
        // gettest().then(response => {
        //   //  lineChartData.newVisitis.date=response.data[0]
        //   console.log(response.data[0])
        // }).catch(function (rs) {
        // end1
        // })
      },
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .font_cline {
    font-weight: bolder;
    color: #1f2d3d;
    font-size: 20px;
    font-family: 微软雅黑;
    margin-left: 60px;
    color: dimgray
  }

  .top_condition {
    width: 98%;
    height: 100px;
  }

  .line-chart {
    width: 800px;
    margin: 15px;
    height: 500px;
    float: left;
  }

  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
