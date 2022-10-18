<template>
  <van-button class="golden-button" block :style="{ width, height, fontSize }" @click="clickButton">
    <slot />
  </van-button>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: "2.2rem"
    },
    width: {
      type: String,
      default: "10rem"
    },
    fontSize: {
      type: String,
      default: "0.875rem"
    }
  },
  methods: {
    clickButton() {
      this.$emit("click");
    }
  }
};
</script>

<style scoped>
.golden-button {
  color: #a47f4b;
  font-weight: bold;
  border-radius: 1.22rem;
  background-image: linear-gradient(0deg, #fdfa93 0%, #fff6c1 100%), linear-gradient(#fff, #fff);
  background-blend-mode: normal, normal;
  box-shadow: 0 0.38rem 0 #fbb039;
  border: none;
}
</style>