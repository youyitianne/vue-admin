<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
             label-position="left">
      <h3 class="title">登录</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="帐号:"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="密码:"
          @keyup.enter.native="handleLogin"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <!--<div class="tips">-->
      <!--<span style="margin-right:20px;">username: admin</span>-->
      <!--<span> password: admin</span>-->
      <!--</div>-->
      <div style="font-size: 10px;color: lightslategrey;margin-top: -15px;margin-left: 15px">若忘记密码请联系管理员.</div>
    </el-form>
    <remote-js src="http://pv.sohu.com/cityjson?ie=utf-8"></remote-js>
  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate'
  import {setMyOutIp, setMyInnerIp} from '@/utils/ip'
  import checkPermission from '@/utils/permission' // 权限判断函数


  export default {
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
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error('请输入用户名'))
        } else {
          callback()
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('请输入正确的密码'))
        } else {
          callback()
        }
      }
      return {
        innerip: '',
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}]
        },
        loading: false,
        pwdType: 'password',
        redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    mounted() {
    },
    methods: {
      checkPermission,
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleLogin() {
        // try {
        //   let outip = returnCitySN["cip"]
        //   setMyOutIp(outip)
        // } catch (e) {
        //   setMyOutIp('0.0.0.0')
        // }
        // let innerip = this.innerip
        // if (innerip.length != 0) {
        //   setMyInnerIp(innerip)
        // } else {
        //   setMyInnerIp('0.0.0.0')
        // }
        //登录按钮
        let tothis = this
        console.log('开始验证+++++++++++++')
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            console.log('信息验证完成+++++++++++++')
            this.loading = true
            console.log('调用登录方法+++++++++++++')
            console.log(this.loginForm)
            this.$store.dispatch('Login', this.loginForm).then(() => {
              console.log('登录成功+++++++++++++')
              this.loading = false
              this.$router.push({path: '/homepage/route'})
              //this.$router.push({ path: this.redirect || '/example/table' })
            }).catch(err => {
              console.log('登录失败+++++++++++++',err)
              console.log(err)
              tothis.$notify({
                title: '失败',
                message: '登录失败',
                type: 'error',
                duration: 2000
              })
              this.loading = false
            })
          } else {
            console.log('信息验证失败+++++++++++++')
            return false
          }
        })
      },
      getInnerIp() {
        let tothis = this
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
            tothis.innerip = displayAddrs[0]
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
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  [v-cloak] {
    display: none;

  }

  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
