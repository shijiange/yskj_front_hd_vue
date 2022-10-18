<!-- 商品列表 -->
<template>
  <div class="good-cell-components" @click.stop="showGoodDetail">
    <div class="good-cell-left">
      <img :src="item.thumb" alt="" />
    </div>
    <div class="good-cell-right">
      <div class="good-cell-title">{{ item.title }}</div>
      <div>
        <div class="good-cell-sold">已售{{ parseInt(item.show_sales || 0) + parseInt(item.virtual_sales || 0) }}</div>
        <div class="good-cell-price-box">
          <div class="good-cell-price">
            <em style="font-size: 10px;"> {{ $i18n.t("money") }}</em
            >{{ item.price }}
          </div>
          <div class="good-cell-buy-btn" @click.stop>
            <template v-if="!item.has_option">
              <div class="good-cell-btn good-cell-btn-1" v-if="!item.total" @click.stop="addCart">
                <i class="iconfont icon-life-game-plus"></i>
              </div>
              <div class="good-cell-btn-3" v-if="item.total && Number(item.total > 0)">
                <van-stepper
                  theme="round"
                  v-model.number="cartTotal"
                  integer
                  :disabled="this.$store.state.isloadding || Number(item.stock) == 0"
                  button-size="24px"
                  min="0"
                  :max="item.stock"
                  @change="onChange"
                />
              </div>
            </template>
            <div class="good-cell-btn good-cell-btn-2" v-if="item.has_option" @click.stop="addCart">
              选规格<em v-if="item.total">{{ item.total }}</em>
            </div>
          </div>
        </div>
        <div class="good-cell-original-price">{{ $i18n.t("money") }}{{ item.market_price }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    num: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cartTotal: null,
      timer: null
    };
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    showGoodDetail() {
      this.$emit("show", { id: this.item.id, index: this.index });
    },
    addCart() {
      this.$emit("add", { id: this.item.id, isSpecs: this.item.has_option, index: this.index });
    },
    onChange() {
      if (this.timer) clearTimeout(this.timer); //防抖
      this.timer = setTimeout(() => {
        this.$emit("change", { id: this.item.id, isSpecs: this.item.has_option, index: this.index, num: this.cartTotal, cartId: this.item.card_id });
      }, 500);
    }
  },
  watch: {
    "item.total"(newV, oldV) {
      this.cartTotal = newV;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.good-cell-components {
  display: flex;
  padding: 0.875rem;

  .good-cell-left {
    width: 5.625rem;
    height: 5.625rem;
    border-radius: 0.375rem;
    overflow: hidden;
    flex-shrink: 0;
    margin-right: 0.75rem;
    background: #fbfbfb;

    img {
      width: 100%;
    }
  }

  .good-cell-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;

    .good-cell-title {
      flex: 1;
      font-size: 14px;
      line-height: 1rem;
      max-height: 2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .good-cell-sold,
    .good-cell-original-price {
      font-size: 10px;
      color: #999;
    }

    .good-cell-original-price {
      text-decoration: line-through;
    }

    .good-cell-price-box {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      align-items: center;

      .good-cell-price {
        color: #f15353;
      }

      .good-cell-btn {
        background-color: #f15353;
        height: 1.25rem;
        line-height: 1.25rem;
        color: #fff;
        text-align: center;
      }

      .good-cell-btn-1 {
        width: 1.25rem;
        border-radius: 50%;
      }

      .good-cell-btn-2 {
        padding: 0 0.625rem;
        border-radius: 1rem;
        font-size: 10px;
        position: relative;

        em {
          padding: 0 0.25rem;
          min-width: 1.25rem;
          height: 1.25rem;
          line-height: 1.25rem;
          font-size: 14px;
          position: absolute;
          top: -12px;
          right: -5px;
          background-color: #ff5d5c !important;
          color: #fff;
          border-radius: 0.875rem;
          box-shadow: 1px 1px 6px #b74444;
        }
      }
    }
  }
}
</style>
