<template>
  <div id="coupon_share">
    <c-title :hide="false" :text="'分享优惠券'"></c-title>
    <div id="share_content">
        <div class="share_bg">
            <p class="state">支付成功</p>
            <p class="pack_share">【恭喜获得{{coupon_num}}个红包可分享】</p>
            <div class="coupon_bg"> </div>
            <p class="share_friend">快分享给小伙伴看看谁会撞大运</p>
            <div class="share_btn" @click="shareClick">
                <i class="iconfont icon-coupon-share-left"></i>
                <span>立即分享</span>
                <i class="iconfont icon-coupon-share-right"></i>
            </div>
        </div>
    </div>      
    
  </div>
</template>

<script>
import coupon_share_controller from "./coupon_share_controller";

export default coupon_share_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#coupon_share {
  #share_content {
    .share_bg {
      width: 21.5625rem;
      min-height: 30.3125rem;
      margin: 0.9375rem auto;
      background-image: url(../../assets/images/coupon_share_bgimg.png);
      background-size: 21.5625rem 30.3125rem;
      background-repeat: no-repeat;
      padding: 0.625rem 0;

      .state {
        line-height: 3.75rem;
        font-size: 24px;
        color: #f15353;
      }

      .pack_share {
        font-size: 15px;
        font-weight: bold;
      }

      .coupon_bg {
        height: 17.1875rem;
        margin: 0 auto;
        background-image: url(../../assets/images/coupon_share.png);
        background-size: 14.375rem;
        background-position: center;
        background-repeat: no-repeat;
      }

      .share_friend {
        font-size: 15px;
        color: #8c8c8c;
        line-height: 1.875rem;
        margin-bottom: 1.25rem;
      }

      .share_btn {
        margin: 0 auto;
        background: #f15353;
        border: none;
        color: #fff;
        border-radius: 0.375rem;
        width: 15rem;
        height: 2.875rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;

        .icon-coupon-share-left {
          font-size: 1.5rem;
          margin-right: 1.25rem;
        }

        .icon-coupon-share-right {
          font-size: 1.5rem;
          margin-left: 1.25rem;
        }
      }
    }
  }
}
</style>
