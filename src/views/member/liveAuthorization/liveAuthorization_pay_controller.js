import yz_pay from "components/ui_components/yz_pay";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法

var self = null;
export default {
  mixins: [yzPay],
  beforeRouteLeave: function(to, from, next) {
    if (to.name == "HotelGoodsOrder") {
      this.$dialog.confirm({ message: "您还没完成支付，确认离开?" })
        .then(() => {
          self.$router.push(self.fun.getUrl("home", {}));
          next();
        }).catch(() => {
          next(false);
        });
    } else {
      next();
    }
  },
  data() {
    return {
      balance: 0,
      payParams: "",
      info_form: {},
      order_sn: "",
      money: "",
      buttons: [],
      typename: "",
      pay_sn: "订单编号",
      order_pay_id: "",
      uid: "",
      popupSpecs: false,
      pageUrl: "",
      // 余额字样
      balanceLang: this.fun.getBalanceLang(),
      alipayShow: false,

      showTitle: true,
      is_cps:false,
    };
  },
  methods: {
    confirm(btn) {
      let type = btn.value;
      // type-1 微信, type-2 支付宝,type-7 APP微信, type-8 APP支付宝 ,type-6 云收银支付,type-3 余额支付 type 28 微信支付-汇聚 type 29 支付宝支付-汇聚
      $http
        .get("plugin.room.frontend.code.pay-code", {
          id:this.$route.params.id,
          money:this.money,
          pay_id:type
        }, "支付中...")
        .then(response => {
          if (response.result == 1) {
            if (type == 1) {
              // 微信支付
              this.WXPay(response.config, response.redirect);
            } else if (type == 2) {
              // 直接跳支付宝
              window.location.href=response.data;
            } else if (type == 9) {
              // 微信云打包
              YDB.SetWxpayInfo(this.$store.state.temp.mailInfo.name, "订单号：" + response.data.order_sn, this.money, response.data.order_sn, this.fun.getKeyByI());
            } else if (type == 10) {
              // 支付宝云打包
              if (response.data.isnewalipay == 1) {
                YDB.SetRSA2AlipayInfo(
                  this.$store.state.temp.mailInfo.name,
                  this.fun.getKeyByI(),
                  this.money,
                  response.data.order_sn
                );
              } else {
                YDB.SetAlipayInfo(
                  this.$store.state.temp.mailInfo.name,
                  this.fun.getKeyByI(),
                  this.money,
                  response.data.order_sn
                );
              }
            } else if (type == 3) {
              // 余额
              if(response.data[0]){
                this.$router.push(this.fun.getUrl("liveAuthorization_scanCode", {}));
              }
            }
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          this.$dialog.alert({ message: error });
        });
    },
    WXPay(payParams, cbHref) {
      let that = this;
      wx.chooseWXPay({
        appId: payParams.appId,
        timestamp: payParams.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: payParams.nonceStr, // 支付签名随机串，不长于 32 位
        package: payParams.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: payParams.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: payParams.paySign, // 支付签名
        success: function(res) {
          // 支付成功后的回调函数
          if (res.errMsg == "chooseWXPay:ok") {
            that.$router.push(that.fun.getUrl("liveAuthorization_scanCode", {}));
          } else {

            that.$dialog.alert({
              message: "支付失败"
            });
            console.log(payParams, "支付失败参数咋样");
          }
        },
        cancel: function(res) {
          // 支付取消
        },
        fail: function(res) {
          that.$dialog.alert({
            message: "支付失败，请返回重试"
          });
        }
      });
    },
    // 多订单合并支付获取信息接口方法
    getMultipleOrderInfo() {
      // order.pay.wechatPay
      var that = this;
      let _url = "plugin.room.frontend.code.get-pay-type";
      $http
        .get(_url, {id: this.$route.params.id}, "...")
        .then(
          (response)=> {
            if (response.result == 1) {
              that.balance = Number(response.data.code.balance).toFixed(2);
              that.money = Number(response.data.code.money).toFixed(2);
              that.buttons = response.data.buttons;
            } else {
              that.$dialog.confirm({ message: '授权码已被购买' })
                .then(() => {
                  that.$router.replace(that.fun.getUrl("liveAuthorization"));
                }).catch(() => {
                });
            }
          });
    },
  },
  activated() {
    console.log(this.$route.params.id);
    this.getMultipleOrderInfo();
  },
  components: {
    yz_pay
  }
};
