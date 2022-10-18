<template>
  <div id="service-pc">
    <div class="service">
      <div class="number">{{service_phone}}</div>
      <div class="number">微信客服</div>
      <div class="img">
        <img :src="service_qr_code_src || emptyImage" alt="" style="width: 128px; height: 128px;" />
      </div>
      <div class="button" @click="goTop">
        <div>
          <i class="iconfont icon-member-top" style="font-size: 25px;"></i>
        </div>
        <div>回到顶部</div>
      </div>
    </div>
  </div>
</template>

<script>
import service_pc_controller from './service_pc_controller';

export default service_pc_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: rgb(255, 92, 0);
$text-color: #202020;

#service-pc {
  text-align: center;

  .service {
    position: fixed;
    bottom: 50px;
    right: 100px;
    width: 170px;
    height: 324px;
    box-shadow: 1px 2px 10px #eee;
    background: #fff;
    z-index: 1999;
    padding: 0 5px;

    .number {
      font-size: 18px;
      color: #333;
      line-height: 54px;
      border-bottom: 1px solid #f4f4f4;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .img {
      padding-top: 10px;
    }

    .button {
      cursor: pointer;
      color: $orange;
      font-size: 14px;
      padding-top: 5px;
    }
  }
}

</style>
