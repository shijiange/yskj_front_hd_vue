<template>
  <div id="video-list">
    <div class="banner" v-if="is_rotation == 1">
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(bannerItem, i) in bannerList" :key="i">
          <a :href="bannerItem.url">
            <img @click="clickBanner(bannerItem)" class="banner-item" :src="bannerItem.img" />
          </a>
        </van-swipe-item>
      </van-swipe>
    </div>
    <template v-if="is_show_cate">
      <van-tabs v-model="category_id" @click="getData">
        <van-tab v-for="item in cateList" :key="item.id" :title="item.name" :name="item.id"></van-tab>
      </van-tabs>
    </template>
    <div class="video-list">
      <ul ref="newArray1" class="zq-waterfall-left">
        <li @click="toVideo(item)" v-for="(item, i) in newArray1" :key="i">
          <img class="video-img" :src="item.cover" alt="" />
          <p>{{ item.title }}</p>
          <div class="people" v-if="item.member">
            <img :src="item.member.avatar" alt="" />
            <span>{{ item.member.nickname }}</span>
          </div>
          <img class="play" src="../../../assets/images/home_play@2x.png" alt="" />
        </li>
      </ul>
      <ul ref="newArray2" class="zq-waterfall-right">
        <li @click="toVideo(item)" v-for="(item, i) in newArray2" :key="i">
          <img class="video-img" :src="item.cover" alt="" />
          <p>{{ item.title }}</p>
          <div class="people" v-if="item.member">
            <img :src="item.member.avatar" alt="" />
            <span>{{ item.member.nickname }}</span>
          </div>
          <img class="play" src="../../../assets/images/home_play@2x.png" alt="" />
        </li>
      </ul>
      <div class="load" v-if="!showLoading">
        <img src="../../../assets/images/video-loading.gif" alt="loading" />
      </div>
      <div style="height: 3rem;"></div>
    </div>
    <yz-blank v-show="showLoading" :datas="videoList" text="抱歉，该分类暂无数据..." :isBtn="false"></yz-blank>

    <div class="cursor-box">
      <div class="btn btn_1" @click="goUrl('videoAgreement')"><i class="iconfont icon-video_recording"></i><span class="btn-text">发布</span></div>
      <div class="btn btn_2" @click="goUrl('myVideo')"><i class="iconfont icon-video_myvideorecord"></i><span class="btn-text">我的</span></div>
    </div>
  </div>
</template>

<script>
import video_list_controller from "./video_list_controller";

export default video_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#video-list {
  .load {
    text-align: center;

    img {
      width: 3rem;
    }
  }

  .banner {
    width: 100%;
    min-height: 10rem;

    img {
      width: 100%;

      /* height: 10rem; */

      /* object-fit: contain; */
    }
  }

  .video-list {
    margin: 0.5rem 0.5rem 3.5rem 0.5rem;
    text-align: left;

    /* display: flex; */
    ul {
      vertical-align: top;
      display: inline-block;

      /* display: flex; */

      /* flex-direction: column; */

      /* flex-wrap: wrap; */
      width: 48%;
    }

    li {
      position: relative;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border-radius: 6px;
      margin-bottom: 0.5rem;
      overflow: hidden;
    }

    .play {
      position: absolute;
      top: 45%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    ul:first-child {
      margin-right: 0.5rem;
    }

    p {
      font-size: 14px;
      color: #333;
      font-weight: bold;
      padding: 5px 10px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .video-img {
      width: 100%;
      height: auto;
    }

    .people {
      display: flex;
      padding: 5px;

      img {
        flex: 0 0 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        margin: 0 5px;
      }

      span {
        flex: 1;
        line-height: 1.5rem;
        margin: 0 5px;
        font-size: 11px;
        color: #8c8c8c;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }

  .button {
    height: 3.5rem;
    z-index: 2001;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3.125rem;
    background: #fff;
    box-sizing: border-box;
    z-index: 100;

    ul {
      box-sizing: border-box;
      width: 100%;
      height: 3.125rem;
      padding: 0.5rem;

      li {
        width: 20%;
        float: left;
        font-size: 12px;
        color: #828282;

        i {
          font-size: 1.25rem;
        }
      }

      .openMyShop {
        width: 3.4375rem;
        height: 3.4375rem;
        background: #f15353;
        border-radius: 50%;
        line-height: 1.25rem;
        padding-top: 0.5rem;
        box-sizing: border-box;
        text-align: center;
        color: #fff;
        box-shadow: 0 0 0 0.375rem #e6e6e6;
        position: relative;
        bottom: 1.125rem;
        font-size: 14px;
        z-index: 100;
        margin: 0 auto;
      }
    }
  }

  .cursor-box {
    /* width: 3rem; */

    /* height: 3rem; */
    position: fixed;
    bottom: 15%;
    right: 50%;
    transform: translateX(11rem);
    color: #fff;
    z-index: 999;

    /* background-image: linear-gradient(132deg, #fe7575 0%, #fc3d3d 100%), linear-gradient(#7f5e5e, #7f5e5e); */

    /* background-blend-mode: normal, normal; */

    /* box-shadow: 0rem 0.125rem 0.5rem 0.125rem rgba(90, 14, 14, 0.24); */
    display: flex;
    flex-direction: column;

    #imgs {
      width: 3rem;
      height: 3rem;
      z-index: 9999;
      position: relative;
    }

    .rotateImg {
      transform: rotate(135deg);
      -webkit-transform: rotate(135deg);
      transition: transform 0.5s;
    }

    .normalImg {
      transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      transition: transform 0.5s;
    }

    .btn {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background-image: linear-gradient(132deg, #fe7575 0%, #fc3d3d 100%), linear-gradient(#7f5e5e, #7f5e5e);
      background-blend-mode: normal, normal;
      box-shadow: 0 0.125rem 0.5rem 0.125rem rgba(90, 14, 14, 0.24);
      display: flex;
      align-items: center;
      justify-content: center;

      /* position: absolute; */
      flex-direction: column;
      font-size: 12px;

      /* opacity: 0; */
      // transform: scale(0.2);
      // transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
      transition: all 0.35s ease-in-out;

      i {
        padding-top: 0.2rem;
        font-size: 1.5rem;
      }

      .btn-text {
        padding-bottom: 0.2rem;
      }
    }

    .btn_1 {
      /* transform: scale(0.5) translateY(120%); */
      margin-bottom: 5px;
    }

    .active1 {
      opacity: 1;
      transform: scale(1) translateY(-50%);
    }

    .btn_2 {
      /* transform: scale(0.5) translateX(155%) translateY(70%); */
    }

    .active2 {
      opacity: 1;
      transform: scale(1) translateX(0%) translateY(0%);
    }
  }

  .bounce-enter-active {
    animation: bounce-in 1s;
  }

  .bounce-leave-active {
    animation: bounce-in 1s reverse;
  }
}
</style>
