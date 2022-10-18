<template>
  <div id="distribution">
    <c-title :hide="false" :text="'佣金详情'"></c-title>
    <div class="ul" v-if="list.length>0">
      <div class="li" v-for="(item,index) in list" :key="index">
        <div class="li-left">
          <div>{{item.order_sn}}</div>
          <div style="font-size: 0.8125rem;">{{item.created_at}}</div>
        </div>
        <div class="li-right">
          <div>佣金</div>
          <div style="color: #ff7554; font-size: 1rem;">+{{item.dividend_amount}}</div>
        </div>
        
      </div>
    </div>
    <div class="ul" v-else style="padding-top: 4rem;">
      ~~暂无数据~~
    </div>
  </div>
</template>

<script>
import commission_detail_controller from "./commission_detail_controller";

export default commission_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#distribution {
  background: #fff;
  min-height: 100vh;

  .ul {
    .li {
      width: 100%;
      display: flex;
      padding: 0.75rem;
      line-height: 1.5rem;
      border-bottom: 1px solid #e5e5e5;

      .li-left {
        flex: 1;
        text-align: left;
      }

      .li-right {
        flex: 0 0 9rem;
        text-align: right;
      }
    }
  }
}
</style>
