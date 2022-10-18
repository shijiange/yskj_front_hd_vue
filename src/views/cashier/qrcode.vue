<template>
  <div id="goodsinfo">
    <van-nav-bar left-arrow :title="storeBalance?'我的二维码':'收款二维码'" fixed @click-left="goto" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" />
    <div style="height: 40px;"></div>
    <!--商品订单-->
    <div class="goods-detail">
      <div class="detail_good">
        <div class="goods">
          <div class="img">
            <img :src="qrcode" />
          </div>
          <div class="warp">
            <div class="inner">
              <div class="name">{{storeBalance?'扫描二维码，跳转至门店页面':'让顾客扫一扫,向我付款'}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--商品订单结束-->
    <div v-if="adShow">
      <!-- 音频播放 -->
      <audio autoplay controls id="yp" style="opacity: 0;">
        <source :src="vedioSrc" type="audio/mpeg" />
      </audio>
    </div>
    <footer v-if="adShow">
      <p style="font-size: 1rem;">语义解析核心技术由科大讯飞提供</p>
    </footer>
  </div>
</template>

<script>
import qrcode_controller from "./qrcode_controller";
export default qrcode_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#goodsinfo {
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
    font-size: 10px;
  }

  .onclast {
    position: relative;
    top: -18.125rem;
  }

  .goods-shop {
    background: #fff;
    line-height: 1.875rem;
    border-bottom: #e8e8e8 solid 0.0625rem;
    margin-top: 0.625rem;

    p {
      text-align: left;
      margin: 0;
      padding: 0 0 0 0.625rem;
      font-size: 12px;
      color: #555;
    }
  }

  .add-info {
    overflow-y: scroll;
    width: 100%;
    background: #fff;
    max-height: 50vh;
    padding-top: 0.625rem;
  }

  .mint-popup-4 {
    width: 100%;

    .sure {
      background: #f15353;
      height: 2.5rem;
      line-height: 2.5rem;
      color: #fff;
      width: 50%;
      border: 0;
      float: left;
    }

    .close {
      background: #eee;
      height: 2.5rem;
      line-height: 2.5rem;
      color: #333;
      width: 50%;
      border: 0;
      float: left;
    }

    .address-plus {
      background: #f15353;
      height: 2.5rem;
      line-height: 2.5rem;
      color: #fff;
      width: 100%;
      border: 0;
    }

    ul {
      overflow-y: scroll;
    }

    li {
      padding: 0.625rem 0;
      display: flex;
      position: relative;

      .liia {
        flex: 9;
        text-align: left;
        padding-left: 1.25rem;

        .name {
          font-size: 18px;
          color: #222;
          line-height: 2rem;
        }

        .address {
          font-size: 12px;
          color: #666;
          line-height: 2rem;
        }
      }

      i {
        flex: 1;
      }
    }
  }

  .addr {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    background: #fff;
    padding: 0.625rem 0;

    i {
      flex: 1;
      font-size: 1.25rem;
      color: #888;
    }

    .el-icon-arrow-right {
      font-size: 14px;
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
        font-size: 20px;
        padding-right: 0.3125rem;
      }
    }

    .goods::after {
      content: "";
      display: block;
      clear: both;
    }

    .goods {
      width: 100%;
      box-sizing: border-box;
      margin-top: 5rem;

      .img {
        /* flex: 1; */
        margin: 0 auto;
        width: 15rem;
        height: 15rem;
        overflow: hidden;
        display: block;
        background: #f2f2f2;

        /* background:blue; */
        img {
          width: 100%;
          border-radius: 0.3125rem;
        }
      }

      .warp {
        width: 100%;
        float: left;
        display: block;
        padding-top: 1.5625rem;

        .inner {
          width: 100%;
          float: left;
          box-sizing: border-box;
          padding: 0 0.3125rem;
          text-align: center;

          .name {
            font-size: 16px;
            text-align: center;
            color: #333;
            margin-bottom: 0.625rem;
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

  .tbs.coupon-list {
    margin-top: 0.625rem;
    margin-bottom: 0.625rem;
  }

  .coupon.list {
    .left font {
      color: #fff;
      background: #f15353;
      font-size: 12px;
      height: 1.25rem;
      padding: 0 0.3125rem;
      border-radius: 0.1875rem;
      margin-left: 0.3125rem;
    }

    .right font span {
      font-size: 12px;
    }

    .right font i {
      font-size: 12px;
      color: #999;
    }
  }

  .tbs {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    flex-flow: row wrap;
    padding: 0.625rem;
    line-height: 1.5rem;
    border-top: #e8e8e8 solid 0.0625rem;
    border-bottom: #e8e8e8 solid 0.0625rem;
    font-size: 12px;

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

      span {
        font-size: 14px;
      }
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

.checkList {
  position: relative;
  top: 1.875rem;
  left: 0.1875rem;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.el-checkbox {
  float: left;
  margin-left: 0.3125rem;
}

.coupon-list-info {
  width: 99.5vw;
}

.coupon_voucher_main {
  position: relative;
  padding-left: 6.375rem;
  height: 5rem;
  margin-left: 2.25rem;
  margin-right: 0.625rem;
  margin-bottom: 0.625rem;

  .coupon_voucher_left {
    position: absolute;
    top: 0;
    left: 0;
    width: 6.375rem;
    height: 100%;
    color: #fff;
    border-radius: 0.25rem 0 0 0.25rem;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #47c1c4;

    .coupon_voucher_amount.type_large {
      margin: 0;
      font-size: 22px;
    }

    .coupon_voucher_amount {
      position: relative;
      font-size: 36px;
      line-height: 1;
    }

    .coupon_voucher_amount::before {
      content: "\00A5";
      font-size: 16px;
      display: inline-block;
      vertical-align: text-top;
      margin-right: 0.1875rem;
      line-height: 1;
    }

    .coupon_voucher_limit {
      font-size: 12px;
      line-height: 1;
      margin-top: 0.9375rem;
      margin-bottom: 0;
    }
  }

  .coupon_voucher_hr {
    position: absolute;
    top: 0;
    left: 6.0625rem;
    width: 0.375rem;
    overflow: hidden;
    height: 100%;
  }

  .coupon_voucher_hr::after {
    box-sizing: border-box;
    position: absolute;
    top: -0.1875rem;
    right: -0.1875rem;
    bottom: 0;
    content: "• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •";
    line-height: 0.625rem;
    width: 0.4375rem;
    color: #f8fbfb;
    font-size: 18px;
    overflow: hidden;
    z-index: 1;
  }

  .coupon_voucher_right {
    box-sizing: border-box;
    padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
    height: 100%;
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: #e5f3f3;
    color: #666;

    .coupon_voucher_range {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 12px;
      text-align: left;
      margin: 0;
      padding: 0;
      vertical-align: baseline;
    }

    .coupon_voucher_period {
      color: #999;
      font-size: 12px;
      position: absolute;
      bottom: 0;
    }
  }
}

.coupon_voucher_gray {
  position: relative;
  padding-left: 6.375rem;
  height: 5rem;
  margin-left: 2.25rem;
  margin-right: 0.625rem;
  margin-bottom: 0.625rem;

  .coupon_voucher_left {
    position: absolute;
    top: 0;
    left: 0;
    width: 6.375rem;
    height: 100%;
    color: #fff;
    border-radius: 0.25rem 0 0 0.25rem;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #ccc;

    .coupon_voucher_amount.type_large {
      margin: 0;
      font-size: 22px;
    }

    .coupon_voucher_amount {
      position: relative;
      font-size: 36px;
      line-height: 1;
    }

    .coupon_voucher_amount::before {
      content: "\00A5";
      font-size: 16px;
      display: inline-block;
      vertical-align: text-top;
      margin-right: 0.1875rem;
      line-height: 1;
    }

    .coupon_voucher_limit {
      font-size: 12px;
      line-height: 1;
      margin-top: 0.9375rem;
      margin-bottom: 0;
    }
  }

  .coupon_voucher_hr {
    position: absolute;
    top: 0;
    left: 6.0625rem;
    width: 0.375rem;
    overflow: hidden;
    height: 100%;
  }

  .coupon_voucher_hr::after {
    box-sizing: border-box;
    position: absolute;
    top: -0.1875rem;
    right: -0.1875rem;
    bottom: 0;
    content: "• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •";
    line-height: 0.625rem;
    width: 0.4375rem;
    color: #f8fbfb;
    font-size: 18px;
    overflow: hidden;
    z-index: 1;
  }

  .coupon_voucher_right {
    box-sizing: border-box;
    padding: 0.9375rem 0.9375rem 0.9375rem 0.625rem;
    height: 100%;
    border-radius: 0 0.25rem 0.25rem 0;
    background-color: #eee;
    color: #666;

    .coupon_voucher_range {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 12px;
      text-align: left;
      margin: 0;
      padding: 0;
      vertical-align: baseline;
    }

    .coupon_voucher_period {
      color: #999;
      font-size: 12px;
      position: absolute;
      bottom: 0;
    }
  }
}

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

.address_addnav {
  width: 100%;
  padding: 0 3% 0 6% !important;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #f15353 !important;
  color: #fff !important;
  text-align: center;
  height: 2.75rem !important;
  line-height: 2.75rem !important;
}

.popup-con {
  width: 100%;
}

#goodsinfo .animation {
  top: 0;

  header {
    display: flex;
  }

  .address_addnav {
    display: block;
  }
}

#AllGood {
  position: fixed;
  top: 200vh;
  height: 100vh;
  overflow: scroll;
  width: 100%;
  background: #fff;
  z-index: 100;
  transition: 0.6s ease-out;
  display: block;

  #appendAddress .mint-field .mint-cell-title {
    text-align: left;
  }

  .address_addnav,
  header {
    display: none;
  }

  .address_addnav span {
    color: #fff;
  }

  .address_addnav i {
    color: #fff;
    font-size: 22px;
    position: absolute;
    top: 50%;
    height: 1.125rem;
    line-height: 1.125rem;
    margin-left: -2.125rem;
    margin-top: -0.5625rem;
  }

  .maleall {
    background: #fff;
    text-align: left;
  }

  #appendAddress .males {
    line-height: 3.125rem;
    display: flex;
    border-top: 0.0625rem solid #d9d9d9;
    margin-left: 0.625rem;
    padding-right: 0.625rem;
    position: relative;

    .address {
      display: inline-block;
      position: relative;
      width: 70%;
      float: right;
      box-sizing: border-box;
      padding-top: 0.5rem;
    }
  }

  .maleall span {
    color: #333;
    font-size: 16px;
    vertical-align: middle;
    width: 6.5625rem;
    -webkit-box-flex: 0;
    -ms-flex: none;
    flex: none;
    display: inline-block;
    line-height: 3.125rem;
  }

  #appendAddress .maleall .males .address {
    position: absolute !important;
    right: 1.25rem !important;
    top: 0;
  }

  .maleall .el-select {
    width: 65%;
    float: right;
    position: relative;
  }

  #address {
    flex: 1;
    line-height: 3.125rem;

    .mint-button--default {
      line-height: 3.125rem;
      text-align: left;
      font-size: 16px;
    }
  }
}

.van-nav-bar,
/deep/.van-nav-bar__content {
  height: 40px;
}

/deep/.van-nav-bar__title {
  font-weight: 700;
  font-size: 14px;
  color: #666;
}

/deep/.van-nav-bar .van-icon {
  color: #666;
}

/deep/.van-nav-bar__left {
  padding: 0 0 0 10px;
}

.pcStyle {
  width: 375px;
  margin: 0 auto;
  left: 50%;
  margin-left: -187.5px;
}
</style>
