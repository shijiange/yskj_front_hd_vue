<!-- 送礼物列表 -->
<template>
  <div id="warehouse-farm-gift">
    <c-title :hide="false" text="送礼物"></c-title>
    <van-sticky>
      <van-search v-model="keyword" show-action placeholder="搜索商品" shape="round" @search="onSearch">
        <template #action>
          <div @click="toUrl('warehouseFarmGiftLog')">查看记录</div>
        </template>
      </van-search>
    </van-sticky>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad()">
        <div class="list">
          <div class="list-item" v-for="item in list" :key="item.id">
            <img class="good-img" :src="item.thumb" alt="" />
            <div class="item-right">
              <div class="title">{{ item.title }}</div>
              <div class="good-info">
                <div class="stock">库存：{{ item.nums }}</div>
                <div class="button" @click="toUrl('warehouseFarmCreate', { id: item.stock_id })">赠送</div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: "",
      loading: false,
      finished: false,
      refreshing: false,
      total_page: 0,
      page: 1,
      list: []
    };
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    getData() {
      $http
        .get("plugin.warehouse.frontend.controllers.gift.list", { keyword: this.keyword, page: this.page })
        .then(response => {
          this.refreshing = false;
          this.loading = false;
          if (response.result === 1) {
            this.list = this.list.concat(response.data.data);
            this.total_page = response.data.last_page;
            this.page = this.page + 1;
            if (response.data.current_page == response.data.last_page) {
              this.finished = true;
            }
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initData() {
      this.loading = true;
      this.finished = false;
      this.page = 1;
      this.list = [];
    },
    onRefresh() {
      this.initData();
      this.getData();
    },
    onLoad() {
      this.getData();
    },
    onSearch() {
      this.initData();
      this.getData();
    },
    toUrl(_name, _params = {}, _query = {}) {
      if (_name) this.$router.push(this.fun.getUrl(_name, _params, _query));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#warehouse-farm-gift {
  .list {
    padding: 0.625rem;
    min-height: 10vh;
    .list-item {
      padding: 0.625rem;
      background: #fff;
      display: flex;
      border-radius: 0.375rem;
      margin-bottom: 0.625rem;
      .good-img {
        width: 4.625rem;
        height: 4.625rem;
        background-color: #9d9d9d;
        border-radius: 0.375rem;
        margin-right: 0.625rem;
      }
      .item-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        .title {
          font-size: 15px;
          color: #2c2c2c;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .good-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .stock {
            color: #8a8a8a;
            font-size: 10px;
          }
          .button {
            text-align: center;
            color: #fff;
            width: 3.75rem;
            height: 1.5rem;
            line-height: 1.5rem;
            background-color: #ff464c;
            border-radius: 0.25rem;
          }
        }
      }
    }
  }
}
</style>
