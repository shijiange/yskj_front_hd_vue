<template>
  <div class="upload-button" @click="$emit('click')">
    <i class="iconfont" :class="[icon]" v-if="!$slots.default"></i>
    <slot />
    <div class="upload-prompt" ><slot name="prompt" /></div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "icon-life-game-plus"
    }
  }
};
</script>

<style scoped>
.upload-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10.64rem;
  height: 14.16rem;
  text-align: left;
  background-color: #fbfbfb;
  border-radius: 0.3rem;
  border: 0.06rem dashed #e5e5e5;
}

.upload-button i {
  font-size: 2.8rem;
  color: #d9d9d9;
}

.upload-button:active {
  filter: brightness(90%);
}

.upload-button:active i {
  filter: brightness(90%);
}

.upload-prompt {
  position: absolute;
  bottom: 0.5rem;
  left: 0.75rem;
  width: calc(100% - 1.25rem);
  font-size: 0.69rem;
  color: #999;
}
</style>