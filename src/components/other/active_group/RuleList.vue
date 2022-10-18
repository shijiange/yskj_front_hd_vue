<template>
  <ul class="activity-rule-list">
    <li
      class="activity-rule-item"
      :class="{ 'activity-rule-item-active':currentStageIndex==ruleItemIndex }"
      v-for="(ruleItem,ruleItemIndex) in rules"
      :key="ruleItem.id"
    >
      <div class="activity-rule-left">
        <div class="activity-rule-header" v-if="currentStageIndex==ruleItemIndex&&nextStage">
          <span class="activity-rule-tag">当前梯队</span>
          再邀请{{nextStage.step_people - activity.invite_count }}人可进入下一梯队
        </div>
        <div>
          <span v-if="ruleItem.step_reward">邀请达到<span class="red-text">{{ ruleItem.step_people }}</span>人，即可获得奖励</span>
          <span v-else>邀请{{ ruleItem.step_people }}人以下，无奖励</span>
        </div>
      </div>
      <i
        class="iconfont icon-qt_icon_record" @click="clickRewardIcon(ruleItem.step_reward)"
        v-if="ruleItem.step_reward && ruleItem.step_reward.exist_reward==1"
      ></i>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    activityCalcCountKey: String,
    ruleCalcKey: String,
    currentStageIndex: Number,
    rules: Array,
    activity: Object,
    nextStage: Object
  },
  methods: {
    clickRewardIcon (data) {
      this.$emit("clickRewardIcon", data);
    }
  }
};
</script>

<style scoped lang='scss' rel='stylesheet/scss'>
.activity-rule-list {
  text-align: center;
}

.activity-rule-item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;

  .red-text {
    color: #f14e4e;
  }

  .activity-rule-left {
    flex: 1;
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
  }

  .icon-qt_icon_record {
    margin: 0 1rem;
    font-size: 1.2rem;
    color: #aeaeae;
  }
}

.activity-rule-item:last-child {
  margin-bottom: 0.5rem;
}


.activity-rule-item-active {
  padding: 0.53rem;
  margin-left: -0.53rem;
  width: calc(100% + 1.06rem);
  color: #ff2c29;
  box-shadow: 0.08rem 0.04rem 0.47rem 0.19rem rgba(232, 232, 232, 0.49);

  .icon-qt_icon_record {
    color: #ff2c29 !important;
  }
}
</style>