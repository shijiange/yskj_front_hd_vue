<template>
  <div id="liveAuthorization_detail">
    <c-title :hide="false" text="直播授权码"></c-title>
    <div class="list" v-for="(item, ind) in info" :key="ind">
      <div class="left">
        <div class="name">{{ item.type_name }}({{item.level_name}})</div>
        <div style="font-size: 0.75rem; color: #666;">{{ item.created_at }}</div>
      </div>
      <div class="right" v-if="item.type ==1">{{item.change_num >= 0 ? "+" + item.change_num : item.change_num}}</div>
      <div class="right" v-if="item.type ==2" >{{ '-'+ item.change_num }}</div>
    </div>
  </div>
</template>
<script>
import liveAuthorization_detail_controller from "./liveAuthorization_detail_controller";
export default liveAuthorization_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#liveAuthorization_detail {
  .list {
    width: 100%;
    // height: 4.06rem;
    background: #fff;
    padding: 0.81rem 0.91rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.63rem;

    .left {
      height: 100%;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name {
        margin-bottom: 0.51rem;
        font-size: 1rem;
      }
    }

    .right {
      font-size: 0.81rem;
      color: #f14e4e;
    }
  }
}
</style>
