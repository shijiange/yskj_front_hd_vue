<template>
  <div id="watch">
    <c-title :hide="false" :text="''"> </c-title>
    <div class="watchBox">
      <div class="posBtn" v-if="!videoTapPlay">
        <i class="iconfont icon-fontclass-bofang" @click.stop="tapPlay"></i>
      </div>
      <video
        id="video1"
        :class="minStyle?'':'video-style'"
        ref="video"
        :src="videoSrc"
        webkit-playsinline="true"
        controlslist="nodownload"
        playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        preload="metadata"
        v-show="videoTapPlay"
      >
        <source :src="videoSrc" type="video/mp4" />
      </video>
      <img :src="fmimg" alt="" v-if="!videoTapPlay" ref="pic" @click.stop="tapPlay"/>
    </div>
  </div>
</template>

<script>
import watch_controller from './watch_controller';
export default watch_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#watch {
  .watchBox {
    display: flex;
    align-items: center;
    height: 100vh;
    width: 100%;
  }

  img {
    width: 100%;
    height: auto;
    vertical-align: middle;
  }

  video {
    width: 100%;
    height: 100%;
  }

  .video-style {
    object-fit: fill;
  }

  .posBtn {
    position: fixed;
    top: 50%;
    left: 48%;
    z-index: 99999;

    i {
      font-size: 3rem;
      color: #999;
    }
  }
}
</style>