<template>
    <div id="qr_coupon" v-if="coupon.name&&status">
        <c-title :hide="false" text='优惠券二维码'></c-title>
        <div class="color-block set-pc-styleLeft"></div>
        <div class="content">
            <div class="info">
                <div class="avator">
                    <img :src="shop_logo">
                </div>
                <div class="title">{{coupon.name}}</div>
                <div class="money" v-if="coupon.deduct"><span>{{$i18n.t('money')}}</span><span>{{coupon.deduct}}</span></div>
                <div class="manzu" v-if="coupon.deduct_status">{{coupon.deduct_status}}</div>
                <div class="time">
                    <div class="text">
                        <span>有效期</span>
                        <span>{{timestampToTime(coupon.start)}}-{{timestampToTime(coupon.end)}}</span>
                    </div>
                </div>
                <div class="btn" v-if="coupon.coupon_status==1" style="background-color: #d4d4d4;">{{coupon.status_name}}</div>
                <div class="btn" v-if="coupon.coupon_status==0" @click="toDetail">{{coupon.status_name}}</div>
            </div>
            <div class="goods">
                <div class="tit">{{coupon.usageLimit}}</div>
                <div class="good">
                    <div class="image" @click="toDetail">
                        <img :src="goods.thumb">
                    </div>
                    <div class="right">
                        <div class="word">{{goods.title}}</div>
                        <div class="cash">{{$i18n.t('money')}}{{goods.price}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import qr_coupon_controller from "./qr_coupon_controller";
export default qr_coupon_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#qr_coupon {
  height: 100vh;
  background-color: #fff;

  .color-block {
    height: 7.0625rem;
    background-color: #fd4e4b;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .content {
    background-color: #fff;

    .info {
      background-color: #fff;
      box-shadow:
        0 0.25rem 0.5rem 0
        rgba(0, 0, 0, 0.05);
      border-radius: 0.9375rem;
      margin: 0 0.75rem;
      margin-top: 3.5625rem;
      z-index: 9999;
      position: relative;
      text-align: center;
      padding-bottom: 2rem;

      .avator {
        width: 4rem;
        height: 4rem;
        border: solid 0.1875rem #fff;
        border-radius: 50%;
        box-sizing: border-box;
        transform: translateY(-50%);
        margin: 0 auto;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .title {
        font-size: 16px;
        color: #666;
      }

      .money {
        font-size: 16px;
        color: #fd4e4b;
        margin-top: 1.625rem;

        span:last-child {
          font-size: 32px;
        }
      }

      .manzu {
        margin-top: 1rem;
        margin-bottom: 2.25rem;
      }

      .time {
        padding-top: 1.25rem;
        border-top: solid 1px #ededed;

        .text {
          padding: 0 0.75rem;
          display: flex;
          justify-content: space-between;
        }
      }

      .btn {
        width: 14.9375rem;
        height: 2.75rem;
        background-color: #fd4e4b;
        box-shadow:
          0 0 0.5rem 0
          rgba(253, 78, 75, 0.1);
        border-radius: 1.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin: 0 auto;
        margin-top: 2.375rem;
      }
    }

    .goods {
      margin-top: 1.875rem;
      padding: 0 0.75rem;

      .tit {
        margin-bottom: 1rem;
        font-size: 16px;
        text-align: left;
      }

      .good {
        display: flex;

        .image {
          width: 6.8125rem;
          height: 6.8125rem;
          border-radius: 0.3125rem;
          margin-right: 0.75rem;

          img {
            width: 100%;
            height: 100%;
            border-radius: 0.3125rem;
          }
        }

        .right {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          text-align: left;

          .word {
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .cash {
            color: #ff2c29;
          }
        }
      }
    }
  }
}
</style>
