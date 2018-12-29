<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHandler)
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler)
    }

    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)

    this.chart.dispose()
    this.chart = null
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    },
    setOptions({firstData ,secondData ,thirdData, forthData ,time,name} = {}) {
      this.chart.setOption({
        xAxis: {
          data: time,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: [name[0],name[1], name[2],name[3]]
        },
        series: [
          {
            name: name[0], itemStyle: {
              normal: {
                color: '#33ADA0',
                lineStyle: {
                  color: '#33ADA0',
                  width: 2 ,
                  type:'solid',
                  shadowColor: '#33ADA0',
                  shadowBlur:1,
                }
              }
            },
            smooth: true,
            type: 'line',
            data: firstData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: name[1], itemStyle: {
              normal: {
                color: '#F4A254',
                lineStyle: {
                  color: '#F4A254',
                  width: 2 ,
                  type:'Dotted line',
                  shadowColor: '#F4A254',
                  shadowBlur:10,
                }
              }
            },
            smooth: true,
            type: 'line',
            data: secondData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
          name: name[2], itemStyle: {
            normal: {
              color: '#33ADA0',
              lineStyle: {
                color: '#33ADA0',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: thirdData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: name[3],
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: forthData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
