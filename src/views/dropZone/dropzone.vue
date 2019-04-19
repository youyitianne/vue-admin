<template>
  <div class="components-container">
    <div class="editor-container">
      <el-tooltip class="item" effect="light" placement="right" style="size: 50px">
        <div slot="content"
             style="font-size: 14px;font-family:'Microsoft YaHei UI';
                 border-radius:0 80px 0 0/0 60px 0 0;
                 line-height: 24px;
                 color: #8494A5;
                  background-color: white;border: 1px white">
          上传格式说明：<br/>
          <span class="ts-title">[360]:</span>360_XXXXXXX.csv<br/>
          <span class="ts-title">[Oppo]:</span>oppo_2018-10-27_2018-10-27.xlsx<br/>
          <span class="ts-title">[Vivo]:</span>vivo_广告位报告_2018-10-22_2018-10-22.xls<br/>
          <span class="ts-title">[广点通]:</span>广点通.csv 或者广点通_report.csv <br/>
          <span class="ts-title">[联想]:</span>联想_保护气球_插屏_XXXXXXXX.xlsx<br/>
          <span class="ts-title">[魅族]:</span>魅族_2018_XXXXXXXXXXXXXXX.xls<br/>
          <span class="ts-title">[三星]:</span>三星_保护气球_插屏_XXXXXXXXXXXX.csv<br/>
          <span class="ts-title">[小米]:</span>小米.csv 或者小米_XXXXXXXXX.csv<br/>
          <span class="ts-title">[友盟]:</span>友盟_面条滑溜溜_渠道(meizu)_日趋势变化_20181022_20181027.csv<br/>
          <span class="ts-title">[友盟1]:</span>友盟1_面条滑溜溜_渠道(meizu)_日趋势变化_20181022_20181027.csv<br/>
          <span class="ts-title">[友盟3]:</span>友盟3.xlsx（在页面上下载之后，检查表内应用名和渠道名是否正确）<br/>
          <span class="ts-title">[九游]:</span>九游.csv 或者九游_XXXXXXX.csv<br/>
          <span class="ts-title">[九游1]:</span>九游1.xls 或者九游1_XXXXXXX.xls<br/>
          <span class="ts-title">[头条]:</span>头条.xlsx <br/>
          <span class="ts-title">[移信]:</span>移信.xlsx<br/>
          <span style="font-size: 16px;font-weight: bolder">[特别注意]:<br/></span>
          1.头条内的代码位名称中的所有Banner手动替换为横幅<br/>
          2.广点通需要另存为成.csv格式再上传，如果第三列为（媒体）则全部删除
        </div>
        <el-button icon="el-icon-question" style="padding: 0px;border: none;background-color: #FFFF;margin-top: 20px">
          广告与用户数据上传说明
        </el-button>
      </el-tooltip>
      <el-button v-model="checked1" border style="margin-bottom: 20px" @click="dialogMessageVisible=true" type="info"
                 size="mini">数据上传具体说明
      </el-button>
      <el-upload
        action="http://192.168.1.101:8083/fileupload"
        accept='.csv,.xls,.xlsx'
        :headers="dataObj"
        drag
        :multiple="true"
        :on-success="dropzoneS"
        :before-upload="beforeUpload"
        style="width:360px">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">统计数据上传</div>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <div class="uploadresponse" v-html="value"
         style="padding: 30px;font-family: 微软雅黑;line-height: 22px;font-size: 15px"></div>


    <div class="editor-container">
      <el-tooltip class="item" effect="light" placement="right" style="size: 50px">
        <div slot="content"
             style="font-size: 14px;font-family:'Microsoft YaHei UI';
                 border-radius:0 80px 0 0/0 60px 0 0;
                 line-height: 24px;
                 color: #8494A5;
                  background-color: white;border: 1px white">
          说明：<br/>
          <span class="ts-title">[华为渠道]:</span>华为.xlsx<br/>
        </div>
        <el-button icon="el-icon-question" style="padding: 0px;border: none;background-color: #FFFF">计费数据上传说明
        </el-button>
      </el-tooltip>
      <el-upload
        action="http://192.168.1.101:8086/fileupload"
        style="width:360px"
        accept='.csv,.xls,.xlsx'
        :headers="dataObj"
        drag
        :multiple="true"
        :on-success="dropzoneS1"
        :before-upload="beforeUpload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">支付数据上传</div>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <div class="uploadresponse1" v-html="value1"
         style="padding: 30px;font-family: 微软雅黑;line-height: 22px;font-size: 15px"></div>

    <el-dialog :visible.sync="dialogMessageVisible" width="60%">
      <h1 style="margin-left:30px ">数据上传具体说明</h1>
      <div style="background-color:#d3dce6;padding: 20px;border-radius: 10px;border-bottom: #001528 solid 1px">
        <span style="font-size: x-large">
          1.上传前首先确保上传数据的项目已被创建（否贼上传的数据无法被录入）<br>
          2.该项目各渠道应用名已添加，应用名添加时，选择对应的渠道（否贼上传的数据无法被录入）
        </span><br>
      </div>
      <div style="background-color:#d3dce6;padding: 20px;border-radius: 10px;border-bottom: #001528 solid 1px">
        <span>1.添加项目</span><br>
        <img src="@/assets/message/添加项目.gif" style="margin-left: 30px"><br>
        <span>2.添加应用</span><br>
        <img src="@/assets/message/添加应用.gif" style="margin-left: 30px"><br>
      </div>

    </el-dialog>

  </div>
</template>

<script>
  import Dropzone from '@/components/Dropzone'
  import {getToken} from '@/utils/auth'

  export default {
    name: 'DropzoneDemo',
    components: {Dropzone},
    data() {
      return {
        dialogMessageVisible: false,
        dataObj: {'Authorization': ''},
        token: {
          Authorization: 'Bear ' + getToken()
        },
        root: "els",
        version: "1.0.0",
        value: "",
        value1: "",
      }
    },
    methods: {
      beforeUpload(file) {
        let maxsize = 8 * 1024 * 1024
        if (file.size > maxsize) {
          this.$message.error('上传失败，文件超过8000KB');
          return false
        }
        console.log('Bear ' + getToken())
        this.dataObj.Authorization = 'Bearer ' + getToken()
      },
      dropzoneS(response) {
        console.log(response)
        let data = response.data;
        this.value = data + "<br>" + this.value;
        this.$message({message: data, type: 'success'})
      },
      dropzoneS1(response) {
        let data = response.data;
        this.value1 = data + "<br>" + this.value1;
        this.$message({message: data, type: 'success'})
      },
      dropzoneR(response) {
        this.$message({message: '移除成功~', type: 'success'})
      },
      dropzoneR1(response) {
        this.$message({message: '移除成功~', type: 'success'})
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ts-title {
    font-size: 15px;
    font-weight: bolder
  }
</style>


