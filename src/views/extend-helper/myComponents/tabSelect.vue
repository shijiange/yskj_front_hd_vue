<template>
  <div style="overflow: hidden; background-color: rgb(255, 255, 255);">
    <div class="type-select" v-if="showTypeTab">
      <van-tabs type="card" v-model="orderType" @change="changeType">
        <van-tab color="#f14e4e" title="全部(订单金额)" name="0"></van-tab>
        <van-tab color="#f14e4e" :title="recommendText ? recommendText : '直推'" name="1"></van-tab>
        <van-tab color="#f14e4e" :title="noRecommendTtext ? noRecommendTtext : '非直推'" name="2"></van-tab>
      </van-tabs>
    </div>

    <div class="data-select">
      <van-tabs :border="true" v-model="dataFormat" @change="changeTime">
        <van-tab title="今日" name="1"></van-tab>
        <van-tab title="昨日" name="2"></van-tab>
        <van-tab title="上月" name="3"></van-tab>
        <van-tab title="本月" name="4"></van-tab>
        <van-tab title="合计" name="0"></van-tab>
      </van-tabs>
    </div>

    <div class="sale-content">
      <div :class="['sale-item', activeClass('order-num')]" :style="saleStyle">
        <div>
          <i class="iconfont icon-fontclass-dingdanguanli"></i>
          <span>订单数量</span>
        </div>
        <div>{{orderTotal}}</div>
      </div>
      <div class="sale-item order-amount" v-if="showOrderAmount" :style="saleStyle">
        <div>
          <i class="iconfont icon-fontclass-fufeijilu"></i>
          <span>订单总金额</span>
        </div>
        <div>￥{{orderAmount}}</div>
      </div>
      <div :class="['sale-item', activeClass('commission-amount')]" :style="saleStyle">
        <div>
          <i class="iconfont icon-fontclass-qian"></i>
          <span>{{showOrderAmount ? '提成总金额' : '合计金额'}}</span>
        </div>
       <div>￥{{countAmount}}</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    showTypeTab: { // 显示类型选择器
      type: Boolean,
      default: false
    },
    showOrderAmount: {  // 显示订单总金额
      type: Boolean,
      default: false
    },
    orderTotal: { //订单数量
      type: Number,
      default: 0
    },
    orderAmount: { // 订单金额
      type: Number,
      default: 0
    },
    countAmount: { // 提成金额
      type: Number,
      default: 0
    },
    recommendText: {
      type: String,
      default: ''
    },
    noRecommendTtext: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      orderType: '0',
      dataFormat: '1',
      saleStyle: {},
    };
  },

  computed: {
    activeClass(){
      return className => (this.showOrderAmount ? className : `${className}-max`);
    },
  },

  activated () {
    this.initData();
  },
  mounted () {
    if (this.showOrderAmount) {
      this.saleStyle = {
        width: '6.88rem',
        height: '5.09rem'
      };
    } else {
      this.saleStyle = {
        width: '9.28rem',
        height: '5.09rem'
      };
    }
  },

  methods: {
    changeType () {
      this.sendEvent();
    },
    changeTime () {
      this.sendEvent();
    },

    sendEvent () {
      let tabObj = {};
      tabObj.orderType = this.showTypeTab ? this.orderType : '0';
      tabObj.dataFormat = this.dataFormat;
      this.$emit("loadData", tabObj);
    },

    initData () {
      this.orderType = '0';
      this.dataFormat = '1';
    }
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss'>
  // 覆盖vant样式
  .type-select {
    margin-top: 30px;

    .van-tabs__wrap {
      height: 2rem !important;
    }

    .van-tabs__nav--card {
      border-radius: 5px !important;
      height: 2rem !important;
      overflow: hidden !important;
      border: 1px solid #f14e4e !important;
    }

    .van-tab--active {
      background-color: #f14e4e !important;
    }

    .van-tabs__line {
      width: 1.25rem !important;
      height: 0.19rem !important;
      background-color: #f14e4e !important;
      border-radius: 0.09rem !important;
    }
  }

  .data-select {
    height: 2.75rem;
  }

  .sale-content {
    height: 7.81rem;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .sale-item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      min-width: 6.88rem;
      min-height: 5.09rem;
      border-radius: 10px;
      background-size: 100%;
      background-repeat: no-repeat;
      font-weight: normal;
      word-break: break-all;
      color: #fff;
    }

    .order-num {
      background-image: url("../../../assets/images/tabSelect/order_num_min.png");
    }

    .order-amount {
      background-image: url("../../../assets/images/tabSelect/order_amount_min.png");
    }

    .commission-amount {
      background-image: url("../../../assets/images/tabSelect/commission_amount_min.png");
    }

    .order-num-max {
      background-image: url("../../../assets/images/tabSelect/order_num_max.png");
    }

    .commission-amount-max {
      background-image: url("../../../assets/images/tabSelect/commission_amount_max.png");
    }

    i {
      margin-right: 5px;
    }
  }
</style>
