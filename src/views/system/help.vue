<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      帮助
      <div v-if="checkPermission(['admin','director'])">
        132132132132
      </div>
      <div v-if="checkPermission(['admin','director'])">
        132132132132
      </div>
      <div v-if="checkPermission(['admin','director'])">
        132132132132
      </div>



    </div>
  </div>
</template>



<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
    export default {
        name: "help",
      methods: {
        checkPermission,
      }
    }
</script>

<style scoped>

</style>
