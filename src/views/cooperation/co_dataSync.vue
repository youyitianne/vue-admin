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
      <el-button :loading="syncloadLoading" class="filter-item" @click="handleSync" >同步</el-button>
    </div>

    <el-tabs  v-model="activeName">
      <el-tab-pane label="用户数据" name="first">
        <el-table
          height="730"
          v-loading="listLoading"
          :data="userList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row>
          <el-table-column align="center" label="ID" width="95">
            <template slot-scope="scope" prop="id">
              {{ ++scope.$index }}
            </template>
          </el-table-column>
          <el-table-column label="时间" width="110" align="center" prop="date1">
            <template slot-scope="scope">
              <span>{{ scope.row.date1 }}</span>
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
          <!--<el-table-column align="center" label="日启动次数" prop="clickrate">-->
            <!--<template slot-scope="scope">-->
              <!--<span>{{ scope.row.startup_time }}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column align="center" label="单次启动时长" prop="ecpm">-->
            <!--<template slot-scope="scope">-->
              <!--<span>{{ scope.row.single_use_time }}</span>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column align="center" label="次留" prop="click">
            <template slot-scope="scope">
              <span>{{ scope.row.retention }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="3留" prop="click">
            <template slot-scope="scope">
              <span>{{ scope.row.r3 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="7留" prop="click">
            <template slot-scope="scope">
              <span>{{ scope.row.r7 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="14留" prop="click">
            <template slot-scope="scope">
              <span>{{ scope.row.r14 }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="30留" prop="click">
            <template slot-scope="scope">
              <span>{{ scope.row.r30 }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="广告数据" name="second">
        <el-table
          height="730"
          v-loading="listLoading"
          :data="adList"
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
                <span>{{ scope.row.date1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="游戏名" width="110" align="center" prop="app_name">
              <template slot-scope="scope">
                {{ scope.row.app_name }}
              </template>
            </el-table-column>

          <el-table-column label="广告位id" width="110" align="center" prop="advertisingId">
            <template slot-scope="scope">
              {{ scope.row.advertisingId }}
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

            <el-table-column align="center" label="备注" prop="platform" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.note }}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="平台" prop="platform">
              <template slot-scope="scope">
                <span>{{ scope.row.platform }}</span>
              </template>
            </el-table-column>

        </el-table>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  import {listUserDataMeth,listAdDataMeth} from '@/api/cooperation/co_dataSync'
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
        syncloadLoading:false,
        activeName:'first',
        adList:[],
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
        timevalue: '',
        searchName:'搜索',
        userList: null,
        listLoading: false,
        listParam:{
          start:'',
          end:''
        },
      }
    },
    methods: {
      handleSync(){
        this.syncloadLoading=true
        let syncData={
          userData:this.userList,
          adData:this.adList
        }
        console.log('同步数据',syncData)
        this.syncloadLoading=false
      },//同步数据
      handleFilter(){
        this.userList=[]
        this.adList=[]
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
        console.log("请求用户数据参数",this.listParam)
        listUserDataMeth(this.listParam).then(response => {
          console.log('用户数据',response.data)
          this.userList = (response.data)

          listAdDataMeth(this.listParam).then(res => {
            console.log('广告数据',res.data)
            this.adList = (res.data)

            this.listLoading = false
            this.downloadLoading=false
          }).catch(function (rs) {
            console.error(rs)
            tothis.listLoading = false
            tothis.downloadLoading=false
          })
        }).catch(function (rs) {
          console.error(rs)
          tothis.listLoading = false
          tothis.downloadLoading=false
        })
      },//查询数据
    }
  }
</script>
