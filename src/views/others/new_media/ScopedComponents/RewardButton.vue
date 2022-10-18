<template>
  <d-fixed
    :fixed="fixed && absolute === false"
    :top="top"
    :bottom="bottom"
    :right="right"
    :left="left"
    :z-index="zIndex"
    :style="{ position: absolute ? 'absolute' : fixed ? 'fixed' : 'unset', right: absolute ? right : 'unset', bottom: absolute ? bottom : 'unset' }"
  >
    <div
      class="content_author-reward"
      :class="{ 'content_author-reward_fixed': fixed || absolute }"
      @click="clickButton"
    >
      <i class="iconfont icon-fontclass-dashang"></i>
      <span>{{ rewardName }}</span>
    </div>
  </d-fixed>
</template>

<script>
import DFixed from "../../../../components/other/common/DFixed";
export default {
  props: {
    fixed: {
      type: Boolean,
      default: false
    },
    absolute: {
      type: Boolean,
      default: false
    },
    top: String,
    left: String,
    bottom: String,
    right: String,
    zIndex: {
      type: Number,
      default: 1
    },
    rewardName: {
      type: String,
      default: "打赏"
    }
  },
  methods: {
    clickButton() {
      this.$emit("click");
    }
  },
  components: {
    DFixed
  }
};
</script>

<style scoped>
.content_author-reward {
  padding: 0.3rem 0.6rem;
  margin-left: 0.625rem;
  width: 5.125rem;
  color: #fc8216;
  font-size: 0.75rem;
  text-align: center;
  cursor: pointer;
  user-select: none;
  border-radius: 1rem;
  border: 1px solid #fc8216;
  background-color: white;
}

.content_author-reward i.iconfont {
  font-size: 0.84rem;
}

.content_author-reward:active {
  filter: brightness(90%);
}

.content_author-reward span {
  padding-left: 0.3rem;
}

.content_author-reward_fixed {
  width: 2.82rem;
  height: 2.82rem;
  color: white;
  font-size: 0.7rem;
  background-color: #fc8216;
  border-radius: 50%;
  box-shadow: 0 0.22rem 0.75rem 0 rgba(160, 79, 8, 0.46);
}

.content_author-reward_fixed span {
  display: block;
  padding-left: 0;
  width: 1.5rem;
}
</style>