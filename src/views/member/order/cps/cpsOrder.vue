<template>
  <div :class="[this.fun.getPhoneEnv() == 3?'pcStyle':'', 'cps-oreder']">
     <c-title class="circle_title" :hide="false" :text="isCoupon ? '卡券订单' : '聚合CPS订单'"></c-title>
      <van-tabs
        v-if="!isCoupon"
        v-model="activeName"
        @click="switchTab"
        title-inactive-color="#777777"
        title-active-color="#414141"
      >
        <van-tab title="全部" :name="0"></van-tab>
        <van-tab title="待结算" :name="1"></van-tab>
        <van-tab title="已结算" :name="2"></van-tab>
        <van-tab title="失效" :name="-1"></van-tab>
      </van-tabs>

      <div class="list-content" v-if="orderList.length > 0">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <d-list
            @load="loadData"
            :loading="loading"
            :finished="finished"
          >
            <cps-order-item
              v-for="(item, index) in orderList" :key="index"
              :orderData="item"
              :isCoupon="isCoupon"
            ></cps-order-item>
          </d-list>
        </van-pull-refresh>
      </div>

      <van-empty v-else description="还没有记录哦" ></van-empty>
  </div>
</template>

<script>
import CpsOrderItem from "./cpsComponents/cpsOrderItem.vue";
import DList from "@/components/dlist";
export default {
  data () {
    return {
      activeName: 0,
      isCoupon: false,
      api: '',

      page: 1,
      finished: false,
      loading: false,
      refreshing: false,

      orderList: [],
    };
  },

  computed: {},

  activated () {
    this.initData();
    if (this.$route.name === "cpsOrderList") {
      this.isCoupon = false;
      this.api = "plugin.aggregation-cps.api.order.index";
      if(this.$route.query.status) {
        this.activeName = this.$route.query.status;
      }
    } else {
      this.isCoupon = true;
      this.api = "plugin.aggregation-cps.api.equity.order-list";
    }
    this.getData();
  },
  methods: {
    switchTab () {
      this.initGetData();
      this.getData();
    },

    loadData () {
      this.getData();
    },

    async onRefresh () {
      this.initGetData();
      await this.getData();
      this.refreshing = false;
    },

    async getData () {
      if (this.finished || this.loading) return;
      this.loading = true;
      let res = await $http.get(
        this.api,
        {status: this.activeName, page: this.page},
        "load"
      );
      this.loading = false;
      if (res.result !== 1) {
        this.$dialog.alert({message: res.msg});
        return false;
      }
      if (this.page >= res.data.last_page || res.data.data.length < res.data.per_page) {
        this.finished = true;
      }
      if (this.page > 1) {
        this.orderList = this.orderList.concat(res.data.data);
      } else {
        this.orderList = res.data.data;
      }
      this.page++;
      return true;
    },

    initGetData () {
      this.page = 1;
      this.finished = false;
      this.loading = false;
    },
    initData () {
      this.activeName = 0;
      this.isCoupon = false;
      this.api = '';
      this.page = 1;
      this.finished = false;
      this.loading = false;
      this.orderList = [];
    }
  },

  components: {
    DList,
    CpsOrderItem,
  },
};

</script>
<style lang='scss' rel='stylesheet/scss'>
.cps-oreder {
  .van-tabs .van-tabs__line {
    width: 20px;
    height: 5px;
    left: 4px;
    bottom: 22px;
    background: url("../../../../assets/images/cps_tab_icon.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-color: transparent;
    border-radius: 0;
  }
}

</style>