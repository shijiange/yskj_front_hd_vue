<template>
  <div id="group_buy_detail">
    <c-title :hide="false" :text="'拼购详情'"></c-title>
    <div class="content">
      <div class="goods_list">
        <div class="top_box">
          <div class="member_num">
            成团人数 <em style="color: #ff2c29;">{{ info.buy_number }}人</em>
          </div>
          <div class="status">{{ info.state | setStateName }}</div>
        </div>
        <div class="goods_box">
          <div class="goods_img">
            <img :src="info.thumb" @click="gotoGoods" />
          </div>
          <ul class="goods_info">
            <li class="name" style="-webkit-box-orient: vertical;">
              {{ info.title }}
            </li>
            <li class="number">
              <div class="left">
                <span>{{ info.pay_num }}人付款</span>
              </div>
            </li>
            <li class="price">
              <span>{{ $i18n.t('money') }}</span
              >{{ info.price
              }}<span style="text-decoration: line-through;">{{ $i18n.t('money') }}{{ info.market_price }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="group_user">
        <div class="user_box" v-if="info.state == 1 || info.state == 2">
          <div class="user" v-for="(child, i) in info.staff_member" :key="i">
            <div class="img" :class="{ current: child.is_leader == 1 }">
              <img :src="child.avatar" />
            </div>
            <span v-if="child.is_leader == '1'">团长</span>
          </div>
          <div class="user" v-for="(ie, i) in info.buy_number - info.pay_num" :key="i">
            <div class="img">
              <img src="" />
            </div>
            <i class="iconfont icon-group_wenhao"></i>
          </div>
        </div>
        <div class="text_state" style="">
          <div v-if="info.state == 1 || info.state == 4">
             离成团还差{{ info.buy_number - info.pay_num }}人，
              <van-count-down :time="fun.getTimeDifference(info.end_time)" class="bottom_time" format="DD天HH时mm分ss秒">
                <template #default="timeData">
                  <em>{{ timeData.days <10 ? `0${timeData.days}` :timeData.days}}</em>天
                  <em>{{ timeData.hours <10 ? `0${timeData.hours}` :timeData.hours}}</em>
                  <b>:</b>
                  <em>{{ timeData.minutes <10 ? `0${timeData.minutes}` :timeData.minutes}}</em>
                  <b>:</b>
                  <em>{{ timeData.seconds <10 ? `0${timeData.seconds}` :timeData.seconds}}</em>
                </template>
              </van-count-down>
            后结束
          </div>
          <div v-else-if="info.state == 2">该团已拼购成功</div>
          <div v-else-if="info.status == 0">很抱歉，该活动已结束</div>
          <div v-else-if="info.state == 0">待支付，请尽快支付！</div>
          <div v-else>未达到拼购人数，拼购失败！</div>
        </div>
        <div
          class="look_btn"
          v-if="info.status == 1 && info.is_self == 1 && (info.state == 1 || info.state == 4)"
          @click="joinshareWeixinTeam"
        >
          <button type="button">邀请好友</button>
        </div>
        <div
          v-if="(info.status == 1 && info.state == 5) || info.state == 6 || info.state == 3"
          class="look_btn"
          @click="openGroup"
        >
          <button type="button">我要开团</button>
        </div>
        <div v-if="!isCheckActivity || info.status == 0 || info.state == 7" class="look_btn">
          <button type="button" style="background: #999;">更多拼购进行中</button>
        </div>
        <div
          v-if="info.status == 1 && info.is_self == 0 && (info.state == 4 || info.state == 1)"
          class="look_btn"
          @click="joinTeam"
        >
          <button type="button">我要参团</button>
        </div>
        <div v-if="info.state == 0" class="look_btn" @click="gotoOrderDetail">
          <button type="button">去支付</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import group_buy_detail_controller from './group_buy_detail_controller';

export default group_buy_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#group_buy_detail {
  padding-bottom: 60px;

  .content {
    .goods_list {
      background: #fff;
      margin: 0.75rem;
      border-radius: 0.375rem;
      overflow: hidden;

      .top_box {
        display: flex;
        justify-content: space-between;
        height: 2.125rem;
        line-height: 2.125rem;
        padding: 0 0.625rem;
      }

      .goods_box {
        display: flex;
        padding: 0.625rem;
        border-bottom: solid 0.0625rem #ebebeb;

        .goods_img {
          width: 7.875rem;
          height: 7.875rem;
          background: #f2f2f2;
          overflow: hidden;
          border-radius: 0.25rem;
          margin-right: 0.625rem;
          flex-shrink: 0;

          img {
            width: 100%;
          }
        }

        .goods_info {
          width: 14.0625rem;
          text-align: left;
          flex: 1;

          .name {
            font-size: 0.875rem;
            line-height: 1.125rem;
            height: 4.5rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
          }

          .price {
            font-size: 16px;
            margin-top: 0.375rem;
            color: #ff2c29;

            span {
              font-size: 12px;
            }

            span:last-child {
              color: #8c8c8c;
              margin-left: 0.625rem;
            }
          }

          .number {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 0.375rem;
            color: #666;

            .left {
              display: flex;
              align-items: center;

              .iconfont {
                font-size: 1.5rem;
                color: #ff2c29;
                margin-right: 0.375rem;
              }

              span {
                // color: #ff2c29;
                font-size: 14px;
                // border-left: solid 0.0625rem #ebebeb;
                padding-left: 0.375rem;
              }
            }

            .go_group {
              height: 1.75rem;
              border-radius: 0.25rem;
              border: solid 0.0625rem #ff2c29;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: 0.625rem;
              color: #ff2c29;
              padding: 0 0.85rem;
            }
          }
        }
      }

      .goods_box:last-child {
        border: none;
      }
    }

    .into_group {
      margin-top: 0.625rem;
      background: #fff;
      padding: 0.875rem;

      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.625rem;

        .line_left,
        .line_right {
          border: solid 0.0625rem #ff2c29;
          width: 3.75rem;
        }

        span {
          margin: 0 1.25rem;
          font-size: 16px;
          color: #ff2c29;
        }
      }

      .time {
        em {
          background-color: #ff2c29;
          color: #fff;
        }
      }

      p {
        margin-top: 0.875rem;
        font-size: 14px;

        span {
          color: #ff2c29;
        }
      }

      .btn {
        margin-top: 1.25rem;
        width: 18.75rem;
        height: 2.5rem;
        border-radius: 0.375rem;
        color: #fff;
        font-size: 16px;
        background: #ff2c29;
        border: none;
      }

      .endClass {
        background-color: #969799;
      }
    }

    .group_user {
      background: #fff;
      margin-top: 0.625rem;
      padding: 0.875rem;

      h2 {
        font-weight: normal;
        font-size: 15px;
        margin-bottom: 0.625rem;
        text-align: left;
      }

      .user_box {
        padding: 1.25rem 0;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        max-height: 8.5rem;
        overflow: scroll;

        .user {
          position: relative;
          margin: 0 0.375rem 0.85rem;

          .img {
            width: 3rem;
            height: 3rem;
            background: #fafafa;
            border-radius: 2rem;
            border: dashed 0.0625rem #ff8340;
            overflow: hidden;
            display: flex;

            img {
              width: 100%;
            }
          }

          .iconfont {
            width: 3rem;
            height: 3rem;
            font-size: 1.5rem;
            color: #ebebeb;
            position: absolute;
            line-height: 3rem;
            top: 0;
            left: 0;
          }

          span {
            width: 2.125rem;
            height: 1.125rem;
            line-height: 1.125rem;
            border-radius: 2rem;
            background: #ff8340;
            font-size: 10px;
            color: #fff;
            display: block;
            position: absolute;
            top: -0.5rem;
            right: -0.875rem;
          }

          .current {
            border: dashed 0.0625rem #ff8340;
          }
        }
      }

      .text_state {
        color: #ff2c29;
        text-align: center;
        font-size: 1rem;
        padding: 1rem 0 1.5rem;
        // font-weight: bold;
        .bottom_time {
          display: inline-block;
          color: #ff2c29;
          font-size: 1rem;
        }
      }
    }

    .look_btn {
      background: #fff;
      width: 100%;

      button {
        border: none;
        background: #ff2c29;
        font-size: 16px;
        color: #fff;
        width: 16.25rem;
        height: 2.5rem;
        border-radius: 1.375rem;
      }
    }
  }

  .mint-popup-4 {
    width: 100%;
  }

  .one_open {
    padding-bottom: 3.75rem;

    .img_price {
      display: flex;
      padding: 0.875rem;

      .goods {
        width: 5.875rem;
        height: 5.875rem;
        background: #f2f2f2;
        border: solid 0.0625rem #ebebeb;
        overflow: hidden;
        border-radius: 0.1875rem;
        position: absolute;
        top: -1.875rem;

        img {
          width: 100%;
        }
      }

      .price {
        margin-left: 6.875rem;
        text-align: left;

        .price_a {
          color: #ff2c29;
          font-size: 18px;
        }

        .price_b {
          color: #8c8c8c;
          font-size: 12px;
        }
      }
    }

    .icon_close {
      position: absolute;
      top: 0.25rem;
      right: 0;
      width: 2.5rem;
      height: 2.5rem;

      .iconfont {
        line-height: 2.5rem;
        font-size: 1.125rem;
        color: #999;
      }
    }

    .select_box {
      padding: 0.875rem 0.875rem 0 0.875rem;

      .select {
        border-top: solid 0.0625rem #ebebeb;
        display: flex;
        flex-wrap: wrap;
        padding: 0.875rem 0;

        li {
          width: 6.75rem;
          padding: 0.625rem 0;
          border: solid 0.0625rem #ebebeb;
          border-radius: 0.25rem;
          margin-right: 0.625rem;
          margin-bottom: 0.625rem;

          span {
            display: block;
            font-size: 14px;

            font {
              font-size: 18px;
            }
          }
        }

        li:nth-child(3n) {
          margin-right: 0;
        }

        .current {
          border: solid 0.0625rem #ff2c29;
          color: #ff2c29;
        }
      }

      .van-radio-group {
        display: flex;
        flex-wrap: wrap;

        .van-radio {
          margin-right: 0.3125rem;
          margin-bottom: 0.3125rem;
          background: #fff;
          border: 1px solid #bfcbd9;
          text-align: center;
          box-sizing: border-box;
          border-radius: 0.25rem;
        }

        .vantRadioshow {
          background-color: rgb(241, 83, 83);
          border-color: rgb(241, 83, 83);
          box-shadow: rgb(241, 83, 83) -1px 0 0 0;
        }
      }
    }

    .noVantRadio {
      padding: 0 1.25rem;

      .van-radio-group {
        .van-radio__label {
          padding: 2rem !important;
        }
      }

      dl {
        margin-bottom: 0.8rem;
        text-align: left;

        dt {
          margin-bottom: 0.5rem;
        }

        .van-radio-group {
          display: flex;
          flex-wrap: wrap;

          .van-radio {
            margin-right: 0.3125rem;
            margin-bottom: 0.3125rem;
            background: #fff;
            border: 1px solid #bfcbd9;
            text-align: center;
            box-sizing: border-box;
            border-radius: 0.25rem;
          }

          .vantRadioshow {
            background-color: rgb(241, 83, 83);
            border-color: rgb(241, 83, 83);
            box-shadow: rgb(241, 83, 83) -1px 0 0 0;
          }
        }
      }
    }

    .buy_number {
      margin: 0 0.875rem;
      height: 3.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: solid 0.0625rem #ebebeb;
      border-bottom: solid 0.0625rem #ebebeb;

      .num {
        border-radius: 0.1875rem;
        float: right;
        background-color: #fff;

        .leftnav {
          height: 1.75rem;
          width: 1.75rem;
          float: left;
          background-color: #f2f2f2;
          color: #999;
          text-align: center;
          border-radius: 0.1875rem;
          line-height: 1.75rem;
          font-size: 18px;
          font-weight: bold;
        }

        .shownum {
          height: 1.75rem;
          width: 2.25rem;
          float: left;
          border: 0;
          margin: 0;
          padding: 0;
          text-align: center;
          color: #333;
        }

        .rightnav {
          height: 1.75rem;
          width: 1.75rem;
          float: right;
          background-color: #f2f2f2;
          color: #999;
          text-align: center;
          border-radius: 0.1875rem;
          line-height: 1.75rem;
          font-size: 18px;
          font-weight: bold;
        }
      }
    }

    .btn {
      background: #ff2c29;
      height: 3.125rem;
      width: 100%;
      color: #fff;
      font-size: 16px;
      position: fixed;
      bottom: 0;
      left: 0;
      border: none;
    }
  }
}
</style>
