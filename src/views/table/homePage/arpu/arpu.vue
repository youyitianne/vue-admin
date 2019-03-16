<template>
  <div class="dashboard-editor-container" v-loading="listLoading">
    <div class="top_condition">
      <div style="float: right;width: 85%;margin-bottom: 15px">
        <div
          style="font-size: 14px;color: dimgray;font-family: 微软雅黑;
          font-weight: bolder;margin-bottom: -7px;
          text-align: right;float: right;width: 117%">
          <span style="font-size: 14px;color: dimgray;font-family: 微软雅黑;font-weight: bolder">原始数据：</span>
          <el-date-picker
            @change="fetchdata"
            size="mini"
            v-model="original_time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            style="margin-top: 5px;margin-right: 0px">
          </el-date-picker>
          <br>
          <span style="font-size: 14px;color: dimgray;font-family: 微软雅黑;font-weight: bolder"> 对比数据：</span>
          <el-date-picker
            @change="fetchdata"
            size="mini"
            v-model="contrast_time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd"
            style="margin-top: 5px;margin-right: 0px;margin-bottom: 5px">
          </el-date-picker>
          <br/>
          <span class="card-panel-icon-wrapper icon-message" style="margin-right: 20px">
            <el-checkbox-button v-model="arpu_checked" label="ARPU折线图" border size="mini" style="margin-right: 20px"
            @change="arpu_change"></el-checkbox-button>
          </span>
          <span class="card-panel-icon-wrapper icon-message" style="margin-right: 20px">
              <el-button size="mini" round @click="restore1()"><svg-icon icon-class="restore"
                                                                         class-name="card-panel-icon"/>&nbsp;还原</el-button>
          </span>
          项目：
          <el-select v-model="secondary_game" style="margin-right: 20px" size="mini" @change="paramchange()"
                     value-key="project_name" filterable>
            <!--<el-option key="全部" label="全部" value="全部"></el-option>-->
            <el-option v-for="item in app_name_list" :key="item.project_name" :label="item.project_name" :value="item">
            </el-option>
          </el-select>
          渠道：
          <el-select v-model="secondary_channel.program_mark" style="margin-top: -10px;margin-right: 20px" size="mini"
                     filterable
                     @change="paramchange()">
            <el-option key="全部" label="全部" value="全部">
            </el-option>
            <el-option v-for="item in channel_mark_list" :key="item.name" :label="item.name" :value="item.program_mark">
            </el-option>
          </el-select>
          平台：
          <el-select v-model="secondary_platform" style="margin-top: -10px" size="mini" @change="paramchange()"
                     filterable>
            <el-option key="全部" label="全部" value="全部">
            </el-option>
            <el-option key="广点通" label="广点通" value="广点通">
            </el-option>
            <el-option key="其他" label="其他" value="其他">
            </el-option>
          </el-select>
          <br/>
        </div>
      </div>
    </div>
    <div v-if="true">
      <panel-group
        @handleSetLineChartData="handleSetLineChartData"
        style="" v-bind:statistical_data="statistical_data"/>
    </div>

    <div v-if="arpu_chartline&&chartline" class="line-chart" style="margin-right: 100px;margin-top: 40px">
      <span class="font_cline">ARPU</span>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="list_arpu"/>
      </el-row>
    </div>


    <div v-if="chartline"
         style="margin-top: -90px;float: left;width: 95%;margin-left: 30px;margin-bottom: 70px;size: 50px ">
      <el-tooltip class="item" effect="light" placement="right" style="size: 50px">
        <div slot="content"
             style="font-size: 14px;font-family:'Microsoft YaHei UI';
                 border-radius:0 80px 0 0/0 60px 0 0;
                 line-height: 24px;
                 color: #8494A5;
                  background-color: white;border: 1px white">
          说明：<br/>
          <span style="font-size: 15px;font-weight: bolder">[启动次数]:</span>当前日期的启动次数<br/>
          <span style="font-size: 15px;font-weight: bolder">[DAU]:</span>当前日期的活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[MAU]:</span>从当月1号到当前日期的总活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[总收益]:</span>当日的总收益<br/>
          <span style="font-size: 15px;font-weight: bolder">[ARPU]:</span>每用户的平均收益（当日总收益/当日活跃用户）<br/>
          <span style="font-size: 15px;font-weight: bolder">[DNU]:</span>当日的新增用户<br/>
          <span style="font-size: 15px;font-weight: bolder">[MNU]:</span>从当月1号到当前日期的总新增用户<br/>
          <span style="font-size: 15px;font-weight: bolder">[总展次]:</span>当日的总展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[总ECPM]:</span>当日的千次广告展示收益<br/>
          <span style="font-size: 15px;font-weight: bolder">[人均展次]:</span>当日的总人均展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[横幅]:</span>当日的横幅总展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[视频]:</span>当日的视频总展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[开屏]:</span>当日的开屏总展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[插屏]:</span>当日的插屏总展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[横幅人均展次]:</span>当日的横幅总展次/当日的活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[视频人均展次:</span>当日的视频总展次/当日的活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[开屏人均展次]:</span>当日的开屏总展次/当日的活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[插屏人均展次]:</span>当日的插屏总展次/当日的活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[横幅收益]:</span>当日的横幅收益<br/>
          <span style="font-size: 15px;font-weight: bolder">[视频收益]:</span>当日的视频收益<br/>
          <span style="font-size: 15px;font-weight: bolder">[开屏收益]:</span>当日的开屏收益<br/>
          <span style="font-size: 15px;font-weight: bolder">[插屏收益]:</span>当日的插屏收益<br/>
          <span style="font-size: 15px;font-weight: bolder">[横幅ECPM]:</span>当日的横幅千次展示收益（当日的横幅收益/当日的横幅总展次*1000）<br/>
          <span style="font-size: 15px;font-weight: bolder">[视频ECPM]:</span>当日的视频千次展示收益（当日的视频总展次/当日的视频总展次*1000）<br/>
          <span style="font-size: 15px;font-weight: bolder">[开屏ECPM]:</span>当日的开屏千次展示收益（当日的开屏总展次/当日的开屏总展次*1000）<br/>
          <span style="font-size: 15px;font-weight: bolder">[插屏ECPM]:</span>当日的插屏千次展示收益（当日的插屏总展次/当日的插屏总展次*1000）<br/>
          <br/>
          <span style="font-size: 15px;font-weight: bolder">备注：数据会根据右上角的条件随动</span>
          <br/>&nbsp;&nbsp;&nbsp;例如：若渠道选择oppo,此处只会展示oppo渠道的各项数据总和
        </div>
        <el-button icon="el-icon-question" style="padding: 0px;border: none;background-color: #FFFF">详情</el-button>
      </el-tooltip>
      <el-button style="padding: 0px;border: none;background-color: #FFFF" @click="downloadhandler">
        <svg-icon icon-class="download" class-name="card-panel-icon"/>
      </el-button>
      <el-table :data="tableData" border stripe style="width: 100%" height="450">
        <el-table-column
          type="index"
          fixed
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          width="100px"
          fixed
          prop="date"
          label="日期">
        </el-table-column>
        <el-table-column
          width="100px"
          prop="dau"
          label="DAU">
        </el-table-column>
        <el-table-column
          width="100px"
          prop="earned"
          label="总收益">
        </el-table-column>
        <el-table-column
          width="100px"
          prop="dauarpu"
          label="ARPU">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        :total="total_page"
        style="margin-left: 15px;margin-top: 10px">
      </el-pagination>
    </div>

    <div v-if="!chartline"
         style="margin-top: 60px;float: left;width: 95%;margin-left: 30px;margin-bottom: 70px;size: 50px ">
      <el-tooltip class="item" effect="light" placement="right" style="size: 50px">
        <div slot="content"
             style="font-size: 14px;font-family:'Microsoft YaHei UI';
                 border-radius:0 80px 0 0/0 60px 0 0;
                 line-height: 24px;
                 color: #8494A5;
                  background-color: white;border: 1px white">
          说明：<br/>
          <span style="font-size: 15px;font-weight: bolder">[DAU]:</span>当前日期的活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[MAU]:</span>从当月1号到当前日期的总活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[DNU]:</span>当日的新增用户<br/>
          <span style="font-size: 15px;font-weight: bolder">[MNU]:</span>从当月1号到当前日期的总新增用户<br/>
          <span style="font-size: 15px;font-weight: bolder">[总展次]:</span>当日的总展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[人均展次]:</span>当日的总人均展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[横幅]:</span>当日的横幅总展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[视频]:</span>当日的视频总展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[开屏]:</span>当日的开屏总展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[插屏]:</span>当日的插屏总展次<br/>
          <span style="font-size: 15px;font-weight: bolder">[横幅人均展次]:</span>当日的横幅总展次/当日的活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[视频人均展次]:</span>当日的视频总展次/当日的活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[开屏人均展次]:</span>当日的开屏总展次/当日的活跃人数<br/>
          <span style="font-size: 15px;font-weight: bolder">[插屏人均展次]:</span>当日的插屏总展次/当日的活跃人数<br/>
          <br/>
          <span style="font-size: 15px;font-weight: bolder">备注：数据会根据右上角的条件随动</span>
          <br/>&nbsp;&nbsp;&nbsp;例如：若渠道选择oppo,此处只会展示oppo渠道的各项数据总和
        </div>
        <el-button icon="el-icon-question" style="padding: 0px;border: none;background-color: #FFFF">详情</el-button>
      </el-tooltip>
      <!--<el-button style="padding: 0px;border: none;background-color: #FFFF" @click="downloadhandler">-->
      <!--<svg-icon icon-class="download" class-name="card-panel-icon"/>-->
      <!--</el-button>-->
      <el-table :data="tableData" border stripe style="width: 100%" height="450">
        <el-table-column
          type="index"
          fixed
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          width="100px"
          fixed
          prop="date"
          label="日期">
        </el-table-column>
        <el-table-column
          width="100px"
          prop="dau"
          label="DAU">
        </el-table-column>
        <el-table-column
          width="100px"
          prop="earned"
          label="总收益">
        </el-table-column>
        <el-table-column
          width="100px"
          prop="dauarpu"
          label="ARPU">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        :total="total_page"
        style="margin-left: 15px;margin-top: 10px">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import PanelGroup from '@/views/table/homePage/arpu/components/PanelGroup'
  import LineChart from '@/views/table/homePage/arpu/components/LineChart'
  import {gettest} from '@/api/lineMarker'
  import {
    getResourceName,
    getName,
    getChannel,
    getappdata,
    getProjectList
  } from '@/api/complexChart/user_ad_addata_line_chart'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import formatDate from '@/utils/timetransform'
  import store from '@/store'

  let lineChartData = {}

  export default {
    name: 'DashboardAdmin',
    components: {
      PanelGroup,
      LineChart,
    },
    data() {
      return {
        retentionList:[],
        singleList:[],
        startList:[],
        startList1:[],
        startup:{
          original:0,
          contrast:0,
          change:0
        },
        total_page: 0,
        query_way: '日',
        panel_view: true,
        arpu_checked: false,
        arpu_chartline: false,
        chartline: false,
        secondary_platform: '全部',
        platform_list: [],
        totaltabledata: [],
        tableData: [],
        listLoading: true,
        original_list: [],
        contrast_list: [],
        original_list_app: [],
        contrast_list_app: [],
        statistical_data: {
          //新增
          newuser: 1,
          contrast_newuser: 2,
          newuser_change: 50,
          //活跃
          activeuser: 3,
          contrast_activeuser: 4,
          activeuser_change: 60,
          //总展次
          showtimes: 5,
          contrast_showtimes: 6,
          showtimes_change: -50,
          //流水
          earned: 7,
          contrast_earned: 8,
          earned_change: -90,
          //横幅
          banner: 1,
          contrast_banner: 2,
          banner_change: 50,
          //视频
          video: 3,
          contrast_video: 4,
          video_change: 60,
          //插屏
          inline: 5,
          contrast_inline: 6,
          inline_change: -50,
          //开屏
          splash: 7,
          contrast_splash: 8,
          splash_change: -90,
        },
        channel_mark_list: [],
        secondary_channel: {
          program_mark: '全部',
          name: '',
        },
        app_name_list: [],
        secondary_game: {
          project_name: '全部',
          applist: []
        },
        original_time: [],
        contrast_time: [],
        list1: {
          name: ["原始数据-新增用户", "对比数据-新增用户"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list2: {
          name: ["原始数据-活跃用户", "对比数据-活跃用户"],
          time: [],
          firstData: [],
          secondData: [],

        },
        list3: {
          name: ["原始数据-展示次数", "对比数据-展示次数"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list_arpu: {
          name: ["原始数据-ARPU", "对比数据-ARPU"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list4: {
          name: ["原始数据-总流水", "对比数据-总流水"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list_banner: {
          name: ["原始数据-横幅人均展次", "对比数据-横幅人均展次"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list_video: {
          name: ["原始数据-视频人均展次", "对比数据-视频人均展次"],
          time: [],
          firstData: [],
          secondData: [],

        },
        list_inline: {
          name: ["原始数据-插屏人均展次", "对比数据-插屏人均展次"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list_splash: {
          name: ["原始数据-开屏人均展次", "对比数据-开屏人均展次"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list_banner_pershow: {
          name: ["原始数据-横幅人均展次", "对比数据-横幅人均展次"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list_video_pershow: {
          name: ["原始数据-视频人均展次", "对比数据-视频人均展次"],
          time: [],
          firstData: [],
          secondData: [],

        },
        list_inline_pershow: {
          name: ["原始数据-插屏人均展次", "对比数据-插屏人均展次"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list_splash_pershow: {
          name: ["原始数据-开屏人均展次", "对比数据-开屏人均展次"],
          time: [],
          firstData: [],
          secondData: [],
        },

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
        },
        original_mon: '',
        contrast_mon: '',
      }
    },
    mounted() {
      this.initdate()
      this.fetchName()
      this.initchannel()
      this.fetchdata()
    },
    methods: {
      checkPermission,
      handleCurrentChange(val) {
        this.tableData = this.totaltabledata.slice((val - 1) * 10, val * 10)
      },
      querychange() {
        let tothis = this
        this.listLoading = true
        let listParam
        let listParam1
        if (this.query_way === '日') {
          listParam = {
            start: this.original_time[0],
            end: this.original_time[1]
          }
          listParam1 = {
            start: this.contrast_time[0],
            end: this.contrast_time[1]
          }
        } else if (this.query_way === '月') {
          listParam = {
            start: this.original_time[0].split('-')[0] + '-' + this.original_time[0].split('-')[1],
            end: this.original_time[1].split('-')[0] + '-' + this.original_time[1].split('-')[1],
          }
          listParam1 = {
            start: this.contrast_time[0].split('-')[0] + '-' + this.contrast_time[0].split('-')[1],
            end: this.contrast_time[1].split('-')[0] + '-' + this.contrast_time[1].split('-')[1],
          }
        } else {
          listParam = {
            start: this.original_time[0].split('-')[0],
            end: this.original_time[1].split('-')[0],
          }
          listParam1 = {
            start: this.contrast_time[0].split('-')[0],
            end: this.contrast_time[1].split('-')[0],
          }
        }
      },
      arpu_change() {
        if (this.arpu_checked === false) {
          this.chartline = false
          this.arpu_chartline = false
          this.panel_view = false
        }
        if (this.arpu_checked === true) {
          this.chartline = true
          this.arpu_chartline = true
          this.panel_view = true
        }
      },
      showchart() {
        if (this.chartline === true) {
          this.chartline = false
          this.arpu_chartline = true
        } else {
          this.chartline = true
          this.arpu_chartline = false
        }
      },//折线图隐藏按钮
      restore1() {
        this.secondary_platform = '全部'
        this.secondary_channel.program_mark = '全部'
        this.secondary_game = {
          project_name: '全部',
          applist: []
        }
        this.analysisdata()
      },//重置按钮
      fetchdata() {
        let tothis = this
        this.listLoading = true
        let listParam
        let listParam1
        if (this.query_way === '日') {
          listParam = {
            start: this.original_time[0],
            end: this.original_time[1]
          }
          listParam1 = {
            start: this.contrast_time[0],
            end: this.contrast_time[1]
          }
        } else if (this.query_way === '月') {
          listParam = {
            start: this.original_time[0].split('-')[0] + '-' + this.original_time[0].split('-')[1],
            end: this.original_time[1].split('-')[0] + '-' + this.original_time[1].split('-')[1],
          }
          listParam1 = {
            start: this.contrast_time[0].split('-')[0] + '-' + this.contrast_time[0].split('-')[1],
            end: this.contrast_time[1].split('-')[0] + '-' + this.contrast_time[1].split('-')[1],
          }
        } else {
          listParam = {
            start: this.original_time[0].split('-')[0],
            end: this.original_time[1].split('-')[0],
          }
          listParam1 = {
            start: this.contrast_time[0].split('-')[0],
            end: this.contrast_time[1].split('-')[0],
          }
        }
        //this.listLoading = false
        getappdata(listParam).then(response => {
          this.original_list = response.data
          this.original_list_app = response.data1
          console.log(this.original_list)
          console.log(this.original_list_app)
          this.original_mon = response.mon
          getappdata(listParam1).then(response => {
            this.contrast_list = response.data
            this.contrast_list_app = response.data1
            this.contrast_mon = response.mon
            this.analysisdata()
            tothis.listLoading = false
          }).catch(function (rs) {
            console.error(rs)
            tothis.listLoading = false
          })
        }).catch(function (rs) {
          tothis.listLoading = false
          console.error(rs)
        })
      },//根据时间查找数据
      analysisdata() {
        //初始化启动次数list start
        this.startup={
          original:0,
            contrast:0,
            change:0
        }
        this.startList=[]
        this.startList1=[]
        this.retentionList=[]
        this.singleList=[]
        //end

        this.resetchart()
        let times
        let times1
        if (this.query_way === '日') {
          times = this.getdate(new Date(this.original_time[0]), new Date(this.original_time[1]))
          times1 = this.getdate(new Date(this.contrast_time[0]), new Date(this.contrast_time[1]))
        } else if (this.query_way === '月') {
          times = this.getMonth(new Date(this.original_time[0]), new Date(this.original_time[1]))
          times1 = this.getMonth(new Date(this.contrast_time[0]), new Date(this.contrast_time[1]))
        } else {
          times = this.getdate(new Date(this.original_time[0]), new Date(this.original_time[1]))
          times1 = this.getdate(new Date(this.contrast_time[0]), new Date(this.contrast_time[1]))
        }
        //线性表x轴坐标
        this.list1.time = times
        this.list2.time = times
        this.list3.time = times
        this.list4.time = times
        this.list_banner.time = times
        this.list_video.time = times
        this.list_inline.time = times
        this.list_splash.time = times
        this.list_banner_pershow.time = times
        this.list_video_pershow.time = times
        this.list_inline_pershow.time = times
        this.list_splash_pershow.time = times
        let original_sumdau = 0
        let original_sumdnu = 0
        let contrast_sumdau = 0
        let contrast_sumdnu = 0
        let original_sumshowtimes = 0
        let original_sumearned = 0
        let contrast_sumshowtimes = 0
        let contrast_sumearned = 0
        let original_sumbanner = 0
        let original_sumvideo = 0
        let original_suminline = 0
        let original_sumsplash = 0
        let contrast_sumbanner = 0
        let contrast_sumvideo = 0
        let contrast_suminline = 0
        let contrast_sumsplash = 0
        let banner_earned_list = []
        let video_earned_list = []
        let inline_earned_list = []
        let splash_earned_list = []
        let sum_original_start=0
        let sum_contrast_start=0
        let sum_original_single=0
        let sum_contrast_single=0
        for (let j = 0; j < times.length; j++) {
          let contrast_dau = 0
          let contrast_dnu = 0
          let contrast_showtimes = 0
          let contrast_earned = 0
          let orginal_banner = 0
          let orginal_video = 0
          let orginal_inline = 0
          let orginal_splash = 0
          let banner_earned = 0
          let video_earned = 0
          let inline_earned = 0
          let splash_earned = 0
          let contrast_banner = 0
          let contrast_video = 0
          let contrast_inline = 0
          let contrast_splash = 0
          let original_dau = 0
          let original_dnu = 0
          let original_start=0   //启动次数
          let contrast_start = 0
          let original_single=[]
          let contrast_single=[]
          let original_retention=[]
          //原始数据
          for (let i = 0; i < this.original_list.length; i++) {
            let channel = false
            if (this.secondary_channel.program_mark === '全部' || this.secondary_channel.program_mark === this.original_list[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game.project_name === '全部') {
              game = true
            } else {
              //根据项目下的项目名判断
              // if (this.secondary_game.project_name===== this.original_list[i].app_name) {
              //   game=true
              // }
              //根据项目下的应用名判断
              for (let n = 0; n < this.secondary_game.applist.length; n++) {
                if (this.secondary_game.applist[n].app_name === this.original_list[i].app_name) {
                  game = true
                }
              }

            }
            if (times[j] === this.original_list[i].date && game && channel) {
              original_dau = original_dau + this.original_list[i].dau
              original_dnu = original_dnu + this.original_list[i].dnu
              original_start= original_start+this.original_list[i].startup_time
              original_single.push(this.original_list[i].single_use_time)
              original_retention.push(this.original_list[i].retention)

            }
          }
          original_sumdau = original_sumdau + original_dau
          original_sumdnu = original_sumdnu + original_dnu
          sum_original_start=sum_original_start+original_start
          this.list1.firstData.push(original_dnu)
          this.list2.firstData.push(original_dau)
          this.startList.push(original_start)
          this.singleList.push()
          let result=this.list_to_average(original_single).toFixed(0)
          if (result=='NaN'){
            result=0
          }
          this.singleList.push(result)
          sum_original_single+=parseInt(result)

          let result_retention=this.list_to_average1(original_retention).toFixed(2)
          if (result_retention=='NaN'){
            result_retention=0
          }
          this.retentionList.push(result_retention)

          //对比数据
          for (let i = 0; i < this.contrast_list.length; i++) {
            let channel = false
            if (this.secondary_channel.program_mark === '全部' || this.secondary_channel.program_mark === this.contrast_list[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game.project_name === '全部') {
              game = true
            } else {
              //根据项目下的项目名判断
              // if (this.secondary_game.project_name===== this.contrast_list[i].app_name) {
              //   game=true
              // }
              //根据项目下的应用名判断
              for (let n = 0; n < this.secondary_game.applist.length; n++) {
                if (this.secondary_game.applist[n].app_name === this.contrast_list[i].app_name) {
                  game = true
                }
              }
            }
            if (times1[j] === this.contrast_list[i].date && game && channel) {
              contrast_dau = contrast_dau + this.contrast_list[i].dau
              contrast_dnu = contrast_dnu + this.contrast_list[i].dnu
              contrast_start=contrast_start+this.contrast_list[i].startup_time
              contrast_single.push(this.contrast_list[i].single_use_time)

            }
          }
          contrast_sumdau = contrast_sumdau + contrast_dau
          contrast_sumdnu = contrast_sumdnu + contrast_dnu
          sum_contrast_start=contrast_start+sum_contrast_start
          this.list1.secondData.push(contrast_dnu)
          this.list2.secondData.push(contrast_dau)
          this.startList1.push(contrast_start)
          let contrast_result=this.list_to_average(contrast_single).toFixed(0)
          sum_contrast_single+=parseInt(contrast_result)
          this.statistical_data.newuser = original_sumdnu
          this.statistical_data.contrast_newuser = contrast_sumdnu
          this.statistical_data.newuser_change = ((original_sumdnu - contrast_sumdnu) / contrast_sumdnu * 100).toFixed(2)
          this.statistical_data.activeuser = original_sumdau
          this.statistical_data.contrast_activeuser = contrast_sumdau
          this.statistical_data.activeuser_change = ((original_sumdau - contrast_sumdau) / contrast_sumdau * 100).toFixed(2)


          /**
           newuser: 1,
           contrast_newuser: 2,
           newuser_change: 50,
           activeuser: 3,
           contrast_activeuser: 4,
           activeuser_change: 60,
           * */


            //原始数据
          let orginal_showtimes = 0
          let orginal_earned = 0
          for (let i = 0; i < this.original_list_app.length; i++) {
            let channel = false
            if (this.secondary_channel.program_mark === '全部' || this.secondary_channel.program_mark === this.original_list_app[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game.project_name === '全部') {
              game = true
            } else {
              for (let n = 0; n < this.secondary_game.applist.length; n++) {
                if (this.secondary_game.applist[n].app_name === this.original_list_app[i].app_name) {
                  game = true
                }
              }
            }
            let platform = false

            if (this.secondary_platform === '其他') {
              if ('广点通' !== this.original_list_app[i].platform) {
                platform = true
              }
            } else {
              if (this.secondary_platform === '全部' || this.secondary_platform === this.original_list_app[i].platform) {
                platform = true
              }
            }


            if (times[j] === this.original_list_app[i].date && game && channel && platform) {
              orginal_showtimes = orginal_showtimes + this.original_list_app[i].impression
              orginal_earned = orginal_earned + this.original_list_app[i].earned
            }
          }
          original_sumshowtimes = original_sumshowtimes + orginal_showtimes
          original_sumearned = original_sumearned + orginal_earned
          this.list3.firstData.push(orginal_showtimes)
          this.list4.firstData.push(parseInt(orginal_earned))

          //对比数据


          for (let i = 0; i < this.contrast_list_app.length; i++) {
            let channel = false
            if (this.secondary_channel.program_mark === '全部' || this.secondary_channel.program_mark === this.contrast_list_app[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game.project_name === '全部') {
              game = true
            } else {
              for (let n = 0; n < this.secondary_game.applist.length; n++) {
                if (this.secondary_game.applist[n].app_name === this.contrast_list_app[i].app_name) {
                  game = true
                }
              }
            }
            let platform = false
            if (this.secondary_platform === '其他') {
              if ('广点通' !== this.contrast_list_app[i].platform) {
                platform = true
              }
            } else {
              if (this.secondary_platform === '全部' || this.secondary_platform === this.contrast_list_app[i].platform) {
                platform = true
              }
            }
            if (times1[j] === this.contrast_list_app[i].date && game && channel && platform) {
              contrast_showtimes = contrast_showtimes + this.contrast_list_app[i].impression
              contrast_earned = contrast_earned + this.contrast_list_app[i].earned
            }
          }
          contrast_sumshowtimes = contrast_sumshowtimes + contrast_showtimes
          contrast_sumearned = contrast_sumearned + contrast_earned
          this.list3.secondData.push(contrast_showtimes)
          this.list4.secondData.push(parseInt(contrast_earned))

          this.statistical_data.showtimes = parseInt(original_sumdau) === 0 ? 0 : (parseInt(original_sumearned) / original_sumdau).toFixed(4)
          this.statistical_data.contrast_showtimes = parseInt(contrast_sumdau) === 0 ? 0 : (parseInt(contrast_sumearned) / contrast_sumdau).toFixed(4)
          this.statistical_data.showtimes_change = parseInt(original_sumdau) === 0 || parseInt(contrast_sumdau) === 0 ? 0 : ((parseInt(original_sumearned) / original_sumdau - parseInt(contrast_sumearned) / contrast_sumdau) / (parseInt(contrast_sumearned) / contrast_sumdau) * 100).toFixed(2)
          this.statistical_data.earned = parseInt(original_sumearned)
          this.statistical_data.contrast_earned = parseInt(contrast_sumearned)
          this.statistical_data.earned_change = ((original_sumearned - contrast_sumearned) / contrast_sumearned * 100).toFixed(2)
          /**
           showtimes: 5,
           contrast_showtimes: 6,
           showtimes_change: -50,
           earned: 7,
           contrast_earned: 8,
           earned_change: -90,
           */
          //各类型

          //原始数据
          for (let i = 0; i < this.original_list_app.length; i++) {
            let channel = false
            if (this.secondary_channel.program_mark === '全部' || this.secondary_channel.program_mark === this.original_list_app[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game.project_name === '全部') {
              game = true
            } else {
              for (let n = 0; n < this.secondary_game.applist.length; n++) {
                if (this.secondary_game.applist[n].app_name === this.original_list_app[i].app_name) {
                  game = true
                }
              }
            }
            let platform = false
            if (this.secondary_platform === '其他') {
              if ('广点通' !== this.original_list_app[i].platform) {
                platform = true
              }
            } else {
              if (this.secondary_platform === '全部' || this.secondary_platform === this.original_list_app[i].platform) {
                platform = true
              }
            }
            if (times[j] === this.original_list_app[i].date && game && channel && platform) {
              switch (this.original_list_app[i].advertising_type) {
                case '横幅':
                  orginal_banner = orginal_banner + this.original_list_app[i].impression
                  banner_earned = banner_earned + this.original_list_app[i].earned
                  break
                case '视频':
                  orginal_video = orginal_video + this.original_list_app[i].impression
                  video_earned = video_earned + this.original_list_app[i].earned
                  break
                case '插屏':
                  orginal_inline = orginal_inline + this.original_list_app[i].impression
                  inline_earned = inline_earned + this.original_list_app[i].earned
                  break
                case '开屏':
                  orginal_splash = orginal_splash + this.original_list_app[i].impression
                  splash_earned = splash_earned + this.original_list_app[i].earned
                  break
                default:
                  break
              }
            }
          }
          banner_earned_list.push(banner_earned)
          video_earned_list.push(video_earned)
          inline_earned_list.push(inline_earned)
          splash_earned_list.push(splash_earned)

          original_sumbanner = original_sumbanner + orginal_banner
          original_sumvideo = original_sumvideo + orginal_video
          original_suminline = original_suminline + orginal_inline
          original_sumsplash = original_sumsplash + orginal_splash
          this.list_banner.firstData.push(orginal_banner)
          this.list_video.firstData.push(orginal_video)
          this.list_inline.firstData.push(orginal_inline)
          this.list_splash.firstData.push(orginal_splash)
          this.list_banner_pershow.firstData.push(this.list2.firstData[j] === 0 ? 0 : (orginal_banner / this.list2.firstData[j]).toFixed(2))
          this.list_video_pershow.firstData.push(this.list2.firstData[j] === 0 ? 0 : (orginal_video / this.list2.firstData[j]).toFixed(2))
          this.list_inline_pershow.firstData.push(this.list2.firstData[j] === 0 ? 0 : (orginal_inline / this.list2.firstData[j]).toFixed(2))
          this.list_splash_pershow.firstData.push(this.list2.firstData[j] === 0 ? 0 : (orginal_splash / this.list2.firstData[j]).toFixed(2))

          //对比数据
          for (let i = 0; i < this.contrast_list_app.length; i++) {

            let channel = false
            if (this.secondary_channel.program_mark === '全部' || this.secondary_channel.program_mark === this.contrast_list_app[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game.project_name === '全部') {
              game = true
            } else {
              for (let n = 0; n < this.secondary_game.applist.length; n++) {
                if (this.secondary_game.applist[n].app_name === this.contrast_list_app[i].app_name) {
                  game = true
                }
              }
            }
            let platform = false
            if (this.secondary_platform === '其他') {
              if ('广点通' !== this.contrast_list_app[i].platform) {
                platform = true
              }
            } else {
              if (this.secondary_platform === '全部' || this.secondary_platform === this.contrast_list_app[i].platform) {
                platform = true
              }
            }

            if (times1[j] === this.contrast_list_app[i].date && game && channel && platform) {
              switch (this.contrast_list_app[i].advertising_type) {
                case '横幅':
                  contrast_banner = contrast_banner + this.contrast_list_app[i].impression
                  break
                case '视频':
                  contrast_video = contrast_video + this.contrast_list_app[i].impression
                  break
                case '插屏':
                  contrast_inline = contrast_inline + this.contrast_list_app[i].impression
                  break
                case '开屏':
                  contrast_splash = contrast_splash + this.contrast_list_app[i].impression
                  break
                default:
                  break
              }
            }
          }
          contrast_sumbanner = contrast_sumbanner + contrast_banner
          contrast_sumvideo = contrast_sumvideo + contrast_video
          contrast_suminline = contrast_suminline + contrast_inline
          contrast_sumsplash = contrast_sumsplash + contrast_splash
          this.list_banner.secondData.push(contrast_banner)
          this.list_video.secondData.push(contrast_video)
          this.list_inline.secondData.push(contrast_inline)
          this.list_splash.secondData.push(contrast_splash)
          this.list_banner_pershow.secondData.push(this.list2.secondData[j] === 0 ? 0 : (contrast_banner / this.list2.secondData[j]).toFixed(2))
          this.list_video_pershow.secondData.push(this.list2.secondData[j] === 0 ? 0 : (contrast_video / this.list2.secondData[j]).toFixed(2))
          this.list_inline_pershow.secondData.push(this.list2.secondData[j] === 0 ? 0 : (contrast_inline / this.list2.secondData[j]).toFixed(2))
          this.list_splash_pershow.secondData.push(this.list2.secondData[j] === 0 ? 0 : (contrast_splash / this.list2.secondData[j]).toFixed(2))
        }
        //启动次数
        this.startup.original=sum_original_start
        this.startup.contrast=sum_contrast_start
        this.startup.change=parseInt(sum_original_start)===0?0:((sum_original_start-sum_contrast_start)/sum_original_start).toFixed(4)*100
        //借用流水的图标
        this.statistical_data.earned=this.startup.original
        this.statistical_data.contrast_earned=this.startup.contrast
        this.statistical_data.earned_change=this.startup.change
        //借用展次的图标
        this.statistical_data.showtimes = parseInt(original_sumdau) === 0 ? 0 : (parseInt(original_sumearned) / original_sumdau).toFixed(4)
        this.statistical_data.contrast_showtimes = parseInt(contrast_sumdau) === 0 ? 0 : (parseInt(contrast_sumearned) / contrast_sumdau).toFixed(4)
        this.statistical_data.showtimes_change = parseInt(original_sumdau) === 0 || parseInt(contrast_sumdau) === 0 ? 0 : ((parseInt(original_sumearned) / original_sumdau - parseInt(contrast_sumearned) / contrast_sumdau) / (parseInt(contrast_sumearned) / contrast_sumdau) * 100).toFixed(2)


        this.statistical_data.banner = parseInt(original_sumdau) === 0 ? 0 : (original_sumbanner / original_sumdau).toFixed(2)
        this.statistical_data.contrast_banner = parseInt(contrast_sumdau) === 0 ? 0 : (contrast_sumbanner / contrast_sumdau).toFixed(2)
        this.statistical_data.banner_change = parseInt(original_sumdau) === 0 || parseInt(contrast_sumdau) === 0 ? 0 : ((original_sumbanner / original_sumdau - contrast_sumbanner / contrast_sumdau) / (contrast_sumbanner / contrast_sumdau) * 100).toFixed(2)
        this.statistical_data.video = parseInt(original_sumdau) === 0 ? 0 : (original_sumvideo / original_sumdau).toFixed(2)
        this.statistical_data.contrast_video = parseInt(contrast_sumdau) === 0 ? 0 : (contrast_sumvideo / contrast_sumdau).toFixed(2)
        this.statistical_data.video_change = parseInt(original_sumdau) === 0 || parseInt(contrast_sumdau) === 0 ? 0 : ((original_sumvideo / original_sumdau - contrast_sumvideo / contrast_sumdau) / (contrast_sumvideo / contrast_sumdau) * 100).toFixed(2)
        this.statistical_data.inline = parseInt(original_sumdau) === 0 ? 0 : (original_suminline / original_sumdau).toFixed(2)
        this.statistical_data.contrast_inline = parseInt(contrast_sumdau) === 0 ? 0 : (contrast_suminline / contrast_sumdau).toFixed(2)
        this.statistical_data.inline_change = parseInt(original_sumdau) === 0 || parseInt(contrast_sumdau) === 0 ? 0 : ((original_suminline / original_sumdau - contrast_suminline / contrast_sumdau) / (contrast_suminline / contrast_sumdau) * 100).toFixed(2)
        this.statistical_data.splash = parseInt(original_sumdau) === 0 ? 0 : (original_sumsplash / original_sumdau).toFixed(2)
        this.statistical_data.contrast_splash = parseInt(contrast_sumdau) === 0 ? 0 : (contrast_sumsplash / contrast_sumdau).toFixed(2)
        this.statistical_data.splash_change = parseInt(original_sumdau) === 0 || parseInt(contrast_sumdau) === 0 ? 0 : ((original_sumsplash / original_sumdau - contrast_sumsplash / contrast_sumdau) / (contrast_sumsplash / contrast_sumdau) * 100).toFixed(2)
        /**
         //横幅
         banner: 1,
         contrast_banner: 2,
         banner_change: 50,
         //视频
         video: 3,
         contrast_video: 4,
         video_change: 60,
         //插屏
         inline: 5,
         contrast_inline: 6,
         inline_change: -50,
         //开屏
         splash: 7,
         contrast_splash: 8,
         splash_change: -90,
         */

        // let banner_earned_list=[]
        // let video_earned_list=[]
        // let inline_earned_list=[]
        // let splash_earned_list=[]
        this.tableData = [this.original_mon]
        let dau = 0;
        let dnu = 0;
        let mondau = this.original_mon[0].sumdau
        let mondnu = this.original_mon[0].sumdnu
        this.list_arpu = {
          name: ["原始数据-ARPU", "对比数据-ARPU"],
          time: [],
          firstData: [],
          secondData: [],
        },

          this.totaltabledata = []
        for (let i = 0; i < times.length; i++) {
          //arpu折线图数据赋值
          this.list_arpu.time.push(times[i])
          let original_data = (this.list2.firstData[i] === 0 ? 0 : this.list4.firstData[i] / this.list2.firstData[i]).toFixed(4)
          this.list_arpu.firstData.push(original_data)
          let contrast_data = (this.list2.secondData[i] === 0 ? 0 : this.list4.secondData[i] / this.list2.secondData[i]).toFixed(4)
          this.list_arpu.secondData.push(contrast_data)
          //
          dau = dau + this.list2.firstData[i]
          dnu = dnu + this.list1.firstData[i]
          if (times[i].split("-")[2] === '01') {
            dau = 0
            dnu = 0
            mondau = this.list2.firstData[i]
            mondnu = this.list1.firstData[i]
          }
          let one = {
            start:this.startList[i],
            single:this.singleList[i],
            retention:this.retentionList[i],
            mau: mondau + dau,
            mnu: mondnu + dnu,
            date: times[i],
            dau: this.list2.firstData[i],
            earned: this.list4.firstData[i],
            dauarpu: (this.list2.firstData[i] === 0 ? 0 : this.list4.firstData[i] / this.list2.firstData[i]).toFixed(3),
            dnu: this.list1.firstData[i],
            per_showtime: (this.list2.firstData[i] === 0 ? 0 : this.list3.firstData[i] / this.list2.firstData[i]).toFixed(2),
            showtime: this.list3.firstData[i],
            banner: this.list_banner.firstData[i],
            video: this.list_video.firstData[i],
            splash: this.list_splash.firstData[i],
            inline: this.list_inline.firstData[i],
            banner_pershow: (this.list2.firstData[i] === 0 ? 0 : this.list_banner.firstData[i] / this.list2.firstData[i]).toFixed(2),
            video_pershow: (this.list2.firstData[i] === 0 ? 0 : this.list_video.firstData[i] / this.list2.firstData[i]).toFixed(2),
            splash_pershow: (this.list2.firstData[i] === 0 ? 0 : this.list_splash.firstData[i] / this.list2.firstData[i]).toFixed(2),
            inline_pershow: (this.list2.firstData[i] === 0 ? 0 : this.list_inline.firstData[i] / this.list2.firstData[i]).toFixed(2),
            ecpm_all: this.list3.firstData[i] === 0 ? 0 : (this.list4.firstData[i] / this.list3.firstData[i] * 1000).toFixed(3),
            banner_earned: banner_earned_list[i].toFixed(2),
            banner_ecpm: this.list_banner.firstData[i] === 0 ? 0 : (banner_earned_list[i].toFixed(2) / this.list_banner.firstData[i] * 1000).toFixed(3),
            video_earned: video_earned_list[i].toFixed(2),
            video_ecpm: this.list_video.firstData[i] === 0 ? 0 : (video_earned_list[i].toFixed(2) / this.list_video.firstData[i] * 1000).toFixed(3),
            splash_earned: splash_earned_list[i].toFixed(2),
            splash_ecpm: this.list_splash.firstData[i] === 0 ? 0 : (splash_earned_list[i].toFixed(2) / this.list_splash.firstData[i] * 1000).toFixed(3),
            inline_earned: inline_earned_list[i].toFixed(2),
            inline_ecpm: this.list_inline.firstData[i] === 0 ? 0 : (inline_earned_list[i].toFixed(2) / this.list_inline.firstData[i] * 1000).toFixed(3),
          }
          this.totaltabledata.push(one)
        }

        this.tableData = this.totaltabledata.slice(0, 10)
        this.total_page = this.totaltabledata.length
        this.listLoading = false

      },//数据整合
      paramchange() {
        this.listLoading = true
        this.analysisdata()
      },//根据游戏渠道变动
      showretention(){
        let routeData = this.$router.resolve({
          name: 'UmengLifeTimeTable',
        });
        window.open(routeData.href, '_blank');
      },//查看留存
      resetchart() {
        this.list1 = {
          name: ["原始数据-新增用户", "对比数据-新增用户"],
          time: [],
          firstData: [],
          secondData: [],
        }
        this.list2 = {
          name: ["原始数据-活跃用户", "对比数据-活跃用户"],
          time: [],
          firstData: [],
          secondData: [],

        }
        this.list3 = {
          name: ["原始数据-展示次数", "对比数据-展示次数"],
          time: [],
          firstData: [],
          secondData: [],
        }
        this.list4 = {
          name: ["原始数据-总流水", "对比数据-总流水"],
          time: [],
          firstData: [],
          secondData: [],
        }
        this.list_banner = {
          name: ["原始数据-横幅", "对比数据-横幅"],
          time: [],
          firstData: [],
          secondData: [],
        }
        this.list_video = {
          name: ["原始数据-视频", "对比数据-视频"],
          time: [],
          firstData: [],
          secondData: [],

        }
        this.list_inline = {
          name: ["原始数据-插屏", "对比数据-插屏"],
          time: [],
          firstData: [],
          secondData: [],
        }
        this.list_splash = {
          name: ["原始数据-开屏", "对比数据-开屏"],
          time: [],
          firstData: [],
          secondData: [],
        }
        this.list_banner_pershow = {
          name: ["原始数据-横幅人均展次", "对比数据-横幅人均展次"],
          time: [],
          firstData: [],
          secondData: [],
        }
        this.list_video_pershow = {
          name: ["原始数据-视频人均展次", "对比数据-视频人均展次"],
          time: [],
          firstData: [],
          secondData: [],

        }
        this.list_inline_pershow = {
          name: ["原始数据-插屏人均展次", "对比数据-插屏人均展次"],
          time: [],
          firstData: [],
          secondData: [],
        }
        this.list_splash_pershow = {
          name: ["原始数据-开屏人均展次", "对比数据-开屏人均展次"],
          time: [],
          firstData: [],
          secondData: [],
        }
      },//重置线性表内数据
      fetchName() {
        let accountName = store.getters && store.getters.name
        let name = {
          username: accountName
        }
        let valid = this.checkPermission(['director']) || this.checkPermission(['admin']) || this.checkPermission(['operatorleader']) || this.checkPermission(['sdksuport'])
        this.listLoading = true
        getProjectList().then(response => {
          let todolist = response.data
          if (valid) {
            this.app_name_list.push({
              project_name: '全部',
              applist: []
            })
            let list = response.data
            this.app_name_list = this.app_name_list.concat(list)
          } else {
            getResourceName(name).then(response => {
              let newlist = []
              let projectlist = response.data
              for (let i = 0; i < todolist.length; i++) {
                for (let j = 0; j < projectlist.length; j++) {
                  if (todolist[i].project_name === projectlist[j]) {
                    newlist.push(todolist[i])
                    break
                  }
                }
              }
              this.app_name_list = newlist
              if (newlist.length>0){
                this.secondary_game=newlist[0]
              }

            });
          }
        }).catch(function (rs) {
          console.log(rs)
          this.listLoading = false
        })
      },//初始化游戏名
      initchannel() {
        getChannel().then(response => {
          this.channel_mark_list = response.data
        })
      }, //初始化渠道标记
      initdate() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        end.setTime(end.getTime() - 3600 * 1000 * 24 );
        //this.original_time.push(start)
        //this.original_time.push(end)

        this.original_time.push(this.formatDate(new Date(start), 'yyyy-MM-dd'))
        this.original_time.push(this.formatDate(new Date(end), 'yyyy-MM-dd'))
        const end1 = new Date();
        const start1 = new Date();
        start1.setTime(start1.getTime() - 3600 * 1000 * 24 * 14);
        end1.setTime(end1.getTime() - 3600 * 1000 * 24 * 8);
        //this.contrast_time.push(start1)
        //this.contrast_time.push(end1)

        this.contrast_time.push(this.formatDate(new Date(start1), 'yyyy-MM-dd'))
        this.contrast_time.push(this.formatDate(new Date(end1), 'yyyy-MM-dd'))
      },//页面渲染初始化日期
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      },//点击panel group时间  已失效
      /**
       * 时间转为秒
       * @param time 时间(00:00:00)
       * @returns {string} 时间戳（单位：秒）
       */
      time_to_sec(time) {
        let s = '';
        let hour = time.split(':')[0];
        let min = time.split(':')[1];
        let sec = time.split(':')[2];
        s = Number(hour*3600) + Number(min*60) + Number(sec);
        return s;
      },
      list_to_average(list){
        if (list.length<1){
          return 0
        }
        let sum=0
        for (let i=0;i<list.length;i++){
          sum+=this.time_to_sec(list[i])
        }
        return sum/list.length

      },
      list_to_average1(list){
        if (list.length<1){
          return 0
        }
        let sum=0
        for (let i=0;i<list.length;i++){
          sum+=list[i]
        }
        return sum/list.length

      },
      getdate(startDate, endDate) {

        const dateList = []
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
      },//获取两个日期内每个日期
      getMonth(startDate, endDate) {
        const dateList = []
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

        let min = dateList
        let newmonth = []
        for (let i = 0; i < min.length; i++) {
          let a = min[i]
          let ele = a.split('-')
          let month = ele[0] + '-' + ele[1]
          if (newmonth.length === 0) {
            newmonth.push(month)
          } else {
            let flag = true
            for (let j = 0; j < newmonth.length; j++) {
              if (month === newmonth[j]) {
                flag = false
              }
            }
            if (flag) {
              newmonth.push(month)
            }
          }
        }
        return newmonth
      },//获取两个月份
      formatDate,
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
      padding: 8px 10px;
    }
  }

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
    height: 140px;
  }

  .line-chart {
    width: 44%;
    margin: 10px;
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
