<template>
  <div id="set_password" ref="set_password">
    <c-title :hide="false" text="密码设置"></c-title>
    <div class="content">
        <ul>
          <li>
            <span>手机号码</span>
            <input type="text" placeholder="请输入手机号码" v-model.trim="form.mobile">
          </li>
          <li v-if='imgcode'>
              <input type="text" placeholder="请输入右侧图形验证码" v-model.trim="form.captcha">
              <div>
                <img
                  style="width: 100%; height: 2.5rem; z-index: 999;"
                  :src="imgcode"
                  @click="getimgdata()"
                  v-if="imgcode"
                />
              </div>
          </li>
          <li class="second">
              <div>
                <input type="text" v-model.trim="form.code" placeholder="请输入验证码" style="margin-left: 0;">
              </div>
              <van-button type="default" :disabled = "btnTag"   :color="btnBg" size="small" @click.native="verificationCode">{{btnText}}</van-button>
          </li>
          <li>
              <span>设置密码</span>
              <input type="password" placeholder="请输入密码" v-model.trim="form.password">
          </li>
          <li>
              <span>确认密码</span>
              <input type="password" placeholder="请输入密码" v-model.trim="form.confirm_password">
          </li>
        </ul>
      <div class="btn" @click="confirm">
        确定
      </div>
    </div>
  </div>
</template>

<script>
import set_password_controller from "./set_password_controller";

export default set_password_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#set_password {
  background-color: #fff;
  height: 100vh;

  .content {
    padding: 0 0.75rem;
    background-color: #fff;

    ul {
      li {
        padding: 1.125rem 0.75rem;
        border-bottom: solid 1px #f1f1f1;
        display: flex;
        align-items: center;

        input {
          border: none;
          outline: none;
          font-size: 12px;
          flex: 1;
          margin-left: 0.75rem;
        }
      }

      .second {
        justify-content: space-between;

        .getCode {
          color: #ff2c29;
          font-size: 12px;
        }
      }
    }

    .btn {
      width: 18.4375rem;
      height: 2.625rem;
      background-color: #ff2c29;
      border-radius: 1.3125rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #fff;
      margin: 0 auto;
      margin-top: 3.75rem;
    }
  }
}
</style>
