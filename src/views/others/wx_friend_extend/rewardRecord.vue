<template>
  <div>
    <c-title :hide="false" text="奖励记录"></c-title>
    <van-sticky :offset-top="40">
      <van-tabs v-model="active" sticky @change="changeTab" >
        <van-tab title="全部" name=""></van-tab>
        <van-tab title="未发放" name="1"></van-tab>
        <van-tab title="已发放" name="2"></van-tab>
        <van-tab title="已失效" name="3"></van-tab>
      </van-tabs>
    </van-sticky>

    <van-list class="reward-list"
      v-if="listData.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="getListData"
    >
      <div class="reward-item" v-for="(item, index) in listData" :key="index">
        <div class="top">
          <div class="time">{{item.created_at}}</div>
          <div class="status">
            <span :class="state_arr[item.state]">{{item.state_desc}}</span>
          </div>
        </div>
        <div class="integral">{{item.reward_desc}}</div>
      </div>
    </van-list>
    <van-empty v-else description="空空如也"></van-empty>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: '',
      page: 1, //分页数，当前页数
      loading: false,
      finished: false,
      listData: [],
      state_arr: ['wait','wait','success','fail'],
    };
  },

  activated () {
    this.initData();
    this.getListData();
  },

  methods: {
    getListData(){
      if (this.finished && this.loading) {
        return false;
      }
      let json = {
        page: this.page,
        state: this.active
      };
      $http.post('plugin.customer-increase.frontend.activity.activityRewardList', json, "loading")
        .then((res) => {
          this.loading = false;
          if (res.result != 1) return this.$toast(res.msg);
          let {last_page, current_page, per_page, data} = res.data;
          if (current_page >= last_page && data.length < per_page) this.finished = true;
          this.listData = this.page > 1 ? this.listData.concat(data) : data;
          this.page++;
        });
    },

    changeTab () {
      this.page = 1;
      this.listData = [];
      this.finished = false,
      this.getListData();
    },

    initData () {
      this.page = 1;
      this.active = '';
      this.listData = [];
      this.loading = false;
      this.finished = false;
    },
  },


  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.reward-list {
  padding: 0 0.63rem;
  .reward-item {
    margin-top: 0.63rem;
    padding: 1rem 0.8rem;
    border-radius: 0.31rem;
    background-color: #ffffff;
    .top {
      display: flex;
      justify-content: space-between;
      .time {
        color: #929292;
      }
      .success {
        color: #f14e4e;
      }
      .wait,.fail {
        color: #818080;
      }
    }
    .integral {
      margin-top: 1rem;
      text-align: left;
    }
  }
}
</style>