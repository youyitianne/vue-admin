<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-select v-model="projectValue"
                 size="mini"
                 style="width: 200px"
                 filterable
                 clearable
                 placeholder="请选择项目"
                 value-key="project_guid"
                 @change="listProjectChannel"
                 collapse-tags>
        <el-option
          v-for="item in projectList"
          :key="item.project_guid"
          :label="item.project_name"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="channelValue"
                 size="mini"
                 style="width: 200px"
                 filterable
                 clearable
                 placeholder="请选择渠道"
                 @change="listProjectVersion"
                 value-key="sdkguid"
                 collapse-tags>
        <el-option
          v-for="item in channelList"
          :key="item.sdkguid"
          :label="item.channel"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="versionValue"
                 size="mini"
                 style="width: 200px"
                 filterable
                 clearable
                 placeholder="请选择版本"
                 collapse-tags>
        <el-option
          v-for="item in versionList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
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
      <el-button :loading="tableLoading" class="filter-item" type="primary" icon="el-icon-search" size="mini"
                 @click="pageChange(1)">搜索
      </el-button>
    </div>
    <el-table
      height="680"
      v-loading="tableLoading"
      :data="tableList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="日期" width="110" align="center" prop="dataTime">
        <template slot-scope="scope">
          <span>{{ scope.row.dataTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应用" prop="appName">
        <template slot-scope="scope">
          <span>{{ scope.row.appName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="渠道" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110"  label="版本"  align="center" prop="versionName">
        <template slot-scope="scope">
          {{ scope.row.vision }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="次日留存率（%）" prop="install">
        <template slot-scope="scope">
          <span>{{ scope.row.r1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="3日留存率（%）" prop="launch">
        <template slot-scope="scope">
          <span>{{ scope.row.r3 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="7日留存率（%）" prop="duration">
        <template slot-scope="scope">
          <span>{{ scope.row.r7 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="14日留存率（%）" prop="duration">
        <template slot-scope="scope">
          <span>{{ scope.row.r14 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="30日留存率（%）" prop="launch">
        <template slot-scope="scope">
          <span>{{ scope.row.r30 }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="totalPages"
      :current-page="currentPage"
      @current-change="pageChange">
    </el-pagination>
  </div>


</template>

<script>
  import {
    getProjectList,
    getRetentionData
  } from "@/api/originalData/retentionData" ;

  import {
    getProjectVersion,
  } from "@/api/originalData/userData" ;

  export default {
    props:{
      projectList:{
        type:Array,
        required:true
      },
    },
    data() {
      return {
        totalPages:0,
        pageSize:20,
        currentPage:1,
        tableLoading: false,
        tableList: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6 - 24 * 60 * 60 * 1000
          }
        },
        searchLoading: false,
        timeValue: [],
        versionList: [],
        versionValue: '',
        channelList: [],
        channelValue: {},
        projectValue: {},
        versionName:'',
      }
    },
    mounted() {
      this.initdate()
      this.pageChange(1)
    },
    methods: {
      pageChange(param){
        this.currentPage=param
        let tothis = this
        let guidList = []
        if (typeof (this.projectValue.applist) === 'undefined') {
          console.log('展示所有项目数据')
        } else {
          if (typeof (this.channelValue.sdkguid) === 'undefined') {
            console.log('展示一个项目所有数据')
            guidList = this.projectValue.applist
          } else {
            guidList.push(this.channelValue)
          }
        }
        //将guidList中的应用id遍历出来
        let paramList=[]
        for (let i = 0;i<guidList.length;i++){
          paramList.push(guidList[i].sdkguid)
        }
        let listParam = {
          limit:this.pageSize,
          page:this.currentPage,
          guid: paramList,
          vision: this.versionValue,
          startTime: this.timeValue[0],
          endTime: this.timeValue[1]
        }
        console.log('搜索条件', listParam)
        this.tableLoading = true
        this.tableList = []
        getRetentionData(listParam).then(response => {
          this.tableList = response.data.data
          this.totalPages=response.data.total
          console.log(response)
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
      listProjectVersion(){
        this.versionValue=''
        let tothis=this
        let param={
          sdkguid:this.channelValue.sdkguid
        }
        console.log('应用信息',this.channelValue)
        getProjectVersion(param).then(response=>{
          this.versionList=response.data
        }).catch(error=> {
          console.error(error)
          tothis.$notify({
            title: '初始化应用列表',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//根据应用guid获取版本

      listProjectChannel(){
        this.channelValue={}
        this.versionValue=''
        this.channelList=this.projectValue.applist
        console.log('项目所有渠道',this.channelList)
      },//根据选择项目展示渠道
      initdate() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24*8);
        end.setTime(end.getTime() - 3600 * 1000 * 24*2);
        this.timeValue.push(this.formatDate(start,'yyyy-MM-dd'))
        this.timeValue.push(this.formatDate(end,'yyyy-MM-dd'))
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





