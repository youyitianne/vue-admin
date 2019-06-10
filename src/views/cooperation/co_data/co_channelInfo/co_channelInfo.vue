<template>
  <div class="Channel-container" style="margin-left: 20px;margin-top: 20px">
    <el-button @click="showAddChannel()"  style="margin-bottom: 20px">添加渠道</el-button>
    <el-dialog
      :close-on-click-modal=false
      Channelend-to-body
      width="500px"
      title="添加渠道"
      :visible.sync="addChannelDialogVisible">
      <el-form ref="ChannelInfo" :model="ChannelInfo" label-position="left" label-width="150px" :inline="true"
               style="margin-left:50px;" status-icon id="form-custom">
        <el-form-item label="渠道名" :rules="{required: true, message: '渠道名不能为空', trigger: 'blur'}"
                      prop="ChannelName">
          <el-input v-model="ChannelInfo.ChannelName" placeholder="请输入渠道名~"/>
        </el-form-item>
        <el-form-item label="渠道标记" :rules="{required: true, message: '渠道标记不能为空', trigger: 'blur'}"
                      prop="ChannelMark">
          <el-input v-model="ChannelInfo.ChannelMark" placeholder="请输入渠道标记~"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addChannelDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addChannel()" :loading="adButtonLoading">添加渠道</el-button>
      </div>
    </el-dialog>
    <template>
      <el-table
        border
        :data="ChannelInfolist"
        stripe
        height="750px"
        style="width: 100%">
        <el-table-column
          prop="channel_id"
          label="ChannelID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="channel_name"
          label="渠道名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="channel_mark"
          label="渠道标记"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作"
          width="350">
          <template slot-scope="scope">
            <span><el-button @click="delChannelInfo(scope.row)" type="info" :loading="delbuttonLoading">删除</el-button></span>
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
  import {listChannelMeth, addChannelMeth,delChannelMeth} from '@/api/cooperation/co_ChannelInfo'

  export default {
    data() {
      return {
        delbuttonLoading:false,
        adButtonLoading: false,
        ChannelInfolist: [],
        creator: '',
        ChannelInfo: {},
        pageSize: 20,
        totalPages: 0,
        addChannelDialogVisible: false,
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
      this.pageChange(1);
    },
    created() {
      this.creator = this.name
    },
    methods: {
      delChannelInfo(param){
        console.log('删除参数',param)
        let tothis=this
        this.$confirm('确认删除吗？')
          .then(() => {
            tothis.delbuttonLoading=true
            delChannelMeth(param).then(response=>{
              tothis.$notify({
                title: '成功',
                message: '删除渠道信息成功',
                type: 'success',
                duration: 2000
              })
              tothis.delbuttonLoading=false
              tothis.pageChange(tothis.currentPage)
            }).catch(error=>{
              console.error(error)
              tothis.$notify({
                title: '失败',
                message: '请刷新页面后重试',
                type: 'error',
                duration: 2000
              })
              tothis.delbuttonLoading=false
            })
          }).catch(() => {});
      },//删除渠道信息
      addChannel() {
        this.$refs['ChannelInfo'].validate((valid) => {
          if (valid) {
            this.adButtonLoading = true
            let tothis = this
            let submitInfo = {
              channel_name: this.ChannelInfo.ChannelName,
              channel_mark: this.ChannelInfo.ChannelMark,
            }
            console.log('添加的渠道信息', submitInfo)
            addChannelMeth(submitInfo).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '添加渠道成功',
                  type: 'success',
                  duration: 2000
                })
                this.pageChange(this.currentPage)
                this.addChannelDialogVisible = false;
              } else {
                tothis.$notify({
                  title: '失败',
                  message: '请刷新页面后重试',
                  type: 'error',
                  duration: 2000
                })
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

      },//添加渠道
      showAddChannel() {
        this.ChannelInfo = {}
        this.$nextTick(() => {
          this.$refs['ChannelInfo'].clearValidate()
        })
        this.addChannelDialogVisible = true;
      },//展示添加渠道对话框
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
        }

        listChannelMeth(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.ChannelInfolist = response.data
            console.log("渠道列表--------", this.ChannelInfolist)
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
      checkPermission
    }
  }
</script>

<style>
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

