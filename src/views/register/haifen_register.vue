<template>
  <div id="register1">
    <div style="position: relative;">
      <c-title :hide="false" text="用户登录"></c-title>
      <img
        style="width: 20%; height: 40px; position: absolute; display: block; left: 74%; z-index: 999;"
        :style="{ top: country_code == 1 ? '8rem' : '5.5rem' }"
        :src="imgcode"
        @click="getimgdata()"
        v-if="imgcode"
      />
    </div>
    <!-- 新页面 -->
    <div id="content">
      <ul class="area_number">
        <li v-if="country_code == 1" class="area-num">
          <div class="must">*</div>
          <van-field v-model.trim="form.country" label-class="area-text" label="国家区号" clearable placeholder="+86" />
        </li>
      </ul>

      <ul class="login_info">
        <li v-if="imgcode" class="inp-data">
          <div class="must">*</div>
          <van-field v-model.trim="form.captcha" center placeholder="请输入右侧图形验证码"></van-field>
        </li>
        <li class="inp-data">
          <div class="must">*</div>
          <van-field v-model.trim="form.mobile" clearable center placeholder="请输入手机号码"></van-field>
        </li>
        <li class="inp-data">
          <div class="must">*</div>
          <van-field v-model.trim="form.code" center clearable placeholder="请输入验证码">
            <van-button size="small" type="primary" :color="btnBg" slot="button" @click.native="verificationCode">{{
              btnText
            }}</van-button>
          </van-field>
        </li>

        <li class="invitCode inp-data" v-if="invite">
          <div class="must" v-if="isrequired">*</div>
          <van-field v-model.trim="form.invite_code" clearable center placeholder="请输入邀请码"></van-field>
        </li>
      </ul>

      <div style="color: #999; text-align: left; margin-left: 1.5rem;" v-if="fun.isApp()">
        注册即代表您同意<router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'agreement' })"
          >《用户协议》</router-link
        >
        和
        <router-link style="color: #3b73ef;" :to="fun.getUrl('userAgreement', {}, { show: 'privacy' })"
          >《隐私政策》</router-link
        >
      </div>

      <template>
        <div class="agreement" v-if="agreementStatus">
          <van-checkbox checked-color="#f15353" shape="square" v-model="agreementCB"> </van-checkbox>
          <span slot="right" style="font-size: 16px; text-decoration: underline; margin-left: 10px;" @click="goAgreement">
            登录协议</span
          >
        </div>
      </template>

      <div class="btn">
        <button type="button" @click="register">登录</button>
      </div>

      <van-popup
        v-model="show2"
        class="mint-popup-3"
        position="right"
        closeOnClickModal="true"
        modal="false"
        style="z-index: 2004;"
      >
        <div class="city-info">
           <van-nav-bar
          left-arrow
          title="协议"
          fixed
          @click-left="popClose"
          :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
        />

          <div>
            <div style="height: 2.5rem; clear: both;"></div>

            <div id="a_content" v-html="protocol_content"></div>
          </div>
        </div>
      </van-popup>

      <div style="height: 2.5rem; clear: both;"></div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import cTitle from "components/title";
export default {
  data() {
    return {
      isrequired: '',
      invite: '',
      imgcode: '',
      protocol_content: '',
      show2: false,

      agreementStatus: false,
      agreementCB: true,

      start1: false,
      form: {
        country: '86',
        mobile: '',
        code: '',
        captcha: '',
        invite_code: ''
      },
      // 替换ydui组件新增
      btnBg: '#ef4f4f',
      btnText: '获取短信验证码',
      btnTag: false,
      timer: null,
      count: ''
    };
  },
  methods: {
    init() {
      this.agreementCB = true;

      this.start1 = false;
      this.form = {
        country: '86',
        mobile: '',
        code: '',
        captcha: ''
      };

      this.show2 = false;
    },
    goAgreement() {
      this.show2 = true;
    },
    popClose() {
      this.show2 = false;
    },
    //获取是否开启协议
    getProtocolStatus() {
      var that = this;
      $http.get('setting.get-member-protocol', {}).then(
        response => {
          if (response.result == 1) {
            that.agreementStatus = response.data.protocol == '0' ? false : true;
            that.protocol_content = response.data.content;
          } else {
            that.agreementStatus = false;
          }
        },
        response => {
          console.log(response.msg);
          that.agreementStatus = false;
        }
      );
    },
    //发送验证码
    verificationCode() {
      let that = this;
      if (this.fun.isTextEmpty(this.form.country)) {
        Toast('请输入国际区号');
        return;
      }
      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast('请填写手机号');
        return;
      }

      if (this.form.country == '86' && this.fun.isMoblie(this.form.mobile)) {
        Toast('请填写正确的手机号');
        return;
      }

      if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
        Toast('请填图形验证码');
      } else {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: '发送中',
        });
        //发送获取验证码的请求
        $http
          .get('member.register.alySendCode', {
            mobile: this.form.mobile,
            state: this.form.country,
            captcha: this.form.captcha,
            sms_type: 3
          })
          .then(
            response => {
              console.log(response);
              Toast.clear();
              if (response.result == 1) {
                that.sendCodeAnimation();
              } else {
                //刷新图形验证码
                Toast(response.msg);
                this.form.captcha = '';
                this.getimgdata();
              }
            },
            response => {
              console.log(response.msg + 'nihao');
            }
          );
      }
    },
    //发送验证码 倒计时
    sendCodeAnimation() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        Toast.success('验证码已发送');
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
            this.btnText = '验证码已发送';
            this.btnTag = true;
            this.btnBg = '#999';
          } else {
            this.btnTag = false
            ;(this.btnBg = '#ef4f4f'), (this.btnText = '获取短信验证码');
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    //获取图片验证码
    getimgdata() {
      $http
        .get('home-page.getCaptcha')
        .then(res => {
          if (res.data.captcha) {
            this.imgcode = res.data.captcha.img;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //注册
    register() {
      let that = this;

      if (this.fun.isTextEmpty(this.form.country)) {
        Toast('请输入国际区号');
        return;
      }

      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast('请填写手机号');
        return;
      }

      if (this.form.country == '86' && this.fun.isMoblie(this.form.mobile)) {
        Toast('请填写正确的手机号');
        return;
      }

      if (this.fun.isTextEmpty(this.form.code)) {
        Toast('请填验证码');
        return;
      }

      if (this.invite && this.isrequired) {
        if (this.fun.isTextEmpty(this.form.invite_code)) {
          Toast('请填邀请码');
          return;
        }
      }

      if (this.imgcode) {
        if (this.fun.isTextEmpty(this.form.captcha)) {
          Toast('图形验证码不能为空');
          return;
        }
      }

      if (this.agreementStatus) {
        if (!this.agreementCB) {
          Toast('请同意注册协议');
          return;
        }
      }
      this.form.appid = window.localStorage.getItem('appid');
      this.form.mid = this.fun.getKeyByMid();
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '验证中',
      });
      $http.post('plugin.haifen.frontend.haifen.hfregister', this.form).then(
        response => {
          Toast.clear();
          if (response.result == 1) {
            window.localStorage.setItem('isWxLogin', 0);
            // let member_id = response.data.member_id;
            this.$store.commit('savemodel', response.data);
            this.$dialog.alert({ message: response.msg, callback: () => {} });
            that.$router.push(this.fun.getUrl('home'));
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        },
        response => {
          this.$dialog.alert({ message: response.msg });
          Toast.clear();
        }
      );
    }
  },
  activated() {
    this.init();
    this.getProtocolStatus();
    this.getimgdata();
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#register1 {
  .must {
    color: #f15353;
    align-self: center;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
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
    overflow-y: scroll;
    width: 100vw;
    height: 100vh;
    background: #fff;
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
  // 新css
  #content {
    background-color: #fff;

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
        border-bottom: solid 0.0625rem #ccc;
        position: relative;

        input {
          width: 14.625rem;
          border: none;
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
      // .code {
      //   justify-content: space-between;
      //   button {
      //     border: none;
      //     background-color: #ebebeb;
      //     color: #f15353;
      //     font-size: 14px;
      //     border-radius: 1.875rem;
      //     padding: 0 0.625rem;
      //     height: 1.875rem;
      //     line-height: 1.875rem;
      //     margin-top: 0.25rem;
      //   }
      // }
    }

    .agreement {
      margin-top: 0.625rem;
      height: 2.25rem;
      line-height: 2.25rem;
      text-align: left;
      padding: 0 1.25rem;
      display: flex;

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
}

#register1 {
  .area_number {
    .van-cell {
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0;

      /deep/.area-text {
        width: auto;
        margin-right: 0;
        line-height: 2.5rem;

        span {
          padding-right: 10px;
          color: #333;
          font-size: 20px;
        }
      }

      /deep/.van-cell__value {
        border-bottom: solid 0.0625rem #ccc;
      }
    }

    .area-num /deep/.van-field__control {
      //  border-bottom: solid 0.0625rem #ccc;
    }
  }

  .login_info {
    .inp-data {
      //  position: relative;
      .van-cell {
        padding: 10px 0;

        /deep/input::placeholder {
          font-size: 16px;
          color: #666;
        }
      }
    }
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
