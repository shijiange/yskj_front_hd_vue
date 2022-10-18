<template>
  <div class="page">
    <div class="title">
      <div class='con' style="height: 2.938rem;">
        <div class="left" @click="goto">
          <i class="iconfont icon-member-left back"></i>
        </div>
        <div class="right">{{userObj.plugin_name}}</div>
      </div>
    </div>

    <div class="wrapper">
      <div class="available">可用{{userObj.plugin_name}}{{userObj.lan_point}}</div>
      <div class="container">
        <div class="c1">兑换{{userObj.plugin_name}}</div>
        <div class="inputW">
          <i class="iconfont icon-fontclass-jifen"></i>
          <input class="input" v-model="blueNum" placeholder="请输入积分" type="number">
          <div class="all" @click="allExchange">全部兑换</div>
        </div>
        <div class="c2">注：兑换比例{{userObj.proportion}}</div>
        <div class="c3">你可获得 {{points}} {{userObj.shop_point_name}}</div>
        <div class="send" :class="[(points==0 || userObj.lan_point==0) ? 'disabled' : 'active']" @click="sendExchange">
          兑换
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import memberIntegralBlueCattleController from "./member_integral_blueCattle_controller.js";

export default memberIntegralBlueCattleController;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .page {
    background: rgb(245, 245, 245);
    min-height: 100vh;
  }

  .title {
    height: 2.938rem;
    width: 375px;
    box-sizing: border-box;
    background: #fff;

    .con {
      width: 100%;
      display: flex;
      position: relative;

      .left {
        position: absolute;
        left: 0;
        top: 0;
        width: 3rem;
        height: 100%;
        display: flex;
        padding-left: 1.313rem;
        align-items: center;

        .icon-member-left {
          color: #000;
          font-weight: bold;
        }
      }

      .right {
        flex: 0 0 calc(100% - 6rem);
        width: calc(100% - 6rem);
        margin: 0 auto;
        color: #000;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.125rem;
        letter-spacing: 0.056rem;
        pointer-events: none;
        text-overflow: ellipsis;
        white-space: normal;
        overflow: hidden;
      }
    }
  }

  .wrapper {
    text-align: left;
    padding: 0.938rem 0.938rem 0;

    .available {
      color: #333;
      font-size: 0.875rem;
    }

    .container {
      margin-top: 0.906rem;
      background: #fff;
      padding: 1.313rem 1.906rem 1.719rem;

      .c1 {
        color: #333;
        font-size: 0.834rem;
      }

      .inputW {
        border-bottom: 0.031rem solid rgba(84, 152, 252, 0.25);
        margin-top: 1.813rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding-bottom: 1rem;

        .iconfont {
          transform: translateY(0.4rem);
          font-size: 1.8rem;
          color: #f15353;
        }

        .input {
          width: 10rem;
          font-size: 1rem;
          font-weight: bold;
          color: #333;
          border: none;
        }

        .all {
          color: #f15353;
          font-size: 0.755rem;
        }
      }

      .c2 {
        margin-top: 0.625rem;
        color: #888;
        font-size: 0.715rem;
      }

      .c3 {
        color: #666;
        margin-top: 2rem;
        font-size: 0.794rem;
        text-align: center;
      }

      .send {
        margin-top: 1.5rem;
        height: 2.438rem;
        font-size: 0.953rem;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f15353;
        transition: 0.5s;
        border-radius: 0.375rem;

        &.disabled {
          background-color: #888;
          color: #fff;
        }

        &.active {
          &:active {
            background-color: #ee0b4f;
          }
        }
      }
    }
  }

</style>