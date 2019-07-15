<template>
  <div class="app-container">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="概况" name="first">
        <general-situation
        :project-list="projectList"
        ></general-situation>
      </el-tab-pane>
      <el-tab-pane label="用户分析" name="second">
      </el-tab-pane>
      <el-tab-pane label="广告分析" name="third">
      </el-tab-pane>
      <el-tab-pane label="版本分析" name="fourth">
      </el-tab-pane>
      <el-tab-pane label="渠道分析" name="fifth">
      </el-tab-pane>
      <el-tab-pane label="互推分析" name="sixth">
      </el-tab-pane>
      <el-tab-pane label="市场分析" name="seventh">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import generalSituation from '@/views/gameAnalysis/components/generalSituation'
  import {getProjectList} from "@/api/originalData/userData" ;

  export default {
    components: {
      generalSituation
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
