<template>
  <div class="post-item" v-if="data">
    <slot name="header" />
    <div class="post-header" @click.stop="visitMember(data.member_id)">
      <van-image width="40px" height="40px" round :src="data.avatar"></van-image>
      <div class="post-author">
        <div>{{ data.nickname }}</div>
        <div class="post-created-time">{{ data.created_at }}</div>
      </div>
      <div class="post-operator">
        <slot name="operator" />
      </div>
    </div>
    <div class="post-body">
      <slot name="body" />
      <div class="post-title">{{ data.title }}</div>
      <div class="post-content" v-if="data.status==1">{{ data.content }}</div>
      <slot name="content" />
      <div class="post-images" :class="[ postImagesClassName ]" v-if="data.status==1&&data.img">
        <van-image
          class="post-image-item"
          :src="img"
          radius="0.5rem"
          lazy-load
          v-for="(img,itemIndex) in images"
          :key="itemIndex"
          fit="cover"
        ></van-image>
        <div class="post-view-more" v-if="showViewMore">查看更多</div>
      </div>
      <div class="post-images" v-else-if="data.status==2&&data.img">
        <van-image class="post-image-item" :src="data.img" radius="0.5rem" lazy-load></van-image>
      </div>

      <slot name="body-bottom" />
    </div>
    <div class="post-footer">
      <slot name="footer" />
      <div class="post-circle" @click.stop="toCircle" v-if="showCircle&&circle&&data.circle_id">
        <van-image class="post-circle-icon" round :src="data.circle_img"></van-image>
        <span class="post-circle-name">{{ data.circle_name }}</span>
      </div>
      <ul class="post-statistics">
        <li class="post-statistics-item">
          <i class="post-statistics-icon iconfont icon-fontclass-yulan"></i>
          {{ data.browse_count }}
        </li>
        <li class="post-statistics-item" :class="{ 'post-statistics-item-active':data.is_like }">
          <i class="post-statistics-icon iconfont icon-fontclass-dianzan"></i>
          {{ data.link_count }}
        </li>
        <li class="post-statistics-item">
          <i class="post-statistics-icon iconfont icon-fontclass-pinglun1"></i>
        </li>
      </ul>
      <slot name="bottom" />
    </div>
  </div>
</template>

<script>
import { Image } from "vant";
export default {
  props: {
    data: {
      type: Object,
      default: null
    },
    circle: {
      type: Boolean,
      default: true
    },
    showCircle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      postImagesClassName: "post-images-multi",
      images: [],
      showViewMore: false
    };
  },
  mounted() {
    if (this.data.img) {
      if (this.data.img.length > 9) {
        this.images = this.data.img.slice(0, 9);
        this.showViewMore = true;
      } else if(this.data.img.length==1) {
        this.images = this.data.img;
        this.postImagesClassName="";
      }else{
        this.images = this.data.img;
      }
    }
  },
  methods: {
    toCircle() {
      this.$router.push(this.fun.getUrl("circleDetails", {}, { id: this.data.circle_id }));
    },
    visitMember(memberId) {
      this.$router.push(
        this.fun.getUrl(
          "circleMyRelease",
          {},
          {
            member_id: memberId
          }
        )
      );
    }
  },
  components: {
    VanImage: Image
  }
};
</script>

<style scoped>
.post-item {
  padding: 0.9375rem;
  text-align: left;
  background-color: white;
  border-radius: 0.5rem;
}

.post-header {
  display: grid;
  align-items: center;
  grid-template-columns: 2.5rem 10rem auto;
  width: 100%;
}

.post-author {
  margin-left: 0.5rem;
  font-size: 0.9375rem;
  color: #333;
}

.post-created-time {
  font-size: 0.75rem;
  color: #999;
}

.post-operator {
  justify-self: end;
}

.post-body {
  margin-top: 1.125rem;
}

.post-title {
  font-size: 1rem;
  color: #202020;
  word-break: break-all;
}

.post-content {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 0.875rem;
  line-height: 1.125rem;
  color: #868585;
  word-break: break-all;
}

.post-images {
  margin-top: 0.6875rem;
}

.post-images-multi {
  display: grid;
  grid-template-columns: repeat(3, 6.175rem);
  column-gap: 0.625rem;
  row-gap: 0.625rem;
  position: relative;
  padding: 0;
}

.post-image-item {
  width: 100%;
  max-width: 60%;
  max-height: 15.625rem;
  border-radius: 0.5rem;
}

.post-images-multi .post-image-item {
  height: 6.175rem;
  max-height: unset;
  max-width: unset;
}

.post-view-more {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 6.175rem;
  line-height: 6.175rem;
  width: 6.1125rem;
  text-align: center;
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  cursor: pointer;
}

.post-footer {
  margin-top: 0.5rem;
}

.post-circle {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.9375rem 0.25rem 0.25rem;
  color: #6d99f3;
  background-color: #f1f6ff;
  border-radius: 0.5rem;
}

.post-circle-icon {
  width: 0.9375rem;
  height: 0.9375rem;
}

.post-circle-name {
  margin-left: 0.25rem;
  max-width: 6.9375rem;
  overflow: hidden;
  font-size: 0.625rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-statistics {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.4375rem;
  font-size: 0.625rem;
  color: #7c7c7c;
}

.post-statistics-item {
  margin-left: 0.8125rem;
}

.post-statistics-item-active {
  color: #3175fe;
}
</style>