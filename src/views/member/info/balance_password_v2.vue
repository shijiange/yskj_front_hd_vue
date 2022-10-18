<template>
  <div id="info">
    <div style="position: relative;">
      <c-title :hide="false" text="修改支付密码"></c-title>
      <img
        style="width: 20%; height: 34px; position: absolute; display: block; left: 74%; top: 6rem; z-index: 999;"
        :src="imgcode"
        @click="getimgdata()"
        v-if="imgcode"
      />
    </div>
    <van-cell-group>
      <van-cell>
        <span slot="title">验证码发送到:{{ mobile | mobile_dispose }}</span>
      </van-cell>
      <van-cell center v-if="imgcode">
        <input type="text" slot="title" placeholder="请输入右侧图形验证码" v-model.trim="captcha" />
      </van-cell>
      <van-cell center>
        <input type="text" slot="title" placeholder="请输入验证码" v-model="code" />
        <van-button type="default" :disabled="btnTag" :color="btnBg" size="small" @click.native="verificationCode">{{
          btnText
        }}</van-button>
      </van-cell>
    </van-cell-group>
    <van-cell-group class="surepwd">
      <van-cell :border="false" @click.native="showNewKeyboard('newPwd')">
        <van-field
          v-model="newPwd"
          placeholder="请输入新密码"
          label="新密码:"
          readonly
          :border="false"
          :type="passwordOrText"
        />
        <template slot="right-icon">
          <i
            class="iconfont icon-onlineCar_f eyes"
            @click.stop="passwordClick('visible','passwordOrText')"
            v-if="!visible"
            style="color: #333;"
          ></i>
          <i class="iconfont icon-onlineCar_g eyes" @click.stop="passwordClick('visible','passwordOrText')" v-if="visible"></i>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group class="surepwd">
      <van-cell :border="false" @click.native="showNewKeyboard('newPwdConfirm')">
        <van-field
          v-model="newPwdConfirm"
          placeholder="再次确认"
          label="确认密码:"
          readonly
          :border="false"
          :type="passwordOrTextConfirm"
        />
        <template slot="right-icon">
          <i
            class="iconfont icon-onlineCar_f eyes"
            @click.stop="passwordClick('visibleConfirm','passwordOrTextConfirm')"
            v-if="!visibleConfirm"
            style="color: #333;"
          ></i>
          <i class="iconfont icon-onlineCar_g eyes" @click.stop="passwordClick('visibleConfirm','passwordOrTextConfirm')" v-if="visibleConfirm"></i>
        </template>
      </van-cell>
    </van-cell-group>
    <div class="van-button-group">
      <van-button size="large" @click.native="submitInfo" type="danger">确认修改</van-button>
    </div>
    <div style="height: 0.625rem;"></div>
    <pay-keyboard :payKeyboardShow.sync="isNewShowKeyboard" @complete="onInput"></pay-keyboard>
    <!-- <van-popup v-model="isNewShowKeyboard" position="bottom" >
      <div class="ispaskey">
        <van-password-input
          :value="payarr"
          :focused="isNewShowKeyboard"
          @focus="isNewShowKeyboard = true"
        />
        <van-number-keyboard
          title="安全键盘"
          v-model="payarr"
          :show="true"
          @blur="isNewShowKeyboard = false"
          @input="onInput"
          @delete="onDelete"
        />
      </div>

    </van-popup> -->
  </div>
</template>
<script>
import balance_password_v2_controller from './balance_password_v2_controller';

export default balance_password_v2_controller;
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
  font-size: 0.875rem;
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

#info .van-cell__title {
  text-align: left;
  color: #555;
}

#info .van-cell__title input {
  border: none;
}

.surepwd /deep/.van-cell__title {
  width: auto;
}

.surepwd /deep/ .van-field {
  padding: 0;
}

.eyes {
  position: absolute;
  right: 1rem;
  margin-top: 0.09rem;
  color: #999;
  font-size: 30px;
}

.surepwd {
  .van-field__body {
    /deep/input::placeholder {
      color: #555;
    }
  }
}

/deep/.van-cell--clickable:active {
  background-color: #fff;
}
</style>
