<template>
  <div id="liveAuthorization_scanCode">
    <c-title :hide="false" text="直播授权码"></c-title>
    <div class="haveBuy" v-for="(item, index) in info" :key="index">
      <div class="BuyTop">
        <i class="iconfont icon-fontclass-maikefeng"></i>
        <span>{{ item.level_name }}</span>
      </div>
      <div class="bottom">
        <div :class="[item.type == 2 ? 'BuyBottom' : 'BuyBottomT']" @click="clickTap(item)">{{ item.type_name }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import liveAuthorization_scanCode_controller from "./liveAuthorization_scanCode_controller";
export default liveAuthorization_scanCode_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#liveAuthorization_scanCode {
  .haveBuy {
    margin: 0 0.94rem;
    height: 7.5rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/liveCardBj.png");
    background-repeat: no-repeat;
    background-size: cover;
    border-radius: 0.25rem;
    margin-top: 0.97rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.97rem 0.91rem 0.97rem 0.94rem;

    .BuyTop {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .icon-fontclass-maikefeng {
        font-size: 1.3rem;
        color: #fff;
      }

      span {
        margin-left: 0.3rem;
        font-size: 1.06rem;
        color: #fff;
      }
    }

    .bottom {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .BuyBottom {
        width: 3.75rem;
        height: 1.5rem;
        background-color: #c1c1c1;
        border-radius: 0.19rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.81rem;
        color: #fff;
      }

      .BuyBottomT {
        width: 3.75rem;
        height: 1.5rem;
        background-color: #f22f2f;
        border-radius: 0.19rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.81rem;
        color: #fff;
      }
    }
  }
}
</style>
