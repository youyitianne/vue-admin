<template>
  <div class="app-container">
    <el-input placeholder="根据账号查找" v-model="inputName" style="width: 200px;margin-bottom: 15px" class="filter-item" clearable @blur="getDatawithName"/>
    <el-table
      height="850"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope" prop="id">
          {{ ++scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="帐号" width="300" align="center" prop="date">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="300" align="center" prop="app_name" v-if="false">
        <template slot-scope="scope">
          {{ scope.row.role_name }}
        </template>
      </el-table-column>
      <el-table-column label="角色标识" width="300" align="center" prop="app_name">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column label="角色描述" width="300" align="center" prop="app_name" v-if="false">
        <template slot-scope="scope">
          {{ scope.row.role_describe }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="channel">
        <template slot-scope="scope">
          <span>{{ scope.row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleResource(scope.row)">{{ '资源' }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--资源表-->
    <el-dialog :title="resourceName" :visible.sync="resourceFormVisible">
      <el-input
        style="width: 200px;margin-bottom: 15px;margin-right: 20px"
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-button round @click="election">全选</el-button>
      <el-tree
        ref="tree"
        :data="data2"
        show-checkbox
        node-key="id"
        :filter-node-method="filterNode"
        :default-checked-keys="checkedlist"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resourceFormVisible = false">{{ '取消'}}</el-button>
        <el-button type="primary" @click="updateResource()">{{ '确认' }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {getRole, getapplist, getResource, createResource,getProject} from '@/api/table/personalmanager/resourceTable'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import checkPermission from '@/utils/permission' // 权限判断函数
  import store from '@/store'

  export default {
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    components: {Pagination},
    directives: {waves},
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
        select:true,
        filterText:'',
        create_flag:true,
        update_flag:true,
        inputName:'',
        hidlist:[],
        resourcelist: null,
        data2: [],
        checkedlist: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        resourceFormVisible: false,
        resourceName: '资源编辑',
        list: null,
        listLoading: true,
      }
    },
    mounted() {
      this.handleFilter();
      this.initTree();
    },
    methods: {
      election(){
        if (this.select){
          let data=this.data2
          let list=[]
          for (let i=0;i<data.length;i++){
            let id=data[i].id
            list.push(id)
          }
          this.$refs.tree.setCheckedKeys(list);
          this.select=false
        } else {
          this.$refs.tree.setCheckedKeys([]);
          this.select=true
        }


      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      initTree() {
        let tothis = this
        getProject().then(rs => {
          let projects=rs.data
          let projectlist=[]
          for (let i=0;i<projects.length;i++){
            let project={
              id:projects[i].id,
              label: projects[i].project_name
            }
            projectlist.push(project)
          }
          this.data2 = projectlist
        }).catch(function (rs) {
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
            console.error(rs)
        })
      },//获取项目列表初始化树形图
      updateResource() {
        let tothis = this;
        let namelist = this.$refs.tree.getCheckedNodes();
        let name = '';
        for (let i = 0; i < namelist.length; i++) {
          name = name + namelist[i].label
          if (i != namelist.length - 1) {
            name = name + ','
          }
        }
        let data = {
          username: this.resourcelist.username,
          username_mark: this.resourcelist.username_mark,
          resources: this.$refs.tree.getCheckedKeys().toString(),
          resources_name: name
        }
        if (!this.update_flag) {
          return
        }
        this.update_flag=false
        createResource(data).then(() => {
          this.handleFilter();
          this.resourceFormVisible = false
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
          this.update_flag=true
        }).catch(function (rs) {
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
          this.update_flag=true
        })
      },//更新资源
      handleResource(row) {
        this.select=true
        let tothis=this
        this.resourcelist = row
        this.app = Object.assign({}, row) // copy obj
        getResource(row).then(rs => {
          if (this.$refs.tree != undefined) {
            this.$refs.tree.setCheckedKeys([]);
          }
          this.checkedlist = rs.data
          this.resourceFormVisible = true
        }).catch(function (rs) {
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
          console.error(rs)
        })
      },//获取资源
      handleFilter() {
        let tothis = this
        getRole().then(response => {
          let accountName = store.getters && store.getters.name
          let data = response.data
          let uselesslist=this.getUselessName(data)
          let newlist = [];
          if (!checkPermission(['admin','director'])) {
            if (checkPermission(['operator', 'planner', 'developer', 'market'])) {
              let role = this.check();
              for (let i = 0; i < data.length; i++) {
                if (data[i].role == role && data[i].username != accountName) {
                  //
                  let flag=true
                  for (let j=0;j<uselesslist.length;j++){
                    if (data[i].username===uselesslist[j]){
                      flag=false
                    }
                  }
                  if (flag){
                    newlist.push(data[i])
                  }
                }
              }
            }
          } else {
            for (let i = 0; i < data.length; i++) {
              if (data[i].username != accountName&&data[i].role != 'leader') {
                //去掉不需要设置权限的人
                let flag=true
                // for (let j=0;j<uselesslist.length;j++){
                //   if (data[i].username===uselesslist[j]){
                //     flag=false
                //   }
                // }
                if (flag){
                  newlist.push(data[i])
                }

              }
            }
          }
          this.list = newlist
          this.hidlist=newlist
          tothis.listLoading = false
        }).catch(function (rs) {
          console.log(rs)
          tothis.$notify({
            title: '失败',
            message: '请稍后重试',
            type: 'error',
            duration: 2000
          })
          tothis.listLoading = false
        })
      },//获取table
      getDatawithName(){
        this.listLoading=true
        let param=this.inputName
        if (param==''){
          this.list=this.hidlist;
          this.listLoading=false
          return
        }
        let data=[]
        for (let i=0;i<this.hidlist.length;i++){
          if (this.hidlist[i].username.search(param)!=-1){
            data.push(this.hidlist[i])
          }
        }
        this.list = data
        this.listLoading=false
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      getUselessName(data){
        let list=[]
        for (let i=0;i<data.length;i++){
          if (data[i].role==='leader'||data[i].role==='admin') {
            list.push(data[i].username)
          }
        }
        return list
      },
      check() {
        let name = "未知";
        let names = ['operator', 'planner', 'developer', 'market'];
        for (let i = 0; i < names.length; i++) {
          if (checkPermission([names[i]])) {
            name = names[i]
          }
        }
        return name
      }



    }
  }
</script>
