<template>
  <div id="active_record">
    <c-title :hide="false"
             text='活跃值记录'></c-title>
    <div class="content">
      <div class="list" v-for="(item,index) in datas" :key="index">
        <span>{{item.created_at}}</span>
        <span class="num">+{{item.change_active}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import active_record_controller from "./active_record_controller";
export default active_record_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#active_record {
  height: 100vh;
  background-color: #fff;
  overflow: scroll;

  .content {
    padding: 0 0.75rem;
    padding-top: 1rem;

    .list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.625rem;

      .num {
        color: #ff2c29;
      }
    }
  }
}
</style>
