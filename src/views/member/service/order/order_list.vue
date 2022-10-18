<template>
  <div id="payment">
    <c-title :hide="false"
             text='我的订单'></c-title>

    <van-sticky offset-top="36px">
      <van-tabs v-model="selected" @click="swichTabTItem">
        <van-tab name="0" title="全部"></van-tab>
        <van-tab name="1" title="待付款"></van-tab>
        <van-tab name="2" title="待充值"></van-tab>
        <van-tab name="3" title="已完成"></van-tab>
        <!--<mt-tab-item id="4"
              @click.native="swichTabTItem">已完成</mt-tab-item>-->
      </van-tabs>
    </van-sticky>

    <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
      <div>
        <!-- <mt-tab-container v-model="selected"> -->
        <div v-if="selected==0">
          <!-- <mt-tab-container-item id="0"> -->
          <cOrderList v-on:ConfrimOrderNotification="cofirmOrderAction"
                      v-on:ToDetailNotification="toDetail"
                      :datasource="orderList"
                      :status="0" class='osll'></cOrderList>
          <!-- </mt-tab-container-item> -->
        </div>
        <div v-if="selected==1">
          <!-- <mt-tab-container-item id="1"> -->
          <cOrderList v-on:ConfrimOrderNotification="cofirmOrderAction"
                      v-on:ToDetailNotification="toDetail"
                      v-on:MultiplePayNotification="multiplePayAction"
                      :datasource="waitPayList"
                      ref="mychild"
                      :status="1" class='osll'></cOrderList>
          <div style="height: 45px;"></div>
          <!-- </mt-tab-container-item> -->
        </div>
        <div v-if="selected==2">
          <!-- <mt-tab-container-item id="2"> -->
          <cOrderList v-on:ConfrimOrderNotification="cofirmOrderAction"
                      v-on:ToDetailNotification="toDetail"
                      :datasource="waitSendList"
                      :status="2" class='osll'></cOrderList>
          <!-- </mt-tab-container-item> -->
        </div>
        <div v-if="selected==3">
          <!-- <mt-tab-container-item id="3"> -->
          <cOrderList v-on:ConfrimOrderNotification="cofirmOrderAction"
                      v-on:ToDetailNotification="toDetail"
                      :datasource="waitReceiveList"
                      :status="3" class='osll'></cOrderList>
          <!-- </mt-tab-container-item> -->
        </div>

        <!-- </mt-tab-container> -->
      </div>
    </van-pull-refresh>
    <div class="contes" v-if="isMultiplePay">
      <button @click="toMultiplePay">合并支付</button>
    </div>
    <!--<div class="loadNomore"
           v-show='loading'><img src="assets/images/no-more-product.png" /></div>-->
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
    height: 2.1875rem;
    background: #fff;
    line-height: 2.1875rem;
    border-top: #e2e2e2 solid 0.0625rem;
    text-align: right;

    button {
      border: solid 0.0625rem #f15353;
      background: #fff;
      border-radius: 0.875rem;
      margin-right: 0.3125rem;
      color: #f15353;
    }
  }

  .loadNomore img {
    width: 20%;
  }

  #payment {
    .mint-navbar.is-fixed {
      top: 2.5rem;
    }
  }
</style>