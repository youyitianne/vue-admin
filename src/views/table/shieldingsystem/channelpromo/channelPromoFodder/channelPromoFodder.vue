<template>
  <div class="components-container">

  </div>
</template>

<script>
  import {getToken} from '@/utils/auth'
  import {getip, postip, getapplist, searchapp, getparams, addparams, editparams} from '@/api/shieldingsystem/testmode'

  export default {
    name: 'DropzoneDemo',
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .filter_input {
    margin-right: 15px;
  }

  .filter_text {
    margin-right: 7px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 14px Base
  }

  #filter_title {
    margin-right: 40px;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font: 13px Small;
  }

  .ts-title {
    font-size: 15px;
    font-weight: bolder
  }
</style>


