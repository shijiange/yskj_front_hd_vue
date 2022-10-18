<template>
  <div class="guide">
    <c-title :text="is_retail?'零售':'订货'"></c-title>
    <van-search
      class="search-goods-bar"
      v-model="searchGoodsKeyword"
      show-action
      placeholder="请输入搜索的内容"
      shape="round"
    >
      <template #action>
        <div class="explain-show-button" @click="showExplainPopup=!showExplainPopup">
          <i class="iconfont icon-dingdan1"></i>
          说明
        </div>
      </template>
    </van-search>
    <img :src="sets.banner" class="top-banner" v-show="sets.banner && !is_retail" />
    <d-list @load="getGoodsList" :loading="goodsLoading" :finished="goodsLoadFinished">
      <ul class="goods-list" @click="viewGoods($event)">
        <goods-item
          class="goods-item"
          v-for="goodsItem in goodsList"
          :key="goodsItem.id"
          :data="goodsItem"
        />
      </ul>
    </d-list>
    <van-popup v-model="showExplainPopup" round closeable>
      <div class="explain-popup-content">
        <div class="explain-title">说明</div>
        <div class="explain-content" v-html="sets.summary"></div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Search, Popup, Toast } from "vant";
import GoodsItem from "../../../components/member/stock/goods_item.vue";
import DList from "@/components/dlist";
export default {
  data() {
    return {
      showExplainPopup: false,
      sets: {
        summary: "", //* 说明内容
        banner: "" //* 搜索栏下的海报图片
      },
      goods: [],
      goodsLoadPage: 1, //* 商品加载页数
      goodsLoading: false, //* 商品是否记载中
      goodsLoadFinished: false, //* 商品是否加载完成
      searchGoodsKeyword: "",
      is_retail:false
    };
  },
  activated() {
    this.getGoodsList();
    if(this.$route.params.target){
      this.is_retail = true;
    }
  },
  methods: {
    getGoodsList() {
      if (this.goodsLoading === true || this.goodsLoadFinished === true) {
        return;
      }
      this.goodsLoading = true;
      $http
        .post("plugin.agency.api.goods.goods-list", {
          page: this.goodsLoadPage,
          is_retail : this.is_retail
        })
        .then(({ data, result, msg }) => {
          if (result === 0) {
            Toast(msg);
            return;
          }
          if (data.data.length === 0 || data.data.length < data.per_page || data.current_page === data.last_page) {
            this.goodsLoadFinished = true;
          }
          this.goodsLoadPage++;
          this.sets.banner = data.set.banner;
          this.sets.summary = data.set.summary;
          this.goods.push(...data.data);
          this.goodsLoading = false;
        });
    },
    viewGoods({ target: { dataset } }) {
      const id = dataset.gid;
      if (!id) {
        return;
      }
      let json = {fromStock: 1};
      if(this.is_retail){
        json.is_retail = this.is_retail;
      }
      this.$router.push(
        this.fun.getUrl(
          "goods",
          {
            id
          },
          json
        )
      );
    }
  },
  computed: {
    goodsList() {
      if (this.searchGoodsKeyword) {
        return this.goods.filter(item => {
          return item.title.indexOf(this.searchGoodsKeyword) !== -1;
        });
      } else {
        return this.goods;
      }
    }
  },
  components: {
    VanSearch: Search,
    VanPopup: Popup,
    GoodsItem,
    DList
  }
};
</script>

<style scoped>
/* 搜索栏 */

/* .search-goods-bar { */

/* } */

.explain-show-button {
  padding-left: 1.0313rem;
  color: #f14e4e;
}

.van-search__action:active {
  background: none;
}

/* 说明弹窗 */
.explain-popup-content {
  padding: 1.75rem 1.3438rem;
  width: 16.875rem;
  height: 14.6875rem;
  background: white;
}

.explain-title {
  font-size: 1rem;
  font-weight: 500;
  color: #161615;
}

.explain-content {
  margin-top: 1.25rem;
  line-height: 1.1875rem;
  text-align: left;
  font-size: 0.75rem;
  color: #6e6e6e;
}

/* 置顶海报 */
.top-banner {
  width: 100%;
  height: 10.9375rem;
  object-fit: cover;
}

/* 商品列表 */
.goods-list {
  margin-top: 0.9375rem;
  padding: 0 0.9375rem 0.9375rem;
}

.goods-item {
  margin-bottom: 0.625rem;
}
</style>