import cTitle from "components/title";
export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      balance: 0,
      //是否开启充值
      recharge: 0,
      transfer: 0,
      withdraw: 0,
      //充值是否开放微信充值
      recharge_wx: 0,
      //充值是否开放支付宝充值
      recharge_alipay: 0,
      //提现到微信1-开 0-关
      withdrawToWechat: 0,
      withdrawToAlipay: 0,
      //余额
      member_credit2: 0.0,
      //余额字样
      balanceLang: this.fun.getBalanceLang(),
      income_name_text: "",

      dataInfo: {} //保存信息
    };
  },
  methods: {
    //充值的响应方法
    chargeHandel() {
      if(JSON.parse(window.localStorage.getItem("globalParameter")).ios_virtual_pay  == "1" && this.fun.isIphone()){
        this.$dialog.alert({
          message: '十分抱歉，由于相关规定，你暂时无法在这里充值！'
        });
        return false;
      }
      //this.$router.push('/member/balance_recharge');
      if (this.recharge == 1) {
        this.fun.getUrl("balance_recharge", { balance: this.member_credit2 });
        this.$router.push(
          this.fun.getUrl("balance_recharge", {
            balance: this.member_credit2,
            wx: this.recharge_wx,
            alipay: this.recharge_alipay
          })
        );
      } else {
        this.$dialog.alert({message:"您的充值功能未开启"});
       
      }
    },
    //转账的响应方法
    transferHandel() {
      //this.$router.push('/member/balance_transfer');
      if (this.transfer == 1) {
        this.$router.push({
          name: "balance_transfer",
          params: { balance: this.member_credit2 },
          query: { i: this.toi }
        });
      } else {
        this.$dialog.alert({message:"您的转账功能未开启"});
        
      }
    },
    //提现的响应方法
    withdrawHandel() {
      //this.$router.push('/member/balance_withdrawals');
      if (this.withdraw == 1) {
        this.$router.push({
          name: "balance_withdrawals",
          params: {},
          query: { i: this.toi }
        });
      } else {
        this.$dialog.alert({message:`您的${this.fun.initWithdrawal()}功能未开启`});
        
      }
    },
    //转化爱心值
    transformingLoveV() {
      this.$router.push(this.fun.getUrl("transformLoveV"));
    },
    getBalance() {
      var that = this;
      $http
        .get(
          "finance.balance.balance",
          { i: this.fun.getKeyByI(), type: this.fun.getTyep() },
          "加载中..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              //console.log(response.data);
              that.dataInfo = response.data;
              that.member_credit2 = response.data.credit2;
              that.transfer = response.data.transfer;
              that.recharge = response.data.recharge;
              that.withdraw = response.data.withdraw;
              that.withdrawToWechat = response.data.withdrawToWechat;
              that.withdrawToAlipay = response.data.withdrawToAlipay;
            } else {
              that.$dialog.alert({message:response.msg});
              
            }
          },
          function(response) {
            that.$dialog.alert({message:response.msg});
            
          }
        );
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义收入字段
      this.income_name_text = mailLanguage.income.income_name;
    }
  },
  activated() {
    this.dataInfo = {};
    this.toi = this.fun.getKeyByI();
    this.getBalance();
    console.log(this.balanceLang);
    //this.balance = this.$route.params.balance_value;
    this.fun.setWXTitle(this.balanceLang);
    this.customizeIncome();
  },
  components: { cTitle }
};
