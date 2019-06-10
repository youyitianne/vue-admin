<template>
  <div class="app-container">
    <el-button @click="showAddCompany()" style="margin-bottom: 20px">添加公司</el-button>
    <el-dialog
      :close-on-click-modal=false
      append-to-body
      width="80%"
      title="公司信息"
      :visible.sync="addCompanyDialogVisible">
      <el-form ref="companyInfo" :model="companyInfo" label-position="left" label-width="150px" inline
               style="margin-left:50px;" status-icon id="form-custom">
        <el-form-item label="公司名" :rules="{required: true, message: '公司名不能为空', trigger: 'blur'}"
                      prop="company_name">
          <el-input v-model="companyInfo.company_name" placeholder="请输入公司名~"/>
        </el-form-item>
        <br>
        <el-button type="primary" @click="addApp()">添加合作广告位</el-button>
        <br>
        <el-form-item
          style="margin-top: 15px"
          v-for="(domain, index) in companyInfo.companyList"
          :key="domain.key">
          <div style="width: 1000px;height: 15px">
            <span style="">广告位ID：<span style="font-weight: bolder">{{domain.advertisingInfo.advertising_id}}</span></span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
            <span style="">广告位信息：<span style="font-weight: bolder">{{domain.advertisingInfo.app_name}}_{{domain.advertisingInfo.channel_name}}_{{domain.advertisingInfo.advertising_name}}</span></span>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
            <el-select v-model="domain.advertisingInfo" placeholder="请选择"
                       style="width: 300px"
                       @change="advertisingInfoChange"
                       filterable
                       clearable
                       size="mini"
                       value-key="advertisingInfo_id">
              <el-option
                v-for="item in advertisingInfolist"
                :key="item.advertisingInfo_id"
                :label="item.app_name+'-'+item.channel_name+'-'+item.advertising_name"
                :value="item">
              </el-option>
            </el-select>

            <el-button @click.prevent="removeDomain(domain)" size="mini">删除</el-button>
          </div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCompanyDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="addCompany()" :loading="adButtonLoading">确定</el-button>
      </div>
    </el-dialog>
    <template>
      <el-table
        type="index"
        highlight-current-row
        :expand-row-keys="expands"
        :row-key='getRowKeys'
        @expand-change="expandrowhandler"
        :data="companyInfolist"
        stripe
        border
        height="750px"
        style="width: 100%">
        <el-table-column type="expand" label="展开" width="100px">
          <template slot-scope="props">
            <div style="padding-top: 15px">
              <el-table
                stripe
                border
                :data="props.row.companyList"
                style="width: 100%;margin-bottom: 30px">
                <el-table-column
                  prop="advertisingInfo.app_name"
                  label="应用">
                </el-table-column>
                <el-table-column
                  prop="advertisingInfo.channel_name"
                  label="渠道">
                </el-table-column>
                <el-table-column
                  prop="advertisingInfo.advertising_name"
                  label="广告类型">
                </el-table-column>
                <el-table-column
                  prop="advertisingInfo.advertising_id"
                  label="广告位id">
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="company_id"
          label="公司ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="company_name"
          label="公司名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="creator"
          label="创建人">
        </el-table-column>
        <el-table-column
          label="操作"
          width="350">
          <template slot-scope="scope">
            <el-button @click.prevent="showEditCompany(scope.row)" type="success" size="mini">编辑按钮</el-button>
            <span><el-button @click="delCompanyInfo(scope.row)" type="info" size="mini"
                             :loading="delbuttonLoading">删除</el-button></span>
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
  import {listCompanyMeth, addCompanyMeth, delCompanyMeth} from '@/api/cooperation/co_companyInfo'
  import {listAdvertisingMeth} from '@/api/cooperation/co_advertising'

  export default {
    data() {
      return {
        advertisingInfolist:[],
        expands: [],
        getRowKeys(row) {
          return row.company_id
        },
        delbuttonLoading: false,
        adButtonLoading: false,
        companyInfolist: [],
        creator: '',
        companyInfo: {},
        pageSize: 20,
        totalPages: 0,
        addCompanyDialogVisible: false,
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
      this.initAdvertisingInfo()
    },
    created() {
      this.creator = this.name
    },
    methods: {
      showEditCompany(param) {
        this.companyInfo = param
        this.$nextTick(() => {
          this.$refs['companyInfo'].clearValidate()
        })
        this.addCompanyDialogVisible = true;
      },//展示编辑公司对话框
      advertisingInfoChange(param){
        console.log(param)
      },//广告信息改变
      initAdvertisingInfo(){
        let tothis = this
        let param = {
          page: 1,
          limit: 999,
        }
        listAdvertisingMeth(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.advertisingInfolist = response.data
            console.log("广告位信息列表--------", this.advertisingInfolist)
          } else {
            console.log(response)
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
      },//初始化广告位信息
      removeDomain(item) {
        let index = this.companyInfo.companyList.indexOf(item)
        if (index !== -1) {
          this.companyInfo.companyList.splice(index, 1)
        }
      },//删除应用
      addApp() {
        let tothis=this
        if (this.advertisingInfolist.length===0){
          tothis.$notify({
            title: '失败',
            message: '无法获取广告位信息列表',
            type: 'error',
            duration: 2000
          })
          return
        }
        let app = {
          advertisingInfo:this.advertisingInfolist[0]
        }
        this.companyInfo.companyList.push(app)
        console.log(this.companyInfo)
      },//添加合作广告位
      delCompanyInfo(param) {
        let tothis = this
        this.$confirm('确认删除吗？')
          .then(() => {
            tothis.delbuttonLoading = true
            delCompanyMeth(param).then(response => {
              tothis.$notify({
                title: '成功',
                message: '删除公司信息成功',
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
      addCompany() {
        this.$refs['companyInfo'].validate((valid) => {
          if (valid) {
            this.adButtonLoading = true
            let tothis = this
            let submitInfo = {
              companyName: this.companyInfo.company_name,
              creator: this.creator,
              advertisingInfoList:this.companyInfo.companyList
            }
            console.log('添加的公司信息', submitInfo)
            addCompanyMeth(submitInfo).then(response => {
              if (response.repcode === 3000) {
                tothis.$notify({
                  title: '成功',
                  message: '添加公司成功',
                  type: 'success',
                  duration: 2000
                })
                this.pageChange(this.currentPage)
                this.addCompanyDialogVisible = false;
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

      },//添加公司
      showAddCompany() {
        this.companyInfo = {
          companyList: []
        }
        this.$nextTick(() => {
          this.$refs['companyInfo'].clearValidate()
        })
        this.addCompanyDialogVisible = true;
      },//展示添加公司对话框
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
        }
        listCompanyMeth(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.companyInfolist = response.data
            console.log("公司列表--------", this.companyInfolist)
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
      expandrowhandler(row, expandedRows) {
        console.log(row)
        console.log(expandedRows)
        let that = this
        console.log(2)
        if (expandedRows.length) {
          that.expands = []
          if (row) {
            console.log(1)
            that.expands.push(row.company_id)
          }
        } else {
          console.log(3)
          that.expands = []
        }
        console.log(that.expands)
      },//展开行变化时触发
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
