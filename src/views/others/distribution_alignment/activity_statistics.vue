<template>
  <div id="distribution">
    <c-title :hide="false" :text="name+'查询'"></c-title>
    <div class="member">
      <div class="img">
        <img :src="avatar" alt=""/>
      </div>
      <div class="name">
        {{ nickname }}
      </div>
    </div>
    <div class="total">累计活动数：{{ total_activity }}</div>
    <div class="content">
      <div class="price">
        <span class="word">累计收入</span>
        <span class="money">{{$i18n.t("money")}}{{ total_income }}</span>
      </div>
      <div class="button">
        <div class="button-li" @click="gotoCommision(1)">
          <div class="img">
            <img src="../../../assets/images/fx_pre_money@2x.png" alt=""/>
          </div>
          <div class="name">预计佣金</div>
          <div class="money">{{ estimate_amount }}元</div>
        </div>
        <div class="button-li" @click="gotoCommision(2)">
          <div class="img">
            <img src="../../../assets/images/fx_willget_money@2x.png" alt=""/>
          </div>
          <div class="name">未结算佣金</div>
          <div class="money">{{ unsettlement_amount }}元</div>
        </div>

        <div class="button-li" @click="gotoCommision(3)">
          <div class="img">
            <img src="../../../assets/images/fx_haveget_money@2x.png" alt=""/>
          </div>
          <div class="name">已结算佣金</div>
          <div class="money">{{ settlement_amount }}元</div>
        </div>

        <div class="button-li" @click="gotoCommision(4)">
          <div class="img">
            <img src="../../../assets/images/fx_will_money@2x.png" alt=""/>
          </div>
          <div class="name">未提现佣金</div>
          <div class="money">{{ nowithdraw_amount }}元</div>
        </div>

        <div class="button-li" @click="gotoCommision(5)">
          <div class="img">
            <img src="../../../assets/images/fx_have_money@2x.png" alt=""/>
          </div>
          <div class="name">已提现佣金</div>
          <div class="money">{{ withdraw_amount }}元</div>
        </div>
        <div class="button-li" @click="gotoCommision(6)">
          <div class="img">
            <img src="../../../assets/images/fx_miss_money@2x.png" alt=""/>
          </div>
          <div class="name">失效佣金</div>
          <div class="money">{{ failure_amount }}元</div>
        </div>
      </div>
    </div>
    <div id="tabs">
      <van-tabs v-model="activeName">
        <van-tab name="first">
          <span slot="title" @click="handleClick('3')">全部</span>
        </van-tab>
        <van-tab name="second">
          <span slot="title" @click="handleClick('0')">活动中</span>
        </van-tab>

        <van-tab name="third">
          <span slot="title" @click="handleClick('1')">已完成</span>
        </van-tab>
        <van-tab name="fourth">
          <span slot="title" @click="handleClick('-1')">失败</span>
        </van-tab>
      </van-tabs>

      <div>
        <div>
          <div
            v-for="(item, index) in activity_list"
            :key="index"
            class="item"
            style="background: #fff; text-align: left;"
          >
            <div class="top">
              <div class="top-left">序号：{{ item.activity.id }}</div>
              <div class="top-right">{{ item.status_name }}</div>
            </div>
            <div class="good">
              <div class="good-img">
                <img :src="item.activity.cover" alt=""/>
              </div>
              <div class="title">{{ item.activity.title }}</div>
            </div>
            <div class="good-btn">
              <div class="btn" @click="gotoOrder(item.activity.id)">订单详情</div>
              <div class="btn" @click="gotoParticipant(item.activity.id)">参与人</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import activity_statistics_controller from "./activity_statistics_controller";

export default activity_statistics_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #distribution {
    .member {
      background: #fff;
      padding: 2.5rem 0.5rem 1rem 0.5rem;
      display: flex;
      line-height: 3rem;
      justify-content: center;
      width: 100%;

      .img {
        flex: 0 0 3rem;
        height: 3rem;
        margin-right: 0.5rem;
        border-radius: 2rem;

        img {
          border-radius: 2rem;
          width: 100%;
          height: 100%;
        }
      }

      .name {
        flex: 1;
        text-align: left;
        font-weight: 600;
      }
    }

    .total {
      padding: 0.5rem;
      text-align: left;
      color: #8c8c8c;
    }

    .content {
      text-align: left;
      background: #fff;
      padding: 0.75rem 0.5rem;
      margin-bottom: 0.35rem;

      .word {
        font-weight: 700;
        font-size: 1.125rem;
      }

      .money {
        color: #ff3633;
      }
    }

    .button {
      display: flex;
      display: -webkit-flex;
      justify-content: flex-start;
      flex-direction: row;
      flex-wrap: wrap;
      margin-top: 1rem;

      .button-li {
        flex: 33.3%;
        text-align: center;
        margin-bottom: 1rem;

        .img {
          height: 2.5rem;

          img {
            width: 2.5rem;
            height: 100%;
          }
        }

        .name {
          font-size: 0.9375rem;
          margin: 0.25rem 0;
        }

        .money {
          color: #ff3633;
        }
      }
    }

    .item {
      padding: 0.5rem;
      margin-bottom: 0.35rem;

      .top {
        display: flex;
        line-height: 1.5rem;
        border-bottom: 1px solid #e5e5e5;

        .top-left {
          text-align: left;
          flex: 1;
        }

        .top-right {
          color: #ff3633;
          text-align: right;
          flex: 1;
        }
      }

      .good {
        display: flex;
        padding: 0.5rem 0;

        .good-img {
          flex: 0 0 5rem;
          height: 5rem;
          margin-right: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .title {
          flex: 1;
          font-weight: 700;
          font-size: 0.8125rem;
          line-height: 1.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
        }
      }

      .good-btn {
        text-align: right;

        .btn {
          display: inline-block;
          margin-right: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #a5a5a5;
        }
      }
    }
  }
</style>
