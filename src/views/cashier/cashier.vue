<template>
  <div id="all">
    <div id="member">
      <c-title :hide="false" :text="'收银台'"></c-title>
      <div class="header">
        <div class="user">
          <div class="user-head">
            <img :src="store.thumb" />
          </div>
          <div data-v-21e0c5a4="" class="cashier-name" style="">
            {{ store.name }}
          </div>
          <div class="user-info">
            <router-link :to="fun.getUrl('withdrawal')">
              <div class="user-name">
                <div class="b-tixian">{{ this.fun.initWithdrawal() }}</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div id="userinfo">
        <ul>
          <li>
            <span>{{ $i18n.t('money') }}{{ income.money_total }}</span>
            <br />累计实收金额
          </li>

          <li>
            <span>{{ $i18n.t('money') }}{{ income.sure_withdraw_money }}</span>
            <br />可{{ this.fun.initWithdrawal() }}金额
          </li>
        </ul>
      </div>

      <div class="cart">
        <div class="list1" style="border: none;" @click="toPage('cashier_qr')">
          <van-icon
            class="iconfont icon-member-receipt-code1"
            size="1.625rem"
            color="#f15353"
            style="margin-right: 0.375rem;"
          ></van-icon>
          <span>收款二维码</span>
          <i class="fa fa-angle-right"></i>
        </div>

        <div class="list1" v-if="store_set.my_order" @click="toPage('cashierOrderlist')">
          <van-icon
            class="iconfont icon-member-order4"
            size="1.625rem"
            color="#f15353"
            style="margin-right: 0.375rem;"
          ></van-icon>
          <span>我的订单</span>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="list1" @click="toPage('presentationRecord', { from: 'store_cashier' })">
          <van-icon
            class="iconfont icon-member-withdrawals1"
            custom
            size="1.625rem"
            color="#f15353"
            style="margin-right: 0.375rem;"
          ></van-icon>
          <span>我的提成</span>
          <i class="fa fa-angle-right"></i>
        </div>

        <div class="list1" @click="toPage('cashier_stat')">
          <van-icon
            class="iconfont icon-member-manage1"
            custom
            size="1.625rem"
            color="#f15353"
            style="margin-right: 0.375rem;"
          ></van-icon>
          <span>统计结算</span>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="list1" @click="toPage('cashierIncome')">
          <van-icon
            class="iconfont icon-incomedetail"
            custom
            size="1.625rem"
            color="#f15353"
            style="margin-right: 0.375rem;"
          ></van-icon>
          <span>收入明细</span>
          <i class="fa fa-angle-right"></i>
        </div>

        <div class="list1" v-if="store_set.order_survey" @click="toPage('cashierOrder')">
          <van-icon
            class="iconfont icon-incomedetail"
            custom
            size="1.625rem"
            color="#f15353"
            style="margin-right: 0.375rem;"
          ></van-icon>
          <span>订单概况</span>
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <div style="height: 2.5rem; clear: both;"></div>
      <van-button type="primary" style="width: 90%; margin: 0 auto;" size="large" color="#f15353" @click="outInfo($event)" v-if="myType == 7">退出登录</van-button>

      <div style="height: 3.75rem; clear: both;"></div>
    </div>
    <div id="ewm" ref="hook" @click="openQrCode('none')">
      <div class="pic">
        <img :src="poster" alt="" />
      </div>
    </div>
    <div id="jpg"></div>
  </div>
</template>

<script>
import cashier from './cashier_controller';

export default cashier;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/css/cashier.scss';

.clearfix {
  clear: both;
}
</style>
