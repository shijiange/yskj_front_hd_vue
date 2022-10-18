<template>
  <div id="shopKeeperCenter">
    <c-title :hide="false" text=" 店主中心"></c-title>

    <div id="tabs">
      <van-tabs v-model="activeName">
        <van-tab name="first">
			<span slot="title" @click="handleClick('0')">全部</span>
        </van-tab>
        <van-tab name="second">
			<span slot="title" @click="handleClick('1')">已付款</span>
        </van-tab>
        <van-tab name="third">
			<span slot="title" @click="handleClick('2')">已完成</span>
        </van-tab>
        <van-tab name="fourth">
			<span slot="title" @click="handleClick('3')">已失效</span>
        </van-tab>
      </van-tabs>

      <div>
      <!-- <mt-tab-container v-model="activeName"> -->
        <div v-show="activeName=='first'">
        <!-- <mt-tab-container-item id="first"> -->
          <div class="conte">
            <div v-for="(elem,i) in first_content" class="list" :key='i'>
              <div class="title1">
                订单号：{{ elem.order_sn }}
                <span v-if="elem.status_name == '已完成'" class="status1">
                  {{ elem.status_name }}
                </span>
                <span v-else class="status2">{{ elem.status_name }}</span>
              </div>

              <div class="middle">
                <div class="img">
                  <img :src="elem.goods_thumb" alt="" />
                </div>
                <div class="orderNum">
                  {{ elem.goods_title }}
                  <br />
                  X{{ elem.goods_total }} <br />
                  付款金额：{{$i18n.t('money')}}{{ elem.goods_price }}
                </div>
              </div>

              <div class="date">
                共计{{ elem.goods_total }}件商品，预计分红&nbsp;
                <b>{{$i18n.t('money')}} {{ elem.bonus_money }}</b>
                <br />
                <span>个别店主预计分红可能存在误差，以最终结算分红为准</span>
                <br clear="all" />
                <div class="left">{{ elem.order_time }}</div>
                <!--<div class="right">完成：{{elem.complete_time}}</div>-->
              </div>
            </div>
          </div>
        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="activeName=='second'">
        <!-- <mt-tab-container-item id="second"> -->
          <div class="conte">
            <div v-for="(elem,i) in second_content" class="list" :key='i'>
              <div class="title1">
                订单号：{{ elem.order_sn }}
                <span v-if="elem.status_name == '已完成'" class="status1">
                  {{ elem.status_name }}
                </span>
                <span v-else class="status2">{{ elem.status_name }}</span>
              </div>

              <div class="middle">
                <div class="img">
                  <img :src="elem.goods_thumb" alt="" />
                </div>
                <div class="orderNum">
                  {{ elem.goods_title }}
                  <br />
                  X{{ elem.goods_total }} <br />
                  付款金额：{{$i18n.t('money')}}{{ elem.goods_price }}
                </div>
              </div>

              <div class="date">
                共计{{ elem.goods_total }}件商品，预计分红&nbsp;
                <b>{{$i18n.t('money')}} {{ elem.bonus_money }}</b>
                <br />
                <span>个别店主预计分红可能存在误差，以最终结算分红为准</span>
                <br clear="all" />
                <div class="left">{{ elem.order_time }}</div>
                <!--<div class="right">完成：{{elem.complete_time}}</div>-->
              </div>
            </div>
          </div>
        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="activeName=='third'">
        <!-- <mt-tab-container-item id="third"> -->
          <div class="conte">
            <div v-for="(elem,i) in third_content" class="list" :key='i'>
              <div class="title1">
                订单号：{{ elem.order_sn }}
                <span v-if="elem.status_name == '已完成'" class="status1">
                  {{ elem.status_name }}
                </span>
                <span v-else class="status2">{{ elem.status_name }}</span>
              </div>

              <div class="middle">
                <div class="img">
                  <img :src="elem.goods_thumb" alt="" />
                </div>
                <div class="orderNum">
                  {{ elem.goods_title }}
                  <br />
                  X{{ elem.goods_total }} <br />
                  付款金额：{{$i18n.t('money')}}{{ elem.goods_price }}
                </div>
              </div>

              <div class="date">
                共计{{ elem.goods_total }}件商品，预计分红&nbsp;
                <b>{{$i18n.t('money')}} {{ elem.bonus_money }}</b>
                <br />
                <span>个别店主预计分红可能存在误差，以最终结算分红为准</span>
                <br clear="all" />
                <div class="left">{{ elem.order_time }}</div>
                <!--<div class="right">完成：{{elem.complete_time}}</div>-->
              </div>
            </div>
          </div>
        <!-- </mt-tab-container-item> -->
        </div>
        <div v-show="activeName=='fourth'">
        <!-- <mt-tab-container-item id="fourth"> -->
          <div class="conte">
            <div v-for="(elem,i) in fourth_content" class="list" :key='i'>
              <div class="title1">
                订单号：{{ elem.order_sn }}
                <span v-if="elem.status_name == '已完成'" class="status1">
                  {{ elem.status_name }}
                </span>
                <span v-else class="status2">{{ elem.status_name }}</span>
              </div>

              <div class="middle">
                <div class="img">
                  <img :src="elem.goods_thumb" alt="" />
                </div>
                <div class="orderNum">
                  {{ elem.goods_title }}
                  <br />
                  X{{ elem.goods_total }} <br />
                  付款金额：{{$i18n.t('money')}}{{ elem.goods_price }}
                </div>
              </div>

              <div class="date">
                共计{{ elem.goods_total }}件商品，预计分红&nbsp;
                <b>{{$i18n.t('money')}} {{ elem.bonus_money }}</b>
                <br />
                <span>个别店主预计分红可能存在误差，以最终结算分红为准</span>
                <br clear="all" />
                <div class="left">{{ elem.order_time }}</div>
                <!--<div class="right">完成：{{elem.complete_time}}</div>-->
              </div>
            </div>
          </div>
        <!-- </mt-tab-container-item> -->
        </div>
      <!-- </mt-tab-container> -->
      </div>
    </div>
  </div>
</template>

<script>
import orderDetail_controller from "./orderDetail_controller";
export default orderDetail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#shopKeeperCenter {
  #tabs {
    margin-top: 2.5rem;

    .conte {
      width: 100%;

      .list {
        margin-bottom: 0.625rem;
        padding-bottom: 0.3125rem;
        background: #fff;

        .title1 {
          background: #fff;
          padding: 0.9375rem;
          font-size: 14px;
          text-align: left;
          margin-bottom: 0.0625rem;

          .status1 {
            display: inline-block;
            width: 3.75rem;
            color: #fff;
            text-align: center;
            float: right;
            line-height: 1.5rem;
            background: green;
          }

          .status2 {
            display: inline-block;
            width: 3.75rem;
            color: #fff;
            text-align: center;
            float: right;
            line-height: 1.5rem;
            background: #f15353;
          }
        }

        .middle {
          padding: 0.9375rem;
          background: #f0f0f0;
          text-align: left;
          float: left;
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 0.375rem;

          .img {
            width: 4.0625rem;
            height: 4.0625rem;
            float: left;
            background: grey;

            img {
              width: 4.0625rem;
              vertical-align: middle;
            }
          }

          .orderNum {
            height: 4.0625rem;
            margin-left: 0.9375rem;
            float: left;
            line-height: 1.375rem;
          }
        }

        .date {
          padding: 1.25rem 0.9375rem;
          background: #fff;
          text-align: left;
          color: #555;
          line-height: 1.625rem;

          b {
            color: red;
            font-size: 17px;
          }

          span {
            color: #ff9800;
            font-size: 12px;
          }

          .left {
            width: 50%;
            float: left;
            text-align: left;
            color: #d2d2d2;
            font-size: 12px;
          }

          .right {
            width: 50%;
            float: right;
            text-align: right;
            color: #d2d2d2;
            font-size: 12px;
          }
        }
      }

      .list::after {
        content: "";
        display: block;
        clear: both;
      }
    }
  }
}
</style>
-->
