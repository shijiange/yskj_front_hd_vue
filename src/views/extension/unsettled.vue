<template>
  <div id="commission">
    <c-title :hide="false" text="未结算佣金"></c-title>
    <div v-for="(item,i) in datas" :key='i'>
      <div class="tbs">
        <ul class="item1">
          <li>{{ item.order_sn }}</li>
          <li>{{ item.price }}{{$i18n.t('元')}}</li>
        </ul>
        <ul class="item2">
          <li class="reg">佣金 +{{ item.commission }}</li>
          <li>{{ item.created_at }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import unsettled_controller from "./unsettled_controller";
export default unsettled_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#commission {
  .times {
    text-align: left;
    text-indent: 0.625rem;
    line-height: 2rem;
    background: #ddd;
  }

  .tbs {
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0.625rem 0.75rem;
    border-bottom: 0.0625rem solid #e2e2e2;
    font-size: 14px;

    li {
      line-height: 1.5rem;
    }

    .item1 {
      color: #000;
      flex: 50%;
      text-align: left;
    }

    .item2 {
      flex: 50%;
      text-align: right;
      color: #8c8c8c;

      .reg {
        color: #259b24;
      }
    }
  }
}
</style>
