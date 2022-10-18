<template>
  <div
    id="search"
    :style="{ background: datas.params.bgcolor }"
    @click="tosearch"
  >
    <div
      id="soso"
      :style="{
        borderColor: datas.params.bordercolor,
        color: datas.params.color
      }"
    >
      <i
        class="iconfont icon-sousuo1"
        :class="{ style1: datas.params.style != 'style1' }"
      ></i>
      {{ datas.params.placeholder }}
    </div>
    <!-- <div class="search-btn">搜索</div> -->
  </div>
</template>
<script>
export default {
  props: ["datas"],
  mounted() {},
  methods: {
    tosearch() {
      this.$router.push(
        this.fun.getUrl("search", {
          fromHome: 1
        })
      );
      //this.$router.push(this.fun.getUrl('search',{kyes:this.datas.params.placeholder}));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#search {
  background: #fff;
  padding: 0.375rem 1.25rem;

  #soso {
    width: 100%;
    height: 1.75rem;
    line-height: 1.75rem;
    background: #f5f5f5;
    padding: 0 0.625rem;
    text-align: left;
    border-radius: 1rem;
    color: #8c8c8c;
    border: 1px solid;

    i {
      color: #999;
      line-height: 1.75rem;
      margin-right: 0.375rem;
      font-size: 16px;
    }

    i.style1 {
      float: right;
    }
  }
}
</style>
