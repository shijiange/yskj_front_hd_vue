<template>
  <div class="store-integral-detail">
    <c-title :hide="false" :text="integralText+'明细'"></c-title>
    <van-sticky :offset-top="40">
      <van-search v-if="!memberId" v-model="keyword" shape="round" placeholder="搜索会员" @search="onSearch"/>
      <van-tabs v-model="incomeType" @change="changeType">
        <van-tab title="全部" name=""></van-tab>
        <van-tab title="收入" :name="1"></van-tab>
        <van-tab title="支出" :name="-1"></van-tab>
      </van-tabs>
    </van-sticky>
    <van-list
      class="list"
      v-if="list.length > 0"
      v-model="loading"
      :offset="10"
      :finished="finished"
      :immediate-check="false"
      finished-text="没有更多了"
      @load="getData"
    >
      <template v-if="memberId">
        <div class="item" v-for="(item) in list" :key="item.id">
          <div class="top">
            <p class="title overflow">{{item.source_name}}</p>
            <span class="point-income redText" v-if="item.point_income_type == 1">+{{item.point}}</span>
            <span class="point-income greenText" v-else>{{item.point}}</span>
          </div>
          <div class="current-point">{{integralText}}：{{item.after_point}}</div>
          <div class="time">{{item.created_at}}</div>
        </div>
      </template>
      <template v-else>
        <div class="member-item"  v-for="(item) in list" :key="item.id">
          <div class="top">
            <p class="title overflow">{{item.source_name}}</p>
            <div class="time">{{item.created_at}}</div>
          </div>
          <div class="member">
            <div class="avatar">
              <img :src="item.has_one_member ? item.has_one_member.avatar : ''" alt="">
            </div>
            <div class="info">
              <p class="nickname overflow">{{item.has_one_member ? item.has_one_member.nickname : ''}}</p>
              <p class="current-num">{{integralText}}：{{item.after_point}}</p>
            </div>
            <div class="point-income redText" v-if="item.type == 1">+{{item.point}}</div>
            <div class="point-income greenText" v-else>{{item.point}}</div>
          </div>
        </div>
      </template>
    </van-list>
    <yz-blank :datas="list" text="空空如也"></yz-blank>
  </div>
</template>

<script>
import integralDetail from "./integral_detail_controller";
export default integralDetail;
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.store-integral-detail {
  padding-bottom: 3rem;
  overflow: hidden;
  /deep/ .van-search__content {
    background-color: #eff0f1;
  }
  .list {
    padding: 0 0.63rem;
    .item {
      margin-top: 0.69rem;
      padding: 0.81rem;
      background-color: #ffffff;
      border-radius: 0.31rem;
      text-align: left;
      .top {
        display: flex;
        align-items: center;
        color: #242424;
        .title {
          padding-right: 1rem;
          font-size: 0.94rem;
          flex: 1;
        }
        .point-income {
          font-size: 0.75rem;
        }
      }
      .current-point {
        font-size: 0.75rem;
        margin: 0.88rem 0;
        color: #666666;
      }
      .time {
        font-size: 0.69rem;
        color: #9e9e9e;
      }
    }
    .member-item {
      margin-top: 0.63rem;
      padding: 0.84rem;
      background-color: #ffffff;
      border-radius: 0.31rem;
      .top {
        white-space: nowrap;
        display: flex;
        justify-content: space-between;
        .title {
          padding-right: 1rem;
          font-size: 0.81rem;
          color: #414141;
        }
        .time {
          font-size: 0.69rem;
          color: #9e9e9e;
        }
      }
      .member {
        display: flex;
        align-items: center;
        margin-top: 1.5rem;
        text-align: left;
        .avatar {
          width: 2.19rem;
          height: 2.19rem;
          margin-right: 0.63rem;
          border-radius: 50%;
          overflow: hidden;
          background: #666666;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .info {
          flex: 1;
          width: 0;
          .nickname {
            padding-right: 1rem;
            font-size: 0.94rem;
            color: #242424;
          }
          .current-num {
            margin-top: 0.88rem;
            font-size: 0.75rem;
            color: #666666;
          }
          .point-income {
            flex: 1;
            text-align: right;
          }
        }
      }
    }
    .redText {
      color: #f15353;
    }
    .greenText {
      color: #129e47;
    }
  }
}
</style>