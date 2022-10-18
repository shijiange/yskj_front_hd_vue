<template>
  <div class="goodsShop">
    <ul class="activityUL">
      <template v-if="!showMask">
        <li class="goods-item" v-for="(item, index) in arr" :key="index" @click="goToDetail(item.id)">
          <div class="goods-img">
            <img :src="item.thumb ? item.thumb : require('@/assets/images/loading.jpg')" />
          </div>
          <div class="goods-info">
            <p class="name">{{ item.title }}</p>
            <p class="price" v-if="item.has_option == 1 && item.min_price">{{ $i18n.t("money") }} {{ item.min_price }}</p>
            <p class="price" v-else>{{ $i18n.t("money") }} {{ item.price }}</p>
          </div>
        </li>
      </template>
      <template v-if="showMask">
        <li class="goods-item" v-for="(item, index) in arr" :key="index" @click="goToDetail(item.id)" v-if="item.has_one_goods_limit_buy.status != 0">
          <div class="goods-img">
            <img :src="item.thumb ? item.thumb : require('@/assets/images/loading.jpg')" />
            <div class="mask">
              <i class="iconfont icon-dingshi"></i>
              <van-count-down :time="item.has_one_goods_limit_buy.end_time" format="DD 天 HH : mm : ss " />
            </div>
          </div>
          <div class="goods-info">
            <p class="name">{{ item.title }}</p>
            <p class="price" v-if="item.has_option == 1 && item.min_price">{{ $i18n.t("money") }} {{ item.min_price }}</p>
            <p class="price" v-else>{{ $i18n.t("money") }} {{ item.price }}</p>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
export default {
  props: ["arr", "showMask"],
  data() {
    return {};
  },
  methods: {
    goToDetail(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val }));
    }
  }
};
</script>
<style lang="scss" scoped>
.activityUL {
  display: flex;
  flex-wrap: wrap;
  .goods-item:nth-child(2n + 1) {
    margin-right: 0.56rem;
  }
}
.goods-item {
  width: 10.8125rem;
  margin-bottom: 0.625rem;
  border-radius: 0.3125rem;
  overflow: hidden;
  background-color: #fff;
}
.goods-img {
  position: relative;
  height: 10.8125rem;
  img {
    width: 100%;
    height: 100%;
  }
}
.mask {
  position: absolute;
  bottom: 0;
  left: 0;
  padding-left: 0.625rem;
  width: 100%;
  height: 1.375rem;
  font-size: 0.6875rem;
  color: #fff;
  text-align: left;
  line-height: 1.375rem;
  letter-spacing: 1px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
}
.van-count-down {
  font-size: 0.69rem;
  color: #fff;
  margin-left: 0.5rem;
}
.goods-info {
  .name {
    height: 1.875rem;
    margin: 0.625rem;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1rem;
    color: #2c2c2c;
    text-align: left;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .price {
    margin: 0.625rem 0 0.375rem 0;
    margin-left: 0.625rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: #ff464c;
    line-height: 1rem;
    text-align: left;
  }
}
</style>