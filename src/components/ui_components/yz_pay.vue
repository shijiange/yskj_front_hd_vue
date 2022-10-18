<template>
  <!--yz_pay 包括支付需要的弹窗和消费红包弹窗-->
  <div style="margin-bottom: 3rem;">
    <template v-if="payType">
      <van-radio-group v-model="radio" @change="radioChange">

      <div class="mod_btns" v-for="(btn, i) in payType" :key="i" v-show="btn.value != 57 && !popupSpecs">
        <a class="mod_btn">
          <i class="iconfont" :class="getIconUrl(btn)"></i>
          <div v-if="btn.value == 3" style="display: flex; flex-direction: column;">
            <span>{{ btn.name }}</span>
            <span v-if="balanceNum">可用:<span style="color: #f76d6d;">{{balanceNum}}</span>{{ $i18n.t('元') }}</span>
          </div>
          <span v-if="btn.value != 59 && btn.value != 71 && btn.value != 3 ">{{ btn.name }}{{ typename }}</span>
          <span v-if="(btn.value == 59 || btn.value == 71) && btn.value != 3">{{ btn.name }}</span>
          </a>
        <van-radio :name="btn.value" checked-color="#f15353"></van-radio>
      </div>
      </van-radio-group>

    </template>
    <div v-if="this.payType.length!==0" @click="submit" class="newSubTn" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">立即支付</div>
    <pay-keyboard :payKeyboardShow.sync="popupSpecs" @complete="onInput" @close="changePopupSpecs"></pay-keyboard>

    <van-popup v-model="showQR" :style="{ width: '80%' }">
      <img style="width: 15rem; height: 15rem; padding: 1rem;" :src="qrcode" alt=""/>
      <p style="font-weight: bold; font-size: 16px; padding-bottom: 0.5rem;">请用微信识别二维码支付</p>
    </van-popup>

    <van-popup v-model="showZFBQR" :style="{ width: '80%' }">
      <div v-show="isZFBQR">
        <canvas id="qrccode-canvas"></canvas>
        <p style="font-weight: bold; font-size: 16px; padding-bottom: 0.5rem;">请用支付宝识别二维码支付</p>
      </div>
      <p v-show="!isZFBQR" style="font-weight: bold; font-size: 16px; padding: 3rem;">正在为您生成二维码中，请稍后...</p>
    </van-popup>

    <div id="alipay-detail" v-if="alipayShow">
      <div class="bg">
        <img src="../../assets/images/alipay-bg.png" alt=""/>
      </div>
    </div>

    <!--消费红包-->
    <van-overlay :show="showPacket" @click="closePacket">
      <div class="wrapper">
        <div class="block" @click.stop>
          <img @click="toPacket" src="../../assets/images/consume_packet.png"/>
        </div>
      </div>
    </van-overlay>

  </div>
</template>

<script>
import payKeyboard from "components/payKeyboard";
export default {
  props: ["payType", "typename", "popupSpecs", "showQR", "qrcode", "showZFBQR", "isZFBQR", "alipayShow", "showPacket","balanceNum"],
  data() {
    return {
      payarr: "",
      radio:'',
      submitArr:''
    };
  },
  components: { payKeyboard },
  mounted() {
    if(this.payType && this.payType.length > 0) {
      this.submitArr = this.payType[0];
      this.radio = this.payType[0].value;
      // console.log(this.radio,this.submitArr);
    }
  },
  watch: {
    payType(val) {
      // 监听变化后的改动
      if(val && val.length > 0) {
        this.submitArr = val[0];
        this.radio = val[0].value;
        // console.log(this.radio,this.submitArr);
      }
    },
  },
  activated(){
    this.submitArr = '';
    this.radio = '';
  },
  methods: {
    radioChange(e){
      // console.log(e,this.payType);
      for(let key  in this.payType){
        if(this.payType[key].value == e){
          this.submitArr = this.payType[key];
          this.radio = this.payType[key].value;
        }
      }
    },
    submit() {
      console.log(this.submitArr);
      this.$emit("submit", this.submitArr);
    },
    getIconUrl(item) {
      let icon_url = "";
      switch (item.code) {
      case "wechatPay":
      case "cloudPayWechat":
      case "wechatApp":
      case "yunPayWechat":
      case "wftPay":
      case "yop":
      case "convergePayWechat":
      case "WechatScan":
      case "WechatFace":
      case "WechatJsapi":
      case "wechatAggregatePay":
      case "convergePaySeparate":
      case "wechatCpsAppPay":
        icon_url = "icon-pay_wechat";
        break;
      case "alipay":
      case "cloudPayAlipay":
      case "alipayApp":
      case "yunPayAlipay":
      case "wftAlipay":
      case "convergePayAlipay":
      case "yopAlipay":
      case "AlipayScan":
      case "AlipayFace":
      case "AlipayJsapi":
      case "alipayAggregatePay":
      case "convergeAliPaySeparate":
      case "sandpayAlipay":
        icon_url = "icon-pay_alipay";
        break;
      case "balance":
      case "MemberCard":
        icon_url = "icon-pay_yue";
        break;
      case "remittance":
        icon_url = "icon-pay_remittance";
        break;
      case "anotherPay":
        icon_url = "icon-pay_otherpay";
        break;
      case "UsdtPay":
        icon_url = "icon-pay_utsd";
        break;
      case "DepositPay":
        icon_url = "icon-pay_prepay";
        break;
      case "convergeQuickPay":
        icon_url = "icon-pay_quick";
        break;
      case "COD":
        icon_url = "icon-pay_cashondelivery";
        break;
      case "dcmScanPay":
        icon_url = "icon-fontclass-saomazhifu";
        break;
      case "parentPayment":
        icon_url = "icon-fontclass-daifu1";
        break;
      case "leshuaAlipay":
        icon_url = "icon-pay_alipay";
        break;
      case "leshuaWechat":
        icon_url = "icon-pay_wechat"
        break;
      case "yeepay":
        icon_url = "icon-pay_wechat"
        break;
      default:
        icon_url = "icon-pay_default";
        break;
      }
      return icon_url;
    },
    toPacket() {
      this.$router.replace(this.fun.getUrl("ConsumePacketSuccess", {}, { order_id: this.order_ids }));
    },
    closePacket() {
      this.$emit("closePacket");
    },
    changePopupSpecs(flag) {
      this.payarr = "";
      this.$emit("changePopupSpecs", false);
    },
    onInput(e) {
      // if (this.payarr.length < 6) {
      //   this.payarr = `${this.payarr}${e}`;
      //   if (this.payarr.length == 6) {
      //     this.keyboardDone(this.payarr);
      //   }
      // }
      this.keyboardDone(e);
    },
    // onDelete(e) {
    //   if (this.payarr.length > 0) {
    //     this.payarr = this.payarr.substr(0, this.payarr.length - 1);
    //   }
    // },
    keyboardDone(val) {
      this.$emit("changePopupSpecs", false);
      this.getVerifyPassword(val);
    },

    // 验证密码
    getVerifyPassword(pwd) {
      // order.pay.wechatPay
      $http.get("payment.password.check", { password: pwd }, "").then(
        (response) => {
          if (response.result == 1) {
            this.$emit("balancePay", pwd);
          } else {
            this.$dialog
              .confirm({ message: response.msg })
              .then(() => {
                if (response.data.code == 2001) {
                  // 商城支付密码设置未开启
                  // this.$router.go(-1)
                } else if (response.data.code == 2002) {
                  // 用户未设置支付密码
                  // 去设置密码
                  this.$router.push(this.fun.getUrl("set_balance_password", {}));
                } else if (response.data.code == 2003) {
                  // 支付密码错误
                }
              })
              .catch(() => {
                if (response.data.code == 2001) {
                  // 商城支付密码设置未开启
                } else if (response.data.code == 2002) {
                  // 用户未设置支付密码
                } else if (response.data.code == 2003) {
                  // 支付密码错误
                }
              });
          }
        });
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .newSubTn {
    width: 80%;
    height: 3rem;
    position: fixed;
    bottom: 1rem;
    left: 10%;
    border-radius: 0.3rem;
    background-color: #f15353;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mod_btns {
    margin: 0 0.3125rem;
    border-bottom: solid 1px #f4f4f4;
    text-align: left;
    padding-bottom: 0.875rem;
    padding-top: 0.875rem;
    padding-left: 0.5625rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .fa {
      font-size: 18px;
      color: #999;
    }

    .mod_btn {
      display: flex;
      align-items: center;
      flex: 1;
    }
  }

  .mod_btns:last-child {
    border-bottom: none;
  }

  .icon-pay_quick {
    color: #46e0d1;
    font-size: 28px;
    margin-right: 1rem;
  }

  .icon-pay_alipay {
    color: #29a1f7;
    font-size: 28px;
    margin-right: 1rem;
  }

  .icon-pay_yue {
    color: #ff7433;
    font-size: 28px;
    margin-right: 1rem;
  }

  .icon-pay_wechat {
    color: #09bb07;
    font-size: 28px;
    margin-right: 1rem;
  }

  .icon-pay_otherpay {
    color: #ffba00;
    font-size: 28px;
    margin-right: 1rem;
  }

  .icon-pay_remittance {
    color: #ff692f;
    font-size: 28px;
    margin-right: 1rem;
  }

  .icon-pay_utsd {
    color: #9000ff;
    font-size: 28px;
    margin-right: 1rem;
  }

  .icon-pay_prepay {
    color: #9000ff;
    font-size: 28px;
    margin-right: 1rem;
  }

  .icon-pay_default {
    color: #538ff9;
    font-size: 28px;
    margin-right: 1rem;
  }

  .icon-pay_cashondelivery {
    color: #ed3800;
    font-size: 24px;
    margin-right: 1rem;
  }

  .icon-fontclass-daifu1 {
    color: #f15353;
    font-size: 24px;
    margin-right: 1rem;
  }

  .icon-fontclass-saomazhifu {
    color: #f4a556;
    font-size: 24px;
    margin-right: 1rem;
  }

  .ispaskey {
    .van-number-keyboard {
      position: relative;
    }
  }

  #alipay-detail {
    background: rgba(0, 0, 0, 0.8);
    height: 100%;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 100;

    img {
      width: 100%;
      position: relative;
      top: -2.5rem;
    }
  }

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .block {
      width: 14rem;
      height: 18rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .pcStyle {
    width: 375px;
    margin: 0 auto;
    left: 50% !important;
    margin-left: -187.5px;
  }
</style>