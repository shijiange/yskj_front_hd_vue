<template>
  <div id="info">
    <c-title :hide="false" text='设置支付密码'></c-title>
    <van-field
      @click.native="showPwdKeyboard"
      disabled
      v-model="pwd"
      center
      :type="setpassword"
      label="支付密码："
      placeholder="请输入支付密码"
      :border="false"
    >
      <template #button>
        <i class="iconfont icon-onlineCar_f eyes" @click.stop="SetPwdClick()" v-if="!visibleSet"
           style="color: #333;"></i>
        <i class="iconfont icon-onlineCar_g eyes" @click.stop="SetPwdClick()" v-if="visibleSet"></i>
      </template>
    </van-field>

    <van-field
      @click.native="showRePwdKeyboard"
      disabled
      v-model="rePwd"
      center
      :type="surepassword"
      label="确认密码："
      placeholder="请输入确认密码"
    >
      <template #button>
        <i class="iconfont icon-onlineCar_f eyes" @click.stop="surePwdClick()" v-if="!visibleSure"
           style="color: #333;"></i>
        <i class="iconfont icon-onlineCar_g eyes" @click.stop="surePwdClick()" v-if="visibleSure"></i>
      </template>
    </van-field>

    <div class="van-button-group">
      <van-button style="height: 40px;" color="#ef4f4f" size="large" @click.native="setPwd" type="danger">确认
      </van-button>
    </div>

    <div style="height: 0.625rem;"></div>
    <pay-keyboard :payKeyboardShow.sync="isPwdShowKeyboard" @complete="onInput1"></pay-keyboard>
    <pay-keyboard :payKeyboardShow.sync="isRePwdShowKeyboard" @complete="onInput2"></pay-keyboard>
    <!-- <van-popup v-model="isPwdShowKeyboard" position="bottom">
      <div class="ispaskey">
        <van-password-input
          :value="payarr1"
          :focused="isPwdShowKeyboard"
          @focus="isPwdShowKeyboard = true"
        />
        <van-number-keyboard
          title="安全键盘"
          :show="true"
          v-model="payarr1"
          @blur="isPwdShowKeyboard = false"
          @input="onInput1"
          @delete="onDelete1"
        />
      </div>

    </van-popup>
    <van-popup v-model="isRePwdShowKeyboard" position="bottom">
      <div class="ispaskey">
        <van-password-input
          :value="payarr2"
          :focused="isRePwdShowKeyboard"
          @focus="isRePwdShowKeyboard = true"
        />
        <van-number-keyboard
          title="安全键盘"
          :show="true"
          v-model="payarr2"
          @blur="isRePwdShowKeyboard = false"
          @input="onInput2"
          @delete="onDelete2"
        />
      </div>

    </van-popup> -->
  </div>
</template>
<script>
import set_balance_password_v2_controller from "./set_balance_password_v2_controller";

export default set_balance_password_v2_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  .ispaskey {
    .van-number-keyboard {
      position: relative;
    }
  }

  .van-button-group {
    padding-top: 15px;
    padding-left: 12px;
    padding-right: 12px;
  }

  #info span {
    font-size: 14px !important;
  }

  .tips {
    height: 2.5rem;
    background: #fff;
    padding-right: 0.625rem;
    padding-left: 0.625rem;
    line-height: 2.5rem;
    text-align: left;
  }

  .tips1 {
    height: 1.875rem;
    padding-right: 0.625rem;
    padding-left: 0.625rem;
    line-height: 1.875rem;
    text-align: right;
  }

  .code {
    height: 1.875rem;
    margin-top: 0.625rem;
    margin-right: 0.625rem;
    background: #ccc;
    padding: 0.1875rem 0.3125rem;
    border-radius: 0.3125rem;
  }

  .list1 {
    margin-top: 0.625rem;
    height: 2.75rem;
    width: 97%;
    background: #fff;
    padding: 0 0 0 3%;
    border-top: 0.0625rem solid #e6e1e1;
    font-size: 14px;
    line-height: 2.75rem;
    color: #333;
    text-align: left;
  }

  .list1 i.fa.fa-angle-right {
    float: right;
    line-height: 2.75rem;
    display: inline-block;
    font-size: 0.9rem;
    margin-right: 0.375rem;
    color: #929292;
    width: 1.25rem;
    height: 1.25rem;
    text-align: center;
    background-size: 1.25rem;
  }

  .fa-angle-right {
    color: #999;
    font-size: 1.625rem;
    float: right;
    line-height: 3.125rem;
    margin-left: 0.375rem;
    margin-right: 0.3125rem;
  }

  .btmobile {
    top: 0;
    line-height: 3rem;
    right: 100;
    width: 5rem;
    font-size: 12px;
    color: #f15353;
  }

  #info .mint-button {
    margin: 0 2%;
  }

  .maleall {
    background: #fff;
    text-align: left;
  }

  .males {
    line-height: 3.125rem;
    display: flex;
    border-top: 0.0625rem solid #f3f3f3;
    margin-left: 0.625rem;
  }

  .maleall span {
    color: #888;
    font-size: 14px;
    vertical-align: middle;
    width: 28%;
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

  #myimg {
    flex: 1;
    text-align: right;
  }

  .popup-con {
    width: 100%;
  }

  .el-upload img {
    width: 30%;
  }

  .avatar-uploader-icon {
    padding-right: 1.5625rem;
  }

  .mint-cell-wrapper {
    background: red;
  }

  .mint-button {
    margin: 0.3125rem 0;
  }

  #info .mint-cell-wrapper {
    padding: 0;
  }

  #info /deep/ .van-field__label {
    width: auto;

    span {
      color: #555;
    }
  }

  .eyes {
    position: absolute;
    top: 2px;
    right: -0.1875rem;
    width: 30px;
    height: 30px;
    color: #999;
    font-size: 30px;
  }

  #info /deep/ .van-cell {
    // padding: 0;
  }
</style>
