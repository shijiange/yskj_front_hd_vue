<template>
  <div id="auctioneer_shop" ref="auctioneer_shop" >
    <c-title :hide="false" text="拍卖官店铺"></c-title>
    <div class="content" v-if="is_verify==1">
      <div class="top">
          <div class="input">
              <i class="iconfont icon-sousuo"></i>
              <input type="text" placeholder="搜索拍卖商品" @click="toSearch">
            </div>
            <!-- <i class="iconfont icon-life-code"  @click="postShow()"></i>
            <i class="iconfont icon-bc_share_card"></i> -->
      </div>
      <div class="bot">
        <div class="tit">
          <div class="user">
            <div class="avator">
              <img :src="info.avatar">
            </div>
            <div class="right">
              <div>{{info.nickname}}</div>
              <div style="text-align: left;"><span style="margin-right: 0.5rem; font-size: 12px;" v-if="info.status=='已认证'"><i class="iconfont icon-pm_auction_certification" style="color: #ff6333;"></i>已认证</span><span style="font-size: 12px; color: #999;">拍品:{{info.lot_num}}</span></div>
            </div>
          </div>
          <div class="collect" @click="toCollect" v-if="info.is_collection==0">收藏</div>
          <div class="collect" @click="toCollect" v-if="info.is_collection==1">已收藏</div>
        </div>
        <van-tabs v-model="activeName"
        @change="handleClick"
                    id="tab">
        <van-tab title="全部拍品"
         name="0" ></van-tab>
         <van-tab title="竞拍中"
         name="1"
         ></van-tab>
         <van-tab title="即将开始"
          name="2"
         ></van-tab>
         <van-tab title="已结束"
         name="3"
         ></van-tab>
        </van-tabs>
        <div class="good-list">
            <div class="good" v-for="(item,index) in datas" :key="index">
              <div class="image" @click="toDetail(item)" v-if="item.has_one_goods">
                  <img :src="item.has_one_goods.thumb">
              </div>
              <div class="bottom">
                <div class="tit" v-if="item.has_one_goods">{{item.has_one_goods.title}}</div>
                <div class="cash">
                    <span>起拍价</span>
                    <div class="money"><span style="font-size: 12px;">{{$i18n.t('money')}}</span><span>{{item.start_price}}</span></div>
                </div>
              </div>
              <div class="time">
                {{timestampToTime(item.end_shooting)}}结束
            </div>
            </div>
          </div>
      </div>
    </div>
    <div class="btn" @click="toMy" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <i class="iconfont icon-home-line6"></i>
        <div>我的</div>
      </div>
      <van-popup v-model="show1" position="bottom" :close-on-masker="false" style="width: 100%; height: 40%;">
        <div class="pop">
            <div class="title">请输入店铺密码</div>
            <div class="check">
              <span>密码</span>
              <input type="password" v-model="password">
            </div>
            <div class="bottom-btn" @click="confirm(item)">
              确定
            </div>
        </div>
      </van-popup>
  </div>
</template>

<script>
import auctioneer_shop_controller from "./auctioneer_shop_controller";

export default auctioneer_shop_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#auctioneer_shop {
  height: 100vh;

  .content {
    background-color: #fff;
    height: 100%;
    overflow: scroll;

    .top {
      background-color: #ff5430;
      position: relative;
      padding-top: 0.75rem;
      display: flex;
      justify-content: center;
      height: 8rem;

      .input {
        width: 16.8125rem;
        height: 1.875rem;
        background-color: #f8f8f8;
        border-radius: 0.9375rem;
        margin-right: 1rem;
        display: flex;
        align-items: center;

        i {
          color: #c9c9c9;
          margin-right: 0.75rem;
          margin-left: 0.75rem;
        }

        input {
          outline: none;
          border: none;
          color: #c9c9c9;
          font-size: 12px;
        }
      }

      .icon-bc_share_card {
        color: #fff;
        font-size: 24px;
        margin-right: 1rem;
      }

      .icon-life-code {
        color: #fff;
        font-size: 24px;
        margin-right: 1rem;
        display: inline-block;
      }
    }

    .bot {
      background-color: #fff;
      border-radius: 1.1875rem 1.1875rem 0 0;
      padding: 0 0.75rem;
      padding-top: 0.5rem;
      margin-top: -2rem;
      position: relative;
      z-index: 999;
      height: 100%;

      .tit {
        display: flex;
        justify-content: space-between;

        .user {
          display: flex;

          .avator {
            width: 4.3125rem;
            height: 4.3125rem;
            border: solid 0.125rem #fff;
            box-sizing: border-box;
            border-radius: 50%;
            margin-top: -2rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .right {
            margin-left: 0.5rem;
            text-align: left;
          }
        }

        .collect {
          width: 2.8125rem;
          height: 1.1875rem;
          border-radius: 0.5625rem;
          border: solid 0.0625rem #ff2c29;
          box-sizing: border-box;
          font-size: 12px;
          color: #ff2c29;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .good-list {
      margin-top: 1.25rem;
      display: flex;
      flex-wrap: wrap;

      .good {
        width: 48%;
        margin-right: 4%;
        box-shadow: 0 0 0.4375rem 0 rgba(194, 194, 194, 0.31);
        border-radius: 0.3125rem;
        position: relative;
        margin-bottom: 1.25rem;

        .image {
          width: 100%;
          height: 10.625rem;

          img {
            width: 100%;
            height: 100%;
            border-top-left-radius: 0.3125rem;
            border-top-right-radius: 0.3125rem;
          }
        }

        .bottom {
          padding: 0 0.5rem;
          padding-top: 0.5rem;
          padding-bottom: 1rem;

          .tit {
            color: #333;
            text-align: left;
          }

          .cash {
            text-align: left;
            font-size: 12px;
            display: flex;
            margin-top: 0.5rem;

            .money {
              font-size: 16px;
              color: #ef3e3e;
            }
          }
        }

        .time {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 0;
          left: 0;
          width: 5.4375rem;
          background-image:
            linear-gradient(
              270deg,
              #ff6333 0%,
              #ff2c29 100%
            ),
            linear-gradient(
              #fe8a02,
              #fe8a02
            );
          border-radius: 0.3125rem 0 0.3125rem;
          box-sizing: border-box;
          color: #fff;
          font-size: 12px;
        }
      }

      .good:nth-child(2n) {
        margin-right: 0;
      }
    }
  }

  .btn {
    width: 3.5rem;
    height: 3.5rem;
    background-color: #ff2c29;
    box-shadow:
      0 0 0.1875rem 0
      rgba(237, 11, 11, 0.23);
    border: solid 0.0625rem #f51f27;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 70%;
    right: 0.9375rem;
    flex-wrap: wrap;
    font-size: 12px;
    flex-direction: column;
    z-index: 9999;
  }

  .pop {
    padding: 0 0.75rem;

    .check {
      display: flex;
      padding-bottom: 1rem;

      input {
        flex: 1;
        border: none;
        outline: none;
        margin-left: 1rem;
        border-bottom: solid 1px #ccc;
      }
    }

    .title {
      font-size: 18px;
      padding: 1.5rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .bottom-btn {
      height: 2.8125rem;
      background-image:
        linear-gradient(
          #ff2c29,
          #ff2c29
        ),
        linear-gradient(
          #ff590f,
          #ff590f
        );
      background-blend-mode:
        normal,
        normal;
      border-radius: 1.4375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #fff;
      margin-top: 6.25rem;
    }
  }
}

.pcStyle {
  position: absolute !important;
}
</style>
