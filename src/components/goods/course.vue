<template>
  <div id="course" v-show="showGood" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
    <c-title :hide="false" text="课程详情"></c-title>
    <U_backup :btnFlag="true" :id="2" :datas="btnData2" :poster="1" @poster="postShow()"></U_backup>
    <yz-goodsposter v-model="posterShow" :posterData="isFrontCanvas ? posterImg : {}" :defaultImg="!isFrontCanvas ? posterImg : ''" :goodstype="true"></yz-goodsposter>
    <div :class="[actionSheetShow || rewardMoneyBtn || rewardShow ? 'noScroll' : '']">
      <!-- <div class="spare"></div> -->
      <div class="course-div">
        <!--[#86680] styleSetOptions.buy_now_button == 0，则后台隐藏立即购买样式， 显示以视频封面为背景-->
        <div class="box01" :class="{ 'video-cover-main': !Number(styleSetOptions.buy_now_button) }" v-if="is_show">
          <template v-if="Number(styleSetOptions.buy_now_button)">
            <ul class="title" style="padding-top: 1.25rem;">
              <li style="margin-bottom: 0.625rem;">{{ goodTit }}</li>
              <template v-if="point_goods">
                <li>售价{{ vip_level_status && vip_level_status.status == 1 ? vip_level_status.word : goodPrice }}{{ integral }}</li>
              </template>
              <template v-else>
                <li>
                  售价{{ $i18n.t("money") }}
                  {{ vip_level_status && vip_level_status.status == 1 ? vip_level_status.word : goodPrice }}
                </li>
              </template>
            </ul>
            <div class="watch" @click="study()" v-if="isLook">
              <span style="line-height: 1.875rem; color: white;">立即观看</span>
            </div>
            <div class="watch" @click="buy()" v-if="!isLook">
              <span style="line-height: 1.875rem; color: white;">立即购买</span>
            </div>
          </template>
          <template v-if="!Number(styleSetOptions.buy_now_button)">
            <div class="video-cover-bg">
              <img :src="video_image" alt="" class="video-cover-img" />
              <img src="../../assets/images/play-btn.png" class="video-cover-play-btn" @click="openBuyDialog" />
            </div>
          </template>
        </div>
        <div class="box-con set-pc-style" v-if="is_vshow" style="width: 100%;">
          <iframe :src="vedioSrc" frameborder="0" allowfullscreen height="200" width="100%" v-if="!isVideo && !isVoice" style="width: 100%; height: 12.5rem;"> </iframe>

          <ul class="voice-item" v-if="!isVideo && isVoice">
            <audio
              :src="vedioSrc"
              id="audio"
              @pause="onPause"
              @play="onPlay"
              @ended="ended"
              @timeupdate="onTimeupdate"
              @loadedmetadata="onLoadedmetadata"
              @onerror="error"
              ref="audio"
              style="display: none;"
              controls="controls"
            >
              您的浏览器不支持 audio 标签。
            </audio>
            <li class="activeLi">
              <div class="voice-content">
                <span class="second">{{ goodTit }}</span>
                <span class="icon" @click.stop="select(vedioSrc)">
                  <img src="../../assets/images/play1.png" alt="" v-if="songStop" />
                  <img src="../../assets/images/stop1.png" alt="" v-if="!songStop" />
                </span>
              </div>
              <div class="audio-wrapper">
                <div class="slider" ref="slider" @touchstart="handleTouchStart">
                  <div class="slider-track"></div>
                  <div class="slider-fill" :style="'width:' + sliderTime + '%'"></div>
                  <div class="slider-thumb" :style="'left:' + sliderTime + '%'"></div>
                </div>
                <div class="time">
                  <div class="time_left">{{ audio.currentTime | formatSecond }}</div>
                  <div class="time_right">{{ audio.maxTime | formatSecond }}</div>
                </div>
              </div>
            </li>
          </ul>

          <div v-if="isVideo && !isVoice" style="position: relative; width: 100%; height: 12.5rem;">
            <video
              preload="true"
              controlslist="nodownload"
              style="width: 100%; height: 100%;"
              width="100%"
              height="100%"
              controls
              ref="video"
              webkit-playsinline="true"
              playsinline="true"
              x5-playsinline="true"
              x-webkit-airplay="true"
              x5-video-ignore-metadata="true"
              :poster="video_image"
              :src="vedioSrc"
              @contextmenu.prevent
            >
              <source :src="vedioSrc" />
            </video>
            <div style="position: absolute; left: 41.5%; top: 50%; height: 4rem; width: 4rem; margin-top: -2rem;" v-if="isVideoOn && fun.getPhoneEnv() != 2">
              <!--getPhoneEnv() 安卓为2-->
              <img src="../../assets/images/play-btn.png" style="height: 100%; width: 100%;" @click="videoClick" />
            </div>
          </div>
        </div>
        <div id="zhibo" v-if="is_zhibo" style="width: 100%; height: 12.5rem;">
          <div id="player" style="width: 100%; height: 12.5rem;" v-if="is_zhibo"></div>
        </div>

        <div class="course_details" :class="is_vshow ? 'course-title-mar course-title' : 'course-title'">
          <!-- :class="{ 'course_countDown-finish': iscCountDownFinish }" -->
          <div class="course_countDown" v-if="countDownTime !== null && !iscCountDownFinish">
            <div>{{ countDownTime ? "有效期" : "已失效" }}：</div>
            <van-count-down :time="countDownTime" @finish="countDownFinish">
              <template #default="timeData">
                <span class="block">{{ timeData.days }}</span>
                <span class="colon">天</span>
                <span class="block">{{ timeData.hours > 9 ? timeData.hours : "0" + timeData.hours }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.minutes > 9 ? timeData.minutes : "0" + timeData.minutes }}</span>
                <span class="colon">:</span>
                <span class="block">{{ timeData.seconds > 9 ? timeData.seconds : "0" + timeData.seconds }}</span>
              </template>
            </van-count-down>
          </div>
          <div class="course_details_top" v-if="teacherName">
            <div class="lecturer">
              <div class="lecturer_left">
                <img :src="teacherImg" alt="" />
              </div>
              <div class="lecturer_right">讲师:{{ teacherName }}</div>
            </div>
            <div class="reward" @click="moneyShow" v-if="rewardBtnShow"><i class="iconfont icon-kc_gift"></i> 打赏</div>
          </div>
          <div class="course_details_bottom">
            <div class="course_details_name">课程名称：{{ goodTit }}</div>

            <div class="course_details_message">
              <div class="pitch_number">共{{ chapterNum }}节</div>
              <template v-if="point_goods">
                <div class="price">{{ goodPrice }}{{ integral }}</div>
              </template>
              <template v-else>
                <div class="price">{{ $i18n.t("money") }}{{ goodPrice }}</div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="zhibo_title" v-if="live && live_title">
        <div style="flex: 1;">{{ live_title }}</div>
        <div class="btn" @click="addzhibo">进入直播</div>
      </div>
      <div id="tabs">
        <van-tabs v-model="tabActive">
          <van-tab name="second" title="课程简介"></van-tab>
          <van-tab name="first" title="课程目录"></van-tab>
        </van-tabs>
        <div>
          <div v-show="tabActive == 'first'">
            <div class="course_catalogue">
              <div class="course_catalogue_message">
                <h3><i class="iconfont icon-kc_mulu"></i>目录</h3>
                <van-collapse v-model="activeNames" accordion>
                  <van-collapse-item v-for="(digListitem, digListindex) in chapterdigList" :key="digListindex" :name="digListindex">
                    <template #title>
                      <div style="text-align: left;">{{ digListitem.chapter_name }}</div>
                    </template>
                    <ul class="course_catalogue_list">
                      <li v-for="(item, index) in digListitem.has_many_chapter" :key="index" @click="viewPermission(item.id, index, item.course_id, item.is_audition, digListindex)">
                        <span :class="{ iconword: digListindex == first_active && index == active }" style="white-space: nowrap;">第{{ index + 1 }}节</span>
                        <van-icon size="1.25rem" class="icon-kc_play iconfont" :class="{ iconBofang: digListindex == first_active && index == active }" style="margin-top: 3px;" />
                        <span
                          :class="{ iconBofang: digListindex == first_active && index == active }"
                          style="line-height: 1.1rem; white-space: pre-wrap;"
                          :style="item.is_audition == 0 ? 'width: 15rem;' : 'width: 9.8rem;'"
                          >{{ item.chapter_name }}</span
                        >
                        <span slot="right" style="color: green; white-space: nowrap;" v-if="item.is_audition == 0 ? false : true">【免费试听】 </span>
                      </li>
                    </ul>
                  </van-collapse-item>
                </van-collapse>
              </div>
            </div>
          </div>
          <div v-show="tabActive == 'second'">
            <div class="course_introduction">
              <h3><i class="iconfont icon-kc_detail"></i> 课程介绍</h3>
              <div style="margin-right: 0.75rem; margin-top: 0.625rem;" v-html="goodsContent"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pushShow" style="margin-bottom: 3.125rem; background: #fff;">
        <div class="box06">
          <div class="like">猜你喜欢</div>
          <div style="width: 100%; height: 0.0625rem; background-color: rgba(178, 178, 178, 0.5);"></div>
        </div>

        <div class="like-box" v-for="(item, i) in pushGoodList" @click="pushGoodGoto(item)" :key="i">
          <div style="margin-left: 2.5%; margin-right: 2.5%; margin-top: 0.625rem; display: flex;">
            <div style="height: 4.25rem; flex: 1.1;">
              <img :src="item.thumb" style="width: 100%; height: 100%;" />
            </div>
            <div style="flex: 5; margin-left: 0.3125rem;">
              <div style="width: 100%; float: left;">
                <span style="margin-top: 0.375rem; width: 100%; display: block; word-wrap: break-word; overflow: hidden;">{{ item.title }}</span>
              </div>
              <span style="color: #f15353; margin-top: 1.6875rem; float: right;">
                {{ $i18n.t("money") }}
                <span
                  v-if="item.vip_level_status && item.vip_level_status.status == 1"
                  style="
                    color: #fff;
                    background: #f15353;
                    padding: 0.2rem 0.5rem;
                    border-top-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
"
                >
                  {{ item.vip_level_status.word }}
                </span>
                <span v-else>
                  {{ item.price }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="box05">
        <div class="my" @click="toMyCourse">
          <van-icon class="iconfont icon-gerenzhongxin" size="1.125rem" color="#f7ba2a" style="display: block; margin: 0.3125rem 0;"></van-icon>
          我的
        </div>
        <div class="kefu">
          <a @click="show1 = true">
            <van-icon class="iconfont icon-kefu" size="1.125rem" color="#b7b7b7" style="display: block; margin: 0.3125rem 0;"></van-icon>
            客服
          </a>
        </div>
        <div style="flex: 3;" v-if="is_update && Number(styleSetOptions.upgrade_member_button)" class="update" @click="update">
          <button type="danger" style="width: 100%;">升级会员</button>
        </div>
        <div style="flex: 3;" v-if="is_buy" class="buy" @click="buy">
          <button type="warning" style="width: 100%;">{{ styleSetOptions.single_buy_button_name || "单次购买" }}</button>
        </div>
      </div>
    </div>
    <van-popup v-model="rewardShow" position="bottom" :style="{ height: '11rem' }">
      <van-cell-group title="打赏金额" style="padding-top: 0.3125rem; background-color: #f5f5f5;">
        <van-cell>
          <span slot="title">{{ $i18n.t("money") }}&nbsp;</span>
          <input slot="default" v-model="rewardMoney" @blur="clearSrcoll()" type="number" placeholder="请输入打赏金额" />
        </van-cell>
      </van-cell-group>
      <div class="van-button-group">
        <van-button type="primary" size="large" style="height: 2.75rem;" @click.native="confirmReward">确定打赏 </van-button>
      </div>
    </van-popup>

    <!-- // -->
    <van-popup v-model="rewardMoneyBtn" position="bottom" :style="{ height: '11rem' }">
      <van-cell-group title="打赏金额" :boeder="false">
        <div style="margin: 0.625rem 0.625rem 0.75rem 0.625rem;">
          <span
            style="
              display: block;
              float: left;
              width: 4rem;
              height: 2.25rem;
              border: 0.0625rem solid #ff3824;
              border-radius: 0.375rem;
              margin: 0.625rem;
              line-height: 2.25rem;
"
            v-for="(item, index) in rewardArr"
            :key="index"
            :class="{ moneyActive: index == moneyActiveClass }"
            @click="chooseMoney(item.value, index)"
            >{{ item.name }}</span
          >
        </div>
      </van-cell-group>

      <div class="van-button-group">
        <van-button type="primary" size="large" style="height: 2.75rem;" @click.native="confirmReward">确定打赏 </van-button>
      </div>
    </van-popup>

    <!-- <van-popup v-model="payPassBoxShow" position="bottom" :overlay="true">
      <div class="pay-psw-info">
        <div class="pay_content_title">支付密码</div>
        <div class="pay_content">
          <div class="pay_content_view">
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw1 | pwd_filter }}</div>
            </div>
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw2 | pwd_filter }}</div>
            </div>
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw3 | pwd_filter }}</div>
            </div>
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw4 | pwd_filter }}</div>
            </div>
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw5 | pwd_filter }}</div>
            </div>
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw6 | pwd_filter }}</div>
            </div>
          </div>
        </div>
        <footer style="position: inherit;">
          <ul class="pay_btn">
            <li @click="onPassword('1')">1</li>
            <li @click="onPassword('2')">2</li>
            <li @click="onPassword('3')">3</li>
            <li @click="onPassword('4')">4</li>
            <li @click="onPassword('5')">5</li>
            <li @click="onPassword('6')">6</li>
            <li @click="onPassword('7')">7</li>
            <li @click="onPassword('8')">8</li>
            <li @click="onPassword('9')">9</li>
            <li class="b9"></li>
            <li @click="onPassword('0')">0</li>
            <li class="b9" @click="pwdDelete">删除</li>
          </ul>
        </footer>
      </div>
    </van-popup> -->
    <pay-keyboard :payKeyboardShow.sync="payPassBoxShow" @complete="onPassword"></pay-keyboard>
    <van-popup v-model="rewardPayshow" position="bottom" :overlay="true">
      <div class="rewardPay">
        <div class="payMode">
          <ul>
            <li @click="payPost(item)" v-for="(item, index) in btnData" :key="index">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="cancel" @click="rewardPayCancelBtn">取消</div>
      </div>
    </van-popup>

    <van-popup v-model="show1" position="center">
      <div class="pop-content">
        <div class="pop-top">
          <div class="left" v-if="!fun.isTextEmpty(cservice)">
            <div class="wrap">
              <a :href="cservice">
                <div class="image"><img src="../../assets/images/kf_online_contect@2x.png" /></div>
              </a>
              <div>在线联系</div>
            </div>
          </div>
          <div style="display: flex; align-items: center;" v-if="!fun.isTextEmpty(cservice) && !fun.isTextEmpty(service_mobile)">
            <div class="line"></div>
          </div>
          <div class="right" v-if="!fun.isTextEmpty(service_mobile)">
            <div class="wrap">
              <div class="image">
                <a :href="`tel:${service_mobile}`"><img src="../../assets/images/kf_tel_contect@2x.png"/></a>
              </div>

              <div>{{ service_mobile }}</div>
            </div>
          </div>
        </div>
        <div class="pop-bottom" v-if="!fun.isTextEmpty(service_QRcode)">
          <div class="image">
            <img :src="service_QRcode" style="width: 100%; height: 100%;" />
          </div>
        </div>
        <i class="iconfont icon-close11" @click="show1 = false"></i>
      </div>
    </van-popup>
    <van-popup v-model="questionnaire_is_open" position="center" style="background: transparent;">
      <div class="surveyBox">
        <div>
          <!-- <img style="width: 18.2188rem;" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/wj_popupbg@2x.png" ></img> -->
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/wj_popupbg@2x.png" style="width: 18.2188rem;" alt="" />
        </div>
        <div class="centen">
          <span>{{ shopName }}</span>
          <span>请您填写有奖问卷</span>
          <span>参与问卷调查，获得{{ plugin_point_name }}奖励!</span>
          <div class="btn">
            <div @click="onClose">放弃</div>
            <div @click="goSurvey">接受邀请</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import course_controller from "./course_controller";

export default course_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
/* 调查弹窗 */
.surveyBox {
  width: 18.2188rem;

  /* background-color: #ffffff ; */
}

.ispaskey {
  .van-number-keyboard {
    position: relative;
  }
}

.centen {
  background-color: #fff;
  height: 14.0625rem;
  width: 100%;
  margin-top: -0.3125rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.centen span:nth-child(1) {
  margin-top: 1.875rem;
  font-size: 1.5rem;
}

.centen span:nth-child(2) {
  font-size: 1.5rem;
}

.centen span:nth-child(3) {
  font-size: 0.875rem;
  color: #666;
  letter-spacing: 0.0938rem;
  line-height: 1.875rem;
}

.btn {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding-top: 1.7188rem;
}

.btn div:nth-child(1) {
  width: 7.9063rem;
  height: 2.375rem;
  border-radius: 0.125rem;
  border: solid 1px #2672ff;
  font-size: 1rem;
  color: #2672ff;
  text-align: center;
  line-height: 2.375rem;
}

.btn div:nth-child(2) {
  width: 7.9063rem;
  height: 2.375rem;
  background-color: #2672ff;
  border-radius: 0.125rem;
  font-size: 1rem;
  color: #fff;
  text-align: center;
  line-height: 2.375rem;
}

/* end */
.van-button-group {
  padding-top: 15px;
  padding-left: 12px;
  padding-right: 12px;
}

#course {
  padding-bottom: 3.125rem;
}

.noScroll {
  position: absolute;
  height: 100%;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: hidden;
}

.icon-bofang {
  color: #ccc;
}

.spare {
  width: 100%;
  height: 2.5rem;
}

.course_catalogue_list {
  li {
    font-size: 0.877rem;

    .iconBofang {
      position: relative;
      top: 0.0625rem;
      color: #ff9600;
    }

    .iconword {
      color: #ff9600;
    }

    display: flex;
    align-items: center;

    /* margin-left: 1.094rem; */
    margin-right: 1.094rem;
    min-height: 3.031rem;

    /* line-height: 3.031rem; */
    text-align: left;
    border-bottom: 1px solid #f9f9f9;
    color: #333;

    .icon-kc_play {
      margin-left: 0.906rem;
      margin-right: 0.656rem;
    }
  }

  li:last-child {
    border: none;
  }
}

.box01 {
  width: 100%;
  height: 12.5rem;
  background-color: green;
  padding-top: 1rem;
}

.video-cover-main {
  background-color: #000;
  padding: 0;
  .video-cover-bg {
    position: relative;
    height: 100%;
    .video-cover-img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
    .video-cover-play-btn {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

.course-title-mar {
  margin-top: 12.5rem;
}

.course-div {
  background: #fff;

  .box-con {
    position: fixed;
    top: 40px;
    z-index: 1000;
    // width: 100%;
  }

  width: 100%;
  z-index: 100;
}

.course_details {
  position: relative;

  .course_details_top {
    /* position: absolute;
      z-index: 1000;
      left:50%;
      margin-left:-10.9375rem; */
    width: 21.875rem;
    height: 2.813rem;
    background-color: #fff;
    box-shadow: 0 0 0.219rem 0 rgba(133, 133, 133, 0.2);
    border-radius: 0.313rem;
    display: flex;
    justify-content: space-between;
    // padding-bottom: 1rem;
    /* margin-top: -1.4155rem; */
    margin: 0.875rem auto 0;
    .lecturer {
      padding-left: 0.656rem;
      padding-top: 0.469rem;
      display: flex;

      .lecturer_left {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .lecturer_right {
        margin-left: 0.438rem;
        height: 1.75rem;
        line-height: 1.75rem;
        width: 10rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
      }
    }

    .reward {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.625rem;
      width: 3.75rem;
      height: 1.563rem;
      border-radius: 0.781rem;
      border: solid 0.063rem #ff9d27;
      margin-right: 0.75rem;
      line-height: 1.563rem;
      color: #ff9d27;
      font-size: 0.75rem;
    }
  }

  .course_details_bottom {
    .course_details_name {
      width: 100%;
      text-align: left;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: #000;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      padding-left: 1rem;
      padding-right: 1rem;
      margin: 0.875rem auto 1rem;
    }

    .course_details_message {
      display: flex;
      justify-content: space-between;
      padding-left: 1.094rem;
      padding-right: 1.094rem;
      padding-bottom: 0.781rem;

      .pitch_number {
        width: 6rem;
        font-size: 0.875rem;
        line-height: 1.125rem;
        height: 1.125rem;
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .price {
        width: 6rem;
        font-size: 0.875rem;
        line-height: 1.125rem;
        height: 1.125rem;
        color: #e20606;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: right;
      }
    }
  }
}

.course_countDown {
  padding: 0 0.875rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 2.375rem;
  color: #000;
  // background: #b2b2b2;
  .colon {
    display: inline-block;
    margin: 0 4px;
    color: #000;
  }
  .block {
    display: inline-block;
    // padding: 0 4px;
    color: #000;
    font-size: 13px;
    text-align: center;
    // background-color: #fff;
    // border-radius: 4px;
  }
}

.course_countDown-finish {
  background: #b2b2b2;
  opacity: 0.5;
}

#course .mint-navbar .mint-tab-item.is-selected {
  border-bottom: 0.1875rem solid #ff9d27;
  color: #ff9d27;
  margin-bottom: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-bottom: 0.3125rem;
}

.course_introduction {
  min-height: 10rem;
  background: #fff;
  padding-top: 1.313rem;
  padding-left: 1.094rem;

  h3 {
    line-height: 1rem;
    height: 1rem;
    text-align: left;
    font-size: 1rem;

    i {
      padding-right: 0.719rem;
      color: #ad65ff;
    }
  }
}

.course-title {
  line-height: 2.5rem;
  background-color: #fff;
  // padding-top: 0.75rem;
  // padding-left: 0.75rem;
  // padding-right: 0.75rem;
  text-align: left;
  color: #333;

  h1 {
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  span {
    font-weight: normal;
    color: #8c8c8c;
  }
}

.box02 {
  background-color: white;
  text-align: left;
}

.title {
  color: white;
}

.watch {
  width: 13.125rem;
  height: 1.875rem;
  background-color: orange;
  margin: 0 auto;
  border-radius: 0.25rem;
  margin-top: 1.25rem;
}

.box03 {
  width: 100%;
  background-color: white;
  padding: 1.5rem 0.75rem 1.5rem 0.75rem;
  margin-top: 0.625rem;
}

.left {
  float: left;
}

.touxiang {
  width: 3rem;
  height: 3rem;
  background-color: #333;
  border-radius: 1.5rem;
  float: left;
  margin-right: 0.625rem;
}

.clearfix {
  clear: both;
}

.anniu {
  float: right;
}

.button {
  width: 4rem;
  height: 2.25rem;
  background-color: #ff3824;
  border-radius: 0.375rem;
  margin-top: 0.375rem;
  margin-right: -1.25rem;
}

.dashang {
  margin-left: 1.875rem;
}

.course_catalogue {
  background: #fff;

  .course_catalogue_message {
    padding-left: 1.063rem;
    padding-top: 1rem;

    h3 {
      text-align: left;
      line-height: 1.875rem;

      i {
        margin-right: 0.831rem;
        color: #ff6000;
      }
    }
  }
}

.box04 {
  width: 100%;
  background-color: white;
  margin-top: 0.5rem;
  padding-bottom: 1.875rem;
  padding-left: 0.75rem;
  text-align: left;
}

.box05 {
  background: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  margin-top: 0.5rem;
  display: flex;

  .my {
    height: 3.0625rem;
    flex: 2;
    background-color: #fff;
    font-size: 12px;
    color: #333;

    span {
      width: 100%;
      display: inline-block;
    }
  }

  .kefu {
    height: 3.0625rem;
    flex: 2;
    background-color: #fff;
    font-size: 12px;
    color: #333;

    span {
      display: inline-block;
      width: 100%;
    }
  }

  .update {
    height: 3.0625rem;
    line-height: 3.0625rem;
    background-color: #ff9500;
    font-size: 15px;

    button {
      border: none;
      color: #fff;
    }
  }

  .buy {
    height: 3.0625rem;
    line-height: 3.0625rem;
    font-size: 15px;
    background-color: #dd2727;

    button {
      border: none;
      color: #fff;
    }
  }
}

.like {
  line-height: 2.25rem;
  font-size: 15px;
  text-align: left;
  margin-left: 5%;
}

.jieshao {
  line-height: 2.25rem;
  font-size: 15px;
  text-align: left;
}

.box06 {
  width: 100%;
  background-color: white;
  margin-top: 0.5rem;
}

.like-box {
  width: 100%;
  height: 4.6875rem;
  background-color: white;
  text-align: left;
  margin-bottom: 0.625rem;
}

.iconBofang {
  position: relative;
  top: 0.0625rem;
  color: #ff9600;
}

.iconword {
  color: #ff9600;
}

.moneyActive {
  background-color: #ff3824;
}

.pcStyle .box05 {
  width: 375px;
}

.iphoneXStyle .box05 {
  padding-bottom: 24px;
}

.zhibo_title {
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: #f2f2f7;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;

  .btn {
    width: 4.375rem;
    height: 1.5rem;
    background-color: #ff9719;
    border-radius: 0.75rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    box-sizing: border-box;
  }
}

.pop-content {
  width: 16rem;
  padding: 3.1875rem 0;
  text-align: center;
  border-radius: 1.1875rem;
  background: #fff;

  .pop-top {
    display: flex;
    align-items: unset;
    justify-content: center;

    .left {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .line {
      width: 1px;
      height: 1.625rem;
      background-color: #999;
    }

    .right {
      width: 50%;
      display: flex;
      justify-content: center;

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;

        .image {
          width: 2.625rem;
          height: 2.625rem;
          margin-bottom: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .pop-bottom {
    margin-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;

    .image {
      width: 50%;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .icon-close11 {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 18px;
  }
}

.voice-item {
  height: 12rem;
  padding: 0 2rem;
  background: #fff;

  li {
    padding-top: 3.5rem;
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
    text-align: left;
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

.rewardPay {
  background-color: #f2f2f2;

  .content {
    background-color: #fff;

    span {
      color: #1c96fe;
    }

    text-align: left;
    padding: 0.6rem;
    min-height: 3.44rem;
    font-size: 0.8rem;
    line-height: 1rem;
    width: 100%;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }

  .payMode {
    ul {
      li {
        background-color: #fff;
        height: 3.44rem;
        border-bottom: 0.06rem solid #eee;
        font-size: 1rem;
        color: #333;
        line-height: 3.44rem;
      }

      li:last-of-type {
        border-bottom: none;
        margin-bottom: 0.69rem;
      }
    }
  }

  .cancel {
    background-color: #fff;
    height: 3.44rem;
    border-bottom: 0.06rem solid #eee;
    font-size: 1rem;
    color: #333;
    line-height: 3.44rem;
  }
}

.pay-psw-info {
  overflow-y: scroll;
  width: 100vw;
  height: auto;
  background: #fff;
  max-height: 80vh;
  padding-top: 0.625rem;

  .pay_content_title {
    width: 100vw;
    height: 1.875rem;
    line-height: 1.875rem;
    margin-bottom: 0.625rem;
    font-size: 18px;
  }

  .pay_content {
    width: 100vw;
    height: 3.125rem;
    margin-bottom: 0.625rem;
  }

  .pay_content_view {
    width: 100vw;
    height: 3.125rem; // margin-left: 0.125rem;
    border-bottom: 0.0625rem solid #ddd;
    border-top: 0.0625rem solid #ddd;
    border-right: 0.0625rem solid #ddd;
  }

  .ipt_pay_p {
    line-height: 3.125rem;
    height: 3.125rem;
    font-size: 20px;
  }

  .ipt_pay {
    float: left;
    width: 16.27%;
    height: 3.125rem;
    text-align: center;
    border-left: 0.0625rem solid #ddd;
  }

  footer {
    position: absolute;
    bottom: 0;
    width: 100vw;
    font-weight: 600;
  }

  .pay_btn {
    border-top: 0.0625rem solid #ddd;
    width: 100vw;
    height: auto;
  }

  .pay_btn li {
    width: 33%;
    float: left;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: #fff;
    font-size: 14px;
    border-right: 0.0625rem solid #ddd;
    border-bottom: 0.0625rem solid #ddd;
  }

  .pay_btn li:active {
    background: #c2c2c2;
  }

  .b9:active {
    background: #fff !important;
  }

  .b9 {
    background: #c2c2c2 !important;
  }
}

#course .van-cell-group__title {
  text-align: left;
  color: #888;
  background: #f5f5f5;
}

#course .van-cell__title {
  flex: 0;
  text-align: left;
}

#course .van-cell__value input {
  border: none;
  width: 100%;
  color: #666;
}
</style>
