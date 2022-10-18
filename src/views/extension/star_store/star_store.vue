<template>
  <div>
    <c-title text="星级门店"></c-title>
    <div class="top_title">
      <van-row>
        <van-col span="5" class="top_detail_img">
          <img :src="memberInfo.avatar_image" alt="">
        </van-col>
        <van-col span="19" class="top_detail_title">
          <span>{{memberInfo.username}}</span>
        </van-col>
      </van-row>
    </div>
    <div class="mulative_amount">累计金额：￥{{accumulate_reward}}</div>
    <div class="reward_record">
      <van-tabs>
        <van-tab title="奖励记录">
          <van-pull-refresh v-model="pullLoading" @refresh="loadTop" success-text="刷新成功">
            <d-list
              :loading="loading"
              :finished="finished"
              @load="onLoad"
            >
              <van-row :class="index == starStoreData.length -1 ? 'reward_record_box_last' : 'reward_record_box' " v-for="(item,index) in starStoreData" :key="item.id">
                <van-col span="17">
                  <div class="record_detail">
                    <span class="time">时间：{{item.created_at}}</span>
                    <span class="level_text">{{item.level_text}}</span>
                    <span class="record_detail_card">结算金额：￥{{item.amount}}</span>
                    <span class="record_detail_card">会员权益：{{item.member_equity}}</span>
                  </div>
                </van-col>
                <van-col span="7" class="rigth_record_detail">
                  <div>￥{{item.reward_amount}}</div>
                </van-col>
              </van-row>
            </d-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import star_store_controller from "./star_store_controller";

export default star_store_controller;
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .top_title {
    height: 5.63rem;
    background-color: #ee2e2b;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .top_title img {
    width: 2.88rem;
    height: 2.88rem;
    border-radius: 50%;
    margin: 0 0.5rem 0 0;
  }

  .top_detail_img {
    display: flex;
    justify-content: flex-end;
  }

  .top_detail_title {
    display: flex;
    justify-content: flex-start;
    color: #fff;
  }

  .top_detail_title span {
    font-size: 16px;
  }

  .mulative_amount {
    height: 1.76rem;
    background-color: #ee2e2b;
    opacity: 0.82;
    padding-left: 0.91rem;
    margin-bottom: 0.65rem;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #fff;
  }

  /deep/.van-tabs__wrap {
    border-bottom: 0.09rem solid #ebebeb;
  }

  /deep/ .van-tabs__line {
    width: 2.8rem;
  }

  .reward_record_box_last {
    margin: 0.91rem 0.91rem 0 0.91rem;
    border-bottom: 0.09rem solid #fff;
  }

  .reward_record_box {
    margin: 0.91rem 0.91rem 0 0.91rem;
    border-bottom: 0.09rem solid #ebebeb;
  }

  .reward_record {
    background: #fff;

    /deep/.van-tab--active {
      color: #ee2e2b;
    }
  }

  .record_detail {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .record_detail .level_text {
    color: #333;
  }

  .record_detail .time {
    color: #8c8c8c;
  }

  .record_detail .record_detail_card {
    font-size: 16px;
  }

  .record_detail span {
    display: block;
    margin-bottom: 0.66rem;
  }

  .rigth_record_detail div {
    color: #f15353;
    font-size: 18px;
    display: flex;
    justify-content: flex-end;
  }
</style>