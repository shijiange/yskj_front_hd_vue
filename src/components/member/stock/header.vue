<template>
  <div class="header">
    <div class="member-info" v-if="user">
      <img :src="user.avatar" class="member-avatar" />
      <div class="member-details">
        <div class="member-nickname">{{ user.nickname||user.uid }}</div>
        <div class="member-level" v-show="level">{{ level }}</div>
      </div>
    </div>

    <div class="member-income" @click="enterPromotionCenter">
      累计收益 ￥{{ totalAward }}
      <i
        class="member-income_view-icon iconfont icon-member_right"
        v-show="openPromotionCenterEntry"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "MmeberStockHeader",
  props: {
    level: String,
    totalAward: Number,
    user: {
      type: Object,
      default: null
    }
  },
  mounted() {
    const routeName = this.$route.name;
    if (routeName == "StockPromotionCenter") {
      this.openPromotionCenterEntry = false;
    }
  },
  data() {
    return {
      openPromotionCenterEntry: true
    };
  },
  methods: {
    enterPromotionCenter() {
      if (this.openPromotionCenterEntry === false) {
        return;
      }
      this.$router.push(this.fun.getUrl("StockPromotionCenter"));
    }
  },
  watch: {
    "$route.name"(newVal) {
      if (newVal == "StockPromotionCenter") {
        this.openPromotionCenterEntry = false;
      } else {
        this.openPromotionCenterEntry = true;
      }
    }
  }
};
</script>

<style scoped>
.header {
  height: 7.4rem;
  overflow: hidden;
  color: white;
  background: #ee2e2b;
}

.member-info {
  display: flex;
  align-content: center;
  padding: 1.6875rem 1.5625rem 0.9375rem;
}

.member-avatar {
  flex-shrink: 0;
  width: 3.0313rem;
  height: 3.0313rem;
  border-radius: 50%;
}

.member-details {
  flex-grow: 1;
  margin-left: 0.625rem;
  text-align: left;
}

.member-nickname {
  width: 16.625rem;
  overflow: hidden;
  font-size: 0.9688rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.member-level {
  display: inline-block;
  padding: 0.2rem 0.4375rem;
  margin-top: 0.3688rem;
  font-size: 0.6875rem;
  border-radius: 0.69rem;
  background: rgba(255, 255, 255, 0.29);
}

.member-income {
  display: flex;
  justify-content: space-between;
  align-content: center;
  height: 1.7188rem;
  line-height: 1.7188rem;
  padding: 0 0.9375rem 0 1.5625rem;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
}

.member-income_view-icon {
  font-size: 10px;
}
</style>