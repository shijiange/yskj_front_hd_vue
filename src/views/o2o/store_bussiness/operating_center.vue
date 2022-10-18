<template>
  <div class="operating_center">
    <c-title :hide="false" text="店商联盟"></c-title>
    <!-- 标题 -->
    <div class="title">
      <div>服务中心数量：<span class="num">{{teams_all.all_regions}}</span></div>
      <div>总业绩：<span class="num">{{teams_all.all_price}}</span></div>
    </div>
    <!-- 数据列表 -->
    <div class="list">
      <div class="item" v-for="(item,index) in listData" :key="index">
        <div class="info">
          <div class="img_box">
            <img :src="item.has_one_member.avatar_image" alt="">
          </div>
          <div class="name">
            <span>{{item.has_one_member.nickname}}</span>
            <span class="level" v-if="item.level_name">{{item.level_name}}</span>
          </div>
        </div>
        <div class="date">
          <div class="row">
            <div class="total">
              <span class="count">{{item.store_amount}}</span>
              <span>区域总销售额</span>
            </div>
            <div class="total">
              <span class="count">{{item.today_amount}}</span>
              <span>当天销售额</span>
            </div>
          </div>
          <div class="row">
            <div class="total">
              <span class="amount">{{item.this_month_amount}}</span>
              <span>当月销售额</span>
            </div>
            <div class="total">
              <span class="amount">{{item.last_month_amount}}</span>
              <span>上月销售额</span>
            </div>
          </div>
        </div>
        <div class="storeNum" @click="goStore(item)">
          <van-cell is-link>
            <template #title>
              <span>联盟店数量：</span>
              <span class="num">{{item.store_num}}</span>
            </template>
          </van-cell>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import operating_center_controller from "./operating_center_controller";

export default operating_center_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// 标题
.operating_center .title {
  display: flex;
  justify-content: space-between;
  margin: 0 1rem 1rem 1rem;
  font-weight: bold;
}

.operating_center .title,
.item .storeNum {
  .num {
    color: #f15353;
  }
}
// 列表
.list {
  .item {
    margin: 0.8rem;
    background-color: #fff;
    border-radius: 0.8rem;

    .storeNum {
      margin: 0 0.813rem;
      text-align: left;
      color: #333;
      font-weight: bold;
      border-top: 0.031rem solid #f1f1f1;
    }
  }

  .info {
    display: flex;
    align-items: center;
    padding: 1rem;

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

    .name {
      display: flex;
      flex-direction: column;
      margin-left: 0.5rem;
      font-size: 12px;
      text-align: left;

      .level {
        margin-top: 0.3rem;
        padding: 0.1rem 0.5rem;
        font-size: 11px;
        color: #f15353;
        background: rgba(241, 83, 83, 0.29);
        border-radius: 0.625rem;
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

/deep/ .van-cell {
  padding: 10px 0;
}
</style>
