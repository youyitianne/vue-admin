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
          <span class="ts-title">[广点通]:</span>广点通.csv    或者广点通_report.csv  <br/>
          <span class="ts-title">[联想]:</span>联想_保护气球_插屏_XXXXXXXX.xlsx<br/>
          <span class="ts-title">[魅族]:</span>魅族_2018_XXXXXXXXXXXXXXX.xls<br/>
          <span class="ts-title">[三星]:</span>三星_保护气球_插屏_XXXXXXXXXXXX.csv<br/>
          <span class="ts-title">[小米]:</span>小米.csv     或者小米_XXXXXXXXX.csv<br/>
          <span class="ts-title">[友盟]:</span>友盟_面条滑溜溜_渠道(meizu)_日趋势变化_20181022_20181027.csv<br/>
          <span class="ts-title">[友盟1]:</span>友盟1_面条滑溜溜_渠道(meizu)_日趋势变化_20181022_20181027.csv<br/>
          <span class="ts-title">[九游]:</span>九游.csv     或者九游_XXXXXXX.csv<br/>
          <span class="ts-title">[九游1]:</span>九游1.xls     或者九游1_XXXXXXX.xls<br/>
          <span class="ts-title">[头条]:</span>头条.xlsx <br/>
          <span class="ts-title">[移信]:</span>移信.xlsx<br/>
          <span style="font-size: 16px;font-weight: bolder">[特别注意]:<br/></span>
          1.头条内的代码位名称中的所有Banner手动替换为横幅<br/>
          2.广点通需要另存为成.csv格式再上传，如果第三列为（媒体）则全部删除
        </div>
        <el-button icon="el-icon-question" style="padding: 0px;border: none;background-color: #FFFF;margin-top: 20px">广告与用户数据上传说明</el-button>
      </el-tooltip>
      <dropzone id="myVueDropzone"
                defaultMsg="统计数据"
                url="http://192.168.1.144:8083/fileupload"
                @dropzone-removedFile="dropzoneR"
                @dropzone-success="dropzoneS"
                style="margin: 0 auto;margin-top: 30px"/>
    </div>
    <div class="uploadresponse" v-html="value" style="padding: 30px;font-family: 微软雅黑;line-height: 22px;font-size: 15px" ></div>


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
        <el-button icon="el-icon-question" style="padding: 0px;border: none;background-color: #FFFF">计费数据上传说明</el-button>
      </el-tooltip>
      <dropzone id="myVueDropzone1"
                defaultMsg="支付数据"
                url="http://192.168.1.144:8086/fileupload"
                @dropzone-removedFile="dropzoneR1"
                @dropzone-success="dropzoneS1"
                style="margin: 0 auto;margin-top: 30px"/>
    </div>
    <div class="uploadresponse1" v-html="value1" style="padding: 30px;font-family: 微软雅黑;line-height: 22px;font-size: 15px" ></div>
  </div>
</template>

<script>
import Dropzone from '@/components/Dropzone'

export default {
  name: 'DropzoneDemo',
  components: { Dropzone },
  data(){
    return {
      value:"",
      value1:"",
    }
  },
  methods: {
    dropzoneS(response) {
      let data=response.xhr.responseText.substring(15,response.xhr.responseText.lastIndexOf("~")+1);
      this.value=data+"<br>"+this.value;
      this.$message({ message: data, type: 'success' })
    },
    dropzoneS1(response) {
      let data=response.xhr.responseText.substring(15,response.xhr.responseText.lastIndexOf("~")+1);
      this.value1=data+"<br>"+this.value1;
      this.$message({ message: data, type: 'success' })
    },
    dropzoneR(response) {
      this.$message({ message: '移除成功~', type: 'success' })
    },
    dropzoneR1(response) {
      this.$message({ message: '移除成功~', type: 'success' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ts-title{
    font-size: 15px;
    font-weight: bolder
    }
</style>


