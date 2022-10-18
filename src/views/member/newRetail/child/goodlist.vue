<!-- 商品列表组件 -->
<template>
  <div id="newRetail-child-goodlist">
    <div class="ul">
      <div class="li" v-for="goods in goodsList" :key="goods.goods_id" @click.stop="gotoGoodDetail(goods.good_id)">
        <div class="good-img">
          <img :src="goods.thumb" alt="" />
        </div>

        <div class="goods-main">
          <div class="goods-title">{{ goods.title }}</div>
          <div class="goods-price">{{ $i18n.t("money") }} {{ goods.price }}</div>
        </div>
      </div>
    </div>
    <yz-blank :datas="goodsList" text="暂无商品信息"></yz-blank>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
export default {
  props: {
    goodsList: {
      type: Object,
      default: () => ({})
    },
    mode: {
      type: [String, Number],
      default: "1"
    }
  },
  data() {
    return {};
  },

  // activated: {},

  components: { yzBlank },

  computed: {},

  methods: {
    gotoGoodDetail(id) {
      this.$router.push(this.fun.getUrl("newRetailSalesGood", { id: id, mode: this.mode }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#newRetail-child-goodlist {
  padding-bottom: 0.875rem;

  .ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .li {
      width: 10.5rem;
      background-color: #fff;
      border-radius: 0.625rem;
      overflow: hidden;
      margin: 0.75rem 0 0 0.75rem;

      .good-img {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        position: relative;

        img {
          width: 100%;
          right: 0;
          height: 100%;
          position: absolute;
        }
      }

      .goods-main {
        padding: 0.625rem;
        text-align: left;

        .goods-title {
          height: 2rem;
          line-height: 1rem;
          font-size: 0.875rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .goods-price {
          margin-top: 1rem;
          font-size: 0.938rem;
          color: #f14e4e;
        }
      }
    }
  }
}
</style>
