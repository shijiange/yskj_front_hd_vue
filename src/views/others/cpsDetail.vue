<template>
  <div id="cpsDetail">
    <c-title :hide="false" text="详情"> </c-title>
    <div style="padding-bottom: 3.75rem;">
      <!-- <div class="top-box" :style="[]">  :style ="{ backgroundImage:'url(' + info.logo + ')' }"-->
      <div class="top-box"  >
        <img :src="info.logo" alt="">
      </div>
      <div class="goods-box">
        <div class="title">
          <div class="left">
            <img :src="info.logo" alt="">
          </div>
          <div class="text">{{info.name}}</div>
        </div>
        <div class="price">￥{{info.sale_price}}</div>
        <div class="normal-price">
          <del>官方价￥{{info.face_price}}</del>
        </div>
      </div>
      <div class="buy-count">
        <div class="num">
          <div class="text">购买数量</div>
          <div class="change">
            <img src="../../assets/images/icon_card_del.png" @click="cut"/>
            <input type="text " v-model="num" />
            <img src="../../assets/images/icon_card_add.png" @click="add"/>
          </div>
        </div>
        <div class="btn" v-html="info.instruction" v-show="info.instruction"></div>
      </div>
      <div class="use-tips">
        <div class="text">使用须知</div>
        <div class="tips-content" v-html="info.use_notice">
          
        </div>
      </div>
    </div>
    <div class="fixed-btn">
      <div class="fixed-left">
        <div class="toIndex" @click="goHome">
          <img src="../../assets/images/icon_card_home.png" />
          <div>首页</div>
        </div>
        <div class="toOrder" @click="goOrder">
          <img src="../../assets/images/icon_card_order.png" />
          <div>订单</div>
        </div>
      </div>
      <div class="fixed-right" @click="submit">下单购买</div>
    </div>
  </div>
</template>

<script>
import cpsDetail_controller from "./cpsDetail_controller";

export default cpsDetail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#cpsDetail {
  .top-box {
    width: 23.4375rem;
    // height: 13.4375rem;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    // background: #b7b7b7;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .goods-box {
    width: 22.1875rem;
    background: #fff;
    border-radius: 0.625rem;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 1.25rem 0;
    // margin-top: -1.875rem;

    .title {
      display: flex;
      align-items: center;
      justify-content: center;

      .left {
        width: 1.375rem;
        height: 1.375rem;
        background: #f3f3f3;
        border-radius: 50%;
        margin-right: 0.375rem;

        img {
          width: 100%;
          height: 100%;
          border-radius: 100% 100%;
        }
      }

      .text {
        font-size: 1.125rem;
        font-weight: 500;
      }
    }

    .price {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.625rem;
      color: #d84c44;
      font-size: 1.25rem;
    }

    .normal-price {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
    }
  }

  .buy-count {
    width: 22.1875rem;
    background: #fff;
    border-radius: 0.625rem;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 1.25rem;
    margin-top: 0.625rem;

    .num {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .change {
        display: flex;
        justify-content: center;
        align-items: center;

        input {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          border: none;
          outline: none;
          width: 1.875rem;
          height: 1.875rem;
        }
      }
    }

    .btn {
      width: 19.6875rem;
      height: 2.25rem;
      background: #fff8ef;
      border-radius: 0.375rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #89683d;
      margin-top: 1.875rem;
    }
  }

  .use-tips {
    width: 22.1875rem;
    background: #fff;
    border-radius: 0.625rem;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 1.25rem;
    margin-top: 0.625rem;
    text-align: left;
    margin-bottom: 0.625rem;

    .tips-content {
      margin-top: 1.25rem;
      color: #666;
      font-size: 0.75rem;
    }
  }

  .fixed-btn {
    width: 23.4375rem;
    height: 3.75rem;
    background: #fff;
    display: flex;
    position: fixed;
    bottom: 0;

    .fixed-left {
      width: 8.625rem;
      box-sizing: border-box;
      height: 3.75rem;
      align-items: center;
      display: flex;

      .toIndex {
        width: 50%;
        display: flex;
        flex-direction: column;
        color: #666;
      }

      .toOrder {
        width: 50%;
        display: flex;
        flex-direction: column;
        color: #666;
      }
    }

    .fixed-right {
      width: 14.8125rem;
      box-sizing: border-box;
      height: 3.75rem;
      background: #e9c69a;
      font-size: 1.125rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
