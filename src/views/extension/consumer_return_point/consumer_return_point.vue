<template>
  <div id="consumer_return">
    <c-title :hide="false"
             :text=" trans?trans:'区间消费返点'"></c-title>
    <div class="content">
      <div class="head" v-if="info">
        <div class="head_sculpture">
          <div class="left">
            <img :src="info.pic" alt="">
          </div>
          <div class="right">{{info.name}}</div>
        </div>
        <div class="amount_money">
          <div class="left">
            <div class="top">{{$i18n.t('money')}}{{info.personal_amount}}</div>
            <div class="bottom">累积个人返点金额</div>
          </div>
          <div class="right">
            <div class="top">{{$i18n.t('money')}}{{info.team_amount}}</div>
            <div class="bottom">累积团队返点金额</div>
          </div>
        </div>
      </div>
      <van-tabs v-model="active" @click="tabHandel">
        <van-tab title="个人消费返点">
          <ul class="list" v-for="(item,index) in recordsList" :key="index">
            <li>
              <div class="left">
                <div class="top">返点id：{{item.id}}</div>
                <div class="bottom">{{item.created_at}}</div>
              </div>
              <div class="center">
                <div class="top">个人消费:{{item.consume_amount}}{{$i18n.t('元')}}</div>
                <div class="bottom">返点比例: {{item.rebate}}%</div>
              </div>
              <div class="right">+{{item.amount}}</div>
            </li>
          </ul>
        </van-tab>
        <van-tab title="团队消费返点">
          <ul class="list">
            <li  v-for="(item,index) in recordsTeamList" :key="index">
              <div class="left">
                <div class="top">返点id：{{item.id}}</div>
                <div class="bottom">{{item.created_at}}</div>
              </div>
              <div class="center">
                <div class="top">团队消费:{{item.consume_amount}}{{$i18n.t('元')}}</div>
                <div class="bottom">返点比例: {{item.rebate}}%</div>
              </div>
              <div class="right">+{{item.amount}}</div>
            </li>
          </ul>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import consumer_return_point_controller from "./consumer_return_point_controller";

export default consumer_return_point_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #consumer_return {
    .content {
      .head {
        background-color: #fff;
        margin-bottom: 0.63rem;

        .head_sculpture {
          margin-left: 0.78rem;
          margin-right: 0.78rem;
          padding-left: 0.28rem;
          padding-right: 0.28rem;
          padding-bottom: 1.16rem;
          padding-top: 1.41rem;
          border-bottom: 1px solid #f4f4f4;
          display: flex;
          align-items: center;

          .left {
            width: 4.25rem;
            height: 4.25rem;
            border-radius: 50%;
            margin-right: 0.75rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .right {
            font-size: 1.13rem;
            line-height: 1.13rem;
            color: #413e4b;
          }
        }

        .amount_money {
          display: flex;
          justify-content: space-between;
          padding-top: 0.84rem;
          padding-bottom: 0.8rem;

          .left {
            flex: 1;

            .top {
              font-size: 1.13rem;
              line-height: 1.13rem;
              color: #ff2c29;
              margin-bottom: 0.8rem;
            }

            .bottom {
              font-size: 0.75rem;
              line-height: 1.13rem;
              color: #000;
            }
          }

          .right {
            flex: 1;

            .top {
              font-size: 1.13rem;
              line-height: 1.13rem;
              color: #ff2c29;
              margin-bottom: 0.8rem;
            }

            .bottom {
              font-size: 0.75rem;
              line-height: 1.13rem;
              color: #000;
            }
          }
        }
      }

      .list {
        li {
          background: #fff;
          margin-bottom: 0.63rem;
          display: flex;
          padding-left: 1rem;
          text-align: left;
          align-items: center;
          padding-top: 1.19rem;
          padding-bottom: 1.09rem;

          .left {
            width: 8.97rem;

            .top {
              font-size: 0.88rem;
              line-height: 1.13rem;
              color: #000;
              padding-bottom: 0.5rem;
            }

            .bottom {
              font-size: 0.75rem;
              line-height: 1.13rem;
              color: #333;
            }
          }

          .center {
            width: 9.16rem;

            .top {
              font-size: 0.88rem;
              line-height: 1.13rem;
              color: #000;
              padding-bottom: 0.5rem;
            }

            .bottom {
              font-size: 0.75rem;
              line-height: 1.13rem;
              color: #333;
            }
          }

          .right {
            font-size: 0.88rem;
            line-height: 1.13rem;
            color: #ff2c29;
          }
        }
      }
    }
  }
</style>
