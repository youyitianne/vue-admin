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

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ searchName }}</el-button>

      <el-button :loading="downloadLoading" type="primary" icon="el-icon-download"  @click="handleDownload" >{{'下载'}}</el-button>
    </div>
    <el-table
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
      <!--<el-table-column label="id" width="110" style="display: none">-->
      <!--<template slot-scope="scope">-->
      <!--{{ scope.row.id }}-->
      <!--</template>-->
      <!--</el-table-column>-->
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

      <el-table-column align="center" label="广告类型" prop="advertising_type">
        <template slot-scope="scope">
          <span>{{ scope.row.advertising_type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收入" prop="earned">
        <template slot-scope="scope">
          <span>{{ scope.row.earned }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击率" prop="clickrate">
        <template slot-scope="scope">
          <span>{{ scope.row.click_rate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ecpm" prop="ecpm">
        <template slot-scope="scope">
          <span>{{ scope.row.ecpm }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="展示次数" prop="impression">
        <template slot-scope="scope">
          <span>{{ scope.row.impression }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击次数" prop="click">
        <template slot-scope="scope">
          <span>{{ scope.row.click }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="填充率" prop="fill_rate">
        <template slot-scope="scope">
          <span>{{ scope.row.fill_rate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台" prop="platform">
        <template slot-scope="scope">
          <span>{{ scope.row.platform }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" prop="platform">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="SDK名字" prop="platform">
        <template slot-scope="scope">
          <span>{{ scope.row.sdk_name }}</span>
        </template>
      </el-table-column>

    </el-table>

  </div>


</template>

<script>
  import {getyixindata} from '@/api/yixin'
  import waves from '@/directive/waves'
  import { parseTime } from '@/utils'

  export default {
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
      open3() {
        this.$message({
          message: '记得选择查询范围~',
          type: 'warning'
        });
      },
      open4() {
        this.$message({
          message: '没有信息可以打印~',
          type: 'warning'
        });
      },
      handleFilter(){
        this.listParam.start=this.timevalue[0]
        this.listParam.end=this.timevalue[1]
        if (this.listParam.start==='undefined'||this.listParam.end==='undefined') {
          this.open3()
          return
        }
        this.listLoading = true
        getyixindata(this.listParam).then(response => {
          console.log(response)
          this.list = response.data
          console.log(this.list)
          this.listLoading = false
        }).catch(function (rs) {
          console.log(rs)
        })
      },

      handleDownload() {   //下载请求
        this.downloadLoading = true
        if (this.list===null) {
          this.open4()
          this.downloadLoading = false
          return
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [ 'date', 'app_name', 'channel', 'advertising_type','earned', 'click_rate', 'ecpm', 'impression', 'click', 'fill_rate', 'platform','note','sdk_name']
          const filterVal = ['date', 'app_name', 'channel', 'advertising_type','earned', 'click_rate', 'ecpm', 'impression', 'click', 'fill_rate', 'platform','note','sdk_name']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '移信'
          })
          this.downloadLoading = false
        })
      },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
    }
  }
</script>
