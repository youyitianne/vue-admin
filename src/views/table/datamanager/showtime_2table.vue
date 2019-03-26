<template>
  <div class="app-container">
    <div class="filter-container"
         style="margin: 15px;margin-top: -5px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="预览" name="first">
          <el-date-picker
            v-model="daily_adtype_download_value"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions0">>
          </el-date-picker>

          <el-select v-model="daily_adtype_chooseNamed"
                     style="margin-right: 20px"
                     @change=""
                     value-key="project_name"
                     :placeholder="'选择项目'" filterable>
            <el-option v-for="item in app_name_list" :key="item.project_name" :label="item.project_name" :value="item">
            </el-option>
          </el-select>
          <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-search"
                     @click="daily_adtype_download">
            {{'预览'}}
          </el-button>
          <table class="gridtable" style="margin-top: 20px">
            <tr v-for="item in perviewList">
              <td v-for="item1 in item">{{item1}}</td>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane label="下载新展次表" name="second">
          <el-date-picker
            v-model="daily_adtype_download_value"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions0">>
          </el-date-picker>

          <el-select v-model="appList_choosed"
                     style="margin-right: 20px"
                     @change=""
                     value-key="project_name"
                     multiple
                     :multiple-limit=5
                     collapse-tags
                     :placeholder="'选择项目'" filterable>
            <el-option v-for="item in app_name_list" :key="item.project_name" :label="item.project_name" :value="item">
            </el-option>
          </el-select>

          <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download"
                     @click="daily_adtype_download1">
            {{'下载展次表（新）'}}
          </el-button>
        </el-tab-pane>
      </el-tabs>

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
    getDailyAdtypeMsg,
    getDailyAdtypeMsg_preview
  } from '@/api/table/datamanager/showtime_table2'
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
        perviewList:[],
        activeName: 'first',
        appList_choosed: [],
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
        getDailyAdtypeMsg_preview(param).then(response => {
          if (!response) {
            return
          }
          let namelist = this.initList();

          let list = response.data
          let newlist1 = []
          for (let i = 0; i < namelist.length; i++) {
            let newlist2 = []
            newlist2.push(namelist[i])
            for (let j = 0; j < list.length; j++) {
              newlist2.push(list[j][i])
            }
            newlist1.push(newlist2)
          }
          this.perviewList=newlist1

          this.downloadLoading = false
        }).catch(function (rs) {
          console.log(rs.toString())
          tothis.downloadLoading = false
          tothis.$notify({
            title: '预览失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//广告形式细分表下载
      daily_adtype_download1() {
        let tothis = this
        if (this.daily_adtype_download_value === null) {
          this.open3()
          return
        }
        if (this.appList_choosed.length < 1) {
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
        for (let i = 0; i < this.appList_choosed.length; i++) {
          let param = {
            start: this.daily_adtype_download_value[0],
            end: this.daily_adtype_download_value[1],
            list: this.appList_choosed[i]
          }
          getDailyAdtypeMsg(param).then(data => {
            if (!data) {
              return
            }
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', param.list.project_name + '_' + param.start + '_' + param.end + '_arpu.xls')
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
        }
      },//广告形式细分表下载
      fetchProject() {
        let tothis = this
        this.listLoading = true
        getProjectList().then(response => {
          let appslist = response.data
          //根据资源分配调整项目列表start
          let valid = this.checkPermission(['director']) || this.checkPermission(['admin']) || this.checkPermission(['operatorleader']) || this.checkPermission(['sdksuport'])
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
      },
      initList() {
        let list = []
        list.push("日期")
        let channel = 'oppo'
        list = this.setList(channel, list)
        channel = '华为'
        list = this.setList(channel, list)
        channel = 'vivo'
        list = this.setList(channel, list)
        channel = '4399'
        list = this.setList(channel, list)
        return list
      },
      setList(channel, list) {
        list.push(channel + '-' + ' 总营收 ');
        list.push(channel + '-' + ' 总dauarpu ');
        list.push(channel + '-' + ' 启动次数 ');
        list.push(channel + '-' + ' 单次使用时长 ');
        list.push(channel + '-' + ' 新增 ');
        list.push(channel + '-' + ' 活跃 ');
        list.push(channel + '-' + ' 次留 ');
        list.push(channel + '-' + ' 广点通营收 ');
        list.push(channel + '-' + ' gdt- dauarpu ');
        list.push(channel + '-' + ' gdt- 横幅-普通 营收 ');
        list.push(channel + '-' + ' gdt- 横幅-普通 点击率 ');
        list.push(channel + '-' + ' gdt- 横幅-普通 ecpm ');
        list.push(channel + '-' + ' gdt- 横幅-普通 展示总次数 ');
        list.push(channel + '-' + ' gdt- 横幅-普通 每用户展示次数 ');
        list.push(channel + '-' + ' gdt- 插屏-普通 营收 ');
        list.push(channel + '-' + ' gdt- 插屏-普通 点击率 ');
        list.push(channel + '-' + ' gdt- 插屏-普通 ecpm ');
        list.push(channel + '-' + ' gdt- 插屏-普通 展示总次数 ');
        list.push(channel + '-' + ' gdt- 插屏-普通 每用户展示次数 ');
        list.push(channel + '-' + ' gdt- 插屏-渲染 营收 ');
        list.push(channel + '-' + ' gdt- 插屏-渲染 点击率 ');
        list.push(channel + '-' + ' gdt- 插屏-渲染 ecpm ');
        list.push(channel + '-' + ' gdt- 插屏-渲染 展示总次数 ');
        list.push(channel + '-' + ' gdt- 插屏-渲染 每用户展示次数 ');
        list.push(channel + '-' + ' gdt- 插屏-模版 营收 ');
        list.push(channel + '-' + ' gdt- 插屏-模版 点击率 ');
        list.push(channel + '-' + ' gdt- 插屏-模版 ecpm ');
        list.push(channel + '-' + ' gdt- 插屏-模版 展示总次数 ');
        list.push(channel + '-' + ' gdt- 插屏-模版 每用户展示次数 ');
        list.push(channel + '-' + ' gdt- 开屏-普通 营收 ');
        list.push(channel + '-' + ' gdt- 开屏-普通 点击率 ');
        list.push(channel + '-' + ' gdt- 开屏-普通 ecpm ');
        list.push(channel + '-' + ' gdt- 开屏-普通 展示总次数 ');
        list.push(channel + '-' + ' gdt- 开屏-普通 每用户展示次数 ');
        list.push(channel + '-' + ' gdt- 开屏-渲染 营收 ');
        list.push(channel + '-' + ' gdt- 开屏-渲染 点击率 ');
        list.push(channel + '-' + ' gdt- 开屏-渲染 ecpm ');
        list.push(channel + '-' + ' gdt- 开屏-渲染 展示总次数 ');
        list.push(channel + '-' + ' gdt- 开屏-渲染 每用户展示次数 ');
        list.push(channel + '-' + ' gdt- 开屏-模版 营收 ');
        list.push(channel + '-' + ' gdt- 开屏-模版 点击率 ');
        list.push(channel + '-' + ' gdt- 开屏-模版 ecpm ');
        list.push(channel + '-' + ' gdt- 开屏-模版 展示总次数 ');
        list.push(channel + '-' + ' gdt- 开屏-模版 每用户展示次数 ');
        list.push(channel + '-' + ' gdt- 视频-激励 营收 ');
        list.push(channel + '-' + ' gdt- 视频-激励 点击率 ');
        list.push(channel + '-' + ' gdt- 视频-激励 ecpm ');
        list.push(channel + '-' + ' gdt- 视频-激励 展示总次数 ');
        list.push(channel + '-' + ' gdt- 视频-激励 每用户展示次数 ');
        list.push(channel + '-' + ' 渠道分成 ');
        list.push(channel + '-' + ' qd- dauarpu ');
        list.push(channel + '-' + ' qd- 横幅-普通 营收 ');
        list.push(channel + '-' + ' qd- 横幅-普通 点击率 ');
        list.push(channel + '-' + ' qd- 横幅-普通 ecpm ');
        list.push(channel + '-' + ' qd- 横幅-普通 展示总次数 ');
        list.push(channel + '-' + ' qd- 横幅-普通 每用户展示次数 ');
        list.push(channel + '-' + ' qd- 插屏-普通 营收 ');
        list.push(channel + '-' + ' qd- 插屏-普通 点击率 ');
        list.push(channel + '-' + ' qd- 插屏-普通 ecpm ');
        list.push(channel + '-' + ' qd- 插屏-普通 展示总次数 ');
        list.push(channel + '-' + ' qd- 插屏-普通 每用户展示次数 ');
        list.push(channel + '-' + ' qd- 插屏-渲染 营收 ');
        list.push(channel + '-' + ' qd- 插屏-渲染 点击率 ');
        list.push(channel + '-' + ' qd- 插屏-渲染 ecpm ');
        list.push(channel + '-' + ' qd- 插屏-渲染 展示总次数 ');
        list.push(channel + '-' + ' qd- 插屏-渲染 每用户展示次数 ');
        list.push(channel + '-' + ' qd- 插屏-模版 营收 ');
        list.push(channel + '-' + ' qd- 插屏-模版 点击率 ');
        list.push(channel + '-' + ' qd- 插屏-模版 ecpm ');
        list.push(channel + '-' + ' qd- 插屏-模版 展示总次数 ');
        list.push(channel + '-' + ' qd- 插屏-模版 每用户展示次数 ');
        list.push(channel + '-' + ' qd- 开屏-普通 营收 ');
        list.push(channel + '-' + ' qd- 开屏-普通 点击率 ');
        list.push(channel + '-' + ' qd- 开屏-普通 ecpm ');
        list.push(channel + '-' + ' qd- 开屏-普通 展示总次数 ');
        list.push(channel + '-' + ' qd- 开屏-普通 每用户展示次数 ');
        list.push(channel + '-' + ' qd- 开屏-渲染 营收 ');
        list.push(channel + '-' + ' qd- 开屏-渲染 点击率 ');
        list.push(channel + '-' + ' qd- 开屏-渲染 ecpm ');
        list.push(channel + '-' + ' qd- 开屏-渲染 展示总次数 ');
        list.push(channel + '-' + ' qd- 开屏-渲染 每用户展示次数 ');
        list.push(channel + '-' + ' qd- 开屏-模版 营收 ');
        list.push(channel + '-' + ' qd- 开屏-模版 点击率 ');
        list.push(channel + '-' + ' qd- 开屏-模版 ecpm ');
        list.push(channel + '-' + ' qd- 开屏-模版 展示总次数 ');
        list.push(channel + '-' + ' qd- 开屏-模版 每用户展示次数 ');
        list.push(channel + '-' + ' qd- 视频-普通 营收 ');
        list.push(channel + '-' + ' qd- 视频-普通 点击率 ');
        list.push(channel + '-' + ' qd- 视频-普通 ecpm ');
        list.push(channel + '-' + ' qd- 视频-普通 展示总次数 ');
        list.push(channel + '-' + ' qd- 视频-普通 每用户展示次数 ');
        list.push(channel + '-' + ' qd- 视频-激励 营收 ');
        list.push(channel + '-' + ' qd- 视频-激励 点击率 ');
        list.push(channel + '-' + ' qd- 视频-激励 ecpm ');
        list.push(channel + '-' + ' qd- 视频-激励 展示总次数 ');
        list.push(channel + '-' + ' qd- 视频-激励 每用户展示次数 ');
        list.push(channel + '-' + ' 头条分成 ');
        list.push(channel + '-' + ' tt- dauarpu ');
        list.push(channel + '-' + ' tt- 横幅-普通 营收 ');
        list.push(channel + '-' + ' tt- 横幅-普通 点击率 ');
        list.push(channel + '-' + ' tt- 横幅-普通 ecpm ');
        list.push(channel + '-' + ' tt- 横幅-普通 展示总次数 ');
        list.push(channel + '-' + ' tt- 横幅-普通 每用户展示次数 ');
        list.push(channel + '-' + ' tt- 插屏-普通 营收 ');
        list.push(channel + '-' + ' tt- 插屏-普通 点击率 ');
        list.push(channel + '-' + ' tt- 插屏-普通 ecpm ');
        list.push(channel + '-' + ' tt- 插屏-普通 展示总次数 ');
        list.push(channel + '-' + ' tt- 插屏-普通 每用户展示次数 ');
        list.push(channel + '-' + ' tt- 插屏-渲染 营收 ');
        list.push(channel + '-' + ' tt- 插屏-渲染 点击率 ');
        list.push(channel + '-' + ' tt- 插屏-渲染 ecpm ');
        list.push(channel + '-' + ' tt- 插屏-渲染 展示总次数 ');
        list.push(channel + '-' + ' tt- 插屏-渲染 每用户展示次数 ');
        list.push(channel + '-' + ' tt- 插屏-模版 营收 ');
        list.push(channel + '-' + ' tt- 插屏-模版 点击率 ');
        list.push(channel + '-' + ' tt- 插屏-模版 ecpm ');
        list.push(channel + '-' + ' tt- 插屏-模版 展示总次数 ');
        list.push(channel + '-' + ' tt- 插屏-模版 每用户展示次数 ');
        list.push(channel + '-' + ' tt- 开屏-普通 营收 ');
        list.push(channel + '-' + ' tt- 开屏-普通 点击率 ');
        list.push(channel + '-' + ' tt- 开屏-普通 ecpm ');
        list.push(channel + '-' + ' tt- 开屏-普通 展示总次数 ');
        list.push(channel + '-' + ' tt- 开屏-普通 每用户展示次数 ');
        list.push(channel + '-' + ' tt- 开屏-渲染 营收 ');
        list.push(channel + '-' + ' tt- 开屏-渲染 点击率 ');
        list.push(channel + '-' + ' tt- 开屏-渲染 ecpm ');
        list.push(channel + '-' + ' tt- 开屏-渲染 展示总次数 ');
        list.push(channel + '-' + ' tt- 开屏-渲染 每用户展示次数 ');
        list.push(channel + '-' + ' tt- 开屏-模版 营收 ');
        list.push(channel + '-' + ' tt- 开屏-模版 点击率 ');
        list.push(channel + '-' + ' tt- 开屏-模版 ecpm ');
        list.push(channel + '-' + ' tt- 开屏-模版 展示总次数 ');
        list.push(channel + '-' + ' tt- 开屏-模版 每用户展示次数 ');
        list.push(channel + '-' + ' tt- 视频-普通 营收 ');
        list.push(channel + '-' + ' tt- 视频-普通 点击率 ');
        list.push(channel + '-' + ' tt- 视频-普通 ecpm ');
        list.push(channel + '-' + ' tt- 视频-普通 展示总次数 ');
        list.push(channel + '-' + ' tt- 视频-普通 每用户展示次数 ');
        list.push(channel + '-' + ' tt- 视频-激励 营收 ');
        list.push(channel + '-' + ' tt- 视频-激励 点击率 ');
        list.push(channel + '-' + ' tt- 视频-激励 ecpm ');
        list.push(channel + '-' + ' tt- 视频-激励 展示总次数 ');
        list.push(channel + '-' + ' tt- 视频-激励 每用户展示次数 ');

        return list
      },

    }
  }
</script>


<style type="text/css">
  .gridtable {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 14px bolder;
    border-collapse: collapse;
  }

  .gridtable tr {
    border-width: 0px;
    padding: 0px;
    border-style: solid;
    border-color: #99a9bf;
    background-color: #dedede;
  }

  .gridtable td {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    color: #666666;
    margin: 0px;
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #dcdfe6;
    background-color: #ffffff;
  }
</style>
