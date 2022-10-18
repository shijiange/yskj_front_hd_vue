<template>
  <div id="wallet_detail"
       ref="wallet_detail">
    <c-title :hide="false"
             text="电子钱包明细"></c-title>
    <div class="content">
      <div class="tab_box">
        <ul class="tab_list">
          <van-tabs v-model="active"
                    @click="onClick"
                    id="tab">
            <van-tab title="收入"
                     id='0'
                     class="tabChild"></van-tab>
            <van-tab title="支出"
                     id='1'
                     class="tabChild"></van-tab>
          </van-tabs>
        </ul>
      </div>
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <ul class="new-box">
          <li class="list"
              v-for="(item,index) in datas"
              :key="index">
            <div class="left">
              <p class="top">{{item.jrnno}}</p>
              <p class="bottom">{{item.lcg_time}}</p>
            </div>
            <div class="right">
              <p class="top">{{item.inoutFlag}}{{item.trAmt}}</p>
              <p class="bottom">{{item.accBalance}}</p>
            </div>
            <div class="remark">
              备注：{{item.remk}}
            </div>
          </li>
        </ul>
      </van-pull-refresh>
      <div class="blank"
           v-if="datas.length<=0">
        <img src="../../../assets/images/blank.png">
        <span>还没有记录哦</span>
      </div>
    </div>
  </div>
</template>

<script>
import wallet_detail_controller from "./wallet_detail_controller";
export default wallet_detail_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#wallet_detail {
  background-color: #fff;

  .content {
    height: 100%;

    .tab_box {
      background: #fff;
      position: relative;

      .tab_list {
        height: 44px;
        line-height: 44px;
        border-bottom: solid 1px #ebebeb;
        // overflow-x: scroll;
        overflow-x: hidden;
        overflow-y: hidden;
        transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
        transition-duration: 300ms;
        font-size: 18px;
      }
    }

    .new-box {
      background-color: #fff;
      padding: 0 1rem;
      padding-top: 1rem;

      .list {
        margin-top: 1rem;
        border-bottom: solid 1px #ccc;
        display: flex;
        justify-content: space-between;
        padding-bottom: 1rem;
        flex-wrap: wrap;

        .left {
          .top {
            font-size: 14px;
            color: #333;
            text-align: left;
          }

          .bottom {
            font-size: 12px;
            color: #999;
            margin-top: 0.5rem;
            text-align: left;
          }
        }

        .right {
          .top {
            font-size: 14px;
            color: #f76d6d;
            text-align: right;
          }

          .bottom {
            font-size: 12px;
            color: #999;
            margin-top: 0.5rem;
            text-align: right;
          }
        }

        .remark {
          width: 100%;
          text-align: left;
          margin-top: 0.5rem;
          font-size: 12px;
        }
      }

      .list:first-child {
        margin-top: 0;
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
