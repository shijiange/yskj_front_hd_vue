<template>
  <div class="pay-method">
    <slot name="title" >
      <div class="pay-method-title">{{ title }}</div>
    </slot>
    <ul class="pay-method-list" @click="selectedMethod($event)">
      <li class="pay-method-item" v-for="(methodItem,itemIndex) in data" :key="itemIndex">
        <div class="pay-method-mask" :data-index="itemIndex"></div>
        <slot :method="methodItem">
          <div>
            <i class="pay-method-icon iconfont" :class="[payMethodIcons[itemIndex]]"></i>
            <span class="pay-method-name">{{ methodItem.name }}</span>
          </div>
          <i class="pay-method-item-decoration fa fa-angle-right"></i>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script>
import { Toast } from "vant";
import { yzPay } from "../../../utils/yz_pay"; //引入支付方法
export default {
  mixins: [yzPay],
  props: {
    data: {
      type: Array,
      default: function () {
        return [];
      }
    },
    amount: {
      type: String || Number,
      default: ""
    },
    api: {
      type: String,
      default: ""
    },
    apiJson: {
      type: Object,
      default: function () {
        return {};
      }
    },
    custom: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "支付方式"
    },
  },
  data() {
    return {
      payMethodIcons: []
    };
  },
  methods: {
    selectedMethod(event) {
      let selectedIndex = event.target.dataset.index;
      let index = parseInt(selectedIndex);
      let name = this.data[index].name;
      let value = this.data[index].value;
      this.$emit("paying");
      this.balancePay(name, value)
        .then(({ data, msg, result }) => {
          if (result == 0) {
            Toast(msg);
            return;
          }
          switch (Number(value)) {
          case 1: // 微信
            wx.config(data.js);
            this.WXPay(data.config, data.redirect);
            break;
          case 2: // 支付宝
            if (this.custom) {
              return;
            }
            this.$router.push(
              this.fun.getUrl("alipayCourse", {
                status: "9",
                url: data
              })
            );
            break;
          case 3: // 余额
            // this.$toast.alert({message: msg});
            data.payMethodCode = value;
            if (result == 1) {
              this.$emit("pay-success", { data, msg, result });
            } else {
              this.$emit("pay-fail", { data, msg, result });
            }
            break;
          case 6: // 新版微信 link
            window.location.href = data;
            break;
          case 12: // 芸支付 微信
            this.newWXPay(data.config);
            break;
          case 7: // 云收银支付宝
            this.$router.push(
              this.fun.getUrl("alipayCourse", {
                status: "9",
                url: data
              })
            );
            break;
          case 28: // 汇聚微信支付
            this.hjWxPay(data);
            break;
          case 29: // 汇聚支付宝支付
            this.hjAlipay(data);
            break;
          case 9://app微信支付
            YDB.SetWxpayInfo(
              this.$store.state.temp.mailInfo.name,
              '订单号：' + data.order_sn,
              this.amount,
              data.order_sn,
              this.fun.getKeyByI()
            );
            break;
          case 10://app支付宝支付
            if (data.isnewalipay == 1) {
              YDB.SetRSA2AlipayInfo(
                this.$store.state.temp.mailInfo.name,
                this.fun.getKeyByI(),
                this.amount,
                data.order_sn,
              );
            } else {
              YDB.SetAlipayInfo(
                this.$store.state.temp.mailInfo.name,
                this.fun.getKeyByI(),
                this.amount,
                data.order_sn,
              );
            }
            break;
          default:
            Toast("不支持该付款方式");
            break;
          }
        });
    },
    balancePay(name, value) {
      return $http.post(this.api, {
        pay_method: value,
        pay_name: name,
        pay_type: value,
        ...this.apiJson
      }).then(res => {
        res.payMethodCode = value;
        if (res.result == 1) this.$emit("pay", res);
        return res;
      });
    },
    hjAlipay(data) {
      if (data.msg != '') {
        this.$dialog.alert({ message: data.msg });
      } else {
        window.href = data.rc_Result;
      }
    },
    hjWxPay(data) {
      let obj = JSON.parse(data.data.rc_Result);
      this.newWXPay(obj);
    },
    //旧版微信支付参数
    WXPay(payParams) {
      var that = this;
      wx.chooseWXPay({
        appId: payParams.appId,
        timestamp: payParams.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: payParams.nonceStr, // 支付签名随机串，不长于 32 位
        package: payParams.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: payParams.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: payParams.paySign, // 支付签名
        success: function (res) {
          // 支付成功后的回调函数
          if (res.errMsg == "chooseWXPay:ok") {
            that.$dialog.alert({ message: "支付成功" }).then(() => {
              that.$router.go(-1);
            });

          } else {
            that.$dialog.alert({ message: "支付失败" });
          }
        },
        cancel: function (res) {
          //支付取消
        },
        fail: function (res) {
          that.$dialog.alert({ message: "支付失败，请返回重试" });
        }
      });
    },
    //新版微信支付参数
    newWXPay(payParams) {
      var that = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: payParams.appId, //公众号名称，由商户传入
          timeStamp: payParams.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: payParams.nonceStr, //随机串
          package: payParams.package,
          signType: payParams.signType, //微信签名方式：
          paySign: payParams.paySign //微信签名
        },

        function (res) {
          that.b = res;
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            that.$dialog.alert({ message: "支付成功" });
          } else {
            that.$dialog.alert({ message: "支付失败" });
          }
        }
      );
    },
    addMethodIcon() {
      for (let methodItem of this.data) {
        this.payMethodIcons.push(this.getMethodIcon(methodItem.value));
      }
    },
    getMethodIcon(code) {
      switch (code.toString()) {
      case "1":
        return "icon-pay_wechat";
      case "2":
      case "49":
      case "62":
        return "icon-pay_alipay";
      case "3":
        return "icon-pay_yue";
      case "anotherPay":
        return "icon-pay_otherpay";
      default:
        return "icon-pay_default";
      }
    }
  },
  watch: {
    data() {
      this.payMethodIcons = [];
      this.addMethodIcon();
    }
  }
};
</script>

<style scoped>
.pay-method {
  padding: 0.75rem;
  background-color: white;
  border-radius: 7px;
}

.pay-method-title {
  position: relative;
  padding-left: 0.875rem;
  color: #f87070;
  font-size: 12px;
  text-align: left;
}

.pay-method-title::before {
  content: "";
  display: inline-block;
  vertical-align: sub;
  height: 0.875rem;
  width: 0.1875rem;
  background-color: #f87070;
  transform: translateX(-0.875rem);
}

.pay-method-list {
  margin-top: 1rem;
}

.pay-method-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 0.875rem;
}

.pay-method-mask {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.pay-method-item + .pay-method-item {
  border-top: solid 1px #f4f4f4;
}

.pay-method-icon {
  font-size: 28px;
}

.pay-method-icon.icon-pay_quick {
  color: #46e0d1;
  font-size: 28px;
  margin-right: 1rem;
}

.pay-method-icon.icon-pay_alipay {
  color: #29a1f7;
  font-size: 28px;
  margin-right: 1rem;
}

.pay-method-icon.icon-pay_yue {
  color: #ff7433;
  font-size: 28px;
  margin-right: 1rem;
}

.pay-method-icon.icon-pay_wechat {
  color: #09bb07;
  font-size: 28px;
  margin-right: 1rem;
}

.pay-method-icon.icon-pay_otherpay {
  color: #ffba00;
  font-size: 28px;
  margin-right: 1rem;
}

.pay-method-icon.icon-pay_remittance {
  color: #ff692f;
  font-size: 28px;
  margin-right: 1rem;
}

.pay-method-icon.icon-pay_utsd {
  color: #9000ff;
  font-size: 28px;
  margin-right: 1rem;
}

.pay-method-icon.icon-pay_prepay {
  color: #9000ff;
  font-size: 28px;
  margin-right: 1rem;
}

.pay-method-icon.icon-pay_default {
  color: #538ff9;
  font-size: 28px;
  margin-right: 1rem;
}

.pay-method-icon.icon-pay_cashondelivery {
  color: #ed3800;
  font-size: 24px;
  margin-right: 1rem;
}

.pay-method-name {
  margin-left: 1rem;
  vertical-align: super;
}

.pay-method-item-decoration {
  line-height: 31px;
  font-size: 18px;
  color: #999;
}
</style>