<template>

  <div class="dashboard-editor-container" v-loading.fullscreen.lock="listLoading">
    <div class="top_condition">
      <span style="font-size: 36px;font-family:'Microsoft YaHei UI';color: dimgray">计费数据统计</span>
      <div style="float: right;width: 85%;margin-bottom: 15px">
        <div
          style="font-size: 14px;color: dimgray;font-family: 微软雅黑;
          font-weight: bolder;margin-bottom: -7px;
          text-align: right;float: right;width: 117%">
                  <span style="font-size: 14px;color: dimgray;font-family: 微软雅黑;font-weight: bolder;margin-right: 20px">
             <el-tooltip class="item" effect="light" placement="right" style="size: 50px">
        <div slot="content"
             style="font-size: 14px;font-family:'Microsoft YaHei UI';
                 border-radius:0 80px 0 0/0 60px 0 0;
                 line-height: 24px;
                 color: #8494A5;
                  background-color: white;border: 1px white">
          说明：<br/>
          <span style="font-size: 15px;font-weight: bolder">[按月查询]:</span>根据所选日期的跨越的月份查询<br/>
           <span style="font-size: 15px;font-weight: bolder">[按年查询]:</span>根据所选日期的跨越的年份查询（暂不可用）<br/>
        </div>
        <el-button icon="el-icon-question" style="padding: 0px;border: none;background-color: #F0F2F5">查询方式：</el-button>
            </el-tooltip>
              <el-radio-group v-model="query_way" size="mini" @change="test1">
                <el-radio-button label="年" disabled></el-radio-button>
                <el-radio-button label="月"></el-radio-button>
                <el-radio-button label="日"></el-radio-button>
            </el-radio-group>
          </span>
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
          <el-tooltip class="item" placement="right-end" effect="light"
                      style="font-size: 23px;font-family:'Microsoft YaHei UI';display: inline;float: left;background-color: white">
            <div slot="content"
                 style="font-size: 14px;font-family:'Microsoft YaHei UI';
                 border-radius:0 80px 0 0/0 60px 0 0;
                 line-height: 24px;
                 color: #8494A5;
                  background-color: white;border: 1px white">
              说明：<br/>
              <span style="font-size: 15px;font-weight: bolder">[支付金额]:</span>总支付金额<br/>
              <br/>
              <span style="font-size: 15px;font-weight: bolder">备注：数据会根据右上角的条件随动</span>
              <br/>&nbsp;&nbsp;&nbsp;例如：渠道选择huawei,此处只会展示huawei渠道的各项数据总和
            </div>
            <el-button icon="el-icon-info" style="padding: 0px;border: none">汇总</el-button>

          </el-tooltip>
          <span class="card-panel-icon-wrapper icon-message" style="margin-right: 20px">
              <el-button size="mini" round @click="showchart()"><svg-icon icon-class="change" class-name="card-panel-icon"/>&nbsp;折线图隐藏</el-button>
          </span>
          <span class="card-panel-icon-wrapper icon-message" style="margin-right: 20px">
              <el-button size="mini" round @click="restore1()"><svg-icon icon-class="restore" class-name="card-panel-icon"/>&nbsp;还原</el-button>
          </span>
          订单状态：
          <el-select v-model="secondary_order_status" style="margin-right: 20px" size="mini" @change="test3()" filterable>
            <el-option key="全部" label="全部" value="全部"></el-option>
            <el-option v-for="item in order_status_list" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          支付类型：
          <el-select v-model="secondary_pay_type" style="margin-right: 20px" size="mini" @change="test3()" filterable>
            <el-option key="全部" label="全部" value="全部">
            </el-option>
            <el-option v-for="item in pay_type_list" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          推广渠道：
          <el-select v-model="secondary_marketing_channel" style="margin-bottom: 5px" size="mini" @change="test3()" filterable>
            <el-option key="全部" label="全部" value="全部">
            </el-option>
            <el-option v-for="item in marketing_channel_list" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <br/>
          应用：
          <el-select v-model="secondary_game" style="margin-right: 20px" size="mini" @change="test3()" filterable>
            <el-option key="全部" label="全部" value="全部">
            </el-option>
            <el-option v-for="item in app_name_list" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          渠道：
          <el-select v-model="secondary_channel" style="margin-top: -10px;margin-right: 20px" size="mini" filterable
                     @change="test3()">
            <el-option key="全部" label="全部" value="全部"></el-option>
            <el-option v-for="item in channel_mark_list" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          国家/地区：
          <el-select v-model="secondary_country" size="mini" filterable
                     @change="test3()">
            <el-option key="全部" label="全部" value="全部"/>
            <el-option v-for="item in country_list" :key="item" :label="item" :value="item"/>
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
    <div v-if="chartline" class="line-chart" style="margin-right: 100px;margin-top: 40px">
      <span class="font_cline">支付金额</span>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="list1" :title="1"/>
      </el-row>
    </div>


    <div v-if="chartline"
         style="margin-top: -90px;float: left;width: 95%;margin-left: 30px;margin-bottom: 70px;size: 50px ">
      <span style="font-size: 14px;font-family:'Microsoft YaHei UI';color: #1f2d3d">订单号：</span>
      <el-input size="mini" placeholder="请输入订单号" clearable style="width: 200px" @change="fortest"  v-model="secondary_order_number"></el-input><br/><br/>

      <el-tooltip class="item" effect="light" placement="right" style="size: 50px">
        <div slot="content"
             style="font-size: 14px;font-family:'Microsoft YaHei UI';
                 border-radius:0 80px 0 0/0 60px 0 0;
                 line-height: 24px;
                 color: #8494A5;
                  background-color: white;border: 1px white">
          说明：<br/>
          <span class="ts-title">[下单时间]</span>订单下单的时间<br/>
          <span class="ts-title">[应用名称]</span>订单应用名称<br/>
          <span class="ts-title">[产品名称]</span>订单产品名称<br/>
          <span class="ts-title">[支付金额]</span>订单支付总金额<br/>
          <span class="ts-title">[支付方式]</span>订单支付方式<br/>
          <span class="ts-title">[订单状态]</span>订单状态<br/>
          <span class="ts-title">[推广渠道]</span>订单推广渠道<br/>
          <span class="ts-title">[退款时间]</span>订单退款时间<br/>
          <span class="ts-title">[退款金额]</span>订单退款金额<br/>
          <span class="ts-title">[渠道]</span>订单渠道<br/>
          <span style="font-size: 15px;font-weight: bolder">备注：表格数据会根据右上角的条件随动</span>
          <br/>&nbsp;&nbsp;&nbsp;例如：渠道选择huawei,此处只会展示huawei渠道的各项数据总和
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
          fixed
          prop="order_number"
          width="285px"
          label="订单编号"/>
        <el-table-column
          fixed
          prop="order_time1"
          label="下单时间"/>
        <el-table-column
          prop="app_name"
          label="应用名称"/>
        <el-table-column
          prop="product_name"
          label="产品名称"/>
        <el-table-column
          prop="payment"
          label="支付金额"/>
        <el-table-column
          prop="pay_type"
          label="支付方式"/>
        <el-table-column
          prop="order_status"
          label="订单状态"/>
        <el-table-column
          prop="marketing_channel"
          label="推广渠道"/>
        <el-table-column
          prop="refund_time"
          label="退款时间"/>
        <el-table-column
          prop="refund_amount"
          label="退款金额"/>
        <el-table-column
          prop="channel"
          label="渠道"/>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        :page-size="100"
        :total="total_page"
        style="margin-left: 15px;margin-top: 10px">
      </el-pagination>
    </div>

    <div v-if="!chartline"
         style="margin-top: 50px;float: left;width: 95%;margin-left: 30px;margin-bottom: 70px;size: 50px ">
      <span style="font-size: 14px;font-family:'Microsoft YaHei UI';color: #1f2d3d">订单号：</span>
      <el-input size="mini" placeholder="请输入订单号" clearable style="width: 200px" @change="fortest()" v-model="secondary_order_number"></el-input><br/><br/>
      <el-tooltip class="item" effect="light" placement="right" style="size: 50px">
        <div slot="content"
             style="font-size: 14px;font-family:'Microsoft YaHei UI';
                 border-radius:0 80px 0 0/0 60px 0 0;
                 line-height: 24px;
                 color: #8494A5;
                  background-color: white;border: 1px white">
          说明：<br/>
          <span class="ts-title">[下单时间]</span>订单下单的时间<br/>
          <span class="ts-title">[应用名称]</span>订单应用名称<br/>
          <span class="ts-title">[产品名称]</span>订单产品名称<br/>
          <span class="ts-title">[支付金额]</span>订单支付总金额<br/>
          <span class="ts-title">[支付方式]</span>订单支付方式<br/>
          <span class="ts-title">[订单状态]</span>订单状态<br/>
          <span class="ts-title">[推广渠道]</span>订单推广渠道<br/>
          <span class="ts-title">[退款时间]</span>订单退款时间<br/>
          <span class="ts-title">[退款金额]</span>订单退款金额<br/>
          <span class="ts-title">[渠道]</span>订单渠道<br/>
          <span style="font-size: 15px;font-weight: bolder">备注：表格数据会根据右上角的条件随动</span>
          <br/>&nbsp;&nbsp;&nbsp;例如：渠道选择huawei,此处只会展示huawei渠道的各项数据总和
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
          fixed
          prop="order_number"
          label="订单编号"/>
        <el-table-column
          fixed
          prop="order_time1"
          label="下单时间"/>
        <el-table-column
          prop="app_name"
          label="应用名称"/>
        <el-table-column
          prop="product_name"
          label="产品名称"/>
        <el-table-column
          prop="payment"
          label="支付金额"/>
        <el-table-column
          prop="pay_type"
          label="支付方式"/>
        <el-table-column
          prop="order_status"
          label="订单状态"/>
        <el-table-column
          prop="marketing_channel"
          label="推广渠道"/>
        <el-table-column
          prop="refund_time"
          label="退款时间"/>
        <el-table-column
          prop="refund_amount"
          label="退款金额"/>
        <el-table-column
          prop="channel"
          label="渠道"/>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        :page-size="100"
        :total="total_page"
        style="margin-left: 15px;margin-top: 10px">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import PanelGroup from './pay_components/PanelGroup'
  import LineChart from './pay_components/LineChart'
  import {gettest} from '@/api/lineMarker'
  import {getResourceName, getName, getChannel, getdata} from '@/api/complexChart/pay_line_chart'
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

        secondary_order_number:'',
        query_way:'日',
        total_page: 0,
        chartline: true,
        platform_list: [],
        hid_total_tableData:[],
        total_tableData: [],
        tableData: [],
        listLoading: true,
        original_list: [],
        contrast_list: [],
        statistical_data: {
          //支付
          pay: 1,
          contrast_pay: 2,
          pay_change: 50,
        },
        channel_mark_list: [],

        app_name_list: [],
        secondary_game: '全部',
        secondary_channel: '全部',
        secondary_order_status: '全部',
        secondary_pay_type: '全部',
        secondary_marketing_channel: '全部',
        secondary_country: '全部',
        pay_type_list: [],
        order_status_list: [],
        marketing_channel_list: [],
        original_time: [],
        contrast_time: [],
        country_list: [],
        list1: {
          name: ["原始数据-支付金额", "对比数据-支付金额"],
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
      this.test1()
    },
    methods: {
      fortest(){
        this.total_tableData=[]
        if (this.secondary_order_number===''){
          this.total_tableData=this.hid_total_tableData
          this.total_page = this.total_tableData.length
          this.tableData = this.total_tableData.slice(0, 100)
        }else {
          for (let i=0;i<this.hid_total_tableData.length;i++){
            if (this.hid_total_tableData[i].order_number.search(this.secondary_order_number)!=-1){
              this.total_tableData.push(this.hid_total_tableData[i])
            }
          }
          this.total_page = this.total_tableData.length
          this.tableData = this.total_tableData.slice(0, 100)
        }
      },
      downloadhandler() {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['下单时间', '应用名称', '产品名称', '支付金额',
            '支付方式', '订单状态', '推广渠道', '退款时间',
            '退款金额', '渠道']
          const filterVal = ['order_time', 'app_name', 'product_name', 'payment',
            'pay_type', 'order_status', 'marketing_channel',
            'refund_time', 'refund_amount', 'channel']
          const data = this.formatJson(filterVal, this.total_tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '计费数据'
          })
        })
      },//下载当前表格
      showchart() {
        if (this.chartline === true) {
          this.chartline = false
        } else {
          this.chartline = true
        }

      },//折线图隐藏按钮
      restore1() {
          this.secondary_game = '全部',
          this.secondary_channel = '全部',
          this.secondary_order_status = '全部',
          this.secondary_pay_type = '全部',
          this.secondary_marketing_channel = '全部',
          this.secondary_country = '全部',
          this.test2()
      },//重置按钮
      test1() {
        let tothis = this
        this.listLoading = true
        let listParam
        let listParam1
        if (this.query_way === '日') {
        listParam = {
          start: formatDate(new Date(this.original_time[0]), 'yyyy-MM-dd'),
          end: formatDate(new Date(this.original_time[1]), 'yyyy-MM-dd')
        }
        listParam1 = {
          start: formatDate(new Date(this.contrast_time[0]), 'yyyy-MM-dd'),
          end: formatDate(new Date(this.contrast_time[1]), 'yyyy-MM-dd')
        }
        } else if (this.query_way === '月') {
          listParam = {
            start: formatDate(new Date(this.original_time[0]), 'yyyy-MM'),
            end: formatDate(new Date(this.original_time[1]), 'yyyy-MM')
          }
          listParam1 = {
            start: formatDate(new Date(this.contrast_time[0]), 'yyyy-MM'),
            end: formatDate(new Date(this.contrast_time[1]), 'yyyy-MM')
          }
        } else {
          listParam = {
            start: formatDate(new Date(this.original_time[0]), 'yyyy'),
            end: formatDate(new Date(this.original_time[1]), 'yyyy')
          }
          listParam1 = {
            start: formatDate(new Date(this.contrast_time[0]), 'yyyy'),
            end: formatDate(new Date(this.contrast_time[1]), 'yyyy')
          }
        }
        getdata(listParam).then(response => {
          this.original_list = response.data
          getdata(listParam1).then(response => {
            this.contrast_list = response.data
            this.initSelect()
            this.test2()
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
      test2() {
        this.resetchart()
        this.total_tableData = []
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
        let original_sumpay = 0
        let contrast_sumpay = 0
        for (let j = 0; j < times.length; j++) {
          //原始数据
          let original_pay = 0
          for (let i = 0; i < this.original_list.length; i++) {
            let orderstatus = false
            if (this.secondary_order_status === '全部' || this.secondary_order_status === this.original_list[i].order_status) {
              orderstatus = true
            }
            let paytype = false
            if (this.secondary_pay_type === '全部' || this.secondary_pay_type === this.original_list[i].pay_type) {
              paytype = true
            }
            let marketingchannel = false
            if (this.secondary_marketing_channel === '全部' || this.secondary_marketing_channel === this.original_list[i].marketing_channel) {
              marketingchannel = true
            }
            let appname = false
            if (this.secondary_game === '全部' || this.secondary_game === this.original_list[i].app_name) {
              appname = true
            }
            let channel = false
            if (this.secondary_channel === '全部' || this.secondary_channel === this.original_list[i].channel) {
              channel = true
            }
            let country = false
            if (this.secondary_country === '全部' || this.secondary_country === this.original_list[i].country) {
              country = true
            }
            let time11
            if (this.query_way === '日') {
              time11=formatDate(new Date(this.original_list[i].order_time), 'yyyy-MM-dd')
            } else if (this.query_way === '月') {
              time11=formatDate(new Date(this.original_list[i].order_time), 'yyyy-MM')
            }

            if (times[j] === time11 && orderstatus && paytype && marketingchannel && appname && channel && country) {
              original_pay = original_pay + this.original_list[i].payment
              this.total_tableData.push(this.original_list[i])
            }
          }
          original_sumpay = original_sumpay + original_pay
          this.list1.firstData.push(original_pay)
          //对比数据
          let contrast_pay = 0
          for (let i = 0; i < this.contrast_list.length; i++) {
            let orderstatus = false
            if (this.secondary_order_status === '全部' || this.secondary_order_status === this.original_list[i].order_status) {
              orderstatus = true
            }
            let paytype = false
            if (this.secondary_pay_type === '全部' || this.secondary_pay_type === this.original_list[i].pay_type) {
              paytype = true
            }
            let marketingchannel = false
            if (this.secondary_marketing_channel === '全部' || this.secondary_marketing_channel === this.original_list[i].marketing_channel) {
              marketingchannel = true
            }
            let appname = false
            if (this.secondary_game === '全部' || this.secondary_game === this.original_list[i].app_name) {
              appname = true
            }
            let channel = false
            if (this.secondary_channel === '全部' || this.secondary_channel === this.original_list[i].channel) {
              channel = true
            }
            let country = false
            if (this.secondary_country === '全部' || this.secondary_country === this.original_list[i].country) {
              country = true
            }
            let time11
            if (this.query_way === '日') {
              time11=formatDate(new Date(this.contrast_list[i].order_time), 'yyyy-MM-dd')
            } else if (this.query_way === '月') {
              time11=formatDate(new Date(this.contrast_list[i].order_time), 'yyyy-MM')
            }
            if (times1[j] === time11 && orderstatus && paytype && marketingchannel && appname && channel && country) {
              contrast_pay = contrast_pay + this.contrast_list[i].payment
            }
          }
          contrast_sumpay = contrast_sumpay + contrast_pay
          this.list1.secondData.push(contrast_pay)
        }
        this.statistical_data.pay = original_sumpay
        this.statistical_data.contrast_pay = contrast_sumpay
        this.statistical_data.pay_change = ((original_sumpay - contrast_sumpay) / contrast_sumpay * 100).toFixed(2)

        /**
         newuser: 1,
         contrast_newuser: 2,
         newuser_change: 50,
         activeuser: 3,
         contrast_activeuser: 4,
         activeuser_change: 60,
         * */

        //this.total_tableData = this.original_list
        this.hid_total_tableData= this.total_tableData
        this.tableData = this.total_tableData.slice(0, 100)
        this.total_page = this.total_tableData.length
        this.listLoading = false

      },//数据整合
      handleCurrentChange(val) {
        this.tableData = this.total_tableData.slice((val - 1) * 100, val * 100)
      },//分页显示表格内容
      test3() {
        this.listLoading = true
        this.test2()
      },//根据游戏渠道变动
      resetchart() {
        this.list1 = {
          name: ["原始数据-支付金额", "对比数据-支付金额"],
          time: [],
          firstData: [],
          secondData: [],
        }
      },//重置线性表内数据
      initSelect() {
        let orderstatuslist = []
        let paytypelist = []
        let marketingchannellist = []
        let appnamelist = []
        let channelmarklist = []
        let countrylist = []
        for (let i = 0; i < this.original_list.length; i++) {
          orderstatuslist.push(this.original_list[i].order_status)
          paytypelist.push(this.original_list[i].pay_type)
          marketingchannellist.push(this.original_list[i].marketing_channel)
          appnamelist.push(this.original_list[i].app_name)
          channelmarklist.push(this.original_list[i].channel)
          countrylist.push(this.original_list[i].country)
        }
        const list1 = orderstatuslist => [...new Set(orderstatuslist)]
        const list2 = paytypelist => [...new Set(paytypelist)]
        const list3 = marketingchannellist => [...new Set(marketingchannellist)]
        const list4 = appnamelist => [...new Set(appnamelist)]
        const list5 = channelmarklist => [...new Set(channelmarklist)]
        const list6 = countrylist => [...new Set(countrylist)]
        this.order_status_list = list1(orderstatuslist)
        this.pay_type_list = list2(paytypelist)
        this.marketing_channel_list = list3(marketingchannellist)
        this.app_name_list = list4(appnamelist)
        this.channel_mark_list = list5(channelmarklist)
        this.country_list = list6(countrylist)
      }, //初始化选择器选项
      initdate() {
        const end = new Date();
        const start = new Date();
        // start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
        // end.setTime(end.getTime());
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 15);
        this.original_time.push(start)
        this.original_time.push(end)
        const end1 = new Date();
        const start1 = new Date();
        // start1.setTime(start1.getTime() - 3600 * 1000 * 24 * 13);
        // end1.setTime(end1.getTime() - 3600 * 1000 * 24 * 7);
        start1.setTime(start1.getTime() - 3600 * 1000 * 24 * 45);
        end1.setTime(end1.getTime() - 3600 * 1000 * 24 * 30);
        this.contrast_time.push(start1)
        this.contrast_time.push(end1)
      },//页面渲染初始化日期
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      },//点击panel group时间  已失效
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
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ts-title{
    font-weight: bolder;
    font-size: 15px;
  }
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
    width: 100%;
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
