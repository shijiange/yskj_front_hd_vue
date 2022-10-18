<template>
  <div>
    <page-container class="activity-index" v-if="activity" :themeColor="activity.bg_color">
      <d-title>好友裂变</d-title>
      <van-swipe
        class="real-time-broadcast"
        :autoplay="3000"
        vertical
        :style="{ height:'1.6rem' }"
        v-if="broadcastList.length > 0"
        :show-indicators="false"
      >
        <van-swipe-item v-for="item in broadcastList" :key="item">
          <div class="real-time-broadcast-item">
            <van-image
              width="1.13rem"
              height="1.13rem"
              :src="item.has_one_member ? item.has_one_member.avatar_image : photoMrImg"
              round
              fit="cover"
            ></van-image>
            <span class="real-time-broadcast-nickname van-ellipsis">{{ item.has_one_member ? item.has_one_member.nickname : '' }} 生成了海报</span>
          </div>
        </van-swipe-item>
      </van-swipe>

      <!-- 倒计时 -->
      <div class="activity-info">
        <div class="activity-name van-ellipsis">{{activity.name}}</div>
        <div class="activity-relative-time">
          <template v-if="activityOver">活动已结束</template>
          <!-- end_time为-1时不显示结束时间 -->
          <template v-else-if="activityTimestamp != -1">
            <template v-if="activityStarted">距离活动结束还有</template>
            <template v-else>距离活动开始还有</template>
            <d-timing use-slot :time="activityTimestamp" @ended="activityTimend">
              <template slot-scope="times">
                <span class="acitvity-relative-time-el">{{ times.days }}</span><span class="grey">天</span>
                <span class="acitvity-relative-time-el">{{ times.hours }}</span><span class="grey">:</span>
                <span class="acitvity-relative-time-el">{{ times.minutes }}</span><span class="grey">:</span>
                <span class="acitvity-relative-time-el">{{ times.seconds }}</span>
              </template>
            </d-timing>
          </template>
        </div>
      </div>

      <panel class="panel-box" title="邀请进度">
        <activity-progress
          class="activity-progress"
          :data="progressRules"
          :currentStageIndex="currentStageIndex"
          :lastStageIndex="lastStageIndex"
          :nextStageIndex="nextStageIndex"
          @viewPrize="showPrize"
          v-if="this.activityStarted&&this.activityOver===false"
        ></activity-progress>
        <rule-list
          :current-stage-index="activity.step"
          :next-stage="nextStage"
          :rules="ruleLadder"
          :activity="activity"
          @clickRewardIcon="clickRewardIcon"
          v-if="ruleLadder.length > 0"
        ></rule-list>
      </panel>

      <panel class="panel-box" title="活动介绍">
        <div class="activity-legend" v-html="activity.desc_text" @click="handleHtml($event)"></div>
      </panel>

      <panel class="panel-box" title="生成记录">
        <ul class="activity-logs">
          <li class="activity-log-item" v-for="orderItem in activityPosterList" :key="orderItem.id">
            <span class="activity-log-rank">{{ orderItem.created_at }}</span>
            <div v-if="orderItem.has_one_member" style="flex:1;margin-left:1rem;">
              <van-image
                class="activity-log-avatar"
                :src="orderItem.has_one_member.avatar_image"
                width="1.09rem"
                height="1.09rem"
                round
              ></van-image>
              <span class="activity-log-nickname van-ellipsis">{{ orderItem.has_one_member.nickname }}</span>
            </div>
            <span class="activity-log-date">生成了海报</span>
          </li>
        </ul>
        <div
          class="activity-log-view-more"
          @click="viewMoreOrders"
          v-if="isViewedPosterList===false&&activity.poster_list.length>6"
        >
          查看更多
          <i class="iconfont icon-member-bottom"></i>
        </div>
        <div class="activity-log-empty" v-show="activityPosterList.length===0">暂无参与记录~</div>
      </panel>

    </page-container>
    <action-bar
      :activityId="activityId"
      :service="connectServiceMethods"
      @clickButton="clickButton"
      :active="!activityOver&&activityStarted"
      :loading="placeOrderLoading"
      buttonText="分享海报邀请好友"
    ></action-bar>

    <!-- 奖励积分弹框 -->
    <van-popup
      v-model="isShowPrize"
      closeable
      :round="true"
      close-icon="cross"
      class="prize-popup"
      @close="closePrizePopup"
    >
      <div class="popup-title">奖励内容</div>
      <div class="cell">
        <span>{{basic_info.point || '积分'}}：</span>
        <span class="value red-text">+{{stepReward.point ? stepReward.point : 0}}</span>
      </div>
      <div class="cell">
        <span>{{basic_info.balance || '余额'}}：</span>
        <span class="value red-text">+{{stepReward.balance ? stepReward.balance : 0}}</span>
      </div>
      <div class="cell">
        <span>{{basic_info.love || '爱心值'}}：</span>
        <span class="value red-text">+{{stepReward.love ? stepReward.love : 0}}</span>
      </div>
      <div class="cell">
        <span>{{basic_info.integral || '消费积分'}}：</span>
        <span class="value red-text">+{{stepReward.integral ? stepReward.integral : 0}}</span>
      </div>
      <div class="cell" v-if="stepReward.coupon && stepReward.coupon.length > 0">
        <div>优惠券：</div>
        <div class="value">
          <p v-for="(coupon) in stepReward.coupon" :key="coupon.id">
             {{coupon.name}} <span class="red-text">+{{coupon.reward_num}}张</span>
          </p>
        </div>
      </div>
      <div class="cell" v-if="stepReward.member_level">
        <span>会员等级：</span>
        <span class="value red-text">可升级到{{stepReward.member_level.level_name}}</span>
      </div>
    </van-popup>

    <generate-poster-dialog
      ref="posterDialog"
      :activityId="activityId"
      :autoPoster="autoPoster"
      :issetPoster="issetPoster"
      :memberList="memberList"
      @generatePoster="issetPoster=true"
    ></generate-poster-dialog>

    <div class="fixed-box">
      <div class="gift" @click="goRecord">
        <i class="iconfont icon-qt_icon_record"></i>
        <p class="text">记录</p>
      </div>
    </div>

    <van-image-preview v-model="showImg" :images="imgList" :start-position="imgStart"></van-image-preview>
  </div>
</template>

<script>
import DTitle from "@/components/other/common/dtitle";
import PageContainer from "@/components/other/active_group/PageContainer";
import Panel from "@/components/other/active_group/Panel";
import DTiming from "@/components/other/common/DTiming";
import ActivityProgress from "@/components/other/active_group/ActivityProgress";
import RuleList from "@/components/other/active_group/RuleList";
import ActionBar from "@/components/other/active_group/ActionBar";
import GeneratePosterDialog from "@/components/other/active_group/generatePosterDia";
import {Image as VanImage} from "vant";
import photoMrImg from "@/assets/images/photo-mr.jpg";
let self = null;
export default {
  data () {
    return {
      photoMrImg,
      activityId: '',
      currentLinkContent: '',
      activityTimestamp: 0, // 倒计时，时间戳
      broadcastList: [],
      activityOver: false,
      activity: null,
      activityPosterList: [],
      isViewedPosterList: false,

      // 进度条
      progressRules: [],
      activityStarted: false,
      currentStageIndex: null,
      lastStageIndex: null,
      nextStageIndex: null,

      ruleLadder: [],
      nextStage: null,

      // 客服
      connectServiceMethods: {},

      // 奖金
      isShowPrize: false,
      stepReward: {},

      // 成员海报
      memberList: [],
      autoPoster: 0, // 自动生成海报 0用户自己选 1系统自动选择
      issetPoster: 0, // 是否已生成海报 1已生成 0未生成

      basic_info:{},
      imgList: [],
      showImg: false,
      imgStart: 0,
    };
  },
  beforeRouteLeave(to, from, next) {
    // 注意：从商品详情页跳转到商品详情页不触发，to、from不变
    if (self.showImg) {
      self.showImg = false;
      next(false);
    } else {
      next();
    }
  },
  activated () {
    self = this;
    this.activityId = this.$route.query.id;
    this.currentLinkContent = location.href;
    try {
      this.basic_info = JSON.parse(localStorage.getItem("yz_basic_info")) || {};
    } catch (err) {
      // 错误处理
    }
    this.getActivity();
  },

  methods: {
    getActivity() {
      $http
        .get("plugin.customer-increase.frontend.activity.activityDetail", {
          id: this.activityId
        })
        .then((res) => {
          let { data, result, msg } = res;
          let activity = data;
          this.broadcastList = activity.poster_list;

          if (result == 0) {
            this.$toast(msg);
            return;
          }
          this.activity = activity;
          this.fun.setWXTitle(this.activity.name || '好友裂变');
          this.imgList = this.getImgSrc(this.activity.desc_text);
          this.activityTime();
          this.issetPoster = activity.isset_poster;
          this.autoPoster = res.data.auto_poster;
          this.memberList = data.staff_data;
          this.setProgressData(activity.step_rule);
          this.activityPosterList = this.activity.poster_list.slice(0, 6);

          //* 客服
          let cservice = res.data.chat_data;
          if (cservice) {
            this.$set(this.connectServiceMethods, "online", cservice.url);
            this.$set(this.connectServiceMethods, "tel", cservice.mobile);
            this.$set(this.connectServiceMethods, "qrcode", cservice.qrcode);
          }

          this.fun.wxShare(
            this.currentLinkContent,
            {},
            {
              title: this.activity.share_title?this.activity.share_title:this.activity.name,
              description: this.activity.share_text,
              imgUrl: this.activity.share_logo_url
            }
          );
        });
    },
    handleHtml($event) {
      let that = this;
      if ($event.target) {
        if ($event.target.nodeName == "IMG" && $event.target.parentElement.nodeName !== "A") {
          for (let i = 0; i < that.imgList.length; i++) {
            // 编程式
            if ($event.target.currentSrc.indexOf(that.imgList[i]) > -1) {
              that.imgStart = i;
              that.showImg = true;
              return;
            }
          }
        }
      }
    },
    getImgSrc(richtext) {
      let imgList = [];
      richtext.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
        imgList.push(capture);
      });
      return imgList;
    },

    // 活动时间
    activityTime() {
      let startTimeStamp = this.activity["start_time"] * 1000;
      let endTimeStamp = this.activity["end_time"] * 1000;
      let currentStamp = Date.now();
      if (startTimeStamp > currentStamp && this.activity.state == 1) {
        //* 未开始
        this.activityTimestamp = startTimeStamp;
      } else if (endTimeStamp > currentStamp && this.activity.state == 2) {
        //* 进行中
        this.activityTimestamp = endTimeStamp;
        this.activityStarted = true;
      } else if (this.activity.end_time == -1 && this.activity.state == 2) {
        //* 进行中 end_time -1为不限时，进行中的活动结束时间为-1时不显示结束时间
        this.activityTimestamp = -1;
        this.activityStarted = true;
      } else if (endTimeStamp < currentStamp || this.activity.state == 3) {
        //* 已结束
        this.activityOver = true;
      }
    },

    activityTimend() {
      this.activityOver = true;
    },

    // 活动进度
    setProgressData (rules) {
      let ruleList = JSON.parse(JSON.stringify(rules));
      let addRule = {positionLeft: "0%", step_people: this.activity.invite_count};
      ruleList.unshift(addRule);
      this.ruleLadder = ruleList;
      if (ruleList.length >= 3) {
        // 后台设置超过三个进度阶梯
        if (this.activity.step == ruleList.length - 1) {
          ruleList = ruleList.slice(-3);
        } else if (this.activity.step == 0){
          ruleList = ruleList.slice(0, 3);
        } else {
          if (ruleList.length - this.activity.step >= 3) {
            ruleList = ruleList.slice(this.activity.step, 3 + this.activity.step);
          } else if (ruleList.length - this.activity.step <= 2) {
            let diff = 3 - (ruleList.length - this.activity.step);
            ruleList = ruleList.slice(this.activity.step - diff, this.activity.step - diff + 3);
          }
        }
      }
      let everyStagePositionPercent = 100 / (ruleList.length - 1);
      for (let index = 0; index < ruleList.length; index++) {
        const ruleItem = ruleList[index];
        const percentage = everyStagePositionPercent * index;
        if (ruleList[index].step_level == this.activity.step) {
          this.currentStageIndex = index;
        }
        // 奖励 位置偏移量
        if (index === 0) {
          ruleItem["positionLeft"] = `calc(${percentage}%)`;
        } else if (index === ruleList.length-1) {
          ruleItem["positionLeft"] = `calc(${percentage}% - calc(4.2rem))`;
        } else {
          ruleItem["positionLeft"] = `calc(${percentage}% - calc(4.2rem / 2))`;
        }
      }
      this.nextStage = this.activity.next_step;
      this.progressRules = ruleList;
      this.lastStageIndex = ruleList.length - 1;
    },

    viewMoreOrders () {
      this.activityPosterList = this.activity.poster_list;
      this.isViewedPosterList = true;
    },

    // 海报
    clickButton (isActive) {
      if (!isActive) {
        // 活动关闭状态
        return false;
      }
      this.$refs["posterDialog"].showDialog();
    },

    showPrize (prizeIndex) {
      this.stepReward = this.progressRules[prizeIndex].step_reward;
      this.isShowPrize = true;
    },
    clickRewardIcon (data) {
      this.stepReward = data;
      this.isShowPrize = true;
    },

    closePrizePopup () {
      this.isShowPrize = false;
    },

    // 跳转记录页
    goRecord () {
      this.$router.push(this.fun.getUrl("friendRewardRecord", {}, {id: this.activity.id}));
    },
  },

  components: {
    PageContainer,
    DTitle,
    DTiming,
    Panel,
    ActivityProgress,
    RuleList,
    ActionBar,
    GeneratePosterDialog,
    VanImage
  },
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.activity-index {
  // padding: 0.8rem 1rem 3.8rem 1rem;
}

.panel-box {
  margin: 0.63rem 1rem 0 1rem;
}

.real-time-broadcast {
  margin: 1.13rem 0.94rem 0.97rem;
  text-align: left;
  .real-time-broadcast-item {
    display: inline-flex;
    align-items: center;
    margin: 1px 0;
    padding: 0.18rem 0.56rem 0.18rem 0.18rem;
    text-align: left;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0.72rem;
  }
  .real-time-broadcast-nickname {
    margin-left: 0.28rem;
    font-size: 0.81rem;
    color: #464646;
  }
}

.activity-info {
  .activity-name {
    z-index: 1;
    font-size: 1.06rem;
    font-weight: bold;
    color: #ffffff;
    text-align: center;
  }

  .activity-relative-time {
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 1;
    margin-top: 0.59rem;
    text-align: center;
    font-size: 0.81rem;
    color: #ffffff;
  }

  .acitvity-relative-time-el {
    margin: 0 0.25rem;
    padding: 0.22rem 0.38rem;
    color: var(--page-main-color);
    border-radius: 0.25rem;
    background-color: #fff;
  }

  .acitvity-relative-time-el:first-child {
    margin-left: 0.84rem;
  }

  .grey {
    color: #666666;
  }
}

.activity-logs {
  .activity-log-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.28rem;
    font-size: 0.81rem;
    white-space: nowrap;
  }

  .activity-log-avatar {
    margin: 0 0.41rem;
  }
  .activity-log-nickname {
    display: inline-block;
    max-width: 3.2rem;
  }
}
.activity-log-view-more {
  text-align: center;
  color: #f14e4e;
  font-size: 0.75rem;
}

.activity-log-empty {
  padding: 5px 0;
  text-align: center;
  color: #999;
}

.prize-popup {
  width: 70%;
  max-height: 35%;
  overflow-y: auto;
  padding: 1rem;
  .popup-title {
    font-size: 0.94rem;
    font-weight: bold;
    color: #232323;
  }
  .cell {
    display: flex;
    margin-top: 0.7rem;
    text-align: left;
    font-weight: 500;
  }
  .red-text {
    color: #ff2c29;
  }
  /deep/ .van-popup__close-icon {
    color: #232323;
    font-size: 1.2rem;
  }
}

.fixed-box {
  position: fixed;
  z-index: 3;
  right: 1.19rem;
  bottom: 5.44rem;
  .gift {
    width: 2.7rem;
    height: 2.7rem;
    padding: 0.25rem;
    color: #fff;
    border-radius: 50%;
    background-color: #f14e4e;
    box-shadow: 0.05rem 0.08rem 0.16rem 0rem rgba(209, 209, 209, 0.36);
    .text {
      font-size: 0.725rem;
    }
  }
}

.generate-poster-dialog {
  // top: 40px;
  z-index: 4;
  // height: calc(100% - 40px);
}
.poster-dialog-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
    .poster-img {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 15.63rem;
      height: 24.88rem;
      // background-color: #ffffff;
      border-radius: 0.51rem;
      .close-icon {
        position: absolute;
        right: -2rem;
        top: -2rem;
        color: #fff;
        font-size: 1.6rem;
      }
    }
    .select-member {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 1.5rem 1rem;
      // height: 8.13rem;
      background-color: #ffffff;
      border-radius: 0.63rem 0.63rem 0rem 0rem;
      text-align: center;
      .tip {
        color: #6c6c6c;
        text-align: left;
      }
      .avatars {
        display: flex;
        align-items: center;
        text-align: left;
        white-space: nowrap;
        padding-bottom: 1rem;
        height: 6.2rem;
        overflow-y: auto;
        overflow-x: visible;
      }
      .avatar {
        width: 2.19rem;
        height: 2.19rem;
        margin-left: 1.3rem;
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .current-member {
        position: relative;
        border: 0.1rem solid #ff2c29;
      }
      .current-member::after {
        content: '当前会员';
        position: absolute;
        left: 50%;
        bottom: -1rem;
        padding: 0.2rem 0.3rem;
        transform: translateX(-50%);
        font-size: 0.625rem;
        line-height: 0.7rem;
        color: #ffffff;
        white-space: nowrap;
        background-color: #e52c29;
        border-radius: 0.56rem;
      }

      .confirm-btn {
        display: inline-block;
        color: #ffffff;
        margin: 0 auto;
        padding: 0.5rem 7rem;
        border-radius: 0.56rem;
        background-color: #ff2c29;
      }
    }
}
</style>
<style>
.activity-legend  img {
  width: 100% !important;
}
</style>