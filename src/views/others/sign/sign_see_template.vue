<template>
  <div class="page" id="signLunch">
    <c-title text="发起签署"></c-title>

    <div class="name">芸众商城插件合同标准版</div>

    <div class="hr"></div>

    <div class="images">
        <van-swipe class="my-swipe" :show-indicators="false" :loop="false" @change="onChangeSwipeIndex">
            <van-swipe-item v-for="item in contract_template_img_data" :key="item.page">
                <img :src="item.imgUrl" />
            </van-swipe-item>
            <template #indicator>
                <div class="custom-indicator">{{ swipeIndex + 1 }}/{{contract_template_img_data.length}}</div>
            </template>
        </van-swipe>
    </div>

    <div class="button" @click="gotoLaunchSign">发起签署</div>

  </div>
</template>

<script>
import SignSeeTemplateController from "./sign_see_template_controller";

export default SignSeeTemplateController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./common.scss";

.page {
  background: #fff;
  min-height: 101vh;
}

.name {
  margin-top: 1rem;
  font-size: 15px;
  color: #333;
}

.hr {
  width: 21.563rem;
  height: 0.125rem;
  margin: 0.75rem auto 0;
  background-color: #a8c5fd;
}

.images {
  .my-swipe {
    max-width: 100%;
    padding-top: 0.5rem;

    img {
      max-width: 100%;
    }

    .custom-indicator {
      position: absolute;
      right: 1rem;
      top: 0.5rem;
      padding: 0.2rem 0.48rem;
      font-size: 13px;
      color: #fff;
      border-radius: 0.188rem;
      background: rgba(0, 0, 0, 0.5);
    }
  }
}

.button {
  position: fixed;
  bottom: 0.969rem;
  left: 50%;
  transform: translateX(-50%);
  width: 20rem;
  height: 2.656rem;
  color: #fff;
  font-size: 15px;
  background-color: #198bfb;
  border-radius: 0.469rem;
}

</style>