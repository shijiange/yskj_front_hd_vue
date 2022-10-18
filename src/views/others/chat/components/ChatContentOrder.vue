<template>
  <div class="order-con">
    <div class="order-header">
      <span class="order-no">订单号：{{item.content.order_sn}}</span>
      <span class="order-status">{{item.content.status_name}}</span>
    </div>
    <div
      v-for="goods_item in item.content.has_many_order_goods"
      :key="goods_item.goods_id"
      class="order-item-con"
    >
      <div class="order-goods-img">
        <img :src="goods_item.thumb" />
      </div>
      <div class="order-item-txt">
        <div class="order-goods-title">{{goods_item.title}}</div>
        <div class="order-goods-price">
          <span class="order-goods-num">x{{goods_item.total}}</span>
          ￥{{goods_item.price}}
        </div>
      </div>
    </div>
    <div class="order-footer">共 {{item.content.goods_total}} 件商品 实付：¥{{item.content.price}}</div>
  </div>
</template>
<script>
export default {
  props: ["item"],
  mounted() {
    this.$emit("loaded");
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.order-con {
  background: #fff;
  padding: 10px;

  .order-header {
    width: 100%;
    font-size: 14px;
    padding-top: 10px;

    .order-no {
      color: #666;
      float: left;
    }

    .order-status {
      float: right;
      color: #f15353;
    }

    &::after {
      display: table;
      content: "";
      clear: both;
    }
  }

  .order-item-con {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;

    .order-goods-img {
      width: 70px;

      img {
        width: 50px;
        height: 50px;
      }
    }

    .order-item-txt {
      flex: 1;

      .order-goods-title {
        font-size: 14px;
      }

      .order-goods-price {
        display: inline-block;
        width: 100%;
        text-align: right;
        margin-top: 10px;
        color: #fb4a4a;

        .order-goods-num {
          float: left;
        }
      }
    }
  }

  .order-footer {
    text-align: right;
    color: #666;
    line-height: 1.8;
  }
}
</style>