<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
        <el-date-picker
          v-model="select_value"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions0"
          @change="secondart_date_change">
        </el-date-picker>

      <el-select v-model="chooseName" :placeholder="'选择游戏'" style="width: 140px" class="filter-item">
        <el-option v-for="item in names" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-button  v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ searchName }}</el-button>
      <el-button  v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"  @click="handleDownload" >{{'下载'}}</el-button><br>
    </div>

    <div style="margin-top: -10px">
      <el-input placeholder="根据渠道二次筛选" v-model="secondary_channel" style="width: 200px;margin-left: 15px;margin-bottom: 10px;margin-top: -10px" class="filter-item" clearable @blur="getDatawithName"/>
      <el-select v-model="secondary_adtype" placeholder="根据广告类型二次筛选" @change="getDatawithName">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-select v-model="secondary_date" placeholder="根据时间二次筛选" @change="getDatawithName" style="width: 170px">
        <el-option v-for="item in secondary_datelist" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-input placeholder="根据平台二次筛选" v-model="secondary_platform" style="width: 200px;margin-bottom: 10px;margin-top: -10px" class="filter-item" clearable @blur="getDatawithName"/>
    </div>

    <div class="filter-container"
         style="margin: 15px;margin-top: -5px"
          v-if="checkPermission(['admin','operator','leader'])">
    <el-date-picker
      v-model="download_value"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      :picker-options="pickerOptions0">>
    </el-date-picker>

      <el-select v-model="chooseNamed" :placeholder="'选择游戏'" style="width: 140px" class="filter-item">
        <el-option v-for="item in names" :key="item" :label="item" :value="item"/>
      </el-select>

      <el-button v-waves :loading="downloadLoading"  type="primary" icon="el-icon-download"  @click="handleDownloadAll" >{{'下载总表'}}</el-button><br>
    </div>


    <el-table
      stripe
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      fixed
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope" prop="id">
          {{ ++scope.$index }}
        </template>
      </el-table-column>
      <!--<el-table-column label="id" width="110" style="display: none">-->
        <!--<template slot-scope="scope">-->
          <!--{{ scope.row.id }}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="时间" width="110" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="游戏名" width="110" align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.app_name }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="渠道" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.channel }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="广告类型" prop="advertising_type">
        <template slot-scope="scope">
          <span>{{ scope.row.advertising_type }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="收入" prop="earned">
        <template slot-scope="scope">
          <span>{{ scope.row.earned }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击率" prop="clickrate">
        <template slot-scope="scope">
          <span>{{ scope.row.click_rate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="ecpm" prop="ecpm">
        <template slot-scope="scope">
          <span>{{ scope.row.ecpm }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="展示次数" prop="impression">
        <template slot-scope="scope">
          <span>{{ scope.row.impression }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点击次数" prop="click">
        <template slot-scope="scope">
          <span>{{ scope.row.click }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="填充率" prop="fill_rate">
        <template slot-scope="scope">
          <span>{{ scope.row.fill_rate }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="备注" prop="platform" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="平台" prop="platform">
        <template slot-scope="scope">
          <span>{{ scope.row.platform }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
  import {getList,getNamegetName,getListdata,getdownload,getResourceName,getName} from '@/api/table/datamanager/select'
  import waves from '@/directive/waves'
  import { parseTime } from '@/utils'
  import checkPermission from '@/utils/permission' // 权限判断函数
  import { mapGetters } from 'vuex'


  export default {
    directives: { waves },
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
        secondary_platform:'',
        secondary_date:'',
        secondary_channel:'',
        secondary_adtype:'',
        secondary_datelist:[],
        hidlist:[],
        options: [ {
          value: '全部',
          label: '全部'
        }, {
          value: '横幅',
          label: '横幅'
        }, {
          value: '开屏',
          label: '开屏'
        }, {
          value: '插屏',
          label: '插屏'
        }, {
          value: '视频',
          label: '视频'
        }],
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        directives: { waves },
        downloadLoading: false,
        layout:'',
        chooseName:'选择游戏',
        chooseNamed:'选择游戏',
        select_value: '',
        download_value:'',
        downloadParam:{
          start:undefined,
          end:undefined,
          name:undefined,
        },
        searchName:'搜索',
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          importance: undefined,
          title: undefined,
          type: undefined,
        },
        listParam:{
          start:undefined,
          end:undefined,
          name:undefined,
        },
        importanceOptions: [1, 2, 3],
        names:[],
        sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
        statusOptions: ['published', 'draft', 'deleted'],
      }
    },
    created() {
      this.fetchName()
    },
    methods: {
      open3() {
        this.$message({
          message: '请选择查询范围~',
          type: 'warning'
        });
      },
      open4() {
        this.$message({
          message: '没有信息可以打印~',
          type: 'warning'
        });
      },
      fetchName(){
        if (!checkPermission(['admin','leader','operator'])){
          let data={
            username:this.name
          }
          let tothis=this
          this.listLoading = true
          getResourceName(data).then(response => {
            this.names = response.data
            this.listLoading = false
          }).catch(function (rs) {
            tothis.listLoading = false
            console.error(rs)
          })
        }else {
          let tothis=this
          this.listLoading = true
          getName().then(response => {
            this.names = response.data
            this.listLoading = false
          }).catch(function (rs) {
            tothis.listLoading = false
            console.log(rs)
          })
        }
      },
      handleFilter(){   // 查找数据
        this.downloadLoading=true
        let tothis=this
        this.listParam.name=this.chooseName
        if (this.listParam.name==='选择游戏'||this.select_value===''||this.select_value==null) {
          this.open3()
          this.downloadLoading=false
          return
        }
        this.listParam.start=this.select_value[0]
        this.listParam.end=this.select_value[1]
        this.listLoading = true
        getListdata(this.listParam).then(response => {
          this.list = response.data
          this.hidlist=response.data
          this.listLoading = false
          this.downloadLoading=false
        }).catch(function (rs) {
          tothis.listLoading = false
          tothis.downloadLoading=false
        })
      },
      getDatawithName(){
        if (this.hidlist===[]){
          return
        }
        let data=[]
        this.listLoading=true
        let adtype=this.secondary_adtype
        if (adtype==''||adtype==null){
          data=this.hidlist
        }else {
          for (let i=0;i<this.hidlist.length;i++){
            if (this.hidlist[i].advertising_type.search(adtype)!=-1){
              data.push(this.hidlist[i])
            }
          }
        }

        let data1=[]
        let channel=this.secondary_channel
        if (channel==''){
          data1=data
        }else {
          for (let i=0;i<data.length;i++){
            if (data[i].channel.search(channel)!=-1){
              data1.push(data[i])
            }
          }
        }

        let data2=[]
        let date=this.secondary_date
        if (date==''||date=='全部'){
          data2=data1
        }else {
          for (let i=0;i<data1.length;i++){
            if (data1[i].date.search(date)!=-1){
              data2.push(data1[i])
            }
          }
        }

        let data3=[]
        let platform=this.secondary_platform
        if (platform==''||platform==null) {
          data3=data2
        }else {
          console.log(11)
          for (let i=0;i<data2.length;i++){
            if (data2[i].platform.search(platform)!=-1){
              data3.push(data2[i])
            }
          }
        }

        this.list = data3
        this.listLoading=false
      },
      handleDownloadAll() {    //下载总表
        this.downloadLoading=true
        let tothis=this
        this.downloadParam.start=this.download_value[0]
        this.downloadParam.end=this.download_value[1]
        this.downloadParam.name=this.chooseNamed
        if (this.downloadParam.name==='选择游戏') {
          this.open3()
          return
        }
        if (this.downloadParam.start===undefined) {
          this.open3()
          return
        }
        if (this.downloadParam.end===undefined) {
          this.open3()
          return
        }
        getdownload(this.downloadParam).then(data => {
          if (!data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.downloadParam.start+'_'+this.downloadParam.end+'_'+this.downloadParam.name+'.xls')
          document.body.appendChild(link)
          link.click()
          this.downloadLoading = false
        }).catch(function (rs) {
          tothis.downloadLoading = false
          tothis.$notify({
            title: '下载失败',
            message: '权限不足',
            type: 'error',
            duration: 2000
          })
        })

      },
      handleDownload() {   //下载请求
        this.downloadLoading = true
        if (this.list===null) {
          this.open4()
          this.downloadLoading = false
          return
        }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['id', 'date', 'app_name', 'channel', 'advertising_type','earned', 'click_rate', 'ecpm', 'impression', 'click', 'fill_rate', 'platform']
          const filterVal = ['id', 'date', 'app_name', 'channel', 'advertising_type','earned', 'click_rate', 'ecpm', 'impression', 'click', 'fill_rate', 'platform']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      /**
       * 获取指定日期(字符串类型)到当前时间的天数
       * @param {Object} sDate1 格式:2018-01-04
       */secondart_date_change(){
         if (this.select_value===null){
           return
         }
        this.secondary_datelist=this.getdate(new Date(this.select_value[0]),new Date(this.select_value[1]))
      },
      getdate(startDate,endDate) {
        const dateList = []
        dateList.push('全部')
        dateList.push(this.formatDate(startDate,'yyyy-MM-dd'))
        //dateList.push(new Date(startDate))
        while (true) {
          startDate.setDate(startDate.getDate() + 1)
          if (startDate.getTime() < endDate.getTime()) {
            dateList.push(this.formatDate(startDate,'yyyy-MM-dd'))
            //dateList.push(new Date(startDate))
          } else {
            break
          }
        }
        if (!dateList.includes(this.formatDate(endDate,'yyyy-MM-dd'))){
          dateList.push(this.formatDate(endDate,'yyyy-MM-dd'))
        }
        //dateList.push(new Date(endDate))
        return dateList
      },
      formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
      checkPermission,
      parseTime,
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
      },
      padLeftZero(str) {
        return ('00' + str).substr(str.length);
      }
    }
  }
</script>
