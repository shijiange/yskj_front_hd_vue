<template>
  <div id="balance_recharge">
    <c-title v-if="!fun.isCPS()" :hide="false" text="订单支付"></c-title>
    <div class="pay-box">
      <!-- 新支付页面 -->
      <!-- <div class="account">
        <div class="span-first">
          <span>账</span><span>户</span><span>{{ balanceLang }}</span
          ><span>：</span>
        </div>
        <div class="span-two">
          <span>{{ balance }} </span>
          <span class="b">{{ $i18n.t('元') }}</span>
        </div>
      </div> -->
      <div class="pay-money">
        <div class="top">支付金额:</div>
        <div class="mid">
          <span class="s">{{ $i18n.t('money') }}</span> <span>{{ money }}</span>
        </div>
        <div class="bottom">
          支付流水号:<span>{{ order_sn }}</span>
        </div>
      </div>
    </div>
    <div style="height: 1.25rem;"></div>
    <!-- 新支付页面 -->
    <div id="payBtnList">
      <div class="sureBtn" @click="sureBtn" v-if="money == '0.00'">{{confirmPayText}}</div>

      <div class="title" v-if="money > 0">
        <span class="line"></span>
        <span>支付方式</span>
      </div>
      <template v-if="money > 0">
        <!--yz_pay 包括支付需要的弹窗和红包-->
        <yz_pay :payType="buttons" :typename="typename" @submit="confirm"
                :popupSpecs="popupSpecs" :showQR="showQR"
                :qrcode="qrcode" :showZFBQR="showZFBQR"
                :isZFBQR="isZFBQR" :alipayShow="alipayShow"
                :showPacket="showPacket"
                :balanceNum="balance"
                @closePacket="closePacket"
                @changePopupSpecs="changePopupSpecs" @balancePay="balancePay">
        </yz_pay>
      </template>
    </div>
    <van-dialog v-model="certified_show" title="温馨提示" :show-cancel-button="false" @confirm="getYeePayWeChatPayParams">
      <van-cell-group :border="false" style="text-align: left;">
        <van-cell :border="false" left>
          <van-cell value="*必须通过此人实名的支付工具进行付款" />
        </van-cell>
        <van-cell :border="false" left>
          <span slot="title" style="font-size: 12px;">姓名</span>
          <span slot="default" v-text="certified_info.realname"></span>
        </van-cell>
        <van-cell :border="false" center>
          <span slot="title" style="font-size: 12px;">身份证号</span>
          <span slot="default">{{ certified_info.idcard.length ? certified_info.idcard.replace(/(\d{3})\d*([0-9a-zA-Z]{3})/, '$1******$2') : '' }}</span>
        </van-cell>
      </van-cell-group>
    </van-dialog>
  </div>
</template>
<script>
import order_paymentcontroller from './order_paymentcontroller';
export default order_paymentcontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>

#balance_recharge {
  .pay-box {
    background: #fff;
    // width: 21.5625rem;
    border-radius: 0.4375rem;
    margin: 0.5625rem 1rem;

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
  // width: 21.56rem;
  padding: 0.75rem 0;
  background-color: #fff;
  border-radius: 0.43rem;
  margin: 0 1rem;
  margin-bottom: 2.56rem;
  overflow: hidden;
  box-sizing: border-box;

  .title {
    color: #f87070;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    .line {
      height: 0.875rem;
      width: 0.187rem;
      background-color: #f87070;
      display: inline-block;
      margin-right: 0.875rem;
    }
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

</style>
