<template>
  <div>
    <c-title :hide="false" :text="'消费红包'">
    </c-title>

    <div class="content">
      <div class="background">
        <div class="user">
          <div class="user-head">
            <img :src="base_data.avatar"/>
          </div>
          <div class="user-name">{{base_data.nickname}}</div>
        </div>
      </div>
      <div class="absolute-block">
        <div class="left" style="border-right: 1px solid #ffd5cd;">
          <span class="first"><b>{{base_data.wait_amount}}</b></span>
          <span class="second">未结算金额</span>
        </div>
        <div class="left">
          <span class="first"><b>{{base_data.settle_amount}}</b></span>
          <span class="second">已结算金额</span>
        </div>
      </div>

      <div style="margin-top: -1.7rem;">
        <van-tabs v-model="active" @change='changeTab'>
          <van-tab title="全部" name="">
            <ul class="rationList1">
              <li v-for="(item, index) in list" :key="index">
                <div class="detail">
                  <div class="info">
                    <ul class="left">
                      <li>订单号：{{item.order_sn}}</li>
                      <li class="time">{{item.created_at}}</li>
                    </ul>
                    <ul class="right">
                      <li style="font-size: 16px;">+{{item.packet_amount}}</li>
                      <li class="state">{{item.settle_status}}</li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </van-tab>
          <van-tab title="未结算" name="0">
            <ul class="rationList1">
              <li v-for="(item, index) in list" :key="index">
                <div class="detail">
                  <div class="info">
                    <ul class="left">
                      <li>订单号：{{item.order_sn}}</li>
                      <li class="time">{{item.created_at}}</li>
                    </ul>
                    <ul class="right">
                      <li style="font-size: 16px;">+{{item.packet_amount}}</li>
                      <li class="state">{{item.settle_status	}}</li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </van-tab>
          <van-tab title="已结算" name="1">
            <ul class="rationList1">
              <li v-for="(item, index) in list" :key="index">
                <div class="detail">
                  <div class="info">
                    <ul class="left">
                      <li>订单号：{{item.order_sn}}</li>
                      <li class="time">{{item.created_at}}</li>
                    </ul>
                    <ul class="right">
                      <li style="font-size: 16px;">+{{item.packet_amount}}</li>
                      <li class="state">{{item.settle_status	}}</li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </van-tab>
          <van-tab title="已失效" name="-1">
            <ul class="rationList1">
              <li v-for="(item, index) in list" :key="index">
                <div class="detail">
                  <div class="info">
                    <ul class="left">
                      <li>订单号：{{item.order_sn}}</li>
                      <li class="time">{{item.created_at}}</li>
                    </ul>
                    <ul class="right">
                      <li style="font-size: 16px;">+{{item.packet_amount}}</li>
                      <li class="state">{{item.settle_status	}}</li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import index_controller from "./index_controller";

export default index_controller;
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

    .rationList1 {
      padding: 0;
      margin: 0;
      background: #fff;

      li {
        .info {
          border-bottom: 0.0625rem solid #e2e2e2;
          overflow: hidden;
          padding: 0.625rem 0.75rem;
          line-height: 1.25rem;
          font-size: 14px;

          li {
            line-height: 1.5rem;
          }

          .time,
          .state {
            color: #8c8c8c;
            font-size: 12px;
          }

          .left {
            width: 70%;
            float: left;
            text-align: left;
            box-sizing: border-box;

            span {
              font-size: 14px;
              font-weight: 400;
              color: #333;
            }
          }

          .right {
            float: left;
            width: 30%;
            color: #f14e4e;
            text-align: right;
          }
        }
      }
    }
  }
</style>
