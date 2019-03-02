<template>
  <div class="app-container">
    <div class="filter-container"
         style="margin: 15px;margin-top: -5px">
      <el-date-picker
        v-model="daily_adtype_download_value"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions0">>
      </el-date-picker>

      <el-select v-model="daily_adtype_chooseNamed" style="margin-right: 20px" @change="" value-key="project_name"
                 :placeholder="'选择项目'" filterable>
        <el-option v-for="item in app_name_list" :key="item.project_name" :label="item.project_name" :value="item">
        </el-option>
      </el-select>

      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"
                 @click="daily_adtype_download">
        {{'下载展次表（新）'}}
      </el-button>
      <br>
    </div>
  </div>

</template>

<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {getResourceName} from "@/api/resourceName"; //根据帐号获取被分配的项目列表
  import store from '@/store'  //获取本地缓存信息
  import {
    getProjectList,
    getList,
    getListdata,
    getdownload,
    getName,
    getarpufile,
    getarpufile1,
    getDailyMsg,
    getDailyAdtypeMsg
  } from '@/api/table/datamanager/addata'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
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
        daily_adtype_download_value: [],
        daily_adtype_chooseNamed: '选择项目',
        app_name_list: [],
        hackReset: false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },
        directives: {waves},
        downloadLoading: false,
        list: null,
        listLoading: true,
        names: [],
      }
    },
    created() {
      this.fetchProject()
    },
    methods: {
      daily_adtype_download() {
        // daily_adtype_download_value:[],
        // daily_adtype_chooseNamed:'',
        let tothis = this
        if (this.daily_adtype_download_value === null) {
          this.open3()
          return
        }
        if (this.daily_adtype_chooseNamed === '选择项目') {
          this.open3()
          return
        }
        if (this.daily_adtype_download_value[0] === undefined) {
          this.open3()
          return
        }
        if (this.daily_adtype_download_value[1] === undefined) {
          this.open3()
          return
        }
        this.downloadLoading = true

        let param = {
          start: this.daily_adtype_download_value[0],
          end: this.daily_adtype_download_value[1],
          list: this.daily_adtype_chooseNamed
        }
        getDailyAdtypeMsg(param).then(data => {
          if (!data) {
            return
          }
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', param.start + '_' + param.end + param.list.project_name + '_arpu.xls')
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
      },//广告形式细分表下载
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
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
      ,
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
      },padLeftZero(str) {
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
