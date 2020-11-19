<template>
  <div class="login-container">
    <el-form ref="resetPassForm" :model="resetPassForm" :rules="resetPassRules" class="register-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">密码重置</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input
          ref="email"
          v-model="resetPassForm.email"
          placeholder="邮箱"
          name="email"
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
          v-model="resetPassForm.password"
          :type="passwordType"
          placeholder="密码"
          name="new_password"
          tabindex="2"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password2">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password2"
          v-model="resetPassForm.password2"
          :type="passwordType"
          placeholder="确认密码"
          name="password2"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />

      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleResetPass">提交</el-button>

      <div class="tips">
        <!-- <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span> -->
      </div>

    </el-form>
  </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
import { validEmail } from '@/utils/validate'
import { resetPassword } from '@/api/user'

export default {
  name: 'ResetPassword',
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
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetPassForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      resetPassForm: {
        email: '',
        password: '',
        password2: ''
      },
      resetPassRules: {
        email: [
          { required: true, trigger: 'blur', validator: validateEmail }

        ],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        password2: [{ required: true, trigger: 'blur', validator: validatePass2 }]

      },
      loading: false,
      passwordType: 'password',
      redirect: '/login'
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
  methods: {

    handleResetPass() {
      const query = this.$route.query
      this.params = this.$qs.parse(query)
      this.token = this.params.token
      if (!this.token) {
        this.$message({
          showClose: true,
          message: '密码重置失败，token缺失',
          type: 'error'
        })
        this.$router.push({ path: '/forget-password' })
        return
      }
      this.$refs.resetPassForm.validate(valid => {
        if (valid) {
          this.loading = true
          const { email, password } = this.resetPassForm
          resetPassword(this.token, { 'email': email, 'new_password': password }).then(response => {
            const data = response
            // console.log(data)
            if (data.code === 20004) {
              this.$message({
                showClose: true,
                message: data.message,
                type: 'success'
              })
              this.$router.push({ path: this.redirect || '/login' })
            } else if (data.code === 50002) {
              this.$message({
                showClose: true,
                message: data.message,
                type: 'error'
              })
              this.$router.push({ path: '/forget-password' })
            }
            this.loading = false
          }).catch((e) => {
            console.log(e)
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

  .register-form {
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
</style>
