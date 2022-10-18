<template>
  <div class="U000042-template1 " :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <!--定金组件静态-->
    <div class="lottery-box size-con" v-if="datas.activity && datas.activity.id">
      <div class="activity-info">
        <div class="info">
          <div class="activity-name">{{activity.activity_name}}</div>
          <div class="count-down active">
            <template v-if="activityOver">
              <div>活动已结束</div>
            </template>
            <template v-else>
              <div v-if="activityInProgress">距离活动结束还剩</div>
              <div v-else>距离活动开始还有</div>
              <van-count-down use-slot :time="activityTimestamp" @ended="activityTimend">
                <template #default="timeData">
                  <div class="bottom-time">
                    <span class="radius-box">{{ timeData.days }}</span>
                    <span class="span">天</span>
                    <span class="radius-box">{{ timeData.hours }}</span>
                    <span class="span">:</span>
                    <span class="radius-box">{{ timeData.minutes }}</span>
                    <span class="span">:</span>
                    <span class="radius-box">{{ timeData.seconds }}</span>
                  </div>
                </template>
              </van-count-down>
            </template>
          </div>
        </div>
        <!-- 商品信息 -->
        <div class="com-info" v-if="activity.bind_goods" @click="toActivity">
          <img class="com-left-img" :src="activity.bind_goods.thumb_src"/>
          <div class="com-right-box">
            <div class="com-title">{{ activity.bind_goods.title }}</div>
            <div class="activity-goods-sku" v-if="activity.bind_goods.has_option">规格：{{ activity.goods_option.title }}
            </div>
            <div class="com-price">￥{{ activity.bind_goods.price }}</div>
            <div class="com-deposit">
              <span style="line-height: 28px;">定金： ￥{{ activity.deposit }}</span>
              <div class="num">
                <div class="reduce-goods">-</div>
                <div class="good-num">1</div>
                <div class="add-goods">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动规则 -->
      <div class="activity-rule container-box" v-if="activity.bind_goods">
        <div class="panel-title-decoration">
          <div class="panel-title-decoration-item"></div>
          <div class="panel-title-decoration-item"></div>
        </div>
        <div class="panel-title">活动规则</div>
        <div class="panel-title-decoration">
          <div class="panel-title-decoration-item"></div>
          <div class="panel-title-decoration-item"></div>
        </div>

        <!-- 进度条 -->
        <deposit-progress :baseColor="datas.tips_bg_color" :data="activityRules"
                          :currentStageIndex="currentStageIndex"
                          :lastStageIndex="lastStageIndex"
                          :currentStagePercent="currentStagePercent"
                          :goodsPrice="activity.bind_goods.price"
                          :nextStageIndex="nextStageIndex"></deposit-progress>

        <!-- 梯队 -->
        <div>
          <div class="rule-condition" :class="{ 'activity-rule-item-active':currentStageIndex==null }">
            <div class="diff-tip" v-if="currentStageIndex==null&&nextStage">
              <div class="current-ladder">当前梯队</div>
              <div style="line-height: 24px;">
                还差<span>{{ activityRules[nextStageIndex][ruleCalcKey]-activity[activityCalcCountKey] }} {{ activityRuleMethod=="deal"?"人":"件" }}</span>可以进入下一梯队
              </div>
            </div>
            <div class="stage">
              <span>{{ activityRuleMethod=="deal"?"支付":"销售" }}达到</span>
              <span class="red-text" v-if="activityRules[0]">{{ activityRules[0][ruleCalcKey] }}{{ activityRuleMethod=="deal"?"人":"件" }}</span>
              <span>以下，价格</span><span class="red-text" v-if="activity.bind_goods">￥{{ activity.bind_goods.price }}</span>
            </div>
          </div>
          <div class="rule-condition" :class="{ 'activity-rule-item-active':currentStageIndex==ruleItemIndex }"
               v-for="(ruleItem,ruleItemIndex) in activityRules" :key="ruleItem.id">
            <div class="diff-tip" v-if="currentStageIndex==ruleItemIndex&&nextStageIndex!==null">
              <div class="current-ladder">当前梯队</div>
              <div style="line-height: 24px;">
                还差<span>{{ activityRules[nextStageIndex][ruleCalcKey]-activity[activityCalcCountKey] }} {{ activityRuleMethod=="deal"?"人":"件" }}</span>可以进入下一梯队
              </div>
            </div>
            <div class="stage">
              <span>{{ activityRuleMethod=="deal"?"支付":"销售" }}达到</span>
              <span class="red-text">{{ ruleItem[ruleCalcKey] }} {{ activityRuleMethod=="deal"?"人":"件" }}</span>
              <span>以下，价格</span><span class="red-text">￥{{ ruleItem.deal_price }}</span>
            </div>
          </div>
        </div>

      </div>
      <div class="btn-buy" @click="toActivity">立即下定</div>
    </div>

  </div>
</template>

<script>
import emptyImage from "../../assets/images/new_diy/image.png";
import DepositProgress from "./component/deposit-progress";
import current_state from "../../assets/images/deposit_group/deposit_group_current_state.png";

// 自定义样式
const css = function() {
  if (this.datas.preview_color) {
    const {
      preview_color,
      time_bg_color,
      tips_bg_color,
      class_font_size,
      class_font_color,
      class_bg_color,
      class_border_radius
    } = this.datas;

    return `
      .component-${this.id} .lottery-box {
          background-color: ${preview_color.color || "#f8f8f8"};
          background-image: url(${preview_color.isColor == 2 ? preview_color.image || emptyImage : ""});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
      }

      .component-${this.id} .radius-box {
        background-color: ${time_bg_color};
      }

      .component-${this.id} .activity-info .info::before {
        background-color: ${preview_color.isColor == 1 ? preview_color.color : "#fff"};
      }

      .component-${this.id} .panel-title {
        color: ${tips_bg_color};
      }

      .component-${this.id} .panel-title-decoration-item {
         background: linear-gradient(to bottom, ${tips_bg_color}, transparent);
      }

      .component-${this.id} .btn-buy{
          background-color: ${class_bg_color};
          border-radius: ${class_border_radius}px;
          font-size: ${class_font_size}px;
          color: ${class_font_color};
      }
  `;
  }
};

export default {
  props: ["id", "datas"],
  data() {
    return {
      emptyImage,
      current_state,
      activityTimestamp: 0,
      activityInProgress: false,
      activityOver: false,
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
      activity: {},
      activityRules: []
    };
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  activated() {
    this.show = false;
  },
  mounted() {
    if(this.datas.activity && this.datas.activity.id) {
      this.getActivity(this.datas.activity);
    }
  },
  methods: {
    toActivity() {
      this.$router.push(this.fun.getUrl('depositGroupActivity',{},{id: this.datas.activity.id}));
    },
    getActivity(activity) {
      this.activity = activity;
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
          ruleItem["positionLeft"] = `calc(${percentage}% - calc(1.84rem / 2))`;
        }
        ruleItem["percentage"] = percentage;
        ruleItem["deal_price"] = Number(ruleItem["deal_price"]).toFixed(0);
      }
      rules[0]["positionLeft"] = "0%";

      if (this.currentStageIndex) {
        rules[this.currentStageIndex]["positionLeft"] = `calc(50% - calc(1.84rem / 2))`;
      }
      if (this.currentStageIndex === null) {
        this.nextStage = rules[0];
        this.nextStageIndex = 0;
      }

      this.lastStageIndex = rules.length - 1;
      this.activityRules = rules;
      this.activityTime();
      this.activityCalcCountKey = activityKey;
      this.ruleCalcKey = ruleKey;
    },
    activityTime() {
      if (this.activity.activity_start > parseInt(Date.now() / 1000) && this.activity.status == 0) {
        //* 未开始
        this.activityTimestamp = parseInt(this.activity.activity_start - parseInt(Date.now() / 1000)) * 1000;
      } else {
        //* 进行中
        if (this.activity.activity_end < Number(Date.now() / 1000) || this.activity.status > 0) {
          this.activityOver = true;
        } else {
          this.activityTimestamp = parseInt(this.activity.activity_end - parseInt(Date.now() / 1000)) * 1000;
          this.activityInProgress = true;
          this.activityStarted = true;
        }
      }
    },
    activityTimend() {
      this.activityOver = true;
    }
  },

  components: {
    DepositProgress
  }

};
</script>

<style lang="scss" scoped>
  .size-con {
    background-repeat: no-repeat;
    background-size: contain;
  }

  .lottery-box {
    position: relative;
    box-sizing: border-box;
    padding: 1rem 0.8rem;
  }

  .lottery-box div {
    box-sizing: border-box;
  }

  .panel-title {
    display: inline-block;
    margin: 0 0.5rem 0.5rem 0.5rem;
    font-size: 16px;
    font-weight: bolder;
  }

  .container-box {
    margin-top: 1.2rem;
    padding: 0.5rem;
    text-align: center;
    background-color: #fff;
    border-radius: 0.3rem;
    overflow: hidden;
  }

  .activity-info {
    background-color: #fff;
    border-radius: 0.8rem;
    overflow: hidden;
  }

  .activity-info .info {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0.8rem 0;
  }

  .activity-info .info::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
  }

  .activity-info .activity-name {
    z-index: 1;
    font-size: 16px;
    font-weight: bold;
    color: #464646;
  }

  .activity-info .count-down,
  .activity-info .active {
    z-index: 1;
    display: flex;
    align-items: center;
    margin-top: 0.8rem;
    color: #666;
    font-size: 14px;
  }

  .activity-info .end {
    font-size: 0.6rem;
    font-weight: normal;
    margin-top: 0.8rem;
  }

  .count-down .bottom-time {
    display: flex;
    margin-left: 0.8rem;
    align-items: center;
  }

  .count-down .bottom-time .radius-box {
    padding: 0.2rem 0.5rem;
    margin: 0 2px;
    color: #fff;
    border-radius: 0.4rem;
    font-weight: 400;
    text-align: center;
  }

  .count-down .bottom-time .text {
    padding: 0 0.281rem;
    display: flex;
    align-items: center;
  }

  .activity-progress {
    margin-top: 2rem;
  }

  .activity-info .com-info {
    display: flex;
    width: 100%;
    padding: 1rem;
    text-align: left;
  }

  .com-info .com-left-img {
    width: 6rem;
    height: 6rem;
    border-radius: 0.5rem;
    margin: 0;
  }

  .com-info .com-right-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 0.8rem;
    letter-spacing: 0;
    font-size: 14px;
  }

  .com-right-box .com-title {
    font-weight: bold;
    color: #333;
  }

  .activity-goods-sku {
    margin: 0.5rem 0;
    line-height: 0.75rem;
    color: #666;
    font-size: 0.75rem;
  }

  .com-right-box .com-opt {
    font-size: 12px;
    font-weight: lighter;
    color: #999;
  }

  .com-right-box .com-price {
    font-weight: bold;
    color: #202020;
  }

  .com-right-box .com-deposit {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    color: #f14e4e;
  }

  .com-right-box .com-deposit .num {
    display: flex;
    align-items: center;
  }

  .num .reduce-goods,
  .num .add-goods {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    line-height: 1.5rem;
    text-align: center;
    color: #eee;
  }

  .num .reduce-goods {
    background-color: #c9c8c8;
  }

  .num .add-goods {
    background-color: #f14e4e;
  }

  .num .good-num {
    color: #202020;
    font-weight: 400;
    font-size: 16px;
    padding: 0 0.8rem;
  }

  .activity-rule {
    margin-top: 0.8rem;
    padding: 1.2rem 0;
    text-align: center;
  }

  .rule-condition {
    margin: 0.5rem auto 0 auto;
    padding: 0.5rem 0;
    font-size: 14px;
  }

  .red-text {
    font-weight: 400;
    color: #ff2c29;
  }

  .diff-tip {
    display: flex;
    justify-content: center;
    font-size: 12px;
    margin-bottom: 0.4rem;
  }

  .diff-tip .current-ladder {
    display: inline-block;
    padding: 0.2rem 0.4rem;
    border-radius: 0 0.8rem;
    font-size: 12px;
    color: #fff;
    background-color: #ff2c29;
    margin-right: 5px;
  }

  .panel-title-decoration {
    display: inline-block;
  }

  .panel-title-decoration-item {
    display: inline-block;
    margin-right: 0.375rem;
    width: 0.1875rem;
    height: 0.8125rem;
    transform: skew(-25deg, 10deg);
  }

  .btn-buy {
    width: 50%;
    display: inline-block;
    margin: 15px auto 0 auto;
    padding: 10px;
  }

  .activity-rule-item-active {
    padding: 0.53rem;
    margin-left: -0.53rem;
    width: calc(100% + 1.06rem);
    box-shadow: 0.08rem 0.04rem 0.47rem 0.19rem rgba(232, 232, 232, 0.49);

    .stage {
      color: #ff2c29;
    }
  }
</style>
