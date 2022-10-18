<template>
  <div class="manual" id="pictureAlbum" style="background: #fff;" :style="{ width:fun.getPhoneEnv() == 3 ? '375px' : '',height:fun.getPhoneEnv() == 3 ? '700px' : '',backgroundColor: picture_album.color,
          backgroundImage: 'url(' + (picture_album.is_background == '2' ? picture_album.background_thumb : '') + ')',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        }">
    <div class="manual-wrap active" @touchmove.prevent v-show="showData">
      <turn :width="manualWidth" ref="turn" :height="manualHeight" :data="manuals" @change="handleTurnChange" @tap="handleToggleControl" @turning="handleTurning" @prev="handleTurnPrev" @next="handleTurnNext"></turn>
    </div>

    <transition name="slide-fade">
      <div class="flipbook_top" v-show="show || showFirst" :style="{ width:fun.getPhoneEnv() == 3 ? '375px' : '' }">
        <div class="left" @click="toCard">
          <div class="head_sculpture" v-if="member.sharing_avatar">
            <img :src="member.sharing_avatar" alt="">
          </div>
          <div class="message">
            <div class="top">{{member.sharing_name}}<span>{{member.position}}</span></div>
            <div class="bottom">{{member.shop_name}}</div>
          </div>
        </div>
        <div class="right" v-if="member.sharing_mobile">
          <div class="top">
            <a
              @click.stop
              :href="'tel:' + member.sharing_mobile"
            >
              <img src="../../../assets/images/phone@2x.png" alt=""/>
            </a>
          </div>
          <div class="bottom">打电话</div>
        </div>
      </div>
    </transition>

    <transition name="slide-fade-right">
      <div class="music" v-show="show">
        <i
          class="iconfont icon-active_music_open"
          @click.stop="play()"
          v-show="!songStop"
        ></i>
        <i
          class="iconfont icon-active_music_close"
          @click.stop="play()"
          v-show="songStop"
        ></i>
      </div>
    </transition>
    <audio
      id="audio"
      ref="audio"
      loop="loop"
      @loadedmetadata="onLoadedmetadata"
      controls="controls"
      autoplay
      preload
      :src="picture_album.audio_url"
      style="display: none;"
    ></audio>

    <transition name="slide-fade-right">
      <div class="sharing_column" v-show="show">
        <ul>
          <li @click="show2 = true">
            <div class="top" style="margin-top: 0.2rem;">
              <i class="iconfont icon-member_goods" style="font-size: 24px;"></i>
            </div>
            <div class="bottom">商品</div>
            <div class="line"></div>
          </li>
          <li @click="show1 = true" v-if="picture_album.code || picture_album.phone">
            <div class="top">
              <i class="iconfont icon-goods_kefu" style="font-size: 28px;"></i>
            </div>
            <div class="bottom">咨询</div>
            <div class="line"></div>
          </li>
          <li @click="gotoUrl('home')">
            <div class="top">
              <i class="iconfont icon-home"></i>
            </div>
            <div class="bottom">首页</div>
            <div class="line"></div>
          </li>
          <li v-if="picture_album.is_open" @click="shareWeixin">
            <div class="top">
              <i class="iconfont icon-fenxiang"></i>
            </div>
            <div class="bottom">分享</div>
          </li>
        </ul>
      </div>
    </transition>

    <transition name="slide-fade-down">
      <div class="display_bar" v-show="show" :style="{ width:fun.getPhoneEnv() == 3 ? '375px' : '' }">
        <ul>
          <li @click="handleSwitchManual(index)" v-for="(item,index) in manuals" :key="index">
            <div class="top">
              <img :src="item.picture_image"
                   alt="">
            </div>
            <div class="bottom">{{item.picture_name}}</div>
          </li>
        </ul>
      </div>
    </transition>

    <van-popup v-model="show1" round closeable close-icon="close">
      <div class="popop-box">
        <div class="popup-content">
          <div class="popup-head" v-if="picture_album.phone">
            <a :href="'tel:' + picture_album.phone">
              <div class="green">
                <img src="../../../assets/images/phone@2x.png" alt=""/>
                <span>一键拨打</span>
              </div>
            </a>
          </div>
          <div class="qr" v-if="picture_album.code">
            <img class="code" :src="picture_album.code" alt=""/>
            <span>长按识别 二维码联系我们</span>
          </div>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="show2"  position="bottom" style="background: #eee;" closeable close-icon="close">
      <div class="bottom-popop-box">
        <p class="title">相关商品</p>
        <div style="height: 15rem; overflow-y: scroll;">
          <div class="good-item" v-for="(item, i) in manuals" :key="i" @click="gotoUrl('goods',{id: item.goods_id})" v-if="item.has_one_goods">
            <div class="left"><img :src="item.has_one_goods.thumb" alt=""></div>
            <div class="right">
              <p>{{item.has_one_goods.title}}</p>
              <p>{{$i18n.t('money')}}{{item.has_one_goods.price}}</p>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import turn_controller from "./picture_album_controller";

export default turn_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .manual {
    width: 100%;
    height: 100vh;
  }

  .manual-wrap {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .turn {
    position: relative;
    z-index: 0;
    -webkit-box-shadow: 0 0 0.06rem 0 rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 0.06rem 0 rgba(0, 0, 0, 0.6);
    -webkit-transition: all ease 0.35s;
    transition: all ease 0.35s;
  }

  .preload {
    position: fixed;
    z-index: -999;
    left: 0;
    top: 0;
    opacity: 0;
    width: 0;
    height: 0;
    overflow: hidden;
  }

  .turn-wraper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    -webkit-transition: all ease 0.35s;
    transition: all ease 0.35s;
  }

  .turn-page-left {
    position: absolute;
    top: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .turn-page-left-clip {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }

  .turn-page-left-content {
    position: absolute;
    overflow: hidden;
    background-color: #fff;
  }

  .turn-page-left-inner {
    width: 100%;
    height: 100%;
    -webkit-transform: rotateY(180deg);
    transform: rotateY(180deg);
    opacity: 0.3;
    -webkit-transition: width all ease 0.35s, height all ease 0.35s;
    transition: width all ease 0.35s, height all ease 0.35s;
  }

  .turn-page-left-gradient {
    position: absolute;
    z-index: 99;
    width: 100px;
    -webkit-transform: scale3d(0, 1, 1);
    transform: scale3d(0, 1, 1);
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(rgba(0, 0, 0, 0)), color-stop(0.3, rgba(0, 0, 0, 0.2)), color-stop(0.5, rgba(0, 0, 0, 0.5)));
  }

  .turn-page-right {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
    overflow: hidden;
  }

  .turn-page-right-gradient {
    position: absolute;
    z-index: 2;
    width: 100px;
    opacity: 1;
    -webkit-transform: scale3d(0, 1, 1);
    transform: scale3d(0, 1, 1);
    background: -webkit-gradient(linear, 0% 0%, 100% 0%, from(rgba(0, 0, 0, 0)), color-stop(0.2, rgba(0, 0, 0, 0.3)), color-stop(0.2, rgba(0, 0, 0, 0.4)), color-stop(0.4, rgba(0, 0, 0, 0.1)), to(rgba(0, 0, 0, 0)));
  }

  .turn-page-right-clip {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: auto;
  }

  .turn-page-right-content {
    position: absolute;
    overflow: hidden;
    z-index: 1;
    transition: width all ease 0.35s, height all ease 0.35s;
  }

  .manual-wrap {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
    -webkit-transition: opacity ease 0.5s;
    transition: opacity ease 0.5s;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -o-user-select: none;
  }

  .manual-wrap.active {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 1;
  }

  .flipbook_top {
    top: 0;
    z-index: 100;
    position: fixed;
    color: #fff;
    padding: 0.7rem;
    width: 100%;
    background: rgba(74, 65, 60, 0.9);
    display: flex;
    justify-content: space-between;

    .left {
      display: flex;
      align-self: center;

      .head_sculpture {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .message {
        text-align: left;
        padding-left: 0.75rem;
        padding-top: 0.1rem;

        .top {
          span {
            padding-left: 0.375rem;
            font-size: 14px;
          }

          font-size: 18px;
        }

        .bottom {
          font-size: 14px;
        }
      }
    }

    .right {
      .top {
        img {
          width: 1.5rem;
          height: 1.5rem;
        }
      }

      .bottom {
        font-size: 14px;
      }
    }
  }

  .display_bar {
    z-index: 10;
    position: fixed;
    background: rgba(77, 77, 77, 0.5);
    width: 100%;
    bottom: 0;
    color: #fff;

    ul {
      width: 100%;
      padding: 0.5em;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      overflow-x: auto;

      li {
        width: 4rem;
        display: inline-table;
        margin-right: 0.59375em;

        .top {
          width: 5rem;

          img {
            width: 100%;
          }
        }

        .bootom {
          width: 100%;
          text-align: center;
        }
      }
    }

    .bottom {
      width: 5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .music {
    border-radius: 50%;
    z-index: 10;
    background: rgba(74, 65, 60, 0.9);
    position: absolute;
    top: 7rem;
    right: 0.1rem;
    width: 32px;
    height: 32px;
    color: #fff;

    i {
      line-height: 32px;
      font-size: 28px;
    }
  }

  .sharing_column {
    border-radius: 0.5rem;
    z-index: 10;
    background: rgba(74, 65, 60, 0.9);
    position: absolute;
    top: 10rem;
    right: 0.1rem;
    width: 3rem;
    color: #fff;

    i {
      font-size: 20px;
    }

    .top {
      font-size: 20px;
    }

    .bottom {
      margin-bottom: 0.2rem;
    }

    .line {
      width: 1.875rem;
      height: 1px;
      background: #898b88;
      margin: 0 auto;
    }
  }

  .popop-box {
    width: 20rem;
    max-height: 22rem;
    margin: 0 auto;
    border-radius: 10px;

    .popup-content {
      background: #fff;
      width: 20rem;
      max-height: 22rem;
      padding-bottom: 2rem;
      border-radius: 10px;
    }

    .popup-head {
      padding: 1rem 0;
      border-bottom: 1px dashed #ebebeb;

      p {
        font-size: 14px;
        font-weight: bold;
      }
    }

    .green {
      background: #37ce50;
      color: #fff;
      width: 7rem;
      height: 2rem;
      margin: 0 auto;
      border-radius: 1rem;
      line-height: 2rem;
      display: flex;
      padding: 0 0.5rem;
      margin-top: 1.5rem;

      img {
        width: 1.2rem;
        height: 1.2rem;
        flex: 0 0 1.5rem;
        margin-right: 0.2rem;
      }

      span {
        flex: 1;
      }
    }

    .qr {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;

      img {
        width: 11rem;
        height: 11rem;
      }

      span {
        color: #999;
      }
    }
  }

  #pictureAlbum {
    position: relative;

    .slide-fade-enter-active {
      transition: all 0.5s ease;
    }

    .slide-fade-leave-active {
      transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter,
    .slide-fade-leave-to {
      transform: translateY(-30px);
      opacity: 0;
    }

    .slide-fade-right-enter-active {
      transition: all 0.5s ease;
    }

    .slide-fade-right-leave-active {
      transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-right-enter,
    .slide-fade-right-leave-to {
      transform: translateX(30px);
      opacity: 0;
    }

    .slide-fade-down-enter-active {
      transition: all 0.5s ease;
    }

    .slide-fade-down-leave-active {
      transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-down-enter,
    .slide-fade-down-leave-to {
      transform: translateY(30px);
      opacity: 0;
    }
  }

  .bottom-popop-box {
    margin: 0.8rem;

    .title {
      font-weight: bold;
      font-size: 16px;
      text-align: left;
      margin-bottom: 0.7rem;
    }

    .good-item {
      display: flex;
      margin: 0.5rem 0;
      padding: 0.5rem;
      border-radius: 5px;
      background: #fff;

      .left {
        flex: 0 0 5rem;
        height: 5rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .right {
        margin-left: 0.8rem;
        font-weight: bold;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        p:first-child {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
</style>
