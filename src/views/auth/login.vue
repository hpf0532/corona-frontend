<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">Corona Ansible Web System</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="邮箱"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="capcha" style="width:260px;display:inline-block">
        <span class="svg-container">
          <svg-icon icon-class="capcha" />
        </span>
        <span>
          <el-input
            ref="capcha"
            v-model="loginForm.capcha"
            placeholder="验证码"
            name="capcha"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </span>
      </el-form-item>
      <span style="float:right">
        <img style="margin-top:8px" :src="capchaImg" alt="" @click="fetchCapcha">
      </span>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:10px;" @click.native.prevent="handleLogin">登录</el-button>
      <div class="register">
        <router-link to="/register">注册用户</router-link>
      </div>

      <div class="forget-pass">
        <router-link to="/forget-password">忘记密码</router-link>
      </div>

      <div class="tips">
        <!-- <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span> -->
      </div>

    </el-form>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { getCapcha } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validateCapcha = (rule, value, callback) => {
      if (value.length != 4) {
        callback(new Error('请输入4位验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        capcha: '',
        capcha_id: ''
      },
      // capchaImg: "data:image/png;base64," + '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',
      capchaImg: '',

      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateEmail }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        capcha: [{ required: true, trigger: 'blur', validator: validateCapcha }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.fetchCapcha()
  },
  methods: {
    async fetchCapcha() {
      const data = await getCapcha()
      this.capchaImg = data.img
      this.loginForm.capcha_id = data.img_id
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((e) => {
            console.log(e)
            this.fetchCapcha()
            this.loginForm.capcha = ''
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

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
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
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

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
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
.register {
  color: gray;
  float: left;
}
.forget-pass {
  color: gray;
  float: left;
  margin-left: 20px;
}
</style>
