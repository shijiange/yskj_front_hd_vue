<template>
  <div class="send-msg-fail">
    <van-icon name="info" color="#fb4a4a" font-size="12px" />发送失败,请稍后重试。
  </div>
</template>
<script>
export default {
  props: ["item"],
  mounted() {
    this.$emit("loaded");
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.send-msg-fail {
  height: 18px;
  line-height: 18px;
  font-size: 12px;
  padding-top: 6px;
}
</style>