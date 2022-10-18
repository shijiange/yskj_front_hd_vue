<template>
  <div class="data-item">
    <div class="data-header">
      <div class="data-order-sn van-ellipsis">{{ data.order_sn }}</div>
      <span class="data-status van-ellipsis">￥{{ data.dividend_amount }}</span>
    </div>
    <div class="data-footer">
      <span class="data-date">{{ data.created_at }}</span>
      <span class="data-type van-ellipsis">{{ data.bonus_type_name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"]
};
</script>

<style scoped>
.data-item {
  padding: 13px 0;
  margin: 0 14px;
  font-size: 13px;
  color: #333;
  border-top: 1px solid #ebebeb;
}

.data-item > div {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
}

.data-footer {
  margin-top: 12px;
}

.data-order-sn {
  flex-shrink: 0;
  max-width: 60%;
}

.data-status {
  flex-shrink: 0;
  margin-left: 5px;
  max-width: 40%;
  color: #f15353;
}

.data-date {
  flex-shrink: 0;
  margin-right: 10px;
  font-size: 12px;
}
</style>