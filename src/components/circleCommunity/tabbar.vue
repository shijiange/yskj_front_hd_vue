<template>
  <div>
    <nav class="tabbar nav-class set-pc-style">
      <!-- 底部导航栏 -->
      <router-link :to="fun.getUrl('circleIndex')">
        <div class="tabbar-icon iconfont icon-fontclass-shouye2"></div>首页
      </router-link>
      <router-link :to="fun.getUrl('circlePayRecords')">
        <div class="tabbar-icon iconfont icon-fontclass-fufeijilu"></div>付费记录
      </router-link>
      <router-link :to="fun.getUrl('circleIssue')">
        <div class="tabbar-icon iconfont icon-all_inforelease circle-add"></div>
      </router-link>
      <router-link :to="fun.getUrl('circleMySet')">
        <div class="tabbar-icon iconfont icon-fontclass-shezhi1"></div>我的圈子
      </router-link>
      <router-link :to="fun.getUrl('member')">
        <div class="tabbar-icon iconfont icon-fontclass-huiyuanzhongixn"></div>会员中心
      </router-link>
    </nav>
    <div class="tabbar-placeholder"></div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.tabbar {
  display: grid;
  grid-template-columns: repeat(5, 20%);
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 999;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3.4375rem;
  background: white;
  box-shadow: 0 -0.125rem 0.25rem 0 rgba(146, 146, 146, 0.1);
}

.tabbar a {
  display: block;
}

.tabbar a.active {
  color: #3175fe;
}

.tabbar-placeholder {
  height: 3.4375rem;
  background: transparent;
}

.tabbar-icon {
  font-size: 1.5rem;
}

.tabbar .circle-add {
  font-size: 2rem;
  color: #3175fe;
}
</style>