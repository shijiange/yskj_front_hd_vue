<template>
  <div id="rewards_record">
    <c-title :hide="false" :text="'代理商分红'"></c-title>
    <div class="header_box">
      <div class="header">
        <img :src="member.avatar_image">
      </div>
      <ul class="name">
        <li>{{member.nickname}}</li>
        <li>{{member.address}}</li>
      </ul>
      <div class="task">
        <p>等级：{{member.level_name}}</p>
        <p>分红比例：{{member.rate}}</p>
      </div>
    </div>
    <div class="myrelationship">
      <router-link :to="fun.getUrl('AgentCustomer',{})">
        <div class="list1" style="margin: 0;">
          {{ $yzt('distribution.team') }}
          <i class="fa fa-angle-right"></i>
          <span>{{member.count}}人</span>
        </div>
      </router-link>
      <router-link :to="fun.getUrl('GroupOrder',{})">
        <div class="list1" style="margin: 0;">
          团队订单
          <i class="fa fa-angle-right"></i>
        </div>
      </router-link>
    </div>
    <div class="money">
      <ul class="gongge">
        <li>
          <i class="iconfont icon-weitixian"></i>
          <span>未结算佣金</span>
          <b
          >{{member.un_dividend}}<em>元</em>
          </b>
        </li>
        <li>
          <i class="iconfont icon-yijiesuan"></i>
          <span>已结算佣金</span>
          <b
          >{{member.dividend}}<em>元</em>
          </b>
        </li>
      </ul>
    </div>
    <van-tabs v-model="active" @click="tabHandel">
      <van-tab :title="'代理商分红'">
        <div class="list_box">
          <ul class="box" v-for="(item,i) in recordsList" :key='i'>
            <li @click.stop="showDetail(item)">
              <span class="order">订单号：{{item.order_sn}}</span>
              <span class="sum">+{{item.dividend_amount}}</span>
            </li>
            <li @click.stop="showDetail(item)">
              <span class="time">时间：{{item.created_at}}</span>
              <span class="state">{{item.status == 1 ? '已结算' : '未结算'}}</span>
            </li>
          </ul>
        </div>
      </van-tab>
      <van-tab :title="'推荐奖(平级奖)'">
        <div class="list_box">
          <ul class="box" v-for="(item,i) in recordsList" :key='i'>
            <li @click.stop="showDetail(item)">
              <span class="order">订单号：{{item.order_sn}}</span>
              <span class="sum">+{{item.dividend_amount}}</span>
            </li>
            <li @click.stop="showDetail(item)">
              <span class="time">时间：{{item.created_at}}</span>
              <span class="state">{{item.status == 1 ? '已结算' : '未结算'}}</span>
            </li>
          </ul>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import agent_bonus_controller from "./agent_bonus_controller";

export default agent_bonus_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #rewards_record {
    .header_box {
      background: #f15353;
      color: #fff;
      padding: 1.25rem 0.875rem;
      display: flex;
      align-items: center;

      .header {
        width: 3.25rem;
        height: 3.25rem;
        border: solid 0.125rem #fff;
        margin-right: 0.625rem;
        overflow: hidden;
        border-radius: 3.75rem;
        background: #f2f2f2;

        img {
          width: 100%;
        }
      }

      .name {
        width: 11rem;
        text-align: left;

        li:first-child {
          text-align: left;
          line-height: 1.875rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .task {
        width: 7rem;
        text-align: right;

        p:first-child {
          line-height: 1.875rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .myrelationship {
      a {
        .list1 {
          height: 2.75rem;
          background: #fff;
          padding: 0 0.75rem;
          font-size: 15px;
          line-height: 2.75rem;
          box-sizing: content-box;
          color: #242424;
          text-align: left;

          i {
            line-height: 2.75rem;
            color: #c9c9c9;
            font-size: 1.5rem;
            float: right;
          }

          span {
            line-height: 2.75rem;
            color: #8c8c8c;
            font-size: 14px;
            float: right;
            padding-right: 0.625rem;
          }
        }
      }
    }

    .rew_detail {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 4rem;
      padding: 0.4rem;
      font-size: 18px;
      background: #fff;
    }

    .money {
      margin-top: 0.625rem;
      margin-bottom: 0.625rem;

      .gongge {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        background: #fff;
        column-count: 3;
        padding-bottom: 0.625rem;
        padding-top: 0.625rem;

        li {
          width: 50%;
          display: flex;
          flex-direction: column;
          text-align: center;
          font-size: 12px;

          i {
            flex: 0 0 1.75rem;
            font-size: 26px;
            color: #999;
            display: inline-block;
            margin-bottom: 0.375rem;
            width: 100%;
          }

          span {
            flex: 0 0 1.4rem;
            color: #333;
            font-size: 12px;
          }

          b {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #f15353;
            font-size: 16px;
          }
        }
      }
    }

    .list_box {
      .box {
        background: #fff;
        padding: 0.625rem 0;
        border-bottom: solid 0.0625rem #ebebeb;

        li {
          line-height: 1.875rem;
          display: flex;
          justify-content: space-between;
          padding: 0 0.875rem;
          font-size: 15px;

          .sum {
            color: #f15353;
          }

          .time {
            font-size: 12px;
            color: #8c8c8c;
          }
        }
      }

      .show_hide_box {
        padding: 0 0.875rem;
        background: #fff;
        margin-bottom: 0.625rem;

        .user_a {
          padding: 0.625rem 0;
          border-bottom: solid 0.0625rem #ebebeb;
          display: flex;

          .header {
            width: 2.5rem;
            height: 2.5rem;
            overflow: hidden;
            background: #f2f2f2;
            margin-right: 10px;

            img {
              width: 100%;
            }
          }

          .name {
            text-align: left;

            li {
              line-height: 1.25rem;
            }

            li:last-child {
              color: #8c8c8c;
              font-size: 12px;
            }
          }
        }

        .goods_a {
          padding: 0.625rem 0;
          display: flex;

          .goods {
            width: 3.75rem;
            height: 3.75rem;
            overflow: hidden;
            background: #f2f2f2;
            margin-right: 0.625rem;

            img {
              width: 100%;
            }
          }

          .name {
            width: 12.5rem;
            text-align: left;
            max-height: 2.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .price {
            width: 4.75rem;
            text-align: right;
            font-size: 12px;
            color: #8c8c8c;

            .big {
              color: #333;
              font-size: 15px;
              margin-top: 0.375rem;
            }
          }
        }
      }
    }
  }
</style>
