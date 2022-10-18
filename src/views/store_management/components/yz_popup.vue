<template>
  <div>
    <van-popup
      :value="isShow" position="bottom"
      :round="isRound && !isFill"
      :class="['yz-popup', isFill ? 'fillView': '']"
      @close="closePopup"
      @click-overlay="closePopup"
    >
      <div class="top">
        <span class="cancel" @click="closePopup">{{isShowLeft ? '取消' : ''}}</span>
        <span class="title">{{title}}</span>
        <span class="confirm" @click="confirm">{{isShowRight ? '确认' : ''}}</span>
      </div>
      <slot></slot>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    isFill: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Boolean,
      default: false
    },
    isRound: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
    },
    isShowRight: {
      type: Boolean,
      default: true
    },
    isShowLeft: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    };
  },
  methods: {
    closePopup () {
      this.$emit("closePopup", false);
    },
    confirm () {
      this.$emit("clickConfirmBtn", false);
    },
  },

  components: {},
};

</script>
<style lang='scss' rel='stylesheet/scss' scoped>
.yz-popup {
  width: 100%;
  padding: 1.25rem 1rem;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .cancel {
      color: #838383;
    }
    .title {
      font-size: 0.94rem;
      color: #2b2a2a;
    }
    .confirm {
      color: #f15353;
    }
  }
}
.fillView {
  width: 100%;
  height: 100vh;
}
</style>