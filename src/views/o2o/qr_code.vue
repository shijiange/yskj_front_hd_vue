<template>
  <div>
    <c-title :hide="false" :text="'门店二维码'">
    </c-title>
    <div class="content">
      <div class="qr_img">
        <img :src="qr_code" alt="二维码">
      </div>
      <p>扫描门店二维码，跳转至门店页面</p>
    </div>
  </div>
</template>

<script>
import qr_code_controller from "./qr_code_controller";

export default qr_code_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .content {
    margin-top: 5rem;

    .qr_img {
      margin: 0 auto;
      width: 15rem;
      height: 15rem;
      background: #f2f2f2;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    p {
      font-size: 16px;
      margin-top: 2rem;
    }
  }
</style>