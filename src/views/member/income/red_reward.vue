<template>
  <div id="red_reward">
    <c-title :hide="false" :text="'经销商红包奖励'"></c-title>
    <div id="content">
      <div class="content_bg">
        <p>经销商红包奖励</p>
        <div class="btn">
          <button type="button" @click="getRed">{{red.name}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import red_reward_controller from "./red_reward_controller";

export default red_reward_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #red_reward {
    #content {
      height: 100vh;
      padding-top: 2.5rem;
      background: #fcecdd;

      .content_bg {
        padding-top: 7.5rem;
        width: 23.4375rem;
        height: 33.375rem;
        background-image: url(../../../assets/images/reward.png);
        background-size: 23.4375rem 33.375rem;
        // z-index: 1;
        p {
          font-size: 28px;
          color: #c14242;
        }

        .btn {
          margin-top: 12.5rem;

          button {
            width: 10rem;
            height: 2.625rem;
            border-radius: 0.375rem;
            background: #fcecdd;
            color: #c14242;
            border: none;
            font-size: 22px;
          }
        }
      }
    }
  }
</style>