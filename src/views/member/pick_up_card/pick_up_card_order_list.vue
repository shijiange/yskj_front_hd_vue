<template>
  <div id="order-list">
    <c-title :hide="false" :text="plugin_name"></c-title>
    <van-sticky offset-top="2.62rem">
      <van-tabs v-model="selected" @click="swichTabTItem()">
        <!-- 绑定一个子组件调用的事件 -->
        <van-tab v-for="(item, index) in NavList" :key="index" :name="index.toString()" :title="item"></van-tab>
      </van-tabs>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="loadTop">
      <div>
        <!-- <mt-tab-container v-model="selected"> -->
        <div v-show="selected == indexs.toString()" v-for="(items, key, indexs) in dataList" :key="indexs">
          <!-- <mt-tab-container-item v-for="(items, key, indexs) in dataList" :key="indexs" :id="indexs.toString()"> -->
          <cOrderList
            v-on:ConfrimOrderNotification="cofirmOrderAction"
            v-on:ToDetailNotification="toDetail"
            ref="mychild"
            :datasource="items"
            :detailUrl="detailUrl"
            :orderType="orderType"
            :status="indexs.toString()"
            :notShowCheck="true"
            class="osll"
          ></cOrderList>
          <!-- </mt-tab-container-item> -->
        </div>
        <!-- </mt-tab-container> -->
      </div>
    </van-pull-refresh>

    <div class="fixed-box" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" @click="toPickCard">
      <img src="../../../assets/images/pick_up_card_cursor.png" alt="" />
    </div>
    <div class="fixed-box fixed-box_my" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" v-if="orderType == 'pickup_card' && menu_group && menu_group.enable" @click="toPickCardMy">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pick_up_card_my.png" alt="" />
    </div>
  </div>
</template>

<script>
import pickUpCardOrderListController from "./pick_up_card_order_list_controller";

export default pickUpCardOrderListController;
</script>

<style lang="scss" scoped>
.osll {
  min-height: 100vh;
}

.contes {
  z-index: 98;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 2.8125rem;
  background: #fff;
  line-height: 2.8125rem;
  border-top: #e2e2e2 solid 0.0625rem;
  text-align: right;

  button {
    height: 2.5rem;
    line-height: 2.5rem;
    border: solid 0.0625rem #f15353;
    background: #f15353;
    border-radius: 0.1875rem;
    margin: 0.15rem 0.875rem auto 0;
    color: #fff;
    padding: 0 0.625rem;
  }
}

.pcStyle .contes {
  width: 375px !important;
}

.loadNomore img {
  width: 20%;
}

#order-list {
  .mint-navbar.is-fixed {
    top: 40px;
  }
}

.fixed-box {
  position: fixed;
  bottom: 8.2rem;
  right: 0.5rem;
  width: 3rem;
  height: 3rem;
  z-index: 999;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  &.fixed-box_my {
    bottom: 3.5rem;
  }

  img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }

  &.pcStyle {
    right: 38%;
  }
}
</style>
