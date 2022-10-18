<template>
  <div id="exchangeDetail">
    <c-title :hide="false" :text="'换货'">
    </c-title>

    <div class="good-box">
      <div class="left">
        <img
          src="https://thirdwx.qlogo.cn/mmopen/yFAViaTLylmuuqIib1SE3tZDXiaeZ7H93tdHI5icm7zONiasUFd1AZQ3ug9YGDbFhvkb5CCPb9OCDFCTia92INFW5hm2K2sq6yj3If/132"
          alt="">
      </div>
      <div class="right">
        <p class="title">ClarifiqueValueset现货不用等</p>
        <div class="ticket">
          <p class="number text-over">兑换券 2张</p>
        </div>
      </div>
    </div>

    <!--<div class="good-content">-->
      <!--<p class="title">规格</p>-->
      <!--<div class="spec_box">-->
        <!--<span class="red">豪华版150ml</span><span class="gray">豪华版150ml</span><span>豪华版150ml</span>-->
        <!--<span>豪华版150ml</span><span>豪华版150ml</span><span>豪华版150ml</span>-->
      <!--</div>-->
    <!--</div>-->

    <div class="change-num">
      <p class="more">兑换商品数量</p>
      <div class="cart"><span class="del">-</span> <input class="input" type="text" placeholder="1"> <span class="add">+</span></div>
    </div>

    <div class="change-num" style="margin-top: 1rem;">
      <p class="more">最多可兑换25件库存</p>
      <p class="all">全部兑换</p>
    </div>

    <div class="car-btn" :style="{width: fun.getPhoneEnv() == 3 ?'375px':''}" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle':'']">
      <div class="orange"><span>换取兑换券</span><span style="font-size: 12px;">（当前兑换券：1）</span></div>
      <div class="change"><div>兑换</div></div>
    </div>
  </div>
</template>

<script>
import exchange_ticket_controller from "./exchange_ticket_controller";

export default exchange_ticket_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #exchangeDetail {
    background: #fff;
    min-height: 100vh;
    padding: 1rem;
  }

  .good-box {
    padding-bottom: 0.5rem;
    display: flex;

    .left {
      flex: 0 0 5rem;

      img {
        width: 5rem;
        height: 5rem;
        border-radius: 0.5rem;
      }
    }

    .right {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      margin: 0.5rem 0 0.5rem 0.5rem;
      font-size: 12px;
      width: 13rem;
    }

    .title {
      font-weight: bold;
      font-size: 15px;
      margin-bottom: 0.3rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .spec {
      color: #9f9f9f;
    }

    .ticket {
      margin-top: 0.75rem;
      display: flex;
    }

    .number {
      flex: 1;
      color: #fb9a00;
      align-self: center;
    }

    .exchange {
      background-color: #ffae00;
      border-radius: 15px;
      color: #fff;
      padding: 2px 0.5rem;
      line-height: 1rem;
    }
  }

  .good-content {
    text-align: left;

    .title {
      font-weight: bold;
    }

    .spec_box {
      display: flex;
      flex-wrap: wrap;
      margin: 0.5rem 0 1rem 0;

      span {
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 0.1rem 0.4rem;
        display: inline-block;
        margin: 0.5rem 0.5rem 0 0;
        word-break: break-all;
      }

      .red {
        color: #f01818;
        border: 1px solid #f01818;
      }

      .gray {
        color: #999;
        background: #f6f6f6;
      }
    }
  }

  .change-num {
    display: flex;
    text-align: left;

    input {
      border: none;
      outline: none;
    }

    .more {
      flex: 1;
      font-weight: bold;
    }

    .all {
      border-radius: 0.625rem;
      border: 1px solid #f01818;
      color: #f01818;
      width: 4.5rem;
      text-align: center;
    }
  }

  .cart {
    width: 5rem;
    height: 1.25rem;
    border: 1px solid #ccc;
    border-radius: 10px;
    text-align: center;

    .input {
      width: 2rem;
      text-align: center;
      border: 1px solid #eee;
    }

    .del,
    .add {
      width: 1rem;
      display: inline-block;
    }
  }

  .car-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    color: #fff;

    div {
      flex: 1;
      padding: 0.5rem 0;
    }

    .orange {
      display: flex;
      flex-direction: column;
      background-color: #ffae00;
    }

    .change {
      background-color: #ff4e00;
    }
  }

  .pcStyle {
    left: 50%;
    transform: translateX(-50%);
  }
</style>
