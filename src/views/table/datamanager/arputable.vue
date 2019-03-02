<template>
  <div class="app-container">
    <div class="filter-container"
         style="margin: 15px;margin-top: -5px">
      <el-date-picker
        v-model="arpu_download_value"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="timestamp"
        :picker-options="pickerOptions0">>
      </el-date-picker>
      <!--value-format="yyyy-MM-dd"-->
      <el-select v-model="aupu_chooseNamed" style="margin-right: 20px" @change="" value-key="project_name"
                 :placeholder="'选择项目'" filterable>
        <el-option v-for="item in app_name_list" :key="item.project_name" :label="item.project_name" :value="item">
        </el-option>
      </el-select>
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"
                 @click="arpu_handleDownloadAll">
        {{'下载arpu表'}}
      </el-button>
      <br>
    </div>
  </div>

</template>

<script>
  import {getResourceName} from "@/api/resourceName"; //根据帐号获取被分配的项目列表
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
        app_name_list: [],
        options: [{
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
        directives: {waves},
        downloadLoading: false,
        aupu_chooseNamed: '选择项目',
        download_value: '',
        arpu_download_value:null,
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
        list: null,
        listLoading: true,
        names: [],
      }
    },
    created() {
      this.fetchName()
      this.fetchProject()
    },
    methods: {
      arpu_handleDownloadAll() {    //下载收益表
        let tothis = this
        let time = 6 * 24 * 60 * 60 * 1000
        if(this.arpu_download_value===null||this.arpu_download_value[0] === undefined) {
          this.open3()
          return
        }
        if (this.arpu_download_value[1] === undefined) {
          this.open3()
          return
        }
        if (this.arpu_download_value[1] - this.arpu_download_value[0] > time) {
          tothis.$notify({
            title: '',
            message: '时间范围最多选择7天',
            type: 'warning',
            duration: 2000
          })
          return
        }

        if (this.aupu_chooseNamed==='选择项目'){
          this.open3()
          return
        }
        this.aupu_downloadParam.start = this.formatDate(new Date(this.arpu_download_value[0]), 'yyyy-MM-dd')
        this.aupu_downloadParam.end = this.formatDate(new Date(this.arpu_download_value[1]), 'yyyy-MM-dd')
        this.aupu_downloadParam.name = this.aupu_chooseNamed
        //this.aupu_downloadParam.name = '全部'  //收益表为下载所有
        this.downloadLoading = true
        getarpufile1(this.aupu_downloadParam).then(data => {
          if (!data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', this.aupu_downloadParam.start + '_' + this.aupu_downloadParam.end + this.aupu_downloadParam.name.project_name + '_arpu.xls')
          document.body.appendChild(link)
          link.click()
          this.downloadLoading = false
        }).catch(function (rs) {
          console.log(rs.toString())
          tothis.downloadLoading = false
          tothis.$notify({
            title: '下载失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//日常产品总收益表下载方法
      fetchProject() {
        let tothis = this
        this.listLoading = true
        getProjectList().then(response => {
          let appslist=response.data
          console.log(response.data)
          //根据资源分配调整项目列表start
          let valid = this.checkPermission(['director']) || this.checkPermission(['admin']) || this.checkPermission(['operatorleader']) || this.checkPermission(['sdksuport'])
          console.log(valid)
          if (valid) {
            this.app_name_list = appslist
          } else {
            let newoptionlist = []
            let accountName = store.getters && store.getters.name
            let name = {
              username: accountName
            }
            getResourceName(name).then(response => {
              let projectlist = response.data
              for (let i = 0; i < appslist.length; i++) {
                for (let j = 0; j < projectlist.length; j++) {
                  if (appslist[i].project_name.indexOf(projectlist[j]) != -1) {
                    newoptionlist.push(appslist[i])
                  }
                }
              }
            });
            this.app_name_list = newoptionlist
          }
          //end

        }).catch(function (rs) {
          console.log(rs)
          tothis.listLoading = false
        })
      },//获取项目名
      getNum(num1, num2) {
        let list = []
        list.push(num1)
        for (let i = num1 + 1; i <= num2; i++) {
          list.push(i)
        }
        return list
      },//获得两个数字间的所有数字
      fetchName() {
        if (!checkPermission(['admin', 'leader', 'operator'])) {
          let data = {
            username: this.name
          }
          let tothis = this
          this.listLoading = true
          getResourceName(data).then(response => {
            this.names = response.data
            this.listLoading = false
          }).catch(function (rs) {
            tothis.listLoading = false
            console.error(rs)
          })
        } else {
          let tothis = this
          this.listLoading = true
          getName().then(response => {
            this.names = response.data
            this.listLoading = false
          }).catch(function (rs) {
            tothis.listLoading = false
            console.log(rs)
          })
        }
      },//获取应用名
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
