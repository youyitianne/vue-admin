<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <span style="margin-left: 15px;margin-right: 5px">应用名:</span>
      <el-input v-model="secondary_game" style="width: 200px" class="filter-item" clearable/>
      <span style="margin-left: 15px;margin-right: 5px">渠道:</span>
      <el-input v-model="secondary_channel" style="width: 200px" class="filter-item" clearable/>
      <span style="margin-left: 15px;margin-right: 5px">包名:</span>
      <el-input  v-model="secondary_package" style="width: 200px" class="filter-item" clearable/>
      <el-button style="margin-left: 20px" @click="searchTable">搜索</el-button>
      <el-checkbox v-model="checked" border style="margin-left: 15px" @change="getDatawithParam">展示最新配置表 </el-checkbox>
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
      <el-table-column label="发布时间" prop="date1" width="200">
      </el-table-column>
      <el-table-column label="应用名" prop="app_name" width="150">
      </el-table-column>
      <el-table-column label="渠道" prop="channel_mark" width="100px">
      </el-table-column>
      <el-table-column label="包名" prop="package_name" width="300px">
      </el-table-column>
      <el-table-column label="外部版本-在线" prop="version_update" width="120px">
      </el-table-column>
      <el-table-column label="内部版本-更新" prop="versioncode_update_version"  width="120px">
      </el-table-column>
      <el-table-column label="备注" prop="note">
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)" v-if="checkPermission(['director','admin','sdksuport','operatorleader'])">{{ "删除" }}</el-button>
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
          <span>{{ dialogForm.date1}}</span>
        </el-form-item>
        <el-form-item label="出表人">
          <span>{{ dialogForm.publisher}}</span>
        </el-form-item>
        <el-form-item label="游戏名:">
          <span>{{ dialogForm.app_name }}</span>
        </el-form-item>
        <el-form-item label="包名:">
          <span>{{ dialogForm.package_name }}</span>
        </el-form-item>
        <el-form-item label="渠道标记:">
          <span>{{ dialogForm.channel_mark }}</span>
        </el-form-item>
        <el-form-item label="外部版本-在线:">
          <span>{{ dialogForm.version_online }}</span>
        </el-form-item>
        <el-form-item label="内部版本-在线:">
          <span>{{ dialogForm.versioncode_online_version }}</span>
        </el-form-item>
        <el-form-item label="外部版本-更新:">
          <span>{{ dialogForm.version_update }}</span>
        </el-form-item>
        <el-form-item label="内部版本_更新:">
          <span>{{ dialogForm.versioncode_update_version }}</span>
        </el-form-item>
        <el-form-item label="icon:">
          <span>{{ dialogForm.icon }}</span>
        </el-form-item>
        <el-form-item label="splash:">
          <span>{{ dialogForm.splash }}</span>
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
        <el-form-item label="备注:">
          <span>{{ dialogForm.note }}</span>
        </el-form-item>
      </el-form>
      <el-table
        stripe
        border
        :data="projectObject.paramter"
        style="width: 90%;margin-bottom: 30px;margin-top: 30px"
        :span-method="objectSpanMethod">
        <el-table-column
          prop="mark"
          label="模块名"
          style="width: 200px">
        </el-table-column>
        <el-table-column
          prop="param_name1"
          label="参数名"
          style="width: 300px">
        </el-table-column>
        <el-table-column
          prop="param"
          label="参数">
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
  import {parseTime} from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  //import {getSdkTemplate,getChannel} from '@/api/table/sdkmanager/projectconfigtable'
  import {updateProjectConfig,getProjectConfigPublish,getResourceName,getProject,getProjectPublishLimitMeth} from '@/api/table/sdkmanager/projectconfigtable_publish'
  import store from '@/store'
  import clipboard from '@/directive/clipboard/index' // use clipboard by v-directive


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
        pageSize:30,
        totalPages:0,
        currentPage:1,
        link:'',
        dialogForm:{},
        projectObject:{},
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
        list: null,
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
      this.pageChange(1);
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
          appName:this.secondary_game,
          channelName:this.secondary_channel,
          packageName:this.secondary_package,
        }
        getProjectPublishLimitMeth(param).then(response=>{
          if(response.repcode===3000){
            this.hidlist=response.data
            this.getDatawithParam();
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
        this.link='http://system.tomatojoy.com:8089/sdkapi?package_name='+value.package_name+'&channel_mark='+value.channel_mark
        this.dialogForm=value
        this.getSpanArr(value.paramter)
        this.projectObject=value
        this.dialogVisible=true

      },//查看按钮
      routeWithParam() {
        let name = this.$route.query.package_name
        if (typeof(name) != 'undefined') {
          this.secondary_package = name
        }
        let channel = this.$route.query.channel
        if (typeof(channel) != 'undefined') {
          this.secondary_channel = channel
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
      getDatawithParam() {
        this.listLoading = true
        let param = this.secondary_channel
        let data = []
        if (param!=''){
          for (let i = 0; i < this.hidlist.length; i++) {
            if (this.hidlist[i].channel_mark.search(param) != -1) {
              data.push(this.hidlist[i])
            }
          }
        } else {
          data=this.hidlist
        }


        let game = this.secondary_game
        let data1 = []
        if (game!=''){
          for (let i = 0; i < data.length; i++) {
            if (data[i].app_name.search(game) != -1) {
              data1.push(data[i])
            }
          }
        } else {
          data1=data
        }


        let statuse = this.checked       //最新
        let data2 = []
        if (statuse === true) {
          for (let i = 0; i < data1.length; i++) {
            let flag = true
            for (let j = 0; j < data2.length; j++) {
              if (data1[i].channel_mark === data2[j].channel_mark && data1[i].package_name === data2[j].package_name) {
                flag = false
              }
            }
            if (flag) {
              data2.push(data1[i])
            }
          }
        } else {
          data2 = data1
        }

        let packageName = this.secondary_package
        let data3 = []
        if (packageName!=''){
          for (let i = 0; i < data2.length; i++) {
            if (data2[i].package_name.search(packageName) != -1) {
              data3.push(data2[i])
            }
          }
        } else {
          data3=data2
        }

        this.list = data3
        this.listLoading = false
      }, //table二次筛选
      checkPermission,
      getSpanArr(data) {
        this.spanArr.length = 0
        for (let i = 0; i < data.length; i++) {
          if (i === 0) {
            this.spanArr.push(1);
            this.pos = 0
          } else {
            // 判断当前元素与上一个元素是否相同
            if (data[i].mark === data[i - 1].mark) {
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



