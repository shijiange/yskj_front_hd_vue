<template>
  <div id="video-box">
    <div
      style="position: relative; width: 100%; height: auto;"
    >
      <iframe
        :src="video.hrefurl"
        frameborder="0"
        allowfullscreen
        height="200"
        width="100%"
        v-if="!isVideo"
      >
      </iframe>
      <video
        v-if="isVideo"
        :poster="imgurl"
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
      >
        <source :src="video.hrefurl"/>
      </video>
    </div>
  </div>
</template>

<script>
export default {
  props: ["datas"],
  data() {
    return {
      video: {},
      imgurl: "",
      isVideo: false
    };
  },
  mounted() {
    this.video = this.datas.data[0];
    if (this.video.option === "1") {
      this.imgurl = this.video.imgurl;
    } else {
      this.imgurl = "";
    }
    this.isMp4(this.video.hrefurl);
  },
  methods: {
    //判断是否MP4
    isMp4(src) {
      src.endsWith(".mp4") ? this.isVideo = true : this.isVideo = false;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
