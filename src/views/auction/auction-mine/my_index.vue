<template>
  <div id="my_index" ref="my_index">
    <c-title :hide="false" text="我的"></c-title>
      <div class="content">
        <div class="avator">
          <div class="user">
            <img :src="info.avatar">
          </div>
          <div class="nickname">{{info.nickname}}</div>
        </div>
        <div class="title">我的拍卖</div>
        <ul class="icon">
            <li  @click="toAuction('0')">
           
                  <i class="iconfont icon-pm_auction_waiting"></i>
                  <span>待开拍</span>
             
            </li>
            <li  @click="toAuction('1')">
              
                  <i class="iconfont icon-pm_auction_ing"></i>
                  <span>竞价中</span>
             
            </li>
            <li  @click="toAuction('2')">
             
                  <i class="iconfont icon-pm_auction_over"></i>
                  <span>已结束</span>
             
            </li>
            <li  @click="toAuction('3')">
             
                  <i class="iconfont icon-pm_auction_maysure"></i>
                  <span>待确认</span>
           
            </li>
            <li  @click="toAuction('4')">
             
              <i class="iconfont icon-pm_auction_ed"></i>
              <span>已拍下</span>
       
        </li>
        </ul>
        <div class="bottom">
          <div class="item" @click="toIntergal">
            <div class="left">
              <i class="iconfont icon-pm_auction_myincome"></i>
              <span>保证金/预付款</span>
            </div>
            <div class="right">
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
          <div class="item" @click="toCollect">
            <div class="left">
              <i class="iconfont icon-card_collect"></i>
              <span>我的收藏</span>
            </div>
            <div class="right">
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import my_index_controller from "./my_index_controller";

export default my_index_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#my_index {
  background-color: #fff;
  height: 100vh;

  .content {
    background-color: #fff;
    padding-left: 1.25rem;
    padding-right: 1.25rem;

    .avator {
      padding-top: 0.875rem;
      padding-bottom: 1.8125rem;
      display: flex;
      align-items: center;

      .user {
        width: 2.625rem;
        height: 2.625rem;
        box-sizing: border-box;
        border-radius: 50%;

        img {
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }

      .nickname {
        margin-left: 0.75rem;
      }
    }

    .title {
      margin-bottom: 2rem;
      text-align: left;
    }

    .icon {
      width: 100%;
      display: flex;

      li {
        display: flex;
        flex-direction: column;
        flex: 1;
        align-items: center;
        justify-content: center;

        i {
          font-size: 28px;
          color: #ff2c29;
        }

        span {
          font-size: 12px;
        }
      }
    }

    .bottom {
      margin-top: 3rem;

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
    }
  }
}
</style>
