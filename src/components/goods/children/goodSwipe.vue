<!-- 商品详情页 商品图片轮播组件 -->
<template>
  <viewer :images="thumb_url" class="section" style="position: relative;" :options="options" @inited="inited">
    <c-myswipe :style="{ height: fun.getPhoneEnv() == 3 ? '375px' : '100vw' }" :slides="thumb_url" :repeating="true" :auto="0">
      <div v-if="!fun.isTextEmpty(goods_video)">
        <video
          id="goods_vedio"
          style="width: 100%; height: 100%; object-fit: scale-down;"
          :poster="video_image"
          :src="goods_video"
          controls
          webkit-playsinline="true"
          playsinline="true"
          x5-playsinline="true"
          x-webkit-airplay="true"
          x5-video-ignore-metadata="true"
          width="100%"
          height="100%"
        >
          <source :src="goods_video" />
        </video>
      </div>
      <!-- 供应商其他图片为空的时候返回的是空数组 -->
      <div v-if="!thumb_url || thumb_url == null || thumb_url.length == 0">
        <img :src="thumb" width="100%" />
      </div>
      <div v-for="(ithumb, index) in thumb_url" style="position: relative;" :key="index">
        <template v-if="ithumb">
          <img :src="ithumb" width="100%" />
          <div class="number-box">{{index + 1}} / {{thumb_url.length}}</div>
        </template>
      </div>
    </c-myswipe>
  </viewer>
</template>

<script>
import cMyswipe from "components/myswipe";
export default {
  props: {
    thumb_url: {
      type: [Array, String],
      default: () => []
    },
    thumb: {
      type: String,
      default: null
    },
    child_showBigImg: {
      type: Boolean,
      default: false
    },
    goods_video: {
      type: String,
      default: ""
    },
    video_image: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      options: {
        shown: ()=>{
          this.setShowBigImg(true);
        },
        hidden: ()=> {
          this.setShowBigImg(false);
        }
      }
    };
  },
  watch: {
    child_showBigImg:{//深度监听，可监听到对象、数组的变化
      handler(newValue){
        if(!newValue) {
          this.$viewer.hide();
        }
      },
      deep:true //true 深度监听
    }
  },
  components: { cMyswipe },
  methods: {
    inited (viewer) {
      this.$viewer = viewer;
    },
    setShowBigImg(data) {
      this.$emit('setShowBigImg',data);
    }
  }
};
</script>
<style lang="scss" scoped>
  .number-box {
    position: absolute;
    right: 15px;
    bottom: 10px;
    font-size: 12px;
    padding: 4px 15px;
    color: #fff;
    border-radius: 12px;
    background-color: rgba(0, 0, 0, 0.4);
  }
</style>
