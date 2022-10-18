<template>
  <div id="foreshow" :style="{ height: innerHeight + 'px' }">
    <div class="header" :style="{ backgroundImage: 'url(' + info.cover + ')' }"></div>
    <div class="title set-pc-style">
      <i @click="goto()" class="iconfont icon-back"></i>
      <span>预告</span>
    </div>

    <div class="content" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
      <div class="member-head">
        <div class="left" @click="gotoAnchor">
          <img :src="info.avatar" alt="" />
        </div>
        <div class="right">
          <p class="name overflow">{{ info.nickname }}</p>
          <div style="display: flex;">
            <p class="share" @click="shareMessage">分享</p>
            <p class="build" @click="showPoster">生成海报</p>
          </div>
        </div>
      </div>

      <div class="number_time">
        <p style="font-weight: bold;">距离开播仅剩：</p>
        <p class="active_time" v-show="!stop && end">
          <span>{{ Day }}</span
          ><em>天</em> <span>{{ Hour }}</span
          ><em>:</em> <span>{{ Min }}</span
          ><em>:</em><span>{{ Sec }}</span>
        </p>
        <p class="active_time" v-show="stop">{{ PosterData.status == 2 ? "等待开播" : "已开播" }}</p>
      </div>

      <div v-if="info.status == 2">
        <div class="hope">敬请期待</div>
        <div class="button" @click="cancelNotice" v-if="isSetNotice">已订阅</div>
        <div class="button" @click="showToast" v-if="!isSetNotice">开播提醒</div>
      </div>
      <div v-if="info.status == 3">
        <div class="hope">正在直播</div>
        <div class="button" @click="comeLive">进入直播间</div>
      </div>
      <div v-if="info.status == 4">
        <div class="hope">直播结束</div>
        <div class="button" @click="gotoAnchor">主播主页</div>
      </div>
    </div>
    <van-overlay :show="show" @click="show = false" />
    <!--<van-popup v-model="show" round style="background-color: transparent">-->
    <div class="popupClass2" @touchmove.stop :style="{ top: show ? '50%' : '-100%' }">
      <div class="popup-box" v-show="loadingImg">
        <div class="code" id="code_box">
          <div class="shop_top">
            <img :src="base64Datas[0]" alt="" class="shop_icon" />
            <div class="shop_name">{{ PosterData.shop_name }}</div>
          </div>
          <div class="bgBox">
            <img class="bg" :src="base64Datas[1]" alt="" style="object-fit: cover;" />
            <div class="anchorInfo">
              <img :src="base64Datas[2]" alt="" />
              <div class="nickname">{{ PosterData.nickname }}</div>
            </div>
            <div class="live_status">
              {{ PosterData.status == 2 ? "预告" : PosterData.status == 3 ? "直播中" : "回放中" }}
            </div>
          </div>
          <div class="posterBottom">
            <div class="l_info">
              <div class="titless">{{ PosterData.title }}</div>
              <div class="live_time">直播时间{{ PosterData.live_time }}</div>
              <div class="share_meber">
                <img :src="base64Datas[3]" alt="" />
                <div class="m_nickname">{{ nameEllipsis }}</div>
                的分享
              </div>
            </div>
            <div class="r_info">
              <img :src="base64Datas[4]" alt="" />
              <p>长按识别或者保存图片</p>
            </div>
          </div>

          <!-- <p class="tips">{{PosterData.nickname}}</p>
            <div class="avatar">
              <img :src="PosterData.avatar" alt=""/>
              <p >长按识别或者保存图片</p>
            </div> -->
          <!-- <div class="bottom"><p style="flex: 1;line-height: 4.5rem;margin-top: 2rem;">长按识别或者保存图片</p><img
              :src="PosterData.qr_code" alt=""/>
            </div> -->
        </div>
      </div>
      <div style="width: 19.375rem; margin: 0 auto; border-radius: 8px;" v-show="!loadingImg">
        <img style="width: 19.375rem; border-radius: 8px;" id="thecanvas" />
      </div>
      <div class="closeBox" @click="show = false"><i class="iconfont icon-close11"></i></div>
    </div>
    <!--</van-popup>-->
  </div>
</template>

<script>
import foreshow_controller from "./foreshow_controller";

export default foreshow_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#foreshow {
  width: 100%;
  position: relative;
}

.header {
  width: 100%;
  height: 100%;
  // filter: blur(3px);
  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
}

.title {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  color: #fff;
  font-size: 17px;
  font-weight: bold;
  padding: 0.5rem;

  span {
    width: 80%;
    line-height: 2rem;
  }

  i {
    font-weight: bold;
    font-size: 18px;
    flex: 0 0 10%;
    line-height: 2rem;
  }
}

.content {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 66%;
  background: #fff;
  border-radius: 1.5rem 1.5rem 0 0;
}

.member-head {
  display: flex;
  padding: 1rem;

  .left {
    width: 4rem;
    height: 4rem;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }

  .name {
    font-weight: bold;
    font-size: 16px;
    text-align: left;
    width: 15rem;
  }

  .right {
    margin-left: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.2rem 0;
  }

  .share {
    background-color: #ff7e00;
    color: #fff;
    border-radius: 15px;
    padding: 0.2rem 0.6rem;
  }

  .build {
    background-color: #6105de;
    color: #fff;
    border-radius: 15px;
    padding: 0.2rem 0.5rem;
    margin-left: 0.5rem;
  }
}

.number_time {
  margin: 1.5rem auto;
  align-items: center;
  color: #333;
  font-size: 15px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .active_time {
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      background-color: #e71a1a;
      color: #fff;
      padding: 0.3rem;
      border-radius: 10px;
    }

    em {
      font-weight: bold;
      display: inline-block;
      padding: 0 0.5rem;
    }
  }
}

.hope {
  margin: 0 auto 1.5rem auto;
  line-height: 2rem;
}

.hope::before {
  height: 1px;
  width: 7rem;
  vertical-align: middle;
  background-color: #eee;
  content: "";
  display: inline-block;
  margin-right: 0.5rem;
}

.hope::after {
  height: 1px;
  width: 7rem;
  vertical-align: middle;
  background-color: #eee;
  content: "";
  display: inline-block;
  margin-left: 0.5rem;
}

.button {
  border: 1px solid #e71a1a;
  color: #e71a1a;
  width: 15rem;
  height: 3rem;
  border-radius: 0.734rem;
  text-align: center;
  margin: 0 auto;
  line-height: 3rem;
  font-size: 17px;
  font-weight: bold;
}

.popupClass2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 19.375rem;
  // height: 27.625rem;
  z-index: 999;

  .popup-box {
    width: 19.375rem;
    margin: 0 auto;
    // height: 27.625rem;
    overflow: hidden;
    // border: 1px solid #ffffff;
    border-radius: 8px;
  }

  .code {
    width: 19.375rem;
    // height: 27.625rem;
    background-color: #fff;
    border-radius: 8px;
    padding-top: 0.5rem;
    padding-bottom: 1rem;

    .shop_top {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 1.75rem;
      margin-bottom: 0.5rem;

      .shop_icon {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 100%;
        margin: 0;
      }

      .shop_name {
        height: 1.75rem;
        line-height: 1.75rem;
        margin-left: 1rem;
        font-size: 0.875rem;
        color: #000;
      }
    }

    .bgBox {
      position: relative;
      margin: 0 auto;
      width: 17.5rem;
      // height: 13.75rem;
      .bg {
        width: 17.5rem;
        max-height: 18rem;
        display: block;
        object-fit: cover;
      }

      .anchorInfo {
        position: absolute;
        top: 0.6rem;
        left: 0.6rem;
        background: rgba(0, 0, 0, 0.4);
        color: #fff;
        height: 1.375rem;
        line-height: 1.375rem;
        border-radius: 0.875rem;
        padding-right: 0.375rem;
        display: flex;

        img {
          width: 1.375rem;
          height: 1.375rem;
          border-radius: 100%;
          margin-right: 0.25rem;
        }

        .nickname {
          max-width: 5rem;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }

      .live_status {
        position: absolute;
        top: 0.6rem;
        right: 0.6rem;
        color: #fff;
        width: 4rem;
        height: 1.375rem;
        line-height: 1.375rem;
        background-color: #ff7200;
        border-radius: 0.656rem;
      }
    }

    .posterBottom {
      width: 17.5rem;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      text-align: left;

      .l_info {
        display: flex;
        flex-direction: column;

        .titless {
          width: 11rem;
          height: 2.5rem;
          line-height: 1.25rem;
          color: #000;
          font-size: 0.875rem;
          text-align: left;
          margin-top: 1.375rem;
          overflow: hidden;
          text-overflow: ellipsis;
          // display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .live_time {
          font-size: 10px;
          color: #ff7200;
          margin-top: 1.875rem;
        }

        .share_meber {
          color: #666;
          margin-top: 0.875rem;
          height: 1.5rem;
          line-height: 1.5rem;
          display: flex;

          img {
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 100%;
            margin: 0;
            vertical-align: top;
            margin-right: 0.25rem;
          }

          .m_nickname {
            max-width: 5rem;
            overflow: hidden; /* 超出部分隐藏 */
            // text-overflow:ellipsis;/* 超出部分显示省略号 */
            // white-space: nowrap;/*规定段落中的文本不进行换行 */
          }
        }
      }

      .r_info {
        margin-top: 1.375rem;
        text-align: right;

        img {
          width: 5.969rem;
          height: 5.656rem;
          object-fit: contain;
        }

        p {
          font-size: 0.625rem;
        }
      }
    }
  }

  .closeBox {
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    border: solid 0.125rem #fff;
    border-radius: 100%;
    color: #fff;
    position: absolute;
    left: 50%;
    bottom: -2.5rem;
    margin-left: -1rem;
    z-index: 999;

    i {
      font-size: 1rem;
    }
  }
}
</style>
