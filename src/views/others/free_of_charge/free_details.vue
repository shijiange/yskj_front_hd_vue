<template>
  <div id="free_details">
    <div class="top_detail">
      <span class="free_num">{{order_sn}}</span>
      <span class="free_name">{{status_name}}</span>
    </div>
    <div class="bottom_detail">
      <div class="free_store">
        <van-tabs>
          <van-tab title="免单商品"></van-tab>
        </van-tabs>
      </div>
      <span class="all_num">总数：{{dataList.length}}</span>
      <div class="goods_detail" v-for="(item, index) in dataList" :key="index">
        <img :src="item.goods.thumb" alt="" />
        <div class="right">
          <span class="goods_name">{{item.goods.title}}</span>
          <div class="free_num">
            <span class="fress_amoun">免单金额：￥{{item.dividend_amount}}</span>
            <span class="number">数量: 1</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import free_details_controller from "./free_details_controller";

export default free_details_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#free_details {
  .top_detail {
    margin: 1rem 1rem;
    padding: 1rem 1rem;
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-radius: 0.5rem;
    font-size: 18px;

    .free_name {
      color: #ef3532;
    }
  }

  .bottom_detail {
    background: #fff;
    margin: 1rem 1rem;
    padding: 0 1rem 0.1rem 1rem;
    border-radius: 0.5rem;

    .free_store {
      /deep/.van-tab--active {
        color: #ee0a24 !important;
        font-size: 16px;
      }
    }

    .all_num {
      text-align: left;
      display: block;
    }

    .goods_detail {
      margin: 1rem 0;
      display: flex;

      img {
        width: 4rem;
        height: 4rem;
        margin: 0 1rem 0 0;
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        width: 100%;

        .goods_name {
          color: #333;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .free_num {
          display: flex;
          justify-content: space-between;
          font-size: 15px;

          .fress_amoun {
            color: #f15353;
          }

          .number {
            color: #a8a8a8;
          }
        }
      }
    }
  }
}
</style>
