<template>
  <div id="Activity">
    <c-title :hide="false"
             :text="Data.name"> </c-title>
    <div class="content_box">
      <div class="top_music"
           v-if="Data.audio_link"
           :style="{
          width: fun.getPhoneEnv() == 3 ? '375px' : `${clientWidths}px`
        }">
        <i class="iconfont icon-active_music_open xuanzhuan"
           @click.stop="play()"
           v-show="!songStop"></i>
        <i class="iconfont icon-active_music_close"
           @click.stop="play()"
           v-show="songStop"></i>
      </div>
      <audio id="audio"
             ref="audio"
             loop="loop"
             @loadedmetadata="onLoadedmetadata"
             controls="controls"
             autoplay
             preload
             :src="Data.audio_link"
             style="display: none;"></audio>
      <div class="banner">
        <a :href="Data.link2">
          <img :src="Data.thumb" />
        </a>
      </div>
      <p class="member-people">
        <span>已参加活动人数{{ member_count }}人</span>
      </p>
      <div class="number_time"
           v-if="timeShow == 1">
        <p class="active_time"
           v-show="!stop">
          活动倒计时：
          <span>{{ Day }}</span>天 <span>{{ Hour }}</span>时 <span>{{ Min }}</span>分 <span>{{ Sec }}</span>秒
        </p>
        <p class="active_time"
           v-show="stop">
          <span>活动已结束</span>
        </p>
      </div>
      <!-- 联盟商家 -->
      <div class="business_box"
           v-if="Data.is_store == 1">
        <div class="title">
          <div class="left"></div>
          <h2>{{ fun.isTextEmpty(Data.s_name) ? "联盟商家" : Data.s_name }}</h2>
          <div class="right"></div>
        </div>
        <p class="title_b">商家排名不分前后</p>
        <div class="business">
          <van-swipe :loop="true"
                     :autoplay="4000"
                     :width="fun.getPhoneEnv() == 3 ? 375 : setWidth1">
            <van-swipe-item v-for="(item, index) in business"
                            :key="index">
              <div class="user_box">
                <div class="user"
                     @click="toPage(list)"
                     v-for="(list, i) in item[0]"
                     :key="i">
                  <div class="img">
                    <img :src="list.change_thumb" />
                  </div>
                  <span>{{ list.store_name || list.hotel_name }}</span>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <!-- 活动规则 -->
      <div class="active_rule"
           v-if="Data.is_rule == 1">
        <div class="title">
          <div class="left"></div>
          <h2>
            {{ fun.isTextEmpty(Data.rule_name) ? "活动规则" : Data.rule_name }}
          </h2>
          <div class="right"></div>
        </div>
        <div class="text_down">
          <div class="rule_text"
               :class="{ overhidden: !showAll }"
               v-html=" !fun.isTextEmpty(Data.rule_content)? replace(Data.rule_content)
                  : ''
             ">
          </div>
          <i class="iconfont icon-down"
             v-show="!showAll"
             @click="showAll = true"></i>
          <i class="iconfont icon-up"
             v-show="showAll"
             @click="showAll = false"></i>
        </div>
      </div>
      <!-- 免单详情 -->
      <div class="free_detail"
           v-if="Data.is_wheel == 1">
        <div class="title">
          <div class="left"></div>
          <h2>
            {{
              fun.isTextEmpty(Data.wheel_name) ? "免单详情" : Data.wheel_name
            }}
          </h2>
          <div class="right"></div>
        </div>
        <div class="list_box">
          <van-swipe :show-indicators="false"
                     :autoplay="4000"
                     :loop="true"
                     :width="fun.getPhoneEnv() == 3 ? 375 : setWidth2">
            <van-swipe-item v-for="(item, index) in wheels"
                            :key="index">
              <div class="store_info">
                <div class="top">
                  <div class="img">
                    <img :src="item.has_one_store.change_thumb"
                         v-if="!fun.isTextEmpty(item.has_one_store)" />
                    <img :src="item.has_one_hotel.change_thumb"
                         v-if="fun.isTextEmpty(item.has_one_store)" />
                  </div>
                  <ul class="info">
                    <li>
                      <i class="iconfont icon-service_l"></i>
                      <span v-if="!fun.isTextEmpty(item.has_one_store)">{{
                        item.has_one_store.store_name
                      }}</span>
                      <span v-if="fun.isTextEmpty(item.has_one_store)">{{
                        item.has_one_hotel.hotel_name
                      }}</span>
                    </li>
                    <li>
                      <i class="iconfont icon-service_m"></i>
                      <span v-if="!fun.isTextEmpty(item.has_one_store)">{{
                        item.has_one_store.mobile
                      }}</span>
                      <span v-if="fun.isTextEmpty(item.has_one_store)">{{
                        item.has_one_hotel.mobile
                      }}</span>
                    </li>
                    <li>
                      <i class="iconfont icon-service_n"></i>
                      <span v-if="!fun.isTextEmpty(item.has_one_store)">{{
                        item.has_one_store.address
                      }}</span>
                      <span v-if="fun.isTextEmpty(item.has_one_store)">{{
                        item.has_one_hotel.address
                      }}</span>
                    </li>
                  </ul>
                  <div class="top_right">
                    {{ index + 1 }}/{{ wheels.length }}
                  </div>
                </div>
                <div class="store_banner">
                  <a :href="item.link">
                    <img :src="item.thumb" />
                  </a>
                </div>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
        <div class="look_detail">
          <div class="look_left"></div>
          <h2>点击查看详情</h2>
          <div class="look_left"></div>
        </div>
        <div class="look_bottom">
          <div class="left"></div>
          <div class="right"></div>
        </div>
      </div>
      <!-- 领红包排行榜 -->
      <div class="ranking_list"
           v-if="Data.is_ranking == 1">
        <div class="title">
          <div class="left"></div>
          <h2>
            {{ fun.isTextEmpty(Data.ranking) ? "佣金排行" : Data.ranking }}
          </h2>
          <div class="right"></div>
        </div>
        <div class="store_list"
             ref="store">‭19.6875‬
          <van-swipe vertical
                     height="80"
                     :autoplay="4000"
                     :initial-swipe="0"
                     :show-indicators="false"
                     :touchable="commission_amount.length >= 4 ? true : false"
                     ref="swipe"
                     @change="swipeToTop"
                     :width="fun.getPhoneEnv() == 3 ? 315 : setWidth2">
            <van-swipe-item v-for="(item, i) in commission_amount"
                            :key="i">
              <div class="header_box">
                <div class="header">
                  <img :src="
                      !fun.isTextEmpty(item.member) ? item.member.avatar : ''
                    " />
                </div>
                <span class="
                       name">{{
                    !fun.isTextEmpty(item.member) ? item.member.nickname : ""
                  }}</span>
                <span class="right">{{ item.total }}</span>
              </div>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <!-- 悬浮按钮 -->
      <div class="store_into"
           @click="linkTo">
        <div class="up animated bag">
          <span class="text">{{
            fun.isTextEmpty(Data.button_name) ? "商家入驻" : Data.button_name
          }}</span>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="bottom_btn"
           :style="{
          width: fun.getPhoneEnv() == 3 ? '375px' : `${clientWidths}px`
        }"
           @click.stop="toGoods">
        <button type="button">立即抢购</button>
      </div>
    </div>
  </div>
</template>

<script>
import Activity_controller from "./Activity_controller";
export default Activity_controller;
</script>
<style lang="scss" rel="stylesheet/scss">
#Activity {
  img {
    width: 100%;
  }
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
#Activity {
  padding-bottom: 136px;
  width: 100%;

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
      width: 21.5625rem;
      overflow: hidden;
      background: #f2f2f2;
      margin: 0 auto;

      a {
        width: 100%;
        height: 100%;
        display: block;
      }

      img {
        width: 100%;
        height: 100%;
        display: block;
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
      width: 22.5rem;
      height: 5.9rem;
      margin: 0 auto;
      margin-top: 1.25rem;
      align-items: center;
      background-image: url(../../assets/images/number_time_bg.png);
      background-repeat: no-repeat;
      background-size: 22.5rem 6.4375rem;
      color: #fff;
      font-size: 14px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;

      .active_number {
        span {
          color: #fca232;
        }
      }

      .active_time {
        display: flex;
        align-items: center;
        justify-content: center;

        span {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
      }
    }

    .business_box {
      background: #fff;
      width: 21.5625rem;
      margin: 0 auto;
      margin-top: 1.25rem;
      border-radius: 0.5rem;
      padding-bottom: 0.9375rem;

      .title {
        height: 3.125rem;
        display: flex;
        align-items: center;
        justify-content: center;

        h2 {
          font-size: 20px;
          color: #f7806c;
          margin: 0 1.25rem;
        }

        .left {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/business_title_left.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }

        .right {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/business_title_right.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }
      }

      .title_b {
        font-size: 14px;
        color: #8c8c8c;
      }

      .business {
        margin-top: 0.9375rem;

        .user_box {
          display: flex;
          flex-wrap: wrap;

          .user {
            width: 20%;
            margin-bottom: 1.625rem;

            .img {
              width: 3rem;
              height: 3rem;
              border-radius: 1.5rem;
              margin: 0 auto;
              overflow: hidden;
              background: #f2f2f2;

              img {
                width: 100%;
                height: 100%;
              }
            }

            span {
              line-height: 1.5rem;
              display: block;
              word-break: break-word;
              padding: 0 0.25rem;
            }
          }
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
          color: #f7806c;
          margin: 0 1.25rem;
        }

        .left {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/business_title_left.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }

        .right {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/business_title_right.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }
      }

      .rule_text {
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

    .free_detail {
      background: #fff;
      width: 21.5625rem;
      margin: 1.25rem auto 0;
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
          color: #f7806c;
          margin: 0 1.25rem;
        }

        .left {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/business_title_left.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }

        .right {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/business_title_right.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }
      }

      .list_box {
        width: 19.6875rem;
        margin: 0.9375rem auto 0;

        .store_info {
          .top {
            display: flex;
            position: relative;

            .img {
              img {
                width: 100%;
                width: 3.75rem;
                height: 3.75rem;
                border-radius: 1.875rem;
                border: solid 0.0625rem #ccc;
                margin-right: 0.625rem;
              }
            }

            .info {
              overflow: hidden;
              width: 12.5rem;

              li {
                display: flex;
                line-height: 1.25rem;

                .iconfont {
                  margin-right: 0.25rem;
                  font-size: 1rem;
                }

                span {
                  text-align: left;
                }
              }
            }

            .top_right {
              position: absolute;
              right: 0;
              color: #fca232;
            }
          }

          .store_banner {
            margin-top: 1.25rem;
            width: 100%;
            background: #f2f2f2;
            border-radius: 0.375rem;
            overflow: hidden;

            img {
              width: 100%;
            }
          }
        }
      }

      .look_detail {
        height: 2.5rem;
        line-height: 2.5rem;
        color: #8c8c8c;
        display: flex;
        justify-content: center;
        align-items: center;

        h2 {
          font-weight: normal;
          margin: 0 1.25rem;
        }

        .look_left {
          width: 1.5rem;
          height: 0.375rem;
          background-image: url(../../assets/images/look_left.png);
          background-size: 1.5rem 0.375rem;
          background-repeat: no-repeat;
        }
      }

      .look_bottom {
        position: absolute;
        bottom: -2.375rem;
        display: flex;
        justify-content: space-between;
        padding: 0 1.25rem;
        width: 100%;

        .left,
        .right {
          width: 1rem;
          height: 3.375rem;
          background-image: url(../../assets/images/look_bottom.png);
          background-size: 1rem 3.375rem;
          background-repeat: no-repeat;
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
          color: #f7806c;
          margin: 0 1.25rem;
        }

        .left {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/business_title_left.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }

        .right {
          width: 1.125rem;
          height: 0.6875rem;
          background-image: url(../../assets/images/business_title_right.png);
          background-repeat: no-repeat;
          background-size: 1.125rem 0.6875rem;
        }
      }

      .store_list {
        // padding: 0 0.9375rem;
        height: 17.5rem;
        width: 19.6875rem;
        margin: 0 auto;
        overflow: hidden;
        overflow-y: scroll;

        .header_box {
          display: flex;
          align-items: center;
          position: relative;
          border-bottom: solid 0.0625rem #ccc;
          font-size: 16px;
          height: 70px;

          .header {
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

          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 10rem;
            text-align: left;
            font-size: 14px;
          }

          .right {
            position: absolute;
            right: 1.5rem;
            font-size: 14px;
            color: #fca232;
          }
        }

        .blank {
          height: 60px;
        }
      }
    }

    .store_into {
      position: fixed;
      bottom: 5rem;
      left: 0.625rem;
      display: flex;

      .store_into {
        // width: 4.125rem;
        // padding: 0 1rem;
        // margin: 0 auto;
        // color: #fff;
        // font-size: 12px;
        // line-height: 0.75rem;
        // position: absolute;
        // bottom: 0.625rem;
        // left: 0.25rem;
      }

      .animated {
        -webkit-animation-duration: 2s;
        animation-duration: 2s; /* 动画时间 */
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both; /* 播放后的状态 */
      }

      .animated {
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite; /* 动作循环的次数：infinite 无限循环 */
      }

      .animated {
        -webkit-animation-duration: 2s;
        animation-duration: 2s; /* 动画时间 */
      }

      .up {
        -webkit-animation-name: upanimation;
        animation-name: upAnimation; /* 动画的名称 */
        -webkit-transform-origin: center bottom;
        transform-origin: center bottom; /* 设置动画旋转元素的基点为 */
        cursor: pointer;
      }

      .bag {
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url("../../assets/images/store_into.png");
        background-size: cover;
        width: 80px;
        height: 80px;

        .text {
          margin-left: 0.8rem;
          margin-top: 1.5rem;
          color: #fff;
          width: 2rem;
          font-size: 12px;
        }
      }

      @keyframes upAnimation {
        0%,
        100%,
        20%,
        50%,
        80% {
          -webkit-transition-timing-function:
            cubic-bezier(
              0.215,
              0.61,
              0.355,
              1
            );
          transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }

        40%,
        43% {
          -webkit-transition-timing-function:
            cubic-bezier(
              0.755,
              0.5,
              0.855,
              0.06
            );
          transition-timing-function: cubic-bezier(0.755, 0.5, 0.855, 0.06);
          -webkit-transform: translate3d(0, -30px, 0);
          transform: translate3d(0, -30px, 0);
        }

        70% {
          -webkit-transition-timing-function:
            cubic-bezier(
              0.755,
              0.05,
              0.855,
              0.06
            );
          transition-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
          -webkit-transform: translate3d(0, -15px, 0);
          transform: translate3d(0, -15px, 0);
        }

        90% {
          -webkit-transform: translate3d(0, -4px, 0);
          transform: translate3d(0, -4px, 0);
        }
      }
    }

    .bottom_btn {
      position: fixed;
      bottom: 0;
      width: 100%;

      button {
        width: 100%;
        height: 3.125rem;
        background: #f7806c;
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
