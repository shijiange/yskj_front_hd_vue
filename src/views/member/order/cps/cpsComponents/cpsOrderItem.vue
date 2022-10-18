<template>
  <div>
    <div class="order-box" v-if="!isCoupon">
      <div class="head">
        <span class="name">{{orderData.type_name}}</span>
        <span class="status">{{orderData.status_name}}</span>
      </div>
      <div class="detail">
        <div class="left-img">
          <img :src="orderData.image" alt="">
        </div>
        <div class="right-box">
          <div class="title ellipsis">{{orderData.title}}</div>
          <div class="info">
            <div>
              <p>付款日 <span>{{orderData.create_time}}</span></p>
              <p>确认收货日 <span>{{orderData.receive_time}}</span></p>
              <p class="orderNo ellipsis">订单号 <span>{{orderData.sub_order_id}}</span></p>
            </div>
            <div class="button-box">
              <!-- <span class="price">￥{{orderData.goods_price}}</span> -->
              <d-copy
                :content="orderData.sub_order_id"
                :copy="copy"
                @copySuccess="copySuccess"
              >
                <span class="copy">复制</span>
              </d-copy>
            </div>
          </div>
          <div class="money-box">
            <span>付款￥{{orderData.pay_price}}</span>
            <span class="money">赠送￥{{orderData.pre_commission}}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 卡券 -->
    <div class="coupon-box" v-else>
    <div class="head">
      <span class="name">订单状态</span>
      <span class="status">{{orderData.code == 0 ? '成功' : '失败' }} </span>
    </div>
    <div class="detail">
      <div class="left-img">
        <img :src="orderData.goods_cover" alt="">
      </div>
      <div class="right-box">
        <div class="title ellipsis">{{orderData.goods_name}}</div>
        <div class="info">
          <div>
            <p>下单日期 <span>{{orderData.created_at}}</span></p>
            <p class="orderNo ellipsis">订单号 <span>{{orderData.order_no}}</span></p>
          </div>
          <div class="button-box">
            <d-copy
              :content="orderData.order_no"
              :copy="copy"
              @copySuccess="copySuccess"
            >
              <span class="copy">复制</span>
            </d-copy>
          </div>
        </div>
        <div class="money-box" style="margin-top: 0.8rem;">
          <span>付款￥{{orderData.order_price}}</span>
        </div>
      </div>
    </div>

    <div class="coupon-info"
      v-for="(item, index) in (orderData.coupon_info ? orderData.coupon_info.coupons : [])"
      :key="index"
    >
      <div class="item" v-if="item.goods_link">
        <span class="left-text ellipsis">卡券链接：{{item.goods_link}}</span>
        <d-copy
            :content="item.goods_link"
            :copy="copy"
            @copySuccess="copySuccess"
          >
            <span class="btn-copy">复制</span>
        </d-copy>
      </div>
      <div class="item" v-if="item.goods_number">
        <span class="left-text ellipsis">卡券卡号：{{item.goods_number}}</span>
          <d-copy
            :content="item.goods_number"
            :copy="copy"
            @copySuccess="copySuccess"
          >
            <span class="btn-copy">复制</span>
        </d-copy>
      </div>
      <div class="item" v-if="item.goods_password">
        <span class="left-text ellipsis">卡券密码：{{item.goods_password}}</span>
          <d-copy
            :content="item.goods_password"
            :copy="copy"
            @copySuccess="copySuccess"
          >
            <span class="btn-copy">复制</span>
        </d-copy>
      </div>
      <div class="item" v-if="item.effective_time">
        <span class="left-text ellipsis">过期时间：{{item.effective_time}}</span>
      </div>
    </div>
    </div>

  </div>
</template>

<script>
import DCopy from "@/components/other/common/DCopy";
import { Toast } from 'vant';
export default {
  props: {
    orderData: {
      type: Object,
      default () {
        return {};
      }
    },
    isCoupon: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      copy: false,
      coupon_info: {}
    };
  },

  computed: {
  },

  methods: {
    copySuccess (message) {
      this.copy = false;
      Toast('复制成功');
    }
  },

  mounted() {},

  components: {
    DCopy,
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.order-box,
.coupon-box {
  margin-top: 0.5rem;
  background-color: #fff;
  font-size: 13px;
  font-weight: 500;
  padding: 0.8rem 0.6rem;
  text-align: left;
  word-break: break-all;

  .head {
    display: flex;
    justify-content: space-between;

    .name {
      font-weight: bolder;
      font-size: 15px;
      color: #414141;
    }
  }

  .detail {
    margin-top: 0.5rem;
    display: flex;

    .left-img {
      width: 5.63rem;
      height: 5.63rem;
      background-color: #b4b4b4;
      border-radius: 0.31rem;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .right-box {
      flex: 1;
      max-width: 16rem;
      margin-left: 0.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .title {
        font-size: 14px;
        font-weight: bold;
        color: #414141;
      }

      .info {
        display: flex;
        justify-content: space-between;
        font-size: 12px;

        p {
          width: 100%;
          margin-top: 0.4rem;
          color: #7f7f7f;
        }

        .orderNo {
          max-width: 12rem;
        }
      }

      .button-box {
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;
        text-align: center;
        min-width: 3rem;

        .price {
          font-size: 13px;
          font-weight: 600;
        }

        .copy {
          width: 2.38rem;
          font-size: 10px;
          padding: 0.1rem 0.3rem;
          background-color: #f7f5f6;
          border-radius: 0.63rem;
          border: solid 1px #dadada;
        }
      }

      .money-box {
        margin-top: 0.5rem;
        display: flex;
        justify-content: space-between;
        color: #e64a40;

        .money {
          font-size: 15px;
        }
      }
    }
  }

  .coupon-info {
    margin-top: 0.5rem;
    padding: 0.6rem 0.8rem;
    border-radius: 0.5rem;
    background-color: #f5f5f5;

    .item {
      margin-top: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left-text {
        max-width: 18rem;
      }

      .btn-copy {
        color: #e64a40;
      }
    }

    .item:first-child {
      margin-top: 0;
    }
  }
}
</style>