<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit"
                 v-if="checkPermission(['director','operatorleader','admin'])"
                 @click="handleCreate">{{addButton}}
      </el-button>
      <el-input placeholder="根据项目名查找" v-model="inputName" style="width: 200px;margin-left: 20px" class="filter-item"
                clearable/>
      <el-button @click="searchTable">搜索</el-button>
    </div>
    <el-table
      height="740"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :expand-row-keys="expands"
      :row-key='getRowKeys'
      fit
      stripe
      border
      @expand-change="expandrowhandler"
      highlight-current-row>
      <el-table-column type="expand" label="展开" width="100px">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="项目名:">
              <span>{{ props.row.project_name }}</span>
            </el-form-item>
            <el-form-item label="备注:">
              <span>{{ props.row.note }}</span>
            </el-form-item>
            <div style="padding-top: 15px">
              <el-table
                stripe
                border
                :data="props.row.applist"
                style="width: 100%;margin-bottom: 30px">
                <el-table-column
                  prop="package_name"
                  label="包名">
                </el-table-column>
                <el-table-column
                  prop="channel"
                  label="渠道"
                  style="width: 15%">
                </el-table-column>
                <el-table-column
                  label="文件"
                  width="150">
                  <template slot-scope="scope3">
                    <span>
                      <el-button type="warning" @click="showFileListVisible(scope3.row)">查看上传文件</el-button>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="链接"
                  width="350">
                  <template slot-scope="scope2">
                    <span>
                      <el-button @click="link_Check(scope2.row)" type="info">查看配置表发布记录</el-button>
                    </span>
                    <span v-if="checkPermission(['director','operatorleader','admin'])">
                    <el-button @click="link_Edit(scope2.row)" type="success">编辑配置表</el-button>
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" align="center" width="60">
        <template slot-scope="scope1">
          {{ ++scope1.$index }}
        </template>
      </el-table-column>
      <el-table-column label="项目名" prop="project_name">
      </el-table-column>
      <el-table-column label="备注" prop="note">
      </el-table-column>
      <el-table-column label="操作" align="center" width="280px" class-name="small-padding fixed-width"
                       v-if="checkPermission(['director','admin','operatorleader'])">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="updateHandler(scope.row)"
                     v-if="checkPermission(['director','admin','operatorleader'])">{{ "编辑" }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)"
                     v-if="checkPermission(['director','admin'])">{{ "删除" }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="totalPages"
      :current-page="currentPage"
      @current-change="pageChange">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="50%" :close-on-click-modal=false>
      <el-form ref="dataForm" :model="project" label-position="left" label-width="90px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="项目名" :rules="{required: true, message: '项目名不能为空', trigger: 'blur'}"
                      v-if="dialogStatus==='update'"
                      prop="project_name">
          <el-input v-model="project.project_name" placeholder="请输入项目名~" disabled/>
        </el-form-item>
        <el-form-item label="项目名" :rules="{required: true, message: '项目名不能为空', trigger: 'blur'}"
                      v-if="dialogStatus==='create'"
                      prop="project_name">
          <el-input v-model="project.project_name" placeholder="请输入项目名~"/>
        </el-form-item>
        <el-form-item label="预热" :rules="{required: true, message: '预热名不能为空', trigger: 'blur'}" prop="preheat"
                      v-if="false">
          <el-input v-model="project.preheat"/>
        </el-form-item>
        <el-form-item label="排期" :rules="{required: true, message: '排期名不能为空', trigger: 'blur'}" prop="schedule"
                      v-if="false">
          <el-input v-model="project.schedule"/>
        </el-form-item>
        <el-form-item label="竞品" :rules="{required: true, message: '竞品不能为空', trigger: 'blur'}" prop="compete_good"
                      v-if="false">
          <el-input v-model="project.compete_good"/>
        </el-form-item>
        <el-form-item label="版本计划" :rules="{required: true, message: '版本计划不能为空', trigger: 'blur'}" prop="version_plan"
                      v-if="false">
          <el-input v-model="project.version_plan"/>
        </el-form-item>
        <el-form-item label="备注" :rules="{required: true, message: '备注不能为空', trigger: 'blur'}" prop="note">
          <el-input v-model="project.note"/>
        </el-form-item>
        <el-button @click="innerVisible = true" type="primary">添加应用</el-button>
        <el-dialog
          style="margin-top: 100px"
          width="40%"
          title="添加应用"
          :visible.sync="innerVisible"
          append-to-body>
          <div style="width: 800px;font-weight: bold">
            <div style="margin-bottom: 20px">
              从已有配置表中添加：
              <el-select v-model="project_value" placeholder="请选择配置表" style="width: 450px" filterable value-key="name">
                <el-option
                  v-for="item in project_list"
                  :key="item.key"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </div>
            <span>
              <el-dialog
                style="margin-top: 100px"
                width="40%"
                title="添加配置"
                :visible.sync="innerestVisible"
                append-to-body>
                      <el-form :model="dialogForm" ref="dynamicValidateForm" label-width="100px"
                               class="demo-dynamic">
                        <el-form-item
                          prop="package_name"
                          label="包名"
                          :rules="[{required: true, message: '请输入包名', trigger: 'blur' }]">
                        <el-input v-model="dialogForm.package_name" style="width:400px"></el-input>
                      </el-form-item>
                       <el-form-item
                         prop="channel_mark"
                         label="渠道"
                         :rules="[{required: true, message: '请输入渠道', trigger: 'blur' }]">
                        <!--<el-input v-model="dialogForm.channel_mark" style="width:200px"></el-input>-->
                          <el-select v-model="dialogForm.channel_mark" placeholder="请选择" style="width:200px" filterable>
                            <el-option
                              v-for="item in channel_list"
                              :key="item.id"
                              :label="item.program_mark"
                              :value="item.program_mark">
                            </el-option>
                          </el-select>
                      </el-form-item>


                        <el-form-item
                          prop="keystoreguid"
                          label="公司名称"
                          :rules="[{required: true, message: '请输入公司名称', trigger: 'blur' }]">
                          <el-select v-model="dialogForm.keystoreguid" placeholder="请选择" style="width:200px" filterable>
                            <el-option
                              v-for="item in companyList"
                              :key="item.keystoreguid"
                              :label="item.companyName"
                              :value="item.keystoreguid">
                            </el-option>
                          </el-select>
                      </el-form-item>

                 </el-form>
               <div slot="footer" class="dialog-footer">
                 <el-button @click="innerestVisible = false">{{ '取消'}}</el-button>
                 <el-button type="primary" @click="addconfigList">{{ '确认1' }}</el-button>
               </div>
              </el-dialog>
            <el-button @click="addconfig"> 未发现关联配置表？&nbsp&nbsp&nbsp点击前往添加配置表</el-button>
            </span>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerVisible = false">{{ '取消'}}</el-button>
            <el-button type="primary" @click="addDomain">{{ '确认2' }}</el-button>
          </div>
        </el-dialog>
        <el-form-item
          style="margin-top: 15px;width: 400px"
          v-for="(domain, index) in project.applist"
          :key="domain.key">
          <div style="width: 1300px;margin-left: -100px">
            <span style="font-weight: bolder">渠道：</span>
            <el-input v-model="domain.channel" placeholder="请填写" style="width: 200px" disabled/>
            <span style="font-weight: bolder">包名：</span>
            <el-input v-model="domain.package_name" placeholder="请填写" style="width: 400px" disabled/>
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closedialog()">{{ '取消'}}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()"
                   v-loading.fullscreen.lock="fullscreenLoading">{{ '确认3' }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="文件列表"
      :visible.sync="fileListVisible"
      width="80%">
      <el-upload
        class="upload-demo"
        drag
        :accept="acceptType"
        :action="uploadPath"
        :on-success="uploadSuccessMeth"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-table
        :data="hidfileListTableData"
        border
        height="500"
        style="width: 100%;margin-top: 20px">
        <el-table-column
          width="90px"
          label="预览">
          <template slot-scope="scope">
            <span @click="bigPicture(scope.row.iconPath)" style="width: 100%"><img
              :src="scope.row.iconPath" min-width="70" height="70"/></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="filename"
          label="文件名">
        </el-table-column>
        <el-table-column
          prop="date"
          label="时间"
          width="250">
        </el-table-column>
        <el-table-column
          width="90px"
          prop="versionCode"
          label="内版本号">
        </el-table-column>
        <el-table-column
          width="90px"
          prop="versionName"
          label="外版本号">
        </el-table-column>
        <el-table-column
          vprop="checkFlag"
          width="90px"
          label="APK检查">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="APK信息验证通过" placement="top">
              <el-button type="success" v-if="scope.row.checkFlag" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="APK信息验证未通过，点击查看详细信息" placement="top">
              <el-button type="danger" v-if="!scope.row.checkFlag" circle
                         @click="showapkCheckInfo(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-dialog
          append-to-body
          title="APK验证信息"
          :visible.sync="apkCheckVisible">
          <h2 v-if="apkcheckForm.flag">未找到对应配置表！</h2>
          <span class="detail_span"><a
            class="detail_title">配置表应用名:</a>&nbsp&nbsp&nbsp{{apkcheckForm.publishAPPName}}</span><br><br>
          <span class="detail_span"><a class="detail_title">配置表包名:</a>&nbsp&nbsp&nbsp{{apkcheckForm.publishPackageName}}</span><br><br>
          <span class="detail_span"><a class="detail_title">配置表内版本号:</a>&nbsp&nbsp&nbsp{{apkcheckForm.publishVersionCode}}</span><br><br>
          <span class="detail_span"><a class="detail_title">配置表外版本号:</a>&nbsp&nbsp&nbsp{{apkcheckForm.publishVersionName}}</span><br><br>
          <br><br><br><br>
          <span class="detail_span"><a class="detail_title">apk应用名:</a>&nbsp&nbsp&nbsp{{apkcheckForm.apkAPPName}}</span><br><br>
          <span class="detail_span"><a
            class="detail_title">apk包名:</a>&nbsp&nbsp&nbsp{{apkcheckForm.apkPackageName}}</span><br><br>
          <span class="detail_span"><a
            class="detail_title">apk内版本号:</a>&nbsp&nbsp&nbsp{{apkcheckForm.apkVersionCode}}</span><br><br>
          <span class="detail_span"><a
            class="detail_title">apk外版本号:</a>&nbsp&nbsp&nbsp{{apkcheckForm.apkVersionName}}</span><br><br>
        </el-dialog>

        <!--<el-table-column label="线上包" align="center" class-name="small-padding fixed-width" width="80">-->
        <!--<template slot-scope="scope">-->
        <!--<el-tooltip content="设为上线包" placement="top">-->
        <!--<el-switch-->
        <!--@change="setOnlinePackage(scope.row)"-->
        <!--v-model="scope.row.online"-->
        <!--active-color="#13ce66"-->
        <!--inactive-color="#ff4949"-->
        <!--active-value='1'-->
        <!--inactive-value='0'>-->
        <!--</el-switch>-->
        <!--</el-tooltip>-->
        <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="checkAPKDetail(scope.row)">{{ "查看详细信息" }}</el-button>
            <el-button type="success" size="mini" @click="downloadAPK(scope.row)" :disabled="downloadAPKLoading">{{
              "下载"}}
            </el-button>
            <el-button type="danger" size="mini" @click="delAPKInfoMeth(scope.row)"
                       v-if="checkPermission(['director','admin'])">{{ "删除" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        append-to-body
        title="APK详细信息"
        :visible.sync="apkDetailVisible">
        <span class="detail_span"><a
          class="detail_title">apkguid:</a>&nbsp&nbsp&nbsp{{apkDetailForm.apkguid}}</span><br><br>
        <span class="detail_span"><a class="detail_title">applicationLable:</a>&nbsp&nbsp&nbsp{{apkDetailForm.applicationLable}}</span><br><br>
        <span class="detail_span"><a class="detail_title">basic_packageName:</a>&nbsp&nbsp&nbsp{{apkDetailForm.basic_packageName}}</span><br><br>
        <span class="detail_span"><a class="detail_title">features:</a>&nbsp&nbsp&nbsp<br><span
          v-for="label in apkDetailForm.features">{{label}}<br></span></span><br><br>
        <span class="detail_span"><a
          class="detail_title">filename:</a>&nbsp&nbsp&nbsp{{apkDetailForm.filename}}</span><br><br>
        <span class="detail_span"><a class="detail_title">impliedFeatures:</a>&nbsp&nbsp&nbsp<br><span
          v-for="label in apkDetailForm.impliedFeatures">{{label}}<br></span></span><br/>
        <span class="detail_span"><a class="detail_title">launchableActivity:</a>&nbsp&nbsp&nbsp{{apkDetailForm.launchableActivity}}</span><br><br>
        <span class="detail_span"><a class="detail_title">minSdkVersion:</a>&nbsp&nbsp&nbsp{{apkDetailForm.sdkVersion}}</span><br><br>
        <span class="detail_span"><a class="detail_title">targetSdkVersion:</a>&nbsp&nbsp&nbsp{{apkDetailForm.targetSdkVersion}}</span><br><br>
        <span class="detail_span"><a class="detail_title">usesPermissions:</a>&nbsp&nbsp&nbsp<br><span
          v-for="label in apkDetailForm.usesPermissions">{{label}}<br></span></span><br/>
        <span class="detail_span"><a
          class="detail_title">versionCode:</a>&nbsp&nbsp&nbsp{{apkDetailForm.versionCode}}</span><br><br>
        <span class="detail_span"><a
          class="detail_title">versionName:</a>&nbsp&nbsp&nbsp{{apkDetailForm.versionName}}</span><br><br>
      </el-dialog>
      <el-dialog
        append-to-body
        title="原图预览"
        :visible.sync="previewDialogVisible">
        <img :src=picture
        />
      </el-dialog>
      <el-pagination
        :page-size="filepageSize"
        layout="prev, pager, next"
        :total="filetotalPages"
        :current-page="filecurrentPage"
        @current-change="filepageChange">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
    <el-button @click="fileListVisible = false">取 消</el-button>
    <el-button type="primary" @click="fileListVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import checkPermission from '@/utils/permission' // 权限判断函数
  import {
    getName, getChannel, getProject, createProject, getProjectConfigPublish, getProjectConfig,
    updateProject, deleteProject, getResourceName, createProjectConfig_pro, getProjectLimit,
    getFileListMeth, postFileListMeth, getdownload, getAPKInfoMeth, delAPKInfoMeth, setOnlineAPKMeth
  } from '@/api/table/projectmanager/projectTable'
  import {getProjectPublishLimitMeth} from '@/api/table/sdkmanager/projectconfigtable_publish'
  import waves from '@/directive/waves'
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import store from '@/store'
  import {getToken} from '@/utils/auth'
  import {fetchFileInfo, getFile, delFile} from '@/api/fileupload'
  import {getcompanyInfoMeth} from '@/api/table/sdkmanager/companyInfo'

  export default {
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
        apkcheckForm: {},
        apkCheckVisible: false,
        hidfileListTableData: [],
        acceptType: '.apk',
        downloadAPKLoading: false,
        picture: '',
        apkDetailForm: [],
        apkDetailVisible: false,
        previewDialogVisible: false,
        filepageSize: 10,
        filetotalPages: 0,
        filecurrentPage: 1,
        uploadChannelName: '',
        uploadPackageName: '',
        searchguid: '',//点击文件上传，sdkguid保存为此
        uploadPath: 'http://192.168.1.144:8091/file',
        fileListTableData: [],
        fileListVisible: false,
        pageSize: 15,
        totalPages: 0,
        currentPage: 1,
        fullscreenLoading: false,
        dialogForm: {
          package_name: '',
          channel_mark: '',
          date: 0
        },
        innerestVisible: false,
        innerVisible: false,
        project_value: {},
        project_list: [],
        channel_list: [],
        expands: [],
        getRowKeys(row) {
          return row.id
        },
        inputName: '',
        hidlist: [],
        addButton: '创建项目',
        list: null,
        listLoading: false,
        dialogStatus: '',
        dialogFormVisible: false,
        project: {
          project_name: undefined,
          preheat: undefined,
          schedule: undefined,
          compete_good: undefined,
          version_plan: undefined,
          note: undefined,
          applist: [{
            app_name: '',
            channel: '',
            package_name: '无',
            project: {}
          }],
        },
        companyList: [],
        textMap: {
          update: '编辑',
          create: '创建'
        },
        permissionList: [],
      }
    },
    mounted() {
      this.pageChange(1);
      this.fetchchannel();//初始化渠道列表
      this.initProjectList();//初始化项目列表
      this.listCompanyInfo();//初始化公司信息
    },
    methods: {
      showapkCheckInfo(param) {
        this.apkcheckForm = {}
        this.apkcheckForm.flag = true
        if (param.checkInfo != null) {
          this.apkcheckForm.flag = false
          this.apkcheckForm.publishAPPName = param.checkInfo.app_name
          this.apkcheckForm.publishPackageName = param.checkInfo.package_name
          this.apkcheckForm.publishVersionCode = param.checkInfo.versioncode_update_version
          this.apkcheckForm.publishVersionName = param.checkInfo.version_update
        }
        this.apkcheckForm.apkAPPName = param.applicationLable
        this.apkcheckForm.apkPackageName = param.basic_packageName
        this.apkcheckForm.apkVersionCode = param.versionCode
        this.apkcheckForm.apkVersionName = param.versionName

        this.apkCheckVisible = true
      },//展示apk未检测通过信息
      getPublish() {
        let tothis = this
        let param1 = {
          page: 1,
          limit: 999,
          appName: '',
          channelName: this.uploadChannelName,
          packageName: this.uploadPackageName
        }
        getProjectPublishLimitMeth(param1).then(response => {
          if (response.repcode === 3000) {
            console.log('发布记录\n', response.data)
            let publishList = response.data
            //publishList.app_name
            //publishList.package_name
            //publishList.versioncode_update_version   1
            //publishList.version_update      0.0.9
            console.log('文件信息表\n', this.fileListTableData)
            //this.fileListTableData.applicationLable
            //this.fileListTableData.basic_packageName
            //this.fileListTableData.versionCode    1
            //this.fileListTableData.versionName    1.0.0
            for (let i = 0; i < this.fileListTableData.length; i++) {
              let fileList = this.fileListTableData[i]
              let flag = false
              for (let j = 0; j < publishList.length; j++) {
                if (fileList.applicationLable === publishList[j].app_name &&
                  fileList.basic_packageName === publishList[j].package_name &&
                  fileList.versioncode_update_version === publishList[j].versionCode &&
                  fileList.version_update === publishList[j].versionName) {
                  flag = true
                  break
                }
              }
              this.fileListTableData[i].checkFlag = flag
              if (flag === false) {
                this.fileListTableData[i].checkInfo = publishList[0]
              }

            }
            this.hidfileListTableData = this.fileListTableData
            console.log(this.hidfileListTableData)
          } else {
            tothis.$notify({
              title: '失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })
      },//获取发布配置表对比apk解析信息
      setOnlinePackage(param) {
        let tothis = this
        let param1 = {
          apkguid: param.apkguid,
          sdkguid: this.searchguid,
          online: param.online
        }
        console.log(param1)
        setOnlineAPKMeth(param1).then(response => {
          if (response.repcode === 3000) {
            tothis.$notify({
              title: '成功',
              message: '设置为线上包成功！',
              type: 'success',
              duration: 2000
            })
          } else {
            tothis.$notify({
              title: '失败',
              message: '设置为线上包失败！',
              type: 'error',
              duration: 2000
            })
          }
          this.filepageChange(this.filecurrentPage)
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '设置为线上包失败！',
            type: 'error',
            duration: 2000
          })
        })

      },//设置为上线包
      delAPKInfoMeth(param) {
        this.$confirm('确认关闭？')
          .then(_ => {
            let tothis = this
            console.log(param.apkguid)
            let param1 = {
              apkguid: param.apkguid
            }
            delAPKInfoMeth(param1).then(response => {
              if (response.repcode === 3000) {
                this.filepageChange(this.filecurrentPage)
                tothis.$notify({
                  title: '成功',
                  message: '删除APK成功！',
                  type: 'success',
                  duration: 2000
                })
              } else {
                tothis.$notify({
                  title: '失败',
                  message: '删除APK失败！',
                  type: 'error',
                  duration: 2000
                })
              }
            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '失败',
                message: '删除APK失败！',
                type: 'error',
                duration: 2000
              })
            })
          })
          .catch(_ => {
          });
      },//删除apk
      checkAPKDetail(param) {
        this.apkDetailVisible = true
        this.apkDetailForm = param
        this.apkDetailForm.impliedFeatures = JSON.parse(param.impliedFeatures)
        this.apkDetailForm.usesPermissions = JSON.parse(param.usesPermissions)
        this.apkDetailForm.features = JSON.parse(param.features)
        console.log(param)
      },//查看apk详细信息
      bigPicture(param) {
        this.previewDialogVisible = true
        this.picture = param
      },//大图预览
      downloadAPK(param) {
        this.downloadAPKLoading = true
        let tothis = this
        let param1 = {
          path: param.apkguid
        }
        getdownload(param1).then(data => {
          if (data.size === 0) {
            tothis.$notify({
              title: '下载失败',
              message: '无效地址',
              type: 'error',
              duration: 2000
            })
            this.downloadAPKLoading = false
            return
          }
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', param.filename)
          document.body.appendChild(link)
          link.click()
          this.downloadAPKLoading = false
        }).catch(function (rs) {
          console.log(rs.toString())
          tothis.downloadLoading = false
          tothis.$notify({
            title: '下载失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
          this.downloadAPKLoading = false
        });
      },//下载apk文件
      filepageChange(param) {
        this.filecurrentPage = param
        let tothis = this
        let param1 = {
          sdkguid: this.searchguid,
          limit: this.filepageSize,
          page: param
        }
        this.fileListTableData = []
        getFileListMeth(param1).then(response => {
          if (response.repcode === 3000) {
            this.getPublish();
            this.fileListTableData = response.data

            this.filetotalPages = response.total
            console.log(response.data)

          } else {
            tothis.$notify({
              title: '失败',
              message: '获取文件上传记录列表失败',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error => {
          console.log(error)
          tothis.$notify({
            title: '失败',
            message: '获取文件上传记录列表失败',
            type: 'error',
            duration: 2000
          })
        })
      },//查看上传文件分页查找
      uploadSuccessMeth(response1, file, fileList) {
        let tothis = this
        let apiInfoParam = {
          apkguid: response1.data.guid,
        }
        getAPKInfoMeth(apiInfoParam).then(response2 => {
          if (response2.repcode === 3000) {
            let param1 = {
              apkguid: response1.data.guid,
              sdkguid: this.searchguid,
              basic: response2.data.basic,
              localIconPath: response2.data.icon,
            }
            console.log(param1)
            postFileListMeth(param1).then(response3 => {
              if (response3.repcode === 3000) {
                this.filepageChange(this.filecurrentPage)
                tothis.$notify({
                  title: '成功',
                  message: '上传成功',
                  type: 'success',
                  duration: 2000
                })
              } else {
                console.log(response3)
                tothis.$notify({
                  title: '失败',
                  message: '请刷新页面后重试',
                  type: 'error',
                  duration: 2000
                })
              }
            }).catch(error => {
              console.log(error)
              tothis.$notify({
                title: '失败',
                message: '请刷新页面后重试',
                type: 'error',
                duration: 2000
              })
            })
          } else {
            tothis.$notify({
              title: '失败',
              message: '获取基础信息失败！',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error => {
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '获取基础信息失败！',
            type: 'error',
            duration: 2000
          })
        });


      },//上传成功时间
      showFileListVisible(param) {
        this.fileListVisible = true
        this.uploadChannelName = param.channel
        this.uploadPackageName = param.package_name
        this.searchguid = param.sdkguid
        this.filepageChange(1)
        console.log(param)
      },//展示文件上传列表
      searchTable() {
        this.pageChange(1);
      },//查询按钮时间
      pageChange(page) {
        this.currentPage = page
        let tothis = this
        let param = {
          page: page,
          limit: this.pageSize,
          projectName: this.inputName,
        }
        getProjectLimit(param).then(response => {
          this.listLoading = false
          if (response.repcode === 3000) {
            this.list = response.data
            this.totalPages = response.total
          } else {
            tothis.$notify({
              title: '失败',
              message: '请刷新页面后重试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(error => {
          this.listLoading = false
          console.error(error)
          tothis.$notify({
            title: '失败',
            message: '请刷新页面后重试',
            type: 'error',
            duration: 2000
          })
        })


      },//分页切换
      listCompanyInfo() {
        let tothis = this;
        getcompanyInfoMeth().then(response => {
          if (response.repcode === 3000) {
            this.companyList = response.data
            console.log(this.companyList)
          } else {
            tothis.$notify({
              title: '初始化公司信息失败',
              message: '刷新试试',
              type: 'error',
              duration: 2000
            })
          }
        }).catch(function (rs) {
          console.log(rs)
          tothis.$notify({
            title: '初始化公司信息失败',
            message: '刷新试试',
            type: 'error',
            duration: 2000
          })
        })
      },//获取公司信息
      addconfig() {
        this.dialogForm = {}
        this.$nextTick(() => {
          this.$refs['dynamicValidateForm'].clearValidate()
        })
        this.innerestVisible = true
      },//添加配置
      addconfigList() {
        let tothis = this
        this.$refs['dynamicValidateForm'].validate((valid) => {
          if (valid) {

            this.dialogForm.date = Date.now()
            let guid = this.guid();
            let createtableParam = {
              channel_mark: this.dialogForm.channel_mark,
              date: this.dialogForm.date,
              keystoreguid: this.dialogForm.keystoreguid,
              package_name: this.dialogForm.package_name,
              sdkguid: guid
            }
            console.log('创建的配置表', createtableParam)

            createProjectConfig_pro(createtableParam).then(response => {
              if (response.data === '添加失败') {
                this.$message({
                  message: '请不要重复添加',
                  type: 'warning'
                });
                return
              }
              let app_info = {
                app_name: '暂无',
                channel: this.dialogForm.channel_mark,
                key: this.dialogForm.date,
                package_name: this.dialogForm.package_name.trim(),
                sdkguid: guid,
                project: {}
              }
              let list = this.project.applist
              console.log(this.project.applist)
              console.log(app_info)
              let flag = true
              for (let i = 0; i < list.length; i++) {
                if (list[i].package_name === app_info.package_name &&
                  list[i].channel === app_info.channel_mark) {
                  console.log(list[i].package_name)
                  console.log(this.project_value.package_name)
                  console.log(list[i].channel)
                  console.log(this.project_value.channel_mark)
                  flag = false
                  break;
                }
              }
              if (flag) {
                this.project.applist.push(app_info);
                this.innerVisible = false
                this.innerestVisible = false
              } else {
                console.log(2)
                this.$message({
                  message: '请不要重复添加',
                  type: 'warning'
                });
                return
              }


              this.$notify({
                title: '成功',
                message: '添加配置表成功',
                type: 'success',
                duration: 2000
              })

            }).catch(error => {
              console.error(error)
              tothis.$notify({
                title: '',
                message: '添加配置表失败,请检查是否重复！',
                type: 'error',
                duration: 2000
              })
            })
          } else {
            return false;
          }
        });
      },//添加配置表
      guid() {
        function S4() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
      },//生成guid
      link_Edit(val) {
        let routeData = this.$router.resolve({
          name: 'ProjectConfigManager',
          query: {package_name: val.package_name, channel: val.channel}
        });
        window.open(routeData.href, '_blank');
      },//编辑sdk配置表
      addDomain() {
        if (typeof (this.project_value.app_name) === "undefined") {
          this.$message({
            message: '请选择对应的配置表',
            type: 'warning'
          });
          return
        }
        let app_info = {
          app_name: this.project_value.app_name,
          channel: this.project_value.channel_mark,
          sdkguid: this.project_value.sdkguid,
          key: Date.now(),
          package_name: this.project_value.package_name,
          project: {}
        }
        let list = this.project.applist
        let flag = true
        for (let i = 0; i < list.length; i++) {
          if (list[i].package_name === this.project_value.package_name &&
            list[i].channel === this.project_value.channel_mark) {
            flag = false
          }
        }
        if (flag) {
          this.project.applist.push(app_info);
          this.innerVisible = false
        } else {
          this.$message({
            message: '请不要重复添加',
            type: 'warning'
          });
          return
        }

      },//添加应用
      initProjectList() {
        let name = {
          start: '1',
          end: '2'
        }
        getProjectConfig(name).then(response => {
          let data1 = response.data
          let data2 = []
          for (let i = 0; i < data1.length; i++) {
            let flag = true
            for (let j = 0; j < data2.length; j++) {
              if (data1[i].channel_mark === data2[j].channel_mark &&
                data1[i].package_name === data2[j].package_name) {
                flag = false
              }
            }
            if (flag) {
              data1[i]['name'] = data1[i].app_name + '_' + data1[i].channel_mark + '_' + data1[i].package_name
              data2.push(data1[i])
            }
          }
          this.project_list = data2
        })
      },//初始化配置表list
      closedialog() {
        this.dialogFormVisible = false
      },//关闭对话框
      fetchchannel() {
        let tothis = this
        this.listLoading = true
        getChannel().then(response => {
          this.channel_list = response.data
          console.log(this.channel_list)
        }).catch(function (rs) {
          tothis.listLoading = false
          tothis.$notify({
            title: '',
            message: '渠道列表获取失败',
            type: 'error',
            duration: 2000
          })
        })
      },//获取渠道名列表
      removeDomain(item) {
        var index = this.project.applist.indexOf(item)
        if (index !== -1) {
          this.project.applist.splice(index, 1)
        }
      },//删除应用
      link_Check(val) {
        let routeData = this.$router.resolve({
          name: 'ProjectConfigList',
          query: {package_name: val.package_name, channel: val.channel}
        });
        window.open(routeData.href, '_blank');
      },//跳转方法
      expandrowhandler(row, expandedRows) {
        let that = this
        if (expandedRows.length) {
          that.expands = []
          if (row) {
            that.expands.push(row.id)
          }
        } else {
          that.expands = []
        }
        if (expandedRows.length < 1) {
          return
        }
        let index = expandedRows.length - 1
      },//展开行变化时触发
      createData() {
        this.fullscreenLoading = true
        let tothis = this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let flag = true
            if (flag) {
              createProject(this.project).then(response => {
                if (response.data === 'ok') {
                  this.dialogFormVisible = false
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  })
                } else if (response.data === 'repeat') {
                  this.$notify({
                    title: '注意',
                    message: '项目名重复请修改！',
                    type: 'warning',
                    duration: 2000
                  })
                }
                console.log(123)
                tothis.pageChange(this.currentPage);
                tothis.fullscreenLoading = false
              }).catch(function (rs) {
                tothis.fullscreenLoading = false
                tothis.$notify({
                  title: '失败',
                  message: '请稍后重试',
                  type: 'error',
                  duration: 2000
                })
                console.error(rs.toString())
              })

            }
          } else {
            console.error('error submit!!');
            return false;
          }
        });
      },//创建方法
      updateData() {
        this.fullscreenLoading = true
        let tothis = this
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let flag = true
            let list = this.project.applist
            if (flag) {
              updateProject(this.project).then(() => {
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
                tothis.fullscreenLoading = false
              }).catch(function (rs) {
                tothis.fullscreenLoading = false
                tothis.$notify({
                  title: '失败',
                  message: '请稍后重试',
                  type: 'error',
                  duration: 2000
                })
                console.error(rs.toString())
              })
            }
          } else {
            return false;
          }
        })
      },//更新方法
      handleDelete(row) {
        let tothis = this
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProject(row).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            tothis.pageChange(this.currentPage);
          }).catch(function (rs) {
            tothis.$notify({
              title: '失败',
              message: '请稍后重试',
              type: 'error',
              duration: 2000
            })
          })
        });
      },//删除方法
      updateHandler(val) {
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
        this.project = val
      },//更新对话框展示
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },//创建对话框展示
      resetTemp() {
        this.project = {
          project_name: '',
          preheat: '暂无',
          schedule: '暂无',
          compete_good: '暂无',
          version_plan: '暂无',
          note: '暂无',
          applist: [],
        }
      },//重置对话框内容
      getDatawithName() {
        this.listLoading = true
        let param = this.inputName
        if (param == '') {
          this.list = this.hidlist;
          this.listLoading = false
          return
        }
        let data = []
        for (let i = 0; i < this.hidlist.length; i++) {
          if (this.hidlist[i].project_name.search(param) != -1) {
            data.push(this.hidlist[i])
          }
        }
        this.list = data
        this.listLoading = false
      },//二次筛选方法
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      checkPermission
    }
  }
</script>

<style>
  .detail_title {
    font-size: large;
    font-weight: bolder;
    font-size: 16px;
  }

  .detail_span {
    font-size: 14px;
    font-family: "微软雅黑";
  }

  .demo-table-expand label {
    width: 300px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    padding-left: 25px;
    margin-left: 10px;
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
    border-bottom: #d3dce6 solid 1px;
    border-left: #d3dce6 solid 1px;
  }

</style>
