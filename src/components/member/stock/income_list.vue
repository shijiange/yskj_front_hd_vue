<template>
  <ul class="member-income-list">
    <li class="member-income-item">
      <div class="member-income-count">
        <span>{{ transportAward }}</span>元
      </div>
      <span class="member-income-title">走货奖励</span>
    </li>
    <li class="member-income-item">
      <div class="member-income-count">
        <span>{{ transductiveAgencyAward }}</span>元
      </div>
      <span class="member-income-title">直推代理商奖</span>
    </li>
    <li class="member-income-item">
      <div class="member-income-count">
        <span>{{ transductiveAward }}</span>元
      </div>
      <span class="member-income-title">直推奖</span>
    </li>
    <li class="member-income-item">
      <div class="member-income-count">
        <span>{{ sidewaysAward }}</span>元
      </div>
      <span class="member-income-title">平级奖</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "IncomeList",
  props: {
    transportAward: {
      type: Number,
      default: 0
    },
    transductiveAgencyAward: {
      type: Number,
      default: 0
    },
    transductiveAward: {
      type: Number,
      default: 0
    },
    sidewaysAward: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped>
.member-income-list {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  padding: 0.9375rem 0.5rem;
  background: white;
}

.member-income-item {
  height: 2.375rem;
  width: 100%;
  text-align: center;
  overflow: hidden;
}

.member-income-count {
  height: 1.1875rem;
  overflow: hidden;
  font-size: 14px;
  color: #f15353;
}

.member-income-title {
  margin-top: 11px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>