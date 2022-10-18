<template>
  <div id="bind_bank">
    <c-title :hide="false" text="验证手机号"></c-title>
    <div class="content">
      <h1 style="margin-bottom: 1rem; text-align: left; padding-left: 0.75rem;">输入验证码</h1>
      <div style="padding-left: 0.75rem; text-align: left; color: #666; font-size: 12px;">
        已向手机{{ payer_phone.substr(0, 3) + '****' + payer_phone.substr(7) }}发送短信
      </div>
      <div style="font-size: 12px; color: #666; margin-top: 1rem; padding-left: 0.75rem; text-align: left;">
        绑定银行卡需要短信确认
      </div>
      <ul>
        <li class="second">
          <div>
            <input type="text" v-model.trim="sms_code" placeholder="请输入验证码" style="margin-left: 0;" />
          </div>
          <van-button type="default" :disabled="btnTag" :color="btnBg" size="small" @click.native="verificationCode">{{
            btnText
          }}</van-button>
        </li>
      </ul>
      <div class="bank-btn" @click="confirm">
        确认
      </div>
    </div>
  </div>
</template>
<script>
import bind_bank_controller from './bind_bank_controller';
export default bind_bank_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#bind_bank {
  height: 100vh;
  background-color: #fff;

  .content {
    padding-top: 1rem;

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
}
</style>
