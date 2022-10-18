<template>
  <div>
    <div class="fixed-box" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <router-link class="fixed-item" :to="fun.getUrl(home)">
        <i class="iconfont icon-zhuye2" style="font-size: 28px;"></i>
        <span>首页</span>
      </router-link>
      <router-link v-if="shoSign" class="fixed-item" :to="fun.getUrl(signIndex)">
        <i class="iconfont icon-yq_hetongzhongxin" style="padding: 4px;"></i>
        <span>合同</span>
      </router-link>
    </div>
    <div style="height: 50px;"></div>
  </div>
</template>

<script>
export default {
  props: {
    home: {
      type: String,
      default: 'home'
    },
    shoSign: {
      type: Boolean,
      default: true
    },
    signIndex: {
      type: String,
      default: 'signIndex'
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .fixed-box {
    position: fixed;
    bottom: 0.5rem;
    left: 5%;
    color: #fff;
    background: #518bff;
    border-radius: 20px;
    display: flex;
    box-shadow: 0 0.25rem 0.5625rem 0.0625rem rgba(0, 0, 0, 0.06);

    &.pcStyle {
      left: 50%;
      transform: translateX(-100%);
    }

    .fixed-item {
      padding: 3px 13px;
      display: flex;
      justify-content: center;
      align-items: center;

      &:first-child {
        border-right: 1px solid #fff;
      }

      i {
        font-size: 21px;
      }
    }
  }
</style>