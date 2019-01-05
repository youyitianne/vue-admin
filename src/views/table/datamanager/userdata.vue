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
      <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ searchName }}</el-button>
      <el-input placeholder="根据游戏名二次筛选" v-model="secondary_name" style="width: 200px;margin-left: 15px;margin-bottom: 10px;margin-top: -10px" class="filter-item" clearable @blur="getDatawith"/>
      <el-input placeholder="根据渠道二次筛选" v-model="secondary_channel" style="width: 200px;margin-left: 15px;margin-bottom: 10px;margin-top: -10px" class="filter-item" clearable @blur="getDatawith"/>

    </div>
    <el-table
      height="850"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope" prop="id">
          {{ ++scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="时间" width="110" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="游戏名" width="110" align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.app_name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="渠道" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.channel }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="日新增用户" prop="advertising_type">
        <template slot-scope="scope">
          <span>{{ scope.row.dnu }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="日活跃用户" prop="earned">
        <template slot-scope="scope">
          <span>{{ scope.row.dau }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="日启动次数" prop="clickrate">
        <template slot-scope="scope">
          <span>{{ scope.row.startup_time }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单次启动时长" prop="ecpm">
        <template slot-scope="scope">
          <span>{{ scope.row.single_use_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="留存率" prop="click">
        <template slot-scope="scope">
          <span>{{ scope.row.retention }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>


</template>
<script>
  import {getuserdata} from '@/api/table/datamanager/userdata'
  import waves from '@/directive/waves'
  import { parseTime } from '@/utils'

  export default {
    directives: { waves },
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
        secondary_name:'',
        secondary_channel:'',
        hidlist:'',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        directives: { waves },
        downloadLoading: false,
        layout:'',
        timevalue: '',
        searchName:'搜索',
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          importance: undefined,
          title: undefined,
          type: undefined,
        },
        listParam:{
          start:'',
          end:''
        },
        importanceOptions: [1, 2, 3],
        names:[],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
      }
    },
    methods: {
      getDatawith(){
        this.listLoading=true
        if (this.hidlist===[]){
          return
        }

        let data=[]
        this.listLoading=true
        let name=this.secondary_name
        if (name==''||name==null){
          data=this.hidlist
        }else {
          for (let i=0;i<this.hidlist.length;i++){
            if (this.hidlist[i].app_name.search(name)!=-1){
              data.push(this.hidlist[i])
            }
          }
        }

        let data1=[]
        let channel=this.secondary_channel
        if (channel==''){
          data1=data
        }else {
          for (let i=0;i<data.length;i++){
            if (data[i].channel.search(channel)!=-1){
              data1.push(data[i])
            }
          }
        }

        this.list = data1
        this.listLoading=false

      },
      handleFilter(){
        this.downloadLoading=true
        if (this.timevalue===''||this.timevalue==null||this.timevalue[0]==='undefined'||this.timevalue[1]==='undefined') {
          this.$message({
            message: '请选择查询范围~',
            type: 'warning'
          });
          this.downloadLoading=false
          return
        }
        this.listParam.start=this.timevalue[0]
        this.listParam.end=this.timevalue[1]
        this.listLoading = true
        let tothis=this
        getuserdata(this.listParam).then(response => {
          this.list = response.data
          this.hidlist=response.data
          this.getDatawith()
          this.listLoading = false
          this.downloadLoading=false
        }).catch(function (rs) {
          tothis.listLoading = false
          tothis.downloadLoading=false
        })
      },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
    }
  }
</script>
