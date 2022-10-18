<template>
  <div id="card_code">
    <c-title :hide="false" :text="'名片码'"></c-title>
    <div id="code_box" v-show="loadingImg">
      <h1>{{ cardData.card_name }}专属名片码</h1>
      <div class="code">
        <img :src="cardData.qr_code" />
      </div>
      <ul class="code_text">
        <li class="text_a">此名片码可印刷在</li>
        <li class="text_b">纸质名片、宣传单、海报、易拉宝等宣传册上</li>
        <li class="text_c">扫一扫名片码即可查看</li>
        <div class="left_block"></div>
        <div class="right_block"></div>
      </ul>
    </div>

    <div style="width: 100%; height: 100%; padding: 1rem;" v-show="!loadingImg">
      <img style="width: 100%; height: 100%;" id="thecanvas" />
    </div>
    <!--<div class="car_btm_btn">-->
      <!--<button type="button">长按图片保存名片码</button>-->
    <!--</div>-->
  </div>
</template>

<script>
import card_code_controller from "./card_code_controller";

export default card_code_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#card_code {
  padding-bottom: 64px;

  #code_box {
    width: 21.5625rem;
    background: #fff;
    margin: 0.9375rem auto;
    padding: 0.625rem;

    h1 {
      font-size: 15px;
      line-height: 2.5rem;
    }

    .code {
      width: 15rem;
      height: 15rem;
      overflow: hidden;
      background: #fff;
      margin: 0.625rem auto;
      padding: 0.625rem;

      img {
        width: 100%;
      }
    }

    .code_text {
      border-top: dashed 0.0625rem #ebebeb;
      padding: 1.25rem 0;
      margin-top: 1.25rem;
      position: relative;

      .text_a {
        line-height: 1.5rem;
      }

      .text_b {
        line-height: 1.5rem;
        color: #50a6f9;
      }

      .text_c {
        line-height: 1.5rem;
        color: #8c8c8c;
        margin-top: 0.625rem;
        font-size: 13px;
      }

      .left_block {
        width: 1rem;
        height: 1rem;
        background: #f5f5f5;
        border-radius: 0.625rem;
        position: absolute;
        top: -0.5rem;
        left: -1.25rem;
      }

      .right_block {
        width: 1rem;
        height: 1rem;
        background: #f5f5f5;
        border-radius: 0.625rem;
        position: absolute;
        top: -0.5rem;
        right: -1.25rem;
      }
    }
  }

  .car_btm_btn {
    background: #fff;
    position: fixed;
    bottom: 0;
    padding: 0.625rem 0.9375rem;
    border-top: solid 0.0625rem #ebebeb;
    width: 100%;

    button {
      width: 100%;
      height: 2.5rem;
      background: #50a6f9;
      font-size: 16px;
      border: none;
      border-radius: 3.75rem;
      color: #fff;
    }
  }
}
</style>
