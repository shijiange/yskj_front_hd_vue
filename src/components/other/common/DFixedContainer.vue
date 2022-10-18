<template>
  <div class="d-fixed-container">
    <div
      class="fixed-container"
      :class="{
        'd-fixed-pc': fun.getPhoneEnv() == 3
      }"
      :style="{
        position: fixed ? 'fixed' : 'unset',
        top: top,
        left: center ? 0 : left,
        right: center ? 0 : right,
        bottom: bottom,
        width: width,
        height: height,
        zIndex: zIndex,
        margin: center ? '0 auto' : ''
      }"
    >
      <slot />
    </div>
    <div class="fixed-container-placeholder" :style="{ width: width, height: height }" v-if="placeholder"></div>
  </div>
</template>

<script>
export default {
  props: {
    fixed: {
      type: Boolean,
      default: true
    },
    top: String,
    left: String,
    bottom: String,
    right: String,
    width: String,
    height: String,
    zIndex: {
      type: Number,
      default: 1
    },
    center: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.d-fixed-pc {
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 375px !important;
}

.fixed-container-placeholder {
  width: 100%;
}
</style>