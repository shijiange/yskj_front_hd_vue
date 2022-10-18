<template>
  <!-- 没看到有引用这个组件了 -->
  <!-- <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore"> -->
  <ul>
    <li v-for="(item,i) in list" :key='i'><img :src="item"/></li>
  </ul>
  <!-- </mt-loadmore> -->
</template>
<script>

var urlt = "http://fuss10.elemecdn.com/b/18/0678e57cb1b226c04888e7f244c20jpeg.jpeg";
export default {
  data() {
    return {
      allLoaded: false,
      topStatus: "",
      list: [
        urlt, urlt, urlt, urlt, urlt, urlt, urlt, urlt, urlt, urlt, urlt, urlt, urlt, urlt
      ]
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
      this.allLoaded = true;// 若数据已全部获取完毕
      this.$refs.loadmore.onBottomLoaded();

    }

  }
  // ...
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  ul {
    overflow: hidden;
    height: 100%;
  }

  image[lazy=loading] {
    width: 2.5rem;
    height: 18.75rem;
    margin: auto;
  }

  li img {
    width: 80%;
  }
</style>
