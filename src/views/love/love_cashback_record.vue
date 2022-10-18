<template>
  <div class="page">
    <c-title text="返现记录"></c-title>

    <div class="give_header">
      <div class="give_header_text">已赠送数值</div>
      <div class="give_header_price">{{details.rewarded}}</div>
      <div class="give_header_desc">{{ details.status==1 ? '赠送中' : '赠送完成' }}</div>
    </div>

    <div class="give_info">
      <div class="give_info_container">
        <div class="give_info_item">
          <div class="text">赠送总额</div>
          <div class="content">{{details.total}}</div>
        </div>
        <div class="give_info_item">
          <div class="text">赠送时间类型</div>
          <div class="content">{{details.time_unit}}</div>
        </div>
        <div class="give_info_item">
          <div class="text">赠送周期期数</div>
          <div class="content">{{details.cycle}}</div>
        </div>
        <div class="give_info_item">
          <div class="text">已赠送金额</div>
          <div class="content">{{details.rewarded}}</div>
        </div>
        <div class="give_info_item">
          <div class="text">未赠送金额</div>
          <div class="content">{{details.not_rewarded}}</div>
        </div>
      </div>
    </div>

    <div class="hr"></div>

    <div class="times">
      <div class="time-item" v-for="(item,key) in details.member_love_reward_queues" :key="key">
        <div class="text">时间：{{item.created_at}}</div>
        <div class="content">{{item.reward}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import love_cashback_record_controller from "./love_cashback_record_controller";

export default love_cashback_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.page {
  background: #fff;
  min-height: 100vh;
  padding-bottom: 3.0625rem;
}

.give_header {
  padding-top: 1.5rem;
  padding-bottom: 1.56rem;

  .give_header_text {
    font-size: 15px;
    color: #333;
  }

  .give_header_price {
    padding-top: 1rem;
    font-size: 24px;
    color: #e82323;
  }

  .give_header_desc {
    padding-top: 0.5rem;
    font-size: 12px;
    color: #9d9d9d;
  }
}

.give_info {
  padding-bottom: 0.938rem;

  .give_info_container {
    width: 22.188rem;
    margin: 0 auto;
    padding: 0.3rem 0;
    background-color: #fff9f2;
    border-radius: 0.313rem;

    .give_info_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 2rem;
      padding: 0 1rem;

      .text {
        font-size: 13px;
        color: #65635a;
      }

      .content {
        font-size: 13px;
        color: #16150f;
      }
    }
  }
}

.hr {
  width: 100%;
  height: 0.625rem;
  background-color: #f8f8f8;
}

.times {
  .time-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 2.938rem;
    padding: 0 0.969rem;
    border-bottom: 0.031rem solid #f8f8f8;

    .text {
      font-size: 13px;
      color: #323232;
    }

    .content {
      font-size: 15px;
      color: #e82323;
    }
  }
}

</style>
