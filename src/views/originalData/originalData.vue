<template>
  <div class="app-container">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="用户数据" name="first">
        <user-data
          :project-list="projectList"
        ></user-data>
      </el-tab-pane>
      <el-tab-pane label="留存数据" name="second">
        <retention-data
          :project-list="projectList"
        ></retention-data>
      </el-tab-pane>
      <el-tab-pane label="广告数据" name="third">
        <advertise-data
        :project-list="projectList"
        ></advertise-data>
      </el-tab-pane>
      <el-tab-pane label="数据监测" name="fourth">
        <data-monitor></data-monitor>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import userData from '@/views/originalData/components/userData'
  import retentionData from '@/views/originalData/components/retentionData'
  import advertiseData from '@/views/originalData/components/advertiseData.vue'
  import dataMonitor from '@/views/originalData/components/dataMonitor.vue'
  import {getProjectList} from "@/api/originalData/userData" ;

  export default {
    components: {
      userData,
      retentionData,
      advertiseData,
      dataMonitor
    },
    data() {
      return {
        projectList:[],
        activeName: 'first'
      }
    },
    mounted() {
      this.listProject()
    },
    methods: {
      listProject() {
        let tothis = this
        getProjectList().then(response => {
          console.log('初始化项目列表', response.data)
          this.projectList = response.data
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '初始化应用列表',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//项目初始化

    }
  }
</script>
