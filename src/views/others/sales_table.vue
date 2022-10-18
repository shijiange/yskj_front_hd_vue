<template>
  <div class="sales_table">
    <div class="banner">
      <van-swipe indicator-color="#fff"
                 :autoplay="3000">
        <van-swipe-item v-for="(item, index) in banners"
                        :key="index">
          <a class="banner-link"
             @click="bannerTo(item)">
            <img :src="item.pic_url">
          </a>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="content">
      <div class="amount" >今日总销量:{{amounts}}</div>
      <div class="block">
        <div class="item" v-for="(item,index) in arr" :key="index" >
          <img :src="background[index].thumb">
          <div class="text">
            <h3 style="margin-bottom: 1rem;" :style="{ color:background[index].color}">{{item.name}}</h3>
            <div style="margin-left: 0.6rem; text-align: left; font-size: 12px; margin-bottom: 1rem; color: #666;">累计:{{item.total}}</div>
            <div style="margin-left: 0.6rem; text-align: left; font-size: 12px; margin-bottom: 1rem; color: #666;">今日:{{item.today_total}}</div>
            <div style="margin-left: 0.6rem; text-align: left; font-size: 12px; color: #666;" v-if="item.nums">分配人数:{{item.nums}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sales_table_controller from './sales_table_controller';

export default sales_table_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.sales_table {
  height: 100vh;
  background-color: #fff;

  .banner {
    width: 100%;

    .banner-link {
      display: inline-block;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .content {
    padding-left: 1.125rem;
    padding-top: 0.9375rem;
    padding-bottom: 4rem;
    padding-right: 1.125rem;
    background-color: #fff;

    .amount {
      font-size: 18px;
      color: #259820;
      text-align: left;
      margin-bottom: 1rem;
    }

    .block {
      display: flex;
      flex-wrap: wrap;

      .item {
        margin-top: 0.3125rem;
        text-align: center;
        width: 31%;
        height: 13.2188rem;
        position: relative;
        margin-right: 3.5%;

        img {
          width: 100%;
          height: 100%;
        }

        .text {
          position: absolute;
          width: 100%;
          left: 50%;
          top: 3.1563rem;
          transform: translate(-50%, 0);
        }
      }

      .item:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
}
</style>
