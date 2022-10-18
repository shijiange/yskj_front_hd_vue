<template>
  <div>
    <c-title text="门店奖励"></c-title>

    <div class="top-tab-select">
      <tab-select
        rightBoxText="合计金额"
        :orderTotal="total"
        :countAmount="sum"
        @loadData="switchTab"
      ></tab-select>
    </div>

    <div class="rewards-list" v-if="rewardList.length > 0">
      <d-list
        :loading="loading"
        :finished="finished"
        @load="getData"
      >
        <van-cell
          v-for="item in rewardList"
          :key="item"
        >
          <template>
            <div class="top">
              <span>{{item.has_one_order.order_sn}}</span>
              <span class="money">{{item.reward_amount}}</span>
            </div>
            <div class="bottom">
              <span class="timer">{{item.created_at}}</span>
              <span class="status">{{item.status ? '已结算' : '未结算'}}</span>
            </div>
          </template>
        </van-cell>
      </d-list>
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
import { Toast } from 'vant';
export default {
  data () {
    return {
      loading: false,
      finished: false,
      page: 1,
      time_type: 1,

      rewardList: [],
      total: 0,
      sum: 0
    };
  },

  computed: {},
  activated() {
    this.initData();
    this.getData();
  },

  methods: {
    switchTab (tabParams) {
      this.initData();
      this.time_type = tabParams.dataFormat || this.time_type;
      this.getData();
    },
    async getData () {
      if (this.finished || this.loading) {
        return;
      }
      this.loading = true;
      let res = await $http.post("plugin.store-rewards.frontend.controller.index.index", { page: this.page, time_type: this.time_type}, "正在获取列表");
      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }
      this.page++;
      this.loading = false;
      this.sum = res.data.sum;
      this.total = res.data.total;
      let data = res.data.list;
      if (data.last_page === data.current_page || data.data.length < data.per_page) {
        this.finished = true;
      }
      if (data.current_page > 1) {
        this.rewardList = this.rewardList.concat(data.data);
        return;
      }
      this.rewardList = data.data;
    },

    initData () {
      this.loading = false,
      this.finished =false,
      this.page = 1,
      this.time_type= 1,
      this.rewardList =[],
      this.total = 0,
      this.sum= 0;
    }
  },

  components: {
    cTitle,
    DList,
    tabSelect
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
  .rewards-list {
    margin-top: 10px;

    .top,
    .bottom {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #202020;

      .money {
        color: #f15353;
      }

      .timer {
        font-size: 12px;
        color: #8c8c8c;
      }
    }
  }

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
