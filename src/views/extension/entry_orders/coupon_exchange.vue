<template>
  <div id="coupon_exchange">
    <c-title :hide="false"
             :text="integral ? integral : '积分兑换'"> </c-title>
    <div style="padding-top: 2.5rem;">
      <p class="Description">{{info.activity_name}}【{{info.start_time}} 至 {{info.end_time}}】</p>
      <div class="contaier">
        <p class="now_interlove">当前积分：{{info.credit1}}</p>
        <div class="now_get">
          <h2 class="title">兑换张数</h2>
          <input type="text"
                 placeholder="0"
                 v-model="wholesaleNum"
                 onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" />
          <div class="info">
            注：{{info.point_convert}}积分可兑换一张可使用{{info.wholesale_used_unm}}次的批发券
          </div>
        </div>
      </div>
    </div>
    <button type="button"
            class="btn custom_color"
            @click="pointSwap">
      确认兑换
    </button>
  </div>
</template>

<script>
import coupon_exchange_controller from "./coupon_exchange_controller";

export default coupon_exchange_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#coupon_exchange {
  .Description {
    text-align: left;
    line-height: 1.125rem;
    padding: 0.625rem 1rem;
    color: #e6a23c;
    background: #fdf6ec;
  }

  .contaier {
    background-color: #fff;
    padding: 0 1rem;

    .now_interlove {
      width: 100%;
      height: 2.81rem;
      text-align: left;
      display: inline-block;
      line-height: 2.81rem;
      font-size: 1rem;
      color: #333;
      border-bottom: 0.0625rem solid #e8e8e8;
    }

    .now_get {
      .title {
        height: 1.8rem;
        line-height: 1.8rem;
        font-size: 1rem;
        text-align: left;
        margin: 0.875rem 0 0.5rem;
        font-weight: 400;
      }

      input {
        line-height: 3.75rem;
        width: 100%;
        font-size: 2rem;
        border: none;
        border-bottom: 0.0625rem solid #e8e8e8;
      }

      .info {
        color: #8c8c8c;
        padding: 0.75rem 0;
        text-align: left;
      }
    }
  }

  button {
    width: 90%;
    margin-top: 1.25rem;
    height: 2.875rem;
    border-radius: 0.25rem;
    font-size: 1rem;
    color: #fff;
    background: #f15353;
    border: none;
  }
}
</style>
