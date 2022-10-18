<template>
  <div>
    <c-title :hide="false" :text="plugin_name"></c-title>
    <div class="list">
      <div class="item" v-for="item in goods_list" :key="item.order_id">
        <div class="line">
          <div class="text">订单编号：</div>
          <div class="data">{{ item.order_sn }}</div>
        </div>
        <div class="line">
          <div class="text">【id:{{ item.uid }}】：</div>
          <div class="data">{{ item.nickname }}</div>
        </div>
        <div class="line">
          <div class="text">支付时间：</div>
          <div class="data">{{ item.pay_time }}</div>
        </div>
        <div class="line">
          <div class="text">订单商品金额：</div>
          <div class="price">￥{{ item.goods_price }}</div>
        </div>
        <div class="line">
          <div class="text">计入数量：</div>
          <div class="data">{{ item.scalar }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goods_list: [],
      plugin_name: ""
    };
  },
  created() {
    this.getListData();
  },
  methods: {
    getListData() {
      let { goods_id, task_id } = this.$route.query;
      $http.get("plugin.dealer-task-reward.frontend.controllers.detail.index", { goods_id, task_id }).then(
        response => {
          if (response.result === 1) {
            this.goods_list = response.data.goods_list;
            this.plugin_name = response.data.plugin_name;
          } else {
            this.$toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
        }
      );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.list {
  padding: 0.531rem 0.625rem;

  .item {
    width: 100%;
    height: 9.375rem;
    padding: 0.5rem 0.781rem;
    margin-bottom: 0.625rem;
    background-color: #fff;
    border-radius: 0.313rem;

    .line {
      display: flex;
      font-size: 0.813rem;
      line-height: 1.5rem;
      margin-bottom: 0.2rem;

      .text {
        color: #999;
      }

      .data {
        color: #202020;
      }

      .price {
        color: #f14e4e;
      }
    }
  }
}
</style>
