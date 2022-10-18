
<template>
  <div id="remove-bank-wrap">
    <c-title :hide="false" text="解绑银行卡"></c-title>
    <div class="content">
      <h1 style="margin-bottom: 1rem; text-align: left; padding-left: 0.75rem;">输入验证码</h1>
      <div style="padding-left: 0.75rem; text-align: left; color: #666; font-size: 12px;">
        已向手机{{ member_phone.substr(0, 3) + '****' + member_phone.substr(7) }}发送短信
      </div>
      <div style="font-size: 12px; color: #666; margin-top: 1rem; padding-left: 0.75rem; text-align: left;">
        解绑银行卡需要短信确认
      </div>
      <ul>

        <li class="second" v-if="isOpenCaptcha == 1">
          <input placeholder="请填写右侧图形验证码" v-model="captcha" style="margin-left: 0;"/>
          <img style="width: 7.5rem; height: 2.5rem; margin-left: 0;" :src="imgCodeLink" @click="getCaptchaImg" v-if="imgCodeLink"/>
        </li>
        <li class="second">
          <div>
            <input type="text" v-model.trim="v2_code" placeholder="请输入短信验证码" style="margin-left: 0;" />
          </div>
          <span class="getcodeClass" @click="VerificationCode" v-show="!count">获取验证码</span>
          <span class="getcodeClass" v-show="count">{{ count }}秒后重新获取</span>
        </li>
      </ul>
      <div class="bank-btn" @click="confirmRemoveBank">确认解绑</div>
    </div>
  </div>
</template>

<script>
import member_remove_bank_controller from "./member_remove_bank_controller";
export default member_remove_bank_controller;
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#remove-bank-wrap {
  height: 100vh;
  background-color: #fff;
  .content {
    padding-top: 1rem;
  }
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
  .getcodeClass {
    display: inline-block;
    height: 1.75rem;
    line-height: 1.75rem;
    background-color: #f54242;
    color: #fff;
    border-radius: 0.125rem;
    padding: 0 0.625rem;
    font-size: 0.75rem;
  }

  .bank-btn {
    width: 18.75rem;
    height: 2.875rem;
    background-color: #ff2c29;
    border-radius: 0.5625rem;
    font-size: 16px;
    margin: 0 auto;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
  }
}
</style>