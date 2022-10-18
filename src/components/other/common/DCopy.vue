<template>
  <div class="c-copy" @click="copyContent">
    <slot></slot>
    <input type="text" class="c-copy-input" ref="inputEl" :value="content" />
  </div>
</template>

<script>
export default {
  props: {
    content: String,
    copy: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    copyContent() {
      this.$refs["inputEl"].select();
      document.execCommand("copy");
      this.$emit("copySuccess", this.content);
      this.$refs["inputEl"].blur();
    }
  },
  watch: {
    copy(newV) {
      if (newV) {
        this.$refs["inputEl"].select();
        document.execCommand("copy");
        this.$emit("copySuccess", this.content);
        this.$refs["inputEl"].blur();
      }
    }
  }
};
</script>

<style scoped>
.c-copy {
  position: relative;
}

.c-copy-input {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  border: none;
  background: none;
  color: transparent;
}
</style>