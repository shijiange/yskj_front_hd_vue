<template>
  <div id="power_store">
    <c-title :hide="false"
             text='店铺信息'></c-title>
    <div class="content">
      <div class="item">
        <span>店铺名称:</span>
        <input type="text"
               v-model="shop_name"
               placeholder="请输入店铺名称">
      </div>
      <div class="item">
        <span>联系方式:</span>
        <input type="text"
               v-model="phone"
               placeholder="请输入联系方式">
      </div>
      <div class="item">
        <span>店铺地址:</span>
        <input type="text"
               v-model="shop_address"
               placeholder="请输入店铺地址">
      </div>
    </div>
    <div class="btn-wrap">
      <div class="btn"
           @click="submit">
        确定
      </div>
    </div>
  </div>
</template>

<script>
import power_store_controller from './power_store_controller';
export default power_store_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#power_store {
  height: 100vh;
  background-color: #fff;
  position: relative;

  .content {
    padding: 0.75rem;

    .item {
      border-bottom: solid 1px #f5f7fa;
      padding: 0.25rem;
      text-align: left;

      span {
        display: inline-block;
      }

      input {
        flex: 1;
        color: #999;
        padding: 1.1875rem;
        border: none;
        outline: none;
      }
    }
  }

  .btn-wrap {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    bottom: 0.25rem;

    .btn {
      width: 18.75rem;
      height: 2.5rem;
      background-color: #ff2c29;
      border-radius: 1.25rem;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
