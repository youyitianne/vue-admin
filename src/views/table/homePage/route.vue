<template>
  <div class="dashboard-container">
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {updatePassword} from '@/api/dashboard'
  import checkPermission from '@/utils/permission' // 权限判断函数
  export default {
    created() {
      this.routerHandler()
    },
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
        } else if (value.length < 5) {
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
      checkPermission,
      routerHandler() {
        if (this.checkPermission(['planner'])) {
          this.$router.push({path: '/homepage/addata'})
        } else if (this.checkPermission(['admin', 'director'])) {
          this.$router.push({path: '/homepage/earned'})
        } else {
          this.$router.push({path: '/homepage/productdata'})
        }
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
