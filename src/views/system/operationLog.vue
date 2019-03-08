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
      <el-button type="primary" @click="queryHandler" style="margin-left: 15px" v-loading="buttonLoading">查询</el-button>
      <el-input class="data_filter" v-model="queryData.account_input" placeholder="账号筛选" style="width: 200px"
                clearable></el-input>
      <el-input class="data_filter" v-model="queryData.module_input" placeholder="模块筛选" style="width: 200px"
                clearable></el-input>
      <el-input class="data_filter" v-model="queryData.ip_input" placeholder="ip筛选" style="width: 200px"
                clearable></el-input>
      <el-input class="data_filter" v-model="queryData.oeprate_input" placeholder="操作筛选" style="width: 200px"
                clearable></el-input>
      <el-button type="primary" @click="filterHandler" style="margin-left: 15px" v-loading="buttonLoading">筛选</el-button>
      <el-table
        v-loading="tableLoading"
        style="margin-top: 10px"
        height="750"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        stripe
        highlight-current-row>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope" prop="id">
            {{ ++scope.$index }}
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" prop="date">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="帐号" align="center" prop="date">
          <template slot-scope="scope">
            <span>{{ scope.row.accout }}</span>
          </template>
        </el-table-column>
        <el-table-column label="ip" align="center" prop="app_name">
          <template slot-scope="scope">
            {{ scope.row.ip }}
          </template>
        </el-table-column>
        <el-table-column label="模块" align="center" prop="app_name">
          <template slot-scope="scope">
            {{ scope.row.module }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" prop="channel">
          <template slot-scope="scope">
            <span>{{ scope.row.instruction }}</span>
          </template>
        </el-table-column>
        <el-table-column label="详细信息" align="center" width="80" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="showDetails(scope.row)" icon="eye">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="详细信息"

        :visible.sync="dialogvisible"
        width="40%">
        <el-card class="box-card">
          <div class="card_div">ID:{{dialogcard.id}}<br></div>
          <div class="card_div">操作人：{{dialogcard.accout}}<br></div>
          <div class="card_div">操作时间：{{dialogcard.time}}<br></div>
          <div class="card_div">ip:{{dialogcard.ip}}<br></div>
          <div class="card_div">操作平台：{{dialogcard.useragent}}<br></div>
          <div class="card_div">模块：{{dialogcard.module}}<br></div>
          <div class="card_div">参数：{{dialogcard.parameter}}<br></div>
          <div class="card_div">操作说明：{{dialogcard.instruction}}<br></div>
          <div class="card_div">请求方法：{{dialogcard.method}}<br></div>

        </el-card>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getOperationLog} from '@/api/operationLog'

  export default {
    data() {
      return {
        tableLoading:false,
        buttonLoading:false,
        dialogcard: {},
        dialogTable: [],
        dialogvisible: false,
        queryData: {
          account_input: '',
          module_input: '',
          ip_input: '',
          oeprate_input: '',
        },
        list: [],
        hidList: [],
        timevalue: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
      }
    },
    watch: {},
    name: "operationLog",
    mounted() {
      //this.initData();
    },
    methods: {
      showDetails(data) {
        this.dialogvisible = true
        this.dialogcard = data
      },
      filterHandler() {
        this.buttonLoading=true
        let accountflag = this.queryData.account_input !== ''
        let moduleflag = this.queryData.module_input !== ''
        let ipflag = this.queryData.ip_input !== ''
        let operateflag = this.queryData.oeprate_input !== ''
        let newList = []
        for (let i = 0; i < this.hidList.length; i++) {
          let flag = true
          if (accountflag) {
            if (this.hidList[i].accout.indexOf(this.queryData.account_input) === -1) {
              flag = false
            }
          }
          if (moduleflag) {
            if (this.hidList[i].module.indexOf(this.queryData.module_input) === -1) {
              flag = false
            }
          }
          if (ipflag) {
            if (this.hidList[i].ip.indexOf(this.queryData.ip_input) === -1) {
              flag = false
            }
          }
          if (operateflag) {
            if (this.hidList[i].instruction.indexOf(this.queryData.oeprate_input) === -1) {
              flag = false
            }
          }
          if (flag) {
            newList.push(this.hidList[i])
          }
        }
        this.list = newList
        this.buttonLoading=false
      },
      queryHandler() {
        this.tableLoading=true
        this.buttonLoading=true
        if (this.timevalue === null || this.timevalue.length === 0) {
          this.$message({
            message: '请选择时间段',
            type: 'warning'
          });
          this.tableLoading=false
          this.buttonLoading=false
          return
        }
        let data = {
          start: this.timevalue[0],
          end: this.timevalue[1],
          page: ''
        }
        getOperationLog(data).then(response => {
          this.list = response.data
          this.hidList = response.data
          this.tableLoading=false
          this.buttonLoading=false
        }).catch(err => {
          console.error(err)
          this.tableLoading=false
          this.buttonLoading=false
        })
      },
    }
  }
</script>

<style scoped>
  .data_filter {
    margin-left: 15px;
    margin-top: 5px;
  }
  .card_div{
    margin: 10px;
    font: 16px Medium;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: bolder;
  }
</style>
