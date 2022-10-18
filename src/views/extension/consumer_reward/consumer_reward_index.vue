<template>
  <div class="page">
    <c-title :hide="false" :text="title"></c-title>
    <div class="r_top_box">
      <div class="image">
        <img :src="member.avatar" alt="" />
      </div>
      <div>
        <div class="r_top_box_name">{{ member.nickname }}</div>
      </div>
    </div>
    <div class="esp" @click="gotoConsumerRewardApply">
      <div class="num">领取收益</div>
      <i class="iconfont icon-member_right"></i>
    </div>
    <div class="count">
      累计收益： <span class="price"> {{ totalPrice }}</span>
    </div>
    <div class="count withdraw-box">
      <div>
        可提现金额：<span class="price"> {{ withdraw_amount }}</span>
      </div>
      <div class="withdraw-btn" @click.stop="gotoWithdraw">去提现</div>
    </div>
    <div class="hr"></div>

    <div class="listTitle">奖励明细</div>
    <div class="listItems">
      <div class="listItem" v-for="(item, index) in listData" :key="index">
        <div class="desc">
          <div class="order" v-if="item.has_one_order">{{ item.has_one_order.order_sn }}</div>
          <div class="time">时间：{{ item.created_at }}</div>
        </div>
        <div class="price">+{{ item.reward_amount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import index_controller from "./consumer_reward_index_controller";

export default index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #fff;
  min-height: 100vh;
}

.r_top_box {
  width: 100%;
  height: 5.594rem;
  background-color: #ee2e2b;
  padding: 1.69rem 1.56rem 2.09rem 1.56rem;
  display: flex;
  align-items: center;

  .image {
    width: 2.88rem;
    height: 2.88rem;
    margin-right: 0.69rem;

    img {
      width: 2.88rem;
      height: 2.88rem;
      background-color: #000;
      border-radius: 50%;
    }
  }

  .r_top_box_name {
    font-size: 1rem;
    color: #fff;
    text-align: left;
  }
}

.esp {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0.969rem;
  padding-right: 0.938rem;
  color: #fff;
  width: 100%;
  height: 1.75rem;
  background-color: #fb6868;
  font-size: 0.75rem;
}

.count {
  display: flex;
  align-items: center;
  height: 2.844rem;
  padding-left: 0.875rem;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  background: #fff;

  .price {
    color: #ee2e2b;
  }
}

.hr {
  width: 100%;
  height: 0.625rem;
  background-color: #ebebeb;
}

.listTitle {
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 0.875rem;
  color: #ee2e2b;
}

.listItems {
  padding: 0 0.875rem;

  .listItem {
    display: flex;
    justify-content: space-between;
    height: 3.65rem;
    border-bottom: 0.063rem solid #ebebeb;

    .desc {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      text-align: left;

      .order {
        font-size: 0.813rem;
        color: #333;
      }

      .time {
        font-size: 0.75rem;
        color: #8c8c8c;
      }
    }

    .price {
      display: flex;
      align-items: center;
      font-size: 1rem;
      color: #f15353;
    }
  }
}

.withdraw-box {
  display: flex;
  justify-content: space-between;
  padding: 0 0.875rem;

  .withdraw-btn {
    height: 1.5rem;
    line-height: 1.5rem;
    background: #ee2e2b;
    color: #fff;
    padding: 0 0.5rem;
    font-size: 12px;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
  }
}
</style>
