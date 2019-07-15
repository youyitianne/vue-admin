<template>
  <div class="app-container">
    <el-input v-model="searchPageName" placeholder="输入配置页名查找" style="width: 200px;margin-left: 40px"
              clearable></el-input>
    <el-button type="primary" style="margin-bottom: 20px;margin-left: 20px" @click="pageChange(1)">搜索</el-button>
    <el-button type="primary" style="margin-bottom: 20px;float: right;margin-right: 50px" @click="showCreateDialog">
      添加配置页
    </el-button>
    <el-table
      height="760"
      v-loading="listLoading"
      :data="tableList"
      :row-key='getRowKeys'
      fit
      stripe
      border
      highlight-current-row>
      <el-table-column label="配置页名" prop="config_name" align="center">
        <template slot-scope="scope">
          {{scope.row.sdk_page_name}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showSDKPageInfo(scope.row)"
                     v-if="checkPermission(['admin','director', 'operatorleader', 'operator'])">{{ "编辑" }}
          </el-button>
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
      :title="dialogName" :visible.sync="dialogFormVisible" width="80%" :close-on-click-modal=false>
      <el-form :model="config_page_info" ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
        <el-form-item label="配置页名称" prop="name" :rules="[{ required: true, message: '配置页名称不能为空'}]" label-width="200">
          <el-input v-model="config_page_info.name"></el-input>
        </el-form-item>
        <div></div>


        <!--筛选输入框-->
        <el-input placeholder="SDK类型筛选" v-model="sdk_type_filter_name"
                  style="width: 200px;margin-bottom: 10px" class="filter-item" clearable
                  @keyup.native="sdk_type_filter()"
                  @change="sdk_type_filter()"/>
        <!--多选框 sdk模版控制-->
        <el-checkbox-group v-model="sdk_type_checked" style="border-bottom: 15px" size="mini">
          <el-checkbox v-for="item in sdk_type_name_list" :label="item.sdk_type_name" :key="item.sdk_type_guid"
                       @change=""
                       :value=item border>
            <div class="grid-content bg-purple-light" style="width: 107px;margin-bottom: 15px">{{item.sdk_type_name}}
            </div>
          </el-checkbox>
        </el-checkbox-group>
        <br/>
        <!--标签页-->
        <el-tabs tab-position="left" style="width: 95%;background-color: #f4f4f5;height: 500px;padding: 1px" id="test1"
                 v-model="tabName"
                 @tab-click="tabNameClick" type="border-card">
          <el-tab-pane v-for="item in sdk_type_checked" :label="item" :key="item" :name="item"
                       style="font-size: 14px;font-family: Microsoft YaHei;width: 100%">
            <div name="pane_form" style="height: 500px;overflow: auto;">
              <a style="font: 20px Extra large;">{{sdk_type_name_title}}-{{sdk_type_version_title}}</a><br><br><br>
              <!--<el-divider content-position="right"></el-divider>-->
              <a style="font: 14px Extra Small;">参数名</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a style="font: 14px Extra Small;">参数</a>
              <br><br>
              <!--标签页内表单-->
              <el-form-item v-for="(domain, index) in tabList" :key="domain.sdk_param_type_guid+index"
                            style="margin-right: 1px"
                            v-model="page_name">
                <div style="width: 900px;padding-bottom: 30px">
                  <span
                    style="margin-right: 20px;font-size: 14px;font-family: Microsoft YaHei;width:200px;display: inline-block">
                    {{domain.sdk_param_type_name}}：
                  </span>
                  <el-input v-model="domain.sdk_param_value" style="width: 300px;margin-right: 25px"
                            v-if="domain.sdk_param_type_type!='3'"
                            placeholder="填写key"/>

                  <el-input v-model="domain.sdk_param_value"
                            style="width: 300px;margin-right: 25px;display: inline-block"
                            placeholder="填写key" disabled v-if="domain.sdk_param_type_type==='3'"/>
                  <el-select v-model="domain.sdk_param_value"
                             v-if="domain.sdk_param_type_type==='3'"
                             style="width: 300px;display: inline-block"
                             filterable
                             clearable
                             remote
                             :remote-method="remoteMethod"
                             placeholder="请输入关键词查询广告位"
                             value-key="placement_guid"
                             collapse-tags>
                    <el-option
                      v-for="item in placementList"
                      :key="item.placement_guid"
                      :label="item.placement_name"
                      :value="item.placement_id">
                    </el-option>
                  </el-select>

                </div>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="dialogStatus==='create'" @click="saveForm('ruleForm')">{{ '添加' }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {getSDKTypeMeth} from '@/api/sdkmanager_new/sdklisttable_new'
  import {getPlacementHandler} from '@/api/table/datamanager/newDataManager/placementData'
  import {
    addSDKPageMeth,
    getAllSDK,
    getSDKPage,
    getSDKPageInfo
  } from '@/api/sdkmanager_new/sdk_config_page'

  export default {
    data() {
      return {
        page_name: {},
        sdk_type_name_title: '',
        sdk_type_version_title: '',
        tabList: [],
        config_page_info: {
          name: ''
        },
        sdk_type_filter_name: '',
        sdkPage: {},
        dialogFormVisible: false,
        dialogName: 'SDK配置页',
        dialogStatus: 'create',
        pageSize: 30,
        totalPages: 0,
        currentPage: 1,
        listLoading: false,
        list: [],
        getRowKeys(row) {
          return row.id
        },
        sdk_type_checked: [],
        sdk_type_name_list: [],
        hid_sdk_type_name_list: [],
        sdk_param_type_list: {},
        tabName: '',
        checkedTabList: [],
        placementList: [],
        hidplacementList: [],
        placementList_hash: [],
        form_init_placementList: [],
        searchPageName: '',
        tableList: [],
        hid_sdk_param_type_list: []
      }
    },
    created() {
      this.pageChange(1)//初始化sdk配置页
      this.init_sdk_type();//初始化sdk类型
      this.getPlacementMeth()//初始化广告位
    },
    methods: {
      showSDKPageInfo(param) {
        let tothis = this
        let getParam = {
          sdk_page_guid: param.sdk_page_guid
        }
        console.log("sdk信息查询参数:", getParam)
        getSDKPageInfo(getParam).then(response => {
          if (response.repcode === 3000) {
            //重置对话框
            this.resetForm()
            this.sdk_type_checked = response.checked
            this.config_page_info.name = param.sdk_page_name
            let valueList = response.param
            for (let i = 0; i < this.sdk_param_type_list.length; i++) {
              for (let j = 0; j < valueList.length; j++) {
                if (valueList[j].sdk_param_type_guid === this.sdk_param_type_list[i].sdk_param_type_guid) {
                  this.sdk_param_type_list[i].sdk_param_value = valueList[j].sdk_param_value
                }
              }
            }
            this.dialogStatus = "update"
            this.dialogFormVisible = true;
            console.log(response)
          } else {
            console.error(response)
          }
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//编辑sdk配置页
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
          name: this.searchPageName,
        }
        console.log("sdk配置页查询参数", param)
        getSDKPage(param).then(response => {
          if (response.repcode === 3000) {
            this.tableList = response.data
            console.log('sdk配置页', response.data)
            this.totalPages = response.total
          } else {
            console.error(response)
          }
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//分页切换
      tabNameClick(tab, event) {
        //重置选项卡
        this.tabList = []
        //遍历sdk类型列表,找到版本号 名称和sdk_type_guid
        let tab_sdk_type_guid = ''
        for (let i = 0; i < this.hid_sdk_type_name_list.length; i++) {
          if (this.hid_sdk_type_name_list[i].sdk_type_name === tab.label) {
            this.sdk_type_name_title = tab.label
            this.sdk_type_version_title = this.hid_sdk_type_name_list[i].sdk_type_version
            tab_sdk_type_guid = this.hid_sdk_type_name_list[i].sdk_type_guid
            break
          }
        }
        //遍历sdk参数类型
        for (let i = 0; i < this.sdk_param_type_list.length; i++) {
          if (this.sdk_param_type_list[i].sdk_type_guid === tab_sdk_type_guid) {
            this.tabList.push(this.sdk_param_type_list[i])
          }
        }
        console.log('选项卡列表', this.tabList)
        this.hidplacementList = this.placementList_hash[tab.label];
        //tab切换时清空原下拉框
        this.placementList = [];
        console.log('根据tab展示的广告位列表', this.hidplacementList)
      },//tab标签按钮点击事件
      sdk_type_filter() {
        console.log(this.sdk_type_filter_name)
        this.sdk_type_name_list = []
        for (let i = 0; i < this.hid_sdk_type_name_list.length; i++) {
          if (this.hid_sdk_type_name_list[i].sdk_type_name.search(this.sdk_type_filter_name) != -1 || this.hid_sdk_type_name_list[i].sdk_type_tag.search(this.sdk_type_filter_name) != -1) {
            this.sdk_type_name_list.push(this.hid_sdk_type_name_list[i])
          }
        }
      },//sdk类型表筛选
      saveForm(formName) {
        let tothis = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let paramList = []
            //遍历sdk参数类型表
            for (let i = 0; i < this.sdk_param_type_list.length; i++) {
              if (typeof (this.sdk_param_type_list[i].sdk_param_value) != 'undefined' && this.sdk_param_type_list[i].sdk_param_value != '') {
                paramList.push(this.sdk_param_type_list[i])
              }
            }
            //遍历sdk类型表
            let checked = []
            for (let i = 0; i < this.hid_sdk_type_name_list.length; i++) {
              for (let j = 0; j < this.sdk_type_checked.length; j++) {
                if (this.sdk_type_checked[j] === this.hid_sdk_type_name_list[i].sdk_type_name) {
                  checked.push(this.hid_sdk_type_name_list[i])
                }
              }
            }
            let form = {
              name: this.config_page_info.name,
              checked: checked,
              paramList: paramList
            }
            console.log('创建配置页参数', form)
            addSDKPageMeth(form).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '创建配置页成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                console.error(response)
              }
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '失败',
                message: '添加配置页失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        });
      },//提交sdk配置表
      resetForm() {
        this.sdk_type_filter_name = ''
        this.sdk_type_checked = []
        this.sdk_type_name_list = this.hid_sdk_type_name_list
        for (let i = 0; i < this.sdk_param_type_list.length; i++) {
          this.sdk_param_type_list[i].sdk_param_value = ''
        }
        this.$nextTick(() => {
          this.$refs['ruleForm'].clearValidate()
        })
      },//重置sdk配置表form
      showCreateDialog() {
        this.resetForm()
        this.dialogStatus = "create"
        this.dialogFormVisible = true;
      },//添加sdk配置表展示
      remoteMethod(query) {
        if (query !== '') {
          setTimeout(() => {
            this.placementList = this.hidplacementList.filter(item => {
              return item.placement_name.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.placementList = [];
        }
        this.placementList = this.placementList.concat(this.form_init_placementList)
      },//选择器远程搜索
      init_sdk_type() {
        let tothis = this
        getAllSDK().then(response => {
          if (response.repcode === 3000) {
            this.sdk_type_name_list = response.sdkType
            this.hid_sdk_type_name_list = response.sdkType
            console.log("sdk类型列表", response.sdkType)
            this.sdk_param_type_list = response.sdkParamType
            this.hid_sdk_param_type_list = response.sdkParamType
            console.log("sdk类型参数列表", response.sdkParamType)
          } else {
            tothis.$notify({
              title: '失败',
              message: '初始化SDK类型失败,请刷新页面后重试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '初始化SDK类型失败,请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//初始化sdk类型
      getPlacementMeth() {
        getPlacementHandler().then(response => {
          if (response.repcode === 3000) {
            console.log('广告位列表', response.json)
            this.placementList_hash = response.json
          } else {
            console.log(response)
          }
        }).catch(error => {
          console.log(error)
          this.$message({
            type: 'error',
            message: `初始化广告位失败！`
          });
        })
      },//初始化广告位列表
      checkPermission
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

  .demo-table-expand label {
    width: 300px;
    color: #99a9bf;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
