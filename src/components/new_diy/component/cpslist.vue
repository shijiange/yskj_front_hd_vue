<template>
  <div>
    <div class="cpslist" v-for="(good, i) in datas" :key="i" @click="toGood(good)">
      <div class="left">
        <img :src="good.cover_image" alt="" />
      </div>
      <div class="right">
        <div class="top_rol">
          <div class="top_rol_name">{{ good.shop_name }}</div>
          <div class="top_rol_sale">月销 {{ good.month_sales }}</div>
        </div>
        <div class="top_rol_title">
          <div class="top_rol_platform">{{ good.platform_id == 2 ? "拼多多" : good.platform_id == 1 ? "淘宝" : "京东" }}</div>
          <span>{{ good.title }}</span>
        </div>
        <div class="top_rol_price">
          <div class="currentPrice">
            <span class="sym">￥</span><span>{{ good.discount_price }}</span>
            <span class="originalPrice" v-if="good.price > good.discount_price">原价￥{{ good.price }}</span>
          </div>
        </div>
        <div class="discounts">
          <div class="couponBox" v-if="good.coupon_money > 0">
            <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/cps/5y.png" alt="" />
            {{ good.coupon_money }}元券
          </div>
          <div class="earnings" v-if="good.discount_price > 0 && ratio_data.ratio">
            预估{{ (good.discount_price * (good.tk_rate / 100) * 0.78 * 0.97 * (ratio_data.ratio / 100)).toFixed(2) }}{{ ratio_data.ratio_name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["datas", "ratio_data"],
  data() {
    return {};
  },
  methods: {
    toGood(good) {
      let query = {
        item_id: good.item_id,
        platform_id: good.platform_id
      };
      if (good.activity_id) {
        query.activity_id = good.activity_id;
      }
      this.$router.push(this.fun.getUrl("cpsGoodDetail", {}, query));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.cpslist {
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .right {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 8.13rem;
    overflow: hidden;

    .discounts div:nth-child(n + 1) {
      margin-right: 0.31rem;
    }

    .discounts {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      margin-bottom: 0.22rem;

      .earnings {
        display: flex;
        font-size: 12px;
        color: #39342e;
        align-items: center;
        padding: 0.31rem;
        background-color: #fee3b7;
        border-radius: 0.63rem;
      }

      .couponBox {
        display: flex;
        align-items: center;
        padding: 3px 5px;
        background: #e64a40;
        border-radius: 0.63rem;
        font-size: 0.63rem;
        color: #fff5dc;

        img {
          width: 1rem;
          height: 1rem;
          margin-right: 0.31rem;
        }
      }
    }

    .top_rol_price {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;

      .originalPrice {
        text-decoration: line-through;
        font-size: 0.63rem;
        color: #777;
        margin-left: 0.78rem;
      }

      .currentPrice {
        color: #e64a40;
        font-size: 1.5rem;

        .sym {
          font-size: 0.63rem;
          color: #e64a40;
        }
      }
    }

    .top_rol_title {
      // display: flex;
      text-align: left;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      .top_rol_platform {
        margin-right: 0.3rem;
        background: #bb3e26;
        padding: 0 4px;
        height: 1.2rem;
        color: #fff;
        text-align: center;
        line-height: 1.2rem;
        border-radius: 0.35rem;
        font-size: 12px;
        display: inline-grid;
      }
    }

    .top_rol {
      display: flex;
      overflow: hidden;
      width: 100%;
      margin-bottom: 0.6rem;

      .top_rol_name {
        width: 60%;
        text-align: left;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 0.63rem;
        color: #777;
      }

      .top_rol_sale {
        width: 40%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 0.63rem;
        color: #777;
        text-align: right;
      }

      span {
        white-space: nowrap;
      }
    }
  }

  .left {
    width: 8.13rem;
    height: 8.13rem;
    border-radius: 0.3rem;
    background: #efefef;
    margin-right: 0.59rem;

    img {
      width: 8.13rem;
      height: 8.13rem;
      border-radius: 0.3rem;
    }
  }
}
</style>
