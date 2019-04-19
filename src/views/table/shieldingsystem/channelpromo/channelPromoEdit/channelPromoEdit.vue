<template>
  <div class="components-container">
    <el-button @click="searchDialog=true" type="primary" style="margin: 20px">搜索应用</el-button>
    <el-dialog
      title="搜索应用"
      :visible.sync="searchDialog"
      width="30%">
      <el-form ref="fetchForm" :model="fetchForm" label-width="200px">
        <el-form-item label="应用名 : ">
          <el-input style="width: 200px" v-model="fetchForm.appName" clearable></el-input>
        </el-form-item>
        <el-form-item label="屏蔽key : ">
          <el-input style="width: 200px" v-model="fetchForm.uid" clearable></el-input>
        </el-form-item>
        <el-form-item label="包名 : ">
          <el-input style="width: 200px" v-model="fetchForm.packageName" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="searchData">搜索</el-button>
       </span>
    </el-dialog>
    <el-card shadow="always">
      <el-table
        height="730"
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="appName"
          label="应用名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="uid"
          label="屏蔽key"
          width="300">
        </el-table-column>
        <el-table-column
          prop="packageName"
          label="应用包名">
        </el-table-column>
        <el-table-column
          prop="channel"
          label="渠道标识">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="showPromoEditDialog(scope.row)" size="mini" v-if="checkPermission(['admin','operatorleader', 'director','operator'])">被推规则</el-button>
            <el-button @click="showPromoListDialog(scope.row)" size="mini" v-if="checkPermission(['admin','operatorleader', 'director','operator'])">推广列表</el-button>
            <el-button @click="showCurrentPromoList(scope.row)" size="mini">当前配置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="def_paging"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="totalPages"
        :current-page="def_currentpage"
        @current-change="pageChange">
      </el-pagination>
      <el-pagination
        v-if="search_paging"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="search_totalPages"
        :current-page="search_currentpage"
        @current-change="search_pageChange">
      </el-pagination>
    </el-card>
    <el-dialog
      title="被推规则"
      :visible.sync="promoEditVisible"
      width="40%">
      <el-form ref="channelPromoEdit" :model="channelPromoEdit" label-position="left" label-width="100px"
               style="margin-left:50px;" status-icon>
        <el-form-item label="推广应用名" :rules="[{ required: true, message: '推广应用名不能为空'}]" prop="promoName"
                      label-width="120px">
          <el-input v-model="channelPromoEdit.promoName" placeholder="必填~" class="dia-input" disabled/>
        </el-form-item>
        <el-form-item label="渠道包名" :rules="[{ required: true, message: '渠道包名不能为空'}]" prop="channelPackage"
                      label-width="120px">
          <el-input v-model="channelPromoEdit.channelPackage" placeholder="必填~" class="dia-input" disabled/>
        </el-form-item>
        <el-form-item label="跳转规则"
                      label-width="120px">
          <el-switch
            :disabled="switchDisabled"
            v-model="switchValue"
            active-text="自定义"
            inactive-text="商店"
          >
          </el-switch>
          <br>
          <el-input v-if="switchValue" v-model="channelPromoEdit.channelRule_custom" placeholder="必填~channelRule_custom"
                    class="dia-input"/>
          <el-input v-if="!switchValue" v-model="channelPromoEdit.channelRule_shop" placeholder="必填~ channelRule_shop"
                    class="dia-input" disabled=""/>

        </el-form-item>
        <el-form-item label="推广包名" :rules="[{ required: true, message: '推广包名不能为空'}]" prop="promoPackageName"
                      label-width="120px">
          <el-input v-model="channelPromoEdit.promoPackageName" placeholder="必填~" class="dia-input" disabled/>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="promoEditVisible = false">{{ '取消'}}</el-button>
        <el-button type="primary" @click="addPromoEdit" v-if="editState==='add'">{{ '添加' }}</el-button>
        <el-button type="primary" @click="editPromoEdit" v-if="editState==='edit'">{{ '修改' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="推广列表"
      :visible.sync="promoListVisible"
      width="90%">
      <el-button @click="addPromo" style="margin-bottom: 15px" type="primary">新增互推</el-button>
      <el-dialog
        width="600px"
        title="互推"
        :visible.sync="innerVisible"
        append-to-body>
        <el-form :model="promo" ref="promo" label-width="100px" class="demo-ruleForm">
          <el-form-item label="推广应用名" label-width="120px" prop="promoName"
                        :rules="[{ required: true, message: '推广应用名不能为空'}]">
            <el-select v-model="promo.promoName" placeholder="必选" style="width: 300px" filterable
                       value-key="uid"
                       @change="promoEditChange">
              <el-option
                v-for="item in channelPromoEditList"
                :key="item.uid"
                :label="item.promoName"
                :value="item">
                <span style="float: left">{{item.promoName}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{item.channel}}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="屏蔽key" :rules="[{ required: true, message: '屏蔽key不能为空'}]" prop="promoEdit"
                        label-width="120px">
            <el-input v-model="promo.promoEdit" placeholder="必填~" class="dia-input" disabled/>
          </el-form-item>
          <el-form-item label="渠道包名" :rules="[{ required: true, message: '渠道包名不能为空'}]" prop="channelPackage"
                        label-width="120px">
            <el-input v-model="promo.channelPackage" placeholder="必填~" class="dia-input" disabled/>
          </el-form-item>
          <el-form-item label="跳转规则" :rules="[{ required: true, message: '跳转规则不能为空'}]" prop="channelRule"
                        label-width="120px">
            <el-input v-model="promo.channelRule" placeholder="必填~" class="dia-input" disabled/>
          </el-form-item>
          <el-form-item label="推广包名" :rules="[{ required: true, message: '推广包名不能为空'}]" prop="promoPackageName"
                        label-width="120px">
            <el-input v-model="promo.promoPackageName" placeholder="必填~" class="dia-input" disabled/>
          </el-form-item>
          <el-form-item label="素材" label-width="120px" :rules="[{ required: true, message: '素材不能为空'}]" prop="fodder">
            <el-select v-model="promo.fodder" placeholder="必选" style="width: 400px" filterable
                       value-key="qiniu_file_guid"
                       @change="fodderChange">
              <el-option
                v-for="item in fodderList"
                :key="item.qiniu_file_guid"
                :label="item.qiniu_file_name"
                :value="item">
                <span style="float: left">{{item.qiniu_file_name}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px"><img :src=item.qiniu_file_path width="50"
                                                                                 height="50"/></span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="推广图片链接" :rules="[{ required: true, message: '推广图片链接不能为空'}]" prop="promoIconUrl"
                        label-width="120px">
            <el-input v-model="promo.promoIconUrl" placeholder="必填~" class="dia-input" disabled/>
          </el-form-item>
          <el-form-item label="推广权值" :rules="[{required: true, message: '推广权值不能为空'}]" prop="promoValue"
                        label-width="120px">
            <el-input v-model.number="promo.promoValue" placeholder="必填~" class="dia-input" type="number"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">{{ '取消'}}</el-button>
          <el-button type="primary" @click="addToEditTable" v-if="editListState==='add'">{{ '确认添加' }}</el-button>
          <el-button type="primary" @click="editToEditTable" v-if="editListState==='edit'">{{ '立即修改' }}</el-button>
        </div>
      </el-dialog>
      <el-table
        height="530"
        border
        :data="EditTable"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="promoName"
          label="推广应用名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="channelPackage"
          label="渠道包名"
          width="200">
        </el-table-column>
        <el-table-column
          prop="channelRule"
          label="跳转规则"
          width="220">
        </el-table-column>
        <el-table-column
          prop="promoPackageName"
          label="推广包名">
        </el-table-column>
        <el-table-column
          width="100"
          label="预览图">
          <template slot-scope="scope">
            <span style="width: 100%"><img
              :src="scope.row.promoIconUrl" min-width="70" height="70"/></span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin'])"
          width="350"
          prop="promoIconUrl"
          label="推广图片链接">
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin'])"
          width="80"
          prop="iconName"
          label="iconName">
        </el-table-column>
        <el-table-column
          width="80"
          prop="promoValue"
          label="推广权值">
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin'])"
          width="80"
          prop="appid"
          label="appid">
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin'])"
          width="80"
          prop="uid"
          label="uid">
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin'])"
          width="80"
          prop="puid"
          label="puid">
        </el-table-column>
        <el-table-column
          v-if="checkPermission(['admin'])"
          width="80"
          prop="id"
          label="id">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, EditTable)"
              type="text"
              size="small">
              移除
            </el-button>
            <el-button
              @click.native.prevent="EditRow(scope.row,scope.$index)"
              type="text"
              size="small">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="promoListVisible = false">{{ '取消'}}</el-button>
        <el-button type="primary" @click="addPromoList" v-if="promoListState==='add'">{{ '发布' }}</el-button>
        <el-button type="primary" @click="editPromoList(false)" v-if="promoListState==='edit'">{{ '发布' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="当前应用配置"
      :visible.sync="currentPromoListVisible"
      width="90%">
      <el-table
        height="530"
        border
        :data="EditTable"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="promoName"
          label="推广应用名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="channelPackage"
          label="渠道包名"
          width="280">
        </el-table-column>
        <el-table-column
          prop="channelRule"
          label="跳转规则"
          width="450">
        </el-table-column>
        <el-table-column
          prop="promoPackageName"
          label="推广包名">
        </el-table-column>
        <el-table-column
          width="100"
          label="预览图">
          <template slot-scope="scope">
            <span style="width: 100%"><img
              :src="scope.row.promoIconUrl" min-width="70" height="70"/></span>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          prop="promoValue"
          label="推广权值">
        </el-table-column>
        <el-table-column
          width="80"
          prop="id"
          label="id">
        </el-table-column>
        <el-table-column
          width="80"
          prop="iconName"
          label="iconName">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {getToken} from '@/utils/auth'
  import {
    getip,
    postip,
    getapplist,
    searchapp,
    getparams,
    addparams,
    editparams,
    applist
  } from '@/api/shieldingsystem/testmode'
  import {
    listFodder,
    addChannelPromoEdit,
    getChannelPromoEdit,
    editChannelPromoEdit,
    getPromoList,
    addPromoList,
    editPromoList,
    addPromoListRecord,
    getRowPromoList,
    delPromoList,
    listQiNiufodder,
    synchroPromoList
  } from '@/api/shieldingsystem/channelPromo'
  import {getPromoChannel} from '@/api/shieldingsystem/promoChannel'
  import checkPermission from '@/utils/permission' // 权限判断函数

  export default {
    name: 'DropzoneDemo',
    data() {
      return {
        switchDisabled: false,
        appchannel: '',
        switchValue: true,
        currentPromoListVisible: false,
        uid: 0,
        id: 0,
        promoListState: 'add',
        promoListIndex: 0,
        editListState: 'add',
        promo: {},
        innerVisible: false,
        editState: "add",
        channelPromoEditList: [],
        respath: 'http://192.168.1.144:8091/file?path=',
        fodderList: [],
        dataForm: {},
        channelPromoEdit: {},
        EditTable: [],
        promoListVisible: false,
        promoEditVisible: false,
        def_currentpage: 1,
        search_currentpage: 1,
        testModeLoading: false,
        search_totalPages: 0,
        def_paging: true,
        search_paging: false,
        searchDialog: false,
        pageSize: 20,
        totalPages: 0,
        fetchForm: {
          appName: '',
          uid: '',
          packageName: ''
        },
        testModeForm: {
          id: 0,
          uid: '',
          appName: '',
          packageName: '',
          channel: '',
          mode: '',
          ad: ''
        },
        tableData: [],
        promoChannelList: [],
        promoChannelListRel: []
      }
    },
    mounted() {
      this.initTable();//初始化应用列表
      //this.initSelect();
      this.initFodder();//初始化素材库
      this.initPromoChannel();//初始化互推渠道列表
      this.initPromoEdit();//初始化推广配置表
      this.initPromoList();//初始化互推渠道列表关联

    },
    methods: {
      initPromoList() {
        let tothis = this
        getPromoList().then(response => {
          if (response.repcode === 3000) {
            console.log('互推渠道列表关联', response.data)
            this.promoChannelListRel = response.data
          } else {
            tothis.$notify({
              title: '提示',
              message: '互推渠道列表关联初始化失败',
              type: 'warning'
            });
          }
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '提示',
            message: '互推渠道列表关联初始化失败',
            type: 'warning'
          });
        })
      },
      initPromoChannel() {
        let tothis = this
        getPromoChannel().then(response => {
          if (response.repcode === 3000) {
            console.log('互推渠道列表', response.data)
            this.promoChannelList = response.data
          } else {
            tothis.$notify({
              title: '提示',
              message: '互推渠道列表初始化失败',
              type: 'warning'
            });
          }
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '提示',
            message: '互推渠道列表初始化失败',
            type: 'warning'
          });
        })
      },//初始化互推渠道列表
      addPromoList() {
        let tothis = this
        let param = {
          table: this.EditTable
        }
        addPromoListRecord(param).then(response => {
          let uploadflag1 = true
          if (response.repcode === 3000) {
            uploadflag1 = false;
            console.log('发布记录id', response.data)
            let idlist = response.data
            let newtable = []
            for (let i = 0; i < this.EditTable.length; i++) {
              let row = {
                iconName:this.EditTable[i].iconName,
                promoName: this.EditTable[i].promoName,
                channelPackage: this.EditTable[i].channelPackage,
                channelRule: this.EditTable[i].channelRule,
                promoPackageName: this.EditTable[i].promoPackageName,
                promoIconUrl: this.EditTable[i].promoIconUrl,
                promoValue: this.EditTable[i].promoValue,
                id: idlist[idlist.length - 1 - i].id.toString()
              }
              newtable.push(row)
            }
            let addparamsdata = {
              appId: this.uid,
              system: 'channelPromo',
              status: newtable
            }
            console.log('提交的推广列表', addparamsdata)

            addparams(addparamsdata).then(response => {
              let flag = true
              if (response.repcode === 3000) {
                let json = JSON.parse(response.data)
                if (json.code === 200) {
                  tothis.$notify({
                    title: '提示',
                    message: '添加推广列表成功',
                    type: 'success'
                  });
                  this.promoListVisible = false
                  flag = false
                }
              }
              if (flag) {
                tothis.$notify({
                  title: '提示',
                  message: '添加推广列表失败！',
                  type: 'warning'
                });
              }
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '提示',
                message: '添加推广列表失败！',
                type: 'warning'
              });
            });


          }
          if (uploadflag1) {
            tothis.$notify({
              title: '提示',
              message: '添加到互推发布记录失败',
              type: 'warning'
            });
          }
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '提示',
            message: '添加到互推发布记录失败',
            type: 'warning'
          });
        })
      },//添加推广列表到应用
      editPromoList(promoListVisibleFlag) {
        let tothis = this
        let param = {
          table: this.EditTable
        }
        addPromoListRecord(param).then(response => {
          let uploadflag1 = true
          if (response.repcode === 3000) {
            uploadflag1 = false;
            console.log('发布记录id', response.data)
            let idlist = response.data
            let newtable = []
            for (let i = 0; i < this.EditTable.length; i++) {
              let row = {
                iconName:this.EditTable[i].iconName,
                promoName: this.EditTable[i].promoName,
                channelPackage: this.EditTable[i].channelPackage,
                channelRule: this.EditTable[i].channelRule,
                promoPackageName: this.EditTable[i].promoPackageName,
                promoIconUrl: this.EditTable[i].promoIconUrl,
                promoValue: this.EditTable[i].promoValue,
                id: idlist[idlist.length - 1 - i].id.toString()
              }
              newtable.push(row)
            }
            let addparamsdata = {
              appId: this.id,
              system: 'channelPromo',
              status: newtable
            }
            console.log('提交的推广列表', addparamsdata)
            editparams(addparamsdata).then(response => {
              let flag = true
              if (response.repcode === 3000) {
                let json = JSON.parse(response.data)
                if (json.code === 200) {
                  tothis.$notify({
                    title: '提示',
                    message: '编辑推广列表成功',
                    type: 'success'
                  });
                  if (!promoListVisibleFlag) {
                    this.promoListVisible = false
                  }
                  flag = false
                }
              }
              if (flag) {
                tothis.$notify({
                  title: '提示',
                  message: '编辑推广列表失败！',
                  type: 'warning'
                });
              }
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '提示',
                message: '编辑推广列表失败！',
                type: 'warning'
              });
            });


          }
          if (uploadflag1) {
            tothis.$notify({
              title: '提示',
              message: '添加到互推发布记录失败',
              type: 'warning'
            });
          }
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '提示',
            message: '添加到互推发布记录失败',
            type: 'warning'
          });
        })


      },//编辑推广列表到应用
      EditRow(row, index) {
        console.log(row)
        this.promo = {}
        this.$nextTick(() => {
          this.$refs['promo'].clearValidate()
        })
        this.promoListIndex = index
        this.promo.id = row.id
        for (let i = 0; i < this.channelPromoEditList.length; i++) {
          if (this.channelPromoEditList[i].uid === row.uid) {
            //this.promo.promoName = this.channelPromoEditList[i]
            this.$set(this.promo, 'promoName', this.channelPromoEditList[i]);
            break
          }
        }
        for (let i = 0; i < this.fodderList.length; i++) {
          if (this.fodderList[i].qiniu_file_guid === row.puid) {
            this.promo.fodder = this.fodderList[i]
            break
          }
        }
        //this.promo.promoEdit  uid
        //this.promo.fodder     puid

        // this.promo.channelPackage = row.channelPackage
        // this.promo.channelRule = row.channelRule
        // this.promo.promoIconUrl = row.promoIconUrl
        // this.promo.promoEdit = row.uid
        // this.promo.promoPackageName = row.promoPackageName
        // this.promo.promoValue = row.promoValue.toString()


        this.$set(this.promo, 'channelPackage', row.channelPackage === '' ? '暂无' : row.channelPackage);
        this.$set(this.promo, 'channelRule', row.channelRule);
        this.$set(this.promo, 'promoIconUrl', row.promoIconUrl);
        this.$set(this.promo, 'promoEdit', row.uid);
        this.$set(this.promo, 'promoPackageName', row.promoPackageName);
        this.$set(this.promo, 'promoValue', row.promoValue.toString());

        console.log(this.promo)
        this.editListState = 'edit'
        this.innerVisible = true
      },//编辑推广列表一行  按钮事件
      addToEditTable() {
        this.$refs['promo'].validate((valid) => {
          if (valid) {
            let flag = true
            console.log('添加到推广列表配置', this.promo.promoEdit.uid)
            console.log('添加到推广列表图片', this.promo.fodder.qiniu_file_path)
            if (flag) {
              let onePromo = {
                appid: this.uid,
                uid: this.promo.promoEdit,
                puid: this.promo.fodder.qiniu_file_guid,
                iconName:this.promo.fodder.qiniu_file_name,
                channelPackage: this.promo.channelPackage === '暂无' ? '' : this.promo.channelPackage,
                channelRule: this.promo.channelRule,
                promoIconUrl: this.promo.promoIconUrl,
                promoName: this.promo.promoName.promoName,
                promoPackageName: this.promo.promoPackageName,
                promoValue: this.promo.promoValue.toString()
              }
              let param = {
                appid: this.uid,
                uid: this.promo.promoEdit,
                puid: this.promo.fodder.qiniu_file_guid,
                promoValue: this.promo.promoValue.toString()
              }
              //上传推广列表关联
              addPromoList(param).then(response => {
                let flagup = true
                if (response.repcode === 3000) {
                  onePromo.id = response.data.id
                  this.EditTable.push(onePromo)
                  this.innerVisible = false
                  flagup = false
                }
                if (flagup) {
                  this.$message({
                    message: '添加推广列表关联失败！',
                    type: 'warning'
                  });
                }
              }).catch(error => {
                console.error(error)
                this.$message({
                  message: '添加推广列表关联失败！',
                  type: 'warning'
                });
              });
            } else {
              this.$message({
                message: '请勿重复添加！',
                type: 'warning'
              });
            }
          } else {
            return false
          }
        })
      },//添加到推广列表  行
      editToEditTable() {
        this.$refs['promo'].validate((valid) => {
          if (valid) {
            let param = {
              appid: this.uid,
              uid: this.promo.promoEdit,
              puid: this.promo.fodder.qiniu_file_guid,
              id: this.promo.id,
              promoValue: this.promo.promoValue.toString()
            }

            //上传推广列表关联
            editPromoList(param).then(response => {
              let flagup = true
              if (response.repcode === 3000) {
                //保存本地服务器的参数
                this.$set(this.EditTable[this.promoListIndex], 'uid', this.promo.promoEdit);
                this.$set(this.EditTable[this.promoListIndex], 'puid', this.promo.fodder.qiniu_file_guid);
                this.$set(this.EditTable[this.promoListIndex], 'promoValue', this.promo.promoValue);
                //展示参数
                this.$set(this.EditTable[this.promoListIndex], 'iconName', this.promo.fodder.qiniu_file_name);
                this.$set(this.EditTable[this.promoListIndex], 'channelPackage', this.promo.channelPackage === '暂无' ? '' : this.promo.channelPackage);
                this.$set(this.EditTable[this.promoListIndex], 'channelRule', this.promo.channelRule);
                this.$set(this.EditTable[this.promoListIndex], 'promoIconUrl', this.promo.promoIconUrl);
                this.$set(this.EditTable[this.promoListIndex], 'promoName', this.promo.promoName.promoName);
                this.$set(this.EditTable[this.promoListIndex], 'promoPackageName', this.promo.promoPackageName);
                this.innerVisible = false
                flagup = false
              }
              if (flagup) {
                this.$message({
                  message: '添加推广列表关联失败！',
                  type: 'warning'
                });
              }
            }).catch(error => {
              console.error(error)
              this.$message({
                message: '添加推广列表关联失败！',
                type: 'warning'
              });
            });


            // //保存本地服务器的参数
            // this.$set(this.EditTable[this.promoListIndex], 'uid', this.promo.promoEdit.uid);
            // this.$set(this.EditTable[this.promoListIndex], 'id', this.promo.fodder.qiniu_file_path);
            // this.$set(this.EditTable[this.promoListIndex], 'promoValue', this.promo.promoValue);
            // //展示参数
            // this.$set(this.EditTable[this.promoListIndex], 'channelPackage', this.promo.channelPackage === '暂无' ? '' : this.promo.channelPackage);
            // this.$set(this.EditTable[this.promoListIndex], 'channelRule', this.promo.channelRule);
            // this.$set(this.EditTable[this.promoListIndex], 'promoIconUrl', this.promo.promoIconUrl);
            // this.$set(this.EditTable[this.promoListIndex], 'promoName', this.promo.promoName);
            // this.$set(this.EditTable[this.promoListIndex], 'promoPackageName', this.promo.promoPackageName);
            // this.innerVisible = false
          } else {
            return false
          }
        })
      },//修改到推广列表   行
      addPromo() {
        this.promo = {}
        this.$nextTick(() => {
          this.$refs['promo'].clearValidate()
        })
        this.$set(this.promo, 'promoValue', 1)
        this.editListState = 'add'
        this.innerVisible = true
      },//添加互推
      initPromoEdit() {
        getChannelPromoEdit().then(response => {
          if (response.repcode == 3000) {
            console.log(response.data)
            this.channelPromoEditList = response.data
            console.log('推广配置表', this.channelPromoEditList)
          } else {
            console.error(res.data)
            this.$message({
              message: '获取互推配置表失败！',
              type: 'warning'
            });
          }
        }).catch(error => {
          console.error(error)
          this.$message({
            message: '获取互推配置表失败！',
            type: 'warning'
          });
        })
      },//初始化推广配置表
      addPromoEdit() {
        this.$refs['channelPromoEdit'].validate((valid) => {
          if (valid) {
            let addparam = {}
            if (this.switchValue) {
              if (typeof (this.channelPromoEdit.channelRule_custom) === 'undefined' || this.channelPromoEdit.channelRule_custom.length === 0) {
                this.$message({
                  message: '自定义跳转规则不能为空！',
                  type: 'warning'
                });
                return
              }
              addparam = {
                channel: this.channelPromoEdit.channel,
                channelPackage: this.channelPromoEdit.channelPackage,
                promoPackageName: this.channelPromoEdit.promoPackageName,
                promoName: this.channelPromoEdit.promoName,
                channelRule: this.channelPromoEdit.channelRule_custom,
                uid: this.channelPromoEdit.uid,
              }
            } else {
              addparam = {
                channel: this.channelPromoEdit.channel,
                channelPackage: this.channelPromoEdit.channelPackage,
                promoPackageName: this.channelPromoEdit.promoPackageName,
                promoName: this.channelPromoEdit.promoName,
                channelRule: this.channelPromoEdit.channelRule_shop,
                uid: this.channelPromoEdit.uid,
              }
            }
            console.log(addparam)
            addChannelPromoEdit(addparam).then(response => {
              if (response.repcode == 3000) {
                this.$message({
                  message: '添加互推配置成功！',
                  type: 'success'
                });
                this.promoEditVisible = false
                this.initPromoEdit();//初始化推广配置表
              } else {
                console.error(res.data)
                this.$message({
                  message: '添加互推配置失败！',
                  type: 'warning'
                });
              }
            }).catch(error => {
              console.error(error)
              this.$message({
                message: '添加互推配置失败！',
                type: 'warning'
              });
            })
          } else {
            return false;
          }
        });
      },//添加互推配置
      editPromoEdit() {
        this.$refs['channelPromoEdit'].validate((valid) => {
          if (valid) {
            let editparam = {}

            if (this.switchValue) {
              if (typeof (this.channelPromoEdit.channelRule_custom) === 'undefined' || this.channelPromoEdit.channelRule_custom.length === 0) {
                this.$message({
                  message: '自定义跳转规则不能为空！',
                  type: 'warning'
                });
                return
              }
              editparam = {
                channel: this.channelPromoEdit.channel,
                channelPackage: this.channelPromoEdit.channelPackage,
                promoPackageName: this.channelPromoEdit.promoPackageName,
                promoName: this.channelPromoEdit.promoName,
                channelRule: this.channelPromoEdit.channelRule_custom,
                uid: this.channelPromoEdit.uid,
              }
            } else {
              editparam = {

                channel: this.channelPromoEdit.channel,
                channelPackage: this.channelPromoEdit.channelPackage,
                promoPackageName: this.channelPromoEdit.promoPackageName,
                promoName: this.channelPromoEdit.promoName,
                channelRule: this.channelPromoEdit.channelRule_shop,
                uid: this.channelPromoEdit.uid,
              }
            }
            console.log(editparam)
            editChannelPromoEdit(editparam).then(response => {
              if (response.repcode == 3000) {
                this.$message({
                  message: '修改互推配置成功！',
                  type: 'success'
                });
                this.promoEditVisible = false
                this.initPromoEdit();//初始化推广配置表
              } else {
                console.error(res.data)
                this.$message({
                  message: '修改互推配置失败！',
                  type: 'warning'
                });
              }
            }).catch(error => {
              console.error(error)
              this.$message({
                message: '修改互推配置失败！',
                type: 'warning'
              });
            })
          } else {
            return false;
          }
        });
      },//编辑互推配置
      deleteRow(index, rows) {
        this.$confirm('确认删除？')
          .then(_ => {
            let param = {
              id: rows[index].id
            }
            delPromoList(param).then(response => {
              if (response.repcode = 3000) {
                rows.splice(index, 1);
              } else {
                this.$message({
                  message: '移除互推列表失败！',
                  type: 'warning'
                });
              }
            }).catch(error => {
              console.error(error)
              this.$message({
                message: '移除互推列表失败！',
                type: 'warning'
              });
            })
          })
          .catch(_ => {
            return false
          });


      },//移除互推列表
      fodderChange(value) {
        console.log('选择器素材change', value)
        //this.promo.promoIconUrl = value.path1

        this.$set(this.promo, 'promoIconUrl', value.qiniu_file_path);
      },//素材选择器change
      promoEditChange(value) {
        console.log('选择器推广配置change', value)
        this.$set(this.promo, 'promoEdit', value.uid);

        this.$set(this.promo, 'channelPackage', value.channelPackage === '' ? '暂无' : value.channelPackage);
        this.$set(this.promo, 'channelRule', value.channelRule);
        this.$set(this.promo, 'promoPackageName', value.promoPackageName);
        console.log(this.promo)
        // this.promo.channelPackage = value.channelPackage
        // this.promo.channelRule = value.channelRule
        // this.promo.promoName = value.promoName
        // this.promo.promoPackageName = value.promoPackageName
      },//推广配置选择器change
      showPromoEditDialog(param) {
        this.appchannel = param.channel
        this.channelPromoEdit = {}
        this.$nextTick(() => {
          this.$refs['channelPromoEdit'].clearValidate()
        })
        console.log('推广配置按钮', param)
        let flag = true
        let index = 0
        for (let i = 0; i < this.channelPromoEditList.length; i++) {
          if (this.channelPromoEditList[i].uid === param.uid) {
            flag = false
            index = i
            break
          }
        }
        this.switchDisabled = false
        if (flag) {
          this.channelPromoEdit = {}
          this.editState = "add"
          this.switchValue = true
          this.channelPromoEdit.channelRule = 'market://details?id={0}'
          this.channelPromoEdit.uid = param.uid
          this.channelPromoEdit.channel = param.channel
          this.channelPromoEdit.promoName = param.appName
          this.channelPromoEdit.promoPackageName = param.packageName
          let flag = true
          for (let i = 0; i < this.promoChannelList.length; i++) {
            if (this.promoChannelList[i].promoChannelMark === param.channel) {
              this.channelPromoEdit.channelPackage = this.promoChannelList[i].promoChannelPackage
              this.$set(this.channelPromoEdit, 'channelRule_shop', this.promoChannelList[i].channelRule)
              flag = false
              break;
            }
          }
          if (flag) {
            this.switchDisabled = true
            this.$set(this.channelPromoEdit, 'channelRule_shop', 'market://details?id={0}')
            this.channelPromoEdit.channelPackage = '暂无'
          }

        } else {
          this.editState = "edit"
          this.switchValue = true
          this.channelPromoEdit.uid = this.channelPromoEditList[index].uid
          this.channelPromoEdit.channel = this.channelPromoEditList[index].channel
          this.channelPromoEdit.promoName = this.channelPromoEditList[index].promoName
          this.channelPromoEdit.promoPackageName = this.channelPromoEditList[index].promoPackageName
          this.channelPromoEdit.channelRule = this.channelPromoEditList[index].channelRule
          if (this.channelPromoEditList[index].channelPackage === '暂无') {
            let flag = true
            for (let i = 0; i < this.promoChannelList.length; i++) {
              if (this.promoChannelList[i].promoChannelMark === param.channel) {
                this.channelPromoEdit.channelPackage = this.promoChannelList[i].promoChannelPackage
                flag = false
                break;
              }
            }
            if (flag) {
              this.switchDisabled = true
              this.channelPromoEdit.channelPackage = '暂无'
            }
          } else {
            let edit_stitch_flag = true
            for (let i = 0; i < this.promoChannelList.length; i++) {
              if (this.promoChannelList[i].promoChannelMark === param.channel) {
                edit_stitch_flag = false
              }
            }
            if (edit_stitch_flag) {
              this.switchDisabled = true
            }
            this.channelPromoEdit.channelPackage = this.channelPromoEditList[index].channelPackage
          }
          //跳转规则
          let flag = true
          for (let i = 0; i < this.promoChannelList.length; i++) {
            if (this.promoChannelList[i].promoChannelMark === param.channel) {
              this.$set(this.channelPromoEdit, 'channelRule_shop', this.promoChannelList[i].channelRule)
              flag = false
              break;
            }
          }
          if (flag) {
            this.$set(this.channelPromoEdit, 'channelRule_shop', 'market://details?id={0}')
          }
          this.switchValue = true
          this.$set(this.channelPromoEdit, 'channelRule_custom', this.channelPromoEditList[index].channelRule)

        }
        this.promoEditVisible = true

      },//推广配置按钮
      getRowPromoListMeth(param, flag) {
        getRowPromoList(param).then(res => {
          if (res.repcode == 3000) {
            this.EditTable = res.data
            if (flag) {
              this.editPromoList(true)
            }
          } else {
            console.error(res.data)
            this.$message({
              message: '获取应用参数id失败！',
              type: 'warning'
            });
          }
        }).catch(error => {
          console.error(error)
          this.$message({
            message: '获取应用参数id失败！',
            type: 'warning'
          });
        });
      },//获取一个应用的本地推广列表
      showPromoListDialog(param) {
        let tothis = this
        this.uid = param.uid
        this.EditTable = []
        let getparamsdata = {
          appId: param.uid
        }
        console.log(this.promoChannelListRel)
        getparams(getparamsdata).then(res => {
          if (res.repcode == 3000) {
            let json = JSON.parse(res.data)
            console.log(json)
            let editstateflag = true
            let synchroflag = false
            let synchroData = '';
            for (let i = 0; i < json.rows.length; i++) {
              if (json.rows[i].system === 'channelPromo') {
                let channelpromo = JSON.parse(json.rows[i].status)
                console.log('推广列表点击事件(外网)', json.rows[i])
                console.log('rowid', json.rows[i].id)
                this.id = json.rows[i].id
                if (json.rows[i].status === '[]') {
                  editstateflag = false
                  this.promoListState = 'edit'
                  break
                } else {
                  if (typeof (JSON.parse(json.rows[i].status)[0].id) === 'undefined') {
                    console.log('需要同步')
                    synchroflag = true
                    synchroData = json.rows[i].status
                  }
                  editstateflag = false
                  this.promoListState = 'edit'
                  break
                }
              }
            }
            if (editstateflag) {
              this.promoListState = 'add'
            }
            //table赋值-本地
            if (synchroflag) {
              let data = JSON.parse(synchroData);
              console.log('需要同步的数据', data);
              let synchroParam = {
                list: data,
                appid: this.uid
              }
              tothis.$notify({
                title: '提示',
                type: 'warning',
                message: '正在同步渠道数据-----',
              });
              synchroPromoList(synchroParam).then(response => {
                if (response.repcode === 3000) {
                  //重新获取
                  tothis.$notify({
                    title: '提示',
                    type: 'success',
                    message: '同步渠道数据成功-----',
                  });
                  this.getRowPromoListMeth(getparamsdata, true)
                  this.promoListVisible = true
                } else {
                  this.$message({
                    message: '同步渠道列表失败！',
                    type: 'warning'
                  });
                }
              }).catch(error => {
                console.error('同步渠道列表失败', error)
                this.$message({
                  message: '同步渠道列表失败！',
                  type: 'warning'
                });
              })
            } else {
              //不需要同步则直接查询
              this.getRowPromoListMeth(getparamsdata)
              this.promoListVisible = true
            }

          } else {
            console.error(res.data)
            this.$message({
              message: '获取应用参数id失败！',
              type: 'warning'
            });
          }
        }).catch(error => {
          console.error(error)
          this.$message({
            message: '获取应用参数id失败！',
            type: 'warning'
          });
        });
      },//推广列表按钮
      // showPromoListDialog(param) {
      //   this.uid = param.uid
      //   this.EditTable = []
      //   let getparamsdata = {
      //     appId: param.uid
      //   }
      //   console.log(this.promoChannelListRel)
      //   getparams(getparamsdata).then(res => {
      //     if (res.repcode == 3000) {
      //       let json = JSON.parse(res.data)
      //       console.log(json)
      //       let flag = true
      //       for (let i = 0; i < json.rows.length; i++) {
      //         if (json.rows[i].system === 'channelPromo') {
      //           let channelpromo = JSON.parse(json.rows[i].status)
      //           console.log('推广列表点击事件(外网)', json.rows[i])
      //           console.log('rowid', json.rows[i].id)
      //           this.id = json.rows[i].id
      //           //table赋值
      //           //this.EditTable = channelpromo
      //           flag = false
      //           this.promoListState = 'edit'
      //           break
      //         }
      //       }
      //       if (flag) {
      //         this.promoListState = 'add'
      //       }
      //       //table赋值-本地
      //       this.getRowPromoListMeth(getparamsdata)
      //       this.promoListVisible = true
      //     } else {
      //       console.error(res.data)
      //       this.$message({
      //         message: '获取应用参数id失败！',
      //         type: 'warning'
      //       });
      //     }
      //   }).catch(error => {
      //     console.error(error)
      //     this.$message({
      //       message: '获取应用参数id失败！',
      //       type: 'warning'
      //     });
      //   });
      //   this.promoListVisible = true
      // },//推广列表按钮
      showCurrentPromoList(param) {
        this.EditTable = []
        let getparamsdata = {
          appId: param.uid
        }
        getparams(getparamsdata).then(res => {
          if (res.repcode == 3000) {
            let json = JSON.parse(res.data)
            console.log(json)
            for (let i = 0; i < json.rows.length; i++) {
              if (json.rows[i].system === 'channelPromo') {
                let channelpromo = JSON.parse(json.rows[i].status)
                console.log('当前配置', json.rows[i])
                console.log('rowid', json.rows[i].id)
                this.id = json.rows[i].id
                this.EditTable = channelpromo
                break
              }
            }
            this.currentPromoListVisible = true
          } else {
            console.error(res.data)
            this.$message({
              message: '获取应用参数失败！',
              type: 'warning'
            });
          }
        }).catch(error => {
          console.error(error)
          this.$message({
            message: '获取应用参数失败！',
            type: 'warning'
          });
        });
      },//查看当前推广配置
      initFodder() {
        listQiNiufodder().then(response => {
          if (response.repcode == 3000) {
            this.fodderList = response.data
          } else {
            this.$message.error('表格初始化失败！');
          }
        }).catch(err => {
          console.error(err)
        })
      },//初始化素材库
      initSelect() {
        applist().then(res => {
          let json = JSON.parse(res.data)
          console.log(json)

        }).catch(err => {
          this.$message({
            message: '初始化表格失败！',
            type: 'warning'
          });
        })
      },//选择器初始化
      searchAppList(page) {
        let param = {
          appName: this.fetchForm.appName,
          appId: this.fetchForm.uid,
          appPackageName: this.fetchForm.packageName,
          page: page,
          limit: this.pageSize
        }
        searchapp(param).then(res => {
          let json = JSON.parse(res.data)
          this.tableData = json.rows
          this.search_totalPages = json.total
        }).catch(err => {
          this.$message({
            message: '搜索失败！',
            type: 'warning'
          });
        })
      },//搜索应用列表
      search_pageChange(page) {
        this.def_currentpage = page
        this.searchAppList(page)
      },//搜索事件分页
      searchData() {
        this.def_currentpage = 1
        this.searchAppList(1)
        this.def_paging = false
        this.search_paging = true
        this.searchDialog = false
      },//搜索应用事件
      pageChange(page) {
        this.def_currentpage = page
        this.listapplist(page)
      },//分页改变事件
      initTable() {
        this.def_currentpage = 1
        this.listapplist(1)
      },//初始化应用列表
      listapplist(page) {
        let param = {
          page: page,
          limit: this.pageSize
        }
        getapplist(param).then(res => {
          let json = JSON.parse(res.data)
          console.log('表格初始化', json.rows)
          this.tableData = json.rows
          this.totalPages = json.total
        }).catch(err => {
          this.$message({
            message: '初始化表格失败！',
            type: 'warning'
          });
        })
      },//获取应用列表 默认
      flushList() {
        if (this.def_paging) {
          //默认搜索列表
          this.pageChange(this.def_currentpage)
          //this.initTable()
        } else {
          //搜索应用列表
          //this.searchData()
          this.search_pageChange(this.def_currentpage)
        }
      },//刷新列表
      checkPermission,
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dia-input {
    width: 300px;
  }

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


