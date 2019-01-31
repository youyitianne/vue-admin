<!--<template>-->
  <!--<div class="app-container">-->
    <!--<div class="filter-container" style="margin: 15px;margin-top: -5px">-->
      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"-->
                 <!--@click="handleCreate">{{addButton}}-->
      <!--</el-button>-->

    <!--</div>-->
    <!--<el-table-->
      <!--v-loading="listLoading"-->
      <!--:data="list"-->
      <!--element-loading-text="Loading"-->
      <!--border-->
      <!--stripe-->
      <!--fit-->
      <!--highlight-current-row>-->
      <!--<el-table-column align="center" label="ID" width="95">-->
        <!--<template slot-scope="scope" prop="id">-->
          <!--{{ ++scope.$index }}-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--&lt;!&ndash;<el-table-column label="id" width="110" style="display: none">&ndash;&gt;-->
      <!--&lt;!&ndash;<template slot-scope="scope">&ndash;&gt;-->
      <!--&lt;!&ndash;{{ scope.row.id }}&ndash;&gt;-->
      <!--&lt;!&ndash;</template>&ndash;&gt;-->
      <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
      <!--<el-table-column label="角色" width="400" align="center" prop="date">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.role }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="权限" width="400" align="center" prop="app_name">-->
        <!--&lt;!&ndash;<template slot-scope="scope">&ndash;&gt;-->
          <!--&lt;!&ndash;{{ scope.row.perm }}&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->

        <!--<template slot-scope="scope">-->
          <!--<el-tag :type="scope.row.perm | statusFilter">{{ scope.row.perm }}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column  label="备注" align="center" prop="channel">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ scope.row.note }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ '编辑' }}</el-button>-->
          <!--<el-button size="mini" type="danger" @click="handleDelete(scope.row)">{{ '删除' }}</el-button>-->
          <!--<el-button size="mini" type="danger" @click="handlePerm(scope.row)">{{ '资源' }}</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    <!--</el-table>-->
    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
      <!--<el-form ref="dataForm" :model="app" label-position="left" label-width="90px"-->
               <!--style="width: 400px; margin-left:50px;">-->
        <!--<el-form-item label="角色">-->
          <!--<el-input v-model="app.role" placeholder="请填写角色名~"/>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="权限">-->
          <!--<el-select v-model="app.perm" class="filter-item" placeholder="请选择权限">-->
            <!--<el-option v-for="item in permissionOptions" :key="item.key" :label="item.key" :value="item.val"/>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="备注">-->
          <!--<el-input v-model="app.note" placeholder="写点什么备注呢~" value="无"/>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogFormVisible = false">{{ '取消'}}</el-button>-->
        <!--<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ '确认' }}</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->

    <!--&lt;!&ndash;资源表&ndash;&gt;-->
    <!--<el-dialog :title="textMap.perm" :visible.sync="permFormVisible">-->
      <!--<el-tree-->
        <!--ref="tree"-->
        <!--:data="data2"-->
        <!--show-checkbox-->
        <!--node-key="id"-->
        <!--:props="defaultProps"-->
        <!--@check-change="handleCheckChange">-->
      <!--</el-tree>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="permFormVisible = false">{{ '取消'}}</el-button>-->
        <!--<el-button type="primary" @click="updatePerm()">{{ '确认' }}</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->



  <!--</div>-->
<!--</template>-->
<!--<script>-->
  <!--import {getPerm, creatPerm, updatePerm, deletePerm,getchannel} from '@/api/table/personalmanager/role_perms_Table'-->
  <!--import waves from '@/directive/waves'-->
  <!--import {parseTime} from '@/utils'-->
  <!--import Pagination from '@/components/Pagination' // Secondary package based on el-pagination-->

  <!--const permissionOptions = [-->
    <!--{ key: '添加', val: 'canWrite' },-->
    <!--{ key: '编辑', val: 'canUpdate' },-->
    <!--{ key: '删除', val: 'canDelete' },-->
  <!--]-->

  <!--export default {-->
    <!--filters: {-->
      <!--statusFilter(status) {-->
        <!--const statusMap = {-->
          <!--canWrite: '添加',-->
          <!--canUpdate: '修改',-->
          <!--canDelete: '删除'-->
        <!--}-->
        <!--return statusMap[status]-->
      <!--},-->
      <!--typeFilter(type) {-->
        <!--return calendarTypeKeyValue[type]-->
      <!--}-->
    <!--},-->
    <!--components: {Pagination},-->
    <!--directives: {waves},-->
    <!--data() {-->
      <!--return {-->
        <!--data2:[],-->
        <!--defaultProps: {-->
          <!--children: 'children',-->
          <!--label: 'label'-->
        <!--},-->
        <!--permissionOptions,-->
        <!--introduce: '介绍',-->
        <!--pickerOptions0: {-->
          <!--disabledDate(time) {-->
            <!--return time.getTime() > Date.now() - 8.64e6-->
          <!--}-->
        <!--},-->
        <!--addButton:'添加权限',-->
        <!--directives: {waves},-->
        <!--downloadLoading: false,-->
        <!--layout: '',-->
        <!--timevalue: '',-->
        <!--searchName: '搜索',-->
        <!--tableKey: 0,-->
        <!--list: null,-->
        <!--total: 0,-->
        <!--listLoading: false,-->
        <!--importanceOptions: [1, 2, 3],-->
        <!--names: [],-->
        <!--sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],-->
        <!--dialogStatus: '',-->
        <!--dialogFormVisible: false,-->
        <!--permFormVisible:false,-->
        <!--app: {-->
          <!--id: undefined,-->
          <!--name: undefined,-->
          <!--system: undefined,-->
          <!--icon: undefined,-->
          <!--introduce: undefined,-->
        <!--},-->
        <!--textMap: {-->
          <!--update: '编辑',-->
          <!--create: '创建',-->
          <!--perm:'权限'-->
        <!--},-->
        <!--rules: {-->
          <!--title: [{required: true, message: '必须有名字！', trigger: 'blur'}]-->
        <!--},-->
        <!--dialogPvVisible: false,-->
        <!--pvData: [],-->
        <!--sortOptions: [{label: 'ID Ascending', key: '+id'}, {label: 'ID Descending', key: '-id'}],-->
      <!--}-->
    <!--},-->
    <!--mounted() {-->
      <!--this.handleFilter();-->
      <!--this.initTree();-->
    <!--},-->
    <!--methods: {-->
      <!--initTree(){-->
        <!--let tothis=this-->
        <!--getchannel().then(rs => {-->
          <!--this.data2=rs.data;-->
        <!--}).catch(function (rs) {-->
          <!--console.log(rs)-->
        <!--})-->
      <!--},-->
      <!--handleCheckChange(data) {-->
        <!--console.log(this.$refs.tree.getCheckedKeys());-->
        <!--console.log(data, 1123);-->
      <!--},-->
      <!--handlePerm(row) {-->
        <!--this.app = Object.assign({}, row) // copy obj-->
        <!--this.dialogStatus = 'update'-->
        <!--this.permFormVisible = true-->
      <!--},-->

      <!--createData() {-->
        <!--if (this.app.role === '' || this.app.perm === '' || this.app.note === '') {-->
          <!--this.open3()-->
          <!--return-->
        <!--}-->
        <!--creatPerm(this.app).then(() => {-->
          <!--this.handleFilter();-->
          <!--this.list.unshift(this.app)-->
          <!--this.dialogFormVisible = false-->
          <!--this.$notify({-->
            <!--title: '成功',-->
            <!--message: '创建成功',-->
            <!--type: 'success',-->
            <!--duration: 2000-->
          <!--})-->
        <!--}).catch(function (rs) {-->
          <!--console.log(rs)-->
        <!--})-->
      <!--},-->
      <!--updateData() {-->
        <!--const tempData = Object.assign({}, this.app)-->
        <!--if (tempData.introduce === '' || tempData.name === '' || tempData.icon === '' || tempData.system === '') {-->
          <!--this.open3()-->
          <!--return-->
        <!--}-->
        <!--updatePerm(tempData).then(() => {-->
          <!--this.dialogFormVisible = false-->
          <!--this.handleFilter();-->
          <!--this.$notify({-->
            <!--title: '成功',-->
            <!--message: '更新成功',-->
            <!--type: 'success',-->
            <!--duration: 2000-->
          <!--})-->
        <!--}).catch(function (rs) {-->
          <!--console.log(rs)-->
        <!--})-->
      <!--},-->
      <!--handleCreate() {-->
        <!--this.resetTemp()-->
        <!--this.dialogStatus = 'create'-->
        <!--this.dialogFormVisible = true-->
        <!--this.$nextTick(() => {-->
          <!--this.$refs['dataForm'].clearValidate()-->
        <!--})-->
      <!--},-->
      <!--handleUpdate(row) {-->
        <!--this.app = Object.assign({}, row) // copy obj-->
        <!--this.dialogStatus = 'update'-->
        <!--this.dialogFormVisible = true-->
        <!--this.$nextTick(() => {-->
          <!--this.$refs['dataForm'].clearValidate()-->
        <!--})-->
      <!--},-->
      <!--handleDelete(row) {-->
        <!--this.$confirm('是否确定删除?', '提示', {-->
          <!--confirmButtonText: '确定',-->
          <!--cancelButtonText: '取消',-->
          <!--type: 'warning'-->
        <!--}).then(() => {-->
          <!--deletePerm(row).then(() => {-->
            <!--this.handleFilter();-->
            <!--this.$notify({-->
              <!--title: '成功',-->
              <!--message: '删除成功',-->
              <!--type: 'success',-->
              <!--duration: 2000-->
            <!--})-->
          <!--}).catch(function (rs) {-->
            <!--console.log(rs)-->
          <!--})-->
        <!--});-->

      <!--},-->
      <!--resetTemp() {-->
        <!--this.app = {-->
          <!--id: undefined,-->
          <!--name: '',-->
          <!--system: '安卓',-->
          <!--icon: '无',-->
          <!--introduce: '无',-->
        <!--}-->
      <!--},-->
      <!--open3() {-->
        <!--this.$message({-->
          <!--message: '记得选择查询范围~',-->
          <!--type: 'warning'-->
        <!--});-->
      <!--},-->
      <!--open4() {-->
        <!--this.$message({-->
          <!--message: '没有信息可以打印~',-->
          <!--type: 'warning'-->
        <!--});-->
      <!--},-->
      <!--handleFilter() {-->
        <!--getPerm().then(response => {-->
          <!--this.list = response.data-->
          <!--console.log(this.list)-->
          <!--this.listLoading = false-->
        <!--}).catch(function (rs) {-->
          <!--console.log(rs)-->
        <!--})-->
      <!--},-->
      <!--formatJson(filterVal, jsonData) {-->
        <!--return jsonData.map(v => filterVal.map(j => v[j]))-->
      <!--},-->
      <!--open3() {-->
        <!--this.$message({-->
          <!--message: '内容不能为空~',-->
          <!--type: 'warning'-->
        <!--});-->
      <!--},-->
    <!--}-->
  <!--}-->
<!--</script>-->
