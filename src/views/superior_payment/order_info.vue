<template>
  <div class="order-info">
    <div class="order-header">
      订单信息
    </div>
    <div class="order-list">
      <div class="order-item" v-for="item in goodList" :key="item.id">
        <div class="item-face">
          <img :src="item.thumb" alt="" />
        </div>
        <div class="order-desc">
          <div class="desc">
            <div class="name">{{ item.title }}</div>
            <div class="price">￥{{ item.price }}</div>
          </div>
          <div class="desc">
            <div class="spec">商品规格：{{ item.goods_option_title }}</div>
            <div class="num">X {{ item.total }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      共{{ totalNum }}件商品 实付：<span class="price">￥{{ totalPrice }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["goodList", "totalPrice", "totalNum"],
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.order-info {
  width: 100%;
  padding: 0 0.813rem;

  .order-header {
    display: flex;
    align-items: center;
    height: 2.375rem;
    font-size: 0.813rem;
    color: #333;
    border-bottom: 0.05rem solid #f5f5f5;
  }

  .order-list {
    padding-top: 0.71rem;
    border-bottom: 0.05rem solid #f5f5f5;

    .order-item {
      display: flex;
      height: 4.3rem;
      padding-bottom: 0.8rem;

      .item-face {
        width: 3.5rem;
        height: 3.5rem;

        img {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 0.313rem;
        }
      }

      .order-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        padding: 0.25rem 0;
        padding-left: 0.5rem;

        .desc {
          display: flex;
          justify-content: space-between;

          .name {
            font-size: 0.938rem;
            color: #333;
          }

          .price {
            font-size: 0.813rem;
            color: #333;
          }

          .spec {
            font-size: 0.75rem;
            color: #b0b0b0;
          }

          .num {
            font-size: 0.75rem;
            color: #666;
          }
        }
      }
    }
  }

  .footer {
    height: 2.594rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 0.938rem;
    color: #333;

    .price {
      font-size: 0.938rem;
      color: #f14e4e;
    }
  }
}
</style>
