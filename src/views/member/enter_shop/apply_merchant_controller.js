import cTitle from "components/title";
import { Toast } from 'vant';
// import { inherits } from "util";

export default {
  data() {
    return {
      goods_id: "",
      pay_type_id: "",
      total_price: "",
      isShowRead: true,
      isShowColse: false,
      goods: [{ goods_id: this.goods_id, pay_type_id: this.pay_type_id }],
      enter_goods: [],
      title: ""
    };
  },

  activated() {
    this.init();
    this.goods_buy();
    this.getAgreementTitle();
  },

  methods: {
    init() {
      this.popupSpecs = false;
    },
    goods_buy() {
      $http
        .get(
          "plugin.enter-goods.frontend.order.goods-buy",
          { goods_id: this.$route.query.goods_id },
          "加载中"
        )
        .then(res => {
          console.log(res);
          if (res.result === 1) {
            this.total_price = res.data.total_price;
            this.goods[0].pay_type_id = this.$route.query.pay_type_id;
            this.goods[0].goods_id = this.$route.query.goods_id;
            this.enter_goods = res.data.enter_goods;
          } else {
            Toast({
              message: res.msg,
              position: "bottom",
              duration: 5000
            });
            //   this.$router.go(-1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    isshow() {
      this.isShowColse = !this.isShowColse;
      this.isShowRead = !this.isShowRead;
    },
    getAgreementTitle() {
      $http
        .get("plugin.enter-goods.frontend.agreement.detail.index")
        .then(res => {
          if (res.result === 1) {
            this.title = res.data.title;
          } else {
            console.log(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAgreement() {
      this.$router.push(this.fun.getUrl("EnterProtocol"));
    },
    apply() {
      let that=this;
      if (this.isShowRead == true) {
        $http
          .get(
            "plugin.enter-goods.frontend.order.create",
            this.goods[0],
            "加载中..."
          )
          .then(res => {
            if (res.result === 1) {
              const isWeixin = this.$route.query.pay_type_id == 1;
              const alipay = this.$route.query.pay_type_id == 2;

              if (isWeixin) {
                let redirect_url = res.data.redirect;
                let {
                  appId,
                  timestamp,
                  nonceStr,
                  package: Package222,
                  signType,
                  paySign
                } = res.data.config;
                WeixinJSBridge.invoke(
                  "getBrandWCPayRequest",
                  {
                    appId: appId, //公众号名称，由商户传入
                    timeStamp: timestamp, //时间戳，自1970年以来的秒数
                    nonceStr: nonceStr, //随机串
                    package: Package222,
                    signType: signType, //微信签名方式：
                    paySign: paySign //微信签名
                  },

                  function(res) {
                    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                      that.$dialog.alert({message:"支付成功"});
                      window.location.href = redirect_url;
                    } else {
                      that.$dialog.alert({message:"支付失败"});
                    }
                  }
                );
              }

              // 跳转到支付宝
              if (alipay) {
                // window.location.href = res.data
                this.$router.push(
                  this.fun.getUrl("alipayCourse", {
                    status: "9",
                    url: res.data
                  })
                );
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        Toast({
          message: "请勾选协议",
          position: "bottom",
          duration: 2000
        });
      }
    }
  },
  components: { cTitle }
};
