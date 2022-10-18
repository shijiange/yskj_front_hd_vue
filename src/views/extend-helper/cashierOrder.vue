<template>
  <div>
    <c-title text="订单概括"></c-title>

    <div class="top-tab-select">
      <tab-select
        :orderTotal="order_total"
        :orderAmount="order_amount"
        :countAmount="total_amount"
        :showTypeTab="showTypeTab"
        :showOrderAmount="showOrderAmount"
        @loadData="switchTab"
      ></tab-select>
    </div>

    <van-tabs v-model="selected" @change="selectType" style="margin-top: 1rem;">
       <van-tab title="全部" name="0"></van-tab>
       <van-tab title="已完成" name="1"></van-tab>
    </van-tabs>
    <div class="order-list" v-if="orderList.length > 0">
      <van-pull-refresh v-model="pullLoading" @refresh="loadTop" success-text="刷新成功">
        <d-list
          :loading="loading"
          :finished="finished"
          @load="onLoad"
        >
          <c-orderList
            v-on:ConfrimOrderNotification="cofirmOrderAction"
            v-on:ToDetailNotification="toDetail"
            v-on:MultiplePayNotification="multiplePayAction"
            ref="mychild"
            :datasource="orderList"
            :orderType="orderType"
            :detailUrl="detailUrl"
            class="osll"
          >
          </c-orderList>
        </d-list>
      </van-pull-refresh>
    </div>

    <div class="empty" v-else>
      <img src="../../assets/images/blank.png" />
      <div class="text">还没有记录哦</div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import DList from "@/components/dlist";
import tabSelect from "./myComponents/tabSelect";
import cOrderList from "components/orderList";
import { Toast } from 'vant';
export default {
  data () {
    return {
      time_type: 1, // 订单日期
      order_type: 0, // 订单直推非直推
      selected: '0',  // 订单支付状态

      showTypeTab: true,
      showOrderAmount: true,

      loading: false,
      finished: false,
      page: 1,
      pullLoading: false,

      orderType: "store", // 订单类型
      detailUrl: "storeOrderdetail",

      orderList: [],
      order_total: 0, // 订单数量
      order_amount: 0, // 订单总金额
      total_amount: 0, // 提成总金额

      isChangeStatus: false, // 订单状态选择栏
    };
  },

  activated () {
    this.initData();
    this.getData();
  },

  methods: {
    // 头部tab选择
    switchTab (tabParams) {
      this.getInitData();
      this.isChangeStatus = false;
      this.order_type = tabParams.orderType || this.order_type;
      this.time_type = tabParams.dataFormat || this.time_type;
      this.getData();
    },
    // 订单状态选择
    selectType () {
      this.isChangeStatus = true;
      this.getInitData();
      this.getData();
    },
    // 下拉刷新更新
    async loadTop() {
      this.getInitData();
      await this.getData();
      this.pullLoading = false;
    },
    // 订单列表
    async getData() {
      if (this.finished || this.loading) {
        return;
      }
      this.loading = true;
      let res = await $http.get(
        "plugin.store-cashier.frontend.Order.list.survey",
        { page: this.page,
          is_recommend: this.order_type,
          time_type: this.time_type,
          status: this.selected * 1
        },
        "正在获取订单"
      );
      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }
      this.page++;
      this.loading = false;
      if (!this.isChangeStatus) {
        this.total_amount = res.data.sum;
        this.order_amount = res.data.price;
        this.order_total = res.data.count;
        this.isChangeStatus = false;
      }
      if (res.data.last_page === res.data.current_page || res.data.data.length < res.data.per_page) {
        this.finished = true;
      }
      if (res.data.current_page > 1) {
        this.orderList = this.orderList.concat(res.data.list.data);
        return;
      }

      this.orderList = res.data.list.data;
      return true;
    },


    // 确认收货订单
    cofirmOrderAction(order) {
      this.getInitData();
      this.getData();
    },



    // 去商品详情
    toDetail(order) {
      this.$router.push(
        this.fun.getUrl("storeOrderdetail", {
          order_id: order.id,
          isDetail: true,
          orderType: "store"
        })
      );
    },

    initData () {
      this.time_type = 1;
      this.order_type = 0;
      this.selected = '0';
      this.showTypeTab = true;
      this.showOrderAmount = true;
      this.loading = false;
      this.finished = false;
      this.page = 1;
      this.pullLoading = false;
      this.orderList = [];
      this.order_total = 0;
      this.order_amount = 0;
      this.total_amount = 0;
      this.isChangeStatus = false;
    },
    getInitData () {
      this.loading = false;
      this.finished = false;
      this.page = 1;
      this.orderList = [];
    },
  },

  components: {
    cTitle,
    DList,
    tabSelect,
    cOrderList
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .empty {
    padding: 2rem 0 4rem 0;

    img {
      width: 6rem;
      height: 6rem;
    }

    .text {
      margin-top: 15px;
      color: #ccc;
      font-size: 14px;
    }
  }
</style>