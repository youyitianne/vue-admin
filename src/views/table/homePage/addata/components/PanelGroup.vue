<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="banner" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">横幅人均展次</div>
          <span style="font-size: 20px;font-weight: bold">{{statistical_data.banner}}</span>
          <!--<count-to :start-val="0" :end-val="this.statistical_data.banner" :duration="10" class="card-panel-num"/>-->
        </div>
        <div style="margin-top: 20px;margin-left: 50px;font-size: 14px;font-weight: bolder">
          对比横幅人均展次：{{statistical_data.contrast_banner}}<br><br>
          同比:<span style="color:  limegreen" v-if="statistical_data.banner_change<0">↘ &nbsp;{{statistical_data.banner_change}}%</span>
          <span style="color: hotpink" v-if="statistical_data.banner_change>0">↗ &nbsp;{{statistical_data.banner_change}}%</span>
          <span style="color: grey" v-if="statistical_data.banner_change==0"> &nbsp;≈&nbsp;0&nbsp;%</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="video" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">视频人均展次</div>
          <span style="font-size: 20px;font-weight: bold"> {{statistical_data.video}}</span>
          <!--<count-to :start-val="0" :end-val="this.statistical_data.video" :duration="10" class="card-panel-num"/>-->
        </div>
        <div style="margin-top: 20px;margin-left: 50px;font-size: 14px;font-weight: bolder">
          对比视频人均展次：{{statistical_data.contrast_video}}<br><br>
          同比:
          <span style="color:  limegreen" v-if="statistical_data.video_change<0">↘ &nbsp;{{statistical_data.video_change}}%</span>
          <span style="color: hotpink"
                v-if="statistical_data.video_change>0">↗ &nbsp;{{statistical_data.video_change}}%</span>
          <span style="color: grey" v-if="statistical_data.video_change==0"> &nbsp;≈&nbsp;0&nbsp;%</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="inline" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">插屏人均展次</div>
          <span style="font-size: 20px;font-weight: bold">{{statistical_data.inline}}</span>
          <!--<count-to :start-val="0" :end-val="this.statistical_data.inline" :duration="10" class="card-panel-num"/>-->
        </div>
        <div style="margin-top: 20px;margin-left: 50px;font-size: 14px;font-weight: bolder">
          对比插屏人均展次：{{statistical_data.contrast_inline}}<br><br>
          同比:
          <span style="color:  limegreen" v-if="statistical_data.inline_change<0">↘ &nbsp;{{statistical_data.inline_change}}%</span>
          <span style="color: hotpink" v-if="statistical_data.inline_change>0">↗ &nbsp;{{statistical_data.inline_change}}%</span>
          <span style="color: grey" v-if="statistical_data.inline_change==0"> &nbsp;≈&nbsp;0&nbsp;%</span>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="splash" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">开屏人均展次</div>
          <span style="font-size: 20px;font-weight: bold">  {{statistical_data.splash}}</span>
          <!--<count-to :start-val="0" :end-val="this.statistical_data.splash" :duration="10" class="card-panel-num"/>-->
        </div>
        <div style="margin-top: 20px;margin-left: 50px;font-size: 14px;font-weight: bolder">
          对比开屏人均展次：{{statistical_data.contrast_splash}}<br><br>
          同比:
          <span style="color:  limegreen" v-if="statistical_data.splash_change<0">↘ &nbsp;{{statistical_data.splash_change}}%</span>
          <span style="color: hotpink" v-if="statistical_data.splash_change>0">↗ &nbsp;{{statistical_data.splash_change}}%</span>
          <span style="color: grey" v-if="statistical_data.splash_change==0"> &nbsp;≈&nbsp;0&nbsp;%</span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import CountTo from 'vue-count-to'
  import Index from "@/components/Dropzone/index.vue";

  export default {
    components: {
      Index,
      CountTo
    },
    props: {
      statistical_data: {
        type: Object,
        default: '765'
      }
    }
    ,
    data() {
      return {}
    },
    mounted() {

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
    .card-panel-col {
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
        margin: 14px 25px 0 14px;
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
