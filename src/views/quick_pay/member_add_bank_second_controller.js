import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      tapTimeOne: false,
      card_id: "",
      bank: [],
      payer_name: "",
      payer_phone: "",
      check_open: false,
      member_phone: "",
      imgCodeLink: "",
      captcha: "",
      v2_code: "",
      id_no: "",
      cvv: "",
      expire_date: "2016/06",
      card_no: "",
      bank_name: "",
      bank_type: "",
      id_type: "",
      user_agrt: "",
      checked: true,
      date: "2016-06",
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      radio: "",
      radio1: "",
      radio2: "",
      idType: [
        {
          id: "1",
          text: "身份证"
        },
        {
          id: "2",
          text: "军官证"
        },
        {
          id: "3",
          text: "士兵证"
        },
        {
          id: "4",
          text: "护照"
        },
        {
          id: "5",
          text: "港澳台居民往来通行证"
        },
        {
          id: "6",
          text: "临时身份证"
        },
        {
          id: "7",
          text: "户口本"
        },
        {
          id: "8",
          text: "警官证"
        },
        {
          id: "9",
          text: "外国人永久居留证"
        },
        {
          id: "10",
          text: "其他"
        },
        {
          id: "11",
          text: "外国护照"
        },
        {
          id: "12",
          text: "营业执照"
        }

      ],
      card: [
        {
          id: "0",
          text: "储蓄卡"
        },
        {
          id: "1",
          text: "信用卡"
        }
      ],
      datas: [
        {
          id: "1",
          text: "中国工商银行"
        },
        {
          id: "2",
          text: "中国银行"
        },
        {
          id: "3",
          text: "中信银行"
        },
        {
          id: "4",
          text: "上海银行"
        },
        {
          id: "5",
          text: "中国建设银行"
        },
        {
          id: "6",
          text: "光大银行"
        },
        {
          id: "7",
          text: "民生银行"
        },
        {
          id: "8",
          text: "北京银行"
        },
        {
          id: "9",
          text: "平安银行"
        },
        {
          id: "10",
          text: "交通银行"
        },
        {
          id: "11",
          text: "招商银行"
        },
        {
          id: "12",
          text: "广发银行"
        },
        {
          id: "13",
          text: "浦发银行"
        },
        {
          id: "14",
          text: "邮政银行"
        }
      ],
      count: '',
      isOpenCaptcha: false,
    };
  },

  activated() {
    this.initData();
    if (!this.$route.params.card_no) {
      this.$router.go(-1);
    } else {
      this.card_no = this.$route.params.card_no;
    }
    this.getMemberPhone();
  },

  mounted() {

  },
  methods: {
    initData() {
      this.bank = [];
      this.payer_name = "";
      this.payer_phone = "";
      this.check_open = false;
      this.member_phone = "";
      this.imgCodeLink = "";
      this.captcha = "";
      this.v2_code = "";
      this.id_no = "";
      this.cvv = "";
      this.expire_date = "2016/06";
      this.card_no = "";
      this.bank_name = "";
      this.bank_type = "";
      this.id_type = "";
      this.user_agrt = "";
      this.checked = true;
      this.date = "2016-06";
      this.show2 = false;
      this.show3 = false;
      this.show4 = false;
      this.show5 = false;
      this.radio = "";
      this.radio1 = "";
      this.radio2 = "";
    },
    // 获取会员绑定的手机号
    getMemberPhone () {
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.get-mobile", {}, "loading")
        .then((res) => {
          if (res.result !== 1) {
            return this.$toast(res.msg);
          }
          this.check_open = res.data.sms_check_open;
          if (res.data.get_captcha && res.data.get_captcha.captcha) {
            this.imgCodeLink = res.data.get_captcha.captcha.img;
            this.isOpenCaptcha = res.data.get_captcha.captcha.status;
          }
          // 开启短信验证
          if (res.data.sms_check_open == 1) {
            // 已绑定手机号
            if (res.data.mobile) {
              this.member_phone = res.data.mobile;
              this.getAgrement();
              this.getInfo();
              this.getBank();
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
          } else {
            this.getAgrement();
            this.getInfo();
            this.getBank();
          }
        });
    },
    getBank() {
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.index", {}, "").then(response => {
        if (response.result == 1) {
          this.bank = response.data;
        } else {
          this.bank = [];

        }
      }).catch(error => {
        console.log(error);
      });
    },
    getInfo() {
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.get-payer-info", {}, "").then(response => {
        if (response.result == 1 && response.data) {
          this.payer_name = response.data.payer_name;
          this.radio2 = response.data.id_type;
          this.id_no = response.data.id_no;
        }
      }).catch(error => {
        console.log(error);
      });
    },
    shijian() {
      // let y=this.date.split("-")[0];
      // let m=this.date.split("-")[1];
      // this.expire_date=`${y}/${m}`;
      this.date = this.timestampToTime(this.date);
      let y = this.date.split("-")[0];
      let m = this.date.split("-")[1];
      this.expire_date = `${y}/${m}`;
      this.date = this.expire_date;
      this.tapTimeOne = false;
    },
    //日期转化
    timestampToTime(timestamp) {
      var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + "-";
      let M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      let D = this.change(date.getDate()) + " ";
      let h = this.change(date.getHours()) + ":";
      let m = this.change(date.getMinutes());
      return Y + M + D + h + m;
    },
    change(t) {
      if (t < 10) {
        return "0" + t;
      } else {
        return t;
      }
    },
    getType() {
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.get-pay-type", {}, "").then(response => {
        if (response.result == 1) {
          if (response.data.pay_type == 1) {
            this.$router.push(this.fun.getUrl("memberchooseBank"));
          } else {
            this.$router.push(this.fun.getUrl("memberbindBank", { card_id: this.card_id }));
          }
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    addBank() {
      if (this.fun.isTextEmpty(this.bank_name)) {
        Toast("请选择所属银行");
        return;
      }
      if (this.fun.isTextEmpty(this.radio1)) {
        Toast("请选择银行卡类型");
        return;
      }
      if (this.fun.isTextEmpty(this.expire_date) && this.radio1 == "1") {
        Toast("请选择信用卡有效期");
        return;
      }
      if (this.fun.isTextEmpty(this.cvv) && this.radio1 == "1") {
        Toast("请填写安全码");
        return;
      }
      if (this.fun.isTextEmpty(this.payer_name)) {
        Toast("请输入持卡人姓名");
        return;
      }
      if (this.fun.isTextEmpty(this.payer_phone)) {
        Toast("请输入银行预留手机号");
        return;
      }
      if (this.check_open == 1 && this.fun.isTextEmpty(this.member_phone)) {
        Toast("请输入绑定手机号");
        return;
      }
      if (this.check_open == 1 && this.fun.isTextEmpty(this.v2_code)) {
        Toast("请输入验证码");
        return;
      }
      if (this.fun.isTextEmpty(this.checked)) {
        Toast("请同意用户协议");
        return;
      }
      var json;
      if (this.radio1 == "0") {
        json = {
          data: {
            card_no: this.card_no,
            payer_name: this.payer_name,
            payer_phone: this.payer_phone,
            id_no: this.id_no,
            id_type: this.radio2,
            bank_type: this.radio1,
            bank_name: this.bank_name,
          },
        };
      } else if (this.radio1 == "1") {
        json = {
          data: {
            card_no: this.card_no,
            payer_name: this.payer_name,
            payer_phone: this.payer_phone,
            id_no: this.id_no,
            id_type: this.radio2,
            bank_type: this.radio1,
            bank_name: this.bank_name,
            expire_date: this.expire_date,
            cvv: this.cvv,
          },
        };
      }
      if (this.check_open == 1) {
        json.code = this.v2_code;
      }
      $http.post("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.create", json, "").then(response => {
        if (response.result == 1) {
          this.card_id = response.data.id;
          Toast("添加成功");
          this.getType();
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getAgrement() {
      $http.get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.get-user-agrt", {}, "").then(response => {
        if (response.result == 1) {
          this.user_agrt = response.data.user_agrt;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    openDate() {
      this.tapTimeOne = true;
    },
    confirm() {
      this.show2 = false;
      this.datas.forEach((item, index, key) => {
        if (item.id == this.radio) {
          this.bank_name = item.text;
        }
      });
    },
    cardConfirm() {
      this.show3 = false;
      this.card.forEach((item, index, key) => {
        if (item.id == this.radio1) {
          this.bank_type = item.text;
        }
      });
    },
    typeConfirm() {
      this.show4 = false;
      this.idType.forEach((item, index, key) => {
        if (item.id == this.radio2) {
          this.id_type = item.text;
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
      if (this.fun.isTextEmpty(this.member_phone)) {
        return Toast("请填写需要绑定的手机号");
      }
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "发送中"
      });
      $http
        .get("plugin.converge_pay.frontend.controllers.quick-pay-bank-card.send-code", { captcha: this.captcha })
        .then(
          response => {
            Toast.clear();
            if (response.result == 1) {
              this.getCode();
            }
            Toast(response.msg);
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
    show2() {
      console.log("12343567");
    },


  },

  deactivated () {
    this.timer && clearInterval(this.timer);
  },
  components: { cTitle }
};