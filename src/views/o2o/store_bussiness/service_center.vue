<template>
  <div class="service_center">
    <c-title :hide="false" text="店商联盟"></c-title>
    <!-- 地区选择 -->
    <div class="store_address">
      <span class="address" v-for="(item,index) in regionsList" :key="index" @click="handTab(item)" :class="{active:item.district_id==district_id}">{{item.city_name}}-{{item.district_name}}</span>
    </div>
    <!-- 标题 -->
    <div class="title">
      <div>联盟店数量：<span class="num">{{store_num}}</span></div>
      <div>总业绩：<span class="num">{{store_amount}}</span></div>
    </div>
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="(item,index) in listData" :key="index">
        <div class="info">
          <div class="img_box">
            <img :src="item.thumb" alt="">
          </div>
          <span class="name">{{item.store_name}}</span>
        </div>
        <div class="date">
          <div class="row">
            <div class="total">
              <span class="count">{{item.store_price}}</span>
              <span>店总销售额</span>
            </div>
            <div class="total">
              <span class="count">{{item.today_price}}</span>
              <span>当天销售额</span>
            </div>
          </div>
          <div class="row">
            <div class="total">
              <span class="amount">{{item.this_month_price}}</span>
              <span>当月销售额</span>
            </div>
            <div class="total">
              <span class="amount">{{item.last_month_pirce}}</span>
              <span>上月销售额</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import service_center_controller from "./service_center_controller";

export default service_center_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.service_center {
  // 地区选择
  .store_address {
    padding: 0.625rem 0.938rem;
    display: flex;
    justify-content: space-between;
    background-color: #fff;

    .address {
      padding: 0.2rem 0.5rem;
      margin-right: 0.5rem;
      font: {
        size: 12px;
        weight: bold;
      }

      color: #636363;
      background-color: #e4e4e4;
      border-radius: 0.3rem;
    }

    .active {
      color: #f15353;
      background: rgba(241, 83, 83, 0.29);
    }
  }
  // 标题
  .title {
    display: flex;
    justify-content: space-between;
    margin: 1rem;
    font-weight: bold;

    .num {
      color: #f15353;
    }
  }
  // 列表
  .list {
    padding-bottom: 0.8rem;

    .item {
      margin: 0.8rem;
      background-color: #fff;
      border-radius: 0.8rem;
    }

    .info {
      display: flex;
      align-items: center;
      padding: 1rem;

      .name {
        margin-left: 0.5rem;
      }

      .img_box {
        width: 1.88rem;
        height: 1.88rem;
        border-radius: 50%;

        img {
          width: 1.88rem;
          height: 1.88rem;
          border-radius: 50%;
        }
      }
    }

    .date {
      padding: 0 2rem;

      .row {
        display: flex;
        justify-content: space-between;
        color: #666;
        font-size: 12px;
        font-weight: bold;
      }

      .total {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.5rem;

        .count {
          margin-bottom: 0.5rem;
          color: #f15353;
          font-size: 20px;
        }

        .amount {
          margin-bottom: 0.5rem;
          color: #2a96f3;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
