<template>
  <div class="components-container">
    <div class="editor-container">
      <dropzone id="myVueDropzone"
                url="http://192.168.1.144:8083/fileupload"
                @dropzone-removedFile="dropzoneR"
                @dropzone-success="dropzoneS"
                style="margin: 0 auto;margin-top: 30px"/>
    </div>
    <div class="uploadresponse" v-html="value" style="padding: 30px;font-family: 微软雅黑;line-height: 22px;font-size: 15px" ></div>
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
    }
  },
  methods: {
    dropzoneS(response) {
      let data=response.xhr.responseText.substring(15,response.xhr.responseText.lastIndexOf("~")+1);
      this.value=data+"<br>"+this.value;
      this.$message({ message: data, type: 'success' })
    },
    dropzoneR(response) {
      this.$message({ message: '移除成功~', type: 'success' })
    }
  }
}
</script>


