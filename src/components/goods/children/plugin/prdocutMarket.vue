<!-- 应用插件 有弹窗-->
<template>
  <div>
    <div class="member-box" @click="PopupShow = true">
      <span class="optiondiv">
        应用
        <em style="padding-left: 0.625rem; color: #333;">{{ prdocut_market.apps }}</em>
      </span>
      <span>
        <em class="application">插件</em>
      </span>
    </div>
    <div class="service-box" v-if="prdocut_market.is_show==1">赠送售后服务时长 <span style="color: red; margin-left: 0.4rem;">{{prdocut_market.service_time}}天</span>
      <span style="font-size: 12px;">（剩余售后服务时长730天封顶，大于则不再增加）</span> 
    </div>

    <van-popup v-model="PopupShow" closeable position="bottom" get-container="#appMain">
      <p class="popup-title">插件列表</p>
      <div class="popup-box" v-if="prdocut_market.plugin && prdocut_market.plugin.length > 0">
        <p class="popup-item van-hairline--bottom" v-for="(item, index) in prdocut_market.plugin" :key="index">{{ item }}</p>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    prdocut_market: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      PopupShow: false
    };
  },
  components: {},
  computed: {},
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
.member-box {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  margin-top: 0.625rem;
  height: 2.625rem;
  color: #333;
  padding: 0 0.75rem;

  span {
    font-size: 14px;
    color: #999;
    line-height: 2.625rem;
  }

  i {
    font-size: 20px;
    color: #999;
    line-height: 2.625rem;
  }

  .application {
    color: #dd2727;
    border: 1px solid #dd2727;
    border-radius: 10px;
    padding: 2px 10px;
  }
}

.service-box {
  padding: 0 0.75rem 0.5rem;
  text-align: left;
  color: #5a5a5a;
  font-size: 13px;
  background: #fff;
}

.popup-title {
  padding: 1rem;
  font-size: 18px;
  font-weight: bold;
}

.popup-box {
  height: 15rem;
  overflow-y: scroll;

  .popup-item {
    padding: 0.5rem;
  }
}
</style>
