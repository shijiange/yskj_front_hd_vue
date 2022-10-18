<template>
  <div id="details">
    <c-title :hide="false" text="详情"></c-title>
    <div style="height: 5px;"></div>
    <ul>
      <li id="tbs">
        <div class="left">业务类型</div>
        <div class="right">{{ detailInfo.source_name }}</div>
      </li>
      <li id="tbs">
        <div class="left">变动{{ integral ? integral : "积分" }}</div>
        <div class="right">{{ detailInfo.point }}</div>
      </li>
      <li id="tbs">
        <div class="left">当前{{ integral ? integral : "积分" }}</div>
        <div class="right">{{ detailInfo.after_point }}</div>
      </li>
      <li id="tbs">
        <div class="left">变动备注</div>
        <div class="right">{{ detailInfo.remark }}</div>
      </li>
    </ul>
  </div>
</template>
<script>
import member_balance_detailscontroller from "./member_integraldetailedcontroller";

export default member_balance_detailscontroller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#details {
  #tbs {
    display: flex;
    align-items: center;
    background: #fff;
    flex-flow: row wrap;
    padding: 0.625rem;
    line-height: 1.5rem;
    font-size: 12px;

    .left {
      text-align: left;
      color: #858585;
      margin-right: 0.5rem;
    }

    .right {
      flex: 1;
      text-align: right;
      word-break: break-all;
    }
  }
}
</style>
