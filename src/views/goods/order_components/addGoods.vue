<!--  -->
<template>
  <div class="add-goods-module" @click.stop="toFullPage">
    <!-- 凑单减邮费 -->
    <div class="cell-title">
      <div class="cell-title-left"><span class="cube">减</span>可继续挑选商品减运费</div>
      <div class="cell-title-right">更多<i class="iconfont icon-member_right"></i></div>
    </div>
    <div class="add-good-list">
      <div class="good-child" v-for="item in datas" :key="item.id">
        <img class="add-good-img" :src="item.thumb" alt="" />
        <div class="add-good-price" v-show="item.price">{{ $i18n.t("money") }}{{ item.price }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  mounted() {},
  methods: {
    toFullPage() {
      if (this.$route.query.tag == "-2") {
        //立即购买的，把他添加到购物车，从包邮页去结算变成购物车结算
        let _json = {
          goods_id: this.$route.query.goodsId,
          total: this.$route.query.total || 1,
          option_id: this.$route.query.optionsId || 0
        };
        $http.get("postageIncludedCategory.member-cart.store", _json, "加载中").then(res => {
          if (res.result === 1) {
            let _cart_ids = [];
            _cart_ids.push(Number(res.data.cart_id));
            this.$router.push(this.fun.getUrl("orderullPackage", {}, { cart_id: _cart_ids.join(",") }));
          } else {
            console.log(res.msg);
          }
          return;
        });
      } else if (this.$route.query.tag == "-1") {
        // 购物车下单
        this.$router.push(this.fun.getUrl("orderullPackage", {}, { cart_id: this.$route.query.cart_ids }));
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.add-goods-module {
  margin-top: 0.625rem;
  padding: 0 0.875rem 0.75rem;
  background: #fff;
  font-size: 12px;

  .cell-title {
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .cell-title-left {
      display: flex;

      .cube {
        display: block;
        padding: 0 0.25rem;
        height: 1.125rem;
        background-color: #f15053;
        border-radius: 0.125rem;
        color: #fff;
        margin-right: 0.25rem;
      }
    }

    .cell-title-right {
      color: #f15053;
    }
  }

  .add-good-list {
    background-color: #fafafa;
    border-radius: 0.375rem;
    display: grid;
    height: 5.625rem;
    grid-template-columns: repeat(4, 1fr);
    justify-items: center;
    align-items: center;

    .good-child {
      width: 4.75rem;
      height: 4.75rem;
      background-color: #c1c1c1;
      border-radius: 0.25rem;
      position: relative;
      overflow: hidden;

      .add-good-img {
        display: block;
        width: 100%;
        height: 100%;
      }

      .add-good-price {
        position: absolute;
        height: 1.25rem;
        line-height: 1.25rem;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #000;
        opacity: 0.6;
        color: #fff;
        font-size: 10px;
      }
    }
  }
}
</style>
