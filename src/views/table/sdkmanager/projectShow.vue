<template>
  <div class="app-container">
    <div class="filter-container"
         style="margin: 15px;margin-top: -5px">
      <el-table
        stripe
        border
        :data="projectObject.paramter"
        style="width: 100%;margin-bottom: 30px;"
        :span-method="objectSpanMethod">
        <el-table-column
          prop="mark"
          label="模块名"
          style="width: 200px">
        </el-table-column>
        <el-table-column
          prop="param_name1"
          label="参数名"
          style="width: 300px">
        </el-table-column>
        <el-table-column
          prop="param"
          label="参数">
        </el-table-column>
      </el-table>

    </div>
  </div>

</template>

<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {mapGetters} from 'vuex'

  export default {
    components: {
    },
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
        projectObject:{},
      }
    },
    created() {
      this.routeWithParam()  //带参跳转
    },
    mounted() {
    },
    methods:{
      checkPermission,
      routeWithParam() {
        let data = this.$route.query.data
        if (typeof(data) != 'undefined') {
          data=this.projectObject
          console.log(data)
        }else {
          console.log('没找到参数')
        }
      },//带参跳转
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          const _row = this.spanArr[rowIndex];
          const _col = _row > 0 ? 1 : 0;
          return {
            rowspan: _row,
            colspan: _col

          }
        }
      },//合并单元格
    }
  }
</script>

<style type="text/css">

</style>



