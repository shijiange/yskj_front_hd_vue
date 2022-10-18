<template>
  <div id="flightInformationDetailList">
    <c-title :hide="false" :text="'航班信息收集记录'"> </c-title>
    <div style="width: 100%; height: 40px;"></div>
    <div class="list" v-for="(item,ind) in info" :key="ind">
      <div class="time">{{item.created_at}}</div>
      <div class="btn" @click="goDetail(item)" >查看</div>
    </div>
  </div>
</template>
<script>
import flightInformationDetailList_controller from "./flightInformationDetailList_controller";

export default flightInformationDetailList_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.list {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  align-items: center;
  margin: 1rem;
  background-color: #fff;
  border-radius: 0.35rem;
}

.btn {
  background-color: red;
  border-radius: 1rem;
  padding: 0.22rem 0.73rem;
  color: #fff;
}
</style>
