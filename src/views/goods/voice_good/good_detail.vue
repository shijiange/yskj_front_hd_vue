<template>
  <transition name="fade2">
    <div id="goods"
         v-show="showGood"
         :class="[this.fun.getPhoneEnv() == 3?'pcStyle':''] ">
      <div id="hoid"
           @click="goto"
           :class="{ hoet: hoet }"
           v-if="isCup">
        <div id="back">
          <i class="iconfont icon-member-left"></i>
        </div>
      </div>
      <div id="cart"
           @click="gotoCart"
           :class="{ hoet: hoet }"
           v-if="isCup">
        <div id="back">
          <i class="iconfont icon-ai-home"></i>
        </div>
      </div>
      <div id="member"
           @click="gotoMember"
           :class="{ hoet: hoet }"
           v-if="isCup">
        <div id="back">
          <i class="iconfont icon-wode-wode"></i>
        </div>
      </div>
      <viewer :images="goodsInfo.thumb_url">
        <c-myswipe style="height: 13.125rem;"
                   :pagination-visible="true"
                   :slides="goodsInfo.thumb_url"
                   :repeating="true"
                   :auto="0"
                   class="banner_pcStyle">
          <div v-if="!fun.isTextEmpty(goodsInfo.goods_video)">
            <video id="goods_vedio"
                   style="width: 100%; height: 100%;"
                   :poster="goodsInfo.video_image"
                   :src="goodsInfo.goods_video"
                   controls
                   webkit-playsinline="true"
                   playsinline="true"
                   x5-video-ignore-metadata="true"
                   width="100%"
                   height="100%">
              <source :src="goodsInfo.goods_video"/>
            </video>
          </div>
          <div v-if="!goodsInfo.thumb_url || goodsInfo.thumb_url == null">
            <img :src="goodsInfo.thumb"
                 width="100%"/>
          </div>
          <div v-for="(ithumb, index) in goodsInfo.thumb_url"
               :key="index">
            <template v-if="ithumb">
              <img :src="ithumb"
                   style="width: 100%; height: 100%;"/>
            </template>
          </div>
        </c-myswipe>
      </viewer>

      <div class="title">
        <h1 style="-webkit-box-orient: vertical;">{{ goodsInfo.title | escapeTitle }}</h1>
        <div class="content"
             style="padding-top: 0.5rem;">{{goodsInfo.content}}
        </div>
      </div>
      <!--  @click="startPlayOrPause" -->
      <div class="btn"
           v-if="!is_rule"
           @click="popupSpecs=true">
        立即在线播放
      </div>

      <div class="voice"
           v-if="is_rule">
        <p><span class="line"></span><span class="title">语音信息</span></p>
        <ul class="voice-item">
          <li v-for="(item,index) in goodsInfo.curriculum"
              :key="index"
              :class="selectedNum==index?'activeLi':''">
            <div class="voice-content">
              <span class="first">1</span>
              <span class="second">{{item.name}}</span>
              <span class="icon"
                    @click.stop="select(index,item.url)">
                <img src="../../../assets/images/play1.png"
                     alt=""
                     v-if="selectedNum!=index||songStop">
                <img src="../../../assets/images/stop1.png"
                     alt=""
                     v-if="selectedNum==index&&!songStop">
              </span>
            </div>
            <div class="audio-wrapper"
                 v-if="selectedNum==index">
              <!--<div class="audio-left">-->
              <!--<img @click="startPlayOrPause" v-if="isPlay&&readyState>0"-->
              <!--src="../../../assets/images/play.png">-->
              <!--<img @click="startPlayOrPause" v-if="!isPlay&&readyState>0"-->
              <!--src="../../../assets/images/pause.png">-->
              <!--<img v-if="readyState < 1" src="../../../assets/images/loading.gif"/>-->
              <!--</div>-->
              <div class="slider"
                   ref="slider"
                   @touchstart="handleTouchStart">
                <div class="slider-track"></div>
                <div class="slider-fill"
                     :style="'width:'+sliderTime+'%'"></div>
                <div class="slider-thumb"
                     :style="'left:'+sliderTime+'%'"></div>
              </div>
              <div class="time">
                <div class="time_left">{{ audio.currentTime | formatSecond}}</div>
                <div class="time_right">{{ audio.maxTime | formatSecond}}</div>
              </div>
            </div>
          </li>

        </ul>

        <audio id="audio"
               ref="audio"
               @pause="onPause"
               @play="onPlay"
               @ended="ended"
               @timeupdate="onTimeupdate"
               @loadedmetadata="onLoadedmetadata"
               @onerror='error'
               controls="controls"
               style="display: none;">
          您的浏览器不支持 audio 标签！
        </audio>
      </div>
      <!-- 微贴 start -->
      <invitation :goods_plugin="goodsInfo"></invitation>
      <!-- 微贴 end -->
      <div class="voice"
           ref="goodinfo">
        <p><span class="line blue"></span><span class="title">详情</span></p>
        <div id="goods_content"
             v-html="goodsInfo.goods_content"></div>
      </div>

      <div class="voice"
           v-if="!fun.isTextEmpty(goodsInfo.sale_goods)">
        <p><span class="line red"></span><span class="title">猜你喜欢</span></p>
        <div class="like-box">
          <div class="like-item"
               v-for="(sale,i) in goodsInfo.sale_goods"
               :key='i'
               @click="gotoGoods(sale.id)">
            <div class="img">
              <img :src="sale.thumb"
                   alt="">
            </div>
            <p style="-webkit-box-orient: vertical;"
               class="like-title">{{sale.title}}</p>
          </div>
        </div>
      </div>

      <van-popup v-model="popupSpecs">
        <div class="popup-box">
          <div class="title bottom-line">
            <h1>授权权限申请</h1>
          </div>
          <div class="popup-text">
            {{ConnectionInfo.voice_tips}}
          </div>
          <div class="icon-box">
            <a class="popup-icon"
               v-if="!fun.isTextEmpty(cservice)"
               :href="cservice">
              <img src="../../../assets/images/weixin1.png"
                   alt="">
              <span>在线客服</span>
            </a>
            <a class="popup-icon"
               v-if="ConnectionInfo.phone"
               :href="'tel:' + ConnectionInfo.phone">
              <img src="../../../assets/images/phone1.png"
                   alt="">
              <span>客服电话</span>
            </a>
          </div>
        </div>
      </van-popup>

    </div>
  </transition>
</template>

<script>
import detail_controller from "./good_detail_controller";

export default detail_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  // @import "../../../assets/css/goods.scss";
  #hoid {
    padding: 0.3125rem;
    width: 1.6rem;
    position: fixed;
    z-index: 2;
  }

  #cart {
    padding: 0.3125rem;
    width: 1.6rem;
    position: fixed;
    z-index: 2;
    box-sizing: content-box;
  }

  #member {
    padding: 0.3125rem;
    width: 1.6rem;
    position: fixed;
    z-index: 2;
    box-sizing: content-box;
  }

  #cart {
    right: 0;
  }

  #member {
    right: 2rem;
  }

  #hoid.hoet {
    transition: 0.1s;
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
  }

  #back {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 100%;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.4);
    text-indent: 0;
    line-height: 1.7rem;
    overflow: hidden;
  }

  .hoet #back {
    transition: 0.1s;
    background-color: rgba(237, 237, 237, 0);
  }

  .audio-wrapper {
    /* background-color: #fcfcfc; */
    margin: 0 auto;
    width: 100%;
    height: 50px;

    /* border: 1px solid #e0e0e0; */
    color: #3e3e3e;
  }

  .audio-left {
    float: left;
    text-align: center;
    width: 18%;
    height: 100%;
  }

  .audio-left img {
    width: 40px;
    position: relative;
    top: 15px;
    margin: 0;
    display: initial; /* 解除与app的样式冲突 */
    cursor: pointer;
  }

  .slider {
    width: 100%;
    position: relative;
    height: 30px;

    /* margin-top: 20px; */
    display: flex;
    align-items: center;
    cursor: default;
    user-select: none;
    outline: none;
  }

  .slider-track {
    position: absolute;
    height: 2px;
    left: 0;
    right: 0;
    top: 50%;
    margin-top: -1px;
    background-color: #bec2c1;
  }

  .slider-fill {
    position: absolute;
    height: 2px;
    width: 100%;
    background-color: #ffba00;
    left: 0;
    top: 50%;
    margin-top: -1px;
  }

  .slider-thumb {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    background-color: #ffba00;
    color: #ffba00;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  .time {
    display: flex;
  }

  .time_left {
    flex: 1;
    text-align: left;
  }

  .time_right {
    flex: 0 0 3rem;

    /* padding-right: 1rem; */
  }

  .van-popup {
    border-radius: 10px;
  }

  .bottom-line {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #dadada;
  }

  .popup-box {
    width: 16rem;
    height: 18rem;
    background-color: #fff;
    border-radius: 10px;
    padding: 1rem 0.5rem;
    margin: 0 auto;
  }

  .popup-text {
    margin: 0.5rem 1rem;
    text-align: left;
  }

  .icon-box {
    display: flex;

    .popup-icon {
      flex: 1;
      display: flex;
      flex-direction: column;

      img {
        margin: 1rem auto;
        width: 4rem;
        height: 4rem;
      }
    }
  }

  .title {
    margin: 0.5rem 1rem;
    text-align: left;

    h1 {
      flex: 3;
      text-align: left;
      color: #333;
      font-size: 20px;
      line-height: 1.5rem;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-weight: bold;
    }
  }

  .btn {
    width: 12rem;
    height: 2.5rem;
    line-height: 2.5rem;
    margin: 1rem auto;
    background-color: #ffba00;
    border-radius: 20px;
    color: #fff;
    font-weight: bold;
  }

  .voice {
    margin: 0.5rem 1rem 1rem;
    background: #fff;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.09);
    border-radius: 5px;
    text-align: left;
    padding: 0.5rem;

    p {
      line-height: 2rem;
    }

    .line {
      display: inline-block;
      width: 5px;
      height: 1.2rem;
      background-color: #ffc600;
      border-radius: 2px;
      vertical-align: middle;
    }

    .title {
      font-size: 16px;
      font-weight: bold;
      vertical-align: middle;
    }

    .blue {
      background-color: #00fcff;
    }

    .red {
      background-color: #de0303;
    }
  }

  .voice-item {
    padding: 0 0.5rem;

    li {
      padding-bottom: 0.625rem;
    }

    .voice-content {
      display: flex;
      font-size: 14px;
    }

    .first {
      flex: 0 0 2rem;
    }

    .second {
      flex: 1;
      line-height: 1.125rem;
    }

    .icon {
      flex: 0 0 2rem;
      align-items: center;
      display: flex;

      img {
        width: 1.2rem;
        height: 1.2rem;
        display: inline-block;
      }
    }
  }

  .like-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .like-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.625rem;
    width: 49%;

    .img {
      width: 100%;
      height: 100%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .like-title {
      font-size: 14px;
      line-height: 1.125rem;
      height: 3rem;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      padding-top: 0.375rem;
    }
  }

  .like-item:nth-child(3n) {
    margin-right: 0;
  }

  .noVantRadio {
    .van-radio-group {
      display: flex;
      flex-wrap: wrap;

      .van-radio {
        margin-right: 0.3125rem;
        margin-bottom: 0.3125rem;
        background: #fff;
        border: 1px solid #bfcbd9;
        text-align: center;
        box-sizing: border-box;
        border-radius: 0.25rem;
      }

      .vantRadioshow {
        background-color: rgb(241, 83, 83);
        border-color: rgb(241, 83, 83);
        box-shadow: rgb(241, 83, 83) -1px 0 0 0;
      }
    }
  }

  #original-del {
    color: #8c8c8c;

    .original-price {
      font-size: 12px;
      margin-left: 12px;
      color: #8c8c8c;
    }
  }

  .pcStyle {
    #hoid {
      width: 375px !important;
    }

    #cart {
      right: 50% !important;
      margin-right: -186px;
    }

    #member {
      right: 50% !important;
      margin-right: -150px;
    }

    .pcStyle_activity {
      .yd-popup-show {
        width: 375px !important;
        right: 50%;
        margin-right: -187.5px;
      }
    }

    .pcStyle_mint {
      width: 375px !important;
      box-sizing: border-box !important;

      #chooser_img {
        width: 5.81rem !important;
      }

      .right {
        margin-left: 8rem !important;
      }
    }

    .pcStyle_width {
      width: 375px !important;
    }

    .banner_pcStyle {
      height: 375px !important;
    }

    .pcStyle_ydT {
      width: 375px;
      left: 50% !important;
      margin-left: -187.5px;
    }

    .pcStyle_ydC {
      width: 375px;
      margin: 0 auto;
    }

    #foot {
      width: 375px !important;
    }
  }
</style>
