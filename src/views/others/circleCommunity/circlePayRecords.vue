<template>
  <div id="circlePayRecords">
    <c-title :hide="false" :text="'付费记录'"></c-title>
    <d-list
      @load="loadPaymentRecord"
      :finished="recordPagination.finished"
      :loading="recordPagination.loading"
    >
      <div class="circle-list">
        <div class="circle-item-wrapper">
          <circle-item
            :data="recordItem"
            v-for="recordItem in paymentRecords"
            :key="recordItem.id"
          >
            <span class="circle-created-at" slot="info">{{ recordItem.created_at }}</span>
            <span class="circle-join-price">￥{{ recordItem.money }}</span>
          </circle-item>
        </div>
      </div>
    </d-list>
    <Tabbar />
  </div>
</template>

<script>
import circlePayRecords_controller from "./circlePayRecords_controller";

export default circlePayRecords_controller;
</script>

<style scoped>
.circle-list {
  padding: 0 0.94rem 0 0.84rem;
  background: #fff;
}

.circle-item {
  padding: 0.9375rem 0;
  border-bottom: 0.0625rem solid #f2f2f2;
}

.circle-item:last-child {
  border: none;
}

.circle-created-at {
  color: #999;
  font-size: 0.75rem;
}

.circle-join-price {
  color: #ef0c0c;
}
</style>
