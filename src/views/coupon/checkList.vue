<template>
  <div id="checkList">
    <c-title :hide="false" text="优惠券核销"></c-title>
    <div class="list" style="padding-top: 1.66rem;">
      <div class="left">名称</div>
      <div>{{lisinfo.name}}</div>
    </div>
    <div class="list">
      <div class="left">使用条件</div>
      <div>{{lisinfo.enough}}</div>
    </div>
    <div class="list">
      <div class="left">优惠</div>
      <div>{{lisinfo.discount}}</div>
    </div>
    <div class="list">
      <div class="left">适用范围</div>
      <div>{{lisinfo.range}}</div>
    </div>
    <div class="btn" @click="tapSure" v-if="orTap">确认核销</div>
    <div class="btn tapGet" v-if="!orTap">核销成功</div>
  </div>
</template>

<script>
import checkList_controller from './checkList_controller.js';

export default checkList_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#checkList {
  height: 100vh;
  background: #fff;
}

#checkList .list:nth-child(1) {
  padding-top: 1.66rem;
}

.list {
  margin: 0 1.22rem 0 1.59rem;
  display: flex;
  justify-content: space-between;
  padding: 0 0 1.63rem 0;
}

.btn {
  margin: 0 auto;
  width: 7.09rem;
  height: 2.28rem;
  background-color: #ff7070;
  font-size: 1.19rem;
  color: #fff;
  box-shadow:
    -0.01rem 0.09rem 0.33rem 0.01rem
    rgba(81, 81, 81, 0.45);
  border-radius: 0.43rem;
  text-align: center;
  line-height: 2.28rem;
}

.tapGet {
  background: #e6e6e6;
}

.orbtn {
  margin: 0 auto;
  width: 7.09rem;
  height: 2.28rem;
  background-color: #666;
  font-size: 1.19rem;
  color: #fff;
  box-shadow:
    -0.01rem 0.09rem 0.33rem 0.01rem
    rgba(81, 81, 81, 0.45);
  border-radius: 0.43rem;
  text-align: center;
  line-height: 2.28rem;
}
</style>