<template>
  <div class="dashboard-container">
    <remote-js src="http://pv.sohu.com/cityjson?ie=utf-8"></remote-js>
    <el-tabs style="height: 200px;">
      <el-tab-pane label="个人信息">
        <div class="passwod">名字:{{ name }}</div>
        <div class="passwod">角色:<span v-for="role in roles" :key="role">{{ role }} </span></div>
      </el-tab-pane>
      <el-tab-pane label="更换密码">
        <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="passwod">
          <el-form-item label="账号" prop="accout">
            <el-input style="width: 250px" disabled :value="name" id="account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input :type="pwdType" v-model="ruleForm2.pass" autocomplete="off" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input :type="pwdType" v-model="ruleForm2.checkPass" autocomplete="off" style="width: 250px"></el-input>
            <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
          </el-form-item>
          <el-form-item>
            <el-button round
                       v-loading.fullscreen.lock="pageLoading"
                       element-loading-text="请等待。。。。"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.8)"
                       @click="test('ruleForm2')">确认更改
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="联系我">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {updatePassword} from '@/api/dashboard'

  export default {
    watch: {
      password_two: {
        handler: function () {
        },
      }
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else if (value.length <5){
          callback(new Error('密码长度需要大于5位!'));
        } else {
          callback();
        }
      };
      return {
        pwdType: 'password',
        rules2: {
          pass: [
            {validator: validatePass, trigger: 'blur'}
          ],
          checkPass: [
            {validator: validatePass2, trigger: 'blur'}
          ],
        },
        ruleForm2: {
          pass: '',
          checkPass: '',
        },
        pageLoading: false,
      }
    },
    components: {
      'remote-js': {
        render(createElement) {
          return createElement('script', {attrs: {type: 'text/javascript', src: this.src}});
        },
        props: {
          src: {type: String, required: true},
        },
      },
    },
    name: 'Dashboard',
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ])
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      test(formName) {
        let account=(document.getElementById("account").value)
        let tothis = this
        this.pageLoading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确定更换密码为：' + tothis.ruleForm2.pass + '？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let param = {
                account: account,
                password: tothis.ruleForm2.pass
              }
              tothis.pageLoading = false
              updatePassword(param).then(response=>{
                tothis.$message({
                  message: '修改成功!',
                  type: 'success'
                });
                //回到登录页面,登出操作
                this.logout()
                tothis.pageLoading = false
              }).catch(err=>{
                tothis.$message.error('修改失败，请检查网络~');
                tothis.pageLoading = false
              })
            }).catch(() => {
              tothis.pageLoading = false
            });
          } else {
            tothis.pageLoading = false
            return false;
          }
        })
      },
      getInnerIp() {
        let RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
        if (RTCPeerConnection) (function () {
          let rtc = new RTCPeerConnection({iceServers: []});
          if (1 || window.mozRTCPeerConnection) {
            rtc.createDataChannel('', {reliable: false});
          }
          ;
          rtc.onicecandidate = function (evt) {
            if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
          };
          rtc.createOffer(function (offerDesc) {
            grepSDP(offerDesc.sdp);
            rtc.setLocalDescription(offerDesc);
          }, function (e) {
            console.warn("offer failed", e);
          });
          let addrs = Object.create(null);
          addrs["0.0.0.0"] = false;

          function updateDisplay(newAddr) {
            if (newAddr in addrs) return;
            else addrs[newAddr] = true;
            let displayAddrs = Object.keys(addrs).filter(function (k) {
              return addrs[k];
            });
            for (let i = 0; i < displayAddrs.length; i++) {
              if (displayAddrs[i].length > 16) {
                displayAddrs.splice(i, 1);
                i--;
              }
            }
            return displayAddrs[0];
            //console.log(displayAddrs[0]);      //打印出内网ip
          }

          function grepSDP(sdp) {
            let hosts = [];
            sdp.split('\r\n').forEach(function (line, index, arr) {
              if (~line.indexOf("a=candidate")) {
                let parts = line.split(' '),
                  addr = parts[4],
                  type = parts[7];
                if (type === 'host') updateDisplay(addr);
              } else if (~line.indexOf("c=")) {
                let parts = line.split(' '),
                  addr = parts[2];
                updateDisplay(addr);
              }
            });
          }
        })();
        else {
          console.log("请使用主流浏览器：chrome,firefox,opera,safari");
        }
      },
      getip() {
        let ip = returnCitySN["cip"];
        console.log(ip)
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/login' })
          location.reload() // 为了重新实例化vue-router对象 避免bug
        }).catch(err=>{
          console.log("登出失败："+err)
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: black;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .passwod {
    margin: 10px;
    font: 16px Medium;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-weight: bolder;
  }
</style>
