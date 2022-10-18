import cTitle from "components/title";
import { Toast } from 'vant';
export default {
  components: { cTitle },
  data() {
    return {
      deposit: 0,
      alipay: false,
      balance: false,
      wechat: false,
      withdraw_money: ""
    };
  },

  activated() {
    this.init();
    this.getData();
    this.fun.setWXTitle("押金" + this.fun.initWithdrawal());
  },

  methods: {
    //初始化
    init() {
      this.deposit = 0;
      this.alipay = false;
      this.balance = false;
      this.wechat = false;
      this.withdraw_money = "";
    },

    //获取数据
    getData() {
      var that = this;
      $http
        .get(
          "plugin.lease.Frontend.Modules.Deposit.Controllers.withdraw.page",
          {},
          "加载中..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              that.deposit = response.data.deposit;
              that.alipay = response.data.alipay;
              that.balance = response.data.balance;
              that.wechat = response.data.wechat;
            } else {
              that.$dialog.alert({message:response.msg});
            }
          },
          function(response) {
            that.$dialog.alert({message:response});
          }
        );
    },

    //提现动作
    withdraw(type) {
      if (this.fun.isTextEmpty(this.withdraw_money)) {
        Toast(`${this.fun.initWithdrawal()}钱数不能为空`);
        return;
      }

      if (this.withdraw_money <= 0) {
        Toast(`${this.fun.initWithdrawal()}钱数必需大于0`);
        return;
      }

      var that = this;
      let json = { withdraw_type: type, withdraw_money: this.withdraw_money };
      $http
        .get(
          "plugin.lease.Frontend.Modules.Deposit.Controllers.withdraw.take",
          json,
          `${this.fun.initWithdrawal()}中...`
        )
        .then(
          function(response) {
            if (response.result == 1) {
              that.$dialog.alert({message:response.msg}).then(()=>{
                that.$router.go(-1);
              });

            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          function(response) {
            that.$dialog.alert({message:response});
          }
        );
    }
  }
};
