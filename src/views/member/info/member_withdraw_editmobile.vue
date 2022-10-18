<template>
  <div id="alterAddress">
    <c-title :hide="false" :text="action_name" :goback="false"></c-title>
    <div style="height: 10px;"></div>
     <van-field
      class="inp-field"
      label="手机号码"
      v-model="form.mobile"
      placeholder="请输入手机号码"
      center
      clearable
    />

     <van-field
      label="图形验证码"
      placeholder="请输入图形验证码"
      v-model="form.captcha"
      v-if="imgcode"
      center
      clearable
    >
     <div slot="button">
        <img
          style="width: 100%; height: 2.5rem; z-index: 999;"
          :src="imgcode"
          @click="getimgdata()"
          v-if="imgcode"
        />
      </div>
     </van-field>

      <van-field
        label="验证码"
        center
        clearable
        placeholder="请输入验证码"
        v-model="form.code"
      >
        <template #button>
          <van-button size="small" type="primary" @click.native="VerificationCode"  v-show="!cationCode" color="#ffb400">获取短信验证码</van-button>
          <van-button size="small" :disabled="cationCode" type="primary" v-show="cationCode" color="#999">验证码已发送</van-button>
        </template>
      </van-field>

    <div class="maleall">
      <div class="address_addnav" :style="{width: fun.getPhoneEnv() == 3 ? '375px': ''}" @click="alterAction">
        <i class="fa fa-pencil-square-o"></i>
        <span>{{ action_name }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import member_withdraw_editmobile_controller from "./member_withdraw_editmobile_controller";
export default member_withdraw_editmobile_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#alterAddress #code {
  background: #ccc;
  padding: 0.1875rem 0.3125rem;
  border-radius: 0.1875rem;
}

.address_addnav {
  width: 100%;
  padding: 0 3% 0 6% !important;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: #f15353 !important;
  color: #fff !important;
  text-align: center;
  height: 2.75rem !important;
  line-height: 2.75rem !important;
}

.popup-con {
  width: 100%;
}

.mint-field-other span {
  background: #ccc;
  color: #fff;
  line-height: 3rem;
  height: 3rem;
  display: block;
  padding: 0 0.625rem;
}

#alterAddress .mint-field .mint-cell-title {
  text-align: left;
}

.address_addnav i {
  color: #fff;
  font-size: 22px;
  position: absolute;
  top: 50%;
  height: 1.125rem;
  line-height: 1.125rem;
  margin-left: -2.125rem;
  margin-top: -0.5625rem;
}

.maleall {
  background: #fff;
  text-align: left;
}

#alterAddress .males {
  line-height: 3.125rem;
  display: flex;
  border-top: 0.0625rem solid #d9d9d9;
  margin-left: 0.625rem;
}

.maleall span {
  font-size: 16px;
  vertical-align: middle;
  width: 6.5625rem;
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
}

#address {
  flex: 1;
  line-height: 3.125rem;

  .mint-button--default {
    line-height: 3.125rem;
    text-align: left;
    font-size: 16px;
  }
}

.normal {
  background-color: #ffb400;
  color: #fff;
  height: 30px;
  box-shadow: none;
  font-size: 12px;
  border-radius: 2px;
  border: none;
  padding: 0 12px;
}

.Default {
  background-color: #ccc;
  color: #f0f0f0;
  height: 30px;
  box-shadow: none;
  font-size: 12px;
  border-radius: 2px;
  border: none;
  padding: 0 12px;
}

/deep/.van-cell {
  padding: 10px;

  /deep/.van-field__label {
    flex: none;
    white-space: nowrap;
    width: 5rem;
    margin-right: 20px;
    color: #333;
    text-align: left;
    font-size: 16px;
  }

  input::placeholder {
    color: #555;
    font-size: 16px;
  }
}
</style>
