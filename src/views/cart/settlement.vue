<template>
  <div id="balance_recharge">
    <c-title :hide="false" text="转账"></c-title>
    <div style="margin-top: 0.625rem;"></div>
    <div class="my_wrapper">
      <span>账户余额</span>
      <div class="my-value">98411.05 {{$i18n.t('元')}}</div>
    </div>
    <div class="my_wrapper">
      <span>订单编号</span>
      <div class="my-value">EDS3453735325236635325</div>
    </div>
    <div class="my_wrapper">
      <span>支付金额</span>
      <div class="my-value"><span>911.05 </span> {{$i18n.t('元')}}</div>
    </div>
    <div style="height: 0.625rem;"></div>
    <van-button type="primary" color="#f15353" size="large" style="width: 90%; margin: 0 auto;" @click="confirm">确认支付
    </van-button>
  </div>
</template>
<script>
import cTitle from "components/title";
export default {
  data() {
    return {
      balance: 123123312,
      info_form: {}
    };
  },
  methods: {
    confirm() {}
  },
  components: { cTitle }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#balance_recharge {
  .my_wrapper {
    background: #fff;
    overflow: hidden;
    display: flex;
    padding: 0.625rem;

    span {
      flex: 1;
      font-size: 16px;
      line-height: 1;
    }

    .my-value {
      flex: 2;
      text-align: left;

      span {
        color: red;
      }
    }
  }
}
</style>
