<template>
  <van-image :src="item.content" @load="imageLoaded" @click="previewImage" width="100%" />
</template>
<script>
import { Image as VanImage, ImagePreview as VanImagePreview } from "vant";
export default {
  props: ["item"],
  methods: {
    imageLoaded() {
      this.$emit("loaded");
    },
    previewImage() {
      VanImagePreview([this.item.content]);
    }
  },
  components: {
    VanImage
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.pic-txt {
  img {
    width: 100%;
  }
}
</style>