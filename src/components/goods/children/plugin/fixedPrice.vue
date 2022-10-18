<!-- 一口价打包插件 -->
<template>
  <div>
    <div class="optional" @click="toFixedPrice()">
      <span class="three-count">{{ pack_price }}元任选{{ goods_count }}件</span>
      <span class="go-group">
        去凑单
        <i class="iconfont icon-advertise-next icon-arrow"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    plugindata: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      ActivityId: "", //活动id
      // 一口价的数据
      pack_price: "",
      goods_count: ""
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.pack_price = this.plugindata.pack_price;
      this.goods_count = this.plugindata.goods_count;
      this.ActivityId = this.plugindata.id;
    },
    // 一口价点击事件
    toFixedPrice() {
      this.$router.push(this.fun.getUrl("fixedPrice", { id: this.ActivityId }));
    }
  }
};
</script>
<style lang="scss" scoped>
.optional {
  margin-top: 0.4688rem;
  padding: 0 0.75rem;
  width: 100%;
  height: 2.1875rem;
  line-height: 2.1875rem;
  background-color: #fff5ed;

  .three-count {
    float: left;
    font-size: 0.9375rem;
    color: #202020;
  }

  .go-group {
    float: right;
    font-size: 0.8125rem;
    color: #de272a;
    vertical-align: middle;
  }

  .icon-arrow {
    font-size: 700;
    color: #999;
    vertical-align: middle;
  }
}
</style>
