<template>
  <div id="test_alipay">
    <div v-if="this.fun.isAlipay()" class="J-weixin-tip weixin-tip">
      <div id="alipay-detail">
        <div class="bg">
          <img src="../../../assets/images/alipay-bg.png" alt="" />
        </div>
      </div>
    </div>
    <loading v-if="!this.fun.isAlipay()" :show="true"></loading>
  </div>
</template>

<script>
import wxpay_detail_controller from "./wxpay_detail_controller";
export default wxpay_detail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#alipay-detail {
  background: rgba(0, 0, 0, 0.8);
  height: 100%;
  position: fixed;
  width: 100%;

  img {
    width: 100%;
    position: relative;
    top: -2.5rem;
  }
}
</style>
