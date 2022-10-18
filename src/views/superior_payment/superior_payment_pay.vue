<template>
  <div class="page">
    <c-title :text="title_name"></c-title>
    <div class="header">
      <div class="user-info">
        <div class="face">
          <img :src="payerImg" alt="" />
        </div>
        <div class="name">{{ payerName }} 请你帮忙代付一笔订单</div>
      </div>
      <div class="pay-text">代付金额</div>
      <div class="pay-price" v-if="networkLoading">{{ $i18n.t("money") }}{{ totalPrice }}</div>
      <div class="pay-explain">代付说明：代付前请和好友确认核实订单详情，避免下错订单</div>
    </div>
    <div class="order-wrapper">
      <order-info v-if="goodList.length > 0" :goodList="goodList" :totalPrice="totalPrice" :totalNum="totalNum"></order-info>
    </div>

    <template v-for="(btn, i) in btns">
      <div class="pay-btn" v-show="!isMiniprogram" :key="i" v-if="btn.value != 16">
        <Button :class="[btnclass2(btn.value)]" @click="confirm(btn)">{{ btn.name }}</Button>
      </div>
    </template>

    <!--yz_pay 包括支付需要的弹窗和红包-->
    <yz_pay :popupSpecs="popupSpecs" :showQR="showQR" :qrcode="qrcode" :showZFBQR="showZFBQR" :isZFBQR="isZFBQR" @changePopupSpecs="changePopupSpecs" @balancePay="balancePay"> </yz_pay>
  </div>
</template>

<script>
import superiorPaymentPayController from "./superior_payment_pay_controller";

export default superiorPaymentPayController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: rgb(235, 235, 235);
  min-height: 100vh;
}

.ispaskey {
  .van-number-keyboard {
    position: relative;
  }
}

.header {
  width: 100%;
  height: 10.625rem;
  padding: 0.75rem 0.938rem;
  background-image: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/superior_payment_pay_bg1.png);
  background-size: contain;

  .user-info {
    display: flex;
    align-items: center;

    .face {
      width: 2.188rem;
      height: 2.188rem;
      border-radius: 50%;

      img {
        width: 2.188rem;
        height: 2.188rem;
        border-radius: 50%;
      }
    }

    .name {
      padding-left: 0.531rem;
      font-size: 0.813rem;
      color: #fff;
    }
  }

  .pay-text {
    margin-top: 0.581rem;
    font-size: 0.938rem;
    color: #fff;
  }

  .pay-price {
    margin-top: 0.2rem;
    font-size: 1.438rem;
    color: #fff;
    font-weight: bold;
  }

  .pay-explain {
    margin-top: 0.8rem;
    text-align: left;
    font-size: 0.75rem;
    color: #fff;
  }
}

.order-wrapper {
  width: 100%;
  margin-top: -0.7rem;
  background-color: #fff;
  border-radius: 0.625rem 0.625rem 0 0;
}

.pay-btn {
  margin: 0.625rem 0.75rem;

  button {
    border: none;
    width: 100%;
    height: 2.25rem;
    border-radius: 0.25rem;
    color: #fff;
    font-size: 14px;
  }
}

.wei-btn {
  background-color: #13ce66;
}

.zhi-btn {
  background-color: #46b4ed;
}

.yu-btn {
  background-color: #f15353;
}

.dai-btn {
  background-color: #36db36;
}
</style>
