<template>
  <div
    class="wap"
    ref="wap"
    v-show="activityModel.background_colour"
    :style="{ background: activityModel.background_colour }"
  >
    <div class="banner">
      <img class="bannerImg" :src="activityModel.background" alt="banner"/>
      <!--<img src="/addons/yun_shop/static/img/lottery/banner.png" alt="">-->
      <div class="prizeInfoBtn" @click="lotteryRecord">
        <!--<img src="/addons/yun_shop/static/img/lottery/prizeInfo.png" alt=""> v-show="hasRecord"-->
        <img
          class="prizeInfoBtnImg"
          src="../../assets/images/lottery/prizeInfo.png"
          alt="中奖列表"
        />
      </div>
      <div class="priceChanceBtn">
        您有{{remainingTimes}}次抽奖机会
      </div>
    </div>

    <div class="logo" v-if="activityModel.is_logo" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <img :src="shop_logo" alt="">
    </div>
    <div class="box">
      <div
        v-for="(imgLi, index) in prizeList" :key='index' ref="pice"
        :style="{ backgroundImage: 'url(' + imgLi.bgSrc + ')' }"
      >
        <img :src="imgLi.thumb_url" v-if="imgLi.thumb_url" :class="activityModel.prize_name == 0 ? 'activeNameImg' : ''"/>
        <span
          class="title"
          v-if="index !== 5 && index !== 6 && index !== 9 && index !== 10 && activityModel.prize_name !== 0"
        >{{ imgLi.prize }}
        </span>
      </div>
      <section class="turn" ref="turn">
        <span class="text" v-if="startStatus === 1">
          立即抽奖
        </span>
        <span class="text" v-else-if="startStatus === 2">
          活动已结束
        </span>
        <span class="text" v-else>
          活动未开始
        </span>
      </section>
    </div>
    <!--<div class="score" v-if="false">我的积分 ：{{ credit1 }}{{love_word}}:{{love}}</div>-->
    <div class="score" v-if="activityModel.draw_type!=0">
      {{activityModel.draw_type==1 ? "我的积分" : love_word}}：{{ activityModel.draw_type==1 ? credit1 : love }}
    </div>
    <div class="prizers" v-if="activityModel.is_roster">
      <div class="prizeBar">
        <img src="../../assets/images/lottery/prizers.png" alt=""/>
      </div>
      <div class="prizer">
        <div class="prizeIcon">
          <img src="../../assets/images/lottery/prizeIcon.png" alt=""/>
        </div>
        <div class="prizerList" id="prizerList">
          <ul id="prizerList1">
            <template v-for="(item, index) in prizers">
              <li v-if="item.member" :key="index">
                <span>{{ item.member.nickname }}</span>
                <span> 抽中了{{ item.prize_name }}，</span>
                <span class="prizeName" v-if="item.point != 0">
                获得 {{item.point + point_word}}
              </span>
                <span class="prizeName" v-else-if="item.love != 0">
                获得 {{item.love + love_word}}
              </span>
                <span class="prizeName" v-else-if="item.amount != 0">
                获得 {{item.amount + amount_word}}
              </span>
                <span class="prizeName" v-else-if="item.has_one_coupon">
                获得 {{item.has_one_coupon.name}}（优惠券）
              </span>
              </li>
            </template>
          </ul>
          <ul id="prizerList2"></ul>
        </div>
      </div>
    </div>

    <div class="info">
      <div class="title">
        <div class="squire squire1">
          <img src="../../assets/images/lottery/three.png" alt=""/>
        </div>
        <span>活动说明</span>
        <div class="squire squire2">
          <img src="../../assets/images/lottery/three.png" alt=""/>
        </div>
      </div>
      <div class="infoContent">
        <ul>
          <li v-if="activityModel.name">{{ activityModel.name }}</li>
          <!--<li v-if="activityModel.countdown_time">{{ activityModel.countdown_time }}</li>-->
          <li v-if="activityModel.content">
            <template>
              <div v-html="activityModel.content"></div>
            </template>
          </li>
        </ul>
      </div>
    </div>

    <div class="massage" v-show="prizeInfoShow" @touchmove="touchMove($event)">
      <div class="noPrize" v-if="noPrizeShow">
        <div class="close" @click="close()">
          <img src="../../assets/images/lottery/close.png" alt=""/>
        </div>
        <p>{{empty_prize_prompt || "很遗憾，您没有中奖"}}</p>
        <div class="xiaofu">
          <!--<img src="/addons/yun_shop/static/img/lottery/noprizeXF.png" alt="">-->
          <img src="../../assets/images/lottery/noprizeXF.png" alt=""/>
        </div>
        <div class="btn" @click="goIndex" v-if="activityModel.jump_type == 1">
          去逛逛吧
        </div>
      </div>
      <!--<img src="/addons/yun_shop/static/img/lottery/circleLight.png" class="circleLight" v-if="havePrizeShow" alt="">-->
      <img
        src="../../assets/images/lottery/circleLight.png"
        class="circleLight"
        v-if="havePrizeShow"
        alt=""
      />
      <div class="havePrize" v-if="havePrizeShow">
        <!--<div class="oneBar">-->
        <!--<img src="../../assets/images/lottery/yellowCycle.png" />-->
        <!--</div>-->
        <p>恭喜您抽中{{ prizeName }}</p>
        <div class="proImg">
          <img :src="prizeUrl" alt=""/>
        </div>
        <div class="btn" @click="close('success')">
          <a>立即领取</a>
        </div>
      </div>
      <div class="haveLottery" v-if="haveLottery">
        <div class="close" @click="close()">
          <img src="../../assets/images/lottery/close.png" alt=""/>
        </div>
        <div class="xiaofu">
          <!--<img src="/addons/yun_shop/static/img/lottery/receivedXF1.png" alt="">-->
          <img src="../../assets/images/lottery/receivedXF1.png" alt=""/>
        </div>
        <p>您已经抽过奖啦，不要太贪心哦！</p>
        <div class="btn" @click="close()">
          我知道啦
        </div>
      </div>
    </div>

    <div class="home_box" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" @click.stop="showToolbar"
         style="bottom: 4.1875rem;">
      <div class="y6" v-show="toolbar">
        <router-link class="y8" :to="fun.getUrl('home')">
          首页
        </router-link>
        <router-link class="yb" :to="fun.getUrl('member')">
          我的
        </router-link>
        <i class="yd"></i>
      </div>
    </div>
    <van-popup v-model="show" position="top"
               closeable
               close-icon="close"
               :style="{ height: '100%' }" v-if="goods">
      <div class="van-content">
        <div style="height: 2rem; display: flex; justify-content: center; align-items: center;">选择商品</div>
        <van-radio-group v-model="radio" checked-color="#f15353">
          <van-radio :name="item.id" v-for="(item,index) in goods" :key="index" class="radio">
            <div style="display: flex; align-items: center;">
              <div class="avatar">
                <img :src="item.thumb">
              </div>
              <div style="margin-left: 1rem;">{{item.title}}</div>
            </div>
          </van-radio>
        </van-radio-group>
        <div class="button" @click="confirmGoods">
          确定
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import lottery_controller from "./lottery_controller";

export default lottery_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .van-content {
    padding: 1rem;
    position: relative;

    .button {
      position: fixed;
      bottom: 1rem;
      width: 21.5625rem;
      height: 2.875rem;
      background-color: #f15353;
      border-radius: 0.375rem;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .radio {
      margin-bottom: 1rem;
      display: flex;
      width: 100%;
    }

    .avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .wap {
    .home_box {
      position: fixed;
      z-index: 1000;
      right: 0;
      bottom: 3.75rem;
      width: 2.25rem;
      height: 2.25rem;
      background: rgba(0, 0, 0, 0.8) url(//static-o2o.360buyimg.com/daojia/new/images/menu/bm.png) 0.4375rem 0.4375rem no-repeat;
      background-size: 4.0625rem 1.25rem;
      border: 0.0625rem solid #757575;
      border-radius: 0.25rem 0 0 0.25rem;

      &.pcStyle {
        right: 35.5%;
      }
    }

    .y6 {
      position: absolute;
      right: -0.0625rem;
      bottom: 2.625rem;
      width: 5.9375rem;
      border: 0.0625rem solid #757575;
      background: rgba(0, 0, 0, 0.8);
    }

    .y6 a {
      display: block;
      padding-left: 1.375rem;
      border-bottom: 0.0625rem solid #4b4b4b;
      line-height: 2.1875rem;
      height: 2.1875rem;
      color: #fff;
      background-image: url(//static-o2o.360buyimg.com/daojia/new/images/icon/bmenu.png);
      background-repeat: no-repeat;
      background-size: 1rem 18.75rem;
    }

    .y8 {
      background-position: 0.625rem -3.125rem;
    }

    .yb {
      background-position: 0.625rem -12.5rem;
    }

    .yd {
      position: absolute;
      bottom: -0.75rem;
      right: 0.625rem;
      width: 0;
      height: 0;
      z-index: 15;
      border-width: 0.375rem;
      border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
      border-style: solid;
    }

    /* background: url("../../assets/img/page_bg.png") no-repeat; */

    /* background-color: #f73d3d; */
    background:
      linear-gradient(
        rgba(255, 70, 63, 0.88),
        #f73d3d
      );

    .logo {
      position: absolute;
      top: 1rem;
      left: 1rem;
      width: 2rem;
      height: 2rem;
      z-index: 2;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      &.pcStyle {
        left: 38%;
      }
    }

    .banner {
      width: 100%;
      height: 10rem;
      position: relative;

      .bannerImg {
        width: 100%;
        height: auto;
      }

      .prizeInfoBtn {
        width: 6.25rem;
        height: 4rem;
        position: absolute;
        top: 0;
        right: 0;

        .prizeInfoBtnImg {
          width: 6.25rem;
          height: 4rem;
        }

        img {
          width: 100%;
        }
      }

      .priceChanceBtn {
        // width: 3.1rem;
        height: 2.2rem;
        border-radius: 1rem;
        background-color: #ff9600;
        position: absolute;
        bottom: -1rem;
        left: 50%;
        transform: translateX(-50%);
        line-height: 2.1rem;
        font-size: 1.1rem;
        color: #fff;
        font-weight: 500;
        text-align: center;
        padding: 0.2rem 1rem;
      }

      .whiteBar {
        position: absolute;
        z-index: 0;
        transform: rotate(-30deg);

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }

    overflow: hidden;

    .box {
      margin: 2.8rem auto 1.4rem;
      width: 21rem;
      height: 21rem;
      // padding: 1rem;
      background-color: #fff;
      border: 0.5rem solid transparent;
      border-radius: 0.7rem;
      box-sizing: border-box;
      position: relative;

      /* display: flex; */

      /* flex-wrap: wrap; */

      /* background: linear-gradient(white, white) padding-box,
        repeating-linear-gradient(45deg, rgba(255, 212, 0, 0.67) 0%, #ffd400 4.6%, #f73d3d 0, #f73d3d 10%) 0 / 6.9rem 6.9rem; */
      div {
        background-size: 100%;
        width: 4.6rem;
        height: 4.6rem;
        float: left;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        position: relative;

        &:nth-child(4n) {
          margin-right: 0;
        }

        &:nth-child(8) {
          margin-left: 0.73rem;
        }

        &:nth-child(12) {
          margin-left: 0.15rem;
        }

        box-sizing: border-box;

        img {
          width: 60%;
          height: 60%;
          position: absolute;
          top: 38%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .activeNameImg {
          width: 75%;
          height: 75%;
          top: 47%;
          left: 51%;
        }
      }

      .title {
        color: #666;
        width: 82%;
        font-size: 12px;
        text-align: center;
        position: absolute;
        bottom: 9%;
        left: 9%;
        white-space: nowrap;
        overflow: hidden;
        word-break: break-all;
      }

      .prizeBtn1,
      .prizeBtn3 {
        margin: 0.31rem 0 0 0.31rem;
      }

      .prizeBtn2 {
        margin: 0.31rem 0 0 0;
      }

      .prizeBtn3,
      .prizeBtn4 {
        margin-top: -0.31rem;
      }

      .turn {
        width: 8rem;
        height: 8rem;
        font-size: 1.2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .text {
        color: white;
        line-height: 8rem;
      }
    }

    .score {
      color: #fff;
      font-size: 16px;
    }

    .prizers {
      height: 16rem;
      width: 21rem;
      position: relative;
      margin: 1rem auto 0.5rem;

      .prizeBar {
        height: 1rem;
        width: 21rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .prizer {
        width: 19rem;
        height: 13rem;
        background-color: #fff;
        position: absolute;
        top: 0.5rem;
        left: 1rem;
        padding: 0.5rem 0.2rem 0.45rem;
        overflow: hidden;
        box-sizing: border-box;

        .prizeIcon {
          width: 18.7rem;
          height: 2rem;
          margin-bottom: 1rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
        // .swiper-container {
        .prizerList {
          z-index: 0;
          height: 9rem;
          overflow: hidden; // .swiper-slide {
          li {
            line-height: 1.5rem;
            font-size: 12px;
            color: #232323; // margin-bottom: .2rem;
            overflow: hidden;
            display: flex;

            span {
              &:first-child {
                display: block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                /* float: left; */
                margin-right: 0.2rem;

                /* width: 4rem; */
                flex: 1;

                /* text-align: justify; //两端对齐 */

                /* text-align-last: justify; */
              }

              /* &:nth-child(2) { */

              /* float: left; */

              /* width: 4rem; */

              /* flex:2; */

              /* } */
              &:last-child {
                /* float: right; // display: inline-block; */
                text-align: left;
                display: -webkit-box;
                word-break: break-all;
                text-overflow: ellipsis;
                overflow: hidden;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;

                /* width: 3rem; */
                flex: 2;
              }
            }
          }
        }
      }
    }

    .info {
      // width:6.9rem;
      // margin: 0 auto;
      .title {
        width: 9.5rem;
        height: 1.2rem;
        position: relative;
        overflow: hidden;
        margin-left: 50%;
        transform: translateX(-50%);
        vertical-align: middle;

        .squire1 {
          float: left;
        }

        .squire2 {
          float: right;
        }

        .squire {
          width: 2rem;
          height: 1.2rem;

          img {
            display: inline-block;
            line-height: 1.2rem;
            width: 1.2rem;
            height: 0.3rem;
            vertical-align: middle;
          }
        }

        span {
          display: block;
          position: absolute;
          text-align: center; //两端对齐
          text-align-last: justify;
          width: 5em;
          left: 50%;
          transform: translateX(-50%);
          font-size: 1rem;
          color: #fff;
          font-weight: 700;
          float: left;
          line-height: 1.2rem;
        }
      }

      .infoContent {
        width: 20rem;
        height: auto;
        margin: 1rem 2rem;
        background-color: rgba(255, 255, 255, 0.25);
        padding: 1rem;
        box-sizing: border-box;
        word-break: break-all;

        ul {
          margin-left: 0.3rem;

          li {
            //  list-style-image: url('../../assets/img/lottery/point.png');
            list-style-type: disc;
            list-style-position: outside;
            font-size: 14px;
            color: #fff;
            text-align: left;
            margin-bottom: 0.5rem;
            position: relative;

            img {
              position: absolute;
              top: 0.15rem;
              left: 0.1rem;
              width: 0.1rem;
              height: 0.1rem;
              float: left;
              margin-right: 0.1rem;
              vertical-align: middle;
            }
          }
        }
      }
    }

    .massage {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;

      .noPrize {
        width: 18rem;
        height: 10rem;
        background-color: #fff;
        position: absolute;
        top: 10rem;
        left: 2.8rem;
        border-radius: 0.4rem;

        .close {
          position: absolute;
          width: 1.5rem;
          height: 1.5rem;
          left: 8.3rem;
          bottom: -2rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        p {
          font-size: 16px;
          color: #707070;
          margin: 0.38rem auto 0.2rem;
          text-align: center;
        }

        .xiaofu {
          width: 5rem;
          height: 5rem;
          border-radius: 100%;
          margin: 0 auto 0.3rem;

          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }

        .btn {
          width: 5rem;
          height: 2rem;
          margin: 0 auto;
          background: url("../../assets/images/lottery/btn.png") no-repeat;
          background-size: 5rem 1.5rem;
          font-size: 14px;
          color: #fff;
          line-height: 1.5rem;
          text-align: center;
          font-weight: 600;
        }
      }

      .haveLottery {
        width: 20rem;
        height: 10rem;
        background-color: #fff;
        position: absolute;
        top: 12rem;
        left: 1.8rem;
        border-radius: 0.4rem;

        .close {
          position: absolute;
          width: 1.5rem;
          height: 1.5rem;
          top: -0.8rem;
          right: -0.8rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .xiaofu {
          width: 4rem;
          height: 4rem;
          margin: 1rem auto 0.2rem;

          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }

        p {
          font-size: 16px;
          color: #707070;
          margin: 0.21rem auto 0.37rem;
          text-align: center;
        }

        .btn {
          width: 5rem;
          height: 2rem;
          margin: 0 auto;
          background: url("../../assets/images/lottery/btn.png") no-repeat;
          background-size: 5rem 1.5rem;
          font-size: 14px;
          color: #fff;
          line-height: 1.5rem;
          text-align: center;
          font-weight: 600;
        }
      }

      .circleLight {
        width: 21rem;
        height: 21rem;
        position: absolute;
        top: 7rem;
        left: 50%;
        margin-left: -10.5rem;
        -webkit-animation: rotate 20s infinite linear;
        animation: rotate 20s infinite linear;
        transform-origin: 50% 50%;
      }

      @-webkit-keyframes rotate {
        0% {
          -webkit-transform: rotate(0deg);
        }

        100% {
          -webkit-transform: rotate(360deg);
        }
      }

      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }

        100% {
          transform: rotate(360deg);
        }
      }

      .havePrize {
        width: 18rem; // height: 6.1rem;
        padding-bottom: 0.5rem;
        border-radius: 0.4rem;
        position: absolute;
        top: 11rem;
        left: 50%;
        transform: translateX(-50%);

        /* background: #fff url('../../assets/images/lottery/prizinig.png') no-repeat; */

        /* background-position: top center; */

        /* background-size: 5.3rem 1.42rem; */
        background: #fff;

        .oneBar {
          width: 1.2rem;
          height: 0.46rem;
          position: absolute;
          top: -0.1rem;
          right: 1.1rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        p {
          padding: 0 0.1rem;
          font-size: 14px;
          color: #707070;
          font-weight: 600;
          margin: 1.72rem auto 0.2rem;
          text-align: center;
        }

        .proImg {
          width: 8rem;
          height: auto;
          margin: 0.5rem auto;

          img {
            width: 100%;
            height: auto;
          }
        }

        .btn {
          width: 5rem;
          height: 2rem;
          margin: 0 auto;
          background: url("../../assets/images/lottery/btn.png") no-repeat;
          background-size: 5rem 1.5rem;
          text-align: center;

          a {
            font-size: 14px;
            color: #fff;
            line-height: 1.5rem;
            text-align: center;
            font-weight: 600;
          }
        }
      }
    }
  }
</style>
