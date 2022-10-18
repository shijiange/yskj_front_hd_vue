<template>
  <div id="balanceDetail">
    <c-title :hide="false" :text="'余额明细'"> </c-title>
    <div class="box">
      <van-tabs v-model="active">
        <van-tab title="全部" name='1'></van-tab>
        <van-tab title="收入" name="2"></van-tab>
        <van-tab title="支出" name="3"></van-tab>
      </van-tabs>
      <div class="list">

      </div>
    </div>
  </div>
</template>

<script>
import balanceDetail_controller from './balanceDetail_controller';

export default balanceDetail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

.list {
  width: 23.406rem;
  height: 4.75rem;
  background-color: #fff;
  border-bottom: 1px solid #f5f5f5;
}
</style>