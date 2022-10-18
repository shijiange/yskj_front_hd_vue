<template>
  <div>
    <van-popup v-model="popShow" position="bottom" :style="{ height: '100%' }">
      <div class="popup-return-type">
        <van-nav-bar title="选择售后类型" />
        <div class="return-type-list">
          <div class="return-type-item" v-for="(item, key) in refundTypes" :key="key" @click="sendBtn(item)">
            <div class="icon">
              <i class="iconfont lefticon" :class="item.icon"></i>
            </div>
            <div class="return-content">
              <div class="return-title">{{ item.name }}</div>
              <div class="return-desc">{{ item.desc }}</div>
            </div>
            <div class="next">
              <i class="iconfont icon-advertise-next"></i>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  props: {
    refundTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      returnTypeIcons: ["icon-fontclass-daizhifu", "icon-fontclass-daishouhuo", "icon-fontclass-daifahuo"],
      popShow: false
    };
  },
  methods: {
    setPopShow(flag) {
      this.popShow = flag;
    },
    sendBtn(item) {
      this.$emit("confirm", { item });
      this.setPopShow(false);
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.popup-return-type {
  height: 100%;
  .return-type-list {
    padding: 0.5rem 1rem;
    .return-type-item {
      display: flex;
      align-items: center;
      height: 4rem;
      .lefticon {
        font-size: 24px;
      }
      .return-content {
        flex: 1;
        padding-left: 1rem;
        .return-title {
          font-size: 13px;
          color: #222;
        }
        .return-desc {
          margin-top: 0.2rem;
          font-size: 12px;
          color: #666;
        }
      }
      .icon-advertise-next {
        font-size: 24px;
      }
    }
  }
}
</style>
