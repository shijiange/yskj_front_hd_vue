import cTitle from "components/title";
import loading from "components/loading";
import { Toast } from "vant";

export default {
  data() {
    return {
      alipay_url: "",
      uid: ""
    };
  },
  methods: {
    webToPay() {
      if (!this.fun.isWeiXin()) {
        window.location.replace(this.alipay_url);
      } else if (this.fun.getPhoneEnv() == "1") {
        let url = window.location;
        window.location = url;
      }
    },
    //余额充值
    toPay() {
      var that = this;
      $http
        .get(
          "finance.balance.alipay",
          {
            order_sn: this.$route.params.order_pay_id,
            uid: this.$route.params.uid,
            pay_type: 2,
            recharge_money: this.$route.params.recharge_money
          },
          "正在充值"
        )
        .then(
          function(response) {
            if (response.result == 1) {
              that.alipay_url = response.data;
              //alert(response.data);
              that.webToPay();
            } else {
              that.$dialog.alert({ message: response.msg });
            }
          },
          function(response) {
            // error callback
          }
        );
    },
    //订单支付
    toPayOrder() {
      var that = this;
      var payUrl = "";
      if (that.$route.params.money) {
        payUrl = "order.merge-pay.wft-alipay";
      } else {
        payUrl = "order.merge-pay.alipay";
      }
      $http
        .get(
          payUrl,
          {
            pid: this.$route.query.pid ? this.$route.query.pid : window.localStorage.getItem("uid"),
            uid: this.$route.params.uid,
            order_pay_id: this.$route.params.order_pay_id
          },
          "loading"
        )
        .then(
          response => {
            if (response.result == 1) {
              if (that.$route.params.money) {
                that.alipay_url = response.data.code_url;
              } else {
                that.alipay_url = response.data;
              }

              that.webToPay(response.data);
            } else {
              that.$dialog.alert({ message: response.msg }).then(() => {
                this.$router.go(-1);
              });
            }
          },
          function(response) {
            // error callback
          }
        );
    },

    //金币充值
    toPayByGold() {
      var that = this;
      let json = {
        pay_type: 2,
        change_value: this.$route.params.recharge_money,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep(),
        uid: this.$route.params.uid
      };
      $http.get("plugin.gold.frontend.controllers.recharge", json, "正在充值").then(
        function(response) {
          if (response.result == 1) {
            that.alipay_url = response.data;
            that.webToPay();
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
          that.$dialog.alert({ message: response.msg });
        }
      );
    },

    //押金充值 租赁
    toPayByCash() {
      var that = this;
      let json = { payment: 2, order_sn: this.$route.params.order_pay_id };
      $http.get("plugin.lease.Frontend.Modules.Deposit.Controllers.recharge.pay", json, "正在充值").then(
        function(response) {
          if (response.result == 1) {
            that.alipay_url = response.data;
            that.webToPay();
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
          that.$dialog.alert({ message: response.msg });
        }
      );
    },

    toPayUrl() {
      this.alipay_url = this.$route.params.url;
      this.webToPay();
    },

    //冻结币 支付宝支付
    toFrozen() {
      var that = this;
      $http.get("plugin.froze.Frontend.Modules.Froze.Controllers.recharge.alipay", { order_sn: this.$route.params.order_pay_id }, "正在充值").then(
        function(response) {
          if (response.result == 1) {
            that.alipay_url = response.data;
            that.webToPay();
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    //爱心值 支付宝支付
    toLove() {
      var that = this;
      $http.get("plugin.love.Frontend.Modules.Love.Controllers.recharge.alipay", { order_sn: this.$route.params.order_pay_id }, "正在充值").then(
        function(response) {
          if (response.result == 1) {
            that.alipay_url = response.data;
            that.webToPay();
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        },
        function(response) {
          // error callback
        }
      );
    },

    //爱心值支付宝充值
    toLoveRecharge() {
      console.log(this.$route.params.order_pay_id);
      $http
        .get("plugin.love.Frontend.Modules.Love.Controllers.recharge.alipay", { order_sn: this.$route.params.pay_id }, "正在充值")
        .then(res => {
          if (res.result == 1) {
            this.alipay_url = res.data;
            this.webToPay();
          } else {
            this.$dialog.alert({ message: res.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 支付宝支付（服务商）
    alipayapiPay() {
      $http
        .get("order.merge-pay.alipay-jsapi-pay", {
          order_pay_id: this.$route.params.order_pay_id,
          pid: this.$route.params.uid
        })
        .then(
          response => {
            if (response.result === 1) {
              this.alipay_url = response.data;
              this.webToPay();
            } else {
              this.$dialog.alert({ message: response.msg });
            }
          },
          function(response) {
            Toast(response.msg);
          }
        );
    },

    // 第三方支付 支付宝-汇聚
    getwechatPayAili() {
      const that = this;
      let json = { order_pay_id: this.$route.params.order_pay_id };
      $http.get("order.merge-pay.alipay-pay-hj", json).then(
        res => {
          if (res.result == 1) {
            this.alipay_url = res.data.data.rc_Result;
            that.webToPay();
          } else {
            this.$dialog
              .alert({ message: res.msg })
              .then(() => {
                this.$router.go(-1);
              })
              .catch(() => {});
          }
        },
        function(res) {
          that.$dialog.alert({ message: res.msg });
        }
      );
    }
  },
  activated() {
    let hasParamsUrl = ["6", "7", "8", "9", "5", "hj_url", "79", "80", "handSign"]; //hasParamsUrl包含的则params带有url，可直接调用toPayUrl（）跳转的
    if (!this.fun.isWeiXin()) {
      if (this.$route.params.status == "2") {
        //订单支付
        this.toPayOrder();
      } else if (this.$route.params.status == "1") {
        if (this.$route.params.tag == "frozen") {
          console.log("冻结币执行了");
          this.toFrozen();
        } else if (this.$route.params.tag == "love") {
          console.log("爱心值执行了");
          this.toLove();
        } else {
          //余额充值
          console.log("余额充值执行了");
          this.toPay();
        }
      } else if (this.$route.params.status == "3") {
        //金币充值
        this.toPayByGold();
      } else if (this.$route.params.status == "4") {
        //押金充值
        this.toPayByCash();
      } else if (this.$route.params.status == "11") {
        //爱心值支付宝充值
        this.toLoveRecharge();
      } else if (this.$route.params.status == "49") {
        // 支付宝支付（服务商）
        this.alipayapiPay();
      } else if (this.$route.params.status == "29") {
        // 汇聚支付宝支付
        this.getwechatPayAili();
      } else if (hasParamsUrl.includes(this.$route.params.status)) {
        //直接跳转链接
        this.toPayUrl();
      }
    }
  },
  components: { cTitle, loading },
  created() {
    var u = navigator.userAgent;
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isIOS) {
      location.href = document.location.protocol + "//" + window.location.host + "/addons/yun_shop/" + "?menu#" + this.$route.fullPath;
    }
    // window.location.href = window.location.href;
    // console.log("ssssssssssss", window.location.href, this.$route);
  }
};
