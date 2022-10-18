import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      show2: false,
      asset_id: 0,
      digitization: {},

      buyNum: '',
      saleNum: '',
      checkDeductionList: [],
      lang: {
        sell_name: ''
      },

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
    this.asset_id = this.$route.params.asset_id;
    this.getSaleing();
    this.getLang();
    this.isSetPassword();
    this.customizeIncome();
  },
  deactivated() {
    this.initData();
  },
  computed: {
    total() {
      return (Number(this.buyNum) * Number(this.saleNum)).toFixed(2);
    },
    poundage() {
      return (this.total * Number(this.digitization.poundage_rate)).toFixed(2);
    },
    income() {
      return (this.total - this.poundage).toFixed(2);
    }
  },
  methods: {
    getLang() {
      $http.get('plugin.asset.Frontend.Controllers.Lang.index', {}, "加载中").then(response => {
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
      $http.get('plugin.asset.Frontend.Modules.Password.Controllers.validate.index', {password: pwd}, " ").then((response) => {
        if (response.result === 1) {
          this.sureSale();
        } else {
          that.$dialog.confirm({ message: response.msg})
            .then(() => {
              if (response.data.code == 2001) {
                //商城支付密码设置未开启
                //that.$router.go(-1);
              } else if (response.data.code == 2002) {
                //用户未设置支付密码
                //去设置密码
                that.$router.push(that.fun.getUrl('SetPassword', {}));
              } else if (response.data.code == 2003) {
                //支付密码错误
              }
					
            }).catch(() => {
              if (response.data.code == 2001) {
                //商城支付密码设置未开启

              } else if (response.data.code == 2002) {
                //用户未设置支付密码

              } else if (response.data.code == 2003) {
                //支付密码错误

              }
            });
        }
      }, function (response) {
        that.$dialog.alert({message:response.msg});
				
      });
    },
    toSetPassword() {
      this.$router.push(this.fun.getUrl('SetPassword', {}));
    },
    sale() {
      if (!this.buyNum) {
        Toast('请输入'+this.lang.sell_name+'数量');
        return;
      }
      if (Number(this.buyNum) > Number(this.digitization.member_usable)) {
        return;
      }
      if (!this.saleNum) {
        Toast('请输入'+this.lang.sell_name+'单价');
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
        Toast('请先绑定手机');
        this.$router.push(this.fun.getUrl('editmobile'));
      }
    },
    sureSale() {
      let Json = {
        asset_id: this.asset_id,
        total: this.buyNum,
        price: this.saleNum
      };
      $http.post('plugin.asset.Frontend.Modules.Digitization.Controllers.sell.retract', Json, "加载中").then(response => {
        if (response.result === 1) {
          // 出售完了之后跳转到哪里
          this.getSaleing();
          this.$dialog.alert({message:response.msg});
				
        } else {
          Toast(response.msg);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    initData() {
      this.pwds = [];
      this.pwd = "";
      this.popupSpecs = false;

      this.show2 = false;
      this.digitization = {};
      this.buyNum = '';
      this.saleNum = '';
      this.checkDeductionList = [];
    },
    getSaleing() {
      $http.get('plugin.asset.Frontend.Modules.Digitization.Controllers.sell.index', {asset_id: this.asset_id}, "加载中").then(response => {
        if (response.result === 1) {
          this.digitization = response.data;
        } else {
          Toast(response.msg);
          this.$router.go(-1);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    isSetPassword() {
      $http.get('plugin.asset.Frontend.Modules.Password.Controllers.has.index', {}, "加载中").then(response => {
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
    clearNoNum(){
      this.saleNum = this.saleNum.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
      this.saleNum = this.saleNum.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
      this.saleNum= this.saleNum.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
      this.saleNum = this.saleNum.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
      if(this.saleNum.indexOf(".")< 0 && this.saleNum !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        this.saleNum= parseFloat(this.saleNum);
      }
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
