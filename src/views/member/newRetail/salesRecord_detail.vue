<!-- 新零售 销售记录详情 -->
<template>
  <div id="newRetail-salesRecord_detail">
    <c-title :hide="false" text="销售记录"></c-title>
    <div class="list">
      <div class="list-child">
        <div class="member flex-box" v-if="info.state_type == 4">出售失败</div>
        <div class="member flex-box">
          购买会员：
          <img class="member-acator" :src="info.buyer_avatar" alt="" />
          <div class="member-name">{{ info.buyer_nickname }}</div>
        </div>
        <div class="order-price flex-box" v-if="info.money">
          订单金额：
          <div class="price-num">{{ $i18n.t("money") }}{{ info.money }}</div>
        </div>
        <div class="order-sn order-price">订单类型：{{ this.$route.params.mode == 0 ? "代理销售" : "零售" }}</div>
        <div class="order-sn order-price" v-if="info.num">数量：{{ info.num }}</div>
        <div class="order-sn order-price" v-if="info.pay_time">支付时间：{{ info.pay_time }}</div>
        <div class="order-sn order-price" v-if="info.order_sn">订单编号：{{ info.order_sn }}</div>
        <div class="order-sn " v-if="this.$route.params.mode == 0 && info.level_name">套餐：{{ info.level_name }}</div>
      </div>
    </div>
    <div class="order-box" v-if="this.$route.params.mode == 1">
      <div class="box-title">包含商品</div>
      <div class="good-info" v-for="good in info.goods" :key="good.goods_id">
        <img class="good-img" :src="good.goods_thumb" alt="" />
        <div class="goods-main">
          <div class="good-title">{{ good.goods_title }}</div>
          <div class="good-other">
            <div class="goods-sku">
              <template v-if="good.goods_option">规格：{{ good.option_title }}</template> X{{ good.goods_num }}
            </div>
            <div class="good-num">{{ $i18n.t("money") }}{{ good.goods_price }}</div>
          </div>
        </div>
      </div>
      <div class="order-price">
        合计：
        <div class="order-price-red">{{ info.money }}{{ $i18n.t("元") }}</div>
      </div>
    </div>
    <div style="height: 4rem;"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {}
    };
  },

  activated() {
    this.getData();
  },

  components: {},

  computed: {},

  methods: {
    getData() {
      $http
        .get("plugin.new-retail.frontend.index.getSalesRecord", { id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#newRetail-salesRecord_detail {
  .list {
    .list-child {
      display: flex;
      flex-direction: column;
      padding: 0.875rem;
      background: #fff;
      text-align: left;
      font-size: 16px;
      margin-bottom: 0.875rem;

      .member {
        overflow: hidden;
        padding-bottom: 0.875rem;

        .member-acator {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 0.75rem 0 0;
          flex-shrink: 0;
        }

        .member-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      }

      .order-price {
        padding-bottom: 0.875rem;

        .price-num {
          color: #f14e4e;
        }
      }
    }

    .flex-box {
      display: flex;
      align-items: center;
    }
  }

  .order-box {
    width: 90%;
    background: #fff;
    border-radius: 0.313rem;
    overflow: hidden;
    margin: 0.875rem auto;

    .box-title {
      height: 2.188rem;
      line-height: 2.188rem;
      text-align: center;
      background-color: #f14e4e;
      color: #fff;
    }

    .good-info {
      display: flex;
      text-align: left;
      padding: 0.75rem;

      .good-img {
        flex-shrink: 0;
        width: 4.688rem;
        height: 4.688rem;
        background-color: #cfcfcf;
        border-radius: 0.313rem;
        overflow: hidden;
        margin-right: 0.75rem;
      }

      .goods-main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;

        .good-title {
          font-size: 15px;
          line-height: 20px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .goods-sku {
          color: #999;
          font-size: 12px;
        }

        .good-other {
          display: flex;
          justify-content: space-between;

          .good-num {
            color: #f14e4e;
            font-size: 12px;
          }
        }
      }
    }

    .order-price {
      height: 3.125rem;
      line-height: 3.125rem;
      display: flex;
      justify-content: flex-end;
      padding: 0 0.875rem;

      .order-price-red {
        font-size: 18px;
        color: #f14e4e;
      }
    }
  }
}
</style>
