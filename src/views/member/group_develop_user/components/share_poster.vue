<!-- 分享海报 -->
<template>
  <van-popup class="sharePopup" v-model="sharePopup" @closed="closed" closeable close-icon-position="bottom-right" style="background-color:transparent;">
    <div class="sharePopup-box">
      <img class="posterImg" :src="img" alt="" />
      <div class="text">长按保存图片</div>
      <div class="text">用户打开链接或图片，生成自己分享的海报，邀请好友。</div>
      <div class="poster-url">
        <input type="text" :value="url" />
        <van-button type="info" size="mini" @click.stop v-clipboard:copy="url" v-clipboard:success="onCopy" color="#f15353">复制</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  model: {
    prop: "sharePopup",
    event: "onEmit"
  },
  props: {
    img: {
      type: String,
      default: ""
    },
    pid: {
      type: String,
      default: ""
    },
    sharePopup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      url: ""
    };
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},
  watch: {
    sharePopup: function(newV, oldV) {
      this.url = this.fun.getSiteRoot() + "/addons/yun_shop/?menu#/member/gduEnterprisePoster/" + this.pid + "?i=" + this.fun.getKeyByI() + "&mid=" + this.fun.getKeyByMid();
    }
  },

  methods: {
    onCopy() {
      this.$toast("复制成功");
    },
    closed() {
      this.$emit("onEmit", false);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.sharePopup-box {
  width: 16.875rem;
  background-color: #ffffff;
  border-radius: 0.313rem;
  padding: 1rem 0.625rem;
  margin-bottom: 40px;
  .posterImg {
    margin-bottom: 0.625rem;
    width: 15.625rem;
    background-color: #e8e8e8;
    border-radius: 0.313rem;
  }
  .text {
    text-align: left;
    font-size: 0.688rem;
    color: #202020;
    margin-bottom: 0.625rem;
  }
  .poster-url {
    display: flex;
  }
  input {
    flex: 1;
    height: 24px;
    padding: 0 0.5rem;
    font-size: 0.625rem;
    background-color: #f8f7f7;
    border: none;
    margin-right: 0.625rem;
  }
}
.sharePopup {
  /deep/.van-popup__close-icon {
    right: 125px;
    bottom: 0px;
    padding: 4px;
    font-size: 14px;
    color: #fff;
    border: 2px solid #fff;
    font-weight: 600;
    border-radius: 50%;
  }
}
</style>
