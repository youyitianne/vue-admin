<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-select v-model="searchPlatform"
                 style="width: 200px"
                 size="mini"
                 filterable
                 clearable
                 placeholder="请选择广告平台"
                 value-key="sdk_name"
                 collapse-tags>
        <el-option
          v-for="item in platfromDialogList"
          :key="item.sdk_mark"
          :label="item.sdk_mark"
          :value="item.sdk_mark">
        </el-option>
      </el-select>

      <el-input placeholder="根据广告位ID查找" v-model="searchPlacementId" style="width: 200px;margin-left: 5px"
                class="filter-item" size="mini"
                clearable/>
      <el-input placeholder="根据应用名查找" v-model="searchAppName" style="width: 200px;margin-left: 5px" class="filter-item"
                size="mini"
                clearable/>
      <el-input placeholder="根据渠道名查找" v-model="searchChannelName" style="width: 200px;margin-left: 5px"
                class="filter-item" size="mini"
                clearable/>
      <el-button @click="searchMeth" size="mini" style="margin-left: 20px" :loading="listLoading" >搜索</el-button>
      <el-button @click="showAddPlacementMeth" size="mini" style="margin-bottom: 15px;float: right" type="primary">
        添加广告位
      </el-button>

      <el-table
        height="750"
        v-loading="listLoading"
        :data="tableList"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row>
        <el-table-column label="广告位名称" align="center" prop="placement_name" >
          <template slot-scope="scope">
            <span>{{ scope.row.placement_name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="广告位ID" align="center" prop="placement_id" width="320">
          <template slot-scope="scope">
            <span>{{ scope.row.placement_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="广告平台" align="center" prop="sdk_mark" width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.sdk_mark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="渠道" align="center" prop="channel_mark" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.channel_mark }}</span>
          </template>
        </el-table-column>

        <el-table-column label="所属应用名称" align="center" prop="app_name" >
          <template slot-scope="scope">
            <span>{{ scope.row.app_name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="广告类型" align="center" prop="adtype_name" width="120">
          <template slot-scope="scope">
            {{ scope.row.adtype_name }}
          </template>
        </el-table-column>

        <!--<el-table-column label="广告平台ID" align="center" prop="date" width="100">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{ scope.row.platform_id }}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column label="所属应用ID" align="center" prop="install" width="300">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{ scope.row.app_id }}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="showRecentData(scope.row)" v-if="false">{{ "查看近日数据" }}
            </el-button>
            <el-button type="success" size="mini" @click="showUpdateMeth(scope.row)">{{ "编辑" }}
            </el-button>
            <el-button type="danger" size="mini" @click="deleteMeth(scope.row)">{{ "删除" }}
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
        title="广告位信息"
        :close-on-click-modal=false
        :visible.sync="placementDialog"
        width="600px">
        <el-form ref="dataForm" :model="placement" label-position="left" label-width="140px"
                 style="width: 400px; margin-left:50px;">
          <el-form-item label="广告平台" :rules="{required: true, message: '广告平台不能为空', trigger: 'blur'}"
                        prop="platform">
            <el-select v-model="placement.platform"
                       style="width: 260px"
                       filterable
                       placeholder="请选择广告平台"
                       value-key="sdk_name"
                       collapse-tags>
              <el-option
                v-for="item in platfromDialogList"
                :key="item.sdk_name"
                :label="item.sdk_mark"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告位ID" :rules="{required: true, message: '广告位ID不能为空', trigger: 'blur'}"
                        prop="placement_id">
            <el-input v-model="placement.placement_id" v-if="this.placementState==='add'"/>
            <el-input v-model="placement.placement_id" disabled="" v-if="this.placementState==='edit'"/>
          </el-form-item>
          <el-form-item label="广告位名称" :rules="{required: true, message: '广告位名称不能为空', trigger: 'blur'}"
                        prop="placement_name">
            <el-input v-model="placement.placement_name"/>
          </el-form-item>
          <el-form-item label="广告位类型" prop="placement_type"     :rules="{required: true, message: '广告类型不能为空', trigger: 'blur'}">

          <el-select v-model="placement.placement_type"
                     style="width: 260px"
                     filterable
                     placeholder="请选择广告位类型"
                     value-key="name"
                     collapse-tags>
            <el-option
              v-for="item in adtypeList"
              :key="item.adtype_guid"
              :label="item.adtype_name"
              :value="item.adtype_guid">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="所属应用" :rules="{required: true, message: '所属应用不能为空', trigger: 'blur'}"
                        prop="app" v-if="false">
            <el-select v-model="placement.app"
                       style="width: 260px"
                       filterable
                       placeholder="请选择所属应用"
                       value-key="sdkguid"
                       collapse-tags>
              <el-option
                v-for="item in appDialogList"
                :key="item.sdkguid"
                :label="item.selectName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addPlacementMeth()" v-if="this.placementState==='add'">确定添加</el-button>
              <el-button type="primary" @click="updateMeth()" v-if="this.placementState==='edit'">确定修改</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>
<script>
  import {
    getPlatformHandler,
    getAppHandler,
    addPlacementHandler,
    delPlacementHandler,
    editPlacementHandler,
    getPlacementHandler
  } from '@/api/table/datamanager/newDataManager/placementData'
  import {getAdtypeHandler} from '@/api/table/datamanager/newDataManager/advertiseTypeData'
  export default {
    data() {
      return {
        pageSize: 20,
        totalPages: 0,
        currentPage: 1,
        placementState: 'add',
        placementDialog: false,
        placement: {},
        tableList: [],
        platfromDialogList: [],
        appDialogList: [],
        searchPlatform: '',
        searchPlacementId: '',
        searchAppName: '',
        searchChannelName: '',
        listLoading:false,
        adtypeList:[],
      }
    },
    mounted() {
      this.routerWithParam()
      this.listPlatfrom()
      //this.listApp()
      this.pageChange(1);
      this.listAdtype()
    },
    methods: {
      showRecentData(param){
        console.log('跳转参数',param)
        let routeData = this.$router.resolve({
          name: 'guanggaoshuju',
          query: {placement_guid: param.placement_guid}
        });
        window.open(routeData.href, '_blank');
      },//查看近日广告数据
      routerWithParam(){
        let placement_id = this.$route.query.placement_id
        if (typeof(placement_id) != 'undefined') {
          this.searchPlacementId = placement_id
        }
      },
      listAdtype(){
        getAdtypeHandler().then(response=>{
          if (response.repcode===3000){
            console.log('广告位类型列表',response.data)
            this.adtypeList=response.data
          } else {
            console.error(response)
          }
        }).catch(error=>{
          console.log(error)
          this.$message({
            type: 'error',
            message: `添加广告类型失败！`
          });
        })
      },
      searchMeth(){
        this.pageChange(1)
      },
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
          platform: this.searchPlatform,
          placementid: this.searchPlacementId,
          appName: this.searchAppName,
          channelName: this.searchChannelName,
        }
        this.listLoading = true
        getPlacementHandler(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.tableList = response.data
            console.log("广告位列表--------", this.tableList)
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
      updateMeth() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let param = {
              placement_guid: this.placement.placement_guid,
              placement_id: this.placement.placement_id,
              placement_name: this.placement.placement_name,
              placement_type: this.placement.placement_type,
              app_id: this.placement.app.sdkguid,
              platform_id: this.placement.platform.sdk_template_guid,
            }
            console.log("编辑提交参数", param)
            editPlacementHandler(param).then(response => {
              if (response.repcode === 3000) {
                this.$message({
                  type: 'success',
                  message: `编辑广告位成功！`
                });
                this.pageChange(this.currentPage)
                this.placementDialog = false
              } else {
                console.error(response)
              }
            }).catch(error => {
              console.log(error)
              this.$message({
                type: 'error',
                message: `编辑广告位失败！`
              });
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },//编辑广告位方法
      showUpdateMeth(param) {
        this.placement = {
          placement_guid: param.placement_guid,
          placement_name: param.placement_name,
          placement_type: param.placement_type,
          placement_id: param.placement_id,
          platform: {},
          app: {},
        }
        for (let i = 0; i < this.appDialogList.length; i++) {
          if (this.appDialogList[i].sdkguid === param.app_id) {
            this.placement.app = this.appDialogList[i]
            break
          }
        }
        for (let i = 0; i < this.platfromDialogList.length; i++) {
          if (this.platfromDialogList[i].sdk_template_guid + '' === param.platform_id) {
            this.placement.platform = this.platfromDialogList[i]
            break
          }
        }
        console.log(this.placement)
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.placementState = 'edit'
        this.placementDialog = true
        console.log('编辑广告位信息', param)
      },//编辑广告位
      deleteMeth(param) {
        this.$confirm('确认删除？')
          .then(_ => {
            console.log(param)
            delPlacementHandler(param).then(response => {
              if (response.repcode === 3000) {
                this.$message({
                  type: 'success',
                  message: `删除广告位成功！`
                });
                this.pageChange(this.currentPage)
              } else {
                console.error(response)
              }
            }).catch(error => {
              console.error(error)
              this.$message({
                type: 'error',
                message: `删除广告位失败！`
              });
            })
          })
          .catch(_ => {
          });
      },//删除广告位
      addPlacementMeth() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let param = {
              placement_id: this.placement.placement_id,
              placement_name: this.placement.placement_name,
              placement_type: this.placement.placement_type.adtype_guid,
              app_id: this.placement.app.sdkguid,
              platform_id: this.placement.platform.sdk_template_guid,
            }
            console.log('添加广告位参数',param)
            addPlacementHandler(param).then(response => {
              if (response.repcode === 3000) {
                this.$message({
                  type: 'success',
                  message: `添加广告位成功！`
                });
                this.pageChange(this.currentPage)
                this.placementDialog = false
              } else {
                console.error(response)
                this.$message({
                  type: 'error',
                  message: `添加广告位失败，有重复！`
                });
              }
            }).catch(error => {
              console.log(error)
              this.$message({
                type: 'error',
                message: `添加广告位失败！`
              });
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },//添加广告位
      showAddPlacementMeth() {
        this.placement = {
          app: {},
          platform: {},
          placement_type: '',
        }
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        if (this.platfromDialogList.length > 0) {
          console.log(this.platfromDialogList[0])
          this.placement.platform = this.platfromDialogList[0]
        }
        if (this.appDialogList.length > 0) {
          console.log(this.appDialogList[0])
          this.placement.app = this.appDialogList[0]
        }
        if (this.adtypeList.length > 0) {
          console.log(this.adtypeList[0])
          this.placement.placement_type = this.adtypeList[0]
        }
        this.placementState = 'add'
        this.placementDialog = true
      },//广告位对话框弹出
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
      listApp() {
        getAppHandler().then(response => {
          if (response.repcode === 3000) {
            console.log('应用列表', response.data)
            this.appDialogList = response.data
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
    }
  }
</script>
