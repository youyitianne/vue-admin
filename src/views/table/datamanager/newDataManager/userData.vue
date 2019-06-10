<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">

      <el-select v-model="appValue"
                 size="mini"
                 style="width: 200px"
                 filterable
                 placeholder="请选择应用"
                 value-key="name"
                 @change="listUmengChannel"
                 collapse-tags>
        <el-option
          v-for="item in appList"
          :key="item.appkey"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="channelValue"
                 size="mini"
                 style="width: 200px"
                 filterable
                 placeholder="请选择渠道"
                 value-key="id"
                 collapse-tags>
        <el-option
          v-for="item in channelList"
          :key="item.id"
          :label="item.channel"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="versionValue"
                 size="mini"
                 style="width: 200px"
                 filterable
                 placeholder="请选择版本"
                 value-key="version"
                 collapse-tags>
        <el-option
          v-for="item in versionList"
          :key="item.version"
          :label="item.version"
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
      <el-button :loading="tableLoading" class="filter-item" type="primary" icon="el-icon-search"  size="mini"
                 @click="listUmengData">搜索
      </el-button>
    </div>
    <el-table
      height="750"
      v-loading="tableLoading"
      :data="tableList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>

      <!--<el-table-column label="id" width="110" style="display: none">-->
      <!--<template slot-scope="scope">-->
      <!--{{ scope.row.id }}-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column label="日期" width="110" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应用" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.appName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="渠道" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110"  label="版本"  align="center" prop="active_user">
        <template slot-scope="scope">
          {{ scope.row.versionName }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="新增用户" prop="install">
        <template slot-scope="scope">
          <span>{{ scope.row.dnu }}</span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="升级用户" prop="launch">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.dau }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="活跃用户" prop="duration">
        <template slot-scope="scope">
          <span>{{ scope.row.dau }}</span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="累计用户" prop="duration">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.duration }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="人均启动次数" prop="launch">
        <template slot-scope="scope">
          <span>{{ scope.row.startUpTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="单次使用时长" prop="duration">
        <template slot-scope="scope">
          <span>{{ scope.row.singleUseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="日均使用时长" prop="duration">
        <template slot-scope="scope">
          <span>{{ scope.row.dayUseTime }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>


</template>

<script>
import {
  getUmengAppHandler,
  getUmengChannelHandler,
  getUmengVersionHandler,
  getUmengDataHandler
} from "@/api/table/datamanager/newDataManager/userData" ;

  export default {
    data() {
      return {
        tableLoading:false,
        tableList:[],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6-24*60*60*1000
          }
        },
        searchLoading:false,
        timeValue:[],
        versionList:[],
        versionValue:{},
        channelList:[],
        channelValue:{},
        appList:[],
        appValue:{}
      }
    },
    mounted() {
      this.ListUmengApp()
    },
    methods: {
      ListUmengApp(){
        let tothis=this
        getUmengAppHandler().then(response=>{
          if (response.repcode===3000){
            console.log('友盟app获取成功返回',response.data)
            this.appList=response.data.data
          }else {
            console.error('友盟app获取失败返回',response.data)
            console.error(response)
          }
        }).catch(error=>{
          console.error('友盟app获取失败返回',error)
          tothis.$notify({
            title: '初始化应用列表',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//友盟app初始化.
      listUmengChannel(){
        this.listUmengVersion();
        this.channelList=[]
        this.channelValue={}
        this.versionList=[]
        this.versionValue={}
        let param = {
          appkey:this.appValue.appkey
        }
        let tothis=this
        getUmengChannelHandler(param).then(response=>{
          if (response.repcode===3000){
            console.log('友盟channel获取成功返回',response.data)
            this.channelList=response.data.data
          }else {
            console.error('友盟channel获取失败返回',response.data)
            console.error(response)
          }
        }).catch(error=>{
          console.error('友盟channel获取失败返回',error)
          tothis.$notify({
            title: '初始化渠道列表',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//获取应用的友盟渠道
      listUmengVersion(){
        let param = {
          appkey:this.appValue.appkey
        }
        let tothis=this
        getUmengVersionHandler(param).then(response=>{
          if (response.repcode===3000){
            console.log('友盟version获取成功返回',response.data)
            this.versionList=response.data.data
          }else {
            console.error('友盟version获取失败返回',response.data)
            console.error(response)
          }
        }).catch(error=>{
          console.error('友盟version获取失败返回',error)
          tothis.$notify({
            title: '初始化版本列表',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//获取应用的友盟版本
      listUmengData(){
        let param = {
          appKey:this.appValue.appkey,
          channelID:this.channelValue.id,
          appName:this.appValue.name,
          channelName:this.channelValue.channel,
          versionName:this.versionValue.version,
          startDate:this.timeValue[0],
          endDate:this.timeValue[1]
        }
        if (typeof (param.appKey)==='undefined'||
          typeof (param.channelID)==='undefined'||
          typeof (param.appName)==='undefined'||
          typeof (param.channelName)==='undefined'||
          typeof (param.versionName)==='undefined'||
          typeof (param.startDate)==='undefined'||
          typeof (param.endDate)==='undefined'){
          this.$message({
            type: 'error',
            message: `请选择搜索参数！`
          });
          return
        }
        console.log('搜索条件',param)
        let tothis=this
        this.tableLoading=true
        getUmengDataHandler(param).then(response=>{
          if (response.repcode===3000){
            this.tableList=response.data
            console.log('友盟数据获取成功返回',response.data)
          }else {
            console.error('友盟数据获取失败返回',response.data)
            console.error(response)
          }
          this.tableLoading=false
        }).catch(error=>{
          this.tableLoading=false
          console.error('友盟数据获取失败返回',error)
          tothis.$notify({
            title: '友盟数据获取失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      }
    }
  }
</script>
