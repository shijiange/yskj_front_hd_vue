<template>
  <div id="integral_invest">
    <c-title :hide="false"
             text="充值"> </c-title>
    <!-- 优化 -->
    <div class="content">
      <div class="top">
        <div class="title">
          <span class="line"></span>
          <span class="text">上传充值凭证</span>
        </div>
        <van-uploader class="up-photo"
                      :after-read="afterRead">
          <img src="../../../assets/images/up_icon.png"
               v-if="fun.isTextEmpty(certificates)"
               class="up_icon">
          <img :src="certificates"
               v-if="!fun.isTextEmpty(certificates)"
               class="show">
        </van-uploader>
        <div class="input">
          <span>数量:</span>
          <input type="text"
                 v-model="integral"
                 placeholder="填写数量">
        </div>
        <div class="btn"
             @click="confirm">
          <span>确认{{plugin_name}}充值成功</span>
        </div>
      </div>
      <div class="bottom">
        <div class="title">
          <span class="line"></span>
          <span class="text">充值说明</span>
        </div>
        <div class="introce">
          <p v-html="explain_that"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Integral_love_invest_controller from "./Integral_love_invest_controller";
export default Integral_love_invest_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#integral_invest {
  .content {
    .top {
      background-color: #fff;
      padding-bottom: 1.0313rem;

      .title {
        padding-top: 0.5rem;
        padding-left: 1rem;
        text-align: left;
        display: flex;
        align-items: center;

        .line {
          width: 0.25rem;
          display: inline-block;
          height: 1.5rem;
          background-color: #f35353;
          margin-right: 1rem;
        }

        .text {
          color: #333;
          font-size: 18px;
        }
      }

      .up-photo {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 6rem;
        height: 6rem;
        overflow: hidden;
        margin: 0 auto;
        margin-top: 1rem;
        margin-bottom: 2rem;
        border: dashed 1px #ccc;
        border-radius: 0.125rem;
        position: relative;

        .up_icon {
          width: 2rem;
          height: 2rem;
        }

        .show {
          width: 100%;
          height: 100%;
        }
      }

      .input {
        padding-bottom: 0.5rem;
        border-bottom: solid 1px #ccc;
        width: 16rem;
        text-align: left;
        margin: 0 auto;

        span {
          font-size: 14px;
        }

        input {
          outline: none;
          border: none;
        }
      }

      .btn {
        width: 15rem;
        height: 3rem;
        background-color: #f35353;
        box-shadow: 0 0 0 0 rgba(243, 83, 83, 0.47);
        border-radius: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        margin-top: 2rem;

        span {
          font-size: 14px;
          color: #fff;
        }
      }
    }

    .bottom {
      margin-top: 0.5625rem;
      background-color: #fff;

      .title {
        padding-top: 0.5rem;
        padding-left: 1rem;
        text-align: left;
        display: flex;
        align-items: center;

        .line {
          width: 0.25rem;
          display: inline-block;
          height: 1.5rem;
          background-color: #f35353;
          margin-right: 1rem;
        }

        .text {
          color: #333;
          font-size: 18px;
        }
      }

      .introce {
        text-align: left;
        padding-left: 1.5938rem;
        padding-right: 1.5938rem;
        margin-top: 0.8438rem;
      }
    }
  }
}
</style>
