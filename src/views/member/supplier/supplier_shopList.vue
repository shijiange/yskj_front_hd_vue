<template>
  <div id="supplier_shopList">
    <template v-if="is_open">
      <!-- 头 -->
      <div class="header">
        <van-icon class="back-icon" name="arrow-left" @click="goBack" />
        <p class="page-title">供应商列表</p>
      </div>
      <!-- 搜索 -->
      <div class="search-box">
        <i class="iconfont icon-all_search_2" @click="tapConfirm"></i>
        <input class="search" type="" placeholder="搜索店铺名称" v-model="keyword" @keyup.enter="tapConfirm" />
      </div>
      <!-- banner -->
      <div class="banner" v-if="!fun.isTextEmpty(banners)">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <template v-for="(item, index) in banners">
            <van-swipe-item :key="index" v-if="item.img">
              <img :src="item.img" alt="" @click="goUrl(item.link)" />
            </van-swipe-item>
          </template>
        </van-swipe>
      </div>
      <!-- 商铺列表 -->
      <div class="supplier-box">
        <div class="supplier-item" v-for="(item, index) in supplierList" :key="index">
          <div class="supplier-info" @click="goToSupplierShop(item.supplier_id)">
            <div class="img">
              <i v-if="!item.logo" class="iconfont icon-dianpu" style="color: #fff"></i>
              <img v-if="item.logo" :src="item.logo" alt="" />
            </div>
            <div class="info-content">
              <div class="shop-name">{{ item.store_name }}</div>
              <div class="hot-sell_count">
                热销 <span style="color: #f14e4e">{{ item.goods_count?item.goods_count:'0' }}</span> 件
              </div>
            </div>
            <div class="find-info">进入店铺</div>
          </div>
          <ul class="goodsList">
            <li
              class="goods-item"
              v-for="(item, index) in item.has_many_goods.length > 3 ? item.has_many_goods.slice(0, 3) : item.has_many_goods"
              :key="index"
              @click="goToGoodsDetail(item.has_one_goods.id)"
            >
              <div class="goods-img">
                <img :src="item.has_one_goods.thumb" alt="" />
              </div>
              <div class="goods-info">
                <p class="goods-name">{{ item.has_one_goods.title }}</p>
                <p class="goods-price" v-if="item.has_one_goods.has_option == 1 && item.has_one_goods.min_price"><b style="font-size: 0.625rem" >{{ $i18n.t("money") }}</b> {{ item.has_one_goods.min_price }}</p>
                <p class="goods-price" v-else><b style="font-size: 0.625rem">{{ $i18n.t("money") }}</b> {{ item.has_one_goods.price }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { Toast } from "vant";
const SUPPLERLIST_URL = "plugin.supplier.frontend.shop.index.getSupplierList";
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      banners: {},
      supplierList: [],
      keyword: "",
      is_open: 1,

      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  created() {
    this.getSupplierData();
  },
  methods: {
    goUrl(url) {
      window.location.href = url;
    },
    tapConfirm(e) {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.getSupplierData();
    },
    getSupplierData() {
      $http.post(SUPPLERLIST_URL, { keyword: this.keyword, page: this.page }, "加载中...").then(res => {
        if (res.result == 1) {
          this.is_open = res.data.is_open;
          if (!this.is_open) {
            Toast("插件未开启");
            this.$router.push(this.fun.getUrl("home"));
          }
          this.banners = res.data.banners;
          this.supplierList = res.data.list.data;
          this.isLoadMore = true;
          this.total_page = res.data.list.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
        }
        console.log(res);
      });
    },
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };
        $http.get(SUPPLERLIST_URL, json, "").then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.list.data;
              that.supplierList = that.supplierList.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function (response) {
            // error callback
          }
        );
      }
    },
    //返回
    goBack() {
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else {
        this.$router.go(-1);
      }
    },
    // 跳转
    goToSupplierShop(id) {
      this.$router.push(this.fun.getUrl("SupplierShop", { id }));
    },
    goToGoodsDetail(id) {
      this.$router.push(this.fun.getUrl("goods", { id }));
    }
  }
};
</script>
<style lang="scss">
#supplier_shopList {
  img {
    width: 100%;
    height: 100%;
  }
  background-color: #f6f6f6;
}
// 头部
.header {
  position: relative;
  height: 2.8125rem;
  line-height: 2.8125rem;
  font-size: 1rem;
  color: #333;
  border-bottom: 1px solid #ebebeb;
  .back-icon {
    position: absolute;
    left: 1rem;
    top: 0.875rem;
  }
}
// 搜索栏
.search-box {
  position: relative;
  overflow: hidden; // margin塌陷
  height: 2.75rem;

  .search {
    margin: 0.4375rem auto 0;
    padding-left: 3rem;
    width: 21.5625rem;
    height: 1.875rem;
    line-height: 1.875rem;
    font-size: 1rem;
    color: #666;
    text-align: left;
    background-color: #eff0f1;
    border-radius: 0.9375rem;
    border: 0;
  }
  .icon-all_search_2 {
    position: absolute;
    left: 2.25rem;
    bottom: 0.8125rem;
    font-size: 0.875rem;
  }
}
// banner
.banner {
  .my-swipe .van-swipe-item {
    height: 10rem;
    color: #fff;
    font-size: 1.25rem;
    line-height: 9.375rem;
    text-align: center;
    background-color: #39a9ed;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
// 商铺列表
.supplier-box {
  overflow: hidden; // 塌陷
  .supplier-item {
    margin: 0.625rem;
    background-color: #fff;
    border-radius: 0.3125rem;
    overflow: hidden;
  }
  // 商铺信息
  .supplier-info {
    display: flex;
    align-items: center;
    height: 4.375rem;
    background-color: #fff;
    .img {
      margin-left: 0.625rem;
      width: 1.875rem;
      height: 1.875rem;
      text-align: center;
      line-height: 1.875rem;
      border-radius: 50%;
      background-color: #fadc5d;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info-content {
      flex: 1;
      padding-left: 0.5rem;
      font-weight: 700;
      color: #333333;
      text-align: left;
    }
    .shop-name {
      font-size: 0.875rem;
      font-weight: 700;
      line-height: 1.125rem;
    }
    .hot-sell_count {
      font-size: 0.75rem;
      line-height: 1.125rem;
    }
    .find-info {
      margin-right: 1rem;
      width: 4.5rem;
      height: 1.5625rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #fff;
      text-align: center;
      line-height: 1.5625rem;
      background-color: #f14e4e;
      border-radius: 0.8125rem;
    }
  }
  .goodsList {
    display: flex;
    justify-content: flex-start;
    background-color: #fff;
  }
  .goods-item {
    margin: 0 0.3125rem;
    width: 6.75rem;
  }
  .goods-img {
    height: 6.75rem;
    background-color: #333;
  }
  .goods-info {
    text-align: left;
    font-weight: 700;
  }
  .goods-name {
    font-size: 0.6875rem;
    line-height: 1.4375rem;
    letter-spacing: 1px;
    color: #3e3e3e;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .goods-price {
    padding-bottom: 0.375rem;
    font-size: 0.75rem;
    color: #f14e4e;
  }
}
</style>