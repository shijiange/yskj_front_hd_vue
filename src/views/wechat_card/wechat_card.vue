<template>
  <div id="wechat_card">
    <c-title :hide="false"
             text='领取会员卡'></c-title>
    <div class="image" :style="{backgroundImage: 'url( '+ ticket.background_pic +')',}" v-if="!ticket.color">
      <div class="wrap">
        <div class="left">
          <img :src="ticket.logo">
        </div>
        <div class="right">
          <div class="top">{{ticket.brand_name}}</div>
          <div>{{ticket.title}}</div>
        </div>
      </div>
    </div>
    <div class="image" :style="{backgroundColor:this.color}" v-if="ticket.color">
      <div class="wrap">
        <div class="left">
          <img :src="ticket.logo">
        </div>
        <div class="right">
          <div class="top">{{ticket.brand_name}}</div>
          <div>{{ticket.title}}</div>
        </div>
      </div>
    </div>
    <div class="btn" @click="getType">
      立即领取
    </div>
  </div>
</template>
<script>
import wechat_card_controller from "./wechat_card_controller";

export default wechat_card_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #wechat_card {
    background-color: #fff;
    min-height: 100vh;

    .image {
      width: 19.375rem;
      height: 10.375rem;
      padding-top: 1rem;
      padding-left: 1rem;
      border-radius: 0.7813rem;
      background-size: 100% 100%;
      margin: 0 auto;
      margin-top: 1.5rem;

      .wrap {
        display: flex;
        align-items: center;

        .left {
          width: 2.875rem;
          height: 2.875rem;
          border-radius: 50%;

          img {
            width: 100%;
            border-radius: 50%;
          }
        }

        .right {
          margin-left: 0.75rem;
          flex-direction: column;
          display: flex;
          align-items: baseline;
          color: #fff;

          .top {
            font-size: 16px;
          }
        }
      }
    }

    .btn {
      width: 15.8125rem;
      height: 2.4375rem;
      background-color: #0eb90d;
      border-radius: 0.4375rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      margin-top: 3rem;
    }
  }
</style>
