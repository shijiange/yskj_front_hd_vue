<template>
  <div id="circleExtend" v-if="memberInfo">
    <c-title :hide="false" text="圈子推广中心"></c-title>
    <div class="top-bg">
      <div class="left">
        <img class="avatar" :src="memberInfo.avatar" />
        <div class="name">
          <div>{{ memberInfo.nickname }}</div>
        </div>
      </div>
    </div>
    <div class="tabs">
      <van-tabs v-model="currentShowTab" @change="switchRecordTab">
        <van-tab title="付费记录" name="paymentRecord"></van-tab>
        <van-tab title="打赏记录" name="rewardRecord"></van-tab>
        <van-tab title="视频奖励" name="videoRecord"></van-tab>
      </van-tabs>
    </div>
    <div v-show="currentShowTab=='paymentRecord'">
      <div class="total-money">
        <div class="left">累计金额</div>
        <div class="right">￥{{ incomeCount }}</div>
      </div>
      <d-list
        v-if="paymentRecord.length>0"
        @load="loadPaymentRecord"
        :finished="paymentRecordPagination.finished"
        :loading="paymentRecordPagination.loading"
      >
        <div class="pay-record">
          <div class="list" v-for="recordItem in paymentRecord" :key="recordItem.id">
            <div class="top">
              <div class="name">{{ recordItem.name }}</div>
              <div class="money">{{ recordItem.payment_amount }}</div>
            </div>
            <div class="bottom">
              <div class="pay-name">付费者：{{ recordItem.nickname }}</div>
              <div class="time">{{ recordItem.created_at }}</div>
            </div>
          </div>
        </div>
      </d-list>

      <div style="margin-top: 1.4688rem;" v-else>暂无数据~</div>
    </div>
    <div v-show="currentShowTab=='rewardRecord'">
      <div class="Reward">
        <div class="left">
          <div class="cash">￥{{ receivedRewardCount }}</div>
          <div class="text">收到的打赏</div>
        </div>
        <div class="right">
          <div class="cash">￥{{ myRewardCount }}</div>
          <div class="text">我的打赏</div>
        </div>
      </div>
      <div class="Reward-tabs">
        <van-tabs v-model="currentShowRewardRecordTab" @change="switchRewardTab" v-if="currentShowRewardRecordTab">
          <van-tab title="收到的打赏" name="received"></van-tab>
          <van-tab title="我的打赏" name="my"></van-tab>
        </van-tabs>
        <d-list
          @load="loadRewardRecord"
          :finished="rewardRecordPagination.finished"
          :loading="rewardRecordPagination.loading"
        >
          <div class="Reward-list">
            <div class="list" v-for="rewardItem in rewardRecord" :key="rewardItem.id">
              <div class="ordersn">订单编号：{{ rewardItem.order_sn }}</div>
              <div class="tip-title">
                帖子标题：
                <span style="color: #3175fe;">{{ rewardItem.title }}</span>
              </div>
              <div class="Reward-people">
                <div style="font-size: 0.75rem;">打赏人：{{ rewardItem.nickname }}</div>
                <div
                  style="font-size: 1rem; color: #f15353;"
                >{{ currentShowRewardRecordTab=='my'?'-':'+' }}{{ rewardItem.money }}元</div>
              </div>
              <div class="time">
                <div>{{ rewardItem.created_at }}</div>
                <div
                  style="color: #4fa34e;"
                >{{ rewardItem.pay_status==1?'已结算':'未结算' }} ：{{ rewardItem.pay_name }}</div>
              </div>
            </div>
          </div>
        </d-list>
      </div>
    </div>
    <div v-show="currentShowTab=='videoRecord'">
      <div class="commision">
        <div class="left">
          <div class="cash">￥{{ unsettledCommission }}</div>
          <div class="text">未结算佣金</div>
        </div>
        <div class="right">
          <div class="cash">￥{{ settledCommission }}</div>
          <div class="text">已结算佣金</div>
        </div>
      </div>
      <d-list @load="loadVideoReard" :finished="videoRewardPagination.finished" :loading="videoRewardPagination.loading">
        <div class="video-record">
          <div class="record" v-for="rewardGroupItem in videoReward" :key="rewardGroupItem.id">
            <div class="title">{{ rewardGroupItem.month }}</div>
            <div class="record-list">
              <div class="list" v-for="rewardItem in rewardGroupItem.value" :key="rewardItem.id">
                <div class="list-order">
                  <div class="ordersn">订单编号：{{ rewardItem.order_sn }}</div>
                  <div class="cash">+{{ rewardItem.amount }}元</div>
                </div>
                <div class="list-amount">
                  <div class="amount">
                    <div>订单金额：￥{{ rewardItem.order_price }}</div>
                    <div style="margin-left: 2.1875rem;">比例：{{ rewardItem.rebate }}%</div>
                  </div>
                  <div class="wait">{{ rewardItem.status==1?'已结算':'未结算' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </d-list>
    </div>
  </div>
</template>

<script>
import circleExtend_controller from "./circleExtend_controller";

export default circleExtend_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#circleExtend {
  .top-bg {
    height: 6.6563rem;
    background-color: #ee2e2b;
    box-sizing: border-box;
    padding: 1.5625rem;

    .left {
      text-align: left;

      .avatar {
        width: 2.875rem;
        height: 2.875rem;
        background-color: #cfcfcf;
        margin-right: 0.6875rem;
        border-radius: 50%;
      }

      .name {
        display: inline-flex;
        text-align: left;
        flex-direction: column;
        justify-content: space-between;
        vertical-align: top;
        font-size: 1rem;
        color: #fff;
      }
    }
  }

  .tabs {
    margin-top: 0.625rem;
    background: #fff;
  }

  .Reward-tabs {
    margin-top: 0.625rem;
  }

  .Reward-list {
    .list:first-child {
      border-top: solid 1px #f2f2f2;
    }

    .list {
      padding: 0.9375rem;
      text-align: left;
      background: #fff;
      margin-bottom: 0.625rem;

      .ordersn {
        font-size: 0.8125rem;
        margin-top: 0.3125rem;
      }

      .tip-title {
        font-size: 0.75rem;
        margin-top: 0.3125rem;
      }

      .Reward-people {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.3125rem;
      }

      .time {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.75rem;
        color: #8c8c8c;
        margin-top: 0.3125rem;
      }
    }
  }

  .Reward {
    margin-top: 0.625rem;
    display: flex;
    align-items: center;
    height: 3.75rem;
    background: #fff;
    box-sizing: border-box;

    .left {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .cash {
        font-size: 1rem;
        color: #f15353;
      }

      .text {
        color: #8c8c8c;
        font-size: 0.875rem;
      }
    }

    .right {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .cash {
        font-size: 1rem;
        color: #f15353;
      }

      .text {
        color: #8c8c8c;
        font-size: 0.875rem;
      }
    }
  }

  .commision {
    margin-top: 0.625rem;
    display: flex;
    align-items: center;
    height: 3.75rem;
    background: #fff;
    box-sizing: border-box;

    .left {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .cash {
        font-size: 1rem;
        color: #f15353;
      }

      .text {
        color: #8c8c8c;
        font-size: 0.875rem;
      }
    }

    .right {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .cash {
        font-size: 1rem;
        color: #f15353;
      }

      .text {
        color: #8c8c8c;
        font-size: 0.875rem;
      }
    }
  }

  .video-record {
    margin-top: 0.625rem;

    .record {
      .title {
        padding-left: 1.3125rem;
        font-size: 0.75rem;
        color: #666;
        text-align: left;
        margin-bottom: 0.625rem;
      }

      .record-list {
        background: #fff;

        .list {
          padding: 0.875rem;
          border-bottom: solid 1px #f2f2f2;

          .list-order {
            display: flex;
            justify-content: space-between;

            .ordersn {
              font-size: 0.8125rem;
            }

            .cash {
              color: #f15353;
              font-size: 1rem;
            }
          }

          .list-amount {
            display: flex;
            justify-content: space-between;
            margin-top: 0.3125rem;

            .amount {
              color: #666;
              font-size: 0.75rem;
              display: flex;
            }

            .wait {
              color: #8c8c8c;
              font-size: 0.75rem;
            }
          }
        }
      }
    }
  }

  .total-money {
    margin-top: 0.625rem;
    height: 3.75rem;
    background: #fff;
    box-sizing: border-box;
    padding: 0 0.875rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      font-size: 0.9375rem;
      color: #333;
    }

    .right {
      font-size: 1rem;
      color: #f15353;
    }
  }

  .pay-record {
    margin-top: 0.625rem;
    background-color: #fff;

    .list {
      padding: 0.875rem;
      border-bottom: solid 1px #f2f2f2;

      .top {
        display: flex;
        justify-content: space-between;

        .name {
          font-size: 0.8125rem;
        }

        .money {
          color: #f15353;
          font-size: 1rem;
        }
      }

      .bottom {
        margin-top: 0.5625rem;
        display: flex;
        justify-content: space-between;

        .pay-name {
          font-size: 0.75rem;
          color: #747474;
        }

        .time {
          font-size: 0.75rem;
          color: #8c8c8c;
        }
      }
    }
  }

  /deep/ .van-tab--active {
    color: #f15353;
  }

  /deep/ .van-tabs__line {
    background-color: #f15353;
  }
}
</style>
