<template>
  <div id="DList">
    <slot></slot>
    <div class="list-status-text" v-if="showStatusText">{{ localStatusText }}</div>
    <slot name="status"></slot>
  </div>
</template>

<script>
let pageHeight = 0; //* 页面完整高度
let scrollPositionY = 0; //* 滚动条位置
let availHeight = 0; //* 页面可见视图高度
let scrollTimer = null; //* 防抖setTimeout handle
let scrollToTop = false; //* 是否是向上滚动，否则就是向下滚动
export default {
  props: {
    loading: Boolean,
    finished: Boolean,
    statusText: {
      type: String,
      default: "下拉加载更多"
    },
    showStatusText: {
      type: Boolean,
      default: true
    },
    reachBottomDistance: {
      type: Number,
      default: 105
    },
    topDistance: {
      type: Number,
      default: 60
    },
    height: {
      type: Number,
      default: null
    },
    debounceTime: {
      type: Number,
      default: 500
    }
  },
  activated() {
    window.addEventListener("scroll", this.listenScroll);
    if (this.height !== null) {
      pageHeight = this.height;
    } else {
      pageHeight = Math.max(window.document.body.scrollHeight, window.document.documentElement.scrollHeight);
    }
  },
  deactivated() {
    window.removeEventListener("scroll", this.listenScroll);
  },
  data() {
    return {
      isLoading: false,
      isFinished: false,
      isLoadMore: true,
      localStatusText: "",
      pageHeight: null
    };
  },
  methods: {
    listenScroll() {
      //* 简单防抖
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        this.pageScroll();
        clearTimeout(scrollTimer);
      }, this.debounceTime);
    },
    pageScroll() {
      this.refreshPageHeight();
      this.refreshAvailHeight();
      this.refreshScrollPosition();
      if (availHeight + scrollPositionY >= pageHeight - this.reachBottomDistance) {
        // scrollPositionY == 0  防止跳转页面的时候触发
        if (scrollPositionY == 0 || this.isLoading == true || this.isFinished) {
          return;
        }
        this.$emit("load");
      }
      if (scrollToTop && scrollPositionY <= this.topDistance) {
        this.$emit("topping");
      }
    },
    refreshPageHeight() {
      if (this.height === null) {
        pageHeight = Math.max(window.document.body.scrollHeight, window.document.documentElement.scrollHeight);
      }
    },
    refreshAvailHeight() {
      availHeight = window.screen.availHeight;
    },
    refreshScrollPosition() {
      let scrollDistance = Math.max(window.scrollY, window.document.documentElement.scrollTop);
      if (scrollDistance > scrollPositionY) {
        scrollToTop = false;
      } else {
        scrollToTop = true;
      }
      scrollPositionY = scrollDistance;
    }
  },
  watch: {
    loading(newVal) {
      if (this.showStatusText === false) {
        return;
      }
      if (newVal === true) {
        this.localStatusText = "加载中";
        return;
      }
      this.localStatusText = '';
    },
    finished(newVal) {
      if (this.showStatusText === false) {
        return;
      }
      if (newVal === true) {
        this.localStatusText = "没有更多了";
        this.isFinished = false;
        this.isLoadMore = false;
      } else {
        this.isFinished = false;
        this.isLoadMore = true;
      }
    },
    statusText(newVal) {
      this.localStatusText = newVal;
    },
    height(newVal) {
      this.pageHeight = newVal;
    }
  }
};
</script>

<style scoped>
.list-status-text {
  padding: 0.625rem 0;
  text-align: center;
  color: #7f7f7f;
}
</style>