<!-- 供应商模块 -->
<template>
  <div>
    <div class="store">
      <div class="store-head">
        <div class="store-head-left">
          <div class="left-img">
            <img :src="supplierData.logo ? supplierData.logo : require('../../../../assets/images/loading.jpg')" alt="" />
          </div>
          <div class="left-title">
            <div class="title-name">
              {{ storeNme(supplierData) }}
            </div>
            <div class="title-hot">
              热销<span>{{ count }}</span
              >件
            </div>
          </div>
        </div>
        <div class="store-head-right" @click="gotoSupplier()">
          <div class="right-enter">进入店铺</div>
        </div>
      </div>
      <div class="store-main" v-if="supplierData.hot_sale_goods.length > 0">
        <div class="store-main-item" v-for="(item, index) in supplierData.hot_sale_goods" :key="index" @click="pushGoodGoto(item)">
          <img :src="item.thumb" alt="" />
          <div class="store-main-title">{{ item.title }}</div>
          <div class="store-main-price" v-if="item.has_option == 0">
            {{ $i18n.t("money") }}{{ item.vip_level_status && item.vip_level_status.status == 1 ? item.vip_level_status.word : item.price }}
          </div>
          <div class="store-main-price" v-if="item.has_option == 1">
            {{ $i18n.t("money") }}
            {{ item.max_price == item.min_price ? item.min_price : item.min_price + "-" + item.max_price }}
          </div>
        </div>
        <div class="more-goods" v-if="supplierData.hot_sale_goods && supplierData.hot_sale_goods.length > 6">
          <div class="more-goods-img" @click="gotoSupplier()">
            <i class="iconfont icon-fontclass-yingyongshichang1"></i>
            <div class="more-goods-text">更多商品</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: {
      type: [String, Number],
      default: ""
    },
    supplierData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  computed: {
    storeNme() {
      return supplierData => {
        if (this.fun.isTextEmpty(supplierData.store_name) || supplierData.store_name === "null") {
          return supplierData.username;
        } else {
          return supplierData.store_name;
        }
      };
    }
  },
  methods: {
    pushGoodGoto(val) {
      this.$router.push(this.fun.getUrl("goods", { id: val.id }));
    },
    gotoSupplier() {
      let url = "";
      // 区分供应商样式一和二跳转
      if (this.supplierData.aggregate) {
        url = "SupplierShop2";
      } else {
        url = "SupplierShop";
      }
      this.$router.push(
        this.fun.getUrl(url, {
          id: this.supplierData.id,
          fromHome: 1
        })
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.store {
  background: #fff;
  border-radius: 10px;
  margin: 10px;
  overflow: hidden;

  .store-head {
    padding: 0.8rem 0.8rem 0 0.8rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .store-head-left {
      display: flex;
      align-items: center;

      .left-img {
        flex: 0 0 2rem;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          margin: 0.3rem 0.3rem 0 0;
        }
      }

      .left-title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        .title-name {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.3rem;
          text-align: left;
          word-break: break-all;
        }

        .title-hot {
          font-size: 10px;

          span {
            color: #f14e4e;
          }
        }
      }
    }

    .store-head-right {
      margin-left: 0.3rem;

      .right-enter {
        width: 4.6875rem;
        height: 1.5625rem;
        line-height: 1.5625rem;
        background-color: #f14e4e;
        border-radius: 0.8125rem;
        color: #fff;
        font-size: 0.75rem;
      }
    }
  }

  .store-main::-webkit-scrollbar {
    display: none;
  }

  .store-main {
    width: 22rem;
    overflow-x: scroll;
    overflow-y: hidden;
    display: flex;
    padding: 0 0.6rem;

    .store-main-item {
      width: 6.75rem;
      margin: 0.75rem 0.1875rem;

      img {
        width: 6.75rem;
        height: 6.75rem;
      }

      .store-main-title {
        width: 6.75rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
      }

      .store-main-price {
        text-align: left;
        color: #f14e4e;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .more-goods {
      padding-right: 0.8125rem;

      .more-goods-img {
        margin: 0.75rem 0.1875rem;
        width: 6.75rem;
        height: 6.75rem;
        background-color: #f6f6f6;
        display: flex;
        flex-direction: column;
        justify-content: center;

        i {
          font-size: 40px;
          color: #d3d3d3;
        }
      }

      .more-goods-text {
        color: #6d6d6d;
        font-size: 10px;
        margin-top: 0.5rem;
      }
    }
  }
}
</style>
