<template>
  <div class="component-wrapper u000242" :style="wrapper_style">
    <template v-if="hasLoaded">
      <iframe :src="video_url.video_url" frameborder="0" allowfullscreen height="200" width="100%" v-if="!isVideo"> </iframe>

      <video
        v-if="isVideo"
        :poster="video_url.isShowPoster == '0' ? '' : video_url.poster"
        :src="video_url.video_url"
        preload="true"
        controlslist="nodownload"
        width="100%"
        controls
        ref="video"
        webkit-playsinline="true"
        playsinline="true"
        x5-playsinline="true"
        x-webkit-airplay="true"
        x5-video-ignore-metadata="true"
        @play="onPlay"
      >
        <source :src="video_url.video_url" />
      </video>
    </template>
    <div v-if="!hasLoaded" style="height: 80vh;"></div>
  </div>
</template>

<script>
export default {
  props: ["id", "datas"],
  data() {
    return {
      isVideo: true,
      hasLoaded: false //记录之前是否已经在可视区内渲染显示过
    };
  },
  computed: {
    /** 样式 */
    wrapper_style() {
      const { padding_top, padding_bottom, padding_left, padding_right, preview_color } = this.datas;
      return `
                line-height: 0;
                width: 100%;
                position: relative;
                height:auto;
                padding-top: ${padding_top}px;
                padding-bottom: ${padding_bottom}px;
                padding-left: ${padding_left}px;
                padding-right: ${padding_right}px;
                background-color: ${preview_color};
                background-size: 100% 100%;
                background-position: center;
                background-repeat: no-repeat;
            `;
    },

    video_url() {
      return this.datas.video_url || {};
    }
  },
  mounted() {
    this.initVideoScrollFn();
    this.isVideo = true;
    this.isMp4(this.datas.video_url.video_url);
  },
  methods: {
    //判断是否MP4
    isMp4(src) {
      if (!(src.endsWith(".mp4") || src.endsWith(".mov") || src.endsWith(".avi"))) {
        this.isVideo = false;
      }
    },
    showComponent() {
      // 进入可视区,记录已渲染
      this.hasLoaded = true;
    },
    pauseFn() {
      if (this.$refs.video) this.$refs.video.pause();
      // if (!this.hasLoaded) {
      //   //是否之前已经在可视区内渲染显示过
      //   //没有则先不渲染，已渲染过的就只做暂停视频处理，防止v-if隐藏出现页面抖动
      //   this.hasLoaded = true;
      // }
    },
    onPlay() {
      // 开始播放
      this.$emit("refresh", { type: "video", id: this.id });
    },
    initVideoScrollFn(){
      this.$emit("refresh", { type: "initVideo"});
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped></style>
