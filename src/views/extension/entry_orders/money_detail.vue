<template>
  <div>
    <c-title :hide="false"
             :text="integral ? integral : '提成明细'"></c-title>
    <div id="money-info">
      <div class="header">
        <van-tabs v-model="activeName">
          <van-tab name="0">
            <span slot="title" @click="getData('0')">全部</span>
          </van-tab>
          <van-tab name="1">
            <span slot="title" @click="getData('1')">已结算</span>
          </van-tab>
          <van-tab name="2">
            <span slot="title" @click="getData('2')">未结算</span>
          </van-tab>
          <van-tab name="3">
            <span slot="title" @click="getData('3')">已失效</span>
          </van-tab>
        </van-tabs>
      </div>
      <div class="contaier">
        <ul>
          <li v-for="item in info"
              :key="item.id">
            <div class="title"><span> 队列ID：{{item.goods_queue_id}}</span></div>
            <div class="info_contacts">
              <div class="top_one">
                <span class="order_sn">订单号：{{item.order_sn}}</span>
                <span class="money">{{item.dividend_amount}}</span>
              </div>
              <div class="top_two">
                <span class="time">{{item.created_at}}</span>
                <span class="two_status">{{item.status_name}}</span>
              </div>
            </div>
          </li>
        </ul>
        <p style="margin: 1.5rem 0; color: #9e9e9e;"
           v-if="isNoMore">没有更多</p>
        <img src="../../../assets/images/blank.png"
             alt=""
             v-if="isNO"
             style="width: 5rem; margin-top: 5rem;">
      </div>
    </div>
  </div>
</template>

<script>
import money_detail_controller from "./money_detail_controller";

export default money_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #money-info {
    .contaier {
      ul {
        li {
          margin-top: 0.5rem;
          padding: 0 1rem;
          background-color: #fff;

          .title {
            width: 100%;
            height: 2.375rem;
            line-height: 2.375rem;
            text-align: left;
            border-bottom: 0.02rem solid #ebebeb;

            span {
              display: inline-block;
              font-size: 0.875rem;
              font-weight: bold;
              color: #333;
            }
          }

          .info_contacts {
            width: 100%;
            background-color: #fff;

            .top_one {
              display: flex;
              justify-content: space-between;
            }

            .top_two {
              display: flex;
              justify-content: space-between;
            }

            .top_one {
              width: 100%;
              padding-top: 0.875rem;
              display: flex;

              .order_sn {
                flex: 1;
                text-align: left;
                font-size: 0.75rem;
                color: #333;
              }

              .money {
                flex: 0 0 5rem;
                font-size: 0.88rem;
                color: #f15353;
                text-align: right;
              }
            }

            .top_two {
              width: 100%;
              font-size: 0.75rem;
              padding: 0.625rem 0;

              .time {
                width: 65%;
                color: #8c8c8c;
                text-align: left;
              }

              .two_status {
                width: 35%;
                color: #333;
                text-align: right;
              }
            }
          }
        }
      }
    }
  }
</style>
