<template>
  <div class="login-container">
    <el-form ref="forgetForm" :model="forgetForm" :rules="forgetRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">忘记密码</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input
          ref="email"
          v-model="forgetForm.email"
          placeholder="邮箱"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="capcha" style="width:260px;display:inline-block">
        <span class="svg-container">
          <svg-icon icon-class="capcha" />
        </span>
        <span>
        <el-input
          ref="capcha"
          v-model="forgetForm.capcha"
          placeholder="验证码"
          name="capcha"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
        </span>
      </el-form-item>
      <span style="float:right">
        <img @click="fetchCapcha" style="margin-top:8px" :src="capchaImg" alt="">
      </span>


      <el-button :loading="loading" type="primary" :disabled="!canClick" style="width:100%;margin-bottom:10px;" @click.native.prevent="handlerForgetPass">{{ content }}</el-button>

      <div class="tips">
        <!-- <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span> -->
      </div>

    </el-form>
  </div>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { forgetPassword, getCapcha } from '@/api/user'

export default {
  name: 'ForgetPass',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'))
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
      forgetForm: {
        email: '',
        capcha:'',
        capcha_id: ''
      },
      capchaImg: '',
      forgetRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        capcha: [{ required: true, trigger: 'blur', validator: validateCapcha }],
      },
      loading: false,
      redirect: undefined,

      content: '发送重置密码邮件',
      totalTime: 60,
      canClick: true  //添加canClick
    }
  },
  created() {
    this.fetchCapcha()
  },
  methods: {
    async fetchCapcha(){
      const data = await getCapcha()
      this.capchaImg = data.img
      this.forgetForm.capcha_id = data.img_id
    },
    handlerForgetPass() {
      this.$refs.forgetForm.validate(valid => {
        if (valid) {
            if (!this.canClick) return   //改动的是这两行代码
                this.canClick = false
                this.content = this.totalTime + 's后重新发送'
                let clock = window.setInterval(() => {
                  this.totalTime--
                  this.content = this.totalTime + 's后重新发送'
                  if (this.totalTime < 0) {
                    window.clearInterval(clock)
                    this.content = '重新发送邮件'
                    this.totalTime = 60
                    this.canClick = true   //这里重新开启
                  }
                },1000)
          this.loading = true
          forgetPassword(this.forgetForm).then(response => {
            const data = response
            this.$message({
                showClose: true,
                message: data.message,
                type: 'success'
            })
            // this.$router.push({path: '/login'})
            // console.log(data)
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
    },
    // handleLogin() {
    //   this.$refs.forgetForm.validate(valid => {
    //     if (valid) {
    //       this.loading = true

    //     } else {
    //     }
    //   }
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
