<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -15px">
      <el-select v-model="projectValue"
                 size="mini"
                 style="width: 200px"
                 filterable
                 @change="paramChange()"
                 clearable
                 placeholder="请选择项目"
                 value-key="project_guid"
                 collapse-tags>
        <el-option
          v-for="item in projectList"
          :key="item.project_guid"
          :label="item.project_name"
          :value="item">
        </el-option>
      </el-select>
      <el-date-picker

        :clearable="false"
        size="mini"
        v-model="timeValue"
        type="daterange"
        range-separator="-"
        @change="paramChange()"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions0">>
      </el-date-picker>
    </div>
    <el-card style="margin: 5px">
      <h4>整体趋势</h4>
        <el-table
          height="300"
          size="mini"
          v-loading="tableLoading"
          :data="generalTableList"
          element-loading-text="Loading"
          fit
          stripe
          highlight-current-row>
          <el-table-column align="center" label="日期" width="" prop="date" sortable>
          </el-table-column>
          <el-table-column align="center" label="单日收入" width="" prop="income" sortable>
          </el-table-column>
          <el-table-column align="center" label="新增用户" width="" prop="dnu" sortable>
          </el-table-column>
          <el-table-column align="center" label="活跃用户" width="" prop="dau" sortable>
          </el-table-column>
          <el-table-column align="center" label="次日留存" width="" prop="r1" sortable :sort-method="sortMethod">
          </el-table-column>
          <el-table-column align="center" label="LT30" width="" prop="lt30" sortable>
          </el-table-column>
          <el-table-column align="center" label="ARPU" width="" prop="arpu" sortable>
          </el-table-column>
          <el-table-column align="center" label="LTV30" width="" prop="ltv30" sortable>
          </el-table-column>
        </el-table>
    </el-card>
    <el-card style="margin: 5px">
      <h4>活跃趋势</h4>
      <el-table
        height="288"
        size="mini"
        v-loading="tableLoading"
        :data="activeTableList"
        element-loading-text="Loading"
        fit
        stripe
        highlight-current-row>
        <el-table-column align="center" label="日期" width="" prop="date">
        </el-table-column>
        <el-table-column align="center" label="新增用户" width="" prop="date">
        </el-table-column>
        <el-table-column align="center" label="活跃用户" width="" prop="date">
        </el-table-column>
        <el-table-column align="center" label="人均启动次数" width="" prop="date">
        </el-table-column>
        <el-table-column align="center" label="单次使用时长" width="" prop="date">
        </el-table-column>
        <el-table-column align="center" label="日均使用时长" width="" prop="date">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card style="margin: 5px">
      <h4>收入趋势</h4>
      <el-table
        height="288"
        size="mini"
        v-loading="tableLoading"
        :data="incomeTableList"
        element-loading-text="Loading"
        fit
        stripe
        highlight-current-row>
        <el-table-column align="center" label="日期" width="" prop="date">
        </el-table-column>
        <el-table-column align="center" label="单日收入" width="" prop="date">
        </el-table-column>
        <el-table-column align="center" label="广点通" width="" prop="date">
        </el-table-column>
        <el-table-column align="center" label="穿山甲" width="" prop="date">
        </el-table-column>
        <el-table-column align="center" label="OPPO广告联盟" width="" prop="date">
        </el-table-column>
        <el-table-column align="center" label="VIVO广告联盟" width="" prop="date">
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  import {
    dataCheck
  } from "@/api/originalData/dataMonitor" ;

  export default {
    props:{
      projectList:{
        type:Array,
        required:true,
        default:[]
      }
    },
    data() {
      return {
        generalTableList:[
          {
            date:'2019-07-02',
            income:72,
            arpu:100,
            dnu:1,
            dau:2,
            r1:'3%',
            lt30:4,
            ltv30:0.5,
          },
          {
            date:'2019-07-01',
            income:626,
            dnu:31,
            dau:32,
            r1:'33%',
            lt30:34,
            ltv30:0.35,
            arpu:1005,
          },
          {
            date:'2019-06-30',
            income:71,
            dnu:6,
            dau:7,
            r1:'8%',
            lt30:9,
            ltv30:0.10,
            arpu:1001,
          },

          {
            date:'2019-06-29',
            income:629,
            dnu:16,
            dau:17,
            r1:'18%',
            lt30:19,
            ltv30:0.20,
            arpu:1003,
          },

          {
            date:'2019-06-28',
            income:630,
            dnu:11,
            dau:12,
            r1:'13%',
            lt30:14,
            ltv30:0.15,
            arpu:1002,
          },
          {
            date:'2019-06-27',
            income:627,
            dnu:26,
            dau:27,
            r1:'28%',
            lt30:29,
            ltv30:0.30,
            arpu:1006,
          },
          {
            date:'2019-06-26',
            income:628,
            dnu:21,
            dau:22,
            r1:'23%',
            lt30:24,
            ltv30:0.25,
            arpu:1004,
          }
          ],
        activeTableList:[
            {
              date:'2019-07-02'
            },
            {
              date:'2019-07-01'
            },
            {
              date:'2019-06-30'
            },
            {
              date:'2019-06-29'
            },
            {
              date:'2019-06-28'
            },
            {
              date:'2019-06-27'
            },
            {
              date:'2019-06-26'
            },
            {
              date:'2019-06-25'
            },
        ],
        incomeTableList:[],
        tableLoading:false,
        projectValue:'',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6 - 24 * 60 * 60 * 1000
          }
        },
        timeValue: []
      }
    },
    created() {
      this.initdate()//初始化日期
    },
    methods: {
      paramChange(){
        let param={
          projectValue:this.projectValue,
          startTime:this.timeValue[0],
          endTime:this.timeValue[1]
        }
        console.log(param)
      },
      sortMethod(a, b) {
        let num1=0
        let num2=0
        try {
          num1=parseInt((a.r1).replace('%',''))
          num2=parseInt((b.r1).replace('%',''))
        }catch (e) {
          return -1;
        }
        return num1-num2;
      },//百分比排序
      initdate() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
        this.timeValue.push(this.formatDate(start, 'yyyy-MM-dd'))
        this.timeValue.push(this.formatDate(end, 'yyyy-MM-dd'))
      },//页面渲染初始化日期
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
      },
      padLeftZero(str) {
        return ('00' + str).substr(str.length);
      },

    }
  }
</script>



