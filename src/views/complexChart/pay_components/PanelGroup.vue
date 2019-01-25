<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people" style="margin-right: 25px">
          <svg-icon icon-class="rmb" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">支付金额</div>
          <count-to :start-val="0" :end-val="this.statistical_data.pay" :duration="10" class="card-panel-num"/>
        </div>
        <div style="margin-top: 20px;margin-left: 60px;font-size: 14px;font-weight: bolder">
            对比支付金额：{{statistical_data.contrast_pay}}<br><br>
            同比:
          <span style="color: limegreen" v-if="statistical_data.pay_change<0">↘ &nbsp;{{statistical_data.pay_change}}%</span>
          <span style="color: hotpink" v-if="statistical_data.pay_change>0">↗ &nbsp;{{statistical_data.pay_change}}%</span>
          <span style="color: grey" v-if="statistical_data.pay_change==0"> &nbsp;≈&nbsp;0&nbsp;%</span>
          </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import Index from "../../../components/Dropzone/index";

export default {
  components: {
    Index,
    CountTo
  },
  props:{
    statistical_data:{
      type:Object,
      default:'765'
    }
  }
  ,
  data(){
    return{

    }
  },
  mounted(){

  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shopping {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shopping {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
