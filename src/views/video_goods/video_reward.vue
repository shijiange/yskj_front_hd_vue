<!-- 发现小视频 发现-奖励记录--->
<template>
  <div id="video_reward">
    <c-title :hide="false"
             text="发现-奖励记录"></c-title>
    <div class="header_box"
         v-if="!fun.isTextEmpty(rewards.member)">
      <div class="header">
        <img :src="rewards.member.avatar">
      </div>
      <ul class="name">
        <li>{{rewards.member.nickname}}</li>
        <li>视频数量: {{rewards.video_total}}个</li>
      </ul>
    </div>
    <div class="money">
      <ul class="gongge">
        <li>
          <i class="iconfont icon-weitixian"></i>
          <span>未结算佣金</span>
          <b>{{rewards.wait_amount}}<em> 元</em>
          </b>
        </li>
        <li>
          <i class="iconfont icon-yijiesuan"></i>
          <span>已结算佣金</span>
          <b>{{rewards.finish_amount}}<em> 元</em>
          </b>
        </li>
      </ul>
    </div>
    <!-- <van-tabs v-model="active"
              @click="tabHandel">
      <van-tab title="奖励"> -->
    <span class="tabs">奖励</span>
    <van-pull-refresh v-model="isLoading"  @refresh="loadTop" success-duration="刷新成功">
      <div class="list_box">
        <ul class="box">
          <li v-for="(item,index) in recordsList"
              :key="index">
            <h2 class="monthClass">{{item.create_month}}</h2>
            <div v-for="(item_child,indexs) in item.bonus"
                 :key="indexs"
                 class="boxs">
              <div class="box-child">
                <span>订单号:{{item_child.order.order_sn}}</span>
                <span style="color: #ffbe5a;">{{$i18n.t('money')}}{{item_child.amount}}</span>
              </div>
              <div class="box-child"
                   style="color: #8c8c8c;">
                <span>订单金额:{{$i18n.t('money')}}{{item_child.order.price}}</span>
                <span>分红比例:{{item_child.ratio}}%</span>
                <span>{{item_child.status_name}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </van-pull-refresh>
    <!-- </van-tab>
    </van-tabs> -->
  </div>
</template>

<script>
import video_reward_controller from "./video_reward_controller";

export default video_reward_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#video_reward {
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
      width: 12.5rem;
      text-align: left;

      li:first-child {
        text-align: left;
        font-size: 16px;
        line-height: 1.875rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .name_b {
        font-size: 14px;
        line-height: 1.375rem;
        text-align: left;
      }
    }

    .task {
      font-size: 13px;
      background: rgba(0, 0, 0, 0.2);
      position: absolute;
      right: 0.875rem;
      padding: 0.25rem 0.625rem;
      border-radius: 1rem;
    }
  }

  .info_box {
    background: #fff;
    display: flex;

    .left,
    .right {
      width: 50%;
      padding: 0.625rem 0.875rem;

      li {
        line-height: 1.5rem;
        text-align: left;
        font-size: 14px;

        span {
          font-size: 24px;
        }
      }

      li:last-child {
        color: #8c8c8c;
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

  .today_bonus {
    margin-top: 0.625rem;
    width: 100%;
    height: 5.125rem;
    background: #fff;
    padding: 1rem 0;
    box-sizing: border-box;
    position: relative;

    li.line {
      position: absolute;
      width: 0.0625rem;
      height: 3.25rem;
      background: #ddd;
      top: 1rem;
      right: 34%;

      .careat {
        width: 0.375rem;
        height: 0.375rem;
        border: 0.0625rem solid #ddd;
        border-left: 0;
        border-bottom: 0;
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
        background: #fff;
        position: absolute;
        top: 1.4375rem;
        right: -0.1875rem;
      }
    }

    li {
      text-align: center;
      float: left;

      span {
        font-size: 17px;
        line-height: 1.625rem;
        margin-bottom: 0.625rem;
        display: inline-block;
      }

      b {
        font-size: 11px;
        color: #333;
      }
    }

    .date {
      width: 22%;

      span {
        color: #ffa800;
      }
    }

    li:first-child,
    li:nth-child(2) {
      border-right: 0.0625rem solid #e2e2e2;
    }

    .mounth {
      width: 33%;

      span {
        color: #fc6a70;
      }
    }
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

  .tabs {
    display: inline-block;
    height: 2.75rem;
    line-height: 2.75rem;
    border-bottom: 2px solid #f15353;
    width: 100%;
    text-align: center;
    background: #fff;
    color: #f15353;
  }

  .list_box {
    .box {
      background: #fff;
      //   padding: 0.625rem 0;
      //   border-bottom: solid 0.0625rem #ebebeb;
      li {
        line-height: 1.625rem;
        // display: flex;
        // flex-wrap: wrap;
        // justify-content: space-between;

        font-size: 0.875rem;

        .monthClass {
          padding: 0 0.875rem;
          text-align: left;
          font-weight: 400;
          background: #f4f4f4;
        }

        .boxs {
          padding: 0.625rem 0.875rem;
          border-bottom: 0.0625rem solid #e8e8e8;

          .box-child {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
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
