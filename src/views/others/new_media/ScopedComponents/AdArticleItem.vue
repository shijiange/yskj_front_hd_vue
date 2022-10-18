<template>
  <div class="ad-article-item" @click="clickItem">
    <div class="ad-article_header">
      <img class="ad-article-cover" :src="data.cover_picture" />
      <div class="ad-article-category" v-if="showCategory">{{ data.genre }}</div>
      <div class="ad-article-clicks" v-if="showClicks">点击人数：{{ data.read_count }}</div>
    </div>
    <div class="ad-article_title ellipsis1">{{ data.title }}</div>
    <div class="ad-article_author ellipsis1">
      <img :src="data.avatar" alt class="ad-article_author-avatar" />
      {{ data.nickname }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    },
    showClicks: {
      type: Boolean,
      default: false
    },
    showCategory: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    clickItem() {
      this.$emit("click");
    }
  }
};
</script>

<style scoped>
.ad-article-item {
  padding-bottom: 0.66rem;
  width: 10.63rem;
  text-align: left;
  border-radius: 0.31rem;
  background-color: white;
  overflow: hidden;
}

.ad-article_header {
  position: relative;
}

.ad-article-cover {
  width: 100%;
  height: 14.16rem;
  object-fit: cover;
  vertical-align: bottom;
}

.ad-article-category {
  position: absolute;
  top: 0.47rem;
  left: 0.47rem;
  padding: 0.32rem 0.54rem;
  font-size: 0.69rem;
  color: white;
  border-radius: 1rem;
  background-color: rgba(0, 0, 0, 0.6);
  box-sizing: border-box;
}

.ad-article-clicks {
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 0.34rem 0.63rem;
  width: 100%;
  font-size: 0.7rem;
  text-align: left;
  color: white;
  background-color: rgba(0, 0, 0, 0.6);
}

.ad-article_title {
  margin: 0.69rem 0.53rem 0;
  line-height: 1.13rem;
  font-size: 0.88rem;
  color: #1e1e1e;
  word-break: break-all;
}

.ad-article_author {
  padding: 0 0.56rem;
  margin-top: 0.91rem;
  font-size: 0.69rem;
  color: #2a2a2a;
}

.ad-article_author-avatar {
  vertical-align: top;
  margin-right: 0.34rem;
  width: 1.25rem;
  height: 1.25rem;
  object-fit: cover;
  border-radius: 50%;
}
</style>