<!-- 平级奖 -->
<template>
  <div id="manage_award">
    <c-title
      :hide="false"
      text="平级奖"
    ></c-title>
    <div class="content">
      <div class="background">
        <div style="text-align: left;">
          <div class="money">
            {{$i18n.t("money")}}{{total_amount}}
          </div>
          <div class="text">
            奖励总额（元）
          </div>
        </div>
      </div>
      <div class="list">
        <van-tabs v-model="activeName">
          <van-tab name="first">
            <span slot="title" @click="handleClick('0')">奖励记录</span>
          </van-tab>
        </van-tabs>
        <div>
          <!-- <mt-tab-container v-model="activeName"> -->
          <div v-show="activeName=='first'">
            <!-- <mt-tab-container-item id="first"> -->
            <ul class="rationList">
              <li v-for="(item, index) in first_content" :key="index">
                <div class="detail">
                  <div class="logId">经销商奖励ID:{{item.logId}}</div>
                  <div class="info">
                    <ul class="left">
                      <li>奖励比例：{{item.proportion}}</li>
                      <li class="time">记录时间：{{item.created_at}}</li>
                    </ul>
                    <ul class="right">
                      <li>{{item.amount_money}}</li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
            <!-- </mt-tab-container-item> -->
          </div>
          <!-- </mt-tab-container> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import peers_award_controller from "./peers_award_controller";

export default peers_award_controller;
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  #manage_award {
    .content {
      .background {
        width: 100%;
        height: 5rem;
        background: #f15353;
        color: #fff;
        text-align: left;
        padding-top: 1rem;
        padding-left: 5%;

        .money {
          font-size: 1.5rem;
        }

        .text {
          font-size: 1rem;
        }
      }

      .list {
        margin: 1rem 5%;
        padding: 0.5rem 0;
        border-radius: 1rem;
        background: #fff;

        .rationList {
          text-align: left;
          padding: 0.2rem 0.5rem;
          box-shadow: 0 0 10px #888;

          .detail {
            margin-bottom: 0.5rem;
            border-bottom: 2px solid #f5f5f5;
          }

          .logId {
            line-height: 2rem;
            font-weight: 800;
            border-bottom: 1px solid #fafafa;
          }

          .info {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.5rem 0;

            .left {
              flex: 4;

              .time {
                color: #ccc;
                font-size: 0.75rem;
              }
            }

            .right {
              flex: 1;
              text-align: right;

              li {
                color: #f15353;
                font-size: 1.2rem;
                font-weight: 600;
              }
            }
          }
        }
      }
    }
  }
</style>
