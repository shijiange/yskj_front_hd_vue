<template>
  <div class="upgrade-result">
    <div v-if="upgradeResult==='success'">
      <span class="upgrade-result-icon iconfont icon-pm_auction_success"></span>
      升级成功
    </div>
    <div v-else-if="upgradeResult==='fail'">升级失败</div>
    <div v-else>升级中</div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  activated() {
    if (!this.$route.query.key) {
      Toast.fail("升级码不存在");
      this.$router.replace(this.fun.getUrl("member"));
      return;
    }
    this.codeKey = this.$route.query.key;
    this.upgradeLevel();
  },
  data() {
    return {
      codeKey: null,
      upgradeResult: "upgradeing"
    };
  },
  methods: {
    upgradeLevel() {
      $http
        .post("plugin.upgrade-code.Frontend.controllers.code.handle", {
          key: this.codeKey
        })
        .then(({ data, msg, result }) => {
          if (result === 1) {
            this.upgradeResult = "success";
            setTimeout(() => {
              this.$router.replace(this.fun.getUrl("member"));
            }, 1200);
          } else {
            this.upgradeResult = "fail";
            Toast.success(msg);
          }
        });
    }
  }
};
</script>

<style scoped>
.upgrade-result {
  padding-top: 4.4375rem;
  width: 100%;
  height: 100vh;
  color: white;
  background: #6f75ff;
}

.upgrade-result-icon {
  display: block;
  margin-bottom: 0.3125rem;
  font-size: 2.5625rem;
}
</style>