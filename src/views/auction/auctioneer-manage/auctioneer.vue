<template>
  <div id="auctioneer" ref="auctioneer">
    <c-title :hide="false" text="拍卖官管理"></c-title>
    <div class="content">
    <div class="top">
      <div class="user">
        <div class="left">
          <div class="name">
            <span>{{info.nickname}}</span>
            <span class="check" v-if="info.status=='已认证'"><i class="iconfont icon-pm_auction_certification"></i>{{info.status}}</span>
          </div>
          <div class="amount">
            <span>收藏:{{info.collection_num}}</span>
            <span>浏览:{{info.browse_num}}</span>
            <span>参拍:{{info.partake_num}}</span>
          </div>
        </div>
        <div class="right">
          <img :src="info.avatar">
        </div>
      </div>
      <div class="tixian">
        <div class="left">
          <div class="block">
            <span class="money">{{info.mini_deal}}</span>
            <span class="text">累计拍品金额(元)</span>
          </div>
          <div class="block">
            <span class="money">{{info.sure_withdraw_money}}</span>
            <span class="text">可提现金额(元)</span>
          </div>
        </div>
        <div class="right" @click="toPage('extension')">提现</div>
      </div>
    </div>
    <div class="line"></div>
    <div class="bottom">
      <div class="item" @click="toPage('goodManage')">
        <div class="left">
          <i class="iconfont icon-pm_auction_administration"></i>
          <span>拍品管理</span>
        </div>
        <div class="right">
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <div class="item" @click="toOrder">
        <div class="left">
          <i class="iconfont icon-pm_auction_orderadmin"></i>
          <span>订单管理</span>
        </div>
        <div class="right">
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <div class="item" @click="toMoney">
        <div class="left">
          <i class="iconfont icon-pm_auction_myincome"></i>
          <span>我的收入</span>
        </div>
        <div class="right">
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <div class="item" @click="toPage('passwordChange')"  v-if="info.status=='已认证'">
        <div class="left">
          <i class="iconfont icon-pm_auction_lockadmin" ></i>
          <span>店铺密码设置</span>
        </div>
        <div class="right">
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <!-- <div class="item">
        <div class="left">
          <i class="iconfont icon-pm_auction_haibaoshare"></i>
          <span>店铺分享海报</span>
        </div>
        <div class="right">
          <i class="fa fa-angle-right"></i>
        </div>
      </div> -->
    </div>
    </div>
  </div>
</template>

<script>
import auctioneer_controller from "./auctioneer_controller";

export default auctioneer_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#auctioneer {
  background-color: #fff;
  height: 100vh;

  .content {
    background: #fff;

    .top {
      padding: 1rem;

      .user {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          .name {
            display: flex;
            align-items: center;

            .check {
              width: 4.125rem;
              border-radius: 0.5625rem;
              border: solid 1px #ff6333;
              box-sizing: border-box;
              margin-left: 0.5rem;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: #ff6333;
            }
          }

          .amount {
            margin-top: 1rem;
            font-size: 12px;
            color: #666;

            span {
              margin-right: 1.125rem;
            }

            span:last-child {
              margin-right: 0;
            }
          }
        }

        .right {
          width: 3rem;
          height: 3rem;
          box-shadow: 0 0.125rem 0.25rem 0 	rgba(0, 0, 0, 0.35);
          box-sizing: border-box;
          border-radius: 50%;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }

      .tixian {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2.25rem;

        .left {
          display: flex;

          .block {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .money {
              font-size: 18px;
              color: #000;
            }

            .text {
              font-size: 12px;
              display: inline-block;
              margin-top: 1rem;
            }
          }

          .block:last-child {
            margin-left: 2rem;
          }
        }

        .right {
          width: 4.375rem;
          height: 1.5625rem;
          background-color: #ff2c29;
          border-radius: 0.8125rem;
          color: #fff;
          font-size: 14px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .line {
      width: 100%;
      height: 0.625rem;
      background-color: #f2f2f7;
    }

    .bottom {
      padding: 0 1rem;
      padding-top: 0.75rem;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        .left {
          display: flex;
          align-items: center;

          i {
            font-size: 18px;
            color: #000;
          }

          span {
            font-size: 14px;
            color: #000;
            margin-left: 0.5rem;
          }
        }

        .right {
          i {
            font-size: 18px;
            color: #666;
          }
        }
      }

      .item:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
