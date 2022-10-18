import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      show2: false,

      transfer: {},
      transferNum: "",
      transferAddress: "",

      //支付密码
      popupSpecs: false,
      pwds: [],
      pwd: "",
      pw1: "",
      pw2: "",
      pw3: "",
      pw4: "",
      pw5: "",
      pw6: ""
    };
  },
  activated() {
    this.asset_id = this.$route.params.asset_id;
    this.getBuying();
    this.isSetPassword();
  },
  deactivated() {
    this.initData();
  },
  computed: {
    poundage() {
      return (Number(this.transferNum) * Number(this.transfer.poundage_rate)).toFixed(2);
    },
    total() {
      return (Number(this.transferNum) + Number(this.poundage)).toFixed(2);
    }
  },
  methods: {
    initPop() {
      this.pwds = [];
      this.pwd = "";
      this.pw1 = "";
      this.pw2 = "";
      this.pw3 = "";
      this.pw4 = "";
      this.pw5 = "";
      this.pw6 = "";
    },
    //密码组装
    onPassword(value) {
      if (this.pwd.length < 6) {
        this.pwd = this.pwd + value;
        this.setPwdView();//设置密码显示
      }
      if (this.pwd.length === 6) {
        this.popupSpecs = false;
        this.getVerifyPassword(this.pwd);//请求密码验证接口
        this.initPop();//复位
      }
    },
    clearPassword() {
      this.popupSpecs = false;
      this.initPop();//复位
    },
    //设置密码 view显示
    setPwdView() {
      let pwdLength = this.pwd.length;
      if (pwdLength <= 0) {
        return;
      }
      switch (pwdLength) {
      case 1:
        this.pw1 = this.pwd.substring(0, 1);
        break;
      case 2:
        this.pw2 = this.pwd.substring(1, 2);
        break;
      case 3:
        this.pw3 = this.pwd.substring(2, 3);
        break;
      case 4:
        this.pw4 = this.pwd.substring(3, 4);
        break;
      case 5:
        this.pw5 = this.pwd.substring(4, 5);
        break;
      case 6:
        this.pw6 = this.pwd.substring(5, 6);
        break;
      default:
        break;
      }
    },

    //删除密码
    pwdDelete() {
      let pwdLength = this.pwd.length;
      if (pwdLength <= 0) {
        return;
      }
      // let that = this;

      switch (pwdLength) {
      case 1:
        this.pwd = this.pwd.substring(0, 0);
        this.pw1 = "";
        break;
      case 2:
        this.pwd = this.pwd.substring(0, 1);
        this.pw2 = "";
        break;
      case 3:
        this.pwd = this.pwd.substring(0, 2);
        this.pw3 = "";
        break;
      case 4:
        this.pwd = this.pwd.substring(0, 3);
        this.pw4 = "";
        break;
      case 5:
        this.pwd = this.pwd.substring(0, 4);
        this.pw5 = "";
        break;
      case 6:
        this.pwd = this.pwd.substring(0, 5);
        this.pw6 = "";
        break;
      default:
        break;
      }

    },
    //验证密码
    getVerifyPassword(pwd) {
      var that = this;
      $http.get("plugin.asset.Frontend.Modules.Password.Controllers.validate.index", { password: pwd }, " ").then((response) => {
        if (response.result == 1) {
          this.sureTransfer();
        } else {
          that.$dialog.confirm({ message: response.msg })
            .then(() => {
              if (response.data.code == 2001)//商城支付密码设置未开启
              {
                //that.$router.go(-1);
              } else if (response.data.code == 2002)//用户未设置支付密码
              {
                //去设置密码
                that.$router.push(that.fun.getUrl("SetPassword", {}));
              } else if (response.data.code == 2003) {//支付密码错误

              }
            }).catch(() => {
            // if (response.data.code == 2001)//商城支付密码设置未开启
            // {

              // } else if (response.data.code == 2002)//用户未设置支付密码
              // {

              // } else if (response.data.code == 2003) {//支付密码错误

            // }
            });
        }
      }, function(response) {
        that.$dialog.alert({ message: response.msg });

      });
    },

    toSetPassword() {
      this.$router.push(this.fun.getUrl("SetPassword", {}));
    },
    Transfer() {
      if (!this.transferNum) {
        Toast("请输入转出数量");
        return;
      }
      if (Number(this.transferNum) > Number(this.transfer.member_usable)) {
        return;
      }
      if (!this.transferAddress) {
        Toast("请输入转入方区块链地址");
        return;
      }
      if (this.has_mobile) {
        if (this.has_password) {
          // 已经设置过密码
          this.popupSpecs = true;
        } else {
          // 还没设置过密码
          this.show2 = true;
        }
      } else {
        Toast("请先绑定手机");
        this.$router.push(this.fun.getUrl("editmobile"));
      }
    },
    sureTransfer() {
      let Json = {
        asset_id: this.asset_id,
        total: this.transferNum,
        recipient: this.transferAddress
      };
      $http.post("plugin.asset.Frontend.Modules.Digitization.Controllers.transfer.retract", Json, "加载中").then(response => {
        if (response.result === 1) {
          this.getBuying();
          this.transferNum = "";
          this.transferAddress = "";
          this.$dialog.alert({ message: response.msg });

        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    initData() {
      this.transfer = {};
      this.transferNum = "";
      this.transferAddress = "";
      this.pwds = [];
      this.pwd = "";

      this.popupSpecs = false;
      this.show2 = false;
    },
    getBuying() {
      $http.get("plugin.asset.Frontend.Modules.Digitization.Controllers.transfer.index", { asset_id: this.asset_id }, "加载中").then(response => {
        if (response.result === 1) {
          this.transfer = response.data;
        } else {
          Toast(response.msg);
          this.$router.go(-1);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    isSetPassword() {
      $http.get("plugin.asset.Frontend.Modules.Password.Controllers.has.index", {}, "加载中").then(response => {
        if (response.result === 1) {
          this.has_mobile = response.data.has_mobile;
          this.has_password = response.data.has_password;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    }
  },
  components: { cTitle }
};
