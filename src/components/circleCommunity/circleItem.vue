<template>
  <div class="circle-item" v-if="data">
    <van-image class="ciecle-icon" :src="data.circle_img" width="2.19rem" height="2.19rem" round />
    <div class="circle-info">
      <div class="circle-name">{{ data.name||data.circle_name }}</div>
      <div v-if="$slots.info" class="circle-info-bottom">
        <slot name="info"></slot>
      </div>
      <div class="circle-statistics" v-else>
        <div class="circle-sta-item">
          <i class="circle-sta-icon iconfont icon-fontclass-tiezi"></i>
          帖子：{{ data.invitation }}
        </div>
        <div class="circle-sta-item">
          <i class="circle-sta-icon iconfont icon-fontclass-renshu1"></i>
          成员：{{ data.member }}
        </div>
      </div>
    </div>
    <div class="circle" v-if="$slots.default">
      <slot></slot>
    </div>
    <div class="circle-right" v-else>
      <div >
        <circle-button :disabled="data.is_exist==1"  @click="statusClick">{{ data.is_exist?'已加入':' 加入 ' }}</circle-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Image } from "vant";
import CircleButton from "@/components/circleCommunity/circleButton";
export default {
  props: {
    data: {
      type: Object,
      require: true,
      default: null
    }
  },
  components: {
    CircleButton,
    VanImage: Image
  },
  methods: {
    statusClick() {
      this.$emit("button-click");
    }
  }
};
</script>

<style scoped>
.circle-item {
  display: grid;
  align-items: center;
  grid-template-columns: 2.19rem 15rem auto;
  padding: 0.9375rem 0;
  width: 100%;
}

.circle-info {
  margin-left: 0.63rem;
}

.circle-info-bottom {
  text-align: left;
}

.circle-name {
  width: 100%;
  line-height: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  text-align: left;
}

.circle-statistics {
  display: flex;
  font-size: 0.69rem;
}

.circle-sta-item {
  margin-right: 1.34rem;
}

.circle-sta-icon {
  font-size: 0.8rem;
  color: #ffa200;
}

.circle-right {
  justify-self: flex;
}
</style>