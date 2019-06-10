<template>
  <div class="components-container">
    <el-button type="info" round size="mini" @click="uploadDialogVisible=true" style="margin-left: 20px;margin-top: 20px">信息按钮</el-button>

    <el-dialog
      :close-on-click-modal=false
      title="提示"
      :visible.sync="uploadDialogVisible"
      width="500px">
      <el-upload
        action="http://192.168.1.187:8088/eventfile"
        accept='.csv'
        drag
        :multiple="true"
        :on-success="dropzoneS"
        :before-upload="beforeUpload"
        style="width:360px">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">统计数据上传</div>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
    <el-button @click="uploadDialogVisible = false">取 消</el-button>
  </span>
    </el-dialog>

    <el-card shadow="always" style="margin: 20px">
      <el-table
        height="700"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          width="80"
          prop="id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="promoName"
          label="应用名">
        </el-table-column>
        <el-table-column
          prop="channelPackage"
          label="渠道包名">
        </el-table-column>
        <el-table-column
          prop="channelRule"
          label="跳转规则">
        </el-table-column>
        <el-table-column
          prop="promoPackageName"
          label="互推包名">
        </el-table-column>
        <el-table-column
          prop="promoIconUrl"
          label="互推图片链接">
        </el-table-column>
        <el-table-column
          width="80"
          prop="promoValue"
          label="权重">
        </el-table-column>
        <el-table-column
          width="80"
          prop="promoAlias"
          label="权重">
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalPages"
        @current-change="pageChange">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
  import {getToken} from '@/utils/auth'
  import {uploadFodder, listFodder} from '@/api/shieldingsystem/channelPromo'
  import {getPromoChannel, addPromoChannel, editPromoChannel} from '@/api/shieldingsystem/promoChannel'
  import {listChannelPromoRecordMeth,listChannelPromoRecordLimitMeth} from '@/api/shieldingsystem/channelPromoRecord'


  export default {
    name: 'DropzoneDemo',
    data() {
      return {
        uploadDialogVisible:false,
        pageSize:20,
        totalPages:0,
        currentPage:1,
        tableData: [],
        hidtableData: [],
      }
    },
    mounted() {
        this.pageChange(1)
    },
    methods: {
      beforeUpload(file) {
        let maxsize = 8 * 1024 * 1024
        if (file.size > maxsize) {
          this.$message.error('上传失败，文件超过8000KB');
          return false
        }
        console.log("开始上传")
      },
      dropzoneS(response) {
        let tothis=this
        let list=response.data
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['事件名', '详细参数', '事件数', '事件人数', 'icon']
          const filterVal = ['eventName', 'eventDetail', 'eventNum', 'eventUser', 'iconName']
          const data = tothis.formatJson(filterVal,list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '统计事件'
          })
        })



        // let data=response.data;
        // let tothis=this
        // if (data.size === 0) {
        //   tothis.$notify({
        //     title: '下载失败',
        //     message: '无效地址',
        //     type: 'error',
        //     duration: 2000
        //   })
        //   this.downloadAPKLoading = false
        //   return
        // }
        // let url = window.URL.createObjectURL(new Blob([data]))
        // let link = document.createElement('a')
        // link.style.display = 'none'
        // link.href = url
        // link.setAttribute('download', '统计事件.xls')
        // document.body.appendChild(link)
        // link.click()


      },//上传成功事件
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      initTable() {
        listChannelPromoRecordMeth().then(response => {
          if (response.repcode === 3000) {
            this.hidtableData = response.data
            this.totalPages=response.data.length
            this.pageChange(1)
          } else {
            this.$message({
              message: '表格初始化失败！',
              type: 'warning'
            });
          }
        }).catch(error => {
          this.$message({
            message: '表格初始化失败！',
            type: 'warning'
          });
        })
      },
      pageChange(page){
        this.currentPage=page
        let tothis=this
        let param={
          page:page,
          limit:this.pageSize,
        }
        listChannelPromoRecordLimitMeth(param).then(response=>{
          if(response.repcode===3000){
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


