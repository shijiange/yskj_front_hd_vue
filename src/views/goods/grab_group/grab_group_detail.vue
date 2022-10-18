<template>
  <div id="group_buy_detail">
    <c-title :hide="false" :text="'抢团详情'"></c-title>
    <div class="content">
      <div class="goods_list">
        <div class="top_box">
          <div class="member_num">
            成团人数 <em style="color: #ff2c29;">{{ info.limit_num }}人</em>
          </div>
          <div class="status">{{ info.state_name }}</div>
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
                <span>{{ info.payed_num }}人付款</span>
              </div>
            </li>
            <li class="price">
              <span>{{ $i18n.t("money") }}</span
              >{{ info.price }}
              <!-- <span style="text-decoration:line-through;">{{ $i18n.t('money') }}{{ info.market_price }}</span> -->
            </li>
          </ul>
        </div>
      </div>
      <div class="group_user">
        <div class="user_box">
          <div class="user" v-for="(child, i) in info.team_data" :key="i">
            <div class="img" :class="{ current: child.is_leader == 1 }">
              <img :src="child.avatar ? child.avatar : require('../../../assets/images/photo-mr.jpg')" />
            </div>
            <span v-if="child.is_leader == '1'">团长</span>
          </div>
          <template v-if="info.surplus_num > 0">
            <div class="user" v-for="(ie, i) in info.surplus_num" :key="i">
              <div class="img">
                <img src="" />
              </div>
              <i class="iconfont icon-group_wenhao"></i>
            </div>
          </template>
        </div>
        <div class="text_state" style="">
          <div v-if="info.state == 1 || info.state == 4">
            离成团还差{{ info.surplus_num }}人，
            <van-count-down :time="fun.getTimeDifference(info.team_end_time)" class="bottom_time" format="DD天HH时mm分ss秒" @finish="hiddenText">
              <template #default="timeData">
                <em>{{ timeData.days < 10 ? `0${timeData.days}` : timeData.days }} </em>天
                <em>{{ timeData.hours < 10 ? `0${timeData.hours}` : timeData.hours }}</em>
                <b>:</b>
                <em>{{ timeData.minutes < 10 ? `0${timeData.minutes}` : timeData.minutes }}</em>
                <b>:</b>
                <em>{{ timeData.seconds < 10 ? `0${timeData.seconds}` : timeData.seconds }}</em>
              </template>
            </van-count-down>
            <template v-if="!isHidden_text">后结束</template>
          </div>
          <div v-else-if="info.state == 2">该团已抢团成功</div>
          <div v-else-if="timestamp > Number(info.team_end_time)">很抱歉，抢团已结束</div>
          <div v-else-if="timestamp > Number(info.activity_end_time)">很抱歉，该团已结束</div>
          <div v-else-if="info.is_oneself == 1">待支付，请尽快支付！</div>
          <div v-else>当前该团状态：{{ info.state_name }}</div>
        </div>

        <template v-if="timestamp < Number(info.team_end_time)">
          <!-- 进行中 -->
          <template v-if="info.is_leader == 1">
            <!-- 团长 -->
            <div class="look_btn" v-if="info.state == 1 && ((info.is_join == 0 && info.is_wait_pay == 0) || (info.is_join == 1 && info.is_wait_pay == 0))" @click="shareWeixin">
              <button type="button">邀请好友</button>
            </div>
          </template>

          <template v-if="info.is_leader == 0">
            <!-- 团员 -->
            <div class="look_btn" v-if="info.is_join == 1 && info.state == 1" @click="shareWeixin">
              <button type="button">邀请好友</button>
            </div>
            <div v-if="isCheckActivity && info.surplus_num > 0 && info.is_join == 0 && info.is_wait_pay == 0 && info.state == 1" class="look_btn" @click="openSpecs">
              <button type="button">我要参团</button>
            </div>
          </template>

          <div v-if="info.order_id && info.is_join == 0 && info.is_wait_pay == 1" class="look_btn" @click="gotoOrderDetail">
            <button type="button">去支付</button>
          </div>

          <div v-if="!isCheckActivity || info.state == 2 || info.state == 3" class="look_btn">
            <button type="button" style="background: #999;" @click="gotoHome">更多抢团进行中</button>
          </div>

          <div v-if="info.state == 2 || info.state == 3" class="look_btn" @click="openGroup">
            <button type="button">我要开团</button>
          </div>
        </template>
        <template v-else>
          <!-- 结束 -->
          <div v-if="!isCheckActivity || info.state == 2 || info.state == 3" class="look_btn">
            <button type="button" style="background: #999;" @click="gotoHome">更多抢团进行中</button>
          </div>
        </template>

        <!-- <div class="look_btn" v-if="timestamp < Number(info.team_end_time) && info.is_join == 1 && info.state == 1" @click="shareWeixin">
          <button type="button">邀请好友</button>
        </div>
        <div v-else-if="timestamp < Number(info.team_end_time) && (info.state == 2 || info.state == 3)" class="look_btn" @click="openGroup">
          <button type="button">我要开团</button>
        </div>
        <div v-else-if="!isCheckActivity || (timestamp > Number(info.team_end_time) && (info.state == 2 || info.state == 3))" class="look_btn">
          <button type="button" style="background: #999;" @click="gotoHome">更多抢团进行中</button>
        </div>
        <div v-else-if="isCheckActivity && info.is_join == 0 && is_oneself == 0 && timestamp < Number(info.team_end_time) && info.state == 1" class="look_btn" @click="openSpecs">
          <button type="button">我要参团</button>
        </div>

        <div v-else-if="info.order_id && info.is_oneself == 1 && timestamp < Number(info.team_end_time)" class="look_btn" @click="gotoOrderDetail">
          <button type="button">去支付</button>
        </div> -->
      </div>

      <div class="win_member" v-if="!fun.isTextEmpty(info.win_member)">
        <div class="win_member_text">抢团中奖</div>
        <div class="win_member_img">
          <img :src="info.win_member.avatar" alt="" />
        </div>
        <div class="win_member_text" style="text-align: center; color: #ff2c29;">恭喜 {{ info.win_member.nickname }} 中奖！</div>
      </div>
    </div>

    <yz-specs :goodsInfo="info" ref="goodSku" v-model="popupSpecs" v-on:closeSpecsPopup="close_yz_specs_popup">
      <div class="slot_style">
        <span>{{ info.limit_num }}人团</span>
      </div>
    </yz-specs>

    <div class="play-video" v-if="showShare" style="z-index: 9999;" @click="closeShare">
      <img src="../../../assets/images/share_bg1.png" alt />
      <p>请点击右上角进行分享</p>
    </div>
  </div>
</template>

<script>
import grab_group_detail_controller from "./grab_group_detail_controller";

export default grab_group_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.bottom_time {
  display: inline-block;
  color: #ff2c29;
}

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
      }
    }

    .win_member {
      background: #fff;
      margin-top: 0.625rem;
      padding: 0.875rem;

      .win_member_text {
        text-align: left;
      }

      .win_member_img {
        img {
          width: 3rem;
          height: 3rem;
          border-radius: 100%;
          border: solid 1px #ff7371;
          margin: 0.875rem;
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

  .slot_style {
    display: flex;
    padding: 0 0.625rem;
    margin: 0.875rem 0;

    span {
      height: 1.625rem;
      line-height: 1.625rem;
      display: inline-block;
      border: 1px solid #fb4a4a;
      border-radius: 0.25rem;
      color: #fb4a4a;
      padding: 0 0.5rem;
    }
  }

  .play-video {
    position: fixed;
    z-index: 9;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }

    p {
      position: fixed;
      top: 40%;
      width: 100%;
      text-align: center;
      font-size: 1.5rem;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
