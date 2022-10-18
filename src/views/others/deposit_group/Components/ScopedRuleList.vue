<template>
  <ul class="activity-rule-list">
    <li class="activity-rule-item" :class="{ 'activity-rule-item-active':currentStageIndex==null }">
      <div class="activity-rule-header" v-if="currentStageIndex==null&&nextStage">
        <span class="activity-rule-tag">当前梯队</span>
        还差{{ rules[nextStageIndex][ruleCalcKey]-activity[activityCalcCountKey] }}{{ activityRuleMethod=='deal'?'人':'件' }}可进入下一梯队
      </div>
      {{ activityRuleMethod=='deal'?'支付':'销售' }}
      <span>{{ rules[0][ruleCalcKey] }}</span>
      {{ activityRuleMethod=='deal'?'人':'件' }}以下，价格
      <span>￥{{ activity.bind_goods.price }}</span>
    </li>
    <li
      class="activity-rule-item"
      :class="{ 'activity-rule-item-active':currentStageIndex==ruleItemIndex }"
      v-for="(ruleItem,ruleItemIndex) in rules"
      :key="ruleItem.id"
    >
      <div
        class="activity-rule-header"
        v-if="currentStageIndex==ruleItemIndex&&nextStageIndex!==null"
      >
        <span class="activity-rule-tag">当前梯队</span>
        还差{{rules[nextStageIndex][ruleCalcKey]-activity[activityCalcCountKey] }} {{ activityRuleMethod=='deal'?'人':'件' }}可进入下一梯队
      </div>
      {{ activityRuleMethod=='deal'?'支付':'销售' }}达到
      <span>{{ ruleItem[ruleCalcKey] }}</span>
      {{ activityRuleMethod=='deal'?'人':'件' }}，价格
      <span>￥{{ ruleItem.deal_price }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    activityRuleMethod: String,
    activityCalcCountKey: String,
    ruleCalcKey: String,
    currentStageIndex: Number,
    nextStageIndex: Number,
    rules: Array,
    activity: Object,
    nextStage: Object
  }
};
</script>

<style scoped>
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
</style>