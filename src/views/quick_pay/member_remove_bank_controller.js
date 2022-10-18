import { Toast } from "vant";
export default {
  data () {
    return {
      card_id: "",
      member_phone: "",
      v2_code: "",
      count: "",
      isOpenCaptcha: false,
      imgCodeLink: "",
      captcha: "",
    };
  },
  activated () {
    this._initData();
    this.card_id=this.$route.params.card_id;
    this.getMemberPhone();

  },

  methods: {
    _initData () {
      this.member_phone = "";
      this.v2_code = "";
      this.count = "";
      this.isOpenCaptcha = false;
      this.imgCodeLink = "";
      this.captcha = "";
    },

    // 获取会员绑定的手机号
    getMemberPhone () {
      return $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.get-mobile", {}, "loading")
        .then((res) => {
          if (res.result !== 1) {
            return this.$toast(res.msg);
          }
          if (res.data.get_captcha && res.data.get_captcha.captcha) {
            this.imgCodeLink = res.data.get_captcha.captcha.img;
            this.isOpenCaptcha = res.data.get_captcha.captcha.status;
          }
          if (res.data.mobile) {
            this.member_phone = res.data.mobile;
          } else {
            this.$dialog.confirm({
              title: "提示",
              message: "商城会员没有绑定手机号，请绑定手机号"
            }).then(() => {
              this.$router.push(this.fun.getUrl("editmobile"));
            }).catch(() => {
              this.$router.go(-1);
            });
          }

        });
    },

    // 刷新图形验证码
    getCaptchaImg () {
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.get-mobile", {}, "loading")
        .then((res) => {
          if (res.result !== 1) {
            return this.$toast(res.msg);
          }
          if (res.data.get_captcha && res.data.get_captcha.captcha) {
            this.imgCodeLink = res.data.get_captcha.captcha.img;
          }
        });
    },

    // 获取验证码
    VerificationCode() {
      if (this.isOpenCaptcha == 1 && this.fun.isTextEmpty(this.captcha)) {
        return Toast("请填写图形验证码");
      }
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "发送中"
      });
      $http
        .post("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.send-code", { captcha: this.captcha })
        .then(
          response => {
            Toast.clear();
            if (response.result == 1) {
              this.getCode();
            } else {
              Toast(response.msg);
            }
          },
          response => {
            console.log(response.msg);
          }
        );
    },
    // 60秒倒计时
    getCode() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            clearInterval(this.timer);
            this.count = 0;
            this.timer = null;
          }
        }, 1000);
      }
    },

    confirmRemoveBank () {
      if (this.fun.isTextEmpty(this.v2_code)) {
        Toast("请输入验证码");
        return;
      }
      $http
        .get('plugin.converge_pay.frontend.controllers.quick-pay-bank-card.del', { card_id: this.card_id, code: this.v2_code})
        .then(response => {
          if (response.result == 1) {
            Toast(response.msg);
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  },

  deactivated () {
    this.timer && clearInterval(this.timer);
  },

  components: {},
};