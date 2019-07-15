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
                 collapse-tags>
        <el-option
          v-for="item in projectList"
          :key="item.project_guid"
          :label="item.project_name"
          :value="item">
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
          :key="item.sdk_template_guid"
          :label="item.sdk_mark"
          :value="item.sdk_template_guid">
        </el-option>
      </el-select>
      <!--<el-select v-model="placementTypeValue"-->
      <!--style="width: 200px"-->
      <!--filterable-->
      <!--clearable-->
      <!--size="mini"-->
      <!--placeholder="请选择广告位类型"-->
      <!--value-key="name"-->
      <!--collapse-tags>-->
      <!--<el-option-->
      <!--v-for="item in adtypeList"-->
      <!--:key="item.adtype_guid"-->
      <!--:label="item.adtype_name"-->
      <!--:value="item.adtype_guid">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <el-select v-model="placement_guid"
                 style="width: 200px"
                 filterable
                 clearable
                 placeholder="请选择广告位"
                 value-key="placement_guid"
                 size="mini"
                 collapse-tags>
        <el-option
          v-for="item in placementList"
          :key="item.placement_guid"
          :label="item.placement_name"
          :value="item.placement_guid">
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
                 @click="showImport">导入EXCEL
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
          :clearable=false
          style="width: 250px"
          v-model="uploadTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </div>

      <div class="block">
        <span class="demonstration" style="margin-right: 75px">公司账号</span>
        <el-select v-model="companyDialogValue"
                   style="width: 250px"
                   filterable
                   placeholder="请选择公司账号"
                   value-key="sdk_name"
                   collapse-tags>
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.companyName"
            :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="block">
        <span class="demonstration" style="margin-right: 75px">广告平台</span>
        <el-select v-model="platformDialogValue"
                   style="width: 250px"
                   filterable
                   placeholder="请选择广告平台"
                   value-key="sdk_name"
                   collapse-tags>
          <el-option
            v-for="item in platfromDialogList"
            :key="item.sdk_name"
            :label="item.sdk_mark"
            :value="item.sdk_template_guid">
          </el-option>
        </el-select>
      </div>

      <div class="block" style="display: inline-block;position: absolute">
        <span class="demonstration" style="margin-right: 40px;">选择导入文件</span>
      </div>
      <el-upload
        name="blFile"
        style="margin-left: 166px;display: inline-block"
        ref="upload"
        :action="url"
        :accept="acceptType"
        :data="uploadParamter"
        :on-change="fileChange"
        :on-success="uploadSuccess"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" style="margin-top: 15px">选取文件</el-button>
      </el-upload>

      <div>
        <span style="margin-left: 35px;margin-top: 15px;display:inline-block">提示：下载文件请不要更改文件名</span>
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

      <el-table-column label="日期" width="100" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.dataTime }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180" align="center" label="应用" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.appName }}</span>
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="渠道" prop="id">-->
      <!--<template slot-scope="scope">-->
      <!--<span>{{ scope.row.channel_mark }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="广告平台" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110" label="广告类型" align="center" prop="active_user">
        <template slot-scope="scope">
          {{ scope.row.advType }}
        </template>
      </el-table-column>

      <!--<el-table-column width="200" label="广告位" align="center" prop="active_user">-->
      <!--<template slot-scope="scope">-->
      <!--{{ scope.row.placement_id }}-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column width="280" label="广告位名称" align="center" prop="active_user">
        <template slot-scope="scope">
          <a @click="">{{ scope.row.advName }}</a>
        </template>
      </el-table-column>


      <el-table-column align="center" label="展现量" prop="install">
        <template slot-scope="scope">
          <span>{{ scope.row.advShowCount }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击量" prop="launch">
        <template slot-scope="scope">
          <span>{{ scope.row.advClickCount }}</span>
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
          <span>{{ scope.row.income }}</span>
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
  import {getAdvertiseData} from '@/api/originalData/advertiseData'
  import {
    getPlatformHandler,
    getAppHandler,
    getAdvertisementHandler
  } from '@/api/table/datamanager/newDataManager/advertiseData'
  import {getAdtypeHandler} from '@/api/table/datamanager/newDataManager/advertiseTypeData'
  import {
    getPlacementHandler
  } from '@/api/table/datamanager/newDataManager/placementData'
  import {
    getProjectList,
  } from "@/api/originalData/userData" ;
  import {getcompanyInfoMeth} from '@/api/table/sdkmanager/companyInfo'

  export default {
    props:{
      projectList:{
        type:Array,
        required:true
      },
    },
    data() {
      return {
        acceptType: '.csv,.xls,.xlsx',
        listLoading: false,
        pageSize: 20,
        totalPages: 0,
        currentPage: 1,
        url: 'http://192.168.1.159:9003/uploadfile/excel',
        uploadParamter: {
          groupId: '',
          platformId: '',
          date: ''
        },
        tableList: [],
        searchTime: [],
        htmlValue: '还未提交数据',
        importDialog: false,
        fileList: [],
        platfromDialogList: [],
        appList: [],
        adtypeList: [],
        platformValue: '',
        appValue: '',
        placementTypeValue: '',
        uploadTime: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6 - 24 * 60 * 60 * 1000
          }
        },
        platformDialogValue: '',
        tableLoading: false,
        placement_guid: '',
        placementList: [],
        projectValue: {
          applist: []
        },

        companyList: [],
        companyDialogValue: ''
      }
    },
    mounted() {
      this.initdate();
      this.getPlacementMeth()
      //  this.routerWithParam()
      this.listPlatfrom()//初始化平台列表
      // this.listAdtype()
      this.pageChange(1)
      this.initCompanyInfo()//初始化公司信息

    },
    methods: {
      initCompanyInfo() {
        let tothis = this;
        getcompanyInfoMeth().then(response => {
          if (response.repcode === 3000) {
            this.companyList = response.data
            console.log('公司信息', response.data)
          } else {
            tothis.$notify({
              title: '初始化公司信息失败',
              message: '刷新试试',
              type: 'error',
              duration: 2000
            })
          }
          this.listLoading = false
        }).catch(function (rs) {
          tothis.listLoading = false
          console.log(rs)
          tothis.$notify({
            title: '初始化公司信息失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//获取公司信息
      initdate() {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
        this.searchTime.push(this.formatDate(start, 'yyyy-MM-dd'))
        this.searchTime.push(this.formatDate(end, 'yyyy-MM-dd'))
      },//页面渲染初始化日期
      getPlacementMeth() {
        getPlacementHandler().then(response => {
          if (response.repcode === 3000) {
            this.placementList = response.data
          } else {
            console.error(response)
          }
        }).catch(error => {
          console.error(error)
          this.$message({
            type: 'error',
            message: `添加广告类型失败！`
          });
        })
      },
      routerWithParam() {
        let placement_guid = this.$route.query.placement_guid
        if (typeof(placement_guid) != 'undefined') {
          const end = new Date();
          const start = new Date();
          end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 8);
          this.searchTime = [start, end]
          this.placement_guid = placement_guid
          this.pageChange(1)
        }
      },
      jumptoPlacement(param) {
        console.log('跳转参数', param)
        let routeData = this.$router.resolve({
          name: 'guanggaoweishuju',
          query: {placement_id: param.placement_id}
        });
        window.open(routeData.href, '_blank');
      },//跳转到广告位信息
      showImport() {
        this.uploadTime = this.formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
        this.platformDialogValue = this.platfromDialogList[0].sdk_template_guid
        this.companyDialogValue = this.companyList[0].id
        this.fileList = []
        this.importDialog = true
      },//展示导入数据对话框
      listAdtype() {
        getAdtypeHandler().then(response => {
          if (response.repcode === 3000) {
            this.adtypeList = response.data
          } else {
            console.error(response)
          }
        }).catch(error => {
          console.log(error)
          this.$message({
            type: 'error',
            message: `添加广告类型失败！`
          });
        })
      },
      pageChange(page) {
        this.currentPage = page
        let tothis = this

        let appGuidList = []
        let appList = this.projectValue.applist
        if (typeof (appList) != 'undefined') {
          console.log('搜索条件应用列表', appList)
          for (let i = 0; i < appList.length; i++) {
            appGuidList.push(appList[i].sdkguid)
          }
        }
        let param = {
          page: page,
          limit: this.pageSize,
          startTime: this.searchTime[0],
          endTime: this.searchTime[1],
          app_guid: appGuidList,
          platform_guid: this.platformValue,
          placement_guid: this.placement_guid
        }
        if (typeof (param.startTime) === 'undefined' ||
          typeof (param.endTime) === 'undefined') {
          this.$message({
            type: 'error',
            message: `请选择日期范围！`
          });
          return
        }
        console.log('查询参数', param)
        this.listLoading = true
        getAdvertiseData(param).then(response => {
          this.listLoading = false
          this.tableList = response.data.data
          this.totalPages = response.data.total
          console.log(response.data)
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
      listPlatfrom() {
        getPlatformHandler().then(response => {
          if (response.repcode === 3000) {
            console.log('广告平台列表', response.data)
            this.platfromDialogList = response.data
          } else {
            console.error(response)
          }
        }).catch(error => {
          this.$message({
            type: 'error',
            message: `获取广告平台失败！`
          });
        })
      },//展示广告平台列表
      fileChange(file, fileList) {
        this.fileList = []
        this.fileList.push(file)
      },//只能上传一个文件
      submitUpload() {
        this.uploadParamter.date=this.uploadTime
        this.uploadParamter.platformId=this.platformDialogValue
        this.uploadParamter.groupId=this.companyDialogValue
        console.log("上传附带参数", this.uploadParamter)
        if (this.uploadTime === '') {
          this.$message({
            type: 'error',
            message: `请选择日期！`
          });
          return
        }
        if (this.platformDialogValue === '') {
          this.$message({
            type: 'error',
            message: `请选择广告平台！`
          });
          return
        }
        if (this.companyDialogValue === '') {
          this.$message({
            type: 'error',
            message: `请选择公司信息！`
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
        this.$refs.upload.submit();
      },//提交上传文件
      uploadSuccess(response, file, fileList) {
        console.log('上传成功response', response)
        this.htmlValue = response.data;
        this.$message({
          type: 'success',
          message: `上传文件成功！`
        });


        // if (response.repcode === 3000) {
        //   this.$message({
        //     type: 'success',
        //     message: `上传文件成功！`
        //   });
        //   this.htmlValue = response.data;
        // } else {
        //   this.$message({
        //     type: 'error',
        //     message: `上传失败！`
        //   });
        //   this.htmlValue = response.data;
        // }


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
