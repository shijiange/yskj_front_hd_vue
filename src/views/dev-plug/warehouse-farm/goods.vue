<!-- 买礼盒 -->
<template>
  <div id="warehouse-farm-good">
    <c-title :hide="false" text="买礼盒"></c-title>
    <div style="background-color: #ffffff;margin-bottom: 1rem;">
      <goodSwipe :thumb_url="info.thumb_url || []" :thumb="info.thumb" :goods_video="info.goods_video" :video_image="info.video_image"></goodSwipe>
      <div class="good-title">{{ info.title }}</div>
      <div class="good-rule">
        <div class="rule-item" @click.stop="clickRule(item.nums)" v-for="(item, index) in rule" :key="index" :class="{ 'active-rule-color': activeRule == item.nums }">
          <!-- 后台有处理，设置的数量不会重复相同 -->
          <div class="price"><em style="font-size: 10px;">￥</em>{{ item.price }}</div>
          <div class="num">{{ item.nums }}{{ info.sku }}</div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="title">商品详情</div>
      <div v-html="info.content"></div>
    </div>

    <van-goods-action class="set-pc-styleLeft">
      <van-goods-action-icon icon="chat-o" text="客服" @click="showCservice = true" />
      <van-goods-action-button type="danger" text="立即购买" @click="toOrder" />
    </van-goods-action>

    <cservice-popup
      :show="showCservice"
      :cservice="cserviceData.cservice"
      :service_mobile="cserviceData.service_mobile"
      :service_QRcode="cserviceData.service_QRcode"
      @close="showCservice = false"
    ></cservice-popup>
  </div>
</template>

<script>
import goodSwipe from "components/goods/children/goodSwipe"; //轮播
import cservicePopup from "components/goods/children/plugin/cservicePopup"; //客服组件
export default {
  data() {
    return {
      activeRule: null,
      info: {},
      rule: [],
      showCservice: false,
      cserviceData: {}
    };
  },

  activated() {},
  created() {
    this.getGood();
  },
  components: { goodSwipe, cservicePopup },

  computed: {},

  mounted() {},

  methods: {
    getGood() {
      $http
        .get("plugin.warehouse.frontend.controllers.purchasing.detail.index", { id: this.$route.params.id })
        .then(response => {
          if (response.result === 1) {
            this.info = response.data.get_goods;
            this.rule = response.data.plugin_rules;
            this.cserviceData = response.data.customer_service;
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toOrder() {
      if (!this.activeRule) {
        this.$toast("请选择规格！");
        return;
      }
      $http
        .get("plugin.warehouse.frontend.controllers.purchasing.order-create", { goods_id: this.$route.params.id, goods_nums: this.activeRule })
        .then(response => {
          if (response.result === 1) {
            this.$router.push(this.fun.getUrl("orderpay", { status: "2", order_ids: response.data.order_ids }));
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    clickRule(_num) {
      this.activeRule = _num;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#warehouse-farm-good {
  .good-title {
    padding: 0.875rem 0.875rem 1.25rem;
    font-size: 14px;
    color: #2c2c2c;
    font-weight: bold;
    text-align: left;
  }
  .good-rule {
    display: flex;
    flex-wrap: wrap;
    .rule-item {
      width: 6.563rem;
      height: 3.75rem;
      border-radius: 0.375rem;
      border: solid 1px #e5e5e5;
      margin: 0 0 0.938rem 0.938rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: solid 1px #e5e5e5;
      .price {
        font-size: 16px;
        color: #f14e4e;
        font-weight: bold;
        em {
          font-weight: bold;
        }
      }
    }
    .active-rule-color {
      background-color: #f14e4e;
      color: #fff;
      .price {
        color: #fff;
      }
    }
  }
  .content {
    background: #fff;
    .title {
      line-height: 2.75rem;
      height: 2.75rem;
    }
  }
}
</style>
