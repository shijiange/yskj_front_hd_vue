<template>
  <div>
    <div class="order-item-block" v-for="(item, index) in orderList" :key="index">
      <div class="row row-1">
        <span class="order-num">{{ item.order_sn }}</span>
        <span class="welfare-amount">公益金额：{{ $i18n.t("money") }}{{ item.amount }}</span>
      </div>
      <div class="row row-2">
        <span class="date">{{ item.created_at }}</span>
        <span class="order-amount">订单金额：{{ $i18n.t("money") }}{{ (item.order && item.order.price) || 0 }}</span>
      </div>
    </div>
    <yz-blank :datas="orderList" text="空空如也"></yz-blank>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
export default {
  props: {
    orderList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },

  methods: {},

  components: { yzBlank }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.order-item-block {
  padding: 0.56rem;
  background-color: #ffffff;
  border-radius: 0.313rem;
  margin-top: 1rem;

  .row {
    display: flex;
    align-content: center;
    justify-content: space-between;
    .order-num {
      color: #292929;
    }
    .welfare-amount {
      color: #ff5a5a;
    }
    .date {
      color: #6b6b6b;
    }
    .order-amount {
      color: #ff5a5a;
    }
  }
  .row-1 {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 1rem;
  }
  .row-2 {
    font-size: 11px;
  }
}
</style>
