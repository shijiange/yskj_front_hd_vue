<template>
  <div id="extend_explain">
    <c-title :hide="false"
             text="使用说明"> </c-title>
    <div class="content">
      <div v-html="synopsis" style="text-align: left;"></div>
    </div>
  </div>
</template>
<script>
import extend_explain_controller from './extend_explain_controller';

export default extend_explain_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#extend_explain {
  background-color: #fff;
  height: 100vh;

  .content {
    padding: 1rem;
  }
}
</style>
