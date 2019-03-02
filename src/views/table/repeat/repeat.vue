<template>
  <div class="app-container">
    <el-tooltip class="item" effect="dark" content="找到以日期，应用名，渠道，广告类型，收益，ecpm为分组，数量大于1的数据，每组相同数据中只保留最新上传的一条，其余的删除"
                placement="top-start">
      <el-button v-waves :loading="buttonloadLoading" type="success"
                 @click="deldefaultHandler">
        {{'删除重复数据(默认)'}}
      </el-button>
    </el-tooltip>


    <el-tooltip class="item" effect="dark" content="找出以日期，渠道，收益，ecpm，点击率，展示，点击为分组，数量大于1的所有数据" placement="top-start">
      <el-button v-waves :loading="buttonloadLoading" type="primary"
                 @click="findrepeat">
        {{'查询重复数据'}}
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="选中表格里所有的奇数行" placement="top-start" style="margin-left: 50px">
      <el-button v-waves :loading="buttonloadLoading" type="primary"
                 @click="selOddNumber">
        {{'选择所有奇数行'}}
      </el-button>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="选中表格里所有的偶数行" placement="top-start" style="margin-left: 50px">
      <el-button v-waves :loading="buttonloadLoading" type="primary"
                 @click="selEvenNumber">
        {{'选择所有偶数行'}}
      </el-button>
    </el-tooltip>
    <el-button @click="toggleSelection()" :loading="buttonloadLoading">取消选择</el-button>
    <el-button @click="delSelect()" :loading="buttonloadLoading">删除选中行</el-button>
    <br>
    <el-table
      v-loading="tableLoading"
      ref="multipleTable"
      style="margin-top: 20px"
      height="850"
      fit
      border
      highlight-current-row
      :data="tableData"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope" prop="id">
          {{ ++scope.$index }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="false"
        prop="id"
        label="编号"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        width="100px">
      </el-table-column>
      <el-table-column
        prop="app_name"
        label="应用名">
      </el-table-column>
      <el-table-column
        prop="channel"
        label="渠道">
      </el-table-column>
      <el-table-column
        prop="advertising_type"
        label="广告类型">
      </el-table-column>
      <el-table-column
        prop="earned"
        label="收益">
      </el-table-column>
      <el-table-column
        prop="click_rate"
        label="点击率">
      </el-table-column>
      <el-table-column
        prop="ecpm"
        label="ECPM">
      </el-table-column>
      <el-table-column
        prop="impression"
        label="展次">
      </el-table-column>
      <el-table-column
        prop="click"
        label="点击次数"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="fill_rate"
        label="填充"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="platform"
        label="平台"
        width="80px">
      </el-table-column>
      <el-table-column
        prop="note"
        label="备注"
        width="250px">
      </el-table-column>
      <el-table-column
        prop="sdk_name"
        label="包名">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {getRepeat, deldefault, delrepeat} from "@/api/repeat"; //根据帐号获取被分配的项目列表
  import store from '@/store'  //获取本地缓存信息
  import {
    getProjectList,
    getList,
    getListdata,
    getdownload,
    getName,
    getarpufile1,
    getDailyMsg,
    getDailyAdtypeMsg
  } from '@/api/table/datamanager/addata'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {mapGetters} from 'vuex'

  export default {
    directives: {waves},
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
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
        tableLoading:false,
        multipleSelection: [],
        tableData: [],
        app_name_list: [],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        directives: {waves},
        buttonloadLoading: false,
        aupu_chooseNamed: '选择项目',
        download_value: '',
        arpu_download_value: null,
        downloadParam: {
          start: undefined,
          end: undefined,
          name: undefined,
          namelist: '',
          list: []
        },
        aupu_downloadParam: {
          start: undefined,
          end: undefined,
          name: '选择项目',
        },
        listLoading: true,
        names: [],
      }
    },
    created() {
    },
    methods: {
      deldefaultHandler() {
        let tothis = this
        this.buttonloadLoading = true
        deldefault().then(response => {
          tothis.$message({
            message: '删除重复数据成功',
            type: 'success'
          });
          this.buttonloadLoading = false
        }).catch(function (rs) {
          tothis.$message({
            message: '去重失败，刷新试试',
            type: 'warning'
          });
          this.buttonloadLoading = false
        })
      },//默认删除
      delSelect() {
        let tothis = this
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.multipleSelection)
          for (let i = 0; i < this.multipleSelection.length; i++) {
            console.log(this.multipleSelection[i].note)
          }
          let data = {
            data: this.multipleSelection
          }
          delrepeat(data).then(response => {
            tothis.$message({
              message: '删除重复数据成功',
              type: 'success'
            });
            this.findrepeat()
            this.buttonloadLoading = false
          }).catch(function (rs) {
            tothis.$message({
              message: '去重失败，刷新试试',
              type: 'warning'
            });
          });
        }).catch(() => {
        })
      },//删除选中行
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      selEvenNumber() {
        this.buttonloadLoading = true
        for (let i = 1; i < this.tableData.length + 1; i++) {
          if (i % 2 === 0) {
            this.toggleSelection([this.tableData[i - 1]])
          }
        }
        this.buttonloadLoading = false
      },//选中偶数行
      selOddNumber() {
        this.buttonloadLoading = true
        for (let i = 1; i < this.tableData.length + 1; i++) {
          if (i % 2 === 1) {
            this.toggleSelection([this.tableData[i - 1]])
          }
        }
        this.buttonloadLoading = false
      },//选中奇数行
      toggleSelection(rows) {
        this.buttonloadLoading = true
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
        this.buttonloadLoading = false
      },//取消选中
      findrepeat() {
        this.tableLoading=true
        this.buttonloadLoading = true
        getRepeat().then(response => {
          this.tableData = response.data
          this.tableLoading=false
          this.buttonloadLoading = false
        }).catch(function (rs) {
          this.tableLoading=false
          this.buttonloadLoading = false
        })
      },//手动删除获得所有重复数据
      checkPermission,
      parseTime,
      getdate(startDate, endDate) {
        const dateList = []
        dateList.push('全部')
        dateList.push(this.formatDate(startDate, 'yyyy-MM-dd'))
        //dateList.push(new Date(startDate))
        while (true) {
          startDate.setDate(startDate.getDate() + 1)
          if (startDate.getTime() < endDate.getTime()) {
            dateList.push(this.formatDate(startDate, 'yyyy-MM-dd'))
            //dateList.push(new Date(startDate))
          } else {
            break
          }
        }
        if (!dateList.includes(this.formatDate(endDate, 'yyyy-MM-dd'))) {
          dateList.push(this.formatDate(endDate, 'yyyy-MM-dd'))
        }
        //dateList.push(new Date(endDate))
        return dateList
      }
      ,
      formatDate(date, fmt) {
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        };
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
          }
        }
        return fmt;
      }, padLeftZero(str) {
        return ('00' + str).substr(str.length);
      }
      ,
      open3() {
        this.$message({
          message: '请选择查询范围~',
          type: 'warning'
        });
      }
      ,
      open4() {
        this.$message({
          message: '没有信息可以打印~',
          type: 'warning'
        });
      }

    }
  }
</script>
