<template>
  <!-- //! 模块数组，请尽量不要用在其它模块，如其它模块也需使用请提取为全局组件，并且去掉Scoped前缀 -->
  <div class="activity-progress">
    <div class="activity-progress-bar">
      <div class="activity-progress-current" :style="{ width:progressPercent+'%' }"></div>
      <div class="activity-progress-overall"></div>
    </div>
    <div class="activity-stage">
      <template v-for="(ladderItem,itemIndex) in rules">
        <div
          class="activity-stage-item"
          :class="[ ladderItem._className ]"
          :key="ladderItem.id"
          :style=" { left:ladderItem.positionLeft } "
        >
          <div class="progress-animation" v-if="showBubbleIndex==itemIndex">
            <ul class="progress-animation-els">
              <li class="progress-animation-el">+1</li>
              <li class="progress-animation-el">+1</li>
              <li
                class="progress-animation-el progress-animation-el-mini"
                style="animation-delay: 1.5s;"
              ></li>
              <li
                class="progress-animation-el progress-animation-el-mini"
                style="animation-delay: 1.8s;"
              ></li>
              <li class="progress-animation-el" style="animation-delay: 1.3s;">+1</li>
              <li class="progress-animation-el" style="animation-delay: 1s;">+1</li>
            </ul>
          </div>
          <img :src="ladderItem._image" class="activity-stage-img" v-if="ladderItem._image" />
          <div class="activity-stage-price">￥{{ ladderItem['deal_price'] }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import current_state from "../../../../assets/images/deposit_group/deposit_group_current_state.png";
import last_stage from "../../../../assets/images/deposit_group/deposit_group_last_stage.png";
export default {
  props: {
    data: Array,
    orderCount: {
      type: Number,
      default: 12
    },
    salesCount: Number,
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
      //* scoped 命名空间 用于组件内的 作为区分
      scopedCurrentStageIndex: 0,
      scopedLastStageIndex: 0,
      showBubbleIndex: 0,
      rules: []
    };
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
      rules[0]["positionLeft"] = "calc(50% - calc(4rem / 2))";
    }

    rules[this.lastStageIndex]["_className"] = "activity-stage-last";
    rules[this.lastStageIndex]["positionLeft"] = "calc(100% - 4rem)";
    rules[this.lastStageIndex]["percentage"] = 100;
    rules[this.lastStageIndex]["_image"] = last_stage;
    filterRules.push(rules[this.lastStageIndex]);

    this.rules = filterRules;
  },
  computed: {
    progressPercent() {
      if (this.scopedCurrentStageIndex) {
        if (this.scopedCurrentStageIndex == this.scopedLastStageIndex) {
          return 100;
        }
        return 50;
      }
      return 0;
    }
  }
};
</script>

<style scoped>
.progress-animation-els {
  position: absolute;
  z-index: 3;
  top: 1.125rem;
  left: -15px;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 0;
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

.activity-progress {
  position: relative;
  height: 3.5rem;
}

.activity-progress-bar {
  position: relative;
}

.activity-progress-current {
  position: absolute;
  top: 0;
  left: 0;
  height: 0.63rem;
  border-radius: 0.63rem;
  background-color: var(--page-main-color);
  transition: width 0.36s ease-in-out;
}

.activity-progress-overall {
  width: 100%;
  height: 0.63rem;
  opacity: 0.2;
  border-radius: 10px;
  background-color: var(--page-main-color);
}

.activity-stage {
  position: absolute;
  top: -0.97rem;
  width: 100%;
}

.activity-stage-item {
  position: absolute;
  width: 4rem;
  text-align: center;
}

.activity-stage-img {
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.activity-stage-price {
  color: #f14e4e;
  font-size: 0.75rem;
  transform: translateY(38px);
}

.activity-stage-first .activity-stage-img {
  width: 1.06rem;
  transform: translateY(0.63rem);
}

.activity-stage-current .activity-stage-img {
  width: 1.28rem;
  transform: translateY(0.38rem);
}

.activity-stage-last .activity-stage-img {
  width: 1.84rem;
}
</style>