<template>
  <div id="love_list">
    <c-title :hide="false" :text='love_name+"交易中心"'></c-title>
    <van-tabs v-model="selected" @click="switchItem">
      <van-tab name="0" title="全部交易"></van-tab>
      <van-tab name="1" title="交易中"></van-tab>
      <van-tab name="2" title="已完成"></van-tab>
      <van-tab name="3" title="我的交易"></van-tab>
    </van-tabs>
    <div>

      <div class="coupon_card">
        <div v-show="selected==0">
          <!--全部-->
          <div class="tbs"
               v-for='(item,index) in wait_used'
               :key='index'>
            <div class="left titles">{{love_name}}：{{item.amount}}</div>
            <div class="right reds">{{item.type_name}}-{{item.status_name}}</div>
            <div class="left">{{item.created_at}}</div>
            <div class="right" v-if="item.status==0 && item.own" @click="revoke(item.id)">点击撤回</div>
            <div class="right" v-if="item.status==0 && !item.own" @click="purchase(item.id)">点击购买</div>
          </div>
        </div>
        <div v-show="selected==1">
          <!--进行中-->
          <div class="tbs"
               v-for='(item,index) in underway' :key='index'>
            <div class="left titles">{{love_name}}：{{item.amount}}</div>
            <div class="right reds">{{item.type_name}}-{{item.status_name}}</div>
            <div class="left">{{item.created_at}}</div>
            <div class="right" v-if="item.status==0 && item.own" @click="revoke(item.id)">点击撤回</div>
            <div class="right" v-if="item.status==0 && !item.own" @click="purchase(item.id)">点击购买</div>
          </div>
        </div>
        <div v-show="selected==2">
          <!--已完成-->
          <div class="tbs"
               v-for='(item,index) in done' :key='index'>
            <div class="left titles">{{love_name}}：{{item.amount}}</div>
            <div class="right reds">{{item.type_name}}-{{item.status_name}}</div>
            <div class="left">{{item.created_at}}</div>
          </div>

        </div>
        <div v-show="selected==3">
          <!--自己的-->
          <div class="tbs"
               v-for='(item,index) in own' :key='index'>
            <div class="left titles">{{love_name}}：{{item.amount}}</div>
            <div class="right reds">{{item.type_name}}-{{item.status_name}}</div>
            <div class="left">{{item.created_at}}</div>
            <div class="right" v-if="item.status==0 && item.own" @click="revoke(item.id)">点击撤回</div>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>
<script>
import love_trading_controller from "./love_trading_controller";

export default love_trading_controller;

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import '../../assets/css/love_list.scss'
</style>
