<template v-title="核销订单">
  <div id="goodsinfo">
    <c-title :hide="false" text='核销订单'></c-title>

    <div class="qrcode" v-show="showQrcode">
      <img :src="qrcode" style="width: 100%;">
      <div style="height: 1.875rem;">请核销员扫码</div>
    </div>

    <!-- 自定义信息 -->
    <div style="width: 90%; margin: 0 auto;">
      <customMessage :listMap="customForm"></customMessage>
    </div>
  </div>
</template>
<script>
import order_verification_controller from "./order_verification_controller";

export default order_verification_controller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .qrcode {
    width: 100%;
    margin: 0 auto;
  }

  #goodsinfo {
    .addr {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      background: #fff;
      border-bottom: #d8c7c7 0.0625rem solid;
      margin-bottom: 0.625rem;
      padding-top: 0.9375rem;
      padding-bottom: 0.9375rem;

      i {
        flex: 1;
        font-size: 1.25rem;
      }

      p {
        flex: 9;
        text-align: left;

        span {
          color: #858585;
          font-size: 12px;
        }
      }
    }

    .detail_good {
      background: #fff;
      padding: 0 0.625rem;
      overflow: hidden;

      .content {
        text-align: left;
        background: #efeded;
        padding: 0.625rem;
        color: #8c6700;
      }

      a {
        color: #000;
      }

      h3 {
        text-align: left;
        margin: 0.5625rem 0;

        i {
          font-size: 1.25rem;
          padding-right: 0.3125rem;
        }
      }

      .goods {
        display: flex;
        align-items: stretch;
        flex-flow: row wrap;
        background: #efeded;
        padding: 0.3125rem;
        margin-bottom: 0.625rem;

        .img {
          flex: 3;

          img {
            width: 100%;
          }
        }

        .inner {
          flex: 5;
          padding: 0 0.3125rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .name {
          flex: 5;
          text-align: left;
        }

        .price {
          flex: 2;
          align-items: center;
        }

        .option {
          color: #888;
          font-size: 12px;
          flex: 1;
        }
      }
    }

    .tbs {
      display: flex;
      align-items: center;
      background: #fff;
      flex-flow: row wrap;
      padding: 0.625rem;
      line-height: 1.5rem;

      .left {
        text-align: left;
        flex: 40%;
        color: #858585;
      }

      .right {
        text-align: right;
        flex: 60%;
      }
    }

    .detail_pay {
      height: 3rem;
      width: 100%;
      background: #fff;
      padding: 0 2%;
      margin-top: 1.875rem;
      border-top: 0.0625rem solid #eaeaea;
      position: fixed;
      bottom: 0;
      box-sizing: border-box;

      .order_delete {
        height: 1.5rem;
        width: auto;
        margin-left: 0.3125rem;
        background: #fff;
        padding: 0 0.625rem;
        margin-top: 0.625rem;
        border-radius: 0.3125rem;
        color: #5f6e8b;
        line-height: 1.5rem;
        float: right;
        border: 0.0625rem solid #5f6e8b;
      }
    }
  }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  .mint-header {
    background: none;
    color: #666;
  }

  .is-fixed .mint-header-title {
    font-weight: bold;
  }

  .mint-header.is-fixed {
    border-bottom: 0.0625rem solid #e8e8e8;
    background: #fff;
    z-index: 99;
  }

  .is-right a {
    font-size: 12px;
  }
</style>