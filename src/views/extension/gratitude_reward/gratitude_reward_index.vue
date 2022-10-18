<template>
  <div>
    <c-title :hide="false" :text="'感恩奖'"> </c-title>

    <div class="content">
      <div class="background">
        <div class="user">
          <div class="user-head">
            <img :src="member.avatar_image" />
          </div>
          <div class="user-name">{{member.nickname}}</div>
        </div>
      </div>
      <div class="absolute-block">
        <div class="left" style="border-right: 1px solid #ffd5cd;">
          <span class="first"
            ><b>{{un_settlement}}</b></span
          >
          <span class="second">未结算金额</span>
        </div>
        <div class="left">
          <span class="first"
            ><b>{{settlement}}</b></span
          >
          <span class="second">已结算金额</span>
        </div>
      </div>

      <div style="margin-top: -1.7rem;">
        <van-tabs v-model="tabsIndex" @change='changeTab'>
          <van-tab title="全部" name="3"></van-tab>
          <van-tab title="未结算" name="0"></van-tab>
          <van-tab title="已结算" name="1"></van-tab>
          <van-tab title="已失效" name="-1"></van-tab>
        </van-tabs>
        
        <div class="listItmes">
          <d-list @load="getMoreData" :finished="!isLoadMore" :loading="loading" :showStatusText="false">
            <div class="listItem" v-for="item in listData" :key="item.id">
              <div class="flex">
                <div class="order_sn">订单号：{{item.order_sn}}</div>
                <div class="price">{{item.reward_amount}}</div>
              </div>
              <div class="flex">
                <div class="face" v-if="item.child_member && item.child_member.avatar">
                  <img :src="item.child_member.avatar" />
                </div>
                <div class="name" v-if="item.child_member && item.child_member.nickname">{{item.child_member.nickname}}</div>
                <div class="status">{{item.status_name}}</div>
              </div>
              <div class="flex">
                <div class="time">时间：{{item.created_at}}</div>
              </div>
            </div>
          </d-list>
        </div>


      </div>




    </div>
  </div>
</template>

<script>
import controller from "./gratitude_reward_index_controller.js";

export default controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.content {
  .background {
    width: 100%;
    height: 10rem;
    background: #f15353;
    display: flex;
    padding-top: 1rem;
    justify-content: center;

    .user {
      display: flex;
      flex-direction: column;
      align-items: center;

      .user-head {
        height: 4rem;
        width: 4rem;
        background: #fff;
        border-radius: 50%;
        border: 0.125rem solid #fff;
        box-sizing: border-box;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }

      .user-head img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      .user-name {
        font-size: 16px;
        color: #fff;
        width: 10rem;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }
  }

  .absolute-block {
    width: 22rem;
    height: 6rem;
    background-color: #fff;
    border-radius: 0.5rem;
    margin: 0 auto;
    transform: translateY(-40%);
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;

    .left {
      width: 100%;
      display: flex;
      flex-direction: column;

      .first {
        color: #000;
        font-size: 18px;

        b {
          width: 9rem;
          display: inline-block;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap;
        }
      }

      .second {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .listItmes {
    padding: 0 0.938rem;
    text-align: left;
    background: #fff;

    .listItem {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 6.375rem;
      padding-top: 0.938rem;
      padding-bottom: 0.744rem;
      border-bottom: 0.063rem solid #ebebeb;

      .flex {
        display: flex;
        align-items: center;
      }

      .order_sn {
        font-size: 13px;
        color: #333;
        flex: 1;
      }

      .price {
        font-size: 16px;
        color: #f15353;
      }

      .face {
        width: 1.688rem;
        height: 1.688rem;

        img {
          width: 1.688rem;
          height: 1.688rem;
          border-radius: 50%;
        }
      }

      .name {
        flex: 1;
        margin-left: 0.439rem;
        font-size: 14px;
        color: #333;
      }

      .status {
        font-size: 12px;
        color: #8c8c8c;
      }

      .time {
        font-size: 12px;
        color: #8c8c8c;
      }
    }
  }
}
</style>
