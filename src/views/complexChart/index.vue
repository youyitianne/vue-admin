<template>

  <div class="dashboard-editor-container" v-loading.fullscreen.lock="listLoading">
    <div class="top_condition">
      <span style="font-size: 36px;font-family:'Microsoft YaHei UI';color: dimgray">数据统计</span>
      <div style="float: right;width: 85%;margin-bottom: 15px">
        <div
          style="font-size: 14px;color: dimgray;font-family: 微软雅黑;
          font-weight: bolder;margin-bottom: -7px;
          text-align: right;float: right;width: 117%">
          <span style="font-size: 14px;color: dimgray;font-family: 微软雅黑;font-weight: bolder">原始数据：</span>
          <el-date-picker
            @change="test1"
            size="mini"
            v-model="original_time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            style="margin-top: 5px;margin-right: 0px">
          </el-date-picker>
          <br>
          <span style="font-size: 14px;color: dimgray;font-family: 微软雅黑;font-weight: bolder"> 对比数据：</span>
          <el-date-picker
            @change="test1"
            size="mini"
            v-model="contrast_time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="margin-top: 5px;margin-right: 0px;margin-bottom: 5px">
          </el-date-picker>
          <br/>
          <el-tooltip class="item" effect="dark" :content="total_content" placement="right-end"
                      style="font-size: 23px;font-family:'Microsoft YaHei UI';display: inline;float: left">
            <el-button  icon="el-icon-info" circle style="padding: 0px;border: none;background-color:#F0F2F5">汇总</el-button>
          </el-tooltip>

          游戏：
          <el-select v-model="secondary_game" style="margin-right: 40px" size="mini" @change="test3()">
            <el-option key="全部" label="全部" value="全部">
            </el-option>
            <el-option v-for="item in app_name_list" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          渠道：
          <el-select v-model="secondary_channel" style="margin-top: -10px" size="mini" @change="test3()">
            <el-option key="全部" label="全部" value="全部">
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
    <div class="line-chart" style="margin-right: 100px;margin-top: -40px">
      <span class="font_cline">横幅展次</span>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="list_banner" :title="1"/>
      </el-row>
    </div>
    <div class="line-chart" style="margin-top: -40px">
      <span class="font_cline">视频展次</span>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="list_video"/>
      </el-row>
    </div>
    <div class="line-chart" style="margin-right: 100px;margin-top: -100px">
      <span class="font_cline">插屏展次</span>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="list_inline"/>
      </el-row>
    </div>
    <div class="line-chart" style="margin-top: -100px">
      <span class="font_cline">开屏展次</span>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="list_splash"/>
      </el-row>
    </div>
    <div
      style="margin-top: -90px;float: left;width: 95%;margin-left: 30px;margin-bottom: 70px;size: 50px ">
      <el-tooltip class="item" effect="dark" :content="table_content" placement="right" style="size: 50px">
        <el-button  icon="el-icon-question" style="padding: 0px;border: none;background-color: #FFFF">详情</el-button>
      </el-tooltip>
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column
          prop="date"
          label="日期">
        </el-table-column>
        <el-table-column
          prop="dau"
          label="DAU">
        </el-table-column>
        <el-table-column
          prop="mau"
          label="MAU">
        </el-table-column>
        <el-table-column
          prop="earned"
          label="流水">
        </el-table-column>
        <el-table-column
          prop="dauarpu"
          label="DAUARPU">
        </el-table-column>
        <el-table-column
          prop="dnu"
          label="DNU">
        </el-table-column>
        <el-table-column
          prop="mnu"
          label="MNU">
        </el-table-column>
        <el-table-column
          prop="showtime"
          label="总展次">
        </el-table-column>
        <el-table-column
          prop="per_showtime"
          label="人均展次">
        </el-table-column>
        <el-table-column
          prop="banner"
          label="横幅">
        </el-table-column>
        <el-table-column
          prop="video"
          label="视频">
        </el-table-column>
        <el-table-column
          prop="splash"
          label="开屏">
        </el-table-column>
        <el-table-column
          prop="inline"
          label="插屏">
        </el-table-column>
      </el-table>
    </div>
  </div>



</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  import {gettest} from '@/api/lineMarker'
  import {getResourceName, getName, getChannel, getappdata} from '@/api/complexChart/index'
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
        tableData:[],
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
        secondary_channel: '全部',
        app_name_list: [],
        secondary_game: '全部',
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
        list4: {
          name: ["原始数据-总流水", "对比数据-总流水"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list_banner: {
          name: ["原始数据-横幅", "对比数据-横幅"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list_video: {
          name: ["原始数据-视频", "对比数据-视频"],
          time: [],
          firstData: [],
          secondData: [],

        },
        list_inline: {
          name: ["原始数据-插屏", "对比数据-插屏"],
          time: [],
          firstData: [],
          secondData: [],
        },
        list_splash: {
          name: ["原始数据-开屏", "对比数据-开屏"],
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
        total_content:'total_contenttotal_content',
        table_content:'conten1111111111111111111t',
      }
    },
    mounted() {
      this.initdate()
      this.fetchName()
      this.initchannel()
      this.test1()
    },
    methods: {
      test1() {
        this.listLoading = true
        let listParam = {
          start: formatDate(new Date(this.original_time[0]), 'yyyy-MM-dd'),
          end: formatDate(new Date(this.original_time[1]), 'yyyy-MM-dd')
        }
        let listParam1 = {
          start: formatDate(new Date(this.contrast_time[0]), 'yyyy-MM-dd'),
          end: formatDate(new Date(this.contrast_time[1]), 'yyyy-MM-dd')
        }
        getappdata(listParam).then(response => {
          this.original_list = response.data
          this.original_list_app = response.data1
          getappdata(listParam1).then(response => {
            this.contrast_list = response.data
            this.contrast_list_app = response.data1
            this.test2()
            this.listLoading=false
          }).catch(function (rs) {
            console.error(rs)
            this.listLoading=false
          })
        }).catch(function (rs) {
          this.listLoading=false
          console.error(rs)
        })
        this.listLoading=false  //测试
      },//根据时间查找数据
      test2() {
        this.resetchart()
        let times = this.getdate(new Date(this.original_time[0]), new Date(this.original_time[1]))
        let times1 = this.getdate(new Date(this.contrast_time[0]), new Date(this.contrast_time[1]))
        //线性表x轴坐标
        this.list1.time = times
        this.list2.time = times
        this.list3.time = times
        this.list4.time = times
        this.list_banner.time = times
        this.list_video.time = times
        this.list_inline.time = times
        this.list_splash.time = times
        let original_sumdau = 0
        let original_sumdnu = 0
        let contrast_sumdau = 0
        let contrast_sumdnu = 0
        for (let j = 0; j < times.length; j++) {
          //原始数据
          let original_dau = 0
          let original_dnu = 0
          for (let i = 0; i < this.original_list.length; i++) {
            let channel = false
            if (this.secondary_channel === '全部' || this.secondary_channel === this.original_list[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game === '全部' || this.secondary_game === this.original_list[i].app_name) {
              game = true
            }
            if (times[j] === this.original_list[i].date && game && channel) {
              original_dau = original_dau + this.original_list[i].dau
              original_dnu = original_dnu + this.original_list[i].dnu
            }
          }
          original_sumdau = original_sumdau + original_dau
          original_sumdnu = original_sumdnu + original_dnu
          this.list1.firstData.push(original_dnu)
          this.list2.firstData.push(original_dau)

          //对比数据
          let contrast_dau = 0
          let contrast_dnu = 0

          for (let i = 0; i < this.contrast_list.length; i++) {
            let channel = false
            if (this.secondary_channel === '全部' || this.secondary_channel === this.contrast_list[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game === '全部' || this.secondary_game === this.contrast_list[i].app_name) {
              game = true
            }
            if (times1[j] === this.contrast_list[i].date && game && channel) {
              contrast_dau = contrast_dau + this.contrast_list[i].dau
              contrast_dnu = contrast_dnu + this.contrast_list[i].dnu
            }
          }
          contrast_sumdau = contrast_sumdau + contrast_dau
          contrast_sumdnu = contrast_sumdnu + contrast_dnu
          this.list1.secondData.push(contrast_dnu)
          this.list2.secondData.push(contrast_dau)
        }
        this.statistical_data.newuser = original_sumdnu
        this.statistical_data.contrast_newuser = contrast_sumdnu
        this.statistical_data.newuser_change = ((original_sumdnu - contrast_sumdnu) / original_sumdnu * 100).toFixed(2)
        this.statistical_data.activeuser = original_sumdau
        this.statistical_data.contrast_activeuser = contrast_sumdau
        this.statistical_data.activeuser_change = ((original_sumdau - contrast_sumdau) / original_sumdau * 100).toFixed(2)
        /**
         newuser: 1,
         contrast_newuser: 2,
         newuser_change: 50,
         activeuser: 3,
         contrast_activeuser: 4,
         activeuser_change: 60,
         * */
        let original_sumshowtimes = 0
        let original_sumearned = 0
        let contrast_sumshowtimes = 0
        let contrast_sumearned = 0
        for (let j = 0; j < times.length; j++) {
          //原始数据
          let orginal_showtimes = 0
          let orginal_earned = 0
          for (let i = 0; i < this.original_list_app.length; i++) {
            let channel = false
            if (this.secondary_channel === '全部' || this.secondary_channel === this.original_list_app[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game === '全部' || this.secondary_game === this.original_list_app[i].app_name) {
              game = true
            }
            if (times[j] === this.original_list_app[i].date && game && channel) {
              orginal_showtimes = orginal_showtimes + this.original_list_app[i].impression
              orginal_earned = orginal_earned + this.original_list_app[i].earned
            }
          }
          original_sumshowtimes = original_sumshowtimes + orginal_showtimes
          original_sumearned = original_sumearned + orginal_earned
          this.list3.firstData.push(orginal_showtimes)
          this.list4.firstData.push(parseInt(orginal_earned))

          //对比数据

          let contrast_showtimes = 0
          let contrast_earned = 0
          for (let i = 0; i < this.contrast_list_app.length; i++) {
            let channel = false
            if (this.secondary_channel === '全部' || this.secondary_channel === this.contrast_list_app[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game === '全部' || this.secondary_game === this.contrast_list_app[i].app_name) {
              game = true
            }
            if (times1[j] === this.contrast_list_app[i].date && game && channel) {
              contrast_showtimes = contrast_showtimes + this.contrast_list_app[i].impression
              contrast_earned = contrast_earned + this.contrast_list_app[i].earned
            }
          }
          contrast_sumshowtimes = contrast_sumshowtimes + contrast_showtimes
          contrast_sumearned = contrast_sumearned + contrast_earned
          this.list3.secondData.push(contrast_showtimes)
          this.list4.secondData.push(parseInt(contrast_earned))
        }
        this.statistical_data.showtimes = original_sumshowtimes
        this.statistical_data.contrast_showtimes = contrast_sumshowtimes
        this.statistical_data.showtimes_change = ((original_sumshowtimes - contrast_sumshowtimes) / original_sumshowtimes * 100).toFixed(2)
        this.statistical_data.earned = parseInt(original_sumearned)
        this.statistical_data.contrast_earned = parseInt(contrast_sumearned)
        this.statistical_data.earned_change = ((original_sumearned - contrast_sumearned) / original_sumearned * 100).toFixed(2)
        /**
         showtimes: 5,
         contrast_showtimes: 6,
         showtimes_change: -50,
         earned: 7,
         contrast_earned: 8,
         earned_change: -90,
         */
          //各类型
        let original_sumbanner = 0
        let original_sumvideo = 0
        let original_suminline = 0
        let original_sumsplash = 0
        let contrast_sumbanner = 0
        let contrast_sumvideo = 0
        let contrast_suminline = 0
        let contrast_sumsplash = 0
        for (let j = 0; j < times.length; j++) {
          //原始数据
          let orginal_banner = 0
          let orginal_video = 0
          let orginal_inline = 0
          let orginal_splash = 0
          for (let i = 0; i < this.original_list_app.length; i++) {
            let channel = false
            if (this.secondary_channel === '全部' || this.secondary_channel === this.original_list_app[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game === '全部' || this.secondary_game === this.original_list_app[i].app_name) {
              game = true
            }
            if (times[j] === this.original_list_app[i].date && game && channel) {
              switch (this.original_list_app[i].advertising_type) {
                case '横幅':
                  orginal_banner = orginal_banner + this.original_list_app[i].impression
                  break
                case '视频':
                  orginal_video = orginal_video + this.original_list_app[i].impression
                  break
                case '插屏':
                  orginal_inline = orginal_inline + this.original_list_app[i].impression
                  break
                case '开屏':
                  orginal_splash = orginal_splash + this.original_list_app[i].impression
                  break
                default:
                  break
              }
            }
          }
          original_sumbanner = original_sumbanner + orginal_banner
          original_sumvideo = original_sumvideo + orginal_video
          original_suminline = original_suminline + orginal_inline
          original_sumsplash = original_sumsplash + orginal_splash
          this.list_banner.firstData.push(orginal_banner)
          this.list_video.firstData.push(orginal_video)
          this.list_inline.firstData.push(orginal_inline)
          this.list_splash.firstData.push(orginal_splash)

          //对比数据
          let contrast_banner = 0
          let contrast_video = 0
          let contrast_inline = 0
          let contrast_splash = 0
          for (let i = 0; i < this.contrast_list_app.length; i++) {

            let channel = false
            if (this.secondary_channel === '全部' || this.secondary_channel === this.contrast_list_app[i].channel) {
              channel = true
            }
            let game = false
            if (this.secondary_game === '全部' || this.secondary_game === this.contrast_list_app[i].app_name) {
              game = true
            }
            if (times1[j] === this.contrast_list_app[i].date && game && channel) {
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
        }
        this.statistical_data.banner = original_sumbanner
        this.statistical_data.contrast_banner = contrast_sumbanner
        this.statistical_data.banner_change = ((original_sumbanner - contrast_sumbanner) / original_sumbanner * 100).toFixed(2)
        this.statistical_data.video = original_sumvideo
        this.statistical_data.contrast_video = contrast_sumvideo
        this.statistical_data.video_change = ((original_sumvideo - contrast_sumvideo) / original_sumvideo * 100).toFixed(2)
        this.statistical_data.inline = original_suminline
        this.statistical_data.contrast_inline = contrast_suminline
        this.statistical_data.inline_change = ((original_suminline - contrast_suminline) / original_suminline * 100).toFixed(2)
        this.statistical_data.splash = original_sumsplash
        this.statistical_data.contrast_splash = contrast_sumsplash
        this.statistical_data.splash_change = ((original_sumsplash - contrast_sumsplash) / original_sumsplash * 100).toFixed(2)
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

        this.tableData=[]
        for(let i=0;i<times.length;i++){
          let one={
            date:times[i],
            dau:this.list2.firstData[i],
            earned:this.list4.firstData[i],
            dauarpu:(this.list4.firstData[i]/this.list2.firstData[i]).toFixed(4),
            dnu:this.list2.firstData[i],
            per_showtime:(this.list3.firstData[i]/this.list2.firstData[i]).toFixed(4),
            showtime:this.list3.firstData[i],
            banner:this.list_banner.firstData[i],
            video:this.list_banner.firstData[i],
            splash:this.list_banner.firstData[i],
            inline:this.list_banner.firstData[i]
          }
          this.tableData.push(one)
        }

        this.listLoading = false

      },//数据整合
      test3() {
        this.listLoading = true
        this.test2()
      },//根据游戏渠道变动
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
      },//充值线性表内数据
      fetchName() {
        if (!checkPermission(['admin', 'leader', 'operator'])) {
          let data = {
            username: this.name
          }
          let tothis = this
          getResourceName(data).then(response => {
            this.app_name_list = response.data
          }).catch(function (rs) {
            console.error(rs)
          })
        } else {
          let tothis = this
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
      initdate() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
        end.setTime(end.getTime());
        this.original_time.push(start)
        this.original_time.push(end)
        const end1 = new Date();
        const start1 = new Date();
        start1.setTime(start1.getTime() - 3600 * 1000 * 24 * 13);
        end1.setTime(end1.getTime() - 3600 * 1000 * 24 * 7);
        this.contrast_time.push(start1)
        this.contrast_time.push(end1)
      },//页面渲染初始化日期
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      },//点击panel group时间  已失效
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
      formatDate,
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
    height: 100px;
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
