<template>
  <div id="qr_coupon">
    <c-title :hide="false" text="优惠券"></c-title>
    <div class="color-block"></div>
    <div class="content">
      <div class="info">
        <div class="avator">
          <img :src="icon" />
        </div>
        <div class="title">{{ datas.name }}</div>
        <div class="money" v-if="datas.coupon_method == 1">
          <span>{{ $i18n.t('money') }}</span
          ><span>{{ datas.deduct }}</span>
        </div>
        <div class="money" v-if="datas.coupon_method == 2">
          <span>{{ datas.discount }}折</span>
        </div>
        <div class="manzu">满{{ datas.enough }}可用</div>
        <div class="time">
          <div class="text">
            <span>有效期</span>
            <span>{{ time_start }} - {{ time_end }}</span>
          </div>
        </div>
        <div @click="selectedcoupon" v-if="datas.api_availability == 3" class="btn" style="background-color: #d4d4d4;">
          立即领取
        </div>
        <div v-else class="btn" @click="selectedcoupon">
          立即领取
        </div>
        <div class="btn btn-copy" @click.stop v-clipboard:copy="copy_value" v-clipboard:success="onCopy">
          复制文案
        </div>
      </div>
      <div class="goods" v-if="goods.length > 0">
        <div class="tit">适用商品</div>
        <div class="good" v-for="item in goods" :key="item.id" @click="toDetail(item.id)">
          <div class="image">
            <img :src="item.thumb" />
          </div>
          <div class="right">
            <div class="word">{{ item.title }}</div>
            <div class="discount-one-b">
              <div class="now-price">现价：{{ $i18n.t('money') }}{{ item.price }}</div>
              <div class="discount-price">券后价：{{ $i18n.t('money') }}{{ item.deduct_price.toFixed(2) }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="explain" v-if="datas.description">
        <div class="title">领券说明</div>
        <div class="detail" v-html="datas.description"></div>
      </div>
    </div>
  </div>
</template>

<script>
import qr_coupon_controller from './coupon_independent_share_controller';
export default qr_coupon_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#qr_coupon {
  height: 100vh;
  background-color: #fff;

  .color-block {
    height: 9.0625rem;
    background-color: #fd4e4b;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .content {
    background-color: #fff;

    .info {
      background-color: #fff;
      box-shadow: 0 0.25rem 0.5rem 0 rgba(0, 0, 0, 0.05);
      border-radius: 0.9375rem;
      margin: 0 0.75rem;
      margin-top: 3.5625rem;
      z-index: 2;
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
        transform: translateY(-50%);
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
        box-shadow: 0 0 0.5rem 0 rgba(253, 78, 75, 0.1);
        border-radius: 1.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin: 0 auto;
        margin-top: 2.375rem;
      }

      .btn-copy {
        margin-top: 1rem;
        background-color: #fff;
        border: #fd4e4b 1px solid;
        color: #fd4e4b;
      }
    }

    .goods {
      margin-top: 1.875rem;
      margin-bottom: 1rem;
      padding: 0 0.75rem;

      .tit {
        margin-bottom: 1rem;
        font-size: 16px;
        text-align: left;
        font-weight: 600;
      }

      .good {
        display: flex;
        margin-bottom: 0.5rem;

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

          .discount-one-b {
            .now-price {
              font-size: 0.75rem;
              text-decoration: line-through;
              vertical-align: middle;
              color: #888;
            }

            .discount-price {
              font-size: 0.875rem;
              color: #ff2c29;
            }
          }
        }
      }
    }

    .explain {
      padding: 0 0.75rem;
      padding-bottom: 1rem;

      .title {
        margin-bottom: 1rem;
        font-size: 16px;
        text-align: left;
        font-weight: 600;
      }

      .detail {
        text-align: left;

        img {
          width: 100%;
        }
      }
    }
  }
}

.pcStyle .color-block {
  width: 375px !important;
}
</style>
