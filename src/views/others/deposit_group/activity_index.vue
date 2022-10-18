<template>
  <scoped-page-container class="activity-index" v-if="activity" :themeColor="activity.theme_color">
    <d-title>定金阶梯</d-title>
    <van-swipe class="real-time-orders" :autoplay="3000" vertical :style="{ height: '1.6rem' }" v-if="activity.activity_order.length > 0" :show-indicators="false">
      <van-swipe-item v-for="orderItem in activity.activity_order" :key="orderItem.activity_id">
        <div class="real-time-order-item">
          <van-image width="1.13rem" height="1.13rem" :src="orderItem.member.avatar_image" round fit="cover"></van-image>
          <span class="real-time-order-nickname van-ellipsis">{{ orderItem.member.nickname }}</span>
        </div>
      </van-swipe-item>
    </van-swipe>
    <div class="panel-list">
      <scoped-panel class="activity-goods">
        <template slot="title">
          <div class="activity-name van-ellipsis">{{ activity.activity_name }}</div>
          <div class="activity-relative-time">
            <template v-if="activityOver">活动已结束</template>
            <template v-else>
              <template v-if="activityInProgress">距离活动结束还有</template>
              <template v-else>距离活动开始还有</template>
              <d-timing use-slot :time="activityTimestamp" @ended="activityTimend">
                <template slot-scope="times">
                  <span class="acitvity-relative-time-el">{{ times.days }}</span
                  >天 <span class="acitvity-relative-time-el">{{ times.hours }}</span
                  >: <span class="acitvity-relative-time-el">{{ times.minutes }}</span
                  >:
                  <span class="acitvity-relative-time-el">{{ times.seconds }}</span>
                </template>
              </d-timing>
            </template>
          </div>
          <div class="activety-goods-title-bg"></div>
        </template>
        <div class="activity-goods-details" @click="getGoodDetail">
          <van-image class="activity-goods-cover" width="6.25rem" height="6.25rem" :src="activity.bind_goods.thumb_src" radius="0.31rem"></van-image>
          <div class="activity-goods-info">
            <div class="activity-goods-title">{{ activity.bind_goods.title }}</div>
            <div class="activity-goods-sku" v-if="activity.bind_goods.has_option && activity.goods_option">规格：{{ activity.goods_option.title }}</div>
            <div class="activity-goods-price">￥{{ activity.bind_goods.price }}</div>
            <div class="activity-goods-footer" @click.stop>
              <span class="activity-goods-deposit">定金：￥{{ activity.deposit }}</span>
              <van-stepper theme="round" button-size="22" disable-input :min="1" :max="activity.limit" integer @change="changedOrderGoodsCount" v-model="orderGoodsCount" v-if="activity.limit" />
              <van-stepper theme="round" button-size="22" disable-input :min="1" integer @change="changedOrderGoodsCount" v-model="orderGoodsCount" v-else />
            </div>
          </div>
        </div>
      </scoped-panel>

      <scoped-panel class="activity-panel" title="活动规则">
        <scoped-activity-progress
          class="activity-progress"
          :data="activityRules"
          :currentStageIndex="currentStageIndex"
          :lastStageIndex="lastStageIndex"
          :currentStagePercent="currentStagePercent"
          :nextStageIndex="nextStageIndex"
          :goodsPrice="activity.bind_goods.price"
          v-show="this.activityStarted && this.activityOver === false"
        ></scoped-activity-progress>
        <scoped-rule-list
          :activity-rule-method="activityRuleMethod"
          :activity-calc-count-key="activityCalcCountKey"
          :rule-calc-key="ruleCalcKey"
          :current-stage-index="currentStageIndex"
          :next-stage-index="nextStageIndex"
          :next-stage="nextStage"
          :rules="activityRules"
          :activity="activity"
        ></scoped-rule-list>
      </scoped-panel>
      <scoped-panel class="activity-panel" title="活动说明">
        <div class="activity-legend" v-html="activity.activity_explain"></div>
      </scoped-panel>
      <scoped-panel class="activity-panel" title="参与记录">
        <ul class="activity-logs">
          <li class="activity-log-item" v-for="orderItem in activityNewOrders" :key="orderItem.id">
            <div>
              <span class="activity-log-rank">{{ orderItem._rank }}</span>
              <van-image class="activity-log-avatar" :src="orderItem.member.avatar_image" width="1.09rem" height="1.09rem" round></van-image>
              <span class="activity-log-nickname van-ellipsis">{{ orderItem.member.nickname }}</span>
            </div>
            <span class="activity-log-date">{{ orderItem.created_at }}</span>
          </li>
        </ul>
        <div class="activity-log-view-more" @click="viewMoreOrders" v-show="isViewedNewOrders === false && activity.activity_order.length > 6">
          查看更多
          <i class="iconfont icon-member-bottom"></i>
        </div>
        <div class="activity-log-empty" v-show="activityNewOrders.length === 0">暂无参与记录~</div>
      </scoped-panel>
    </div>
    <d-fixed class="quick-buttons" right="1rem" bottom="6.66rem">
      <div class="share-commissonion" v-if="activity.commission != 0" @click="showShareSheet = true">
        <div class="van-ellipsis">
          <i>￥</i>
          {{ shareCommission }}
        </div>
      </div>
      <img class="quick-button-item" src="@/assets/images/deposit_group/deposit_group_share_button.png" v-else @click="showShareSheet = true" />
      <img class="quick-button-item" src="@/assets/images/deposit_group/deposit_group_order_button.png" @click="routerToOrderList" />
      <img class="quick-button-item" src="@/assets/images/deposit_group/deposit_group_ranking_button.png" @click="viewRanking" v-if="activity.ranking_list" />
    </d-fixed>
    <van-share-sheet v-model="showShareSheet" :title="shareTitle" :options="shareOptions" @select="selectShareOption" />
    <scoped-poster-popup :image="poster.image" :show="poster.showPopup" :generating="poster.generating"></scoped-poster-popup>
    <d-copy :content="currentLinkContent" :copy="copyLink" @copySuccess="copyLinkSuccess"></d-copy>
    <yz-goods-popup v-model="showGoodsPopup" :goodsInfo="activityGoods" :addCartBtn="false" v-if="activityGoods"></yz-goods-popup>
    <yz-wechat-share-image v-model="showShareGuide"></yz-wechat-share-image>
    <van-popup v-model="electronicAgreement.showPopup" style="width: 84vw; height: 430px;" round>
      <div class="electronic-agreement">
        <p class="electronic-agreement-title">{{ activity.agreement == 0 ? "定金合同" : "定金协议" }}</p>
        <div class="electronic-contract-content" v-if="activity.agreement == 0">
          <p>为了保障您的合法权益，参加活动交付定金前需签订本活动电子合同！</p>
          <p>电子合同和纸质合同一样具备同等法律效力！</p>
          <p>点击下方去签合同跳转合同页面签订电子合同，签订完成后再次点击进入活动页面即可支付定金，参加我们的活动！</p>
        </div>
        <div class="electronic-agreement-content" v-else>{{ electronicAgreement.content }}</div>
        <van-button class="electronic-agreement-confirm" round type="primary" :color="activity.theme_color" @click="agreeAgreement">{{
          activity.agreement == 0 ? "去签合同" : "我已阅读并确认"
        }}</van-button>
      </div>
    </van-popup>
    <scoped-action-bar :service="connectServiceMethods" @clickButton="placeOrder" :active="!activityOver && activityInProgress && activityStarted" :loading="placeOrderLoading"></scoped-action-bar>
  </scoped-page-container>
</template>

<script>
import { Image as VanImage, Toast } from "vant";
import DTitle from "@/components/other/common/dtitle";
import DFixed from "../../../components/other/common/DFixed";
import DTiming from "../../../components/other/common/DTiming";
import DCopy from "@/components/other/common/DCopy";
import ScopedPanel from "./Components/ScopedPanel";
import ScopedActivityProgress from "./Components/ScopedActivityProgress.vue";
import ScopedPageContainer from "./Components/ScopedPageContainer.vue";
import ScopedActionBar from "./Components/ScopedActionBar";
import ScopedPosterPopup from "./Components/ScopedPosterPopup";
import ScopedRuleList from "./Components/ScopedRuleList";
import YzGoodsPopup from "@/components/ui_components/yz_goodsPopup";
import YzWechatShareImage from "@/components/ui_components/yz_wechatShareImg";
import copy_link from "../../../assets/images/deposit_group/copy_link.png";
import generate_poster from "../../../assets/images/deposit_group/generate_poster.png";
import current_state from "../../../assets/images/deposit_group/deposit_group_current_state.png";
export default {
  data() {
    return {
      activityId: null,
      member: null,
      activity: null,
      activityNewOrders: [],
      activityGoods: null,
      activityRules: [],
      activityStarted: false,
      orderGoodsCount: 0,
      currentStageIndex: null,
      nextStageIndex: null,
      nextStage: null,
      lastStageIndex: null,
      currentStagePercent: 0,
      shareCommission: 0,
      isViewedNewOrders: false,
      activityRuleMethod: "deal", //* 按成交方式计算规则就是deal 按销售方式计算规则就是 sale
      activityCalcCountKey: "order_count",
      ruleCalcKey: "deal_num",
      poster: {
        showPopup: false,
        generating: false,
        image: null
      },
      copyLink: false,
      currentLinkContent: "",
      activityTimeEls: {
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      activityTimestamp: 0,
      activityInProgress: false,
      activityOver: false,
      showGoodsPopup: false,
      showShareGuide: false,
      connectServiceMethods: {},
      electronicAgreement: {
        showPopup: false,
        isShowPopupVerify: false,
        content: "",
        isAgreed: false,
        contractId: null
      },
      placeOrderLoading: false,
      showShareSheet: false,
      shareOptions: [
        [
          { name: "复制连接", icon: copy_link, key: "link" },
          { name: "生成海报", icon: generate_poster, key: "poster" },
          { name: "微信", icon: "wechat", key: "wechat" }
        ]
      ],
      o2oStore: {} //门店定金团信息
    };
  },
  activated() {
    if (!this.$route.query.id) {
      Toast("活动不存在");
      setTimeout(() => {
        this.$router.replace(this.fun.getUrl("home"));
      }, 500);
      return;
    }
    this.activityId = this.$route.query.id;
    this.initData();
    this.getActivity();
    this.currentLinkContent = location.href;
    this.fun.setWXTitle("定金阶梯团");
  },
  methods: {
    initData() {
      this.showGoodsPopup = false;
      this.electronicAgreement.showPopup = false;
    },
    getActivity() {
      $http
        .get("plugin.deposit-ladder.frontend.index.activity", {
          id: this.activityId
        })
        .then(({ data: { activity, member, cservice }, result, msg }) => {
          if (result == 0) {
            Toast(msg);
            return;
          }
          let rules = activity.ladder;
          let ruleKey = "deal_num";
          let activityKey = "order_count";
          if (rules.length > 0) {
            if (rules[0]["deal_num"] !== null) {
              this.activityRuleMethod = "deal";
            } else {
              this.activityRuleMethod = "sale";
              ruleKey = "sale_num";
              activityKey = "sale_count";
            }
          }
          rules = rules.sort((a, b) => {
            return a[ruleKey] - b[ruleKey];
          });
          activity["activity_start"] = activity["activity_start"] * 1000;
          activity["activity_end"] = activity["activity_end"] * 1000;
          this.activity = activity;
          this.shareCommission = this.activity.commission;
          let rankStart = this.activity.activity_order_count;
          for (const orderItem of this.activity.activity_order) {
            orderItem["_rank"] = rankStart--;
          }
          this.activityNewOrders = this.activity.activity_order.slice(0, 6);
          let everyStagePositionPercent = 100 / (rules.length - 1);
          rules[0]["_image"] = current_state;
          for (let index = 0; index < rules.length; index++) {
            const ruleItem = rules[index];
            const percentage = everyStagePositionPercent * index;
            const nextStage = rules[index + 1];

            if (this.currentStageIndex === null) {
              if (nextStage) {
                if (this.activity[activityKey] >= ruleItem[ruleKey] && this.activity[activityKey] < nextStage[ruleKey]) {
                  this.currentStageIndex = index;
                  ruleItem["_image"] = current_state;
                }
                this.nextStageIndex = index + 1;
              } else {
                if (this.activity[activityKey] >= ruleItem[ruleKey]) {
                  this.currentStageIndex = index;
                  ruleItem["_image"] = current_state;
                }
                this.nextStageIndex = null;
              }
            }

            if (index > 0) {
              ruleItem["positionLeft"] = `calc(${percentage}% - calc(4rem / 2))`;
            }
            ruleItem["percentage"] = percentage;
            // ruleItem["deal_price"] = Number(ruleItem["deal_price"]).toFixed(0);
          }
          rules[0]["positionLeft"] = "0%";

          if (this.currentStageIndex) {
            rules[this.currentStageIndex]["positionLeft"] = `calc(50% - calc(4rem / 2))`;
          }
          if (this.currentStageIndex === null) {
            this.nextStage = rules[0];
            this.nextStageIndex = 0;
          }

          this.lastStageIndex = rules.length - 1;
          this.activityRules = rules;
          this.member = member;
          this.activityTime();
          this.activityCalcCountKey = activityKey;
          this.ruleCalcKey = ruleKey;

          //* 电子合同
          if (this.activity.agreement == 1) {
            this.electronicAgreement.isShowPopupVerify = true;
            this.electronicAgreement.content = this.activity.agreement_content;
          }

          //* 客服
          if (typeof cservice === "string") {
            this.$set(this.connectServiceMethods, "online", cservice);
          } else {
            this.connectServiceMethods["online"] = cservice;
            this.$set(this.connectServiceMethods, "online", cservice.cservice);
            this.$set(this.connectServiceMethods, "tel", cservice.service_mobile);
            this.$set(this.connectServiceMethods, "qrcode", cservice.service_QRcode);
          }

          this.fun.wxShare(
            this.currentLinkContent,
            {},
            {
              title: this.activity.share.share_title,
              description: this.activity.share.share_desc,
              imgUrl: this.activity.share.share_img_src
            }
          );

          this.o2oStore = this.activity.has_one_polymorphism || {};
          if (activity.bind_goods.has_option == 1 && !activity.goods_option) {
            this.$toast("商品规格信息有误，请联系商家！");
          }
        });
    },
    getGoodDetail() {
      if (this.activityGoods) {
        this.showGoodsPopup = true;
        return;
      }
      $http
        .post("plugin.overseas.frontend.goods.get-goods-page", {
          id: Number(this.activity.bind_goods.id)
        })
        .then(({ data, msg, result }) => {
          if (result == 0) {
            Toast(msg);
            return;
          }
          this.showGoodsPopup = true;
          if (this.activity.status == 0) {
            if (this.activity.activity_start > Date.now()) {
              data.get_goods["end_time"] = this.activity.activity_start;
            } else if (this.activity.activity_end > Date.now()) {
              data.get_goods["end_time"] = this.activity.activity_end;
            }
          }

          this.activityGoods = data.get_goods;
        });
    },
    changedOrderGoodsCount(count) {
      if (this.activity.limit !== 0 && count >= this.activity.limit) {
        Toast("单次限购" + this.activity.limit + "件");
        this.orderGoodsCount = this.activity.limit;
      }
    },
    viewRanking() {
      if (this.activity.ranking_list == 0) {
        return;
      }
      this.$router.push(
        this.fun.getUrl(
          "depositGroupRanking",
          {},
          {
            activity_id: this.activity.id
          }
        )
      );
    },
    viewMoreOrders() {
      this.activityNewOrders = this.activity.activity_order;
      this.isViewedNewOrders = true;
    },
    //* 分发方法 单一职责
    selectShareOption({ key }) {
      switch (key) {
      case "link":
        this.copyLink = true;
        break;
      case "poster":
        this.displayPosterPopup();
        break;
      case "wechat":
        this.showShareGuide = true;
        break;
      }
    },
    displayPosterPopup() {
      this.poster.generating = true;
      $http
        .get("plugin.deposit-ladder.frontend.index.poster", {
          id: this.activityId
        })
        .then(({ data: { poster }, msg, result }) => {
          if (result == 0) {
            Toast(msg);
            this.poster.generating = false;
            return;
          }
          this.poster.image = poster;
          this.poster.generating = false;
        })
        .catch(() => {
          this.poster.generating = false;
        });
    },
    copyLinkSuccess() {
      this.copyLink = false;
      Toast("复制成功");
    },
    activityTime() {
      if (this.activity.activity_start > Date.now() && this.activity.status == 0) {
        //* 未开始
        this.activityTimestamp = this.activity.activity_start;
      } else {
        //* 进行中
        if (this.activity.activity_end < Date.now() || this.activity.status > 0) {
          this.activityOver = true;
        } else {
          this.activityTimestamp = this.activity.activity_end;
          this.activityInProgress = true;
          this.activityStarted = true;
        }
      }
    },
    activityTimend() {
      this.activityOver = true;
    },
    routerToOrderList() {
      this.$router.push(
        this.fun.getUrl("orderlist", {
          status: 0
        })
      );
    },
    placeOrder() {
      if (this.activityOver) {
        Toast("该活动已结束");
        return;
      }
      if (!this.activityStarted) {
        Toast("活动还未开始");
        return;
      }
      if (this.activity.agreement === 0) {
        this.checkAgreementStatus();
      } else {
        if (this.electronicAgreement.isShowPopupVerify) {
          if (this.electronicAgreement.isAgreed === false) {
            this.electronicAgreement.showPopup = true;
          } else {
            this.toOrderPage();
          }
          return;
        }
      }
    },
    agreeAgreement() {
      if (this.activity.agreement == 0) {
        this.$router.push(this.fun.getUrl("signPagePlu", { id: this.electronicAgreement.contractId }));
      } else {
        this.electronicAgreement.showPopup = false;
        this.electronicAgreement.isAgreed = true;
        this.toOrderPage();
      }
    },
    checkAgreementStatus() {
      this.placeOrderLoading = true;
      $http
        .post("plugin.deposit-ladder.frontend.yun-sign.check-yun-sign", {
          goods_id: this.activity.goods_id
        })
        .then(({ result, msg, data }) => {
          this.placeOrderLoading = false;
          if (result === 0) {
            this.$dialog.alert({ message: msg });
            return;
          }
          if (data.contract_id) {
            this.electronicAgreement.isAgreed = true;
            this.electronicAgreement.showPopup = true;
            this.electronicAgreement.contractId = data.contract_id;
          } else {
            this.toOrderPage();
          }
        });
    },
    toOrderPage() {
      if (this.orderGoodsCount < 1) {
        Toast("下单数量最少1件");
        return;
      }
      let submitActionTag = "-2"; //立即购买
      let _json = {
        goodsId: this.activity.goods_id,
        optionsId: 0,
        total: this.orderGoodsCount
      };

      if (this.o2oStore && this.o2oStore.polymorphism_id) {
        _json.store_id = this.o2oStore.polymorphism_id;
        submitActionTag = "o2oDeposit"; //门店的定金团
      }

      _json.tag = submitActionTag;
      this.$router.push(this.fun.getUrl("goodsorder", {}, _json));
    }
  },
  computed: {
    shareTitle() {
      if (this.activity.commission) {
        return `每成功邀请到一位好友下定，可获得 ${this.activity.commission} 元奖励`;
      } else {
        return "立即分享给好友";
      }
    }
  },
  components: {
    DTitle,
    DCopy,
    DTiming,
    ScopedPanel,
    VanImage,
    DFixed,
    ScopedActivityProgress,
    ScopedPageContainer,
    ScopedActionBar,
    ScopedPosterPopup,
    ScopedRuleList,
    YzGoodsPopup,
    YzWechatShareImage
  }
};
</script>

<style>
.activity-legend img {
  max-width: 100%;
}
</style>

<style scoped>
.panel-list {
  margin: 0 0.94rem;
}

.activity-panel {
  margin-top: 0.94rem;
}

.real-time-orders {
  /* position: fixed;
  z-index:3; */
  margin: 1.13rem 0.94rem 0.97rem;
  text-align: left;
}

.real-time-order-item {
  display: inline-flex;
  align-items: center;
  margin: 1px 0;
  padding: 0.18rem 0.56rem 0.18rem 0.18rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.72rem;
}

.real-time-order-nickname {
  margin-left: 0.28rem;
  font-size: 0.81rem;
  color: #464646;
}

/* 活动信息&商品信息 */
.activity-goods {
  position: relative;
  margin-top: 0.97rem;
}

.activety-goods-title-bg {
  position: absolute;
  z-index: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 4.3rem;
  opacity: 0.2;
  background-color: var(--page-main-color);
}

.activity-name {
  position: relative;
  z-index: 1;
  font-size: 1.06rem;
  color: #464646;
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
  color: #666;
}

.acitvity-relative-time-el {
  margin: 0 0.25rem;
  padding: 0.22rem 0.38rem;
  color: white;
  border-radius: 0.25rem;
  background-color: var(--page-main-color);
}

.acitvity-relative-time-el:first-child {
  margin-left: 0.84rem;
}

.activity-goods-details {
  display: flex;
  align-items: flex-start;
  margin-top: 1.3rem;
}

.activity-goods-cover {
  flex-shrink: 0;
}

.activity-goods-info {
  width: 100%;
  margin-left: 0.63rem;
  margin-top: -0.23rem;
}

.activity-goods-title {
  font-size: 0.94rem;
  color: #333;
  font-weight: bold;
}

.activity-goods-sku {
  margin-top: 0.43rem;
  line-height: 0.75rem;
  color: #666;
  font-size: 0.75rem;
}

.activity-goods-price {
  margin-top: 0.64rem;
  line-height: 0.94rem;
  font-size: 0.94rem;
  color: #202020;
  font-weight: bold;
}

.activity-goods-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 0.26rem;
}

.activity-goods-deposit {
  font-size: 0.88rem;
  color: #f14e4e;
  font-weight: bold;
}

/* 活动规则 */
.activity-progress {
  margin-top: 2rem;
}

.activity-rule-list {
  text-align: center;
}

.activity-rule-item {
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.activity-rule-item:last-child {
  margin-bottom: 0.5rem;
}

.activity-rule-item span {
  color: #f14e4e;
}

.activity-rule-item-active {
  padding: 0.53rem;
  margin-left: -0.53rem;
  width: calc(100% + 1.06rem);
  color: #ff2c29;
  box-shadow: 0.08rem 0.04rem 0.47rem 0.19rem rgba(232, 232, 232, 0.49);
}

.activity-rule-header {
  margin-bottom: 0.63rem;
  font-size: 0.75rem;
  color: #666;
}

.activity-rule-header span {
  color: white;
}

.activity-rule-tag {
  display: inline-block;
  margin-right: 0.44rem;
  padding: 0.24rem;
  color: white;
  font-size: 0.69rem;
  background-color: #ff2c29;
  border-radius: 0 0.78rem 0 0.78rem;
}

/* 活动说明  */
.activity-legend {
  line-height: 1.5rem;
  font-size: 1rem;
  letter-spacing: 0.05rem;
}

/* 参与记录 */
.activity-log-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.28rem;
  font-size: 0.81rem;
}

.activity-log-item div > span {
  vertical-align: top;
}

.activity-log-avatar {
  margin: 0 0.41rem 0 1.25rem;
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

/* 右侧悬浮按钮组 */
.quick-button-item {
  display: block;
  margin-bottom: 0.69rem;
  margin-right: 0.33rem;
  width: 2.5rem;
}

/* 分享赚 */
.share-commissonion {
  position: relative;
  margin-bottom: 0.5rem;
  padding-top: 11px;
  height: 3.88rem;
  width: 4.09rem;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  color: #f6bb6d;
  background-image: url("../../../assets/images/deposit_group/deposit_share_commission.png");
  background-size: cover;
  background-position: center;
}

.share-commissonion > div {
  margin: 0 auto;
  width: 35px;
  background-image: linear-gradient(to bottom, #eb7402, #f7a910);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.share-commissonion > div > i {
  font-size: 6.89px;
}

.electronic-agreement {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.9375rem;
  height: 100%;
  font-size: 1rem;
}

.electronic-agreement-title {
  flex-shrink: 0;
  font-weight: bold;
  font-size: 1.125rem;
}

.electronic-agreement-content {
  flex-grow: 1;
  margin: 0.625rem 0;
  overflow: hidden auto;
  white-space: pre-wrap;
  text-align: left;
}

.electronic-contract-content {
  flex-grow: 1;
  margin-top: 48px;
  font-size: 1rem;
  text-align: left;
}

.electronic-contract-content p::first-line {
  text-indent: 2em;
}

.electronic-contract-content p:nth-child(2) {
  margin: 1.875rem 0;
  color: #f14e4e;
}

.electronic-contract-content p:nth-child(3) {
  font-weight: bold;
}

.electronic-agreement-confirm {
  flex-shrink: 0;
  width: 100%;
  font-size: 1.125rem;
  font-weight: bold;
  background-color: var(--page-main-color);
  border-color: 1px solid var(--page-main-color);
}
</style>
