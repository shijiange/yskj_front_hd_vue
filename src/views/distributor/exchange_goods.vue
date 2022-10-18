<template>
  <div>
    <div class="search_box" :style="{width: fun.getPhoneEnv() == 3 ?'375px':''}">
      <ul class="search">
        <li class="left">
          <i @click="goBack" style="padding-right: 1.5rem;" class="iconfont icon-back"></i>
          <span>换货</span>
        </li>
        <li class="right">
          <input
            v-model="kwd"
            type="text"
            title="搜索"
            placeholder="搜索商品"
          />
          <i class="iconfont icon-sousuo" @click="getData"></i>
        </li>
      </ul>
    </div>

    <div style="height: 2.75rem;"></div>

    <ul class="goods-box">
      <li v-for="(item, index) in list" :key="index">
        <div class="left">
          <img
            :src="item.thumb"
            alt="">
        </div>
        <div class="right">
          <p class="title">{{item.title}}</p>
          <div class="ticket ">
            <p class="number text-over">兑换券 {{item.goods_change?item.goods_change.certificate:'0'}}张</p>
            <p @click="changeGood(item.id)" class="exchange">换货</p>
          </div>
        </div>
      </li>
      <img v-if="fun.isTextEmpty(list)" src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem auto;">
    </ul>

  </div>
</template>

<script>
import exchange_goods_controller from "./exchange_goods_controller";

export default exchange_goods_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .search_box {
    position: fixed;
    width: 100%;

    .search {
      height: 2.75rem;
      line-height: 2.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.875rem;
      background-color: #fff;

      .left {
        font-size: 16px;
        display: flex;
        font-weight: bold;

        i {
          color: #333;
          font-size: 1rem;
        }

        span {
          display: block;
          margin: 0 0.25rem;
          max-width: 5.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #333;
        }

        i:last-child {
          font-size: 1.125rem;
        }
      }

      .right {
        width: 12.375rem;
        height: 1.875rem;
        background: #f8f8f8;
        display: flex;
        line-height: 1.875rem;
        border-radius: 1rem;
        padding: 0 0.625rem;
        font-size: 14px;
        color: #c9c9c9;

        i {
          font-size: 1.125rem;
          margin-right: 0.375rem;
        }

        input {
          border: none;
          width: 100%;
        }

        input::-webkit-input-placeholder,
        textarea::-webkit-input-placeholder {
          color: #c9c9c9;
        }
      }
    }
  }

  .text-over {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .goods-box {
    background: #fff;
    padding: 1rem;
    min-height: 100vh;

    li {
      padding-bottom: 0.5rem;
      display: flex;

      .left {
        flex: 0 0 8rem;

        img {
          width: 8rem;
          height: 8rem;
          border-radius: 0.313rem;
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
        height: 2.5rem;
        line-height: 1.25rem;
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
        margin-top: 3rem;
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
  }
</style>
