<template>
  <div class="app-container">
    <div class="filter-container" style="margin: 15px;margin-top: -5px">
      <span style="margin-left: 15px;margin-right: 5px">应用名:</span>
      <el-input v-model="secondary_game" style="width: 200px" class="filter-item" clearable />
      <span style="margin-left: 15px;margin-right: 5px">渠道:</span>
      <el-input v-model="secondary_channel" style="width: 200px" class="filter-item" clearable />
      <span style="margin-left: 15px;margin-right: 5px">包名:</span>
      <el-input v-model="secondary_package" style="width: 200px" class="filter-item" clearable />
      <el-button
        style="margin-left: 20px"
        @click="searchTable"
        v-loading.fullscreen.lock="fullscreenLoading"
      >搜索</el-button>
    </div>
    <el-table
      height="760"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      :row-key="getRowKeys"
      fit
      stripe
      border
      highlight-current-row
    >
      <el-table-column label="图标" width="150">
        <template slot-scope="scope">
          <span style="width: 100%" v-if="scope.row.icon!=='暂无'&&scope.row.icon!==''">
            <img :src="iconPath+scope.row.icon" min-width="70" height="70" />
          </span>
          <span style="width: 100%" v-if="scope.row.icon==='暂无'||scope.row.icon===''">暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="应用名" prop="app_name" width="450"></el-table-column>
      <el-table-column label="渠道" prop="channel_mark" width="100"></el-table-column>
      <el-table-column label="包名" prop="package_name"></el-table-column>
      <el-table-column label="版本" prop="outerVersion_update" width="120"></el-table-column>
      <el-table-column label="版本code" prop="innerVersion_update" width="120"></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="350px"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
            v-if="checkPermission(['admin','director', 'operatorleader', 'operator'])"
          >{{ "编辑" }}</el-button>
          <el-button @click="link_Check(scope.row)" size="mini" type="primary">配置记录</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="showFileListVisible(scope.row)"
          >{{ "APK管理" }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="totalPages"
      :current-page="currentPage"
      @current-change="pageChange"
    ></el-pagination>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="80%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :model="appInfo"
        label-position="left"
        label-width="150px"
        :inline="true"
        style="margin-left:50px;"
        status-icon
        id="form-custom"
      >
        <el-form-item
          label="包名"
          :rules="[{ required: true, message: '包名不能为空'}]"
          prop="package_name"
        >
          <el-input v-model="appInfo.package_name" placeholder="必填~" class="dia-input" disabled />
        </el-form-item>
        <el-form-item
          label="渠道标记"
          :rules="[{ required: true, message: '渠道不能为空'}]"
          prop="channel_mark"
        >
          <el-select v-model="appInfo.channel_mark" disabled>
            <el-option
              v-for="item in channel_mark_list_dia"
              :key="item.name"
              :label="item.program_mark"
              :value="item.program_mark"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="游戏名" :rules="[{ required: true, message: '游戏名不能为空'}]" prop="app_name">
          <el-input v-model="appInfo.app_name" placeholder="必填~" class="dia-input" />
        </el-form-item>
        <el-form-item label="发布账号" prop="keystore">
          <el-select
            v-model="appInfo.keyStore"
            placeholder="请选择"
            class="dia-input"
            filterable
            value-key="keystoreguid"
          >
            <el-option
              v-for="item in keystoreList"
              :key="item.keystoreguid"
              :label="item.companyName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <div></div>
        <el-form-item
          label="外部版本-在线"
          class="filter-item"
          :rules="[{ required: true, message: '外部版本-在线不能为空'}]"
          prop="outerVersion_online"
        >
          <el-input
            v-model="appInfo.outerVersion_online"
            placeholder="必填~"
            class="dia-input"
            onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
          />
        </el-form-item>
        <el-form-item
          label="外部版本-更新"
          :rules="[{ required: true, message: '外部版本-更新不能为空'}]"
          prop="outerVersion_update"
        >
          <el-input
            v-model="appInfo.outerVersion_update"
            placeholder="必填~"
            class="dia-input"
            onkeyup="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'')"
          />
        </el-form-item>
        <el-form-item
          label="内部版本-在线"
          :rules="[{ required: true, message: '内部版本-在线不能为空'}]"
          prop="innerVersion_online"
        >
          <el-input v-model="appInfo.innerVersion_online" placeholder="必填~" class="dia-input" />
        </el-form-item>
        <el-form-item
          label="内部版本_更新"
          :rules="[{ required: true, message: '内部版本_更新不能为空'}]"
          prop="innerVersion_update"
        >
          <el-input v-model="appInfo.innerVersion_update" placeholder="必填~" class="dia-input" />
        </el-form-item>
        <el-form-item label="备注" :rules="[{ required: true, message: '默认填写暂无'}]" prop="note">
          <el-input
            v-model="appInfo.note"
            placeholder="必填~"
            class="dia-input"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <div></div>
        <div style="text-align: center">
          <el-upload
            style="margin: 20px;width: 40%;display: inline-block"
            class="avatar-uploader"
            :action="resPath"
            accept=".png, .jpg"
            :show-file-list="false"
            :on-success="uploadSuccess_icon"
            :before-upload="beforeUpload_icon"
          >
            <img v-if="imageUrl_icon" :src="imageUrl_icon" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              此处上传icon,
              <a
                style="text-decoration:underline"
                :href="this.imageUrl_icon"
                target="_blank"
                title="点击查看大图"
              >点击查看大图</a>
            </div>
          </el-upload>
          <el-upload
            style="margin: 20px;width: 50%;display: inline-block"
            class="avatar-uploader"
            :action="resPath"
            accept=".png, .jpg"
            :show-file-list="false"
            :on-success="uploadSuccess_splash"
            :before-upload="beforeUpload_splash"
          >
            <img v-if="imageUrl_splash" :src="imageUrl_splash" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              此处上传splash,
              <a
                style="text-decoration:underline"
                :href="this.imageUrl_splash"
                target="_blank"
                title="点击查看大图"
              >点击查看大图</a>
            </div>
          </el-upload>
        </div>
        <br />

        <!--筛选输入框-->
        <el-input
          placeholder="SDK类型筛选"
          v-model="sdk_type_filter_name"
          style="width: 200px;margin-bottom: 10px"
          class="filter-item"
          clearable
          @keyup.native="sdk_type_filter()"
          @change="sdk_type_filter()"
        />
        <!--多选框 sdk模版控制-->
        <el-checkbox-group v-model="sdk_type_checked" style="border-bottom: 15px" size="mini">
          <el-checkbox
            v-for="item in sdk_type_name_list"
            :label="item.sdk_type_name"
            :key="item.sdk_type_guid"
            @change
            :value="item"
            border
          >
            <div
              class="grid-content bg-purple-light"
              style="width: 107px;margin-bottom: 15px"
            >{{item.sdk_type_name}}</div>
          </el-checkbox>
        </el-checkbox-group>
        <br />
        <!--标签页-->
        <el-tabs
          tab-position="left"
          style="width: 95%;background-color: #f4f4f5;height: 500px;padding: 1px"
          id="test1"
          v-model="tabName"
          @tab-click="tabNameClick"
          type="border-card"
        >
          <el-tab-pane
            v-for="item in sdk_type_checked"
            :label="item"
            :key="item"
            :name="item"
            style="font-size: 14px;font-family: Microsoft YaHei;width: 100%"
          >
            <div name="pane_form" style="height: 500px;overflow: auto;">
              <a style="font: 20px Extra large;">{{sdk_type_name_title}}-{{sdk_type_version_title}}</a>
              <br />
              <br />
              <br />
              <!--<el-divider content-position="right"></el-divider>-->
              <a style="font: 14px Extra Small;">参数名</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a
                style="font: 14px Extra Small;"
              >参数</a>
              <br />
              <br />
              <!--标签页内表单-->
              <el-form-item
                v-for="(domain, index) in tabList"
                :key="domain.sdk_param_type_guid+index"
                style="margin-right: 1px"
                v-model="page_name"
              >
                <div style="width: 900px;padding-bottom: 30px;font-weight: bolder;">
                  <span
                    v-if="domain.sdk_param_type_type==='3'"
                    style="margin-right: 20px;font-size: 14px;font-family: Microsoft YaHei;width:200px;display: inline-block;color:red"
                  >{{domain.sdk_param_type_name}}：</span>
                  <span
                    v-if="domain.sdk_param_type_type!=='3'"
                    style="margin-right: 20px;font-size: 14px;font-family: Microsoft YaHei;width:200px;display: inline-block"
                  >{{domain.sdk_param_type_name}}：</span>
                  <el-input
                    v-model="domain.sdk_param_value"
                    style="width: 300px;margin-right: 25px"
                    v-if="domain.sdk_param_type_type==='0'"
                    placeholder="填写key"
                  />

                  <!-- <el-input v-model="domain.sdk_param_value"
                            style="width: 300px;margin-right: 25px;display: inline-block"
                  placeholder="填写key" disabled v-if="domain.sdk_param_type_type==='3'"/>-->
                  <el-select
                    v-model="domain.sdk_param_value"
                    v-if="domain.sdk_param_type_type==='3'"
                    style="width: 300px;display: inline-block;color:red"
                    filterable
                    clearable
                    remote
                    :remote-method="remoteMethod"
                    placeholder="请输入关键词查询广告位"
                    value-key="placement_guid"
                    collapse-tags
                  >
                    <el-option
                      v-for="item in placementList"
                      :key="item.placement_guid"
                      :label="item.placement_name+' : '+item.placement_id"
                      :value="item.placement_guid"
                    ></el-option>
                  </el-select>

                  <el-switch
                    v-if="domain.sdk_param_type_type==='2'"
                    style="display: inline-block"
                    value="false"
                    v-model="domain.sdk_param_value"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="True"
                    inactive-text="False"
                    active-value="true"
                    inactive-value="false"
                  ></el-switch>
                </div>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAppInfo(false)">保存</el-button>
        <el-button type="success" @click="saveAppInfo(true)">发布</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="APK列表"
      :visible.sync="fileListVisible"
      width="80%"
    >
      <el-upload
        class="upload-demo"
        drag
        :headers="dataObj"
        :accept="acceptType"
        :action="uploadPath"
        :before-upload="beforeUpload"
        :on-success="uploadSuccessMeth"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <div style="margin-left: 10px;margin-top: 10px">
        复制APK链接:&nbsp&nbsp
        <el-input
          v-model="link"
          placeholder="Please input"
          style="max-width:100%;width: 900px"
          disabled
        />
        <el-button
          v-clipboard:copy="link"
          v-clipboard:success="clipboardSuccess"
          type="primary"
          icon="document"
        >复制</el-button>
      </div>
      <el-table
        v-loading="fileTableLoading"
        :data="hidfileListTableData"
        border
        height="500"
        style="width: 100%;margin-top: 20px"
      >
        <el-table-column width="90px" label="预览">
          <template slot-scope="scope">
            <span style="width: 100%">
              <img :src="scope.row.iconPath" min-width="70" height="70" />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="filename" label="文件名"></el-table-column>
        <!--<el-table-column-->
        <!--prop="apkguid"-->
        <!--label="GUID">-->
        <!--</el-table-column>-->
        <el-table-column prop="date" label="时间" width="250"></el-table-column>
        <el-table-column width="90px" prop="versionCode" label="内版本号"></el-table-column>
        <el-table-column width="90px" prop="versionName" label="外版本号"></el-table-column>
        <el-table-column vprop="checkFlag" width="90px" label="APK检查">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="APK信息验证通过" placement="top">
              <el-button type="success" v-if="scope.row.checkFlag" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="APK信息验证未通过，点击查看详细信息" placement="top">
              <el-button
                type="danger"
                v-if="!scope.row.checkFlag"
                circle
                @click="showapkCheckInfo(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-dialog
          :close-on-click-modal="false"
          append-to-body
          title="APK验证信息"
          :visible.sync="apkCheckVisible"
        >
          <h2 v-if="apkcheckForm.flag">未找到对应配置表！</h2>
          <span class="detail_span">
            <a class="detail_title">配置表应用名:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.publishAPPName}}
          </span>
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">配置表包名:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.publishPackageName}}
          </span>
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">配置表内版本号:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.publishVersionCode}}
          </span>
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">配置表外版本号:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.publishVersionName}}
          </span>
          <br />
          <br />

          <span class="detail_span">
            <a class="detail_title">配置表MD5:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.publishMD5}}
          </span>
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">配置表SHA1:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.publishSHA1}}
          </span>
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">配置表SHA256:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.publishSHA256}}
          </span>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">apk应用名:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.apkAPPName}}
          </span>
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">apk包名:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.apkPackageName}}
          </span>
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">apk内版本号:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.apkVersionCode}}
          </span>
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">apk外版本号:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.apkVersionName}}
          </span>
          <br />
          <br />

          <span class="detail_span">
            <a class="detail_title">apkMD5:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.apkMD5}}
          </span>
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">apkSHA1:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.apkSHA1}}
          </span>
          <br />
          <br />
          <span class="detail_span">
            <a class="detail_title">apkSHA256:</a>
            &nbsp&nbsp&nbsp{{apkcheckForm.apkSHA256}}
          </span>
          <br />
          <br />
        </el-dialog>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="380"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="checkAPKDetail(scope.row)"
              style="margin-right: 10px"
            >{{ "详细信息" }}</el-button>

            <div
              style="margin-top: 1px;border: #DCDFE6 0px solid;width: 70px;height: 40px;text-align: center;top:50%;border-radius: 5px;display: inline-block"
            >
              <a
                style="color: #0000CC;font-size: 14px;margin-top: 14%;display: inline-block;text-decoration:underline"
                :download="scope.row.filename"
                :href="downloadPath+scope.row.filename+downloadPath1+scope.row.apkguid"
                target="_blank"
              >下载</a>
            </div>

            <!--<el-button type="success" size="mini" @click="downloadAPK(scope.row)" :disabled="downloadAPKLoading">{{-->
            <!--"下载"}}-->
            <!--</el-button>-->

            <el-button
              style="margin-left: 10px"
              type="danger"
              size
              @click="delAPKInfoMeth(scope.row)"
              v-if="checkPermission(['director','admin'])"
            >{{ "删除" }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :close-on-click-modal="false"
        append-to-body
        title="APK详细信息"
        :visible.sync="apkDetailVisible"
      >
        <span class="detail_span">
          <a class="detail_title">apkguid:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.apkguid}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">filename:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.filename}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">applicationLable:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.applicationLable}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">packageName:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.basic_packageName}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">versionName:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.versionName}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">versionCode:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.versionCode}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">launchableActivity:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.launchableActivity}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">minSdkVersion:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.sdkVersion}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">targetSdkVersion:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.targetSdkVersion}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">MD5:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.MD5}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">SHA1:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.SHA1}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">SHA256:</a>
          &nbsp&nbsp&nbsp{{apkDetailForm.SHA256}}
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">usesPermissions:</a>&nbsp&nbsp&nbsp
          <br />
          <span v-for="label in apkDetailForm.usesPermissions">
            {{label}}
            <br />
          </span>
        </span>
        <br />
        <span class="detail_span">
          <a class="detail_title">features:</a>&nbsp&nbsp&nbsp
          <br />
          <span v-for="label in apkDetailForm.features">
            {{label}}
            <br />
          </span>
        </span>
        <br />
        <br />
        <span class="detail_span">
          <a class="detail_title">impliedFeatures:</a>&nbsp&nbsp&nbsp
          <br />
          <span v-for="label in apkDetailForm.impliedFeatures">
            {{label}}
            <br />
          </span>
        </span>
        <br />
      </el-dialog>
      <el-dialog
        :close-on-click-modal="false"
        append-to-body
        title="原图预览"
        :visible.sync="previewDialogVisible"
      >
        <img :src="picture" />
      </el-dialog>
      <el-pagination
        :page-size="filepageSize"
        layout="prev, pager, next"
        :total="filetotalPages"
        :current-page="filecurrentPage"
        @current-change="filepageChange"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { parseTime } from "@/utils";
import checkPermission from "@/utils/permission"; // 权限判断函数
import { addNotRemindAppMeth } from "@/api/table/sdkmanager/projectconfigtable";
import { getToken } from "@/utils/auth";
import { getcompanyInfoMeth } from "@/api/table/sdkmanager/companyInfo";
import { getProjectPublishLimitMeth } from "@/api/table/sdkmanager/projectconfigtable_publish";
import {
  getAPKInfoMeth,
  delAPKInfoMeth,
  getFileListMeth,
  getdownload,
  postFileListMeth
} from "@/api/table/projectmanager/projectTable";
import { getPlacementHandler } from "@/api/table/datamanager/newDataManager/placementData";
import clipboard from "@/directive/clipboard/index"; // use clipboard by v-directive
import { getAllSDK } from "@/api/sdkmanager_new/sdk_config_page";
import {
  editAppInfo,
  listAppConfigInfo,
  listAppInfo,
  publishAppInfo
} from "@/api/table/sdkmanager/appInfo";
import { listAppConfigInfoRecord } from "@/api/sdkmanager_new/app_config_record";

export default {
  directives: {
    clipboard
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  computed: {
    ...mapGetters(["name", "roles"])
  },
  data() {
    return {
      sdk_type_name_title: "",
      sdk_type_version_title: "",
      tabList: [],
      sdk_type_checked: [],
      tabName: "",
      sdk_type_name_list: [],
      sdk_type_filter_name: "",
      link: "",
      dataObj: { "Content-Type": "multipart/form-data" },
      fileTableLoading: false,
      downloadAPKLoading: false,
      picture: "",
      filepageSize: 30,
      filetotalPages: 0,
      filecurrentPage: 1,
      previewDialogVisible: false,
      apkDetailForm: [],
      apkDetailVisible: false,
      apkcheckForm: {},
      apkCheckVisible: false,
      //downloadPath: 'http://filehost.tomatojoy.com:8091/getapkfile/',
      downloadPath: "http://filehost.tomatojoy.com:8091/getapkfile/",
      downloadPath1: "?path=",
      uploadPath: "http://filehost.tomatojoy.com:8091/file",
      acceptType: ".apk",
      iconPath: "http://filehost.tomatojoy.com/file?path=",
      sdkModelListVersion: "",
      sdkModelListName: "",
      fullscreenLoading: false,
      pageSize: 30,
      totalPages: 0,
      currentPage: 1,
      user: "",
      resPath1: "http://filehost.tomatojoy.com:8091/file",
      resPath: "http://filehost.tomatojoy.com:8091/file",
      imageUrl_splash: "",
      imageUrl_icon: "",
      keystoreList: [],
      dataObj: {
        Authorization: ""
      },
      tabname: "",
      secondary_package: "",
      rowvalue: "",
      tag_name: "",
      options: [],
      value: [],
      page_name: "", //初始值  一直为 ''
      dialog_secondary_checked: [],
      dialog_secondary_list: [],
      dialog_secondary_visual: false,
      filter_form_name: "暂无",
      update_flag: true,
      sdk_template_name: "",
      sdkTemplatelibrary: [],
      checkedSdkTemplate: [],
      sdkTemplate: [],
      hidsdkTemplate: [],
      checked: true,
      checked1: false,
      dataForm: {
        package_name: "",
        channel_mark: "",
        app_name: "",
        keyStore: {},
        outerVersion_online: "",
        outerVersion_update: "",
        innerVersion_online: "",
        innerVersion_update: "",
        note: ""
      },
      secondary_channel: "",
      secondary_game: "",
      names: [],
      layout: "",
      timevalue: "",
      hidtimevalue: "",
      list: null,
      listLoading: false,
      names: [],
      dialogStatus: "",
      dialogFormVisible: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      appInfo: {
        package_name: "",
        channel_mark: "",
        app_name: "",
        keyStore: {},
        outerVersion_online: "",
        outerVersion_update: "",
        innerVersion_online: "",
        innerVersion_update: "",
        note: ""
      },
      hidlist: "",
      channel_mark_list_dia: [],
      publishlist: [],
      getRowKeys(row) {
        return row.id;
      },
      hidfileListTableData: [],
      fileListVisible: false,
      uploadChannelName: "",
      uploadPackageName: "",
      searchguid: "",
      placementList: [],
      hidplacementList: [],
      searchPlacementList: [],
      testPlacement: {},
      loading: false,
      form_init_placementList: [],
      placementList_hash: [],
      placementList_hashMap: {},
      placement_value_list: [],
      tab_placement_list: []
    };
  },
  created() {
    this.user = this.name;
    this.routeWithParam(); //跳转赋值
    this.pageChange(1); //初始化页面
    this.listKeyStoreInfo(); //获取keystore列表
    this.init_sdk_type(); //初始化sdk类型
    this.getPlacementMeth(); //初始化广告位
  },
  methods: {
    saveAppInfo(param) {
      console.log(this.sdk_param_type_list);
      let tothis = this;
      let paramList = [];
      //遍历sdk参数类型表
      for (let i = 0; i < this.sdk_param_type_list.length; i++) {
        if (
          typeof this.sdk_param_type_list[i].sdk_param_value != "undefined" &&
          this.sdk_param_type_list[i].sdk_param_value != ""
        ) {
          paramList.push(this.sdk_param_type_list[i]);
        }
      }
      //遍历sdk类型表
      let checked = [];
      for (let i = 0; i < this.hid_sdk_type_name_list.length; i++) {
        for (let j = 0; j < this.sdk_type_checked.length; j++) {
          if (
            this.sdk_type_checked[j] ===
            this.hid_sdk_type_name_list[i].sdk_type_name
          ) {
            checked.push(this.hid_sdk_type_name_list[i]);
          }
        }
      }
      this.appInfo.checked = checked;
      this.appInfo.paramList = paramList;
      this.appInfo.publish = this.user;
      console.log("保存应用信息", this.appInfo);
      editAppInfo(this.appInfo)
        .then(response => {
          if (response.repcode === 3000) {
            tothis.$notify({
              title: "成功",
              message: "保存成功",
              type: "success",
              duration: 2000
            });
            if (param) {
              this.$nextTick(() => {
                tothis.$refs["dataForm"].validate(valid => {
                  if (valid) {
                    tothis.doPublish();
                  }
                });
              });
            }
          } else {
            console.error(response);
          }
        })
        .catch(error => {
          console.error(error);
          tothis.$notify({
            title: "失败",
            message: "请刷新页面后重试",
            type: "error",
            duration: 2000
          });
        });
    }, //保存应用信息
    doPublish() {
      let tothis = this;
      let publishParam = this.appInfo;
      console.log("开始发布");
      let num = new RegExp("^[0-9]*$");
      if (
        !num.test(publishParam.innerVersion_online) &&
        !num.test(publishParam.innerVersion_online)
      ) {
        tothis.$notify({
          title: "发布失败！",
          dangerouslyUseHTMLString: true,
          message: "内部版本号格式错误,请及时修改！<br>必须为正整数。",
          type: "error",
          duration: 4000
        });
        return;
      }
      let arr2 = publishParam.outerVersion_update.split("."); //外版本号
      let arr3 = publishParam.outerVersion_online.split("."); //外版本号
      let arr2test = false;
      let arr3test = false;
      for (let i = 0; i < arr2.length; i++) {
        if (!num.test(arr2[i])) {
          arr2test = true;
        }
      }
      for (let i = 0; i < arr3.length; i++) {
        if (!num.test(arr3[i])) {
          arr3test = true;
        }
      }
      if (arr2.length !== 3 || arr3.length !== 3 || arr2test || arr3test) {
        tothis.$notify({
          title: "发布失败！",
          dangerouslyUseHTMLString: true,
          message: "外部版本号格式不正确,请及时修改！<br>例如:1.0.0",
          type: "error",
          duration: 4000
        });
        return false;
      }

      if (
        this.compareVersion(
          publishParam.outerVersion_online,
          publishParam.outerVersion_update
        ) > 0
      ) {
        tothis.$notify({
          title: "发布失败！",
          message: "外版本号更新必须大于在线！",
          type: "error",
          duration: 2000
        });
        return;
      }
      if (
        parseInt(publishParam.innerVersion_online) -
          parseInt(publishParam.innerVersion_update) >
        0
      ) {
        tothis.$notify({
          title: "发布失败！",
          message: "内版本号更新必须大于在线！",
          type: "error",
          duration: 2000
        });
        return;
      }

      //遍历发布列表里面的值，将广告位guid转换成具体的值
      for (let i = 0; i < publishParam.paramList.length; i++) {
        if (publishParam.paramList[i].sdk_param_type_type === "3") {
          try {
            publishParam.paramList[i].placement_value = this.placementList_hashMap[publishParam.paramList[i].sdk_param_value].placement_id;
          } catch (e) {
            console.log(publishParam.paramList[i])
            tothis.$notify({
              title: "发布失败！",
              message: "广告位未选择，请检查选中SDK内所有红色字体的参数是否都已选中对应的广告位。",
              type: "error",
              duration: 10*1000
            });
            return;
          }
        }
      }

      console.log("发布对象", publishParam);
      publishAppInfo(publishParam)
        .then(response => {
          if (response.repcode === 3000) {
            tothis.$notify({
              title: "成功",
              message: "发布成功",
              type: "success",
              duration: 2000
            });
          } else {
            tothis.$notify({
              title: "失败",
              message: response.data,
              type: "error",
              duration: 2000
            });
          }
        })
        .catch(error => {
          console.error(error);
          tothis.$notify({
            title: "失败",
            message: "请刷新页面后重试",
            type: "error",
            duration: 2000
          });
        });
    },
    resetForm() {
      this.sdk_type_filter_name = "";
      this.sdk_type_checked = [];
      this.sdk_type_name_list = this.hid_sdk_type_name_list;
      for (let i = 0; i < this.sdk_param_type_list.length; i++) {
        this.sdk_param_type_list[i].sdk_param_value = "";
      }
    }, //重置sdk配置表form
    init_sdk_type() {
      let tothis = this;
      getAllSDK()
        .then(response => {
          if (response.repcode === 3000) {
            this.sdk_type_name_list = response.sdkType;
            this.hid_sdk_type_name_list = response.sdkType;
            console.log("sdk类型列表", response.sdkType);
            this.sdk_param_type_list = response.sdkParamType;
            this.hid_sdk_param_type_list = response.sdkParamType;
            console.log("sdk类型参数列表", response.sdkParamType);
          } else {
            tothis.$notify({
              title: "失败",
              message: "初始化SDK类型失败,请刷新页面后重试",
              type: "error",
              duration: 2000
            });
          }
        })
        .catch(error => {
          console.error(error);
          tothis.$notify({
            title: "失败",
            message: "初始化SDK类型失败,请刷新页面后重试",
            type: "error",
            duration: 2000
          });
        });
    }, //初始化sdk类型
    getPlacementMeth() {
      getPlacementHandler()
        .then(response => {
          if (response.repcode === 3000) {
            console.log("广告位列表", response.json);
            this.placementList_hash = response.json;
            this.placementList_hashMap = response.hash;
            console.log(response);
            console.log("++++++++++++");
          } else {
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
          this.$message({
            type: "error",
            message: `初始化广告位失败！`
          });
        });
    }, //初始化广告位列表
    tabNameClick(tab, event) {
      //重置选项卡
      this.tabList = [];
      //遍历sdk类型列表,找到版本号 名称和sdk_type_guid
      let tab_sdk_type_guid = "";
      for (let i = 0; i < this.hid_sdk_type_name_list.length; i++) {
        if (this.hid_sdk_type_name_list[i].sdk_type_name === tab.label) {
          this.sdk_type_name_title = tab.label;
          this.sdk_type_version_title = this.hid_sdk_type_name_list[
            i
          ].sdk_type_version;
          tab_sdk_type_guid = this.hid_sdk_type_name_list[i].sdk_type_guid;
          break;
        }
      }
      //遍历sdk参数类型
      for (let i = 0; i < this.sdk_param_type_list.length; i++) {
        if (this.sdk_param_type_list[i].sdk_type_guid === tab_sdk_type_guid) {
          this.tabList.push(this.sdk_param_type_list[i]);
        }
      }
      console.log("选项卡列表", this.tabList);
      //展示对应广告类型的所有广告位参数
      this.form_init_placementList = [];
      this.hidplacementList = this.placementList_hash[tab.label];
      console.log(this.placement_value_list);
      for (let i = 0; i < this.placement_value_list.length; i++) {
        if(typeof(this.hidplacementList) ==='undefined')continue;
        for (let j = 0; j < this.hidplacementList.length; j++) {
          if (
            this.hidplacementList[j].placement_guid ===
            this.placement_value_list[i]
          ) {
            this.form_init_placementList.push(this.hidplacementList[j]);
          }
        }
      }
      console.log("tab初始化list", this.form_init_placementList);
      //tab切换时清空原下拉框
      this.placementList = this.form_init_placementList;
      console.log("根据tab展示的广告位列表", this.hidplacementList);
    }, //tab标签按钮点击事件
    sdk_type_filter() {
      console.log(this.sdk_type_filter_name);
      this.sdk_type_name_list = [];
      for (let i = 0; i < this.hid_sdk_type_name_list.length; i++) {
        if (
          this.hid_sdk_type_name_list[i].sdk_type_name.search(
            this.sdk_type_filter_name
          ) != -1 ||
          this.hid_sdk_type_name_list[i].sdk_type_tag.search(
            this.sdk_type_filter_name
          ) != -1
        ) {
          this.sdk_type_name_list.push(this.hid_sdk_type_name_list[i]);
        }
      }
    }, //sdk类型表筛选
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.placementList = this.hidplacementList.filter(item => {
            return (
              item.placement_name.toLowerCase().indexOf(query.toLowerCase()) >
              -1
            );
          });
        }, 200);
      } else {
        this.placementList = [];
      }
      this.placementList = this.placementList.concat(
        this.form_init_placementList
      );
    }, //选择器远程搜索
    clipboardSuccess() {
      this.$message({
        message: "复制成功",
        type: "success",
        duration: 1500
      });
    }, //剪贴板复制成功
    showapkCheckInfo(param) {
      console.log("查看检查信息", param);
      this.apkcheckForm = {};
      this.apkcheckForm.flag = true;
      if (param.checkInfo != null) {
        this.apkcheckForm.flag = false;
        this.apkcheckForm.publishAPPName = param.checkInfo.productName;
        this.apkcheckForm.publishPackageName = param.checkInfo.packageName;
        this.apkcheckForm.publishVersionCode = param.checkInfo.versionCode;
        this.apkcheckForm.publishVersionName = param.checkInfo.versionName;
        this.apkcheckForm.publishMD5 = param.checkInfo.MD5;
        this.apkcheckForm.publishSHA1 = param.checkInfo.SHA1;
        this.apkcheckForm.publishSHA256 = param.checkInfo.SHA256;
      }
      this.apkcheckForm.apkAPPName = param.applicationLable;
      this.apkcheckForm.apkPackageName = param.basic_packageName;
      this.apkcheckForm.apkVersionCode = param.versionCode;
      this.apkcheckForm.apkVersionName = param.versionName;
      this.apkcheckForm.apkMD5 = param.MD5;
      this.apkcheckForm.apkSHA1 = param.SHA1;
      this.apkcheckForm.apkSHA256 = param.SHA256;
      this.apkCheckVisible = true;
    }, //展示apk未检测通过信息
    downloadAPK(param) {
      this.downloadAPKLoading = true;
      let tothis = this;
      let param1 = {
        path: param.apkguid
      };
      getdownload(param1)
        .then(data => {
          if (data.size === 0) {
            tothis.$notify({
              title: "下载失败",
              message: "无效地址",
              type: "error",
              duration: 2000
            });
            this.downloadAPKLoading = false;
            return;
          }
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", param.filename);
          document.body.appendChild(link);
          link.click();
          this.downloadAPKLoading = false;
        })
        .catch(function(rs) {
          console.log(rs.toString());
          tothis.downloadLoading = false;
          tothis.$notify({
            title: "下载失败",
            message: "刷新试试",
            type: "error",
            duration: 2000
          });
          this.downloadAPKLoading = false;
        });
    }, //下载apk文件
    getPublish() {
      let tothis = this;
      let param1 = {
        page: 1,
        limit: 999,
        app_guid: this.searchguid
      };
      //todo
      console.log("发布记录参数", param1);
      listAppConfigInfoRecord(param1)
        .then(response => {
          if (response.repcode === 3000) {
            let publishList = response.data;
            // console.log('原发布记录',response.data)
            // let publishList = []
            // for (let i = 0; i < cacheList.length; i++) {
            //   if (cacheList[i].package_name === this.uploadPackageName) {
            //     publishList.push(cacheList[i])
            //   }
            // }
            console.log("发布记录\n", publishList);
            console.log("文件信息表\n", this.fileListTableData);
            for (let i = 0; i < this.fileListTableData.length; i++) {
              let fileList = this.fileListTableData[i];
              let flag = false;
              if (publishList.length > 0) {
                console.log("++++++++++++++++++++++++");
                console.log(
                  "fileList.applicationLable  " + fileList.applicationLable
                );
                console.log(
                  "fileList.basic_packageName  " + fileList.basic_packageName
                );
                console.log("fileList.versionCode  " + fileList.versionCode);
                console.log("fileList.versionName  " + fileList.versionName);
                console.log("fileList.MD5  " + fileList.MD5);
                console.log("fileList.SHA1  " + fileList.SHA1);
                console.log("fileList.SHA256  " + fileList.SHA256);

                console.log(
                  "publishList[0].productName  " + publishList[0].productName
                );
                console.log(
                  "publishList[0].packageName  " + publishList[0].packageName
                );
                console.log(
                  "publishList[0].versionCode  " + publishList[0].versionCode
                );
                console.log(
                  "publishList[0].versionName  " + publishList[0].versionName
                );
                console.log("publishList[0].MD5  " + publishList[0].MD5);
                console.log("publishList[0].SHA1  " + publishList[0].SHA1);
                console.log("publishList[0].SHA256  " + publishList[0].SHA256);
                console.log("++++++++++++++++++++++++");
                if (
                  fileList.applicationLable ===
                    publishList[0].productName.trim() &&
                  fileList.basic_packageName ===
                    publishList[0].packageName.trim() &&
                  fileList.versionCode === publishList[0].versionCode.trim() &&
                  fileList.versionName === publishList[0].versionName.trim() &&
                  fileList.MD5 === publishList[0].MD5.trim() &&
                  fileList.SHA1 === publishList[0].SHA1.trim() &&
                  fileList.SHA256 === publishList[0].SHA256.trim()
                ) {
                  console.log(11);
                  flag = true;
                }
              }
              this.fileListTableData[i].checkFlag = flag;
              if (flag === false) {
                this.fileListTableData[i].checkInfo = publishList[0];
              }
            }
            this.hidfileListTableData = this.fileListTableData;
          } else {
            tothis.$notify({
              title: "失败",
              message: "请刷新页面后重试",
              type: "error",
              duration: 2000
            });
          }
        })
        .catch(error => {
          console.error(error);
          tothis.$notify({
            title: "失败",
            message: "请刷新页面后重试",
            type: "error",
            duration: 2000
          });
        });
    }, //获取发布配置表对比apk解析信息
    contrastApk(param) {
      let tothis = this;
      let param1 = {
        page: 1,
        limit: 999,
        app_guid: this.searchguid
      };
      //todo
      listAppConfigInfoRecord(param1)
        .then(response => {
          if (response.repcode === 3000) {
            let publishList = response.data;
            // console.log('原发布记录',response.data)
            // let publishList = []
            // for (let i = 0; i < cacheList.length; i++) {
            //   if (cacheList[i].package_name === this.uploadPackageName) {
            //     publishList.push(cacheList[i])
            //   }
            // }
            console.log("发布记录\n", publishList);
            console.log("文件信息表\n", this.fileListTableData);

            let fileList = param.basic;
            if (publishList.length > 0) {
              console.log("最新key表", publishList[0]);
              console.log("app信息", fileList);
              console.log("++++++++++++++++++++++++");
              console.log(
                "fileList.applicationLable  " + fileList.applicationLable
              );
              console.log(
                "fileList.basic_packageName  " + fileList.basic_packageName
              );
              console.log("fileList.versionCode  " + fileList.versionCode);
              console.log("fileList.versionName  " + fileList.versionName);
              console.log("fileList.MD5  " + fileList.MD5);
              console.log("fileList.SHA1  " + fileList.SHA1);
              console.log("fileList.SHA256  " + fileList.SHA256);

              console.log(
                "publishList[0].app_name  " + publishList[0].productName
              );
              console.log(
                "publishList[0].package_name  " + publishList[0].packageName
              );
              console.log(
                "publishList[0].innerVersion_update  " +
                  publishList[0].versionCode
              );
              console.log(
                "publishList[0].outerVersion_update  " +
                  publishList[0].versionName
              );
              console.log("publishList[0].MD5  " + publishList[0].MD5);
              console.log("publishList[0].SHA1  " + publishList[0].SHA1);
              console.log("publishList[0].SHA256  " + publishList[0].SHA256);
              console.log("++++++++++++++++++++++++");
              if (
                fileList.applicationLable ===
                  publishList[0].productName.trim() &&
                fileList.packageName === publishList[0].packageName.trim() &&
                fileList.versionCode === publishList[0].versionCode.trim() &&
                fileList.versionName === publishList[0].versionName.trim() &&
                fileList.md5 === publishList[0].MD5.trim() &&
                fileList.sha1 === publishList[0].SHA1.trim() &&
                fileList.sha256 === publishList[0].SHA256.trim()
              ) {
                console.log("上传的包信息校验成功", publishList[0]);
                let keyList = publishList[0].paramList;
                console.log("配置记录参数列表", keyList);
                let appKey = "";
                for (let i = 0; i < keyList.length; i++) {
                  if (
                    keyList[i].sdk_type === "友盟统计" &&
                    keyList[i].sdk_param_type === "AppKey"
                  ) {
                    appKey = keyList[i].sdk_param;
                    break;
                  }
                }
                if (appKey === "") {
                  tothis.$notify({
                    title: "",
                    message: "该应用未填写友盟统计key,无法添加到待提醒列表",
                    duration: 2000
                  });
                  console.log("该应用未填写友盟统计key,无法添加到待提醒列表");
                  return;
                }
                let remindParam = {
                  configguid: this.searchguid, //配置表的guid
                  sdkguid: publishList[0].sdkguid, //发布记录的guid
                  icon: publishList[0].icon,
                  appName: publishList[0].app_name,
                  channelName: publishList[0].channel_mark,
                  versionCode: publishList[0].outerVersion_update,
                  packageName: publishList[0].package_name,
                  appKey: appKey
                };
                tothis.$notify({
                  title: "成功",
                  message: "验证成功，正在添加应用到待提醒列表",
                  duration: 2000
                });
                console.log(remindParam);
                addNotRemindAppMeth(remindParam)
                  .then(response => {
                    if (response.repcode === 3000) {
                      tothis.$notify({
                        title: "成功",
                        message: "添加应用到待提醒列表成功",
                        type: "success",
                        duration: 2000
                      });
                    } else {
                      console.log(repcode);
                    }
                  })
                  .catch(error => {
                    console.log(error);
                    tothis.$notify({
                      title: "失败",
                      message: "添加应用到待提醒列表失败",
                      type: "error",
                      duration: 2000
                    });
                  });
              } else {
                console.log("上传的包校验失败");
              }
            } else {
              console.log("未找到对应的key表");
            }
            this.hidfileListTableData = this.fileListTableData;
          } else {
            console.log(response);
            tothis.$notify({
              title: "失败",
              message: "未获取到发布记录",
              type: "error",
              duration: 2000
            });
          }
        })
        .catch(error => {
          console.error(error);
          tothis.$notify({
            title: "失败",
            message: "请刷新页面后重试",
            type: "error",
            duration: 2000
          });
        });
    }, //获取发布配置表对比apk解析信息
    uploadSuccessMeth(response1, file, fileList) {
      let tothis = this;
      let apiInfoParam = {
        apkguid: response1.data.guid
      };
      getAPKInfoMeth(apiInfoParam)
        .then(response2 => {
          if (response2.repcode === 3000) {
            let param1 = {
              apkguid: response1.data.guid,
              sdkguid: this.searchguid,
              basic: response2.data.basic,
              localIconPath: response2.data.icon
            };
            console.log(param1);
            this.contrastApk(param1); //上传成功后校验apk信息，正确则添加到待提醒列表
            postFileListMeth(param1)
              .then(response3 => {
                if (response3.repcode === 3000) {
                  this.filepageChange(this.filecurrentPage);
                  tothis.$notify({
                    title: "成功",
                    message: "上传成功",
                    type: "success",
                    duration: 2000
                  });
                } else {
                  console.log(response3);
                }
              })
              .catch(error => {
                console.log(error);
                tothis.$notify({
                  title: "失败",
                  message: "请刷新页面后重试",
                  type: "error",
                  duration: 2000
                });
              });
          } else {
            console.error(response2);
          }
        })
        .catch(error => {
          console.error(error);
          tothis.$notify({
            title: "失败",
            message: "获取基础信息失败！",
            type: "error",
            duration: 2000
          });
        });
    }, //上传成功事件
    beforeUpload(file) {
      let tothis = this;

      if (file.type != "") {
        console.log("文件信息正常");
        if (file.type === "application/vnd.android.package-archive") {
          console.log("上传文件类型正确");
        } else {
          tothis.$notify({
            title: "失败",
            message: "只能上传apk文件",
            type: "error",
            duration: 2000
          });
          return false;
        }
      } else {
        console.log("文件类型为空，判断文件后缀");
        try {
          if (file.name.substring(file.name.indexOf(".") + 1) != "apk") {
            tothis.$notify({
              title: "失败",
              message: "只能上传apk文件",
              type: "error",
              duration: 2000
            });
            return false;
          }
        } catch (e) {
          tothis.$notify({
            title: "失败",
            message: "只能上传apk文件",
            type: "error",
            duration: 2000
          });
          return false;
        }
      }
    }, //上传前事件
    filepageChange(param) {
      this.fileTableLoading = true;
      this.filecurrentPage = param;
      let tothis = this;
      let param1 = {
        sdkguid: this.searchguid,
        limit: this.filepageSize,
        page: param
      };
      this.fileListTableData = [];
      getFileListMeth(param1)
        .then(response => {
          if (response.repcode === 3000) {
            this.getPublish();
            this.fileListTableData = response.data;
            this.filetotalPages = response.total;
          } else {
            console.error(response);
          }
          tothis.fileTableLoading = false;
        })
        .catch(error => {
          console.log(error);
          tothis.$notify({
            title: "失败",
            message: "获取文件上传记录列表失败",
            type: "error",
            duration: 2000
          });
          tothis.fileTableLoading = false;
        });
    }, //查看上传文件分页查找
    delAPKInfoMeth(param) {
      this.$confirm("确认删除？")
        .then(_ => {
          let tothis = this;
          console.log(param.apkguid);
          let param1 = {
            apkguid: param.apkguid
          };
          delAPKInfoMeth(param1)
            .then(response => {
              if (response.repcode === 3000) {
                this.filepageChange(this.filecurrentPage);
                tothis.$notify({
                  title: "成功",
                  message: "删除APK成功！",
                  type: "success",
                  duration: 2000
                });
              } else {
                tothis.$notify({
                  title: "失败",
                  message: "删除APK失败！",
                  type: "error",
                  duration: 2000
                });
              }
            })
            .catch(error => {
              console.error(error);
              tothis.$notify({
                title: "失败",
                message: "删除APK失败！",
                type: "error",
                duration: 2000
              });
            });
        })
        .catch(_ => {});
    }, //删除apk
    checkAPKDetail(param) {
      console.log(param);
      this.apkDetailVisible = true;
      this.apkDetailForm = param;
      this.apkDetailForm.impliedFeatures = JSON.parse(param.impliedFeatures);
      this.apkDetailForm.usesPermissions = JSON.parse(param.usesPermissions);
      this.apkDetailForm.features = JSON.parse(param.features);
      console.log(param);
    }, //查看apk详细信息
    showFileListVisible(param) {
      this.link =
        "http://system.tomatojoy.com/AppManager/yyliebiao?package_name=" +
        param.package_name +
        "&channel=" +
        param.channel_mark;
      console.log("apk管理点击事件", param);
      this.hidfileListTableData = [];
      this.fileListVisible = true;
      this.uploadChannelName = param.channel_mark;
      this.uploadPackageName = param.package_name;
      this.searchguid = param.app_guid;
      console.log("该应用的guid", this.searchguid);
      this.filepageChange(1);
    }, //展示文件上传列表
    searchTable() {
      this.pageChange(1);
    }, //搜索应用
    pageChange(page) {
      this.currentPage = page;
      let tothis = this;
      let param = {
        page: page,
        limit: this.pageSize,
        appName: this.secondary_game,
        channelName: this.secondary_channel,
        packageName: this.secondary_package
      };
      listAppInfo(param)
        .then(response => {
          if (response.repcode === 3000) {
            this.hidlist = response.data;
            this.list = response.data;
            console.log("配置表list", response.data);
            this.totalPages = response.total;
          } else {
            console.error(response);
            tothis.$notify({
              title: "失败",
              message: "请刷新页面后重试",
              type: "error",
              duration: 2000
            });
          }
        })
        .catch(error => {
          console.error(error);
          tothis.$notify({
            title: "失败",
            message: "请刷新页面后重试",
            type: "error",
            duration: 2000
          });
        });
    }, //分页切换
    listKeyStoreInfo() {
      let tothis = this;
      getcompanyInfoMeth()
        .then(response => {
          if (response.repcode === 3000) {
            this.keystoreList = response.data;
            console.log("keystore", this.keystoreList);
          }
          this.listLoading = false;
        })
        .catch(function(rs) {
          tothis.$notify({
            title: "失败",
            message: "获取keystore列表失败",
            type: "error",
            duration: 4000
          });
          tothis.listLoading = false;
          console.log(rs);
        });
    }, //获取keystore列表
    beforeUpload_icon(file) {
      this.dataObj.Authorization = "Bearer " + getToken();
    }, //icon上传前事件
    beforeUpload_splash(file) {
      this.dataObj.Authorization = "Bearer " + getToken();
    }, //splash上传前事件
    uploadSuccess_icon(response) {
      //icon上传至资源服务器后，返回原文件名和guid 再存储至数据库
      console.log(response.data);
      this.appInfo.icon = response.data.guid;
      this.imageUrl_icon = this.resPath + "?path=" + response.data.guid;
    }, //icon上传成功事件
    uploadSuccess_splash(response) {
      console.log(response.data);
      this.appInfo.splash = response.data.guid;
      this.imageUrl_splash = this.resPath + "?path=" + response.data.guid;
    }, //splash上传成功事件
    link_Check(val) {
      console.log("跳转参数", val);
      let routeData = this.$router.resolve({
        name: "peizhijilu",
        query: { app_guid: val.app_guid }
      });
      window.open(routeData.href, "_blank");
    }, //跳转方法
    routeWithParam() {
      let name = this.$route.query.package_name;
      if (typeof name != "undefined") {
        this.secondary_package = name;
      }
      let channel = this.$route.query.channel;
      if (typeof channel != "undefined") {
        this.secondary_channel = channel;
      }
    }, //带参跳转
    form_item_filter(domain) {
      let param = domain.param_name;
      let checked = this.dialog_secondary_checked;
      let names = param.split("-");
      if (names[0] === this.filter_form_name) {
        if (names.length < 3) {
          return true;
        } else {
          let flag = false;
          for (let i = 0; i < checked.length; i++) {
            if (names[1] === checked[i]) {
              flag = true;
            }
          }
          if (flag) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    }, //根据sdk名称展示对话框内sdk列表
    getchannelmarklist() {
      let list = [];
      let name = "";
      // if (this.sdk_template_name === 'base') {
      //   name = '屏蔽系统bugly统计分享互推广告锁屏广告支付广告'
      // }
      for (let i = 0; i < this.hidsdkTemplate.length; i++) {
        if (name.search(this.hidsdkTemplate[i]) != -1) {
          list.push(this.hidsdkTemplate[i]);
        }
      }
      for (let i = 0; i < this.hidsdkTemplate.length; i++) {
        if (
          this.hidsdkTemplate[i].name.search(this.sdk_template_name) != -1 ||
          this.hidsdkTemplate[i].mark.search(this.sdk_template_name) != -1
        ) {
          list.push(this.hidsdkTemplate[i]);
        }
      }
      this.sdkTemplate = list;
    }, //根据对话框内搜索框改变sdk多选框
    change_pagename(name) {
      this.sdkModelListName = name;
      for (let i = 0; i < this.sdkTemplate.length; i++) {
        if (name === this.sdkTemplate[i].mark) {
          this.sdkModelListVersion = this.sdkTemplate[i].sdk_version;
          break;
        }
      }
      this.dialog_secondary_visual = false;
      this.dialog_secondary_list = [];
      let visual;
      let list = this.dialog_secondary_list;
      for (let i = 0; i < this.appInfo.form.domains.length; i++) {
        let data = this.appInfo.form.domains[i].param_name;
        if (data.split("-").length > 2 && data.split("-")[0] === name) {
          visual = true;
          if (list.length === 0) {
            list.push(data.split("-")[1]);
          } else {
            let flag = true;
            for (let x = 0; x < list.length; x++) {
              if (list[x].search(data.split("-")[1]) != -1) {
                flag = false;
              }
            }
            if (flag) {
              list.push(data.split("-")[1]);
            }
          }
        }
      }
      this.dialog_secondary_visual = visual;
      this.dialog_secondary_list = list;
      this.filter_form_name = name; //联动对话框内标签页内容展示
    }, //根据点击的标签页名，渲染
    findSdkTemplate() {
      this.appInfo.form.domains = [];
      for (let i = 0; i < this.checkedSdkTemplate.length; i++) {
        for (let j = 0; j < this.sdkTemplatelibrary.length; j++) {
          if (
            this.sdkTemplatelibrary[j].keymark === this.checkedSdkTemplate[i]
          ) {
            if (this.appInfo.form.domains.length === 0) {
              this.appInfo.form.domains = this.sdkTemplatelibrary[j].keyform;
            } else {
              this.appInfo.form.domains = this.appInfo.form.domains.concat(
                this.sdkTemplatelibrary[j].keyform
              );
            }
          }
        }
      }
      this.filter_form_name = this.page_name;
      if (this.tag_name === "暂无" && this.checkedSdkTemplate.length > 0) {
        this.tag_name = this.checkedSdkTemplate[0];
      }
      this.change_pagename(this.tag_name);
    }, //sdk模版根据多选框变动
    handleUpdate(param) {
     
      
      this.resetForm();
      console.log("更新对象", param);
      this.appInfo.app_name = param.app_name;
      this.appInfo.channel_mark = param.channel_mark;
      this.appInfo.package_name = param.package_name;
      for (let i = 0; i < this.keystoreList.length; i++) {
        if (param.keystorePath === this.keystoreList[i].keystoreguid) {
          this.appInfo.keyStore = this.keystoreList[i];
          break;
        }
      }
      this.appInfo.outerVersion_online = param.outerVersion_online;
      this.appInfo.outerVersion_update = param.outerVersion_update;
      this.appInfo.innerVersion_online = param.innerVersion_online;
      this.appInfo.innerVersion_update = param.innerVersion_update;
      this.appInfo.icon = param.icon;
      this.appInfo.splash = param.splash;
      this.appInfo.note = param.note;
      this.appInfo.app_guid = param.app_guid;
      //展示icon 和 splash
      if (param.icon.indexOf("-") != -1) {
        this.imageUrl_icon = this.resPath + "?path=" + param.icon;
      } else {
        this.imageUrl_icon = "";
      }
      if (param.splash.indexOf("-") != -1) {
        this.imageUrl_splash = this.resPath + "?path=" + param.splash;
      } else {
        this.imageUrl_splash = "";
      }
      let listParam = {
        app_guid: param.app_guid
      };
      listAppConfigInfo(listParam)
        .then(response => {
          if (response.repcode === 3000) {
            let checked = response.checked;
            for (let i = 0; i < checked.length; i++) {
              this.sdk_type_checked.push(checked[i].sdk_type_name);
            }
            console.log(checked);
            console.log("sdk_type_checked", this.sdk_type_checked);
            let params = response.param;
            //将sdk参数为广告位的已经存入placement_value_list的清空
            this.placement_value_list=[]
            for (let i = 0; i < params.length; i++) {
              let paramValue = params[i].sdk_param_value;
              for (let j = 0; j < this.sdk_param_type_list.length; j++) {
                if (
                  params[i].sdk_param_type_guid ===
                  this.sdk_param_type_list[j].sdk_param_type_guid
                ) {
                  this.sdk_param_type_list[j].sdk_param_value = paramValue;
                  //将sdk参数为广告位的存入placement_value_list
                  if (this.sdk_param_type_list[j].sdk_param_type_type === "3") {
                    this.placement_value_list.push(
                      this.sdk_param_type_list[j].sdk_param_value
                    );
                  }
                }
              }
            }
               console.log('开始验证')
         console.log(this.tabName!='')
      if(this.tabName!=''){
        console.log(this.tabName+'+++++++++++++++++++++++++++++++++++++++')
        this.tabNameClick({
          label:this.tabName
        },'')
      }
          } else {
            console.error(response);
          }
        })
        .catch(error => {
          console.error(error);
          this.$notify({
            title: "失败",
            message: "请刷新页面后重试",
            type: "error",
            duration: 2000
          });
        });
      this.dialogFormVisible = true;
    }, //更新对话框展示
    compareVersion(param1, param2) {
      let arr1 = param1.split(".");
      let arr2 = param2.split(".");
      //将两个版本号拆成数字
      let minL = Math.min(arr1.length, arr2.length);
      let pos = 0; //当前比较位
      let diff = 0; //当前为位比较是否相等
      //逐个比较如果当前位相等则继续比较下一位
      while (pos < minL) {
        diff = parseInt(arr1[pos]) - parseInt(arr2[pos]);
        if (diff != 0) {
          break;
        }
        pos++;
      }
      if (diff === 0 && arr1.length > arr2.length) {
        diff = 1;
      }
      if (diff === 0 && arr1.length < arr2.length) {
        diff = -1;
      }
      return diff;
    }, //比较版本号
    checkPermission
  }
};
</script>
<style>
.el-checkbox.is-bordered + .el-checkbox.is-bordered {
  margin-left: 1px;
  margin-bottom: 5px;
}

#form-custom .el-form-item {
  margin-right: 250px;
}

.dia-input {
  width: 300px;
}

.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 300px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  border-bottom: #d3dce6 solid 1px;
}

.el-tabs__nav-scroll {
  width: 180px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>