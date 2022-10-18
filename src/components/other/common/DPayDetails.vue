<template>
  <div class="pay-details">
    <slot name="top" />
    <div class="balance" v-if="showBalance">
      <span class="balance-name">账户{{ balanceName }}：</span>
      <span class="balance-count">
        {{ balanceAmount }}
        <em>元</em>
      </span>
    </div>
    <div class="info">
      <div class="info-title">支付金额</div>
      <div class="info-amount">
        <span>￥</span>
        {{ amount }}
      </div>
      <slot name="info-bottom" />
      <div class="info-order-number" v-if="showOrderNumber">支付流水号：{{ orderNumber }}</div>
    </div>
    <slot name="bottom" />
  </div>
</template>

<script>
export default {
  props: {
    showBalance: {
      type: Boolean,
      default: true
    },
    balanceName: {
      type: String,
      default: ""
    },
    balanceAmount: {
      type: Number,
      default: 0
    },
    showOrderNumber: {
      type: Boolean,
      default: true
    },
    orderNumber: {
      type: String,
      default: ""
    },
    amount: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped>
.pay-details {
  background-color: white;
  border-radius: 7px;
}

.balance {
  display: flex;
  justify-content: space-between;
  padding: 16px 11px;
  border-bottom: 0.0625rem solid #f4f4f4;
}

.balance-name {
  line-height: 1.5rem;
  color: #999;
  font-size: 0.75rem;
}

.balance-count {
  color: #333;
  font-size: 1.125rem;
}

.balance-count em {
  font-size: 0.75rem;
  color: #333;
}

.info {
  padding: 20px;
  color: #999;
  font-size: 0.75rem;
}

.info-amount {
  margin: 16px 0;
  color: #f76d6d;
  font-size: 1.5rem;
}

.info-amount span {
  display: inline-block;
  font-size: 1.125rem;
}
</style>