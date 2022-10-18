<template>
  <div id="footprint">
    <c-title :hide="false" text="商品管理"></c-title>
    <div
      class="tbs"
      v-for="(item, index) in datas"
      v-if="item.has_one_goods"
      :key="index"
      @click="toItem(item.has_one_goods)"
    >
      <van-swipe-cell>
        <div class="li2" v-if="item.has_one_goods.thumb"><img :src="item.has_one_goods.thumb"/></div>
        <div class="li2" v-if="!item.has_one_goods.thumb"><img src="../../../assets/images/img_default.png"/></div>
        <div class="li3">
          <div class="product-name">{{ item.has_one_goods.title | escapeTitle }}</div>
          <p class="product-price">
            {{ $i18n.t("money") }} <span>{{ item.has_one_goods.price }}</span>
          </p>
        </div>
        <template #right>
          <van-button square type="danger" text="删除" @click="delteteItem(item, index)"/>
        </template>
      </van-swipe-cell>
    </div>
  </div>
</template>
<script>
import manage_shop_controller from "./manage_shop_controller";

export default manage_shop_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #footprint {
    .mint-cell.mint-cell-swipe,
    .mint-cell-value {
      width: 100%;
    }

    .mint-cell-value,
    .tbs {
      display: flex;
      align-items: center;
      background: #fff;
      flex-flow: row wrap;
      border-bottom: #f5f5f5 0.0625rem solid;
      margin-bottom: 0.375rem;

      .li1 {
        flex: 10%;
      }

      .li2 {
        flex: 20%;

        img {
          width: 5.85rem;
          height: 5.85rem;
        }
      }

      .li3 {
        flex: 60%;
        display: flex;
        flex-direction: column;
        text-align: justify;
        margin-left: 0.625rem;
        box-sizing: border-box;

        .product-name {
          flex: 5;
          font-size: 14px;
          color: #666;
          text-align: justify;
          line-height: 1rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          margin-bottom: 1.125rem;
        }

        .product-price {
          flex: 1;
          color: #f15353;
          text-align: right;
          margin: 0;
          font-size: 12px;

          span {
            font-size: 18px;
          }
        }
      }

      .li4 {
        flex: 10%;
      }
    }

    #foota {
      position: fixed;
      bottom: 0;
      background: #fff;
      width: 100%;
      display: flex;
      align-items: center;

      .el-checkbox {
        flex: 5;
        text-align: left;
        padding-left: 0.9375rem;
      }

      .dels {
        flex: 3;
        border-radius: 0.25rem;
        border: solid 0.0625rem red;
        background: red;
        color: #fff;
        padding: 0.625rem;
      }
    }

    .tbs {
      .van-swipe-cell {
        width: 100%;

        /deep/ .van-swipe-cell__wrapper {
          display: flex;
          width: 100%;
          padding: 0.625rem 0.75rem;

          .van-button {
            height: 100%;
            width: 1rem;
            background: #f15353;
            line-height: 1.5rem;
            font-size: 16px;
          }

          .van-button--danger {
            border: none;
          }
        }
      }
    }
  }
</style>
