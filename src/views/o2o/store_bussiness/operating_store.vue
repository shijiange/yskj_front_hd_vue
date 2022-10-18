<template>
  <div class="operating_store">
    <c-title :hide="false" text="店商联盟"></c-title>
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
import operating_store_controller from "./operating_store_controller";

export default operating_store_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// 列表
.list {
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
      background-color: burlywood;

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
</style>
