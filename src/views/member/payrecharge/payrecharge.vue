<template>
  <div id="paycharge">
    <c-title :hide="false" text="支付积分"></c-title>
    <div class="content">
      <p class="text_a">恭喜！本次交易你共获得</p>
      <h1 class="number">{{ integral }}</h1>
      <p class="text_b">积分</p>
      <ul class="reward">
        <li class="reward_a">积分可在{{ name }}</li>
        <li class="reward_b">免费换取礼品</li>
      </ul>
      <!-- <p class="download">快下载APP兑换吧</p> -->
      <button type="button" @click="gobtn" class="download_btn">
        下载{{ name }}
      </button>
    </div>
  </div>
</template>

<script>
import payrecharge_controller from "./payrecharge_controller.js";
export default payrecharge_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #paycharge {
    .content {
      width: 23.4375rem;
      height: 37.5rem;
      background-image: url(../../../assets/images/payrecharge_bgimg.png);
      background-size: 23.4375rem 37.5rem;
      background-repeat: no-repeat;
      padding-top: 2.5rem;

      .text_a {
        font-size: 20px;
        font-weight: bold;
      }

      .number {
        font-size: 40px;
        color: #e5322d;
        margin-top: 0.625rem;
      }

      .text_b {
        font-size: 20px;
        font-weight: bold;
        margin-top: 0.625rem;
      }

      .reward {
        margin-top: 5rem;

        .reward_a {
          font-size: 20px;
          color: #fff;
          font-weight: bold;
        }

        .reward_b {
          font-size: 32px;
          color: #fff;
          margin-top: 1.25rem;
          font-weight: bold;
        }
      }

      .download {
        font-size: 16px;
        color: #fff;
        margin-top: 5rem;
      }

      .download_btn {
        width: 80%;
        height: 3.125rem;
        font-weight: bold;
        border-radius: 3rem;
        border: none;
        background: #fff;
        box-shadow: 0.3125rem 0 1rem rgba(129, 29, 10, 0.3);
        margin-top: 3.75rem;
        font-size: 20px;
        color: #e5322d;
      }
    }
  }
</style>
