<template>
  <div id="password_change" ref="password_change">
    <c-title :hide="false" text="店铺密码设置"></c-title>
    <div class="content">
      <div class="switch">
        <span>进入店铺需要密码</span>
        <van-switch v-model="switch1" inactive-color="#ff2c29" @change="changePWD" />
      </div>
      <div class="setPassword" v-if="switch1" @click="toSet">
        <span>密码设置</span>
        <i class="fa fa-angle-right"></i>
      </div>
      <div class="btn" @click="back">
        返回
      </div>
    </div>
  </div>
</template>

<script>
import password_change_controller from "./password_change_controller";

export default password_change_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#password_change {
  background-color: #fff;
  height: 100vh;

  .content {
    padding: 0 0.75rem;
    background-color: #fff;

    .switch {
      padding: 1.125rem 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: solid 1px #f1f1f1;
      color: #000;
    }

    .setPassword {
      padding: 1.125rem 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #000;

      i {
        color: #666;
        font-size: 18px;
      }
    }

    .btn {
      width: 18.4375rem;
      height: 2.625rem;
      border-radius: 1.3125rem;
      border: solid 0.0625rem #ff2c29;
      color: #ff2c29;
      font-size: 18px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      margin-top: 7.375rem;
      justify-content: center;
    }
  }
}
</style>
