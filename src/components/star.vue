<template>
  <p class="a8d">
    <span class="a79 clearfix"
      ><i v-for="(itemClass,i) in itemClasses" :class="itemClass" :key='i'></i
    ></span>
  </p>
</template>

<script>
export default {
  props: ["score"],
  computed: {
    itemClasses() {
      //星星的数组
      let result = [];
      let lengths = 5;
      let score = Math.floor(this.score * 2) / 2; //例如：把分数处理成在4.5以上及4.5就变成向上取整5，在4.5以下就变成4.5

      //是否需要半星
      let starhalf = score % 1 != 0 ? true : false;

      //几颗全星
      let fullstar = Math.floor(score);
      for (var i = 0; i < fullstar; i++) {
        //放全星
        result.push("");
      }
      if (starhalf) {
        //放半星
        result.push("half");
      }
      if (result.length < lengths) {
        //如果没有满到五个星就用灰色的星星补齐
        var offstar = lengths - result.length;
        for (var j = 0; j < offstar; j++) {
          result.push("zo");
        }
      }
      if (this.score <= 0.5) {
        result = ["", "", "", "", ""];
      }
      return result;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.a8d {
  // height: 0.75rem;
  padding-top: 0.125rem;
  overflow: hidden;
  display: inline-block;
  position: relative;

  .a79 {
    display: inline-block;
    font-size: 0;

    i {
      display: inline-block;
      width: 0.625rem;
      height: 0.625rem;
      background-position: 0 0;
      background-image: url(//static-o2o.360buyimg.com/daojia/new/images/icon/newStar.png);
      background-repeat: no-repeat;
      background-size: auto 0.625rem;
      margin-right: 0.0625rem;
    }

    .half {
      background-position: -1.25rem 0;
    }

    .zo {
      background-position: -2.6rem 0;
    }
  }
}
</style>
