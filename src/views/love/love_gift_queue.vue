<template>
  <div >
    <c-title :hide="false" text="挂账详情"></c-title>
    <van-sticky :offset-top="40">
      <van-tabs v-model="active" @click="switchItem">
        <van-tab name="0" title="全部"></van-tab>
        <van-tab name="1" title="获得"></van-tab>
        <van-tab name="3" title="失败"></van-tab>
      </van-tabs>
    </van-sticky>
    <div class="love_gift_queue">
      <van-pull-refresh v-model="pullLoading" @refresh="loadTop" success-text="刷新成功">
        <van-list v-if="love_gift_queue_list.length > 0" :loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
          <div v-for="(item,index) in love_gift_queue_list" :key="index" :class="index === 0 ? 'love-item first-love-item' : 'love-item'">
            <div class="love-item-top">
              <span class="love-status">{{item.type_name}}</span>
              <span :class="item.type == 1 ? 'un-love-value' : item.type == 2 || item.type == 3 ? 'get-love-value' : ''">{{item.type == 1 ? '+' : item.type == 2 || item.type == 3 ? '-' : ''}}{{item.amount}}</span>
            </div>
            <div class="love-item-bottom">
              <span class="love-status">{{item.created_at}}</span>
              <span>剩余额度: {{item.present}}</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active:"0",
      love_gift_queue_list:[],
      loading: false,
      finished: false,
      pullLoading: false,
      page: 1,
    };
  },
  activated() {
    this.initData();
    this.onLoad();
  },

  methods: {
    switchItem(){
      this.initData();
      this.getLoveGiftQueue();
    },
    onLoad(){
      this.getLoveGiftQueue();
    },
    loadTop(){
      this.initData();
      this.getLoveGiftQueue();
    },
    initData(){
      this.love_gift_queue_list = [];
      this.page = 1;
      this.loading = false;
      this.finished = false;
      this.pullLoading = false;
    },
    async getLoveGiftQueue(){
      if (this.loading === true || this.finished === true) {
        return;
      }
      this.loading = true;
      let { data, result, msg } = await $http.post("plugin.love-queue.frontend.modules.credit.controllers.records.index",{status:this.active,page: this.page});
      if (result !== 1) {
        this.$toast(msg);
        return;
      }
      if (data.page_list.data.length === 0 || data.page_list.data.length < data.page_list.per_page || data.page_list.current_page === data.page_list.last_page) {
        this.finished = true;
      }
      this.page++;
      this.love_gift_queue_list.push(...data.page_list.data);
      // console.log(this.love_gift_queue_list,1);
      this.loading = false;
    },
  },
};

</script>
<style lang='scss' rel='stylesheet/scss'>
.love_gift_queue {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-top: 0.03rem solid #ebebeb;

  .first-love-item {
    border-top: none !important;
  }

  .love-item {
    height: 3.41rem;
    border-top: 0.03rem solid #ebebeb;
    margin: 0 0.91rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;

    .love-item-top {
      display: flex;
      justify-content: space-between;

      .love-status {
        font-weight: normal;
        color: #202020;
      }

      .get-love-value {
        font-weight: normal;
        color: #378e2b;
        font-size: 15px;
      }

      .un-love-value {
        font-weight: normal;
        color: #f15353;
        font-size: 15px;
      }
    }

    .love-item-bottom {
      display: flex;
      justify-content: space-between;
      font-weight: normal;
      color: #666666;
    }
  }
}
</style>