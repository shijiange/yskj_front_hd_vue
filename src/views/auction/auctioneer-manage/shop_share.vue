<template>
  <div id="shop_share" ref="shop_share">
    <c-title :hide="false" text="店铺分享海报"></c-title>
    <div class="content">
      <div class="title">
        分享图片
      </div>
      <div class="upload">
          <van-uploader :after-read="afterRead" />
      </div>
      <div class="btn">
        确定
      </div>
    </div>
  </div>
</template>

<script>
import shop_share_controller from "./shop_share_controller";

export default shop_share_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#shop_share {
  background-color: #fff;
  height: 100vh;

  .content {
    padding: 0 1.25rem;
    padding-top: 0.875rem;
    background-color: #fff;

    .title {
      text-align: left;
      color: #000;
    }

    .upload {
      padding-left: 0.25rem;
      margin-top: 1.125rem;
      text-align: left;
    }

    .btn {
      width: 18.4375rem;
      height: 2.625rem;
      background-color: #ff2c29;
      border-radius: 1.3125rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #fff;
      margin: 0 auto;
      margin-top: 5rem;
    }
  }
}
</style>
