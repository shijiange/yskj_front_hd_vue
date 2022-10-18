<template>
  <div>
    <c-title :hide="false" text="账户注销"></c-title>
    <template v-if="!isSubmitted">
      <!-- 注销 -->
      <div class="cancellation" v-if="!showMobileVerification">
        <div class="title">{{ cancelInfo.title }}</div>
        <div id="a_content" class="content" v-html="cancelInfo.content"></div>
        <div class="bottom-box">
          <van-checkbox v-model="checked">我已阅读并同意</van-checkbox>
          <div :class="['btn-submit', { disabled: !checked }]" @click="submit">提交</div>
        </div>
      </div>

      <div class="mobile-verification" v-else>
        <van-field v-if="cancelInfo.country_code" v-model="country" center clearable placeholder="+86" label="国家区号">
        </van-field>
        <van-field v-model="mobile" center clearable placeholder="请输入手机号码" label="手机号码">
          <!-- <i class="iconfont icon-verification_phone" slot="left-icon"></i> -->
        </van-field>
        <van-field v-model.trim="captcha" center clearable placeholder="请输入图形验证码" label="图形验证码" v-if="imgCaptcha">
          <div slot="button">
            <img
              style="width: 100%; height: 2.5rem; z-index: 999;"
              :src="imgCaptcha"
              @click="getCaptcha()"
            />
          </div>
        </van-field>
        <van-field v-model.trim="code" center clearable placeholder="请输入手机验证码" label="手机验证码">
          <!-- <i class="iconfont icon-fontclass-yanzhengma" slot="left-icon"></i> -->
          <van-button slot="button" size="small" round plain type="info" @click="sendCode" v-show="this.count <= 0">
            获取验证码
          </van-button>
          <van-button slot="button" size="small" round plain type="info" disabled v-show="this.count > 0"> 验证码已发送 </van-button>
        </van-field>
        <div class="btn-submit" @click="checkCode">申请注销</div>
      </div>
    </template>

    <div class="succesed" v-else>
      <img class="img" src="../../../assets/images/audit_succeed@2x.png" alt="" />
      <p>账号注销申请已提交，等待审核~</p>
      <div class="btns">
        <div class="btn-cancel" @click="revoke">取消申请</div>
        <div class="btn-back" @click="back">返回</div>
      </div>
    </div>

    <van-popup v-model="showConfirm" round style="width: 80%;" bind:close="closeConfirm">
      <div class="confirm-popup">
        <div class="pop-title">账户注销确认</div>
        <div class="pop-content">账户一旦注销后，无法找回。您的个人信息，个人财产，优惠券等数据将失效，且不能恢复。确定提交注销申请？</div>
        <div class="bottom-btns">
          <div class="clanel" @click="closeConfirm">暂不注销</div>
          <div class="confirm" @click="confirmCancel">确认注销</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      cancelInfo: {},
      isSubmitted: false, // 是否已提交
      checked: false, // 同意协议
      showConfirm: false, // 确认弹框
      showMobileVerification: false,
      bindMobile: false,
      imgCaptcha: '', // 图形验证码图片

      country: "", // 区号
      captcha: "", // 图形验证码
      mobile: "", // 手机号
      code: "", // 手机验证码
      count: "", // 验证码时间
      timer: null
    };
  },
  activated() {
    this.initData();
    this.getData();
  },

  computed: {},

  methods: {
    initData () {
      this.isSubmitted = false;
      this.checked = false;
      this.showConfirm = false;
      this.showMobileVerification = false;
      this.bindMobile = false;
      this.imgCaptcha = '';
      this.captcha = '';
      this.mobile = "";
      this.code = "";
      this.count = "";
      this.timer = null;
    },
    getData() {
      $http.get("member.cancel.getSet", {}, "加载中").then(res => {
        if (res.result !== 1) {
          Toast(res.msg);
          return;
        }
        this.cancelInfo = res.data.set;
        this.bindMobile = res.data.set ? res.data.set.is_bind_mobile : false;
        this.isSubmitted = res.data.set ? res.data.set.is_record : false;
      });
    },

    // 提交按钮
    submit() {
      if (!this.checked) {
        Toast("请先阅读申请协议并确认");
        return;
      }
      // 未绑定手机号
      if (this.cancelInfo.tel_status == 1 && !this.bindMobile) {
        this.$dialog.confirm({message: '暂未绑定手机号, 请先绑定手机号'})
          .then(() => {
            this.$router.push(this.fun.getUrl('editmobile'), {num: this.mobile,});
          });
        return;
      }
      if (this.cancelInfo.tel_status == 1) {
        this.getCaptcha();
        this.showMobileVerification = true;
      } else {
        this.showConfirm = true;
      }
    },

    // 获取图形验证码
    getCaptcha () {
      $http.get("home-page.getCaptcha", {}, 'loading')
        .then(res => {
          if (res.data.captcha) {
            this.imgCaptcha = res.data.captcha.img;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },


    // 获取手机验证码
    sendCode() {
      if (this.cancelInfo.country_code && this.fun.isTextEmpty(this.country)) {
        Toast("请输入国际区号");
        return;
      }
      if (this.fun.isTextEmpty(this.mobile)) {
        this.$dialog.alert({ message: "请填写手机号" });
        return;
      }
      if (this.country == "86" && this.fun.isMoblie(this.mobile)) {
        Toast("请填写正确的手机号");
        return;
      }
      if (this.imgCaptcha && this.fun.isTextEmpty(this.captcha)) {
        this.$dialog.alert({ message: "请填图形验证码" });
        return;
      }
      $http
        .post("member.register.sendCodeV2", {
          reset: 1,
          sms_type: 0,
          mobile: this.mobile,
          state: this.country,
          captcha: this.captcha
        }, "loading")
        .then(response => {
          if (response.result === 1) {
            const TIME_COUNT = 60;
            if (!this.timer) {
              Toast('发送成功');
              this.count = TIME_COUNT;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
            }
          } else {
            this.getCaptcha();
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 校验手机验证码
    checkCode() {
      if (this.fun.isTextEmpty(this.mobile)) {
        this.$dialog.alert({ message: "请填写手机号" });
        return;
      }
      if (this.fun.isTextEmpty(this.code)) {
        this.$dialog.alert({ message: "请填写验证码" });
        return;
      }
      $http.get("member.register.checkCode", { mobile: this.mobile, code: this.code }, "loading").then(res => {
        if (res.result !== 1) {
          this.$dialog.alert({ message: res.msg });
          this.code = "";
        } else {
          this.showConfirm = true;
        }
      });
    },

    // 注销请求
    cancelPost() {
      let json = {};
      if (this.cancelInfo.tel_status == 1 ) {
        json = {mobile: this.mobile};
      }
      $http.post("member.cancel.index", json, "注销中").then(res => {
        if (res.result !== 1) {
          this.$dialog.alert({ message: res.msg });
        } else {
          Toast(res.msg);
          this.isSubmitted = true;
        }
      });
    },

    confirmCancel() {
      this.cancelPost();
      this.closeConfirm();
    },
    // 关闭确认弹框
    closeConfirm() {
      this.showConfirm = false;
    },
    back() {
      this.$router.push(this.fun.getUrl("info", {}));
    },
    // 撤销申请
    revoke () {
      $http.post("member.cancel.cancel", {}, "撤销中").then(res => {
        console.log(res);
        if (res.result !== 1) {
          Toast(res.msg);
          return;
        }
        Toast('撤销成功');
        this.initData();
        this.getData();
      });
    }
  },

  components: {}
};
</script>
<style lang="scss" rel="stylesheet/scss">
.cancellation {
  padding: 1.25rem;

  .title {
    font-size: 1rem;
    font-weight: bold;
    color: #333;
  }

  .content {
    min-height: 68vh;
    overflow: hidden;
    margin-top: 1rem;
    text-align: left;
  }

  .bottom-box {
    margin-top: 1rem;
    padding-left: 0.8rem;
  }

  .btn-submit {
    margin: 0 auto;
    margin-top: 1rem;
    width: 19.13rem;
    height: 2.5rem;
    background-color: #f15353;
    border-radius: 1.25rem;
    font-size: 0.94rem;
    line-height: 2.5rem;
    color: #fff;
  }

  .disabled {
    color: #6b6666;
    background-color: transparent;
    background-image: linear-gradient(0deg, #d2d2d2 0%, rgba(210, 210, 210, 0.64) 100%) !important;
  }
}

.succesed {
  font-size: 0.94rem;

  .img {
    margin: 2.69rem 0 0.5rem 0;
    width: 6.44rem;
    height: 6.44rem;
  }

  .btns {
    margin-top: 1.7rem;
    display: flex;
    justify-content: space-around;

    .btn-cancel {
      width: 8.88rem;
      height: 2.5rem;
      border-radius: 1.25rem;
      border: solid 0.03rem #f15353;
      line-height: 2.4rem;
      color: #f15353;
    }

    .btn-back {
      width: 8.88rem;
      height: 2.5rem;
      border-radius: 1.25rem;
      line-height: 2.4rem;
      color: #fff;
      background-color: #f15353;
    }
  }
}

.confirm-popup {
  padding: 1.3rem 1.5rem 0.5rem 1.5rem;

  .pop-title {
    font-size: 1.13rem;
    color: #202020;
  }

  .pop-content {
    margin: 1.5rem 0;
    text-align: left;
  }

  .bottom-btns {
    height: 2.5rem;
    display: flex;
    color: #030303;
    border-top: solid 1px #eee;

    div {
      flex: 1;
      font-size: 1.06rem;
      line-height: 2.5rem;
    }

    .confirm {
      color: #f14e4e;
    }
  }
}

.mobile-verification {
  height: calc(100vh - 40px);
  background: #fff;

  .btn-submit {
    margin: 0 auto;
    margin-top: 4rem;
    width: 19.13rem;
    height: 2.5rem;
    background-color: #f15353;
    border-radius: 1.25rem;
    font-size: 0.94rem;
    line-height: 2.5rem;
    color: #fff;
  }

  .icon-verification_phone,
  .icon-fontclass-yanzhengma {
    font-size: 1.5rem;
    color: #888;
  }

  .van-field__left-icon {
    display: inline-flex !important;
  }
}
</style>
