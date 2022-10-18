<template>
  <div id="details">
    <c-title :hide="false" text="详情"></c-title>
    <div id="tbs">
      <div class="item">
        <div class="left">订单编号</div>
        <div class="right">{{ item.serial_number }}</div>
      </div>

      <div class="item">
        <div class="left">金额</div>
        <div class="right">{{ item.change_money }}</div>
      </div>

      <div class="item">
        <div class="left">业务类型</div>
        <div class="right">{{ item.service_type_name }}</div>
      </div>

      <div class="item">
        <div class="left">{{ balanceLang }}</div>
        <div class="right">{{ item.new_money }}</div>
      </div>

      <div class="item">
        <div class="left"  v-if="item.action_type">{{ item.action_type }}ID</div>
        <div class="right" v-if="item.action_type">{{ item.transfer_member_id }}</div>
      </div>

      <div class="item">
        <div class="left"  v-if="item.action_type">{{ item.action_type }}名称</div>
        <div class="right" v-if="item.action_type">{{ item.transfer_member_name }}</div>
      </div>

      <div class="item" v-if="item.balance_recharge">
        <div class="left" v-if="item.balance_recharge.remark">备注信息</div>
        <div class="right" v-if="item.balance_recharge.remark">{{ item.balance_recharge.remark }}</div>
      </div>

    </div>
  </div>
</template>
<script>
import member_balance_detailscontroller from "./member_balance_detailscontroller";
export default member_balance_detailscontroller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#details {
  #tbs {
    background: #fff;
    padding: 0.625rem 0.875rem;
    line-height: 1.875rem;
    font-size: 12px;

    .item {
      flex: 1;
      display: flex;
    }

    .left {
      text-align: left;
      padding-right: 5px;
      color: #8c8c8c;
    }

    .right {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: right;
      flex: 1;
    }
  }
}
</style>
