<template>
  <div id="coupon_share_code">
    <c-title :hide="false" text="优惠券分享"></c-title>
    <div class="box">
      <div class="shareBox"></div>
      <div class="shareBox_two"></div>
      <div class="centenBox">
        <div class="image">
          <img :src="logo" alt />
        </div>
        <div class="couponName" :style="{ fontSize: fontsize }">{{ is_belongs_to_coupon.name }}</div>
        <div class="money">
          <template v-if="info.belongs_to_coupon.coupon_method == 1">
            <span style="font-size: 2.12rem;">{{ $i18n.t("money") }}</span>
            <span style="font-size: 4.24rem;">{{ info.belongs_to_coupon.deduct }}</span>
          </template>
          <template v-if="is_belongs_to_coupon.coupon_method == 2">
            <span style="font-size: 4.24rem;">{{ is_belongs_to_coupon.discount }}折</span>
          </template>
        </div>
        <span v-if="is_belongs_to_coupon.coupon_method == 1" style="margin-top: 2rem; font-size: 1.18rem; color: #fff; line-height: 1.09rem;">满{{ is_belongs_to_coupon.enough }}可用</span>
        <span v-if="is_belongs_to_coupon.coupon_method == 2" style="margin-top: 2rem; font-size: 1.18rem; color: #fff; line-height: 1.09rem;">满{{ is_belongs_to_coupon.enough }}立享</span>
        <div class="timeMin">
          <div style="margin-bottom: 0.66rem;">有效期：{{ info.time_start }}-{{ info.time_end }}</div>
          <div>券张数：{{ info.num }}张</div>
        </div>
      </div>
      <div class="shareBoxBtn">
        <div class="share" @click="shareVideo">
          <i class="iconfont icon-fenxiang"></i>
        </div>
        <div class="poster" @click="getPoster">
          <i class="iconfont icon-jk_haibao"></i>
        </div>
      </div>
    </div>
    <div class="play-video" v-if="showShare" style="z-index: 9999;" @click="close">
      <img src="../../assets/images/share_bg.png" alt />
    </div>
    <div class="c_imag">
      <div id="img_box" v-show="loadingImg">
        <div class="nameBox">
          <img :src="avatar" alt="" />
        </div>
        <div class="userName">{{ posterName }}</div>
        <div class="recommend">向你分享了优惠券</div>
        <div class="codeBox">
          <img :src="qr_code" alt="" />
        </div>
      </div>
    </div>
    <van-popup v-model="posterShow" round class="newcomerAward_popup" :style="{ height: '25.44rem', backgroundColor: 'transparent' }">
      <img style="width: 18.13rem; height: 25.44rem;" id="thecanvas" v-show="!loadingImg" />
    </van-popup>
  </div>
</template>

<script>
import couponcontroller from "./shareShow_controller.js";

export default couponcontroller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.newcomerAward_popup {
  background-color: transparent;
}

#coupon_share_code {
  height: 120vh;
  width: 100%;
  background-color: #fff;
}

.c_imag {
  position: absolute;
  left: -100rem;
  top: 0;
}

#img_box {
  width: 18.13rem;
  height: 25.44rem;
  box-shadow: -0.01rem 0.16rem 0.61rem 0.02rem rgba(81, 81, 81, 0.45);
  border-radius: 0.65rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  background-image: url("../../assets/images/coupons-beijing@2x.png.png");

  .nameBox {
    position: absolute;
    bottom: 1.69rem;
    left: 1.34rem;
    width: 2.81rem;
    height: 2.81rem;
    background-color: #fff;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .codeBox {
    width: 4.91rem;
    height: 4.94rem;
    position: absolute;
    bottom: 1.63rem;
    right: 1.34rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .userName {
    position: absolute;
    bottom: 3.22rem;
    left: 4.84rem;
    color: #fff;
    font-size: 0.91rem;
  }

  .recommend {
    position: absolute;
    left: 4.91rem;
    bottom: 2.03rem;
    color: #fff;
    font-size: 0.72rem;
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
  top: 32rem;
  left: 6.19rem;
  display: flex;
  z-index: 99;

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
  z-index: 10;
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
    // font-size: 1.41rem;
    padding: 0 0.5rem;
    line-height: 2.09rem;
  }

  .money {
    margin-top: 1.88rem;
    color: #fff;
    line-height: 3.28rem;
  }

  .timeMin {
    padding: 0 1.31rem 0 1.31rem;
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
