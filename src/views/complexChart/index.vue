<template>
  <div class="dashboard-editor-container">
    <panel-group @handleSetLineChartData="handleSetLineChartData"/>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>

    <!--<el-row :gutter="8">-->
      <!--<el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">-->
        <!--<transaction-table/>-->
      <!--</el-col>-->
      <!--<el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
        <!--<todo-list/>-->
      <!--</el-col>-->
      <!--<el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">-->
        <!--<box-card/>-->
      <!--</el-col>-->
    <!--</el-row>-->

  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import {gettest} from '@/api/lineMarker'

let lineChartData = {
  newVisitis: {
    name:["实际","预计","可能","好像"],
    time:[1,2,3,4,5,6,7],
    firstData:[530, 140, 141, 142, 145, 150, 160],
    secondData: [100, 120, 161, 134, 105, 160, 165],
    thirdData: [120, 82, 91, 154, 162, 140, 145],
    forthData:[200, 192, 120, 144, 160, 130, 140  ],

  },
  messages: {
    name:["实际","好像"],
    time:[7,26,35,44,55,63,7],
    firstData: [200, 192, 120, 144, 160, 130, 140],
    secondData: [180, 160, 151, 106, 145, 150, 130],

  },
  purchases: {
    name:["可能","好像"],
    time:[11,22,33,44,55,66,77],
    firstData: [80, 100, 121, 104, 105, 90, 100],
    secondData: [120, 90, 100],

  },
  shoppings: {
    name:["实际","预计"],
    time:[781,828,3,48,5,86,87],
    firstData: [130, 140, 141, 142, 145, 150, 160],
    secondData: [120, 82, 91, 154, 162, 140, 130],
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  mounted(){
    this.fetchData()
},
  methods: {
    fetchData(){
      gettest().then(response => {
      //  lineChartData.newVisitis.date=response.data[0]
        console.log(response.data[0])
      }).catch(function (rs) {
        console.log(rs)
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
