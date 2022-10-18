<template>
  <div id="register">
    <c-title :hide="false" text="绑定手机"></c-title>
    <!-- <div style="height:40px;"></div> -->
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
          <li v-if="country_code == 1" class="country-code">
            <div class="must">*</div>
            <span>国家区号</span>
            <van-field v-model="value" placeholder="+86" v-model.trim="form.country" center clearable :border="false" />
          </li>
        </ul>
        <ul class="login_info">
          <li v-if="imgcode" class="codeBox commont-style">
            <div class="must">*</div>
            <!-- <input type="text" placeholder="请输入右侧图形验证码" v-model.trim="form.captcha"> -->
            <van-field v-model.trim="form.captcha" :border="false" placeholder="请输入右侧图形验证码" center clearable />
            <!-- :style="{ top: country_code == 1 ? '8rem' : '6rem' }" -->
            <img slot="button" style="width: 23%; height: 2.5rem; z-index: 999;" :src="imgcode" @click="getimgdata()" v-if="imgcode" />
          </li>

          <li class="commont-style">
            <div class="must">*</div>
            <van-field v-model.trim="form.mobile" :border="false" placeholder="请输入手机号码" center clearable>
              <template #button> </template>
            </van-field>
          </li>

          <li class="commont-style">
            <div class="must">*</div>
            <!-- <input type="text" placeholder="请输入验证码" v-model.trim="form.code"> -->
            <van-field v-model.trim="form.code" center clearable placeholder="请输入验证码" maxlength="4" type="number">
              <template #button>
                <van-button size="small" type="primary" :disabled="btnTag" :color="btnBg" @click.native="verificationCode">{{ btnText }}</van-button>
              </template>
            </van-field>
          </li>

          <li class="invitCode commont-style" v-if="invite">
            <div class="must" v-if="isrequired">*</div>
            <div class="must" v-else style="opacity: 0;">*</div>
            <van-field v-model.trim="form.invite_code" :border="false" placeholder="请输入邀请码" center clearable />
            <span style="color: #ff2c29; white-space: nowrap;" v-if="!fun.isTextEmpty(default_invite)" @click="fillInCode">默认邀请码</span>
          </li>
          <li v-if="is_password == '1'" class="commont-style">
            <div class="must">*</div>
            <van-field v-model.trim="form.password" :type="setpassword" :border="false" placeholder="设置密码" center clearable>
              <template slot="right-icon">
                <i class="iconfont icon-onlineCar_f" style="font-size: 30px;" @click.stop="SetPwdClick()" v-if="!visibleSet"></i>
                <i class="iconfont icon-onlineCar_g" style="font-size: 30px;" @click.stop="SetPwdClick()" v-if="visibleSet"></i>
              </template>
            </van-field>
          </li>
          <li v-if="is_password == '1'" class="commont-style">
            <div class="must">*</div>
            <van-field v-model.trim="form.confirm_password" :type="surepassword" :border="false" placeholder="确认密码" center clearable>
              <template slot="right-icon">
                <i class="iconfont icon-onlineCar_f" style="font-size: 30px;" @click.stop="surePwdClick()" v-if="!visibleSure"></i>
                <i class="iconfont icon-onlineCar_g" style="font-size: 30px;" @click.stop="surePwdClick()" v-if="visibleSure"></i>
              </template>
            </van-field>
          </li>
        </ul>

        <div v-if="fromBase_address == '1' && is_edit" style="margin-top: 10px;" class="address_nontext">
          <div style="width: 100%; text-align: left; text-indent: 20px; background: #e3e3e3; color: #6666; padding: 5px 0;">
            所在地信息
          </div>
          <div style="padding: 0 0.5rem;">
            <van-cell :border="false" is-link center class="sel-address">
              <span slot="title">所在地区：</span>
              <input slot="default" type="text" @click.stop="showAdd = true" v-model="districtName" readonly placeholder="请选择地区" />
            </van-cell>

            <van-cell :border="false" center>
              <van-field class="van-textarea" v-model="form.address" rows="4" autosize type="textarea" maxlength="100" placeholder="请输入详细地址" show-word-limit />
            </van-cell>
          </div>
        </div>
        <div style="padding: 0 0.5rem;" class="second-commont" v-if="formBase_name == '1' && is_edit">
          <van-cell :border="false" center>
            <span slot="title">
              <span style="color: #f15353;">{{name_must?'*':''}}</span>
              姓名：</span>
            <van-field placeholder="请输入您的姓名" v-model="form.realname" center />
          </van-cell>
        </div>
        <div style="padding: 0 0.5rem;" v-if="fromBase_sex == '1'" class="second-commont">
          <van-cell :border="false" center is-link @click.native="showSexInfo">
            <span slot="title">性别：</span>
            <van-field placeholder="请选择性别" v-model="sexName" center readonly />
          </van-cell>
        </div>
        <div style="padding: 0 0.5rem;" v-if="fromBase_birthday == '1'" class="second-commont">
          <van-cell :border="false" center is-link @click.native="openPickers">
            <span slot="title">生日：</span>
            <van-field placeholder="请选择生日" v-model="form.birthday" center readonly />
          </van-cell>
        </div>
        <div style="margin-top: 10px;" v-if="isForm && is_edit">
          <div style="width: 100%; text-align: left; text-indent: 20px; background: #e3e3e3; color: #6666; padding: 5px 0;">
            其他信息
          </div>
          <div style="padding: 0 0.5rem;" v-if="customDatas" class="second-commont">
            <van-cell :required="form_open ? true : false" :border="false" center v-show="customDatas" v-for="(cItem, i) in customDatas" :key="i">
              <span slot="title">{{ cItem.name }}：</span>
              <van-field :placeholder="'请输入' + cItem.name" maxlength="40" v-model="cItem.value" center clearable />
            </van-cell>
          </div>
        </div>
        <!-- 自定义表单 -->
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

        <van-cell-group :border="false" :title="custom_title + '信息'" class="down-pull" v-if="is_custom">
          <van-cell :border="false" center>
            <span slot="title">{{ custom_title }}：</span>
            <van-field placeholder="" v-model.trim="form.custom_value" center clearable />
          </van-cell>
        </van-cell-group>

        <div class="agreement" v-if="agreementStatus || PlatformAgreement">
          <van-checkbox v-model="agreementCB" checked-color="#f15353" style="flex-shrink: 0; height: 2.5rem;">&nbsp;</van-checkbox>
          <!--<el-checkbox v-model="agreementCB">&nbsp;</el-checkbox>-->
          <div style="margin-left: 10px;">
            <span style="font-size: 0.75rem; color: #999;">我已阅读、理解并接受</span>
            <span slot="right" style="font-size: 0.75rem; color: #ff2c29; cursor: pointer;" @click="goAgreement" v-show="agreementStatus"> 《{{ protocol_title || "会员注册协议" }}》 </span>
            <span style="font-size: 0.75rem; color: #ff2c29;" @click="openPlatformAgreement = true" v-show="PlatformAgreement">《{{ agreement_name }}》</span>
          </div>
        </div>
        <!-- <div class="btn">
          <button type="button" @click="register">绑定</button>
        </div>-->
      </div>
    </div>

    <div class="btn" v-if="agreementStatus && !agreementCB">
      <button type="button" @click="registerTost" style="background-color: #999;">绑定</button>
    </div>
    <div class="btn" v-else>
      <button type="button" @click="getPrepBind">绑定</button>
    </div>
    <!-- </div> -->

    <van-popup v-model="dateshow_2" position="bottom" :overlay="true">
      <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" @confirm="handleConfirm" @cancel="cancelbtn" />
    </van-popup>
    <van-action-sheet v-model="showSex" :actions="actions" cancel-text="取消" @select="onSelect" />
    <yd-cityselect v-model="showAdd" :callback="resultAdd" :items="district"></yd-cityselect>

    <van-popup v-model="pickerValueShow" position="bottom" :overlay="true">
      <van-datetime-picker v-model="pickerValue" type="date" :min-date="minDate" @confirm="setDate" @cancel="cancelbtn" />
    </van-popup>

    <yd-cityselect v-model="showCity" :callback="setCity" :items="district"></yd-cityselect>

    <div>
      <!-- <div style="height: 2.5rem;clear: both;"></div>

      <div id="a_content" v-html='protocol_content'></div>-->
    </div>

    <!-- <div style="height: 2.5rem;clear: both;"></div>

    <div id="a_content" v-html='protocol_content'></div>-->

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
            style="
              width: 12.75rem;
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
              margin-bottom: 1.063rem;
"
            @click="popClose"
          >
            确定
          </div>
        </div>
      </div>
    </van-popup>

    <div style="height: 2.5rem; clear: both;"></div>
    <!-- 会员id变更时提示 -->
    <van-popup v-model="showChangeID" class="changeId_popup" :close-on-click-overlay="false" round>
      <div class="changeId_main">
        <i class="iconfont icon-toast_warn"></i>
        <p class="changeId_warnTitel">重要提示</p>
        <p class="changeId_warnText">
          当前绑定绑定操作会导致用户ID变更：原会员ID:{{ changidInfo.uid }}，变更后会员ID:{{ changidInfo.change_uid }}；绑定后所有数据记录以变更后会员ID{{ changidInfo.change_uid }}为准，
          <em style="color: #d53125;">原会员ID{{ changidInfo.uid }}数据将被删除，数据不会进行合并，且不可找回！</em>请谨慎操作！ <br />绑定后请注意重新生成推广海报、重新发送推广链接！
        </p>
        <span class="changeId_Btn" @click="register">确认合并</span>
        <span class="changeId_Btn changeId_Btn_other" @click="showChangeID = false">取消</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import member_editmobile_v2_controller from "./member_editmobile_v2_controller";
export default member_editmobile_v2_controller;
</script>

<style>
#a_content img {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
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
      width: 100%;

      span:nth-child(1) {
        font-size: 1.5rem;
        color: #fff;
        letter-spacing: 0.08rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 95%;
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
  // 新css
  .address_nontext .nontext {
    border: 1px solid #e3e3e3;
  }

  #content {
    background-color: #fff;
    // height: 627px;
    overflow-y: hidden;
    border-radius: 2rem 2rem 0 0;
    box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1);

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
        }

        .yd-input {
          // border: none;
          border-bottom: solid 0.0625rem #ccc;
          width: 15rem;
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
        // span {
        //   font-size: 14px;
        //   position: absolute;
        //   right: 0;
        //   color: #333;
        // }
        .img {
          width: 2.5rem;
          overflow: hidden;

          img {
            margin-top: 26%;
            width: 48%;
          }
        }
      }
      //   .code {
      //     justify-content: space-between;
      //     // border-bottom: solid 0.0625rem #eeeeee;
      //     // .yd-input{
      //     //   border: none;
      //     // }
      //     button {
      //       border: none;
      //       background-color: #ffffff;
      //       // color: #f15353;
      //       font-size: 14px;
      //       // border-radius: 1.875rem;
      //       // padding: 0 0.625rem;
      //       height: 1.875rem;
      //       line-height: 1.875rem;
      //       color: #ff2c29;
      //       // margin-top: 0.25rem;
      //     }
      //   }
      .invitCode {
        // border-bottom: solid 0.0625rem #eeeeee;
      }
    }

    .agreement {
      margin-top: 0.625rem;
      text-align: left;
      padding: 0 1.25rem 1rem 1.25rem;
      display: flex;
      align-items: center;

      .span {
        text-align: center;
        font-size: 20px;
        margin-left: 0.375rem;
        display: block;
      }
    }
    // .btn {
    //   padding-top: 2.5rem;
    //   background-color: #ffffff;
    //   button {
    //     width: 20.625rem;
    //     height: 2.8125rem;
    //     font-size: 16px;
    //     margin-bottom: 1.25rem;
    //     border-radius: 1.875rem;
    //     border: none;
    //     background-color: #f15353;
    //     color: #fff;
    //   }
    // }
  }

  #agreement {
    height: 1.875rem;
    line-height: 1.875rem;

    .span {
      text-align: center;
      font-size: 20px;
    }
  }

  .city-info {
    border-radius: 0.656rem;
    width: 20rem;
    height: 32rem;
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

  //   #bts {
  //     margin: auto 0.3125rem;
  //     .mint-button--default {
  //       background-color: #13ce66;
  //       color: #fff;
  //     }
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

.changeId_popup {
  .changeId_main {
    padding: 2rem;
    width: 18.875rem;
    margin: 0 auto;

    i {
      font-size: 3rem;
      color: rgb(213, 49, 37);
    }

    .changeId_warnTitel {
      margin: 0.75rem 0;
      font-size: 1.125rem;
      font-weight: bold;
      color: #000;
    }

    .changeId_warnText {
      text-align: left;
      font-size: 0.875rem;
    }

    .changeId_Btn {
      width: 5rem;
      border: 1px solid #c5c5c5;
      background: #d53125;
      border-radius: 0.35rem;
      color: #fff;
      height: 2rem;
      display: block;
      line-height: 2rem;
      margin: 1rem auto 0;
    }

    .changeId_Btn_other {
      opacity: 0.5;
    }
  }
}

#register /deep/ .diyform .yd-cell-box .yd-cell .yd-cell-item .yd-cell-left {
  white-space: pre-wrap;
  text-align: left;
}

.diyform {
  padding: 0.8rem 0.5rem;
  background: #fff;
}

#register {
  .van-cell-group__title {
    text-align: left;
    padding: 2.5px 12px 5px;
  }

  /deep/input {
    color: #555;
  }

  /deep/input::placeholder {
    color: #555;
    font-size: 16px;
  }

  /deep/.van-cell:active {
    background-color: #fff !important;
  }

  .country-code {
    .van-cell {
      padding: 0 0 0 10px;
      border-bottom: solid 0.0625rem #eee;
    }

    span {
      white-space: nowrap;
    }
  }

  .login_info {
    .commont-style {
      .van-cell {
        padding: 0;
        border-bottom: solid 0.0625rem #eee;
      }
    }
  }

  /deep/.van-field__right-icon {
    padding-top: 8px;
  }

  .address_nontext {
    .sel-address {
      padding: 0 12px;
      height: 50px;
      font-size: 16px;
      color: #555;

      .van-cell__title {
        flex: none;
      }

      .van-cell__value {
        input {
          width: 100%;
          border: none;
        }
      }
    }

    .van-textarea {
      padding: 5px;
      border: 1px solid #e3e3e3;

      /deep/textarea::placeholder {
        color: #555;
      }
    }
  }

  .second-commont {
    .van-cell {
      padding: 0 12px;
      height: 50px;
      font-size: 16px;
      color: #555;
    }

    .van-cell__title {
      flex: none;
    }

    .van-field {
      padding: 0;
      border-bottom: solid 0.0625rem #eee;
    }
  }

  .select {
    .van-cell {
      padding: 0 12px;
      height: 50px;
      font-size: 16px;
      color: #555;
    }

    .van-cell__title {
      text-align: left;
    }
  }

  .down-pull {
    margin-top: 10px;
    margin-bottom: 10px;

    /deep/.van-cell__title {
      text-align: left;
      flex: none;
      width: auto;
      margin-right: 0;
    }

    input {
      width: 100%;
      border: none;
      color: #333;
    }

    select {
      width: 100%;
      border: none;
      color: #555;
    }

    .van-cell {
      height: 50px;
      padding: 0 12px;
      color: #555;
      font-size: 16px;
    }

    .van-cell__value {
      span {
        color: #555;
      }
    }

    .van-field {
      padding: 0;
      border-bottom: solid 0.0625rem #eee;
    }
  }

  .more-textarea {
    /deep/textarea::placeholder {
      color: #555;
    }
  }

  .one-line {
    .van-cell {
      padding: 0 12px;
      height: 50px;
      color: #555;
      font-size: 16px;

      .van-cell__title {
        flex: none;
      }

      .van-cell__value {
        height: 100%;
      }
    }
  }

  .pwd-bor {
    /deep/.yd-input {
      border: none;
    }
  }

  .user-bottom {
    margin-bottom: 10px;
  }

  /deep/.van-cell--clickable:active {
    background-color: #fff;
  }

  .van-nav-bar,
  /deep/.van-nav-bar__content {
    height: 40px;
  }

  /deep/.van-nav-bar__title {
    font-weight: 700;
    font-size: 14px;
    color: #666;
  }

  /deep/.van-nav-bar .van-icon {
    color: #666;
  }

  /deep/.van-nav-bar__left {
    padding: 0 0 0 10px;
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
    left: 50%;
    margin-left: -187.5px;
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
