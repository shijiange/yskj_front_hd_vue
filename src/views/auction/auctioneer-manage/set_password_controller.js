import { Toast } from 'vant';
import cTitle from "components/title";
export default {
  //name: 'login',
  data() {
    return {
      start1: false,
      imgcode: "",
      form: {
        country: "86",
        mobile: "",
        password: "",
        confirm_password: "",
        captcha: "",
      },
      mydata: "",
      btnBg:'#ef4f4f',
      btnText:'获取短信验证码',
      btnTag:false,
      timer: null,
      count:'',
      toastSet: null,
      currrent:''
    };
  },

  components: {
    cTitle
  },
  mounted() {},

  methods: {
    verificationCode() {
      let that = this;
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
          message: '发送中',
        });
        //发送获取验证码的请求
        $http
          .get("member.register.sendWithdrawCode", {
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
        Toast.success('验证码已发送');
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
            this.btnText = this.count + "s后重新获取";
            this.btnTag = true;
            this.btnBg = '#999';
          } else {
            this.btnTag = false;
            this.btnBg = '#ef4f4f',
            this.btnText = "获取短信验证码";
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },

    confirm() {
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
      let json={
        art:'setPassword',
        repeat:this.form.confirm_password,
        passwd:this.form.password,
        mobile:this.form.mobile,
        code:this.form.code
      };
      $http.post("plugin.auction.api.index.getAuctionData", json).then(
        response => {
          if (response.result == 1) {
            Toast(response.msg);
            this.$router.push(this.fun.getUrl("auctioneer"));
          } else {
            Toast(response.msg);
          }
        },
        response => {
          // error callback|
        }
      );
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
    this.getimgdata();
  }
};
