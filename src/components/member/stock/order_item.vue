<template>
  <li class="order-item">
    <div class="order-header">
      <span class="order-number">{{ data.order_sn }}</span>
      <span class="order-amount" v-amount>{{ data.award_amount }}</span>
    </div>
    <div class="order-footer">
      <span class="order-time">{{ data.created_at }}</span>
      <span class="order-status">{{ data.award_status_text }}</span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    data: Object
  },
  directives: {
    amount: {
      inserted(el) {
        el.innerText = Number(el.innerText).toFixed(2);
      }
    }
  }
};
</script>

<style scoped>
.order-header,
.order-footer {
  display: flex;
  justify-content: space-between;
  align-content: center;
  font-size: 0.75rem;
  color: #333;
}

.order-item {
  padding: 0.875rem 0;
  border-bottom: 1px solid #ebebeb;
}

.order-item:last-child {
  border-bottom: none;
}

.order-amount {
  font-size: 0.8125rem;
  color: #f15353;
}

.order-footer {
  margin-top: 0.5313rem;
  color: #8c8c8c;
}
</style>