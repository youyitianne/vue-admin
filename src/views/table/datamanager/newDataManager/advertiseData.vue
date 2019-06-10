<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-select v-model="appValue"
                 style="width: 200px"
                 filterable
                 clearable
                 placeholder="请选择应用"
                 value-key="sdkguid"
                 size="mini"
                 collapse-tags>
        <el-option
          v-for="item in appList"
          :key="item.sdkguid"
          :label="item.selectName"
          :value="item.sdkguid">
        </el-option>
      </el-select>
      <el-select v-model="platformValue"
                 style="width: 200px"
                 size="mini"
                 filterable
                 clearable
                 placeholder="请选择广告平台"
                 value-key="sdk_name"
                 collapse-tags>
        <el-option
          v-for="item in platfromDialogList"
          :key="item.sdk_name"
          :label="item.sdk_mark"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="placementTypeValue"
                 style="width: 200px"
                 filterable
                 size="mini"
                 placeholder="请选择广告位类型"
                 value-key="name"
                 collapse-tags>
        <el-option
          v-for="item in placementList"
          :key="item.appkey"
          :label="item.name"
          :value="item">
        </el-option>
      </el-select>
      <el-date-picker
        :clearable="false"
        size="mini"
        v-model="searchTime"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions0">>
      </el-date-picker>
      <el-button :loading="listLoading" class="filter-item" type="primary" icon="el-icon-search" size="mini"
                 @click="pageChange(1)">搜索
      </el-button>

      <el-button :loading="false" class="filter-item" type="primary" size="mini" style="float: right"
                 @click="importDialog=true">导入EXCEL
      </el-button>
    </div>

    <el-dialog
      title="导入广告数据"
      :close-on-click-modal=false
      :visible.sync="importDialog"
      width="800px">

      <div class="block">
        <span class="demonstration" style="margin-right: 112px">日期</span>
        <el-date-picker
          style="width: 250px"
          v-model="uploadTime"
          @change="uploadTimeChange"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </div>

      <div class="block">
        <span class="demonstration" style="margin-right: 75px">广告平台</span>
        <el-select v-model="platformDialogValue"
                   style="width: 250px"
                   filterable
                   @change="platfromDialogChange"
                   placeholder="请选择广告平台"
                   value-key="sdk_name"
                   collapse-tags>
          <el-option
            v-for="item in platfromDialogList"
            :key="item.sdk_name"
            :label="item.sdk_mark"
            :value="item.id">
          </el-option>
        </el-select>
      </div>
      <div class="block" style="display: inline-block;position: absolute">
        <span class="demonstration" style="margin-right: 40px;">选择导入文件</span>
      </div>
      <el-upload
        style="margin-left: 166px;display: inline-block"
        ref="upload"
        :action="url"
        :data="uploadParamter"
        :on-change="fileChange"
        :on-success="uploadSuccess"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" style="margin-top: 15px">选取文件</el-button>
      </el-upload>

      <div>
        <span style="margin-left: 35px;margin-top: 15px;display:inline-block">提示：选择导入excel文件，请确保导入的数据与选择的“日期”及“广告平台”保持一致，如若不一致将会导致数据错误</span>
      </div>
      <div>

      </div>
      <div>
        <el-button style="margin-left: 40%;margin-top: 25px;margin-bottom: 15px" size="small" type="primary"
                   @click="submitUpload">
          上传到服务器
        </el-button>
        <hr/>
      </div>
      <div>
        <div class="uploadresponse1" v-html="htmlValue"
             style="padding: 30px;font-family: 微软雅黑;line-height: 22px;font-size: 15px"></div>
      </div>
    </el-dialog>

    <el-table
      height="750"
      v-loading="listLoading"
      :data="tableList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>

      <el-table-column label="日期" width="200" align="center" prop="date">
        <template slot-scope="scope" >
          <span>{{ scope.row.dateTime1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应用" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.app_name }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="应用" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_mark }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="广告平台" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.sdk_mark }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110" label="广告位" align="center" prop="active_user">
        <template slot-scope="scope">
          {{ scope.row.placement_guid }}
        </template>
      </el-table-column>

      <el-table-column width="110" label="广告位类型" align="center" prop="active_user">
        <template slot-scope="scope">
          {{ scope.row.placement_type }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="展现量" prop="install">
        <template slot-scope="scope">
          <span>{{ scope.row.pv }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击量" prop="launch">
        <template slot-scope="scope">
          <span>{{ scope.row.click }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击率" prop="duration">
        <template slot-scope="scope">
          <span>{{ scope.row.clickRate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="填充率" prop="duration">
        <template slot-scope="scope">
          <span>{{ scope.row.fillRate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ecpm" prop="launch">
        <template slot-scope="scope">
          <span>{{ scope.row.ecpm }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收入" prop="duration">
        <template slot-scope="scope">
          <span>{{ scope.row.revenue }}</span>
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
  import {getPlatformHandler,getAppHandler,getAdvertisementHandler} from '@/api/table/datamanager/newDataManager/advertiseData'

  export default {
    data() {
      return {
        listLoading:false,
        pageSize: 20,
        totalPages: 0,
        currentPage: 1,
        url: 'http://192.168.1.144:8094/dataStatisics/fileupload',
        uploadParamter: {
          platform: '',
          uploadDate: ''
        },
        tableList: [],
        searchTime: [],
        htmlValue: '还未提交数据',
        importDialog: false,
        fileList: [],
        platfromDialogList: [],
        appList: [],
        platformList: [],
        placementList: [],
        platformValue: '',
        appValue:'',
        placementTypeValue: '',
        uploadTime: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6-24*60*60*1000
          }
        },
        platformDialogValue: '',
        tableLoading:false,
      }
    },
    mounted() {
      this.listPlatfrom()
      this.listApp()
    },
    methods: {
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
          appValue: this.appValue,
          platformValue: this.platformValue,
          placementTypeValue: this.placementTypeValue,
          startDate:this.searchTime[0],
          endDate:this.searchTime[1],
        }
        if (typeof (param.startDate)==='undefined'||
          typeof (param.endDate)==='undefined'){
          this.$message({
            type: 'error',
            message: `请选择搜索参数！`
          });
          return
        }
        console.log(param)
        this.listLoading = true
        getAdvertisementHandler(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.tableList = response.data
            console.log("广告信息--------", this.tableList)
            console.log("总计--------", response.total)
            this.totalPages = response.total
          } else {
            tothis.$notify({
              title: '失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error => {
          this.listLoading = false
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//分页切换
      listApp() {
        getAppHandler().then(response => {
          if (response.repcode === 3000) {
            console.log('应用列表', response.data)
            this.appList = response.data
          } else {
            console.error(response)
          }
        }).catch(error => {
          console.error(error)
          this.$message({
            type: 'error',
            message: `获取应用列表失败！`
          });
        })
      },//展示项目列表
      listPlatfrom(){
        getPlatformHandler().then(response=>{
          if (response.repcode===3000){
            console.log('广告平台列表',response.data)
            this.platfromDialogList=response.data
          } else {
            console.error(response)
          }
        }).catch(error=>{
          this.$message({
            type: 'error',
            message: `获取广告平台失败！`
          });
        })
      },//展示广告平台列表

      uploadTimeChange() {
        this.uploadParamter.uploadDate = this.uploadTime
        console.log('时间改变', this.uploadParamter)
      },
      platfromDialogChange() {
        this.uploadParamter.platform = this.platformDialogValue
        console.log('平台改变', this.uploadParamter)
      },
      fileChange(file, fileList) {
        this.fileList = []
        this.fileList.push(file)
      },//只能上传一个文件
      submitUpload() {
        if (this.uploadParamter.uploadDate === '') {
          this.$message({
            type: 'error',
            message: `请选择日期！`
          });
          return
        }
        if (this.uploadParamter.platform === '') {
          this.$message({
            type: 'error',
            message: `请选择广告平台！`
          });
          return
        }
        if (this.fileList.length === 0) {
          this.$message({
            type: 'error',
            message: `请选择上传文件！`
          });
          return
        }
        console.log("上传附带参数", this.uploadParamter)
        this.$refs.upload.submit();
      },//提交上传文件
      uploadSuccess(response, file, fileList) {
        console.log('上传成功response', response)
        if (response.repcode === 3000) {
          this.$message({
            type: 'success',
            message: `上传文件成功！`
          });
          this.htmlValue = response.data;
        } else {
          this.$message({
            type: 'error',
            message: `上传失败！`
          });
          this.htmlValue = response.data;
        }
      },
    }
  }
</script>

<style>
  .block {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 18px large;
    margin: 15px;
  }
</style>
