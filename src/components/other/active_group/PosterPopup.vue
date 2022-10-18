<template>
  <!-- //! 模块数组，请尽量不要用在其它模块，如其它模块也需使用请提取为全局组件，并且去掉Scoped前缀 -->
  <div>
    <van-popup
      v-model="showPopup"
      :style="{ width }"
      round
      closeable
      @closed="closePopup"
      ref="posterImageEl"
    >
      <van-loading v-show="generating">生成海报中...</van-loading>
      <van-image :src="image" v-show="!generating" class="poster-image"></van-image>
    </van-popup>
    <div class="poster-description" v-show="showPopup&&shareCommission>0">
      <p>长按保存海报，分享到群/朋友圈</p>每成功邀请1位好友购买，可获得
      <span>{{ shareCommission }}</span> 元
    </div>
  </div>
</template>

<script>
import { Image as VanImage } from "vant";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    generating: {
      type: Boolean,
      default: false
    },
    image: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "65.6%"
    },
    shareCommission: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showPopup: false
    };
  },
  methods: {
    closePopup() {
      this.$emit("close");
    }
  },
  watch: {
    show() {
      this.showPopup = this.show;
      this.$emit("open");
    },
    generating(newV) {
      if (newV) {
        this.showPopup = true;
      }
    }
  },
  components: {
    VanImage
  }
};
</script>

<style scoped>
.poster-description {
  position: absolute;
  z-index: 3000;
  bottom: 3rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  color: white;
}

.poster-description span {
  color: #f14e4e;
}
</style>