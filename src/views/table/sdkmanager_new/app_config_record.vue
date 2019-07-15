<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <span style="margin-left: 15px;margin-right: 5px">应用名:</span>
      <el-input v-model="secondary_game" style="width: 200px" class="filter-item" clearable/>
        <span style="margin-left: 15px;margin-right: 5px">应用GUID:</span>
      <el-input v-model="search_app_guid" style="width: 200px" class="filter-item" clearable/>
      <el-button style="margin-left: 20px" @click="searchTable">搜索</el-button>
    </div>
    <el-table
      height="750"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :row-key='getRowKeys'
      fit
      stripe
      border
      highlight-current-row>
      <el-table-column label="发布时间" prop="time" width="200">
      </el-table-column>
      <el-table-column label="应用名" prop="productName" width="150">
      </el-table-column>
      <el-table-column label="渠道" prop="channel" width="100px">
      </el-table-column>
      <el-table-column label="包名" prop="packageName" width="300px">
      </el-table-column>
      <el-table-column label="外部版本-在线" prop="versionName_online" width="120px">
      </el-table-column>
      <el-table-column label="内部版本-更新" prop="versionCode"  width="120px">
      </el-table-column>
      <el-table-column label="备注" prop="note">
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="handleView(scope.row)" >{{ "查看" }}</el-button>
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
    <el-dialog
      :close-on-click-modal=false
      title="详情"
      :visible.sync="dialogVisible"
      width="70%">
      <el-form label-position="left" inline class="demo-table-expand" :model="dialogForm" label-width="150px">
        <el-form-item label="时间:">
          <span>{{ dialogForm.time}}</span>
        </el-form-item>
        <el-form-item label="出表人">
          <span>{{ dialogForm.publisher}}</span>
        </el-form-item>
        <el-form-item label="游戏名:">
          <span>{{ dialogForm.productName }}</span>
        </el-form-item>
        <el-form-item label="包名:">
          <span>{{ dialogForm.packageName }}</span>
        </el-form-item>
        <el-form-item label="渠道标记:">
          <span>{{ dialogForm.channel }}</span>
        </el-form-item>
        <el-form-item label="外部版本-在线:">
          <span>{{ dialogForm.versionName_online }}</span>
        </el-form-item>
        <el-form-item label="内部版本-在线:">
          <span>{{ dialogForm.versionCode_online }}</span>
        </el-form-item>
        <el-form-item label="外部版本-更新:">
          <span>{{ dialogForm.versionName }}</span>
        </el-form-item>
        <el-form-item label="内部版本_更新:">
          <span>{{ dialogForm.versionCode }}</span>
        </el-form-item>
        <el-form-item label="icon:">
          <span>{{ dialogForm.defaultIcon }}</span>
        </el-form-item>
        <el-form-item label="splash:">
          <span>{{ dialogForm.splashImage }}</span>
        </el-form-item>
        <el-form-item label="keystorePath:">
          <span>{{ dialogForm.keystorePath }}</span>
        </el-form-item>
        <el-form-item label="keystorePass:">
        <span>{{ dialogForm.keystorePass }}</span>
      </el-form-item>
        <el-form-item label="keyaliasName:">
          <span>{{ dialogForm.keyaliasName }}</span>
        </el-form-item>
        <el-form-item label="keyaliasPass:">
          <span>{{ dialogForm.keyaliasPass }}</span>
        </el-form-item>
        <el-form-item label="MD5:">
          <span>{{ dialogForm.MD5 }}</span>
        </el-form-item>
        <el-form-item label="SHA1:">
          <span>{{ dialogForm.SHA1 }}</span>
        </el-form-item>
        <el-form-item label="SHA256:">
          <span>{{ dialogForm.SHA256 }}</span>
        </el-form-item>
        <el-form-item label="备注:">
          <span>{{ dialogForm.note }}</span>
        </el-form-item>
      </el-form>
      <el-table
        stripe
        border
        :data="projectObject"
        style="width: 90%;margin-bottom: 30px;margin-top: 30px"
        :span-method="objectSpanMethod">
        <el-table-column
          prop="sdk_type"
          label="SDK类型"
          style="width: 200px">
        </el-table-column>
        <el-table-column
          prop="sdk_param_type"
          label="SDK参数类型"
          style="width: 300px">
        </el-table-column>
        <el-table-column
          prop="sdk_param"
          label="SDK参数">
        </el-table-column>
      </el-table>
      <span>
          复制Key表链接:&nbsp&nbsp<el-input v-model="link" placeholder="Please input" style="max-width:100%;width: 900px" disabled/>
        <el-button v-clipboard:copy="link" v-clipboard:success="clipboardSuccess" type="primary" icon="document">复制</el-button>
      </span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves'
  import checkPermission from '@/utils/permission' // 权限判断函数
  //import {getSdkTemplate,getChannel} from '@/api/table/sdkmanager/projectconfigtable'
  import clipboard from '@/directive/clipboard/index' // use clipboard by v-directive
  import {listAppConfigInfoRecord} from '@/api/sdkmanager_new/app_config_record'


  export default {
    directives: {
      clipboard
    },
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
        search_app_guid:'',
        pageSize:30,
        totalPages:0,
        currentPage:1,
        link:'',
        dialogForm:{},
        projectObject:[],
        dialogVisible:false,
        secondary_package: '',
        value: [],
        spanArr: [],
        checked: true,
        secondary_channel: '',
        secondary_game: '',
        listLoading: true,
        names: [],
        directives: {waves},
        layout: '',
        list: [],
        listLoading: false,
        names: [],
        hidlist: '',
        channel_mark_list_dia: [],
        getRowKeys(row) {
          return row.id
        },
      }
    },
    created() {
      this.routeWithParam()  //带参跳转
      //this.initchannel()  //获取渠道
      this.pageChange(1);//初始化列表
    },
    methods: {
      searchTable(){
        this.pageChange(1);
      },//搜索应用
      pageChange(page){
        this.currentPage=page
        let tothis=this
        let param={
          page:page,
          limit:this.pageSize,
          app_name:this.secondary_game,
          app_guid:this.search_app_guid,
        }
        console.log('应用配置记录列表',param)
        listAppConfigInfoRecord(param).then(response=>{
          if(response.repcode===3000){
            this.hidlist=response.data
            this.list=response.data
            console.log('配置表发布记录',response.data)
            this.totalPages=response.total
          }else {
            tothis.$notify({
              title: '失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error=>{
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//分页切换
      clipboardSuccess() {
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1500
        })
      },//剪贴板复制成功
      handleView(value){
        console.log(value)
          //测试服  8089
       // this.link='http://system.tomatojoy.com/sdkapi?package_name='+value.package_name+'&channel_mark='+value.channel_mark
        this.link='http://system.tomatojoy.com:8330/tjsdk/getAppConfigInfoRecord?app_guid='+value.app_guid
        this.dialogForm=value
        this.getSpanArr(value.paramList)

        this.projectObject=value.paramList
        this.dialogVisible=true

      },//查看按钮
      routeWithParam() {
        let app_guid = this.$route.query.app_guid
        if (typeof(app_guid) != 'undefined') {
          this.search_app_guid = app_guid
        }
      },//带参跳转
      handleDelete(data) {
        let tothis = this
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateProjectConfig(data).then(response => {
            this.pageChange(this.currentPage);
          }).catch(rs => {
            tothis.$notify({
              title: '删除失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 2000
            })
          })
        })
      },//删除方法
      initchannel() {
        getChannel().then(response => {
          this.channel_mark_list_dia = response.data
        })
      }, //初始化渠道标记
      checkPermission,
      getSpanArr(data) {
        this.spanArr.length = 0
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            this.spanArr.push(1);
            this.pos = 0
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i].sdk_type === data[i - 1].sdk_type) {
              this.spanArr[this.pos] += 1;
              this.spanArr.push(0);
            } else {
              this.spanArr.push(1);
              this.pos = i;
            }
          }
        }
      },//获取合并单元格判断数据
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col

          }
        }
      },//合并单元格
    }
  }

</script>
<style>
  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 1px;
    margin-bottom: 5px;
  }

  #form-custom .el-form-item {
    margin-right: 250px;
  }

  .dia-input {
    width: 300px;
  }

  .demo-table-expand {
    font-size: 0;

  }

  .demo-table-expand label {
    width: 300px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
    border-bottom: #d3dce6 solid 1px;
  }

  .el-tabs__nav-scroll {
    width: 180px;
  }

</style>



