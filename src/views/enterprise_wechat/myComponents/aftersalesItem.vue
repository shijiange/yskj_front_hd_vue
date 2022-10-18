<template>
  <div id="evaluate">
    <div class="shop">
      <div class="title">
        <p class="order-sn">订单号：{{ goodsItem.order ? goodsItem.order.order_sn : '' }}</p>
        <span>{{ goodsItem.status_name }}</span>
      </div>
      <div class="goods" v-for="(good, i) in goodsItem.order.has_many_order_goods" :key="i">
        <div class="img"><img :src="good.thumb" /></div>
        <div class="warp">
          <div class="inner">
            <div class="name">{{ good.title }}</div>
            <div class="goods-price">{{$i18n.t('money')}}{{good.goods_price}}</div>
            <!-- v-if="good.goods_option_title" -->
            <div class="option" >规格: {{ good.goods_option_title }}</div>
          </div>
        </div>
      </div>
      <div class="refund">
        <span class="left" v-if="goodsItem.plugin_id == 40 && goodsItem.refund_type == 1">租赁归还</span>
        <span class="left" v-if="!(goodsItem.plugin_id == 40 && goodsItem.refund_type == 1)">{{ goodsItem.refund_type_name }}</span>
        <span class="right"
          >退款金额: {{ $i18n.t('money') }}<span style="color: #f14e4e;">{{ goodsItem.price }}</span></span
        >
      </div>
      <div class="gourl">
        <!-- //普通详情 -->
        <span v-if="!(goodsItem.plugin_id == 40 && goodsItem.refund_type == 1 && goodsItem.status == 6)">
          <router-link :to="fun.getUrl('aftersales', { refund_id: goodsItem.id }, { pluginid: goodsItem.plugin_id })"
            >查看详情</router-link
          >
        </span>

        <!-- //租赁详情 -->
        <span v-if="goodsItem.plugin_id == 40 && goodsItem.refund_type == 1 && goodsItem.status == 6">
          <router-link :to="fun.getUrl('OrderReturnAftersalesDetail', { id: goodsItem.order.id })">查看详情</router-link>
        </span>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: ['goodsItem'],
  data () {
    return {
    };
  },

  methods: {},

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#evaluate {
  .title {
    font-size: 12px;
    padding-right: 0.75rem;
    display: flex;
    align-items: center;
    color: #666;
    margin: 0.5rem 0;

    .order-sn {
      margin: 0;
    }

    h4 {
      text-align: left;
      font-weight: normal;
      flex: 5;
      font-size: 14px;

      b {
        font-size: 18px;
      }
    }

    span {
      color: #f15353;
      text-align: right;
      margin-right: 0.0625rem;
      flex: 5;
      font-size: 14px;
      font-size: 12px;
      white-space: nowrap;
    }
  }

  .shop {
    background: #fff;
    margin: 0.625rem;
    border-radius: 10px;

    p {
      margin: 0.625rem;
      text-align: left;
    }

    h3 {
      padding: 0.625rem;
      background: #fff;
      text-align: left;
      font-weight: normal;
      font-size: 12px;

      i {
        margin-right: 0.625rem;
        color: #666;
      }
    }

    .gourl {
      display: block;
      border-top: #ebebeb solid 0.0625rem;
      text-align: right;
      height: 2.5rem;
      padding-right: 0.875rem;
      overflow: hidden;

      .refund {
        float: left;
        line-height: 1.875rem;
        color: #f15353;
        font-size: 12px;
      }

      a {
        color: #f15353;
      }

      span {
        float: right;
        border: #f15353 0.0625rem solid;
        border-radius: 15px;
        padding: 0.25rem 0.625rem;
        color: #f15353;
        text-align: center;
        margin: 0.3rem 0 0 0.3rem;
      }
    }

    .refund {
      line-height: 2.25rem;
      width: 100%;
      display: flex;
      padding: 0 0.75rem;
      font-size: 14px;
      color: #666;

      .left {
        font-size: 12px;
        text-align: left;
      }

      .right {
        flex: 1;
        text-align: right;
      }
    }
  }

  .goods::after {
    content: '';
    display: block;
    clear: both;
  }

  .goods {
    display: flex;
    width: 100%;
    box-sizing: border-box;

    .img {
      width: 4.375rem;
      height: 4.375rem;
      float: left;
      display: inline-block;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .warp {
      flex: 1;
      padding: 0.625rem 0 0 0;
      text-align: left;

      .inner {
        box-sizing: border-box;
        padding: 0 0.625rem;
        text-align: left;

        .name {
          word-break: break-all;
          text-align: left;
          color: #333;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }

      .price {
        width: 30%;
        align-items: center;
        text-align: right;
        color: #333;
        box-sizing: border-box;
        float: left;
        padding-right: 0.25rem;

        p {
          margin-top: 0;
        }
      }
    }

    .goods-price {
      margin: 0.625rem 0;
      color: #888;
      font-size: 12px;
    }

    .option {
      color: #888;
      font-size: 12px;
      flex: 2;
    }
  }
}
</style>