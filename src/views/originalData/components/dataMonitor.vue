<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -15px">
      <el-date-picker
        :clearable="false"
        size="mini"
        v-model="timeValue"
        type="daterange"
        range-separator="-"
        @change="DataCheck()"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions0">>
      </el-date-picker>
    </div>
    <el-card style="margin: 5px">
      <h4>番茄账号</h4>
      <el-table
        height="288"
        size="mini"
        element-loading-text="Loading"
        stripe
        class="tb-edit" highlight-current-row :data="fanqieTableData" style="width: 100%">
        <template v-for="(col ,index) in fanqieCols">
          <el-table-column :prop="col.prop" :label="col.label" class="table_colum">
            <template slot-scope="scope">
              <span v-if="scope.row[col.prop]===true"><svg-icon icon-class="tick"/></span>
              <span v-if="scope.row[col.prop]===false"><svg-icon icon-class="fork"/></span>
              <span v-if="scope.row[col.prop]!==false&&scope.row[col.prop]!==true">{{scope.row[col.prop]}}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-card>
    <el-card style="margin: 5px">
      <h4>凯顺账号</h4>
      <el-table
        height="288"
        size="mini"
        element-loading-text="Loading"
        stripe
        class="tb-edit" highlight-current-row :data="kaishunTableData" style="width: 100%">
        <template v-for="(col ,index) in kaishunCols">
          <el-table-column :prop="col.prop" :label="col.label" class="table_colum">
            <template slot-scope="scope">
              <span v-if="scope.row[col.prop]===true"><svg-icon icon-class="tick"/></span>
              <span v-if="scope.row[col.prop]===false"><svg-icon icon-class="fork"/></span>
              <span v-if="scope.row[col.prop]!==false&&scope.row[col.prop]!==true">{{scope.row[col.prop]}}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-card>
    <el-card style="margin: 5px">
      <h4>红树林账号</h4>
      <el-table
        height="288"
        size="mini"
        element-loading-text="Loading"
        stripe
        class="tb-edit" highlight-current-row :data="hongshulinTableData" style="width: 100%">
        <template v-for="(col ,index) in hongshulinCols">
          <el-table-column :prop="col.prop" :label="col.label" class="table_colum">
            <template slot-scope="scope">
              <span v-if="scope.row[col.prop]===true"><svg-icon icon-class="tick"/></span>
              <span v-if="scope.row[col.prop]===false"><svg-icon icon-class="fork"/></span>
              <span v-if="scope.row[col.prop]!==false&&scope.row[col.prop]!==true">{{scope.row[col.prop]}}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  import {
    dataCheck
  } from "@/api/originalData/dataMonitor" ;

  export default {
    data() {
      return {
        fanqieCols: [],
        fanqieTableData: [],
        kaishunCols: [],
        kaishunTableData: [],
        hongshulinCols: [],
        hongshulinTableData: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6 - 24 * 60 * 60 * 1000
          }
        },
        timeValue: [],
        projectList: [],
      }
    },
    created() {
      this.initdate()//初始化日期
      this.DataCheck()//数据监测初始化
    },
    methods: {
      DataCheck() {
        let tothis = this
        let fanqieParam = {
          startTime: this.timeValue[0],
          endTime: this.timeValue[1],
          name:'fanqie'
        }
        this.tableList = []
        dataCheck(fanqieParam).then(response => {
          console.log(response)
          this.fanqieCols=response.data.cols
          this.fanqieTableData=response.data.tableData
        }).catch(error => {
          console.error('获取番茄检查数据失败', error)
          tothis.$notify({
            title: '获取番茄检查数据失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
        let kaishunParam = {
          startTime: this.timeValue[0],
          endTime: this.timeValue[1],
          name:'kaishun'
        }
        this.tableList = []
        dataCheck(kaishunParam).then(response => {
          console.log(response)
          this.kaishunCols=response.data.cols
          this.kaishunTableData=response.data.tableData
        }).catch(error => {
          console.error('获取凯顺检查数据失败', error)
          tothis.$notify({
            title: '获取凯顺检查数据失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
        let hongshulinParam = {
          startTime: this.timeValue[0],
          endTime: this.timeValue[1],
          name:'hongshulin'
        }
        this.tableList = []
        dataCheck(hongshulinParam).then(response => {
          console.log(response)
          this.hongshulinCols=response.data.cols
          this.hongshulinTableData=response.data.tableData
        }).catch(error => {
          console.error('获取红树林检查数据失败', error)
          tothis.$notify({
            title: '获取红树林检查数据失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },
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



