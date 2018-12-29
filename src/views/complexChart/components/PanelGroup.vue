<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div style="margin-left: 140px;margin-bottom: -37px">
            对比新增用户：{{statistical_data.contrast_newuser}}<br><br>
            同比:<span style="color: hotpink" v-if="statistical_data.newuser_change<0"> ↘ &nbsp;{{statistical_data.newuser_change}}%</span><span style="color: limegreen" v-if="statistical_data.newuser_change>0">↗ &nbsp;{{statistical_data.newuser_change}}%</span>
          </div>
          <div class="card-panel-text">新增用户</div>
          <count-to :start-val="0" :end-val="this.statistical_data.newuser" :duration="2600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div style="margin-left: 140px;margin-bottom: -37px">
            对比活跃用户：{{statistical_data.contrast_activeuser}}<br><br>
            同比:<span style="color: hotpink" v-if="statistical_data.activeuser_change<0"> ↘ &nbsp;{{statistical_data.activeuser_change}}%</span><span style="color: limegreen" v-if="statistical_data.activeuser_change>0"> ↗ &nbsp;{{statistical_data.activeuser_change}}%</span>
          </div>
          <div class="card-panel-text">活跃用户</div>
          <count-to :start-val="0" :end-val="this.statistical_data.activeuser" :duration="3000" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="documentation" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div style="margin-left: 140px;margin-bottom: -37px">
            对比总展次：{{statistical_data.contrast_showtimes}}<br><br>
            同比:<span style="color: hotpink" v-if="statistical_data.showtimes_change<0"> ↘ &nbsp;{{statistical_data.showtimes_change}}%</span><span style="color: limegreen" v-if="statistical_data.showtimes_change>0"> ↗ &nbsp;{{statistical_data.showtimes_change}}%</span>
          </div>
          <div class="card-panel-text">总展次</div>
          <count-to :start-val="0" :end-val="this.statistical_data.showtimes" :duration="3200" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div style="margin-left: 140px;margin-bottom: -37px">
            对比总流水：{{statistical_data.contrast_earned}}<br><br>
            同比:<span style="color: hotpink" v-if="statistical_data.earned_change<0"> ↘ &nbsp;{{statistical_data.earned_change}}%</span><span style="color: limegreen" v-if="statistical_data.earned_change>0"> ↗ &nbsp;{{statistical_data.earned_change}}%</span>
          </div>
          <div class="card-panel-text">总流水</div>
          <count-to :start-val="0" :end-val="this.statistical_data.earned" :duration="3600" class="card-panel-num"/>
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
      big:50,
        small:-50,
        newuser:800000,
        newUser:800,
        activeUser:700,
        earned:9999,
        paidUser:998,
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
