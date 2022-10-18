<template>
  <div id="commission">
    <c-title :hide="false"
             :text='`未${this.fun.initWithdrawal()}收入详情`'></c-title>
    <div class="atitem">
      <div class="times">预计收入 <font>+3</font>
      </div>
      <div class="tbs">
        <div class="item1">分销等级</div>
        <div class="item2">等级名称 一级</div>
        <div class="item1">结算佣金</div>
        <div class="item2">5%</div>
        <div class="item1">结算天数</div>
        <div class="item2">5</div>
        <div class="item1">分佣时间</div>
        <div class="item2">--</div>
        <div class="item1">{{this.fun.initWithdrawal()}}时间</div>
        <div class="item2">--</div>
        <div class="item1">{{this.fun.initWithdrawal()}}方式</div>
        <div class="item2">--</div>
      </div>
    </div>

    <div class="atitem">
      <div class="goods">
        <b><img src="../../assets/images/forecast.png" /></b>
        <font>商品名称</font>
        <span>500</span>
      </div>
      <div class="tbs">
        <div class="item1">订单号</div>
        <div class="item2">SHE91234656165456451335</div>
        <div class="item1">支付金额</div>
        <div class="item2">500.45</div>
        <div class="item1">确认收货时间</div>
        <div class="item2">2017.09.11 09:32:22</div>
      </div>
    </div>

  </div>

</template>
<script>
import notPresentDetails from "./notPresentDetails_controller";
export default notPresentDetails;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#commission {
  .times {
    text-align: left;
    text-indent: 0.625rem;
    line-height: 2rem;
    border-bottom: #d9d9d9 solid 0.0625rem;
    font-weight: bold;
    font-size: 16px;

    font {
      color: #008000;
      padding-left: 0.8125rem;
    }
  }

  .atitem {
    padding: 0.625rem;
    background: #fff;
    margin-bottom: 0.625rem;
  }

  .goods {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    b {
      flex: 2;

      img {
        width: 80%;
      }
    }

    font {
      flex: 5;
      text-align: left;
    }

    span {
      flex: 1;
      text-align: right;
    }
  }

  .tbs {
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0.625rem 0;
    line-height: 1.5rem;

    .item1 {
      color: #a79d9d;
      flex: 35%;
      text-align: left;
      padding-left: 0.9375rem;
      box-sizing: border-box;
    }

    .item2 {
      flex: 65%;
      text-align: left;
      color: #000;

      .reg {
        color: #259b24;
      }
    }
  }
}
</style>