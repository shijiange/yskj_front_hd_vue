<!-- 购物车列表弹窗 -->
<template>
  <div id="yz-cartList">
    <van-popup v-model="showCarList" :close-on-click-overlay="false" round position="bottom">
      <div class="yz-cartList-top">
        <div class="text">
          已选择商品 <em style="color: #999;">（共{{ cardata.length }}件）</em>
        </div>
        <div class="clone-box" @click.stop="closedCarList">
          <i class="iconfont icon-close11 "></i>
        </div>
      </div>
      <div class="yz-cartList-main">
        <div class="yz-cartList-list" v-for="item in cardata" :key="item.id">
          <!-- 商品图片隐藏（PS:设计稿没有），后面如有添加直接去掉if条件 -->
          <img v-if="false" :src="item.option_id != 0 ? item.goods_option.thumb : item.goods.thumb" alt="" class="g-img" />
          <div class="g-info">
            <div class="g-title">{{ item.goods.title }}</div>
            <div class="g-option">{{ item.option_str }}</div>
            <div class="g-price" :style="{ color: `${themeColor}` }">
              <em>{{ $i18n.t("money") }}</em>
              {{ item.option_id != 0 ? item.goods_option.product_price : item.goods.price }}
            </div>
          </div>
          <div class="add-cart-btn">
            <van-stepper
              :style="{ '--color': `${themeColor}` }"
              v-model.number="item.total"
              theme="round"
              button-size="22"
              integer
              min="0"
              @blur="devEvents('blur', item.id, item.total)"
              @plus="devEvents('plus', item.id, item.total)"
              @minus="devEvents('minus', item.id, item.total)"
            />
          </div>
        </div>
      </div>
      <!-- 底部购物车按钮 -->
      <div style="margin: 0.5rem 0;">
        <slot></slot>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  model: {
    prop: "showCarList",
    event: "onEmit"
  },
  props: {
    //弹窗是否显示，默认不显示
    showCarList: {
      type: Boolean,
      default: false
    },
    cardata: {
      type: Object,
      default: () => ({})
    },
    //主题色
    themeColor: {
      type: String,
      default: "#f14e4e"
    }
  },
  data() {
    return {
      timer: null
    };
  },
  components: {},
  computed: {},
  methods: {
    devEvents(name, id, total) {
      if (this.timer) clearTimeout(this.timer); //防抖
      this.timer = setTimeout(() => {
        this.$emit(name, { id, total, name });
      }, 500);
    },
    closedCarList() {
      this.$emit("onEmit", false);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#yz-cartList {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .yz-cartList-top {
    display: flex;
    padding: 0 0.875rem;
    justify-content: space-between;
    height: 3.25rem;
    line-height: 3.25rem;

    .text {
      font-size: 0.875rem;
      color: #333;
    }
  }

  .yz-cartList-main {
    flex: 1;
    max-height: 19rem;
    overflow-y: scroll;
    padding: 0 0.875rem;
  }

  .yz-cartList-list {
    border-top: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;
    padding: 0.875rem 0;

    .g-img {
      width: 4.125rem;
      height: 4.125rem;
      border-radius: 0.5rem;
      overflow: hidden;
      flex-shrink: 0;
      margin: 0;
      margin-right: 0.5rem;
    }

    .g-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      text-align: left;

      .g-title {
        width: 100%;
        font-size: 0.875rem;
        font-weight: bold;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
        padding-bottom: 0.5rem;
      }

      .g-option {
        font-size: 0.75rem;
        color: #999;
        padding-bottom: 0.5rem;
      }

      .g-price {
        font-size: 1.125rem;
        color: #f14e4e;
        font-weight: bold;

        em {
          font-size: 0.75rem;
        }
      }
    }

    .add-cart-btn {
      display: flex;
      flex-direction: column-reverse;

      /deep/.van-stepper {
        /deep/.van-stepper__minus {
          color: var(--color);
          border-color: var(--color);
        }

        /deep/.van-stepper__plus {
          background-color: var(--color);
        }
      }
    }
  }

  .yz-cartList-addcart-btn {
    width: 100%;
    height: 4.5rem;
    display: flex;
    align-items: center;
    background: linear-gradient(180deg, hsla(0, 0%, 100%, 0), #fff 19%);
    background-color: transparent;

    .car-box {
      border: 1px solid #f14e4e;
      border-radius: 1.5rem;
      display: flex;
      align-items: center;
      height: 3rem;
      line-height: 3rem;
      width: 90%;
      margin: 0 auto;
      overflow: hidden;

      .car-num {
        width: 50%;
        text-indent: 1.25rem;
        text-align: left;
        color: #f14e4e;
        display: flex;

        i {
          font-size: 1.5rem;
        }

        .small-price {
          font-size: 0.75rem;
        }

        font-size: 1.125rem;
      }

      .car-add {
        flex: 1;
        text-align: center;
        background-color: #f14e4e;
        color: #fff;
      }
    }
  }
}
</style>
