<template>
  <div id="service">
    <div class="service" @click="openWin">
      <div>客服</div>
    </div>
    <van-popup v-model="show">
      <div class="mobile">
        <div class="close">
          <i @click="closeWin" class="iconfont icon-close11"> </i>
        </div>
        <div class="number" v-if="service_phone">
          咨询电话：{{service_phone}}
        </div>
        <div class="img" v-if="service_qr_code_src">
          <img :src="service_qr_code_src || emptyImage" alt="" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import service_controller from './service_controller';

export default service_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);
$text-color: #202020;

#service {
  .service {
    position: fixed;
    right: 1.05rem;
    bottom: 5.75rem;
    width: 2.1875rem;
    height: 2.1875rem;
    line-height: 2.1875rem;
    font-size: 12px;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    background: #f15353;
  }

  .van-popup--center {
    border-radius: 0.625rem;

    .mobile {
      width: 14.34rem;
      height: 13.875rem;
      border-radius: 0.625rem;
      padding: 1rem;

      .close {
        // padding-top:1rem;
        text-align: right;
      }

      .number {
        text-align: center;
        padding-top: 0.5rem;
        color: $text-color;
      }

      .img {
        text-align: center;
        margin-top: 1.75rem;

        img {
          width: 6.5625rem;
          height: 6.5625rem;
        }
      }
    }
  }
}

.notice-swipe {
  height: 1.125rem;
  line-height: 1.125rem;
}

.pcStyle #service .service {
  left: 50%;
  margin-left: 130px;
}
</style>
