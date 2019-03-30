<template>
  <div class="components-container">
    <el-button @click="ipEdit()" type="danger" style="margin: 20px">同步IP</el-button>
    <el-dialog
      title="IP同步"
      :visible.sync="ipDialog"
      width="30%">
      <el-form ref="ipForm" :model="ipForm" label-width="200px" v-loading="ipDialogLoading">
        <el-form-item label="原保存IP : ">
          <el-input style="width: 200px" disabled v-model="ipForm.orginalIP"></el-input>
        </el-form-item>
        <el-form-item label="本地IP : ">
          <el-input style="width: 200px"  v-model="ipForm.loaclIP"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="synchro" style="margin-left: 60%">同步</el-button>
    </el-dialog>
    <el-button @click="searchDialog=true" type="primary" style="margin: 20px">搜索应用</el-button>
    <el-dialog
      title="搜索应用"
      :visible.sync="searchDialog"
      width="30%">
      <el-form ref="fetchForm" :model="fetchForm" label-width="200px">
        <el-form-item label="应用名 : ">
          <el-input style="width: 200px" v-model="fetchForm.appName" clearable></el-input>
        </el-form-item>
        <el-form-item label="屏蔽key : ">
          <el-input style="width: 200px" v-model="fetchForm.uid" clearable></el-input>
        </el-form-item>
        <el-form-item label="包名 : ">
          <el-input style="width: 200px" v-model="fetchForm.packageName" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="searchData">搜索</el-button>
       </span>
    </el-dialog>
    <el-card shadow="always">
      <el-table
        height="730"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="appName"
          label="应用名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="uid"
          label="屏蔽key"
          width="300">
        </el-table-column>
        <el-table-column
          prop="packageName"
          label="应用包名">
        </el-table-column>
        <el-table-column
          prop="channel"
          label="渠道">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" size="mini">测试模式</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="def_paging"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalPages"
        :current-page="def_currentpage"
        @current-change="pageChange">
      </el-pagination>
      <el-pagination
        v-if="search_paging"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="search_totalPages"
        :current-page="search_currentpage"
        @current-change="search_pageChange">
      </el-pagination>

    </el-card>
    <el-dialog
      title="测试模式"
      :visible.sync="editDialog"
      width="30%">
      <el-form ref="testModeForm" :model="testModeForm" label-width="200px" v-loading="testModeLoading">
        <el-form-item label="屏蔽key : ">
          <el-input style="width: 200px" disabled v-model="testModeForm.uid"></el-input>
        </el-form-item>
        <el-form-item label="应用名 : ">
          <el-input style="width: 200px" disabled v-model="testModeForm.appName"></el-input>
        </el-form-item>
        <el-form-item label="应用包名 : ">
          <el-input style="width: 200px" disabled v-model="testModeForm.packageName"></el-input>
        </el-form-item>
        <el-form-item label="渠道 : ">
          <el-input style="width: 200px" disabled v-model="testModeForm.channel"></el-input>
        </el-form-item>
        <el-form-item label="测试模式 : ">
          <el-switch
            v-model="testModeForm.mode"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="on"
            inactive-value="off">
          </el-switch>
        </el-form-item>
        <el-form-item label="广告开关 : ">
          <el-switch
            v-model="testModeForm.ad"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="on"
            inactive-value="off">
          </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="onSubmit">确定修改</el-button>
  </span>
    </el-dialog>
    <remote-js src="http://pv.sohu.com/cityjson?ie=utf-8"></remote-js>
  </div>
</template>

<script>
  import {getToken} from '@/utils/auth'
  import {getip, postip, getapplist, searchapp, getparams, addparams, editparams} from '@/api/shieldingsystem/testmode'

  export default {
    components: {
      'remote-js': {
        render(createElement) {
          return createElement('script', {attrs: {type: 'text/javascript', src: this.src}});
        },
        props: {
          src: {type: String, required: true},
        },
      },
    },
    name: 'DropzoneDemo',
    data() {
      return {
        def_currentpage: 1,
        search_currentpage: 1,
        testModeLoading: false,
        search_totalPages: 0,
        def_paging: true,
        search_paging: false,
        ipDialogLoading: false,
        searchDialog: false,
        pageSize: 20,
        totalPages: 0,
        ipDialog: false,
        fetchForm: {
          appName: '',
          uid: '',
          packageName: ''
        },
        ipForm: {
          orginalIP: '',
          loaclIP: ''
        },
        testModeForm: {
          id: 0,
          uid: '',
          appName: '',
          packageName: '',
          channel: '',
          mode: '',
          ad: ''
        },
        editDialog: false,
        tableData: []
      }
    },
    mounted() {
      this.initTable();
    },
    methods: {
      searchAppList(page) {
        let param = {
          appName: this.fetchForm.appName,
          appId: this.fetchForm.uid,
          appPackageName: this.fetchForm.packageName,
          page: page,
          limit: this.pageSize
        }
        searchapp(param).then(res => {
          let json = JSON.parse(res.data)
          console.log(json)
          this.tableData = json.rows
          this.search_totalPages = json.total
        }).catch(err => {
          this.$message({
            message: '搜索失败！',
            type: 'warning'
          });
        })
      },//搜索应用列表
      search_pageChange(page) {
        this.def_currentpage = page
        this.searchAppList(page)
      },//搜索事件分页
      searchData() {
        this.def_currentpage=1
        this.searchAppList(1)
        this.def_paging = false
        this.search_paging = true
        this.searchDialog = false
      },//搜索应用事件
      pageChange(page) {
        this.def_currentpage = page
        this.listapplist(page)
      },//分页改变事件
      ipEdit() {
        this.ipDialogLoading = true
        this.ipDialog = true
        this.ipForm.loaclIP = returnCitySN["cip"]
        getip().then(res => {
          let json = JSON.parse(res.data)
          this.ipForm.orginalIP = json.data.ip
          this.ipDialogLoading = false
        }).catch(err => {
          this.$message({
            message: '获取原IP失败！',
            type: 'warning'
          });
          this.ipDialogLoading = false
        })
      },//同步ip按钮
      synchro() {
        if (this.ipDialogLoading == true) {
          return
        }
        this.ipDialogLoading = true
        let tothis = this
        postip({ip: this.ipForm.loaclIP}).then(res => {
          if (res.repcode == 3000) {
            tothis.$notify({
              title: '提示',
              message: '修改IP成功',
              type: 'success'
            });
            this.ipDialogLoading = false
            this.ipDialog = false
          } else {
            tothis.$notify({
              title: '提示',
              type: 'warning',
              message: '修改IP失败',
            });
            this.ipDialogLoading = false
          }

        }).catch(err => {
          this.$message({
            message: '修改IP失败！',
            type: 'warning'
          });
        });
      },//同步ip事件
      onSubmit() {
        if (this.testModeLoading == true) {
          return
        }
        this.testModeLoading = true
        let tothis = this
        let addparamsdata = {
          appId: this.testModeForm.id,
          system: 'test',
          status: {
            mode: this.testModeForm.mode,
            ad: this.testModeForm.ad,
          }
        }
        console.log(addparamsdata)
        editparams(addparamsdata).then(res => {
          if (res.repcode == 3000) {
            tothis.$notify({
              title: '提示',
              message: '修改测试模式成功',
              type: 'success'
            });
            this.testModeLoading = false
            this.editDialog = false
          } else {
            tothis.$notify({
              title: '提示',
              type: 'warning',
              message: '修改测试模式失败',
            });
            this.testModeLoading = false
          }
          this.flushList()
        }).catch(err => {
          console.error(err)
          tothis.$notify({
            title: '提示',
            type: 'warning',
            message: '修改测试模式失败',
          });
          this.testModeLoading = false
        })
      },//测试模式修改事件
      initTable() {
        this.def_currentpage=1
        this.listapplist(1)
      },//初始化应用列表
      edit(param) {

        this.testModeLoading = true
        let tothis = this
        this.testModeForm.mode = 'off'
        this.testModeForm.ad = 'off'
        this.testModeForm.uid = param.uid
        this.testModeForm.appName = param.appName
        this.testModeForm.packageName = param.packageName
        this.testModeForm.channel = param.channel
        let getparamsdata = {
          appId: param.uid
        }
        getparams(getparamsdata).then(res => {
          let json = JSON.parse(res.data)
          let list = json.rows
          console.log(list)
          let testswitch = {}
          let testmodeid = 0;
          let flag = true
          for (let i = 0; i < list.length; i++) {
            if (list[i].system == 'test') {
              flag = false
              testswitch = list[i].status
              testmodeid = list[i].id
              break;
            }
          }
          if (flag) {
            //没有测试模式
            //默认添加
            let addparamsdata = {
              appId: param.uid,
              system: 'test',
              status: {
                mode: 'off',
                ad: 'off'
              }
            }
            tothis.$notify({
              title: '提示',
              type: 'warning',
              message: '该应用无测试模式,正在添加默认测试模式-----',
            });
            addparams(addparamsdata).then(res => {
              if (res.repcode == 3000) {
                tothis.$notify({
                  title: '提示',
                  message: '添加默认测试模式成功,请重新编辑测试模式',
                  type: 'success'
                });
                this.edit(param)
              } else {
                tothis.$notify({
                  title: '提示',
                  type: 'warning',
                  message: '添加默认测试模式失败,刷新试试',
                });
              }
              this.flushList()
            }).catch(err => {
              console.error(err)
              tothis.$notify({
                title: '提示',
                type: 'warning',
                message: '添加默认测试模式失败,刷新试试',
              });
            })
          } else {

            //有测试模式
            //读取开关状态
            let json_testswitch = JSON.parse(testswitch)
            this.testModeForm.mode = json_testswitch.mode
            this.testModeForm.ad = json_testswitch.ad
            this.testModeForm.id = testmodeid
            this.testModeLoading = false
            this.editDialog = true
          }

        }).catch(err => {
          console.error(err)
          this.$message({
            message: '获取应用参数失败！',
            type: 'warning'
          });
        })
      },//测试模式编辑按钮
      listapplist(page) {
        let param = {
          page: page,
          limit: this.pageSize
        }
        getapplist(param).then(res => {
          let json = JSON.parse(res.data)

          this.tableData = json.rows
          this.totalPages = json.total
        }).catch(err => {
          this.$message({
            message: '初始化表格失败！',
            type: 'warning'
          });
        })
      },//获取应用列表 默认
      flushList() {
        if (this.def_paging) {
          //默认搜索列表
          this.pageChange(this.def_currentpage)
          //this.initTable()
        } else {
          //搜索应用列表
          //this.searchData()
          this.search_pageChange(this.def_currentpage)
        }
      } //刷新列表
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .filter_input {
    margin-right: 15px;
  }

  .filter_text {
    margin-right: 7px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 14px Base
  }

  #filter_title {
    margin-right: 40px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 13px Small;
  }

  .ts-title {
    font-size: 15px;
    font-weight: bolder
  }
</style>


