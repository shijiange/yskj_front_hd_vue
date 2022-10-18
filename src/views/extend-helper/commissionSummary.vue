<template>
  <div>
    <c-title text="提成概括"></c-title>

    <div class="top-tab-select">
      <tab-select
        rightBoxText="合计金额"
        :orderTotal="order_total"
        :countAmount="total_amount"
        :recommendText="recommend_text"
        :noRecommendTtext="no_recommend_text"
        :showTypeTab="showTypeTab"
        @loadData="switchTab"
      ></tab-select>
    </div>

    <div class="list" v-if="rewardList.length > 0">
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
              <span>{{item.order_sn}}</span>
              <span class="money">{{item.amount}}</span>
            </div>
            <div class="bottom">
              <span class="timer">{{item.created_at}}</span>
              <span class="status">{{item.status_name}}</span>
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
export default {
  data () {
    return {
      showTypeTab: true,
      time_type: 1,
      order_type: 0,
      loading: false,
      finished: false,
      page: 1,

      rewardList: [],
      order_total: 0,
      total_amount: 0,
      recommend_text: '',
      no_recommend_text: '',
    };
  },

  computed: {},

  activated () {
    this.initData();
    this.getData();
  },

  methods: {
    switchTab (tabParams) {
      this.initData();
      this.order_type = tabParams.orderType || this.order_type;
      this.time_type = tabParams.dataFormat || this.time_type;
      this.getData();
    },

    async getData (obj) {
      if (this.finished || this.loading) {
        return;
      }
      this.loading = true;
      let res = await $http.get(
        "plugin.team-dividend.api.commission-survey.index",
        { page: this.page, recommend_ytpe: this.order_type, time_type: this.time_type},
        "正在获取列表"
      );
      if (res.result !== 1) {
        Toast(res.msg);
        return;
      }
      this.page++;
      this.loading = false;
      this.total_amount = res.data.total_amount;
      this.order_total = res.data.order_total;
      this.recommend_text = res.data.recommend_text;
      this.no_recommend_text = res.data.no_recommend_text;
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
      this.loading = false;
      this.finished =false;
      this.page = 1;
      this.order_type = 0;
      this.time_type= 1;
      this.rewardList =[];
      this.order_total = 0;
      this.total_amount= 0;
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
  .list {
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