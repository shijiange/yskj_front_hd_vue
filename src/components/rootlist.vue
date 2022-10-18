<template>
  <!-- 没看到有引用这个组件了 -->
  <!-- <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore" bottomPullText=' ' bottomDropText=' ' bottomLoadingText=" " topPullText=" " topDropText=" " topLoadingText=" "> -->
  <ul id='rootList'>
    <li v-for="(item,index) in lista" :key='index' :class="{active:active==index}" @click=tab(index,item.url)>
      {{item.cart}}
    </li>
  </ul>
  <!-- </mt-loadmore>	 -->
</template>

<script>

export default {
  props: ["lista", "caturl"],
  data() {
    return {
      active: 0,
      allLoaded: false,
      topStatus: ""
      // ...
    };
  },
  methods: {
    handleTopChange(status) {
      this.topStatus = status;
    },
    //更新
    loadTop() {
      this.$refs.loadmore.onTopLoaded();
    },
    // 加载更多
    loadBottom() {
      //this.allLoaded = false;// 若数据已全部获取完毕
      this.$refs.loadmore.onBottomLoaded();

    },
    tab(n, e) {
      this.active = n;

      //this.caturl=99999999999;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #rootList {
    width: 100%;
    padding-bottom: 3.125rem;
    background: #fff;

    .active {
      color: red;
    }

    li {
      line-height: 2.875rem;
      border-bottom: solid 0.0625rem #e5e5e5;
    }
  }
</style>