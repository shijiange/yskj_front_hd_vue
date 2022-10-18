<!-- 圈仓 买礼盒 礼盒列表页 -->
<template>
  <div id="gift-list">
    <c-title :hide="false" text="买礼盒"> </c-title>
    <van-sticky>
      <van-search v-model="keyword" show-action placeholder="搜索商品" shape="round" @search="onSearch">
        <template #action>
          <div @click.stop="toUrl('orderlist', { status: 0, orderType: 'warehousePurchasing' })">购买记录</div>
        </template>
      </van-search>
    </van-sticky>

    <van-tabs v-if="!cateLoading" v-model="active" sticky offset-top="54" animated swipeable @click="onClickCate">
      <van-tab v-for="item in cate" :title="item.name" :key="item.id" :name="item.id">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad()">
            <div class="main">
              <div class="list" v-for="item in list" :key="item.id" @click.stop="toUrl('warehouseFarmGood', { id: item.id })">
                <div class="good-img">
                  <img :src="item.thumb" alt="" />
                </div>
                <div class="title">{{ item.title }}</div>
                <div class="price">￥{{ item.price }}</div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cate: [
        {
          id: 0,
          name: "全部"
        }
      ],
      cateLoading: true, //分类是否正在加载
      keyword: "",
      active: 0,
      loading: false,
      finished: false,
      refreshing: false,
      page: 1,
      total_page: 0,
      list: []
    };
  },

  activated() {},

  components: {},

  computed: {},
  created() {
    if (this.$route.params.id) {
      this.active = Number(this.$route.params.id);
    }
    this.getInit();
  },
  mounted() {},

  methods: {
    initData() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.list = [];
      this.page = 1;
    },
    getInit() {
      this.cate = [
        {
          id: 0,
          name: "全部"
        }
      ];
      $http
        .get("plugin.warehouse.frontend.controllers.purchasing.list.index", {})
        .then(response => {
          if (response.result === 1) {
            this.cate = this.cate.concat(response.data.types);
            this.cateLoading = false;
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    getData() {
      $http
        .get("plugin.warehouse.frontend.controllers.purchasing.list.get-goods", { keyword: this.keyword, goods_type: this.active, page: this.page })
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
    onLoad() {
      this.getData();
    },
    onRefresh() {
      this.initData();
      this.getData();
    },
    onClickCate() {
      this.initData();
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
#gift-list {
  .main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0.875rem;
    min-height: 10vh;
    .list {
      width: 10.5rem;
      background-color: #ffffff;
      border-radius: 0.375rem;
      overflow: hidden;
      margin-bottom: 0.75rem;
      text-align: left;
      .good-img {
        width: 10.5rem;
        height: 10.5rem;
        background-color: #f7f7f7;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        font-size: 12px;
        font-weight: bold;
        margin: 0.625rem 0.5rem 1rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .price {
        font-size: 14px;
        color: #ff464c;
        padding: 0 0.625rem 0.875rem;
      }
    }
  }
}
</style>
