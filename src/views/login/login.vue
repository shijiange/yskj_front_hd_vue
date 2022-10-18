<template>
  <div id="login">
    <div class="login_type1" v-if="login_type == 1">
      <div style="position: relative;">
        <c-title :hide="false" text="用户登录"></c-title>
        <img style="width: 20%; height: 40px; position: absolute; display: block; left: 74%; top: 14rem; z-index: 999;" :src="imgcode" @click="getimgdata()" v-if="imgcode && mobile_login_code == 1" />
      </div>

      <div v-show="loading">
        <div id="login_box" v-if="appShow">
          <div class="login_header">
            <img :src="mailInfo_logo ? mailInfo_logo : require('../../assets/images/photo-mr.jpg')" />
          </div>
          <ul class="login_info">
            <li v-if="is_enable == 0">
              <van-field v-model="form.mobile" label="" maxlength="20" center style="font-size: 16px;" clearable placeholder="请输入手机号" />
            </li>
            <li v-if="is_enable == 1">
              <van-field v-model="form.mobile" label="" maxlength="20" center style="font-size: 16px;" clearable placeholder="请输入账号" />
            </li>
            <li v-if="imgcode && mobile_login_code == 1">
              <van-field v-model="form.captcha" center style="font-size: 16px;" label="" placeholder="请输入右侧图形验证码" />
            </li>
            <li class="code" v-if="mobile_login_code == 1">
              <van-field v-model.trim="form.code" center clearable placeholder="请输入验证码" style="font-size: 16px;">
                <template #button>
                  <van-button type="default" size="small" center :disabled="btnTag" round :text="btnText" @click.native="verificationCode"></van-button>
                </template>
              </van-field>
            </li>
            <li style="display: flex; flex-direction: row;" v-else>
              <van-field class="paw" v-model="form.password" @keyup.enter.native="mobile_login" center clearable style="width: 80%; font-size: 16px;" placeholder="请输入密码" :type="passwordOrText">
                <template slot="right-icon">
                  <i class="iconfont icon-onlineCar_f eyes" @click="passwordClick()" v-if="!visible" style="color: #333;"></i>
                  <i class="iconfont icon-onlineCar_g eyes" @click="passwordClick()" v-if="visible"></i>
                </template>
              </van-field>
              <span class="forgetBtn">
                <router-link :to="fun.getUrl('findpwd', { enable: this.is_enable })">忘记密码</router-link>
              </span>
            </li>
          </ul>
          <div style="color: #999; text-align: left; margin-left: 1.5rem;" v-if="fun.isApp()">
            <van-checkbox v-model="login_checked" checked-color="#f15353" shape="square">
              登录即代表您同意<router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'agreement' })">《用户协议》 </router-link>
              和
              <router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'privacy' })">《隐私政策》 </router-link>
            </van-checkbox>
          </div>
          <div class="login_btn">
            <button class="login" @click="mobile_login">登录</button>
            <button class="register" v-if="mobile_login_code != 1" @click="register">注册</button>
            <button class="register" v-if="enable_btn" @click="tapChange">{{ is_enable == 0 ? "切换账号登录" : "切换手机号登录" }}</button>
          </div>
          <template v-if="mobile_login_code == 1">
            <div class="login-tips">使用手机号验证码快捷注册/登录</div>
            <div class="login-tips" style="margin-top: 8px;">
              注册即同意 <span class="blue" @click.stop="toRegisterText">《{{ protocol_title || "平台用户协议" }}》</span>
            </div>
          </template>
        </div>
        <div class="vip_main" v-if="wetach_login">
          <div class="title">一键登录</div>
          <div class="weixin vip1" @click="weixin">
            <div class="ico1">
              <i class="fa fa-qrcode"></i>
            </div>
            <div class="text">
              <div class="t1">微信登录</div>
              <div class="t2">微信快捷通道一键登录商城</div>
            </div>
          </div>
          <div style="color: #999; text-align: left; margin: 0.875rem;" v-if="!appShow && fun.isApp()">
            <van-checkbox v-model="login_checked" checked-color="#f15353" shape="square">
              登录即代表您同意<router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'agreement' })">《用户协议》 </router-link>
              和
              <router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'privacy' })">《隐私政策》 </router-link>
            </van-checkbox>
          </div>
        </div>
      </div>
    </div>
    <div class="login_type2" v-if="login_type == 2">
      <div style="position: relative;">
        <c-title :hide="false" text="用户登录"></c-title>
        <img style="width: 20%; height: 40px; position: absolute; display: block; left: 74%; top: 11rem; z-index: 999;" :src="imgcode" @click="getimgdata()" v-if="imgcode && pc_bind_mobile == 1" />
      </div>
      <div class="wrp_code_2" v-if="wechat_qrcode_config.wechat_login_type == 2 && pc_bind_mobile != 1">
        <div class="code_title">微信登录</div>
        <img class="lightBorder_2" v-if="account_url" :src="account_url" alt="" />
        <div class="tips_title">
          <p>请使用微信扫描二维码关注公众号登录</p>
        </div>
      </div>
      <div id="login_box" style="padding-top: 0;" v-if="pc_bind_mobile == 1">
        <ul class="login_info">
          <li style="border-bottom: none;">
            <p class="bind-tips">绑定手机号开通专属服务</p>
          </li>
          <li>
            <van-field v-model="mobileForm.mobile" label="" maxlength="20" center style="font-size: 16px;" clearable placeholder="请输入手机号" />
          </li>
          <li v-if="imgcode">
            <van-field v-model="mobileForm.captcha" center style="font-size: 16px;" label="" placeholder="请输入右侧图形验证码" />
          </li>
          <li class="code">
            <van-field v-model.trim="mobileForm.code" center clearable placeholder="请输入验证码" style="font-size: 16px;">
              <template #button>
                <van-button type="default" size="small" center :disabled="btnTag" round :text="btnText" @click.native="verificationCode_V2"></van-button>
              </template>
            </van-field>
          </li>
        </ul>
        <div class="login_btn">
          <button class="login" @click="getPrepBind">开通专属服务</button>
        </div>
      </div>

      <div id="login_code" v-show="wechat_qrcode_config.wechat_login_type == 1 && pc_bind_mobile != 1"></div>
      <div style="padding-bottom: 2rem;" v-if="wechat_qrcode_config.is_wechat_login == 0 && pc_bind_mobile != 1" :style="{ marginTop: wechat_qrcode_config.wechat_login_type == 2 ? '3rem' : '' }">
        其他登录方式
        <span class="phone" @click="changeLoginType(1)">
          <i class="iconfont icon-verification_phone"></i>
          手机号登录
        </span>
      </div>
    </div>

    <!-- 会员id变更时提示 -->
    <van-popup v-model="showChangeID" class="changeId_popup" :close-on-click-overlay="false" round>
      <div class="changeId_main">
        <i class="iconfont icon-toast_warn"></i>
        <p class="changeId_warnTitel">重要提示</p>
        <p class="changeId_warnText">
          当前绑定绑定操作会导致用户ID变更：原会员ID:{{ changidInfo.uid }}，变更后会员ID:{{ changidInfo.change_uid }}；绑定后所有数据记录以变更后会员ID{{ changidInfo.change_uid }}为准，
          <em style="color: #d53125;">原会员ID{{ changidInfo.uid }}数据将被删除，数据不会进行合并，且不可找回！</em>请谨慎操作！ <br />绑定后请注意重新生成推广海报、重新发送推广链接！
        </p>
        <span class="changeId_Btn" @click="register_V2">确认合并</span>
        <span class="changeId_Btn changeId_Btn_other" @click="showChangeID = false">取消</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import login_controller from "./login_controller";
export default login_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#login .forgetBtn {
  position: absolute;
  right: 0.625rem;
  background: #fff;
  display: block;
  width: 4.375rem;
  height: 1.875rem;
  text-align: center;
  line-height: 1.875rem;
  margin-top: 0.3125rem;
  // white-space: nowrap;
}

#login {
  // background-color: #fff;
  // height: 600px;
  // // margin-top: 3.125rem;
  overflow: hidden;
  //position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;

  .code {
    justify-content: space-between;

    button {
      border: none;
      background-color: #ebebeb;
      color: #f15353;
      font-size: 14px;
      border-radius: 1.875rem;
      padding: 0 0.625rem;
      height: 1.875rem;
      line-height: 1.875rem;
      margin-top: 0.25rem;
    }
  }
  // 新页面css
  #login_box {
    // height: 39.1875rem;
    background-color: #fff;
    padding-top: 2.5rem;
    padding-bottom: 1.25rem;

    .login_header {
      margin: 0 auto;
      width: 4.5rem;
      height: 4.5rem;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .login_info {
      margin: 1.25rem;

      li {
        margin: 0 auto;
        width: 20.625rem;
        display: flex;
        font-size: 16px;
        height: 2.5rem;
        line-height: 2.5rem;
        margin-top: 1.25rem;
        border-bottom: solid 0.0625rem #ccc;
        position: relative;

        input {
          width: 12.5rem;
          border: none;
        }

        span {
          font-size: 14px;
          //position: absolute;
          right: 0;
          color: #333;
        }

        .img {
          width: 2.5rem;
          overflow: hidden;
          position: relative;

          img {
            position: absolute;
            margin-top: 26%;
            width: 48%;
            left: 0.625rem;
          }
        }
      }
    }

    .login_btn {
      margin-top: 2.5rem;

      button {
        width: 20.625rem;
        height: 2.8125rem;
        font-size: 16px;
        margin-bottom: 1.25rem;
        border-radius: 1.875rem;
      }

      .login {
        background: #f15353;
        color: #fff;
        border: none;
      }

      .register {
        background: #fff;
        color: #f15353;
        border: solid 0.0625rem #f15353;
      }
    }
  }

  // end
  h1 {
    color: #42b983;
  }

  .mint-button--large {
    margin-top: 0.625rem;
  }

  #bts {
    margin: auto 0.3125rem;
  }

  .forget {
    line-height: 2.5rem;
    float: right;

    a {
      color: #999;
    }
  }

  .vip_main {
    background: #fff;
    // margin-top: 3.125rem;
    overflow: hidden;
    margin-top: 0;

    .title {
      // padding: 1.625rem;
      font-size: 12px;
      border-bottom: 0.0625rem solid #eee;
      text-align: center;
      padding: 1.625rem 0 0.625rem 0;
    }

    .weixin {
      padding: 0.9375rem 0.625rem;
      overflow: hidden;
      font-size: 12px;
      color: #999;

      .ico1,
      .ico2 {
        width: 15%;
        float: left;
      }

      .ico1 {
        i {
          background: #32cd32;
        }
      }

      .ico2 {
        i {
          background: #fece00;
        }
      }

      .text {
        float: left;
        width: 85%;

        .t1 {
          font-size: 16px;
          color: #333;
          margin-bottom: 0.3125rem;
          text-align: left;
        }

        .t2 {
          text-align: justify;
        }
      }

      i {
        background: #32cd32;
        height: 2.25rem;
        width: 2.25rem;
        border-radius: 1.125rem;
        color: #fff;
        text-align: center;
        line-height: 2.375rem;
        font-size: 18px;
      }
    }

    .vip1 {
      border-bottom: 0.0625rem solid #eee;
    }
  }
}

.login_type2 {
  background: #fff;
  // min-height: 100vh;
  .phone {
    color: #297dd9;
    cursor: pointer;
  }
}

#login .code .van-button {
  white-space: nowrap;
}

#login #login_box .login_info li span {
  color: #f15353;
}

#login .login_info .van-cell {
  padding: 0;
  height: 100%;
}

.eyes {
  display: inline-block;
  margin-top: 8px;
  color: #999;
  font-size: 30px;
}

.wrp_code_2 {
  text-align: center;
  width: 300px;
  height: 300px;
  margin: 5px auto 0 auto;
}

.lightBorder_2 {
  width: 280px;
  height: 280px;
}

.code_title {
  text-align: center;
  font-size: 20px;
}

.login-tips {
  width: 100%;
  color: #333;
  text-align: center;
  font-weight: bold;

  .blue {
    cursor: pointer;
    color: #297dd9;
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
</style>
