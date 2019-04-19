<template>
  <div class="components-container">
    <el-button type="primary" style="margin: 20px" @click="addPromoChannelBtu"   v-if="checkPermission(['admin','director'])">添加</el-button>
    <span style="margin-left: 15px;margin-right: 5px">渠道名:</span>
    <el-input style="width: 200px" v-model="promoChannelName" clearable></el-input>
    <el-button @click="searchTable">搜索</el-button>

    <el-card shadow="always" style="margin: 20px;margin-top: -10px">
      <el-table
        height="700"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="promoChannelName"
          label="渠道名">
        </el-table-column>
        <el-table-column
          prop="promoChannelMark"
          label="渠道标识">
        </el-table-column>
        <el-table-column
          prop="promoChannelPackage"
          label="渠道包名">
        </el-table-column>
        <el-table-column
          prop="channelRule"
          label="跳转规则">
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin','director'])"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="editPromoChannelDialog(scope.row)" type="text">编辑</el-button>
            <!--<el-button @click="" type="text">删除</el-button>-->
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
    </el-card>
    <el-dialog
      width="700px"
      title="互推渠道"
      style="height: 600px"
      :visible.sync="promoChannelDialogVisible">
      <el-form ref="promoChannel" :model="promoChannel" label-position="left"
               style="margin-left:50px;" status-icon>
        <el-form-item label="渠道名" :rules="[{ required: true, message: '渠道名不能为空'}]" prop="promoChannelName"
                      label-width="120px">
          <el-input v-model="promoChannel.promoChannelName" placeholder="必填~" class="dia-input"/>
        </el-form-item>

        <el-form-item label="渠道标识" :rules="[{ required: true, message: '渠道标识不能为空'}]" prop="promoChannelMark"
                      label-width="120px">
          <el-input v-model="promoChannel.promoChannelMark" placeholder="必填~" class="dia-input" :disabled="promoChannelState==='edit'"/>
        </el-form-item>
        <el-form-item label="渠道包名" :rules="[{ required: true, message: '渠道包名不能为空'}]" prop="promoChannelPackage"
                      label-width="120px">
          <el-input v-model="promoChannel.promoChannelPackage" placeholder="必填~" class="dia-input"/>
        </el-form-item>
        <el-form-item label="跳转规则" :rules="[{ required: true, message: '跳转规则不能为空'}]" prop="channelRule"
                      label-width="120px">
          <el-input v-model="promoChannel.channelRule" placeholder="必填~" class="dia-input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="promoChannelDialogVisible = false">{{ '取消'}}</el-button>
        <el-button type="primary" @click="addPromoChannel" v-if="promoChannelState==='add'">{{ '添加' }}</el-button>
        <el-button type="primary" @click="editPromoChannel" v-if="promoChannelState==='edit'">{{ '修改' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getToken} from '@/utils/auth'
  import {uploadFodder, listFodder} from '@/api/shieldingsystem/channelPromo'
  import {getPromoChannel, addPromoChannel, editPromoChannel,getPromoChannelLimitMeth} from '@/api/shieldingsystem/promoChannel'
  import checkPermission from '@/utils/permission' // 权限判断函数

  export default {
    name: 'DropzoneDemo',
    data() {
      return {
        pageSize:20,
        totalPages:0,
        currentPage:1,
        id:0,
        promoChannel: {},
        promoChannelState: 'add',
        tableData: [],
        promoChannelDialogVisible: false,
        hidTableData:[],
        promoChannelName:'',
      }
    },
    mounted() {
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
          promoChannelName:this.promoChannelName,
        }
        getPromoChannelLimitMeth(param).then(response=>{
          if(response.repcode===3000){
            console.log(response.data)
            this.tableData=response.data
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
      checkPermission,
      addPromoChannel() {
        let tothis = this
        this.$refs['promoChannel'].validate((valid) => {
          if (valid) {
            let param = {
              promoChannelName:this.promoChannel.promoChannelName,
              promoChannelPackage:this.promoChannel.promoChannelPackage,
              promoChannelMark:this.promoChannel.promoChannelMark,
              channelRule:this.promoChannel.channelRule,
            }
            addPromoChannel(param).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '提示',
                  message: '添加渠道成功！',
                  type: 'success'
                });
                this.promoChannelDialogVisible=false
                this.initTable()
              } else {

                tothis.$notify({
                  title: '提示',
                  message: '添加渠道失败，请检查渠道标识是否重复！',
                  type: 'warning'
                });
              }
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '提示',
                message: '添加渠道失败！',
                type: 'warning'
              });
            })
          } else {
            return false
          }
        });
      },
      editPromoChannel(){
        let tothis = this
        this.$refs['promoChannel'].validate((valid) => {
          if (valid) {
            let param = {
              id:this.id,
              channelRule:this.promoChannel.channelRule,
              promoChannelName:this.promoChannel.promoChannelName,
              promoChannelPackage:this.promoChannel.promoChannelPackage,
              promoChannelMark:this.promoChannel.promoChannelMark,
            }
            editPromoChannel(param).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '提示',
                  message: '修改渠道成功！',
                  type: 'success'
                });
                this.promoChannelDialogVisible=false
                this.initTable()
              } else {
                tothis.$notify({
                  title: '提示',
                  message: '修改渠道失败！',
                  type: 'warning'
                });
              }
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '提示',
                message: '修改渠道失败！',
                type: 'warning'
              });
            })
          } else {
            return false
          }
        });
      },
      initTable() {
        let tothis = this
        getPromoChannel().then(response => {
          if (response.repcode === 3000) {
            this.totalPages=response.data.length
            this.hidTableData=response.data
            this.pageChange(this.currentpage)
          } else {
            tothis.$notify({
              title: '提示',
              message: '获取互推渠道列表失败！',
              type: 'warning'
            });
          }
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '提示',
            message: '获取互推渠道列表失败！',
            type: 'warning'
          });
        })
      },
      addPromoChannelBtu() {
        this.promoChannel={}
        this.promoChannel.channelRule="market://details?id={0}"
        this.$nextTick(() => {
          this.$refs['promoChannel'].clearValidate()
        })
        this.promoChannelState = 'add'
        this.promoChannelDialogVisible = true
      },//添加互推渠道按钮
      editPromoChannelDialog(param){
        this.promoChannel={}
        this.id=param.id
        this.$set(this.promoChannel, 'channelRule', param.channelRule);
        this.$set(this.promoChannel, 'promoChannelName', param.promoChannelName);
        this.$set(this.promoChannel, 'promoChannelMark', param.promoChannelMark);
        this.$set(this.promoChannel, 'promoChannelPackage', param.promoChannelPackage);
        this.promoChannelState = 'edit'
        this.promoChannelDialogVisible = true
      },//编辑互推渠道按钮
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dia-input {
    width: 300px;
  }

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


