<template>
  <div v-if="data">
    <div class="comment-item">
      <van-image :src="data.avatar" width="32px" height="32px" round></van-image>
      <div class="comment-info">
        <div class="comment-member-nickname">{{ data.nickname }}</div>
        <div class="comment-created-at">{{ data.created_at }}</div>
        <div class="comment-content">
          <span class="comment-reply-member" v-if="data.subordinate_id">
            回复<em>{{ data.subordinate_name }}</em>
          </span>
          {{ data.comment }}
        </div>
      </div>
      <div>
        <slot name="right"></slot>
      </div>
    </div>
    <div class="comment-footer">
      <slot />
    </div>
  </div>
</template>

<script>
import { Image as VanImage } from "vant";
export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  components:{
    VanImage
  }
};
</script>

<style scoped>
.comment-title {
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
}

.comment-list {
  padding: 0 0.9375rem 0.9375rem;
  min-height: 60vh;
  text-align: left;
}

.comment-item {
  display: grid;
  grid-template-columns: 2rem auto 2.6875rem;
  padding: 0.3125rem 0;
  border-bottom: 0.0625rem solid #eee;
}

.comment-info {
  margin-left: 0.75rem;
}

.comment-member-nickname {
  font-size: 0.875rem;
  line-height: 1.125rem;
  color: #1c96fe;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.comment-created-at {
  overflow: hidden;
  line-height: 1.125rem;
  color: #999;
  font-size: 0.75rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.comment-reply-member {
  padding-right: 0.375rem;
}

.comment-reply-member em {
  color: #1c96fe;
}

.comment-content {
  word-break: break-all;
  font-size: 0.875rem;
  line-height: 1.125rem;
  color: #333;
}

.comment-like {
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: #333;
  text-align: center;
}
</style>