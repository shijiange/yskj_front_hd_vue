<template>
  <div class="recommend-reward">
    <div class="reward-header">
      <c-title class="circle_title" :hide="false" :text="'直荐奖'"></c-title>
      <div class="reward-user">
        <div class="user-img">
          <img :src="info.pic" alt />
        </div>
        <div class="user-info">
          <p>{{info.name}}</p>
          <div class="user-grade">
            <p>{{info.level_name}}</p>
          </div>
        </div>
      </div>
      <div class="reward-price">
        <div class="prile-list">
          <p>￥{{amount.wait || 0}}</p>
          <p>未结算</p>
        </div>
        <div class="prile-list">
          <p>￥{{amount.already}}</p>
          <p>已结算</p>
        </div>
      </div>
    </div>
    <!-- 直接推荐奖列表start -->
    <div class="reward-list">
      <van-tabs  v-model="active" title-active-color="#FB6B68" @change="tabStatus">
        <van-tab title="全部" :name="2"></van-tab>
        <van-tab title="未结算" :name="0"></van-tab>
        <van-tab title="已结算" :name="1"></van-tab>
        <van-tab title="失效" :name="-1"></van-tab>
        <ul class="list" v-for="item in listData" :key="item.id">
          <li class="list-order">
            <p>{{item.order.order_sn}}</p>
            <p>￥{{item.amount | 0}}</p>
          </li>
          <li class="list-date">
            <p>{{item.created_at}}</p>
            <p>{{item.status_name}}</p>
          </li>
        </ul>
      </van-tabs>
    </div>
    <!-- 直接推荐奖列表end -->
  </div>
</template>

<script>
import index_colltroller from "./index_colltroller";

export default index_colltroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.recommend-reward {
  .reward-title {
    background-color: #f8f8f8;
    text-align: center;
    height: 2.75rem;
    line-height: 2.75rem;

    p {
      font-size: 18px;
      color: #2c2c2c;
    }
  }

  .reward-user {
    background-color: #f15353;
    height: 6.69rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .user-img {
      width: 2.88rem;
      height: 2.88rem;
      margin-left: 1.56rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .user-info {
      color: #fff;
      margin-left: 0.69rem;
      text-align: left;

      > p {
        font-size: 16px;
        margin-bottom: 0.56rem;
      }

      .user-grade {
        width: 3.25rem;
        height: 1.25rem;
        text-align: center;
        background-color: #f36b69;
        border-radius: 0.63rem;

        p {
          line-height: 1.25rem;
          color: #fff;
          font-size: 12px;
        }
      }
    }
  }

  .reward-price {
    height: 5.5rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .prile-list {
      p:nth-child(1) {
        font-size: 16px;
        color: #f15353;
        margin-bottom: 0.75rem;
      }

      p:nth-child(2) {
        font-size: 14px;
        color: #8c8c8c;
      }
    }
  }

  .reward-list {
    margin-top: 0.63rem;
  }

  .list {
    background-color: #fff;
    box-sizing: border-box;
    padding: 0.7rem 0.65rem;
    border-bottom: 1px solid #f4f4f4;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 1.7rem;
    }

    p {
      font-size: 14px;
    }

    .list-order {
      p:nth-child(1) {
        color: #2a2f31;
      }

      p:nth-child(2) {
        color: #f15353;
      }
    }

    .list-date {
      p:nth-child(1) {
        color: #6a6a6a;
        font-size: 12px;
      }

      p:nth-child(2) {
        color: #101010;
      }
    }
  }
}
</style>