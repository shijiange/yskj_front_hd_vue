<template>
  <div id="closeSite">
    <div class="head">
      <h1>站点已关闭</h1>
    </div>

    <div class="close_img">
      <i class="iconfont icon-Close"></i>
      <p class="tips">sorry,该站点已关闭</p>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .head {
    width: 100%;
    background: white;
    height: 40px;
    color: #666;

    h1 {
      line-height: 40px;
    }
  }

  .close_img {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;

    i {
      font-size: 10rem;
    }
  }

  .tips {
    margin-top: 1rem;
    font-size: 20px;
  }
</style>
