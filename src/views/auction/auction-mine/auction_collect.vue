<template>
  <div id="auction_collect" ref="auction_collect">
    <c-title :hide="false" text="我的收藏"></c-title>
    <div class="content">
      <template>
        <div class="list" v-for="(item,index) in datas" :key="index" @click="toShop(item)">
          <div class="left">
            <div class="avator">
              <img :src="item.avatar">
            </div>
            <div class="text">
              <div class="top"><span>{{item.nick_name}}</span><span class="circle">已收藏</span></div>
              <div style="text-align: left;">
                <span style="margin-right: 0.5rem; font-size: 12px;" v-if="item.auction_status=='1'">
                  <i class="iconfont icon-pm_auction_certification" style="color: #ff6333;"></i>已认证
                </span>
                <span style="font-size: 12px; color: #999;">拍品:{{item.lot_num}}</span>
              </div>
            </div>
          </div>
          <div class="cancel" @click.stop="toCollect(item)">取消收藏</div>
        </div>
      </template>
      <div class="blank" v-if="datas && datas.length <= 0">
        <img src="../../../assets/images/blank.png">
        <span>还没有记录哦</span>
      </div>
    </div>
  </div>
</template>

<script>
import auction_collect_controller from "./auction_collect_controller";

export default auction_collect_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #auction_collect {
    background-color: #fff;
    height: 100vh;

    .content {
      background-color: #fff;

      .list {
        padding: 0.75rem 1rem;
        border-bottom: solid 1px #f2f2f7;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          align-items: center;

          .avator {
            width: 3.125rem;
            height: 3.125rem;
            box-sizing: border-box;
            border-radius: 50%;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .text {
            margin-left: 1rem;
            justify-content: space-between;

            .top {
              text-align: left;
              display: flex;

              .circle {
                width: 2.9375rem;
                height: 1.1875rem;
                border-radius: 0.5625rem;
                border: solid 0.0625rem #999;
                box-sizing: border-box;
                margin-left: 0.5rem;
                color: #999;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }

            .bottom {
              margin-top: 0.75rem;
              text-align: left;

              .ready {
                font-size: 12px;
                color: #000;
              }

              .num {
                font-size: 12px;
                color: #666;
              }
            }
          }
        }

        .cancel {
          background-color: #ff2c29;
          width: 3.875rem;
          height: 1.1875rem;
          border-radius: 0.5625rem;
          font-size: 12px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .blank {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        img {
          width: 6rem;
          height: 6rem;
        }

        span {
          margin-top: 15px;
          color: #ccc;
          font-size: 14px;
        }
      }
    }
  }
</style>
