<template>
  <div class="content-author-bar">
    <div
      class="content-author-left"
      :style="{ width: $slots.right ? 'calc(100% - calc(5.125rem + 0.625rem))' : '100%' }"
    >
      <van-image
        class="content_author-avatar"
        :src="avatar"
        width="1.42rem"
        height="1.42rem"
        round
        fit="cover"
      ></van-image>
      <div class="content_author-nickname ellipsis1">{{ nickname }}</div>
      <div
        class="content_author-follow"
        :class="{ 'content_author-unfollow': attention }"
        v-if="!self"
        @click="followAuthor"
      >{{ attention ? '已' + attentionName : attentionName }}</div>
    </div>
    <slot name="right" />
  </div>
</template>

<script>
import { Image as VanImage } from "vant";
export default {
  props: {
    avatar: {
      type: String,
      default: ""
    },
    nickname: {
      type: String,
      default: ""
    },
    self: {
      type: Boolean,
      default: false
    },
    attention: {
      type: Boolean,
      default: false
    },
    attentionName: {
      type: String,
      default: "关注"
    }
  },
  methods: {
    followAuthor() {
      this.$emit("follow");
    }
  },
  components: {
    VanImage
  }
};
</script>

<style scoped>
.content-author-bar {
  display: flex;
  justify-content: space-between;
  text-align: left;
}

.content-author-left {
  display: flex;
  align-items: center;
}

.content_author-avatar {
  flex-shrink: 0;
}

.content-author {
  /* margin: 0 var(--newMediaMarginDistance); */
}

.content_author-nickname {
  margin-left: 0.5rem;
  font-size: 0.75rem;
}

.content_author-follow {
  flex-shrink: 0;
  padding: 0.4rem 0.6rem;
  margin-left: 1.04rem;
  line-height: 0.7rem;
  color: white;
  font-size: 0.75rem;
  cursor: pointer;
  user-select: none;
  border-radius: 0.78rem;
  background-color: var(--newMediaPrimaryColor);
  transition: all 0.2s ease-in-out;
}

.content_author-unfollow {
  color: var(--newMediaPrimaryColor);
  background-color: white;
  border: 1px solid var(--newMediaPrimaryColor);
}

.content_author-follow:active {
  filter: brightness(90%);
}
</style>