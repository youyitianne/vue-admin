<template>
  <div class="app-container">
    <el-button @click="showAddAdvertisingInfo()" style="margin-bottom: 20px">添加广告位</el-button>
    <el-dialog
      :close-on-click-modal=false
      append-to-body
      width="800px"
      title="添加广告位"
      :visible.sync="addAdvertisingIdDialogVisible">
      <el-form ref="advertisingInfo" :model="advertisingInfo" label-position="left" label-width="150px" :inline="true"
               style="margin-left:50px;" status-icon id="form-custom">
        <el-form-item label="应用名" :rules="{required: true, message: '应用名不能为空', trigger: 'blur'}"
                      prop="app_id">
          <el-select v-model="advertisingInfo.app_id" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in AppInfoList"
              :key="item.app_id"
              :label="item.app_name"
              :value="item.app_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="渠道名" :rules="{required: true, message: '渠道名不能为空', trigger: 'blur'}"
                      prop="channel_id">
          <el-select v-model="advertisingInfo.channel_id" placeholder="请选择" filterable clearable>
            <el-option
              v-for="item in ChannelInfoList"
              :key="item.channel_id"
              :label="item.channel_name"
              :value="item.channel_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="广告位名称" :rules="{required: true, message: '广告位名称不能为空', trigger: 'blur'}"
                      prop="advertising_name">
          <el-input clearable style="width: 200px" v-model="advertisingInfo.advertising_name"></el-input>
        </el-form-item>

        <el-form-item label="广告位ID" :rules="{required: true, message: '广告位ID不能为空', trigger: 'blur'}"
                      prop="advertising_id">
          <el-input clearable style="width: 200px" v-model="advertisingInfo.advertising_id"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAdvertisingIdDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addAdvertisingInfo()" :loading="adButtonLoading" v-if="this.dialogState==='add'">确定添加</el-button>
        <el-button type="primary" @click="editAdvertisingInfo()" :loading="adButtonLoading" v-if="this.dialogState==='edit'">确定编辑</el-button>
      </div>
    </el-dialog>
    <template>
      <el-table
        type="index"
        highlight-current-row
        :data="advertisingInfolist"
        stripe
        border
        height="750px"
        style="width: 100%">
        <el-table-column
          width="100"
          prop="advertisingInfo_id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="app_name"
          width="200"
          label="应用名">
        </el-table-column>
        <el-table-column
          width="200"
          prop="channel_name"
          label="渠道名">
        </el-table-column>
        <el-table-column
          prop="advertising_name"
          label="广告位名称"
          width="380">
        </el-table-column>
        <el-table-column
          prop="advertising_id"
          label="广告位ID">
        </el-table-column>
        <el-table-column
          label="操作"
          width="350">
          <template slot-scope="scope">
            <el-button @click="showEditAdvertisingInfo(scope.row)" type="success" :loading="delbuttonLoading" style="margin-right: 20px" size="mini">编辑</el-button>
            <el-button @click="delAdvertisingInfo(scope.row)" type="danger" :loading="delbuttonLoading" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
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
  import {mapGetters} from 'vuex'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {listChannelMeth,listAppMeth,listAdvertisingMeth,addAdvertisingMeth,delAdvertisingMeth,updateAdvertisingMeth} from '@/api/cooperation/co_advertising'

  export default {
    data() {
      return {
        dialogState:'add',
        expands: [],
        getRowKeys(row) {
          return row.company_id
        },
        delbuttonLoading: false,
        adButtonLoading: false,
        advertisingInfolist: [],
        creator: '',
        advertisingInfo: {},
        pageSize: 20,
        totalPages: 0,
        AppInfoList:[],
        ChannelInfoList:[],
        addAdvertisingIdDialogVisible: false,
        currentPage: 1,
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    mounted() {
      this.initAppInfo()
      this.initChannelInfo()
      this.pageChange(1)
    },
    created() {
      this.creator = this.name
    },
    methods: {
      initAppInfo() {
        let tothis = this
        let param = {
          page: '',
          limit: '',
        }
        listAppMeth(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.AppInfoList=response.data
            console.log("应用列表--------", response.data)
          } else {
            console.error(response)
          }
        }).catch(error => {
          this.listLoading = false
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '获取应用列表失败',
            type: 'error',
            duration: 2000
          })
        })
      },//初始化应用信息
      initChannelInfo() {
        let tothis = this
        let param = {
          page: '',
          limit: '',
        }
        listChannelMeth(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.ChannelInfoList=response.data
            console.log("渠道列表--------", response.data)
          } else {
            console.error(response)
          }
        }).catch(error => {
          this.listLoading = false
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '获取渠道列表失败',
            type: 'error',
            duration: 2000
          })
        })
      },//初始化渠道信息
      delAdvertisingInfo(param) {
        let tothis = this
        this.$confirm('确认删除吗？')
          .then(() => {

            tothis.delbuttonLoading = true
            delAdvertisingMeth(param).then(response => {
              tothis.$notify({
                title: '成功',
                message: '删除广告位信息成功',
                type: 'success',
                duration: 2000
              })
              tothis.delbuttonLoading = false
              tothis.pageChange(tothis.currentPage)
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '失败',
                message: '请刷新页面后重试',
                type: 'error',
                duration: 2000
              })
              tothis.delbuttonLoading = false
            })


          }).catch(() => {
        });
      },//删除公司信息
      addAdvertisingInfo() {
        this.$refs['advertisingInfo'].validate((valid) => {
          if (valid) {
            this.adButtonLoading = true
            let tothis = this
            let submitInfo = {
              app_id: this.advertisingInfo.app_id,
              channel_id: this.advertisingInfo.channel_id,
              advertising_name: this.advertisingInfo.advertising_name,
              advertising_id:this.advertisingInfo.advertising_id,
            }
            addAdvertisingMeth(submitInfo).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '添加广告位信息成功',
                  type: 'success',
                  duration: 2000
                })
                this.pageChange(this.currentPage)
                this.addAdvertisingIdDialogVisible = false;
              } else {
               console.error(response)
              }
              this.adButtonLoading = false
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '失败',
                message: '请刷新页面后重试',
                type: 'error',
                duration: 2000
              })
              this.adButtonLoading = false
            })
          }
        });

      },//添加广告位信息
      editAdvertisingInfo() {
        this.$refs['advertisingInfo'].validate((valid) => {
          if (valid) {
            this.adButtonLoading = true
            let tothis = this
            let submitInfo = {
              advertisingInfo_id: this.advertisingInfo.advertisingInfo_id,
              app_id: this.advertisingInfo.app_id,
              channel_id: this.advertisingInfo.channel_id,
              advertising_name: this.advertisingInfo.advertising_name,
              advertising_id:this.advertisingInfo.advertising_id,
            }
            console.log('编辑广告位信息',submitInfo)

            updateAdvertisingMeth(submitInfo).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '添加广告位信息成功',
                  type: 'success',
                  duration: 2000
                })
                this.pageChange(this.currentPage)
                this.addAdvertisingIdDialogVisible = false;
              } else {
                console.error(response)
              }
              this.adButtonLoading = false
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '失败',
                message: '请刷新页面后重试',
                type: 'error',
                duration: 2000
              })
              this.adButtonLoading = false
            })
          }
        });
      },//编辑广告位信息
      showAddAdvertisingInfo() {
        this.dialogState='add'
        this.advertisingInfo = {
          appList: []
        }
        this.$nextTick(() => {
          this.$refs['advertisingInfo'].clearValidate()
        })
        this.addAdvertisingIdDialogVisible = true;
      },//展示添加广告位对话框
      showEditAdvertisingInfo(param) {
        this.dialogState='edit'
        this.$nextTick(() => {
          this.$refs['advertisingInfo'].clearValidate()
        })
        this.advertisingInfo = param
        this.addAdvertisingIdDialogVisible = true;
      },//展示编辑广告位对话框
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
        }
        listAdvertisingMeth(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.advertisingInfolist = response.data
            console.log("广告位信息列表--------", this.advertisingInfolist)
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
      checkPermission,
    }
  }
</script>

<style>
  .detail_title {
    font-size: large;
    font-weight: bolder;
    font-size: 16px;
  }

  .detail_span {
    font-size: 14px;
    font-family: "微软雅黑";
  }

  .demo-table-expand label {
    width: 300px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    padding-left: 25px;
    margin-left: 10px;
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
    border-bottom: #d3dce6 solid 1px;
    border-left: #d3dce6 solid 1px;
  }

</style>
