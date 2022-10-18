import { Toast } from "vant";
import cTitle from "components/title";

export default {
  //name: 'login',
  data() {
    return {
      start1: false,
      imgcode: "",
      country_code: 0,
      form: {
        country: "86",
        mobile: "",
        mobileErr: "",
        password: "",
        passwordErr: "",
        confirm_password: "",
        confirm_passwordErr: "",
        captcha: ""
      },
      mydata: "",
      is_enable: 0,
      next_enable: null,
      fathername: "",
      mothername: "",
      btnBg: "#f15353",
      btnText: "获取短信验证码",
      btnTag: false,
      timer: null,
      count: "",
      toastSet: null,
      visibleSet: false,
      visibleSure: false,
    };
  },

  components: {
    cTitle
  },
  mounted() {
  },

  methods: {
    verificationCode() {
      let that = this;
      if (this.fun.isTextEmpty(this.form.country)) {
        Toast("请输入国际区号");
        return;
      }
      if (this.fun.isTextEmpty(this.form.mobile)) {
        Toast("请填写手机号");
        return;
      }

      if (this.form.country == "86" && this.fun.isMoblie(this.form.mobile)) {
        Toast("请填写正确的手机号");
        return;
      }

      if (this.fun.isTextEmpty(this.form.captcha) && this.imgcode) {
        Toast("请填图形验证码");
      } else {
        Toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          message: "发送中"
        });
        //发送获取验证码的请求
        $http
          .get("member.register.sendCodeV2", {
            mobile: this.form.mobile,
            state: this.form.country,
            captcha: this.form.captcha,
            code: this.form.code,
            reset: "1",
            sms_type: 2
          })
          .then(
            response => {
              console.log(response);
              console.log("打印response");
              Toast.clear();
              if (response.result == 1) {
                that.sendCodeAnimation();
              } else {
                //刷新图形验证码
                this.form.captcha = "";
                this.getimgdata();
                Toast(response.msg);
                console.log("22");
              }
            },
            response => {
              console.log(response.msg);
            }
          );
      }
    },

    //发送验证码 倒计时
    sendCodeAnimation() {
      const TIME_COUNT = 60;
      if (!this.timer) {
        this.count = TIME_COUNT;
        Toast.success("验证码已发送");
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
            this.btnText = this.count + "s后重新获取";
            this.btnTag = true;
            this.btnBg = "#999";
          } else {
            this.btnTag = false;
            this.btnBg = "#f15353";
            this.btnText = "获取短信验证码";
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },

    findpwd() {
      if (this.fun.isTextEmpty(this.form.country)) {
        Toast("请输入国际区号");
        return;
      }

      if (this.is_enable == 0) {
        if (this.fun.isTextEmpty(this.form.mobile)) {
          Toast("请填写手机号");
          return;
        }

        if (this.form.country == "86" && this.fun.isMoblie(this.form.mobile)) {
          Toast("请填写正确的手机号");
          return;
        }

        if (this.fun.isTextEmpty(this.form.code)) {
          Toast("请填验证码");
          return;
        }
      }
      if (this.is_enable == 1) {
        if (this.fun.isTextEmpty(this.form.mobile)) {
          Toast("请填写账号");
          return;
        }
      }


      if (this.fun.isTextEmpty(this.form.password)) {
        Toast("请填写密码");
        return;
      }

      if (this.fun.isTextEmpty(this.form.confirm_password)) {
        Toast("请填写确认密码");
        return;
      }

      if (this.form.password != this.form.confirm_password) {
        Toast("两次密码不一致");
        return;
      }

      if (this.imgcode) {
        if (this.fun.isTextEmpty(this.form.captcha)) {
          Toast("图形验证码不能为空");
          return;
        }
      }
      let url;
      let data;
      if (this.is_enable == 0) {
        url = "member.register.changePassword";
        data = this.form;
      } else if (this.is_enable == 1) {
        url = "plugin.account-login.frotend.member.forgetPassword";
        data = {
          country: this.form.country,
          account: this.form.mobile,
          mobileErr: this.form.mobileErr,
          password: this.form.password,
          passwordErr: this.form.passwordErr,
          confirm_password: this.form.confirm_password,
          confirm_passwordErr: this.form.confirm_passwordErr,
          captcha: this.form.captcha,
          fathername: this.fathername,
          mothername: this.mothername
        };
      }
      $http.post(url, data).then(
        response => {
          if (response.result == 1) {
            // let member_id = response.data.member_id;
            this.$store.commit("savemodel", response.data);
            this.$dialog.alert({ message: "修改成功" })
              .then(() => {
                if (this.fun.isWeiXin()) {
                  this.$router.push(this.fun.getUrl("member"));
                } else {
                  this.$router.push(this.fun.getUrl("login"));
                }
              }).catch(() => {
              });
          } else {
            this.$store.commit("alerts", response.msg);
            //this.form = {};
          }
        },
        response => {
          // error callback|
        }
      );
    },
    getCountryCode() {
      // 判断是否显示区号
      $http.get("member.register.getInviteCode", {
        basic_info: 1
      }).then((res) => {
        if (res.result == 1) {
          this.country_code = res.data.country_code;
          if (!this.fun.isTextEmpty(res.basic_info.plugin_setting)) {
            if (!this.fun.isTextEmpty(res.basic_info.plugin_setting.account_login)) {
              if (this.next_enable == null) {
                this.is_enable = res.basic_info.plugin_setting.account_login.enable;
              } else {
                console.log(this.next_enable);
                this.is_enable = this.next_enable;
              }
            }
          }
        }
      });
    },

    //获取图片验证码
    getimgdata() {
      $http
        .get("home-page.getCaptcha")
        .then(res => {
          this.imgcode = res.data.captcha.img;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  activated() {
    if (this.$route.params.enable == 0 || this.$route.params.enable == 1) {
      this.next_enable = this.$route.params.enable;
    }
    this.getCountryCode();
    this.getimgdata();
  }
};
