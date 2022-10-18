<template>
  <div id="register">
    <div style="position: relative;">
      <c-title :hide="false" text="用户注册"></c-title>
      <!--<div class="topImg" :style="{ backgroundImage: 'url(' + (!fun.isTextEmpty(requimg) ? requimg : images_n) + ')' }">
         <div class="topTxt">
          <span>{{title1}}</span>
          <span>{{title2}}</span>
        </div>
      </div>-->
      <img class="topImg" :src="!fun.isTextEmpty(requimg) ? requimg : images_n" alt="" />
      <div class="bottomConten">
        <!-- 新页面 -->
        <div id="content">
          <ul class="area_number">
            <li v-if="country_code == 1" class="first-info">
              <div class="must">*</div>
              <span>国家区号</span>
              <van-field class="bor-bottom" v-model.trim="form.country" clearable placeholder="+86" />
            </li>
          </ul>

          <ul class="login_info">
            <li v-if="imgcode" class="codeBox info-box">
              <div class="must">*</div>
              <van-field class="info-item" v-model.trim="form.captcha" clearable placeholder="请输入右侧图形验证码" :border="false" />

              <img style="width: 20%; height: 40px; position: absolute; display: block; right: 0; bottom: 0; z-index: 999;" :src="imgcode" @click="getimgdata()" v-if="imgcode" />
            </li>
            <li v-if="is_enable == 0" class=" info-box">
              <div class="must">*</div>
              <van-field class="info-item" v-model.trim="form.mobile" clearable type="tel" placeholder="请输入手机号码" :border="false" />
            </li>
            <li v-if="is_enable == 1" class="info-box">
              <div class="must">*</div>
              <van-field class="info-item" v-model.trim="form.mobile" clearable placeholder="设置账号" :border="false" />
            </li>
            <li class="code info-box" v-if="is_enable == 0">
              <div class="must">*</div>
              <van-field class="info-item" v-model.trim="form.code" clearable placeholder="请输入验证码" :border="false" />
              <van-button plain type="primary" size="small" :disabled="btnTag" @click.native="verificationCode">{{ btnText }} </van-button>
            </li>

            <li v-if="is_password == '1'" class=" info-box">
              <div class="must">*</div>
              <van-field class="info-item setpwd" v-model.trim="form.password" center clearable :type="setpassword" placeholder="设置密码" :border="false">
                <template #button>
                  <i class="iconfont icon-onlineCar_f eyes" @click.stop="SetPwdClick()" v-if="!visibleSet" style="color: #333;"></i>
                  <i class="iconfont icon-onlineCar_g eyes" @click.stop="SetPwdClick()" v-if="visibleSet"></i>
                </template>
              </van-field>
            </li>
            <li v-if="is_password == '1'" class=" info-box">
              <div class="must">*</div>

              <van-field class="info-item setpwd" v-model.trim="form.confirm_password" center clearable :type="setpassword" placeholder="确认密码" :border="false">
                <template #button>
                  <i class="iconfont icon-onlineCar_f eyes" @click.stop="surePwdClick()" v-if="!visibleSure" style="color: #333;"></i>
                  <i class="iconfont icon-onlineCar_g eyes" @click.stop="surePwdClick()" v-if="visibleSure"></i>
                </template>
              </van-field>
            </li>
            <li class="invitCode  info-box" v-if="invite">
              <div class="must" v-if="isrequired">*</div>
              <div class="must" v-else style="opacity: 0;">*</div>

              <van-field class="info-item" v-model="form.invite_code" clearable placeholder="请输入邀请码" :border="false" />
              <span style="color: #ff2c29;" v-if="!fun.isTextEmpty(default_invite)" @click="fillInCode">默认邀请码</span>
            </li>
          </ul>

          <diyorm
            v-if="diyform.fields"
            ref="gofunarr"
            v-on:gofunarr="postDiy"
            :modeType="'Single'"
            :singleStatus="true"
            :singleDatas="diyform"
            :desThumb="false"
            :memberBtn="false"
            :methodType="'funarr'"
          ></diyorm>
          <div v-if="fromBase_address == '1'" style="margin-top: 10px;" class="address_nontext">
            <div style="width: 100%; text-align: left; text-indent: 20px; background: #e3e3e3; color: #6666; padding: 5px 0;">
              所在地信息
            </div>
            <div style="padding: 0 0.5rem;">
              <van-cell is-link :border="false" center title-class="area-left">
                <span slot="title">所在地区：</span>
                <input slot="default" type="text" @click.stop="showAdd = true" v-model="districtName" readonly placeholder="请选择地区" />
              </van-cell>
              <van-cell :border="false" center title-class="area-left" style="border: 1px solid #e3e3e3; padding: 10px 0;">
                <van-field style="padding: 10px;" class="address-detailed" v-model="form.address" rows="3" autosize type="textarea" maxlength="100" placeholder="请输入详细地址" show-word-limit />
              </van-cell>
            </div>
          </div>
          <div style="padding: 0 0.5rem;" class="persona-data" v-if="formBase_name == '1'">
            <van-cell :border="false" center title-class="persona-left">
              <span slot="title">
                <span style="color: #f15353;">{{name_must?'*':''}}</span>
                姓名：</span>
              <van-field v-model="form.realname" placeholder="请输入您的姓名" center />
            </van-cell>
          </div>
          <div style="padding: 0 0.5rem;" class="persona-data" v-if="fromBase_birthday == '1'">
            <van-cell :border="false" center title-class="persona-left" is-link @click.native="openPickers">
              <span slot="title">生日：</span>
              <van-field v-model="form.birthday" readonly placeholder="请选择生日" center />
            </van-cell>
          </div>

          <div style="padding: 0 0.5rem;" class="persona-data" v-if="fromBase_sex == '1'">
            <van-cell :border="false" center title-class="persona-left" is-link @click.native="showSexInfo">
              <span slot="title">性别：</span>
              <van-field v-model="sexName" readonly placeholder="请选择性别" center />
            </van-cell>
          </div>
          <div style="margin-top: 10px;" v-if="customDatas.length > 0">
            <div style="width: 100%; text-align: left; text-indent: 20px; background: #e3e3e3; color: #6666; padding: 5px 0;">
              其他信息
            </div>
            <div style="padding: 0 0.5rem;" class="persona-data">
              <van-cell :border="false" center title-class="persona-left" value-class="right-info" v-for="(cItem, i) in customDatas" :key="i" is-link>
                <span slot="title"><span class="must" v-if="formOpen">*</span>{{ cItem.name }}：</span>
                <van-field v-model="cItem.value" maxlength="40" :placeholder="'请输入' + cItem.name" center />
              </van-cell>
            </div>
          </div>
          <div style="margin-top: 10px;" v-if="is_enable == 1">
            <div style="width: 100%; text-align: left; text-indent: 20px; background: #e3e3e3; color: #6666; padding: 5px 0;">
              密保问题
            </div>
            <div style="padding: 0 0.5rem;">
              <van-cell-group>
                <van-field v-model="fathername" required label="父亲姓名" placeholder="请输入父亲姓名" />
                <van-field v-model="mothername" required label="母亲姓名" placeholder="请输入母亲姓名" />
              </van-cell-group>
            </div>
          </div>

          <div class="persona-data other-info">
            <van-cell-group :title="custom_title + '信息'" v-if="is_custom" :border="false">
              <van-cell :border="false" center title-class="other-info">
                <span slot="title">{{ custom_title }}：</span>
                <van-field v-model.trim="form.custom_value" type="text" clearable placeholder="" center class="inp-text" />
              </van-cell>
            </van-cell-group>
          </div>

          <div style="color: #999; text-align: left; margin-left: 1.25rem; margin-top: 1rem;" v-if="fun.isApp()">
            <van-checkbox v-model="login_checked" checked-color="#f15353" shape="square">
              注册即代表您同意<router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'agreement' })">《用户协议》 </router-link>
              和
              <router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'privacy' })">《隐私政策》 </router-link>
            </van-checkbox>
          </div>

          <template>
            <div class="agreement" v-if="agreementStatus || PlatformAgreement">
              <van-checkbox checked-color="#f15353" shape="square" v-model="agreementCB" style="flex-shrink: 0; height: 2.5rem;"></van-checkbox>
              <div style="margin-left: 10px; padding-top: 0.5rem;">
                <span style="font-size: 0.75rem; color: #999;">我已阅读、理解并接受</span>
                <span slot="right" style="font-size: 0.75rem; color: #ff2c29; cursor: pointer;" @click="goAgreement" v-show="agreementStatus"> 《{{ protocol_title || "会员注册协议" }}》</span>
                <span style="font-size: 0.75rem; color: #ff2c29;" @click="openPlatformAgreement = true" v-show="PlatformAgreement">《{{ agreement_name }}》</span>
              </div>
            </div>
          </template>

          <div class="btn" v-if="agreementStatus && !agreementCB">
            <button type="button" @click="registerTost" style="background-color: #999;">注册</button>
          </div>
          <div class="btn" v-else>
            <button type="button" @click="register">注册</button>
          </div>

          <van-popup v-model="pickerShow" position="bottom">
            <van-datetime-picker type="date" title="选择年月日" v-model="pickerValue" @cancel="pickerShow = false" @confirm="setDate" />
          </van-popup>

          <yd-cityselect v-model="showCity" :callback="setCity" :items="district"></yd-cityselect>
          <van-popup v-model="openPlatformAgreement" style="z-index: 2004; border-radius: 0.656rem;">
            <div class="city-info">
              <van-nav-bar :title="agreement_name" fixed />
              <div style="height: 2.5rem; clear: both;"></div>

              <div id="a_content" v-html="PlatformAgreement"></div>
              <div
                style="width: 12.75rem;
                  height: 2.313rem;
                  background-color: #f04d4d;
                  border-radius: 0.188rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #fff;
                  font-size: 1.193rem;
                  margin: 0 auto;
                  margin-top: 1.5rem;
                  margin-bottom: 1.063rem;"
                @click="openPlatformAgreement = false"
              >
                确定
              </div>
            </div>
          </van-popup>
          <van-popup v-model="show2" class="mint-popup-3" closeOnClickModal="true" modal="false" style="z-index: 2004; border-radius: 0.656rem;">
            <div class="city-info">
              <van-nav-bar :title="protocol_title || '协议'" fixed />

              <div>
                <div style="height: 2.5rem; clear: both;"></div>

                <div id="a_content" v-html="protocol_content"></div>
                <div
                  style="width: 12.75rem;
                  height: 2.313rem;
                  background-color: #f04d4d;
                  border-radius: 0.188rem;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #fff;
                  font-size: 1.193rem;
                  margin: 0 auto;
                  margin-top: 1.5rem;
                  margin-bottom: 1.063rem;"
                  @click="popClose"
                >
                  确定
                </div>
              </div>
            </div>
          </van-popup>
          <van-popup v-model="dateshow_2" position="bottom" :overlay="true">
            <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" @confirm="handleConfirm" @cancel="cancelbtn" />
          </van-popup>
          <van-action-sheet v-model="showSex" :actions="actions" cancel-text="取消" @select="onSelect" />
          <yd-cityselect v-model="showAdd" :callback="resultAdd" :items="district"></yd-cityselect>
          <div style="height: 2.5rem; clear: both;"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import register_v2_controller from "./register_v2_controller";

export default register_v2_controller;
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#register {
  .must {
    color: #f15353;
    align-self: center;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
  }

  .topImg {
    width: 100%;
    max-height: 11.75rem;
    object-fit: cover;

    .topTxt {
      position: absolute;
      top: 6.56rem;
      left: 0.97rem;
      display: flex;
      flex-direction: column;
      text-align: left;
      width: 95%;

      span:nth-child(1) {
        font-size: 1.5rem;
        color: #fff;
        letter-spacing: 0.08rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }

      span:nth-child(2) {
        font-size: 1rem;
        color: #fff;
        letter-spacing: 0.05rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }
    }
  }

  .bottomConten {
    margin-top: -1.7rem;
    position: relative;
  }

  #agreement {
    height: 2.25rem;
    line-height: 2.25rem;

    .span {
      text-align: center;
      font-size: 20px;
    }
  }

  .city-info {
    border-radius: 0.656rem;
    width: 20rem;
    height: 32rem;
    margin: 0 auto;
    // padding-bottom: 5rem;
    background: #fff;

    header {
      border-radius: 0.656rem 0.656rem 0 0;
    }

    #a_content {
      // width: 14.438rem;
      margin: 0 1.063rem 0 0.75rem;
      height: 24rem;
      overflow-y: scroll;

      /deep/img {
        max-width: 100%;
        display: flex;
      }
    }
  }

  .mint-header {
    background: none;
    color: #666;
  }

  .is-fixed .mint-header-title {
    font-weight: bold;
  }

  .mint-header.is-fixed {
    border-bottom: 0.0625rem solid #e8e8e8;
    background: #fff;
    z-index: 99;
  }

  #lin {
    margin-bottom: 1.25rem;
  }

  width: 100%;

  #code {
    background: #ccc;
    padding: 0.1875rem 0.3125rem;
    border-radius: 0.1875rem;
  }

  h1 {
    color: #42b983;
  }

  .mint-button--large {
    margin-top: 0.625rem;
  }

  #bts {
    margin: auto 0.3125rem;

    .mint-button--default {
      background-color: #13ce66;
      color: #fff;
    }
  }

  .forget {
    color: #999;
    float: right;
  }

  .address_nontext .nontext {
    border: 1px solid #e3e3e3;
  }
  // 新css
  #content {
    background-color: #fff;
    border-radius: 2rem 2rem 0 0;
    box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1);

    /* height: 39.1875rem; */
    .area_number {
      padding-top: 1.25rem;
      font-size: 18px;
      color: #333;
      margin-bottom: 1.875rem;

      li {
        height: 2.5rem;
        line-height: 2.5rem;
        padding: 0 1.25rem;
        display: flex;
        justify-content: space-between;

        span {
          width: 5.75rem;
          text-align: left;
          white-space: nowrap;
        }
      }
    }

    .login_info {
      li {
        margin: 1.25rem auto 0 auto;
        width: 20.625rem;
        display: flex;
        font-size: 16px;
        height: 2.5rem;
        line-height: 2.5rem;

        /* border-bottom: solid 0.0625rem #ccc; */
        position: relative;

        input {
          width: 14.625rem;
          border: none;
        }

        span {
          font-size: 14px;
          position: absolute;
          right: 0;
          color: #333;
        }

        .img {
          width: 2.5rem;
          overflow: hidden;

          img {
            margin-top: 26%;
            width: 48%;
          }
        }
      }

      .code {
        justify-content: space-between;

        button {
          border: none;
          background-color: #fff;
          // color: #f15353;
          font-size: 14px;
          // border-radius: 1.875rem;
          // padding: 0 0.625rem;
          height: 1.875rem;
          line-height: 1.875rem;
          color: #ff2c29;
          // margin-top: 0.25rem;
          width: 15rem;
          margin-top: 0.3rem;
        }
      }
    }

    .agreement {
      margin-top: 0.625rem;
      text-align: left;
      padding: 0 1.25rem;
      display: flex;

      /deep/.van-checkbox {
        width: 25px;
      }

      .span {
        text-align: center;
        font-size: 20px;
        margin-left: 0.375rem;
        display: block;
      }
    }

    .btn {
      margin-top: 2.5rem;

      button {
        width: 20.625rem;
        height: 2.8125rem;
        font-size: 16px;
        margin-bottom: 1.25rem;
        border-radius: 1.875rem;
        border: none;
        background-color: #f15353;
        color: #fff;
      }
    }
  }

  /* 清除浮动代码 */
  .clearfloat::after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }

  .clearfloat {
    zoom: 1;
  }

  .photobox {
    position: relative;
    width: 5rem;
    height: 5rem;
    border: 1px dashed #c0ccda;

    /* float: left; */
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    margin-bottom: 0.2rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.diyform {
  padding: 1rem 0.5rem 0 0.5rem;
  background: #fff;
}

#content .first-info .bor-bottom {
  border-bottom: solid 1px #eee;
}

#content .info-box .info-item {
  position: relative;
  padding: 10px 0;
  border-bottom: solid 1px #eee;

  /deep/ input::placeholder {
    color: #666;
    font-size: 16px;
    // font-size: 4.6875rem;
  }
}

#content .code /deep/ .van-button {
  .van-button__text {
    color: #ff2c29 !important;
  }

  &::before {
    background-color: #fff !important; //覆盖button的点击背景色
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

.setpwd /deep/ .van-field__control {
  width: 80%;
}

.diyform {
  .van-cell-group__title {
    text-align: left;
    font-size: 14px;
  }

  .diy-item {
    position: relative;
    // padding: 10px 16px 10px 30px;
    padding: 10px 16px;

    // border-bottom: solid 1px #eeeeee;
    /deep/ input::placeholder {
      color: #666;
      font-size: 16px;
    }

    /deep/ .van-field__body {
      // width: 80%;
      // padding-right: 1rem;
      // padding-bottom: 0.4rem;
      padding: 10px 1rem 10px 0;
      border-bottom: 1px solid #eee;
    }
  }
}

.icon-inp {
  position: absolute;
  color: #f43530;
  font-size: 18px;
  top: 0.7125rem;
  right: 0.0938rem;
  pointer-events: none;
}

.surccess-icon {
  color: #09bb07;
}

.select-down {
  width: 100%;
  border: none;
  color: #999;
}

.checkout-box,
.use-name {
  .van-cell {
    height: 50px;
  }
}

.checkbox-left,
.radio-left,
.time-left {
  text-align: left;
  color: #666;
}

.check-icon {
  color: #09bb07;
  font-size: 25px;
}

.custom-info {
  position: relative;

  .van-cell__title {
    flex: none;
    font-size: 16px;
  }

  .van-cell__value {
    /deep/ .van-field__control {
      width: 75%;
      font-size: 16px;
      height: 2.5rem;
      line-height: 2.5rem;
    }

    /deep/ .van-field__body {
      border-bottom: 1px solid #eee;
    }
  }

  .van-cell__value /deep/ input::placeholder {
    color: #666;
  }

  .no-pad {
    padding: 0;
  }

  .name-icon {
    top: 0.52rem;
  }

  .custom-look {
    margin-top: 0.45rem;
  }

  .right-px {
    right: 1.5rem;
  }
}

.address_nontext {
  .area-left {
    flex: none;
    text-align: left;
    font-size: 16px;
  }

  input {
    width: 100%;
    border: none;
    font-size: 16px;
  }
}

.persona-data {
  .van-cell {
    height: 50px;
  }

  .van-cell-group__title {
    text-align: left;
  }

  .van-field {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }

  /deep/ .van-field__control {
    font-size: 16px;
    color: #555;
  }

  .other-info {
    text-align: left;
    flex: none;
  }

  .inp-text {
    /deep/ input::placeholder {
      color: #333;
    }
  }
}

.persona-left {
  flex: none;
  text-align: left;
  font-size: 16px;
}

.right-info /deep/ input::placeholder {
  color: #666;
}

#register {
  .van-cell {
    // height: 50px;
  }

  /deep/ textarea::placeholder {
    color: #555;
  }

  .address-detailed {
    padding: 0 15px !important;
  }

  .commont-style {
    .van-cell {
      height: 50px;
      padding: 0 16px;
    }

    .van-cell__value {
      height: 100%;
    }

    /deep/ input::placeholder {
      font-size: 16px;
      color: #555;
    }
  }

  .use-name {
    margin-bottom: 10px;

    .van-cell {
      font-size: 16px;
      padding: 0 12px;
    }

    .van-cell__title {
      flex: none;
    }

    .van-cell__value {
      height: 100%;
    }

    .yd-input {
      color: #555;
    }
  }

  .pwd-inp {
    /deep/ .yd-input {
      border: none;
    }
  }

  /deep/ .van-cell--clickable:active {
    background-color: #fff;
  }

  .van-nav-bar,
  /deep/ .van-nav-bar__content {
    height: 40px;
  }

  /deep/ .van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/ .van-nav-bar .van-icon {
    color: #666;
  }

  /deep/ .van-nav-bar__left {
    padding: 0 0 0 10px;
  }
}
</style>
<style lang="scss" rel="stylesheet/scss">
.vant-sure-class {
  .van-field__right-icon {
    color: green;
  }
}

.vant-no-sure-class {
  .van-field__right-icon {
    color: red;
  }
}
</style>
