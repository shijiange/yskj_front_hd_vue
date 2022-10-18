<template>
  <div id="dealer_detail">
    <c-title :hide="false" :text="'奖励详情'"> </c-title>
    <div class="give_money">
        <p class="text">赠送金额（{{$i18n.t('元')}}）</p>
        <p class="number">{{dividend_amount}}</p>
    </div>
    <ul class="income_list">
        <li>
            <span class="left">一级总{{income_name_text}}/比例</span>
            <span>{{first_income}}/{{first_rate}}%</span>
        </li>
        <li>
            <span class="left">二级总{{income_name_text}}/比例</span>
            <span>{{second_income}}/{{second_rate}}%</span>
        </li>
        <li>
            <span class="left">三级总{{income_name_text}}/比例</span>
            <span>{{third_income}}/{{third_rate}}%</span>
        </li>
    </ul>
    <ul class="give_list">
        <li>
            <span class="left">赠送ID</span>
            <span>{{ID}}</span>
        </li>
        <li>
            <span class="left">赠送时间</span>
            <span class="time">{{created_at}}</span>
        </li>
    </ul>
  </div>
</template>

<script>
import dealer_detail_controller from "./dealer_detail_controller";

export default dealer_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#dealer_detail {
  .give_money {
    background: #fff;
    padding: 0.625rem 0;

    .text {
      font-size: 14px;
      line-height: 2rem;
    }

    .number {
      font-size: 30px;
      line-height: 3rem;
    }
  }

  .income_list,
  .give_list {
    margin-top: 0.625rem;
    background: #fff;
    padding: 0.625rem 0;

    li {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      line-height: 2.25rem;
      padding: 0 0.875rem;

      .left {
        color: #8c8c8c;
      }

      .time {
        font-size: 14px;
      }
    }
  }
}
</style>
