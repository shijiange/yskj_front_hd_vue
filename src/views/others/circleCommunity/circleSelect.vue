<template>
  <div id="circleSelect">
    <c-title :hide="false" text="发布"> </c-title>
    <div class="select-box">
      <div class="select-one" @click="issueTopic(id)">
        <div class="img">
          <img src="../../../assets/images/circleInvitation.png">
        </div>
        <div class="Invitation-box">
          帖子
        </div>
      </div>
      <div class="select-two" @click="issueVideo(id)">
        <div class="img">
          <img src="../../../assets/images/circleVideo.png">
        </div>
        <div class="video-box">
          视频
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import circleSelect_controller from './circleSelect_controller';

export default circleSelect_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#circleSelect {
  .select-box {
    padding: 1.7188rem 2.0313rem;
    display: flex;

    .select-one {
      width: 8.75rem;
      height: 10rem;
      background-color: #fff;
      border-radius: 0.625rem;
      margin-right: 1.875rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;

      .img {
        width: 4.4375rem;
        height: 4.4375rem;
        margin-bottom: 1.1875rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .Invitation-box {
        width: 4.0625rem;
        height: 1.5625rem;
        background-color: #fac337;
        border-radius: 0.7813rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 0.875rem;
      }
    }

    .select-two {
      width: 8.75rem;
      height: 10rem;
      background-color: #fff;
      border-radius: 0.625rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;

      .img {
        width: 4.4375rem;
        height: 4.4375rem;
        margin-bottom: 1.1875rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .video-box {
        width: 4.0625rem;
        height: 1.5625rem;
        background-color: #37b3fa;
        border-radius: 0.7813rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 0.875rem;
      }
    }
  }
}
</style>
