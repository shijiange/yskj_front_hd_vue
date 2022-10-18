<template>
  <!-- //! 活动进度条模块 -->
  <div class="activity-progress">
    <div class="activity-progress-bar">
      <div class="activity-progress-current" :style="progressStyle"></div>
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
          <div
            v-if="ladderItem.step_reward && ladderItem.step_reward.exist_reward==1"
            class="view-prize" @click="viewPrize(itemIndex)"
          >查看奖品</div>
          <div v-else class="no-prize" ></div>
          <!-- 气泡动画 -->
          <!-- <bubble-animation v-if="showBubbleIndex==itemIndex"></bubble-animation> -->
          <i class="iconfont icon-kehuqunzu"></i>
          <div class="activity-stage-price">{{ ladderItem['step_people'] ? ladderItem['step_people'] : 0 }}人</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// import BubbleAnimation from "@/components/other/active_group/BubbleAnimation";
export default {
  props: {
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
  },
  data() {
    return {
      showBubbleIndex: 0,
      rules: [],
    };
  },
  mounted() {
    let rules = JSON.parse(JSON.stringify(this.data));
    this.rules = rules;
    this.showBubbleIndex = this.currentStageIndex;
  },

  methods: {
    viewPrize (itemIndex) {
      this.$emit("viewPrize", itemIndex);
    }
  },

  computed: {
    progressStyle() {
      // 进度条上最多只有三个进度，返回固定的值
      let style = {};
      if (this.currentStageIndex) {
        style.width = (this.currentStageIndex == this.lastStageIndex) ? '100%' : '50%';
      } else {
        style.width = `${4.2 / 2}rem`;
      }
      return style;
    }
  },
  components: {
    // BubbleAnimation
  }
};
</script>

<style scoped lang='scss' rel='stylesheet/scss'>
.activity-progress {
  position: relative;
  height: 5.5rem;
  display: inline-block;
  width: 100%;
}

.activity-progress-bar {
  position: relative;
  margin-top: 2.4rem;
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
}

.activity-stage {
  position: absolute;
  top: 0;
  width: 100%;
  .activity-stage-item {
    position: absolute;
    width: 4.2rem;
    text-align: center;
  }

  .icon-kehuqunzu {
    color: #df3221;
    font-size: 1.8rem;
  }

  .view-prize, .no-prize {
    position: relative;
    border-radius: 0.13rem;
    color: #464646;
    white-space: nowrap;
    padding: 0.2rem 0.4rem;
    height: 1.7rem;
    line-height: 1.3rem;
  }
  .view-prize::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    background-color: var(--page-main-color);
  }
  .no-prize {
    color: #9e9d9d;
  }

  .activity-stage-price {
    color: #f14e4e;
    font-size: 0.75rem;
  }
}
</style>