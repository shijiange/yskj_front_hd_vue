<template>
  <div>
    <c-title :hide="false" text="邀请记录"></c-title>
    <van-list class="record-list"
      v-if="listData.length > 0"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
      @load="getListData"
    >
      <div class="item-box" v-for="(item, index) in listData" :key="index">
        <div class="time">{{item.created_at}}</div>
        <div class="message">邀请了 <span class="nickname van-ellipsis">{{item.name}}</span></div>
        <div class="status">
          <span class="succeed" v-if="item.state==1">成功</span>
          <span class="fail" v-else>失败</span>
        </div>
      </div>
    </van-list>
    <van-empty v-else description="空空如也"></van-empty>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activityId: '',
      page: 1, //分页数，当前页数
      loading: false,
      finished: false,
      listData: [],
    };
  },

  activated () {
    this.activityId = this.$route.query.id;
    this.initData();
    this.getListData();
  },
  methods: {
    getListData(){
      if (this.finished) {
        return false;
      }
      $http.post('plugin.customer-increase.frontend.activity.activityInviteLog', {id:this.activityId, page: this.page}, "loading")
        .then((res) => {
          if (res.result != 1) return this.$toast(res.msg);
          let {last_page, current_page, per_page, data} = res.data;
          if (current_page >= last_page || data.length < per_page) this.finished = true;
          this.listData = this.page > 1 ? this.listData.concat(data) : data;
          this.page++;
        });
    },

    initData(){
      this.page = 1;
      this.loading = false;
      this.finished = false;
      this.listData = [];
    },
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.record-list {
  padding: 0 0.63rem;
  .item-box {
    display: flex;
    align-items: center;
    margin-top: 0.63rem;
    padding: 1.2rem 0.6rem;
    background: #fff;
    border-radius: 0.31rem;
    .time {
      width: 7.5rem;
      font-size: 0.69rem;
      color: #5c5c5c;
    }
    .message {
      flex: 1;
      margin: 0 1rem;
      font-size: 0.81rem;
      text-align: left;
      color: #494949;
      .nickname {
        display: inline-block;
        max-width: 7rem;
        vertical-align: bottom;
      }
    }
    .succeed {
      font-size: 0.81rem;
      color: #f14e4e;
    }
    .fail {
      font-size: 0.81rem;
      color: #818080;
    }
  }
}
</style>