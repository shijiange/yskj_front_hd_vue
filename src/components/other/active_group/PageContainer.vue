<template>
    <!-- //! 模块数组，请尽量不要用在其它模块，如其它模块也需使用请提取为全局组件，并且去掉Scoped前缀 -->
  <div class="page-container" :style="{ '--page-main-color':themeColor||'#fec400' }">
    <img class="page-background-image" src="@/assets/images/deposit_group/deposit_group_default_bgimg.png" />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    themeColor: {
      type: String,
      default: "#fec400"
    }
  }
};
</script>

<style scoped>
.page-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding-bottom: 4rem;
  background-color: var(--page-main-color);
}

.page-background-image {
  position: absolute;
  left: 0;
  top: 40px;
  z-index: 0;
  width: 100%;
  pointer-events: none;
}
</style>