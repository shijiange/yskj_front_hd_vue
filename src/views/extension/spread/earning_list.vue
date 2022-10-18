<template>
  <div id="earning_list">
    <c-title :hide="false" :text="'领取收益'">
    </c-title>
    <div id="list_box">
      <ul class="tab">
        <li>订单编号</li>
        <li>金额</li>
        <li>领取</li>
      </ul>
      <div class="list">
        <ul class="item" v-for="(item,i) in earningList" :key='i'>
          <li>{{item.order_sn}}</li>
          <li>{{item.amount}}</li>
          <li>
            <van-button type="hollow" @click.native="getAdvertising(item.id)">领取</van-button>
          </li>
        </ul>
        <!-- 领取弹窗 -->
        <van-popup v-model="show1" position="center" style="height: 100%; width: 100%;">
          <div class="bg_img">
            <img class="adv_img"
                 :src="adv_thumb"
                 alt="图片">
            <div class="bg_color">
              <div class="receive">
                <ul class="text">
                  <li>已成功领取{{plugin_text}}</li>
                  <li>{{income}}</li>
                  <li>已存入{{reward_type?reward_type:income_name_text}}</li>
                </ul>
                <van-button type="hollow" @click.native="toAdvertising">我知道了</van-button>
              </div>
            </div>
          </div>
        </van-popup>
        <!-- end -->
      </div>

    </div>
  </div>
</template>

<script>
import earning_list_controller from "./earning_list_controller";

export default earning_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #earning_list {
    height: 41.6875rem;
    background-color: #fff;

    #list_box {
      .tab {
        background-color: #fafafa;
        height: 2.8125rem;
        line-height: 2.8125rem;
        display: flex;
        font-weight: bold;
        font-size: 15px;

        li:first-child {
          width: 9.8125rem;
        }

        li:nth-child(2) {
          width: 6.875rem;
        }

        li:nth-child(3) {
          width: 4.375rem;
        }
      }

      .list {
        padding: 0.625rem 0;

        .item {
          display: flex;
          height: 2.75rem;
          line-height: 2.75rem;
          font-size: 13px;
          color: #8c8c8c;

          li:first-child {
            width: 9.8125rem;
          }

          li:nth-child(2) {
            width: 6.875rem;
          }

          li:nth-child(3) {
            width: 4.375rem;

            button {
              line-height: 1.625rem;
              height: 1.625rem;
              border-radius: 1rem;
              background-color: #ff8b4a;
              color: #fff;
              border: none;
            }
          }
        }
        // 弹窗
        .bg_img {
          height: 41.6875rem;

          /* background-image: url(../../../assets/images/applySuccessBg.png); */

          /* background-repeat: no-repeat; */

          /* background-position: center; */

          /* background-size: 23.4375rem 41.6875rem; */
        }

        .adv_img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .bg_color {
          width: 23.4375rem;
          height: 41.6875rem;
          background-color: rgba(0, 0, 0, 0.5);
          position: relative;
        }

        .receive {
          position: absolute;
          top: 24%;
          left: calc(50% - 9.0625rem);
          width: 18.125rem;
          height: 18.75rem;
          margin: 0 auto;
          border-radius: 0.75rem;
          background-image: url(../../../assets/images/income_f.png);
          background-repeat: no-repeat;
          background-position: center;
          background-size: 18.125rem 18.75rem;

          .text {
            color: #feca5d;
            padding-top: 1.25rem;

            li:first-child {
              font-size: 18px;
              width: 100%;
            }

            li:nth-child(2) {
              font-size: 28px;
              width: 100%;
              margin-top: 2.5rem;
            }

            li:nth-child(3) {
              font-size: 16px;
              width: 100%;
              color: #781a16;
              line-height: 1.625rem;
            }
          }

          button {
            margin-top: 3rem;
            width: 8.75rem;
            height: 2.25rem;
            background-color: #fccb4e;
            color: #b24615;
            font-size: 16px;
            border-radius: 1.25rem;
            border: none;
          }
        }
      }
    }
  }
</style>
