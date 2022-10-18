<template>
  <div id="evaluate">
    <c-title :hide="false" text="售后列表"></c-title>

    <div class="shop" v-for="(item, i) in list" :key="i">
      <div class="title">
        <h4>{{ item.order.order_sn }}</h4>
        <span>{{ item.status_name }}</span>
      </div>
      <div class="goods" v-for="(good, i) in item.order.has_many_order_goods" :key="i">
        <div class="img"><img :src="good.thumb" /></div>

        <div class="warp">
          <div class="inner">
            <div class="name">{{ good.title }}</div>
            <div class="option" v-if="good.goods_option_title">规格: {{ good.goods_option_title }}</div>
          </div>
        </div>
      </div>
      <div class="refund">
        <span class="left" v-if="item.plugin_id == 40 && item.refund_type == 1">租赁归还</span>
        <span class="left" v-if="!(item.plugin_id == 40 && item.refund_type == 1)">{{ item.refund_type_name }}</span>
        <span class="right" v-if="item.refund_type != 2"
          >退款金额: {{ $i18n.t("money") }}<b style="font-size: 18px;">{{ item.price }}</b></span
        >
      </div>
      <div class="gourl">
        <!-- //普通详情 -->
        <span v-if="!(item.plugin_id == 40 && item.refund_type == 1 && item.status == 6)">
          <router-link :to="fun.getUrl('aftersales', { refund_id: item.id }, { pluginid: item.plugin_id })">查看详情</router-link>
        </span>

        <!-- //租赁详情 -->
        <span v-if="item.plugin_id == 40 && item.refund_type == 1 && item.status == 6">
          <router-link :to="fun.getUrl('OrderReturnAftersalesDetail', { id: item.order.id })">查看详情</router-link>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import order_aftersaleslistcontroller from "./order_aftersaleslistcontroller";
export default order_aftersaleslistcontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#evaluate {
  .title {
    line-height: 2.25rem;
    padding: 0 0.75rem;
    display: flex;
    align-items: center;

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

      .left {
        flex: 1;
        text-align: left;
      }

      .right {
        flex: 1;
        text-align: right;
      }
    }
  }

  .goods::after {
    content: "";
    display: block;
    clear: both;
  }

  .goods {
    /* display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: stretch;
            -ms-flex-align: stretch;
            align-items: stretch;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            -ms-flex-flow: row wrap;
            flex-flow: row wrap;
            */
    width: 100%;
    box-sizing: border-box;

    /* background: #fafafa; */
    .img {
      /* flex: 1; */
      width: 26%;
      padding: 0.625rem 1rem;
      float: left;
      display: inline-block;

      /* background:blue; */
      img {
        width: 100%;
      }
    }

    .warp {
      width: 74%;
      padding: 0.625rem 0 0 0;
      float: left;
      display: inline-block;

      .inner {
        float: left;
        box-sizing: border-box;
        padding: 0 0.625rem;
        text-align: left;

        .name {
          text-align: left;
          color: #333;
          margin-bottom: 0.625rem;
          font-size: 14px;
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

    .option {
      color: #888;
      font-size: 12px;
      flex: 2;
    }
  }
}
</style>
