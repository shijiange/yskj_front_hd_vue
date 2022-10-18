<template>
  <div id="Activity">
    <c-title :hide="false" :text="Data.name"> </c-title>
    <div class="content_box">
      <div
        class="top_music"
        v-if="Data.audio_link"
        :style="{
          width: fun.getPhoneEnv() == 3 ? '375px' : `${clientWidths}px`
        }"
      >
        <i class="iconfont icon-active_music_open xuanzhuan" @click.stop="play()" v-show="!songStop"></i>
        <i class="iconfont icon-active_music_close" @click.stop="play()" v-show="songStop"></i>
      </div>

      <audio id="audio" ref="audio" loop="loop" @loadedmetadata="onLoadedmetadata" controls="controls" autoplay preload :src="Data.audio_link" style="display: none;"></audio>

      <div class="banner">
        <img :src="Data.background_thumb" />
      </div>
      <!-- 联盟商家 -->
      <div class="business_box" v-if="Date.parse(new Date()) / 1000 >= Data.star_time">
        <div class="title">
          <div class="left"></div>
          <h2>活动倒计时</h2>
          <div class="right"></div>
        </div>
        <div class="title_b">
          <p>距离活动结束</p>
          <p class="orange">{{ Data.end_date }}</p>
        </div>
        <div class="number_time">
          <p class="active_time" v-show="!stop">
            <span>{{ Day }}</span
            ><em>天</em> <span>{{ Hour }}</span
            ><em>:</em> <span>{{ Min }}</span
            ><em>:</em>
            <span>{{ Sec }}</span>
          </p>
        </div>
        <div class="business bottom-line" v-if="buy_count">
          <p>
            已购<span>{{ buy_count }}</span
            >人
          </p>
        </div>
        <div class="business">
          <p style="line-height: 2rem;">
            <span>{{ browse_count }}</span
            >人浏览
          </p>
        </div>
        <div class="user">
          <div class="img" v-for="(list, index) in browse_member" :style="{ zIndex: index, right: `${index * 24 + 5}px` }" :key="index">
            <template v-if="list.member && list.member.avatar_image">
              <img :src="list.member.avatar_image" alt="" />
            </template>
          </div>
        </div>
      </div>

      <div class="business_box" v-else>
        <div class="title">
          <div class="left"></div>
          <h2>活动倒计时</h2>
          <div class="right"></div>
        </div>
        <div class="title_b">
          <p>距离活动开始</p>
          <p class="orange">{{ Data.star_date }}</p>
        </div>
        <div class="number_time">
          <p class="active_time" v-show="!stop">
            <span>{{ Day }}</span
            ><em>天</em> <span>{{ Hour }}</span
            ><em>:</em> <span>{{ Min }}</span
            ><em>:</em>
            <span>{{ Sec }}</span>
          </p>
        </div>
        <!--<div class="business bottom-line" v-if="buy_count">-->
        <!--<p>-->
        <!--已购<span>{{ buy_count }}</span-->
        <!--&gt;人-->
        <!--</p>-->
        <!--</div>-->
        <div class="business">
          <p style="line-height: 2rem;">
            <span>{{ browse_count }}</span
            >人浏览
          </p>
        </div>
        <div class="user">
          <div class="img" v-for="(list, index) in browse_member" :style="{ zIndex: index, right: `${index * 24 + 5}px` }" :key="index">
            <template v-if="list.member && list.member.avatar_image">
              <img :src="list.member.avatar_image" alt="" />
            </template>
          </div>
        </div>
      </div>

      <!-- 最新购买列表  -->
      <div class="ranking_list" v-if="Data.order_list == 1">
        <div class="title">
          <div class="left"></div>
          <h2>最新购买列表</h2>
          <div class="right"></div>
        </div>
        <div class="business bottom-line" style="text-align: center;">
          <p>
            共<span>{{ buy_count }}</span
            >人参与购买
          </p>
        </div>
        <div class="store_list" ref="store1">
          <van-swipe vertical height="65" :autoplay="4000" :initial-swipe="0" :show-indicators="false" :touchable="false" ref="swipe1" @change="swipeToTop">
            <van-swipe-item v-for="(item, i) in orders" :key="i">
              <div class="header_box">
                <div class="header">
                  <img :src="!fun.isTextEmpty(item.belongs_to_member) ? item.belongs_to_member.avatar_image : ''" />
                </div>
                <div class="content">
                  <div class="left" v-if="item.belongs_to_member">
                    <span class="name">{{ !fun.isTextEmpty(item.belongs_to_member) ? item.belongs_to_member.nickname : "" }}</span>
                    <span>{{ item.belongs_to_member.mobile }}</span>
                  </div>
                  <div class="right">
                    <span class="money">{{ $i18n.t("money") }}{{ item.price }} {{ item.status_name }}</span>
                    <span class="time">{{ item.create_time }}</span>
                  </div>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <!-- 领红包排行榜  -->
      <div class="ranking_list" v-if="Data.award_list == 1">
        <div class="title">
          <div class="left"></div>
          <h2>领取奖励列表</h2>
          <div class="right"></div>
        </div>
        <div class="business bottom-line" style="text-align: center;">
          <p>
            共<span>{{ award_count }}</span
            >人参与
          </p>
        </div>
        <div class="store_list" ref="store">
          <van-swipe vertical height="65" :autoplay="4000" :initial-swipe="0" :show-indicators="false" :touchable="false" ref="swipe" @change="swipeToTop">
            <van-swipe-item v-for="(item, i) in commission_amount" :key="i">
              <div class="header_box">
                <div class="header" v-if="item.has_one_member">
                  <img :src="!fun.isTextEmpty(item.has_one_member) ? item.has_one_member.avatar : ''" />
                </div>
                <div class="content">
                  <div class="left" v-if="item.has_one_member">
                    <span class="name">{{ !fun.isTextEmpty(item.has_one_member) ? item.has_one_member.nickname : "" }}</span>
                    <span>{{ item.has_one_member.mobile }}</span>
                  </div>
                  <div class="right">
                    <span class="money">{{ $i18n.t("money") }}{{ item.amount }} 已领取</span>
                    <span class="time">{{ item.created_at }}</span>
                  </div>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <!-- 活动规则 -->
      <div class="active_rule">
        <div class="title">
          <div class="left"></div>
          <h2>活动介绍</h2>
          <div class="right"></div>
        </div>
        <div class="text_down">
          <div id="rule_text" style="padding:0;" :class="{ overhidden: !showAll }" v-html="Data.agreement"></div>
          <i class="iconfont icon-down" v-show="!showAll" @click="showAll = true"></i>
          <i class="iconfont icon-up" v-show="showAll" @click="showAll = false"></i>
        </div>
      </div>
      <!-- 悬浮按钮 -->
      <div class="store_into">
        <div class="fixed-box" @click="getPosterImage" v-if="poster_open == 1">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/qrcode_icon.png" alt="" />
          <span class="text" style="color: #ff7474;">推广海报</span>
        </div>
        <div class="fixed-box" @click="linkTo">
          <img src="../../assets/images/contact@2x.png" alt="" />
          <span class="text blue">联系商家</span>
        </div>
        <div class="fixed-box" @click="linkTo('order')">
          <img src="../../assets/images/my_order@2x.png" alt="" />
          <span class="text orange">{{ fun.isTextEmpty(Data.button_name) ? "我的订单" : Data.button_name }}</span>
        </div>
        <div class="fixed-box" @click="linkTo('member')">
          <img src="../../assets/images/my_member@2x.png" alt="" />
          <span class="text yellow">{{ fun.isTextEmpty(Data.button_name) ? "会员中心" : Data.button_name }}</span>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div
        class="bottom_btn"
        :style="{
          width: fun.getPhoneEnv() == 3 ? '375px' : `${clientWidths}px`
        }"
        @click.stop="toGoods"
      >
        <button type="button">立即参与</button>
      </div>

      <van-popup v-model="show">
        <div class="popop-box">
          <div class="popup-content">
            <div class="popup-head">
              <!--<p>在线客服：悠悠我心</p>-->
              <a :href="'tel:' + Data.service_mobile">
                <div class="green">
                  <img src="../../assets/images/phone@2x.png" alt="" />
                  <span>一键拨打</span>
                </div>
              </a>
            </div>
            <div class="qr">
              <img class="code" :src="Data.service_qr" alt="" />
              <span>长按识别 二维码联系我们</span>
            </div>
          </div>
          <div class="close" @click="show = false">
            <img src="../../assets/images/close@2x.png" alt="" />
          </div>
        </div>
      </van-popup>

      <van-popup v-model="poster_show">
        <div class="popop-box" style="height: 36rem;">
          <div class="popup-content" style="height: auto; overflow: hidden;">
            <img :src="poster_url" alt="" style="max-height: 100%; max-width: 100%;display:block;" />
          </div>
          <div class="close" @click="poster_show = false">
            <img src="../../assets/images/close@2x.png" alt="" />
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import Activity_controller from "./activity_detail_controller";

export default Activity_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#Activity {
  padding-bottom: 100px;
  width: 100%;

  .van-popup {
    border-radius: 10px;
    background: transparent;
  }

  .popop-box {
    width: 20rem;
    height: 26rem;
    margin: 0 auto;
    border-radius: 10px;

    .popup-content {
      background: red;
      width: 20rem;
      height: 22rem;
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

    .close {
      position: absolute;
      bottom: 0;
      left: calc(50% - 1rem);

      img {
        width: 2rem;
        height: 2rem;
      }
    }
  }

  .content_box {
    .top_music {
      z-index: 10;
      position: fixed;
      top: 2.5rem;
      background: rgba(0, 0, 0, 0.5);
      height: 2.5rem;
      line-height: 2.5rem;
      width: 100%;
      padding: 0 0.625rem;
      text-align: right;

      .icon-active_music_open {
        font-size: 2.25rem;
        color: #fff;
        display: block;
        position: absolute;
        right: 0.2rem;
      }

      .icon-active_music_close {
        font-size: 2.25rem;
        color: #fff;
        display: block;
        position: absolute;
        right: 0.2rem;
      }

      .xuanzhuan {
        animation: xz 2s linear infinite;
      }

      @keyframes xz {
        from {
          transform: rotate(0deg);
        }

        to {
          transform: rotate(360deg);
        }
      }
    }

    .banner {
      overflow: hidden;
      margin: 0 auto;
      padding: 0;

      img {
        width: 100%;
      }
    }

    .member-people {
      width: 12rem;
      overflow: hidden;
      background-color: rgba(0, 0, 0, 0.2);
      margin: 0 auto;
      margin-top: 1.25rem;
      border-radius: 16px;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-size: 14px;
        color: #fff;
      }
    }

    .number_time {
      margin: 1.5rem auto;
      align-items: center;
      background-size: 22.5rem 6.4375rem;
      color: #333;
      font-size: 14px;
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
          font-size: 24px;
          font-weight: bold;
          background-color: #f2f4f7;
          padding: 1rem;
          border-radius: 12px;
        }

        em {
          font-weight: bold;
          display: inline-block;
          padding: 0 0.5rem;
        }
      }
    }

    .business {
      margin: 1rem;
      text-align: left;
      color: #666;

      span {
        color: #ff812d;
      }
    }

    .bottom-line {
      padding-bottom: 1rem;
      border-bottom: 1px solid #ebebeb;
    }

    .business_box {
      background: #fff;
      width: 21.5625rem;
      margin: 0 auto;
      margin-top: 1.25rem;
      border-radius: 0.5rem;
      padding-bottom: 0.9375rem;
      position: relative;

      .title {
        height: 3.125rem;
        display: flex;
        align-items: center;
        justify-content: center;

        h2 {
          font-size: 20px;
          color: #2748d7;
          margin: 0 1.25rem;
        }

        .left {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/title_img@2x.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }

        .right {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/title_img@2x.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }
      }

      .title_b {
        display: flex;
        margin: 0 1rem;

        p {
          flex: 1;
          text-align: left;
        }

        .orange {
          text-align: right;
          color: #ff812d;
        }
      }

      .user {
        /* display: flex; */

        /* flex-wrap: wrap; */
        .img {
          width: 3rem;
          height: 3rem;
          border-radius: 1.5rem;
          margin: 0 auto;
          overflow: hidden;
          background: #f2f2f2;
          position: absolute;
          bottom: 20px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .ranking_list {
      background: #fff;
      width: 21.5625rem;
      margin: 1.25rem auto 0;
      border-radius: 0.5rem;
      padding-bottom: 0.9375rem;

      .title {
        height: 3.125rem;
        display: flex;
        align-items: center;
        justify-content: center;

        h2 {
          font-size: 20px;
          color: #2748d7;
          margin: 0 1.25rem;
        }

        .left {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/title_img@2x.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }

        .right {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/title_img@2x.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }
      }

      .store_list {
        padding: 0 0.9375rem;
        height: 17.5rem;
        overflow: hidden;

        /* overflow-y: scroll; */
        .header_box {
          display: flex;
          align-items: center;
          position: relative;
          font-size: 14px;
          height: 70px;

          .header {
            flex: 0 0 3rem;
            width: 3rem;
            height: 3rem;
            border-radius: 1.5rem;
            overflow: hidden;
            border: solid 0.0625rem #ccc;
            margin-right: 0.625rem;

            img {
              width: 100%;
            }
          }

          .content {
            flex: 1;
            display: flex;

            span {
              padding: 0.3rem 0;
            }
          }

          .left {
            text-align: left;
          }

          .right {
            text-align: right;
          }

          .left,
          .right {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .time {
            font-size: 12px;
            color: #999;
          }

          .money {
            color: #ff812d;
          }

          .name,
          .money {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 8rem;
          }
        }

        .blank {
          height: 60px;
        }
      }
    }

    .active_rule {
      background: #fff;
      width: 21.5625rem;
      margin: 1.25rem auto 0;
      border-radius: 0.5rem;

      .title {
        height: 3.125rem;
        display: flex;
        align-items: center;
        justify-content: center;

        h2 {
          font-size: 20px;
          color: #2748d7;
          margin: 0 1.25rem;
        }

        .left {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/title_img@2x.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }

        .right {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/title_img@2x.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }
      }

      #rule_text {
        padding: 0 1.25rem;
        text-align: left;
        color: #666;
        line-height: 1.375rem;
      }

      .iconfont {
        width: 2.5rem;
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 24px;
        color: #ccc;
        margin: 0.625rem auto 0;
        display: block;
      }
    }

    .store_into {
      position: fixed;
      right: 0;
      top: 60%;
      z-index: 999;

      .fixed-box {
        padding: 0.2rem 0.5rem;
        background-color: #fff;
        border-radius: 22px 0 0 22px;
        opacity: 0.8;
        display: flex;
        margin-bottom: 1rem;

        img {
          width: 2rem;
          height: 2rem;
          margin-right: 0.5rem;
        }

        .text {
          width: 2rem;
          font-size: 12px;
        }
      }

      .blue {
        color: #2892ff;
      }

      .orange {
        color: #ff8229;
      }

      .yellow {
        color: #ffb126;
      }
    }

    .bottom_btn {
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 999;

      button {
        width: 100%;
        height: 3.125rem;
        background: #58c232;
        font-size: 18px;
        color: #fff;
        border: none;
      }
    }
  }
}

.overhidden {
  height: 5.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}
</style>
