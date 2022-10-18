<template>
  <div>
    <c-title text="我的库存"></c-title>
    <van-search
      class="search-bar"
      shape="round"
      placeholder="请输入搜索内容"
      v-model="searchKeyword"
    ></van-search>
    <d-list @load="getGoodsData" :finished="!isLoadMore" :loading="loading">
      <ul class="goods-list" @click="viewDetails($event)">
        <goods-item
          class="goods-item"
          v-for="goodsItem in displayGoodsList"
          :key="goodsItem.id"
          :data="goodsItem"
        />
      </ul>
    </d-list>
  </div>
</template>

<script>
import { Search, Toast } from "vant";
import GoodsItem from "@/components/member/stock/goods_item.vue";
import DList from "@/components/dlist";
export default {
  activated() {
    this.getGoodsData();
  },
  data() {
    return {
      goodsList: [],
      loading: false,
      page: 1,
      isLoadMore: true,
      searchKeyword:""
    };
  },
  methods: {
    viewDetails(event) {
      const id = event.target.dataset.id; //* 事件代理 获取点中的商品id
      this.$router.push(
        this.fun.getUrl("StockDetails", {}, { id })
      );
    },
    getGoodsData() {
      if (this.loading === true || this.isLoadMore === false) {
        return;
      }
      this.loading = true;
      $http
        .post("plugin.agency.api.stock.get-list", {
          page: this.page
        })
        .then((data, result, msg) => {
          if (result === 0) {
            Toast.fail(msg);
            return;
          }
          this.page++;
          data = data.data;
          if (data.current_page === data.last_page || data.data.length === 0 || data.data.length < data.per_page) {
            this.isLoadMore = false;
          }
          this.goodsList.push(...data.data);
          this.loading = false;
        });
    }
  },
  computed: {
    displayGoodsList() {
      if (this.searchKeyword) {
        return this.goodsList.filter(item => {
          return item.title.indexOf(this.searchKeyword) !== -1;
        });
      } else {
        return this.goodsList;
      }
    }
  },
  components: {
    VanSearch: Search,
    GoodsItem,
    DList
  }
};
</script>

<style scoped>
.goods-list {
  padding: 0.9375rem;
}

.goods-item {
  margin-bottom: 0.625rem;
}
</style>