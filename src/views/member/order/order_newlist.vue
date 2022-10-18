<template>
  <!-- 没有用到的页面 -->
  <div id="payment">
    <c-title :hide="false"
             text='我的订单'></c-title>
    <div style="height: 47px;"></div>
    <van-tabs v-model="selected" @click="swichTabTItem">
      <van-tab name="0" title="全部"></van-tab>
      <van-tab name="1" title="待付款"></van-tab>
      <van-tab name="2" v-if="!(orderType=='cashier')" title="待发货"></van-tab>
      <van-tab name="3" v-if="!(orderType=='cashier')" title="待收货"></van-tab>
      <van-tab name="4" title="已完成"></van-tab>
    </van-tabs>

    <div>
      <div v-show="selected==0">
        <cOrderList v-on:ConfrimOrderNotification="cofirmOrderAction"
                    v-on:ToDetailNotification="toDetail"
                    :datasource="orderList"
                    :orderType="orderType"
                    :detailUrl="detailUrl"
                    :status="0" class='osll'></cOrderList>
      </div>
      <div v-show="selected==1">
        <cOrderList v-on:ConfrimOrderNotification="cofirmOrderAction"
                    v-on:ToDetailNotification="toDetail"
                    v-on:MultiplePayNotification="multiplePayAction"
                    :datasource="waitPayList"
                    ref="mychild"
                    :orderType="orderType"
                    :detailUrl="detailUrl"
                    :status="1" class='osll'></cOrderList>
        <div style="height: 45px;"></div>
      </div>
      <div v-show="selected==2">
        <cOrderList v-on:ConfrimOrderNotification="cofirmOrderAction"
                    v-on:ToDetailNotification="toDetail"
                    :datasource="waitSendList"
                    :orderType="orderType"
                    :detailUrl="detailUrl"
                    :status="2" class='osll'></cOrderList>
      </div>
      <div v-show="selected==3">
        <cOrderList v-on:ConfrimOrderNotification="cofirmOrderAction"
                    v-on:ToDetailNotification="toDetail"
                    :datasource="waitReceiveList"
                    :orderType="orderType"
                    :detailUrl="detailUrl"
                    :status="3" class='osll'></cOrderList>
      </div>
      <div v-show="selected==4">
        <cOrderList v-on:ConfrimOrderNotification="cofirmOrderAction"
                    v-on:ToDetailNotification="toDetail"
                    :datasource="waitCompleteList"
                    :orderType="orderType"
                    :detailUrl="detailUrl"
                    :status="4" class='osll'></cOrderList>
      </div>
    </div>
    <div class="contes" v-if="isMultiplePay">
      <button @click="toMultiplePay">合并支付</button>
    </div>
  </div>
</template>
<script>
import orderListController from "./order_listController";

export default orderListController;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .osll {
    min-height: 100vh;
  }

  .contes {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 35px;
    background: #fff;
    line-height: 35px;
    border-top: #e2e2e2 solid 1px;
    text-align: right;

    button {
      border: solid 1px #f15353;
      background: #fff;
      border-radius: 14px;
      margin-right: 5px;
      color: #f15353;
    }
  }

  .loadNomore img {
    width: 20%;
  }

  #payment {
    .mint-navbar.is-fixed {
      top: 40px;
    }
  }
</style>
