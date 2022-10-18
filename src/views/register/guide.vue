<template>
  <div id="register-guide">
    <div style="position: relative;">
      <c-title :hide="false" text=""></c-title>
      <div class="image">
        <img v-if="banner_url" :src="banner_url" alt="">
        <img v-else src="../../assets/images/share_bg1@2x.png" alt="">
      </div>
      <div class="text">
        <div v-if="type==2" style="line-height: 3rem; font-size: 2rem; color: #f15353; margin-top: 2rem;">
          注册成功
        </div>
        <van-button v-if="app_url" class="downApp" size="large" color="#ef4f4f" type="danger" round @click.native="jumpDown">下载APP
        </van-button>
        <div class="tip" v-if="type==1 || type==0">
          您已注册，请下载APP
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import guide from "./guide_controller";

export default guide;
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  #register-guide {
    background: #fff;
    min-height: 100vh;

    .image {
      width: 100%;
      height: 22rem;
      // border-bottom-left-radius: 7rem;
      // border-bottom-right-radius: 7rem;
      img {
        width: 100%;
        height: 100%;
        // border-bottom-left-radius: 7rem;
        // border-bottom-right-radius: 7rem;
      }
    }

    .text {
      margin: 0 auto;
      width: 85%;

      .tip {
        color: #999;
        line-height: 2rem;
        height: 2rem;
      }

      .downApp {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
      }
    }
  }
</style>
