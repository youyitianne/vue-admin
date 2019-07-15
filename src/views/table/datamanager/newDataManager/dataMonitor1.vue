<template>
  <div class="app-container">

    <div class="filter-container" style="margin: 15px;margin-top: -15px">
      <el-date-picker
        :clearable="false"
        size="mini"
        v-model="timeValue"
        type="daterange"
        range-separator="-"
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
        v-loading="tableLoading"
        :data="fanqieTableList"
        element-loading-text="Loading"
        fit
        stripe
        highlight-current-row>
        <el-table-column align="center" label="日期" width="110" prop="date">
          <template slot-scope="scope">
            <span>{{scope.row.date}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="友盟（内部）" prop="umeng_inside" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.umeng_inside===true"><svg-icon icon-class="tick"/></span>
            <span v-if="scope.row.umeng_inside===false"><svg-icon icon-class="fork"/></span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="友盟（CP）" prop="umeng_cp" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.umeng_cp===true"><svg-icon icon-class="tick"/></span>
            <span v-if="scope.row.umeng_cp===false"><svg-icon icon-class="fork"/></span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="广点通" prop="gdt" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.gdt===true"><svg-icon icon-class="tick"/></span>
            <span v-if="scope.row.gdt===false"><svg-icon icon-class="fork"/></span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="穿山甲" prop="csj" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.csj===true"><svg-icon icon-class="tick"/></span>
            <span v-if="scope.row.csj===false"><svg-icon icon-class="fork"/></span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="OPPO广告联盟" prop="oppo" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.oppo===true"><svg-icon icon-class="tick"/></span>
            <span v-if="scope.row.oppo===false"><svg-icon icon-class="fork"/></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="VIVO广告联盟" prop="vivo" width="">
          <template slot-scope="scope">
            <span v-if="scope.row.vivo===true"><svg-icon icon-class="tick"/></span>
            <span v-if="scope.row.vivo===false"><svg-icon icon-class="fork"/></span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card style="margin: 5px">
      <h4>凯顺账号</h4>
      <el-table
        height="288"
        v-loading="tableLoading"
        :data="kaishunTableList"
        element-loading-text="Loading"
        stripe
        fit
        size="mini"
        highlight-current-row>
        <el-table-column align="center" label="日期" width="110" prop="date">
          <template slot-scope="scope">
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="OPPO广告联盟" width="" prop="oppo">
          <template slot-scope="scope">
            <span v-if="scope.row.oppo===true"><svg-icon icon-class="tick"/></span>
            <span v-if="scope.row.oppo===false"><svg-icon icon-class="fork"/></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="VIVO广告联盟" width="" prop="vivo">
          <template slot-scope="scope">
            <span v-if="scope.row.vivo===true"><svg-icon icon-class="tick"/></span>
            <span v-if="scope.row.vivo===false"><svg-icon icon-class="fork"/></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="" width="" prop="duration">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column align="center" label="" width="" prop="duration">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column align="center" label="" width="" prop="duration">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column align="center" label="" width="" prop="duration">
          <template slot-scope="scope">
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card style="margin: 5px">
      <h4>红树林账号</h4>
      <el-table
        height="288"
        size="mini"
        v-loading="tableLoading"
        :data="hongshulinTableList"
        element-loading-text="Loading"
        stripe
        fit
        highlight-current-row>
        <el-table-column align="center" label="日期" width="110" prop="date">
          <template slot-scope="scope">
            <span>{{ scope.row.date }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="OPPO广告联盟" width="" prop="oppo">
          <template slot-scope="scope">
            <span v-if="scope.row.oppo===true"><svg-icon icon-class="tick"/></span>
            <span v-if="scope.row.oppo===false"><svg-icon icon-class="fork"/></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="VIVO广告联盟" width="" prop="vivo">
          <template slot-scope="scope">
            <span v-if="scope.row.vivo===true"><svg-icon icon-class="tick"/></span>
            <span v-if="scope.row.vivo===false"><svg-icon icon-class="fork"/></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="" width="" prop="duration">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column align="center" label="" width="" prop="duration">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column align="center" label="" width="" prop="duration">
          <template slot-scope="scope">
          </template>
        </el-table-column>
        <el-table-column align="center" label="" width="" prop="duration">
          <template slot-scope="scope">
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {
    getProjectList,
    getProjectVersion,
    getUserData
  } from "@/api/originalData/userData" ;

  export default {
    data() {
      return {
        tableLoading: false,
        kaishunTableList: [],
        hongshulinTableList: [],
        fanqieTableList: [{
          date: '2019-07-01',
          umeng_inside: true,
          umeng_cp: true,
          gdt: true,
          csj: false,
          oppo: false,
          vivo: false
        }, {
          date: '2019-06-30',
          umeng_inside: true,
          umeng_cp: true,
          gdt: true,
          csj: false,
          oppo: false,
          vivo: false
        }, {
          date: '2019-06-29',
          umeng_inside: true,
          umeng_cp: true,
          gdt: true,
          csj: false,
          oppo: false,
          vivo: false
        }, {
          date: '2019-06-28',
          umeng_inside: true,
          umeng_cp: true,
          gdt: true,
          csj: false,
          oppo: false,
          vivo: false
        }, {
          date: '2019-06-27',
          umeng_inside: true,
          umeng_cp: true,
          gdt: true,
          csj: false,
          oppo: false,
          vivo: false
        }, {
          date: '2019-06-26',
          umeng_inside: true,
          umeng_cp: true,
          gdt: true,
          csj: false,
          oppo: false,
          vivo: false
        }, {
          date: '2019-06-25',
          umeng_inside: true,
          umeng_cp: true,
          gdt: true,
          csj: false,
          oppo: false,
          vivo: false
        }],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6 - 24 * 60 * 60 * 1000
          }
        },
        timeValue: [],
        projectList: [],
      }
    },
    mounted() {
      this.test()
      this.initdate()//初始化日期
      //  this.pageChange(1)
    },
    methods: {
      test() {
        this.kaishunTableList = this.fanqieTableList
      },
      pageChange() {
        let tothis = this
        let listParam = {
          startTime: this.timeValue[0],
          endTime: this.timeValue[1]
        }
        console.log('搜索条件', listParam)

        this.tableLoading = true
        this.tableList = []
        getUserData(listParam).then(response => {
          console.log(response)
          this.tableList = response.data.data
          this.tableLoading = false
        }).catch(error => {
          this.tableLoading = false
          console.error('友盟数据获取失败返回', error)
          tothis.$notify({
            title: '友盟数据获取失败',
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
