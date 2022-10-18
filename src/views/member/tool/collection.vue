<template>
  <div id="footprint">
    <c-title :hide="false"
             text='我的收藏'></c-title>
    <div style="margin-bottom: 0.375rem;"></div>
    <div class="tbs"
         v-for="(item,index) in datas"
         :key='index'
         v-if="item.goods"
         @click="toItem(item.goods)">
      <van-swipe-cell>
        <div class="li2"
             v-if='item.goods.thumb'><img :src="item.goods.thumb"/></div>
        <div class="li2"
             v-if='!item.goods.thumb'><img src="../../../assets/images/img_default.png"/></div>
        <div class="li3">
          <div class="product-name">{{item.goods.title|escapeTitle}}</div>
          <p class="product-price">
            {{$i18n.t("money")}}
            <span v-if="item.vip_level_status&&item.vip_level_status.status==1" class="product-price-span">{{item.vip_level_status.word}}</span>
            <span v-else>{{item.goods.price}}</span>
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
import collectioncontroller from "./collectioncontroller";

export default collectioncontroller;
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
          width: 5.86rem;
          height: 5.86rem;
          border-radius: 10px;
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
          font-weight: bold;
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
          text-align: left;
          margin: 0;
          font-size: 14px;

          span {
            font-size: 18px;
          }

          .product-price-span {
            font-size: 0.75rem;
            background: #f15353;
            color: white;
            padding: 0.2rem 0.5rem;
            border-top-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
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
