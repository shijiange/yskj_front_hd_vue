<template>
  <div id="screen">
    <van-search v-model="value" placeholder="搜索13141" background="#d9d9d9" @focus="onFocus() " :show-action="cancelTag" @cancel="onCancel()"></van-search>
    <div style="height: 52px;"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      cancelTag:false,
    };
  },
  methods: {
    onFocus() {
      this.cancelTag = true;
    },
    onCancel() {
      this.cancelTag = false;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" >
#screen {
  .mint-searchbar {
    position: fixed;
    width: 100%;
  }

  .mint-searchbar-inner {
    height: 1.25rem;
  }

  .mint-searchbar-placeholder .mintui-search {
    padding-top: 0.1875rem;
  }

  .van-search .van-cell {
    padding: 0;
  }

  .van-search__content {
    background: #fff;
  }

  .van-icon-search {
    color: #d9d9d9;
  }

  /deep/input::placeholder {
    color: #666;
  }

  .van-search__action {
    padding: 0;
    line-height: 0;
    margin: 0 10px;
    color: #26a2ff;
  }
}
</style>