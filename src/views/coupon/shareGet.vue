<template>
  <div id="coupon_share_code">
    <c-title :hide="false" text="优惠券分享"></c-title>
    <div class="box">
      <div class="shareBox"></div>
      <div class="shareBox_two"></div>
      <div class="centenBox">
        <div class="image">
          <img :src="item.logo" alt />
        </div>
        <div class="couponName" :style="{ fontSize: fontsize }">{{ item.name }}</div>
        <div class="money">
          <!-- <span style="font-size: 2.12rem;">{{$i18n.t('money')}}</span> -->
          <span :style="{ fontSize: item.discount.length >= 6 ? '2.24rem' : '4.24rem' }">{{ item.discount }}</span>
        </div>
        <span style="margin-top: 2rem; font-size: 1.18rem; color: #fff; line-height: 1.09rem;">满{{ item.enough }}可用</span>
        <div class="timeMin">
          <div style="margin-bottom: 0.66rem;">有效期：{{ item.start }}-{{ item.end }}</div>
          <div>券张数：{{ item.num }}张</div>
        </div>
      </div>
      <div class="getCoupon" @click="tapGet">立即领取</div>
    </div>
    <div class="play-video" v-if="showShare" style="z-index: 9999;" @click="close">
      <img src="../../assets/images/share_bg.png" alt />
    </div>
    <!-- 领取成功图片 -->
    <van-popup v-model="getSucceed" round class="newcomerAward_popup" :style="{ height: '20rem' }">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/coupons_successbg@2x.png" alt="" style="width: 15.6rem; height: 18rem;" />
      <div class="getsucceed_text">
        <div class="lines" @click="goMyCoupon">我的优惠券</div>
        <div @click="goConponCenter">领券中心</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import couponcontroller from "./shareGet_controller.js";

export default couponcontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.newcomerAward_popup {
  background-color: transparent;
}

.getsucceed_text {
  position: absolute;
  bottom: 3rem;
  left: 0;
  width: 100%;
  color: #000;
  display: flex;
  justify-content: center;

  .lines {
    border-right: 1px solid #000;
  }

  div {
    font-size: 12px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

.box {
  height: 100vh;
  position: relative;
  background: #fff;
}

.play-video {
  position: absolute;
  z-index: 9;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
}

.shareBoxBtn {
  position: absolute;
  top: 33rem;
  left: 6.19rem;
  display: flex;

  .share {
    width: 3.84rem;
    height: 3.84rem;
    background-color: #fecf41;
    border-radius: 50%;
    text-align: center;
    line-height: 3.84rem;
    margin-right: 3.97rem;

    i {
      font-size: 2rem;
      color: #fff;
    }
  }

  .poster {
    width: 3.84rem;
    height: 3.84rem;
    background-color: #51c6e3;
    border-radius: 50%;
    text-align: center;
    line-height: 3.84rem;
    margin-right: 3.97rem;

    i {
      font-size: 2rem;
      color: #fff;
    }
  }
}

.getCoupon {
  position: absolute;
  top: 33.53rem;
  left: 7.19rem;
  width: 9.06rem;
  height: 2.88rem;
  background-color: #ff7070;
  box-shadow: -0.01rem 0.09rem 0.33rem 0.01rem rgba(81, 81, 81, 0.45);
  border-radius: 0.43rem;
  color: #fff;
  font-size: 1.52rem;
  line-height: 2.88rem;
  text-align: center;
  z-index: 3;
}

.tapGet {
  background: #e6e6;
}

.centenBox {
  position: absolute;
  top: 5.56rem;
  left: 2.75rem;
  width: 18.13rem;
  height: 24.66rem;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/couponssharebg@2x.png");
  background-size: cover;
  box-shadow: -0.01rem 0.16rem 0.61rem 0.02rem rgba(81, 81, 81, 0.45);
  border-radius: 0.65rem;
  z-index: 2000;
  display: flex;
  align-items: center;
  flex-direction: column;

  .image {
    width: 4.06rem;
    height: 4.06rem;
    border-radius: 50%;
    margin: 1.56rem 0 1.25rem 0;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .couponName {
    // width: 10.69rem;
    height: 2.09rem;
    background: #fff;
    color: #ee563e;
    font-size: 1.41rem;
    padding: 0 0.5rem;
    line-height: 2.09rem;
  }

  .money {
    margin-top: 1.88rem;
    color: #fff;
    line-height: 3.28rem;
  }

  .timeMin {
    padding: 0 4.72rem 0 1.31rem;
    text-align: left;
    font-size: 0.76rem;
    line-height: 0.84rem;
    margin-top: 3.04rem;
  }
}

.shareBox {
  width: 100%;
  height: 40vh;
  background-color: #ff7070;
}

.shareBox_two::after {
  width: 140%;
  height: 100%;
  position: absolute;
  left: -20%;
  top: 0;
  z-index: -1;
  content: "";
  border-radius: 50% 50% 0 0;
  background: #fff;
}

.shareBox_two {
  // width: 100%;
  // height: 22.09rem;
  // background: #ffffff;
  position: relative;
  top: -2rem;
  width: 100%;
  height: 30vh;
  text-align: center;
  z-index: 2;
  overflow: hidden;
}
</style>
