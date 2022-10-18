<template>
  <div id="choose_status"
       ref="choose_status">
    <c-title :hide="false"
             text="选择注册角色"></c-title>
    <div class="content">
      <div class="head">
        <div class="line"></div>
        <span>选择注册角色</span>
      </div>
      <div class="wrapper">
        <div class="shop"
             @click="toShop()"
             :class="[isActive==1?'bgOrange':'']">
          企业店铺
        </div>
        <!-- <div class="buyer"
             @click="toBuyer()"
             :class="[isActive==2?'bgOrange':'']">
          企业买家
        </div> -->
        <div class="person"
             @click="toperson()"
             :class="[isActive==3?'bgOrange':'']">
          企业个体工商户
        </div>
        <!-- <div class="people"
             @click="topeople()"
             :class="[isActive==4?'bgOrange':'']">
          个人
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import choose_status_controller from "./choose_status_controller";
export default choose_status_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#choose_status {
  background-color: #fff;

  .content {
    text-align: center;

    .head {
      margin-top: 2rem;
      margin-left: 1rem;
      display: flex;
      align-items: center;
      margin-bottom: 3.5rem;

      .line {
        width: 0.1875rem;
        height: 0.875rem;
        background-color: #f87070;
        margin-right: 1rem;
      }

      span {
        font-size: 14px;
        color: #f86e6e;
      }
    }

    .wrapper {
      .shop {
        width: 19rem;
        height: 3rem;
        border-radius: 0.5rem;
        border: solid 1px #f87070;
        color: #f87070;
        margin: 0 auto;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }

      .buyer {
        width: 19rem;
        height: 3rem;
        border-radius: 0.5rem;
        border: solid 1px #f87070;
        color: #f87070;
        margin: 0 auto;
        display: flex;
        align-items: center;
        margin-bottom: 2rem;
        justify-content: center;
        font-size: 14px;
      }

      .person {
        width: 19rem;
        height: 3rem;
        border-radius: 0.5rem;
        border: solid 1px #f87070;
        color: #f87070;
        margin: 0 auto;
        display: flex;
        align-items: center;
        margin-bottom: 2rem;
        justify-content: center;
        font-size: 14px;
      }

      .people {
        width: 19rem;
        height: 3rem;
        border-radius: 0.5rem;
        border: solid 1px #f87070;
        color: #f87070;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
    }
  }

  .bgOrange {
    background-color: #f87070;
    color: #fff !important;
  }
}
</style>
