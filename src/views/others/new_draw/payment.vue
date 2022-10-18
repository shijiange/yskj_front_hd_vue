<template>
  <div id="balance_recharge">
    <c-title :hide="false" text="支付"></c-title>
    <div class="pay-box">
      <!-- 新支付页面 -->
      <!-- <div class="account">
        <div class="span-first">
          <span>账</span><span>户</span><span>{{ balanceLang }}</span
          ><span>：</span>
        </div>
        <div class="span-two">
          <span>{{ balance }} </span>
          <span class="b">{{ $i18n.t("元") }}</span>
        </div>
      </div> -->
      <div class="pay-money">
        <div class="top">支付金额:</div>
        <div class="mid">
          <span class="s">{{ $i18n.t("money") }}</span> <span>{{ info_form.money * info_form.total }}</span>
        </div>
      </div>
    </div>
    <div style="height: 1.25rem;"></div>
    <!-- 新支付页面 -->
    <div id="payBtnList">
      <div class="title">
        <span class="line"></span>
        <span>支付方式</span>
      </div>
      <template>
        <div class="mod_btns" v-for="(btn, i) in buttons" :key="i" v-show="btn.value != 57">
          <a @click="confirm(btn)" class="mod_btn"> <i class="iconfont" :class="getIconUrl(btn)"></i>{{ btn.name }}</a>
          <i class="fa fa-angle-right"></i>
        </div>
      </template>
    </div>

    <!--yz_pay 包括支付需要的弹窗和红包-->
    <yz_pay :popupSpecs="popupSpecs"
            @changePopupSpecs="changePopupSpecs" @balancePay="balancePay">
    </yz_pay>
  </div>
</template>
<script>
import paymentcontroller from "./paymentcontroller";
export default paymentcontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.ispaskey {
  .van-number-keyboard {
    position: relative;
  }
}

#balance_recharge {
  .pay-box {
    background: #fff;
    width: 21.5625rem;
    border-radius: 0.4375rem;
    margin: 0.5625rem auto;

    .account {
      height: 2.875rem;
      border-bottom: solid 1px #f4f4f4;
      display: flex;
      justify-content: space-between;
      padding: 1rem 0.6875rem;

      .span-first {
        color: #999;
        font-size: 12px;
      }

      .span-two {
        color: #333;
        font-size: 18px;

        .b {
          display: inline-block;
          font-size: 12px;
          color: #333;
        }
      }
    }

    .pay-money {
      padding-top: 1.25rem;
      padding-bottom: 1.25rem;
      margin: 0 auto;

      .top {
        color: #999;
        font-size: 12px;
      }

      .mid {
        margin: 1rem 0;
        color: #f76d6d;
        font-size: 24px;

        .s {
          display: inline-block;
          font-size: 18px;
        }
      }

      .bottom {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

#payBtnList {
  width: 21.5625rem;
  padding: 0.75rem 0;
  background-color: #fff;
  border-radius: 0.4375rem;
  margin: 0 auto;
  margin-bottom: 2.5625rem;

  .title {
    color: #f87070;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    .line {
      height: 0.875rem;
      width: 0.1875rem;
      background-color: #f87070;
      display: inline-block;
      margin-right: 0.875rem;
    }
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
}

.sureBtn {
  background: #ff5d5c;
  color: white;
  width: 90%;
  margin: 0 auto;
  padding: 0.5rem;
  border-radius: 10px;
}

.pay-psw-info {
  overflow-y: scroll;
  width: 100vw;
  height: auto;
  background: #fff;
  max-height: 80vh;
  padding-top: 0.625rem;
}

footer {
  position: absolute;
  bottom: 0;
  width: 100vw;
  font-weight: 600;
}

.pay_btn {
  border-top: 0.0625rem solid #ddd;
  width: 100vw;
  height: auto;
}

.pay_btn li {
  width: 33%;
  float: left;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  background: #fff;
  font-size: 14px;
  border-right: 0.0625rem solid #ddd;
  border-bottom: 0.0625rem solid #ddd;
}

.pay_btn li:active {
  background: #c2c2c2;
}

.b9:active {
  background: #fff !important;
}

.b9 {
  background: #c2c2c2 !important;
}

.pay_content {
  width: 100vw;
  height: 3.125rem;
  margin-bottom: 0.625rem;
}

.pay_content_title {
  width: 100vw;
  height: 1.875rem;
  line-height: 1.875rem;
  margin-bottom: 0.625rem;
  font-size: 18px;
}

.pay_content_view {
  width: 100vw;
  height: 3.125rem; // margin-left: 2px;
  border-bottom: 0.0625rem solid #ddd;
  border-top: 0.0625rem solid #ddd;
  border-right: 0.0625rem solid #ddd;
}

.ipt_pay_p {
  line-height: 3.125rem;
  height: 3.125rem;
  font-size: 20px;
}

.ipt_pay {
  float: left;
  width: 16.27%;
  height: 3.125rem;
  text-align: center;
  border-left: 0.0625rem solid #ddd;
}

.fa-angle-right {
  flex: 0 0 1rem;
}

#alipay-detail {
  background: rgba(0, 0, 0, 0.8);
  height: 100%;
  position: fixed;
  width: 100%;
  top: 0;
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
</style>
