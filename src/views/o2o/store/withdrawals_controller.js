import cTitle from "components/title";
// import { Toast } from 'vant';
export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      store: {
        name: "",
        thumb: ""
      },
      income: {
        money_total: 0.0,
        sure_withdraw_money: 0.0
      }
    };
  },
  activated() {
    this.toi = this.fun.getKeyByI();
    //获取数据
    this.getStoreInfo();
  },
  methods: {
    getStoreInfo() {
      var that = this;
      $http
        .get("plugin.store-cashier.frontend.store.center.index.index", {}, "")
        .then(
          function(response) {
            if (response.result == 1) {
              that.store = response.data.store;
              that.income = response.data.income;
              //that.credit = myData.credit;
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          function(response) {
            // error callback
          }
        );
    },
    confirm() {
      //withdraw_money
      var that = this;

      if (
        this.income.sure_withdraw_money == undefined ||
        this.income.sure_withdraw_money <= 0
      ) {
        this.$dialog.alert({message:`${this.fun.initWithdrawal()}金额不可低于0`});
        return;
      }

      $http
        .get(
          "plugin.store-cashier.frontend.store.center.withdraw.apply",
          {},
          "正在提交数据..."
        )
        .then(
          function(response) {
            if (response.result == 1) {
              that.$router.push(that.fun.getUrl("withdrawal"));
            } else {
              that.$dialog.alert({message:response.msg});

            }
          },
          function(response) {
            // error callback
          }
        );
    }
  },

  components: { cTitle }
};
