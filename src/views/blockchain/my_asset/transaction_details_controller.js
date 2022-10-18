import cTitle from 'components/title';
import { Toast } from 'vant';

var dataJSON = {};
export default {
  data() {
    return {
      type: '',
      detail_id: '',
      detailData: {},
      dataApi: '',
      show2: false,
      lang: {},

      //支付密码
      popupSpecs: false,
      pwds: [],
      pwd: "",
      pw1: "",
      pw2: "",
      pw3: "",
      pw4: "",
      pw5: "",
      pw6: "",

      income_name_text: "",
    };
  },
  activated() {
    this.detail_id = this.$route.params.id;
    this.type = this.$route.query.name;
    switch (this.type) {
    //认购详情
    case 'buy':
      this.dataApi = 'plugin.asset.Frontend.Modules.Digitization.Controllers.subscription-detail.index';
      break;
      //出售详情
    case 'sell':
      this.dataApi = 'plugin.asset.Frontend.Modules.Digitization.Controllers.sell-detail.index';
      this.isSetPassword();
      break;
      //买入详情
    case 'deal':
      this.dataApi = 'plugin.asset.Frontend.Modules.Digitization.Controllers.buy-detail.index';
      break;
    default:
      this.dataApi = '';
      break;
    }
    this.getLang();
    this.getDetail();
    this.customizeIncome();
  },
  deactivated() {
    this.initData();
  },
  methods: {
    getLang() {
      $http.get('plugin.asset.Frontend.Controllers.Lang.index', {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.lang = response.data;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },

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
      $http.get('plugin.asset.Frontend.Modules.Password.Controllers.validate.index', {password: pwd}, "").then((response) => {
        if (response.result === 1) {
          // that.balancePay(pwd);
          this.sureCancel();
        } else {
          that.$dialog.confirm({ message:response.msg})
            .then(() => {
              if (response.data.code == 2001)//商城支付密码设置未开启
              {
                //that.$router.go(-1);
              } else if (response.data.code == 2002)//用户未设置支付密码
              {
                //去设置密码
                that.$router.push(that.fun.getUrl('SetPassword', {}));
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
      }, function (response) {
        that.$dialog.alert({message:response.msg});
      });
    },

    balancePay(password) {
      var that = this;
      let json = {
        order_pay_id: that.order_pay_id,
        "i": that.fun.getKeyByI(),
        "type": that.fun.getTyep(),
        pid: this.uid
      };

      if (!this.fun.isTextEmpty(password)) {
        json = {
          order_pay_id: that.order_pay_id,
          "i": that.fun.getKeyByI(),
          "type": that.fun.getTyep(),
          payment_password: password,
          pid: this.uid
        };
      }
      $http.get('order.credit-merge-pay.credit2', json, " ").then(function (response) {
        if (response.result === 1) {
          if (that.fun.isTextEmpty(response.data.redirect)) {

            that.$router.push(that.fun.getUrl("home"));
            that.$dialog.alert({message:response.msg});
				

          } else {
            window.location.href = response.data.redirect;
            that.$dialog.alert({message:response.msg});
					
          }
        } else {
          that.$dialog.alert({message:response.msg});
          that.$router.push(that.fun.getUrl('orderdetail', {order_id: that.order_pay_id}));

        }
      }, function (response) {
        // error callback
      });

    },
    cancel() {
      if (this.has_mobile) {
        if (this.has_password) {
          // 已经设置过密码
          this.popupSpecs = true;
        } else {
          // 还没设置过密码
          this.show2 = true;
        }
      } else {
        Toast('请先绑定手机');
        this.$router.push(this.fun.getUrl('editmobile'));
      }
    },
    sureCancel() {
      let Json = {
        sell_id: this.detail_id
      };
      $http.post('plugin.asset.Frontend.Modules.Digitization.Controllers.sell-recall.index', Json, "加载中").then(response => {
        if (response.result === 1) {
          this.getDetail();
          this.$dialog.alert({message:response.msg});
				
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    initData() {
      this.detailData = {};
      this.dataApi = '';

      this.pwds = [];
      this.pwd = "";
      this.popupSpecs = false;
      this.show2 = false;
    },
    setJSON(){
      switch (this.type) {
      //认购详情
      case 'buy':
        dataJSON = {
          record_id: this.detail_id
        };
        break;
        //出售详情
      case 'sell':
        dataJSON = {
          sell_id: this.detail_id
        };
        break;
        //买入详情
      case 'deal':
        dataJSON = {
          record_id: this.detail_id
        };
        break;
      default:
        this.dataApi = '';
        break;
      }
    },
    getDetail() {
      this.setJSON();
      $http.get(this.dataApi, dataJSON, "加载中").then(response => {
        if (response.result === 1) {
          this.detailData = response.data.detail;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    isSetPassword() {
      $http.get('plugin.asset.Frontend.Modules.Password.Controllers.has.index', {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.has_mobile = response.data.has_mobile;
          this.has_password = response.data.has_password;
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //自定义提现收入语言
    customizeIncome(){
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  components: {cTitle}
};
