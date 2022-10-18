<template>
  <button
    class="circle-button"
    :class="{ 'circle-button-border':border,'circle-button-diabled':disabled }"
    @click.stop="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    border: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit("click");
    }
  }
};
</script>

<style scoped>
.circle-button {
  padding: 0.3125rem;
  min-width: 4.0625rem;
  color: #fff;
  font-size: 0.81rem;
  background-color: #3175fe;
  box-sizing: border-box;
  border: none;
  border-radius: 1.5rem;
}

.circle-button-diabled {
  background-color: #a6a6a6;
}

.circle-button-border {
  color: #3175fe;
  background-color: transparent;
  border: 1px solid #3175fe;
}

.circle-button-border.circle-button-diabled {
  color: #a6a6a6;
  border-color: #a6a6a6;
  background-color: transparent;
}
</style>