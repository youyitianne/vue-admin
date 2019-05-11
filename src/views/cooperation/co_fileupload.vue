<template>
  <div class="components-container">
    <div class="editor-container" style="margin-left: 30px">
      <el-tooltip class="item" effect="light" placement="right" style="size: 50px">
        <div slot="content"
             style="font-size: 14px;font-family:'Microsoft YaHei UI';
                 border-radius:0 80px 0 0/0 60px 0 0;
                 line-height: 24px;
                 color: #8494A5;
                  background-color: white;border: 1px white">
          上传格式说明：<br/>
          1.头条内的代码位名称中的所有Banner手动替换为横幅<br/>
          2.广点通需要另存为成.csv格式再上传，如果第三列为（媒体）则全部删除
        </div>
        <el-button icon="el-icon-question" style="padding: 0px;border: none;background-color: #FFFF;margin-top: 20px">
          广告与用户数据上传说明
        </el-button>
      </el-tooltip>
      <el-upload
        action="http://192.168.1.144:8092/fileupload"
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
      dropzoneR(response) {
        this.$message({message: '移除成功~', type: 'success'})
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ts-title {
    font-size: 15px;
    font-weight: bolder
  }
</style>


