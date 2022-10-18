<template>
  <div>
    <van-nav-bar fixed :title="text" v-if="!hide" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']" z-index="99" :border="false">
      <van-button type="default" icon="arrow-left" @click="goto" slot="left" v-if="!goback"></van-button>
      <slot name="left" slot="left"></slot>
      <template v-if="tolink">
        <router-link v-if="!showToast" :to="fun.getUrl(tolink, setParams, setQuery)" slot="right" style="font-size: 14px">{{ totext }}</router-link>
        <div v-if="showToast" slot="right" @click="tapShow">{{ totext }}</div>
      </template>
      <slot name="edit" slot="right"></slot>
    </van-nav-bar>
    <div style="height: 40px"></div>
    <transition name="plus-icon">
      <div class="posbox" v-if="show">
        <div class="toastBox">
          <span class="txt" v-for="(item,ind) in toastTxt" :key="ind" @click="gourl(item.url)">{{item.name}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import { mapState, mapMutations } from 'vuex';

export default {
  props: ["text", "hide", "goback", "url", "totext", "tolink", "setParams", "setQuery", "popClose", "showToast",'toastTxt'],
  data() {
    return {
      show: false
    };
  },
  activated() {},
  mounted: function () {
    //this.tempInfo();
  },
  methods: {
    gourl(url){
      if(url == 'presentationRecord'){
        this.$router.push(this.fun.getUrl(url, {}, {extension:'extension'}));
      }else{
        this.$emit('postUrlTap',url);
        this.show = false;
      }
    },
    tapShow() {
      this.show = !this.show;
    },
    goto() {
      if (this.fun.isCPS()) {
        if (this.fun.isIosOrAndroid() === "ios") {
          routeBackUrlIOS({ body: "routeBackUrlIOS" });
        } else {
          routeBackUrlAndroid();
        }
        return;
      }
      if (window.history.length <= 1) {
        this.$router.push(this.fun.getUrl("home", {}));
      } else if (this.popClose) {
        this.$emit("onGoBack");
      } else if (this.url) {
        this.$router.push(this.fun.getUrl(this.url));
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.are{
  position: relative;
}
.plus-icon-enter-active {
  transition: opacity 0.2s;
}
.plus-icon-enter {
  opacity: 0;
}
.plus-icon-leave-active {
  transition: opacity 0.2s;
}
.plus-icon-leave-to {
  opacity: 0;
}

.posbox {
  position: absolute;
  right: 0.31rem;
  top: 40px;
  z-index: 99999;
  transition: 1s;
}
.toastBox {
  background: #fff;
  box-shadow: 0rem 0.06rem 0.31rem 0rem rgba(158, 158, 158, 0.4);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem;
  .txt {
    margin: 0.38rem 0;
    color: #3d3d3d;
  }
}
.toastBox:after {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  left: 43%;
  top: -10px;
  border-right: solid 12px transparent;
  border-left: solid 12px transparent; /* 黑色大三角形 */
  border-bottom: solid 12px #fff;
  z-index: 99999;
}
.toastBox:before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  left: 45%;
  top: -10px;
  border-right: solid 10px transparent;
  border-left: solid 10px transparent; /* 黑色大三角形 */
  border-bottom: solid 10px rgba(158, 158, 158, 1);
  z-index: 99999;
}
.mint-header {
  background: none;
  color: #666;
}

.is-fixed .mint-header-title {
  font-weight: bold;
}

.mint-header.is-fixed {
  // border-bottom: 0.0625rem solid #e8e8e8;
  background: #fff;
  z-index: 99;
}

.mint-header.is-fixed::after {
  height: 1px;
  position: absolute;
  z-index: 0;
  bottom: 0;
  left: 0;
  content: "";
  width: 100%;
  background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
}

.is-right a {
  font-size: 10px;
}

.pcStyle {
  width: 375px;
  margin: 0 auto;
  left: 50%;
  margin-left: -187.5px;
}

/deep/.van-nav-bar {
  border-bottom: 1px solid #ececec;
}

.van-nav-bar,
/deep/.van-nav-bar__content {
  height: 40px;
}

.van-hairline--bottom::after {
  border-bottom-width: 0;
}

.van-button {
  display: inline-block;
  border: none;
  padding: 0;
  font-size: 16px;
  height: 38px;
}

/deep/.van-button::before {
  background-color: #fff !important;
}

.van-nav-bar .van-icon {
  color: #656b79;
  font-size: 16px;
}

/deep/.van-nav-bar__left,
/deep/.van-nav-bar__right {
  padding: 0;
  height: 40px;
  color: #666;
  font-size: 14px;
}

/deep/.van-nav-bar__left {
  padding-left: 10px;
}

/deep/.van-nav-bar__right {
  padding-right: 10px;
}

/deep/.van-nav-bar__title {
  color: #666;
  font-weight: bold;
  font-size: 14px;
}
</style>

