<template>
  <div id="collectionCode">
    <c-title :hide="false" text="收款二维码"></c-title>
    <div class="imgbox">
      <img :src="imgSrc" alt="">
    </div>
  </div>
</template>
<script>
import collectionCode_controller from "./collectionCode_controller";
export default collectionCode_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.imgbox {
  margin: 0 auto;

  img {
    width: 100%;
    height: auto;
  }
}
</style>
