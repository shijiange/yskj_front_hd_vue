<template>
  <div class="finance-management">
    <c-title :hide="false" text="财务管理"></c-title>
    <div class="management-list">
      <router-link class="item" :to="fun.getUrl('storeBalanceList')" >
        <div class="icon tichengmingxi">
          <i class="iconfont icon-fontclass-tichengmingxi"></i>
        </div>
        <p class="text">{{balanceName}}明细</p>
      </router-link>

      <router-link class="item" :to="fun.getUrl('storeIntegralList')">
        <div class="icon yue">
          <i class="iconfont icon-fontclass-yue"></i>
        </div>
        <p class="text">{{integralName}}明细</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      integralName: this.fun.getIntegralLang(),
      balanceName: this.fun.getBalanceLang(),
    };
  },

  methods: {},

  components: {}
};
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.finance-management {
  .management-list {
    display: flex;
    flex-wrap: wrap;
  }
  .item {
    width: 8.75rem;
    margin: 2rem 0 0 1.8rem;
    background-color: #ffffff;
    border-radius: 0.47rem;
    font-size: 0.88rem;
    font-weight: 500;
    padding: 1.5rem 0;
  }
  .icon {
    display: inline-block;
    border-radius: 0.94rem;
    padding: 0.81rem;
  }
  .iconfont {
    font-size: 2rem;
    color: #ffffff;
  }
  .tichengmingxi {
    background-image: linear-gradient(90deg, #ffc352 0%, #ff8329 100%);
  }
  .yue {
    background-image: linear-gradient(90deg, #539ef9 0%, #2952f8 100%);
  }
  .text {
    margin-top: 1.3rem;
    font-size: 0.88rem;
    color: #232424;
  }
}
</style>