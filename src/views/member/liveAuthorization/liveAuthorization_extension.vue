<template>
  <div id="liveAuthorization_extension">
    <c-title :hide="false" text="直播授权码"></c-title>
    <div class="head">
      <div class="img">
        <img :src="avatar" alt="" />
      </div>
      <div class="name">{{nickname}}</div>
    </div>
    <div class="amounts">
      <div style="font-size: 1.13rem; color: #202020;">累计金额</div>
      <div style="font-size: 1.13rem; color: #f14e4e;">￥{{money}}</div>
    </div>
    <van-tabs v-model="active">
      <van-tab title="收益记录"></van-tab>
    </van-tabs>
    <div class="lisbox">
      <div class="list" v-for="(item, ind) in info" :key="ind">
        <div class="time">{{item.buy_time}}</div>
        <div>+{{item.money}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import liveAuthorization_extension_controller from "./liveAuthorization_extension_controller";
export default liveAuthorization_extension_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.lisbox {
  padding: 0 0.81rem;
  background: #fff;
}

.list {
  display: flex;
  height: 3.56rem;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 0.06rem solid #ebebeb;
}

.list:last-child {
  border-bottom: none;
}

.amounts {
  width: 100%;
  height: 3.06rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.97rem;
  border-bottom: #ebebeb 1px solid;
  background-color: #fff;
}

.head {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1.56rem;
  width: 23.44rem;
  height: 7.06rem;
  background-color: #ee2e2b;

  .img {
    width: 2.88rem;
    height: 2.88rem;
    background-color: #000;
    border-radius: 50%;
    margin-right: 0.63rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 100%;
    }
  }

  .name {
    font-size: 1rem;
    color: #fff;
  }
}
</style>