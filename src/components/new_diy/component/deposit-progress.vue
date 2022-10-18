<template>
  <div :style="{'--bgColor': baseColor}">
    <div class="steps_box">
      <div id="progress">
        <div class="progress"></div>
        <div class="activity-progress-current" :style="{ width: progressPercent+'%' }"></div>
      </div>
      <div class="steps_all">
        <div class="steps_one_cont" v-for="(ladderItem,itemIndex) in rules" :class="[ ladderItem._className ]"
             :key="ladderItem.id" :style=" { left:ladderItem.positionLeft } ">
          <!-- 气泡 -->
          <div class="progress-animation-els" v-if="showBubbleIndex==itemIndex" :style=" { left: progressPercent+'%' } ">
            <div class="progress-animation-el">+1</div>
            <div class="progress-animation-el">+1</div>
            <div class="progress-animation-el progress-animation-el-mini" style="animation-delay: 1.5s;"></div>
            <div class="progress-animation-el progress-animation-el-mini" style="animation-delay: 1.8s;"></div>
            <div class="progress-animation-el" style="animation-delay: 1.3s;">+1</div>
            <div class="progress-animation-el" style="animation-delay: 1s;">+1</div>
          </div>

          <div class="icon aniamtion">
            <img class="img" :src="ladderItem._image" v-if="ladderItem._image"/>
          </div>
          <div style="color: #ff2c29;">￥{{ ladderItem['deal_price'] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import current_state from "../../../assets/images/deposit_group/deposit_group_current_state.png";
import last_state from "../../../assets/images/deposit_group/deposit_group_last_stage.png";

export default {
  props: {
    baseColor: {
      type: String,
      default: "#096"
    },
    data: Array,
    currentStageIndex: {
      type: Number,
      default: null
    },
    nextStageIndex: {
      type: Number,
      default: null
    },
    lastStageIndex: {
      type: Number,
      default: null
    },
    currentStagePercent: {
      type: Number,
      default: 1
    },
    goodsPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      current_state,
      last_state,
      scopedCurrentStageIndex: 0,
      scopedLastStageIndex: 0,
      showBubbleIndex: 0,
      rules: []
    };
  },
  computed: {
    progressPercent() {
      if (this.scopedCurrentStageIndex) {
        if (this.scopedCurrentStageIndex == this.scopedLastStageIndex) {
          return 100;
        }
        return 52;
      }
      return 0;
    }
  },
  mounted() {
    let rules = this.data;
    let filterRules = [];

    rules[0]["_className"] = "activity-stage-first";
    filterRules.push(rules[0]);
    this.scopedLastStageIndex = this.lastStageIndex;
    if (this.currentStageIndex) {
      rules[this.currentStageIndex]["_className"] = "activity-stage-current";
      filterRules.push(rules[this.currentStageIndex]);
      this.scopedCurrentStageIndex = this.currentStageIndex;
      this.showBubbleIndex = this.currentStageIndex;
      this.showBubbleIndex = 1;
    } else {
      if (this.currentStageIndex === 0) {
        this.scopedCurrentStageIndex += 1;
        this.scopedLastStageIndex++;
        this.showBubbleIndex = 1;
      }

      filterRules.unshift({
        positionLeft: "0%",
        _image: current_state,
        deal_price: this.goodsPrice,
        _className: "activity-stage-first"
      });
      rules[0]["_className"] = "activity-stage-current";
      rules[0]["positionLeft"] = "calc(50% - calc(1.84rem / 2))";
    }

    rules[this.lastStageIndex]["_className"] = "activity-stage-last";
    rules[this.lastStageIndex]["positionLeft"] = "calc(100% - 1.84rem)";
    rules[this.lastStageIndex]["percentage"] = 100;
    rules[this.lastStageIndex]["_image"] = last_state;
    filterRules.push(rules[this.lastStageIndex]);

    this.rules = filterRules;
  },
  methods: {},
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  // 进度条样式
  .steps_box {
    margin: 0 auto 1rem auto;
    width: 90%;
    background-color: white;
    height: 4rem;
    position: relative;

    #progress {
      margin: auto;
      position: absolute;
      bottom: 35%;
      width: 100%;
      height: 0.8rem;
      border-radius: 0.8rem;
      overflow: hidden;
    }

    .progress {
      margin: auto;
      position: absolute;
      bottom: 35%;
      width: 100%;
      height: 0.8rem;
      background: var(--bgColor);
      opacity: 0.3;
      border-radius: 0.8rem;
      overflow: hidden;
    }

    .activity-progress-current {
      position: absolute;
      top: 0;
      left: 0;
      height: 0.6rem;
      border-radius: 0.6rem;
      background: var(--bgColor);
      transition: width 0.36s ease-in-out;
    }

    .steps_all {
      width: 100%;
      height: 3rem;
      position: absolute;
      right: 0;
      top: 0.9rem;
      margin-top: 0.3rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
    }

    .steps_one_cont {
      width: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
    }

    .steps_one_cont:last-child {
      align-items: flex-end;
      margin-right: -2px;
    }

    .steps_one_cont:nth-child(1) img {
      width: 1rem;
      height: 1.2rem;
    }

    .steps_one_cont:nth-child(2) img {
      width: 1.2rem;
      height: 1.4rem;
    }

    .steps_one_cont:nth-child(3) img {
      width: 1.4rem;
      height: 1.7rem;
    }

    /* 动画 */
    .progress-animation-els {
      position: absolute;
      left: 0;
      width: 5px;
      height: 5px;
      top: 0;
    }

    .progress-animation-el {
      position: absolute;
      top: 0;
      left: 0;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
      color: white;
      font-size: 12px;
      border-radius: 50%;
      background: linear-gradient(to bottom, rgb(225, 45, 43), rgb(245, 137, 65));
      transform: scale(0);
      animation: bottomToTopFromRight 1.5s infinite 0s linear;
    }

    .progress-animation-el-mini {
      width: 5px;
      height: 5px;
    }

    .progress-animation-el:nth-child(1) {
      animation: bottomToTopFromRight30 2s infinite 2.1s linear;
      background: linear-gradient(to top, rgb(245, 239, 111), rgb(240, 185, 28));
    }

    .progress-animation-el:nth-child(2) {
      animation: bottomToTopFromRight10 2.5s infinite 2.1s linear;
      background: linear-gradient(to bottom, rgb(39, 171, 227), rgb(149, 227, 247));
    }

    .progress-animation-el:nth-child(3) {
      animation: bottomToTopFromRight10 3.2s infinite 2s linear;
      background: linear-gradient(to bottom, rgb(245, 239, 111), rgb(240, 185, 28));
    }

    .progress-animation-el:nth-child(4) {
      animation: bottomToTopFromLeft10 2.6s infinite 2.5s linear;
      background: linear-gradient(to bottom, rgb(39, 171, 227), rgb(149, 227, 247));
    }

    .progress-animation-el:nth-child(5) {
      animation: bottomToTopFromLeft10Right10 2.8s infinite 3.5s linear;
      background: linear-gradient(to top, rgb(245, 239, 111), rgb(240, 185, 28));
    }

    /* 靠右从底部向上 */
    @keyframes bottomToTopFromRight {
      0% {
        transform: rotate(0) scale(0) translateX(0);
      }

      78% {
        transform: rotate(0) scale(1) translateX(10px) translateY(-60px);
        transform-origin: 0;
        opacity: 1;
      }

      100% {
        transform: rotate(0) scale(1) translateX(10px) translateY(-80px);
        transform-origin: 50% -80px;
        opacity: 0;
      }
    }

    /* 向右偏移10px 自底向上 */
    @keyframes bottomToTopFromRight10 {
      0% {
        transform: rotate(0) scale(0) translateX(0);
      }

      68% {
        transform: rotate(0) scale(1) translateX(10px) translateY(-15px);
        transform-origin: 0;
      }

      88% {
        transform: rotate(0) scale(1) translateX(10px) translateY(-50px);
        transform-origin: 0;
        opacity: 1;
      }

      100% {
        transform: rotate(0) scale(1) translateX(10px) translateY(-75px);
        transform-origin: 50% -80px;
        opacity: 0;
      }
    }

    /* 向右偏移30px 自底向上 */
    @keyframes bottomToTopFromRight30 {
      0% {
        transform: rotate(0) scale(0) translateX(0);
      }

      68% {
        transform: rotate(0) scale(1) translateX(30px) translateY(-15px);
        transform-origin: 0;
      }

      88% {
        transform: rotate(0) scale(1) translateX(30px) translateY(-50px);
        transform-origin: 0;
        opacity: 1;
      }

      100% {
        transform: rotate(0) scale(1) translateX(30px) translateY(-75px);
        transform-origin: 50% -80px;
        opacity: 0;
      }
    }

    /* 向右偏移50 自底向上 */
    @keyframes bottomToTopFromRight50 {
      0% {
        transform: rotate(0) scale(0) translateX(0);
      }

      48% {
        transform: rotate(0) scale(1) translateX(50px) translateY(-15px);
        transform-origin: 0;
        opacity: 1;
      }

      100% {
        transform: rotate(0) scale(1) translateX(50px) translateY(-50px);
        transform-origin: 50% -80px;
        opacity: 0;
      }
    }

    /* 向左偏移10 自底向上 */
    @keyframes bottomToTopFromLeft10 {
      0% {
        transform: rotate(0) scale(0) translateX(0);
      }

      48% {
        transform: rotate(0) scale(1) translateX(-10px) translateY(-5px);
        transform-origin: 0;
        opacity: 1;
      }

      100% {
        transform: rotate(0) scale(1) translateX(-10px) translateY(-60px);
        transform-origin: 50% -80px;
        opacity: 0;
      }
    }

    /* 向左偏移10 然后向右偏移10 自底向上 */
    @keyframes bottomToTopFromLeft10Right10 {
      0% {
        transform: rotate(0) scale(0) translateX(0);
      }

      38% {
        transform: rotate(0) scale(1) translateX(-10px) translateY(-5px);
        transform-origin: 0;
        opacity: 1;
      }

      100% {
        transform: rotate(0) scale(1) translateX(10px) translateY(-80px);
        transform-origin: 50% -80px;
        opacity: 0;
      }
    }
  }
</style>
