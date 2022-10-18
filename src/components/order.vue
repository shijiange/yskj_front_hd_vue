<template>
  <div id="goodsinfo">
    <!--{{datas}}-->
    <div :v-model="datas">{{datas.order.price}}</div>
  </div>
</template>


<script>
import order from "./order_controller";

export default order;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #goodsinfo {
    .addr {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      background: #fff;
      border-bottom: #d8c7c7 0.0625rem solid;
      margin-bottom: 0.625rem;

      i {
        flex: 1;
        font-size: 1.25rem;
        color: #888;
      }

      p {
        flex: 6;
        text-align: justify;
        font-weight: bold;
        line-height: 1.5rem;
        padding-right: 1rem;
        color: #333;

        span {
          font-size: 14px;
          font-weight: normal;
          color: #666;
        }
      }
    }

    .detail_good {
      background: #fff;
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
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-flow: row wrap;
        flex-flow: row wrap;
        padding: 0.625rem;
        background: #fafafa;

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
          color: #333;
        }

        .price {
          flex: 2;
          align-items: center;
          text-align: right;
          color: #333;
        }

        .option {
          color: #888;
          font-size: 12px;
          flex: 1;
        }
      }
    }

    .nums {
      background: #fff;
      text-align: right;
      margin: 0;
      padding-right: 0.625rem;
      line-height: 2rem;
    }

    .tbs {
      display: flex;
      align-items: center;
      background: #fff;
      flex-flow: row wrap;
      padding: 0.625rem;
      line-height: 1.5rem;
      border-top: #e8e8e8 solid 0.0625rem;
      border-bottom: #e8e8e8 solid 0.0625rem;
      margin-top: 0.625rem;

      .list {
        width: 100%;
        padding-bottom: 0.625rem;
      }

      .list:nth-last-child(1) {
        padding-bottom: 0;
      }

      .left {
        text-align: left;
        float: left;
        color: #858585;
      }

      .right {
        text-align: right;
        float: right;
      }

      p {
        text-align: left;
        margin: 0;
        padding-right: 0.625rem;
        line-height: 2rem;
        width: 100%;

        span {
          color: #858585;
          font-size: 12px;
          float: right;
        }
      }
    }

    .detail_pay {
      text-align: left;
      height: 3rem;
      width: 100%;
      background: #fff;
      padding: 0 0 0 2%;
      margin-top: 1.875rem;
      border-top: 0.0625rem solid #eaeaea;
      position: fixed;
      bottom: 0;
      box-sizing: border-box;
      line-height: 3rem;

      .order_delete {
        height: 3rem;
        width: auto;
        background: #f15353;
        padding: 0 0.9375rem;
        color: #fff;
        line-height: 3rem;
        float: right;
        border: 0.0625rem solid #f15353;
      }
    }

    span {
      color: #f15353;
      font-size: 18px;
    }
  }
</style>