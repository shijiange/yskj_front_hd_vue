<!-- 空白显示组件 可自定义图片、文字、按钮-->
<template>
  <div id="yz_blank" v-show="this.fun.isTextEmpty(datas)">
    <div v-show="!this.$store.state.isloadding && this.fun.isTextEmpty(datas)">
      <img v-if="!image" src="../../assets/images/empty-image-search.png" class="noData_imgs" alt="" style="width:34%;" />
      <img v-if="image" :src="image" class="noData_imgs" alt="" />
      <p class="noData_text">{{ text }}</p>
      <span class="noData_btn" v-if="isBtn" @click.stop="gotoUrl(tolink, Params, Query)">{{ btnText }}</span>
      <!-- <router-link :to="fun.getUrl(tolink, Params, Query)" tag="span" class="noData_btn" v-if="isBtn">{{ btnText }}</router-link> -->
    </div>
    <p v-show="this.$store.state.isloadding" class="noData_text">正在加载中.....</p>
  </div>
</template>

<script>
export default {
  props: {
    //数据，为空才显示
    datas: {
      type: [String, Object, Array]
    },
    //图片地址 require("../../assets/images/empty-image-search.png")
    image: {
      type: String,
      default: null
    },
    //提示文字
    text: {
      type: String,
      default: "暂无信息"
    },
    //按钮是否显示，默认不显示
    isBtn: {
      type: Boolean,
      default: false
    },
    //按钮显示文字
    btnText: {
      type: String,
      default: "返回"
    },
    //按钮跳转链接
    tolink: {
      type: String,
      default: ""
    },
    //Params参数
    Params: {
      type: Object,
      default: () => ({})
    },
    //Query参数
    Query: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },

  components: {},
  computed: {},
  methods: {
    routerAdress() {},
    gotoUrl(name, params = {}, query = {}) {
      if (name != "") {
        this.$router.push(this.fun.getUrl(name, params, query));
      } else {
        if (window.history.length <= 1) {
          this.$router.push(this.fun.getUrl("home", {}));
        } else {
          this.$router.go(-1);
        }
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#yz_blank {
  margin: 2rem auto;
  text-align: center;

  .noData_imgs {
    width: 80%;
  }

  .noData_text {
    color: #999;
    margin: 1.5rem 0;
  }

  .noData_btn {
    display: block;
    width: 12rem;
    height: 2.5rem;
    line-height: 2.5rem;
    border-radius: 2rem;
    font-size: 1rem;
    background-image: -webkit-linear-gradient(bottom, #ff8a66, #ff6260, #ff6260);
    color: #fff;
    text-align: center;
    margin: 0 auto;
  }
}
</style>
