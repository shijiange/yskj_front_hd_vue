<template>
  <li class="goods-item" v-if="data">
    <div class="goods-item-mask" :data-id="data.goods_id" :data-gid='data.id'></div>
    <img :src="data.thumb" alt class="goods-cover" />
    <div class="goods-info">
      <div class="goods-title">{{ data.title }}</div>
      <div
        class="goods-sku"
        :style="{ visibility:data.option_title?'visible':'hidden' }"
      >规格：{{ data.option_title }}</div>
      <div class="goods-info-footer">
        <!-- <span class="goods-amount">
          <span>￥</span>
          {{ data.price||data.buying_price }}
        </span> -->
        <span class="goods-stock">库存：{{ data.stock }}</span>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    data: null
  }
};
</script>

<style scoped>
.goods-item {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0.875rem 0.625rem;
  text-align: left;
  border-radius: 0.4063rem;
  background-color: white;
}

.goods-item-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

.goods-cover {
  flex-shrink: 0;
  width: 4.6875rem;
  height: 4.6875rem;
  border-radius: 0.2188rem;
}

.goods-info {
  flex-grow: 1;
  margin-left: 0.5rem;
}

.goods-title {
  display: -webkit-box;
  line-height: 1.0625rem;
  width: auto;
  font-size: 0.875rem;
  color: #000;
  margin: 0 auto;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.goods-sku {
  width: 100%;
  height: 1.5625rem;
  line-height: 1.625rem;
  overflow: hidden;
  color: #999;
  font-size: 0.5938rem;
  text-overflow: ellipsis;
}

.goods-info-footer {
  font-size: 0.75rem;
  color: #999;
}

.goods-amount {
  font-size: 0.8125rem;
  color: #ff2c29;
}

.goods-amount span {
  font-size: 0.5625rem;
}

.goods-stock {
  /* padding-left: 1.0625rem; */
}
</style>