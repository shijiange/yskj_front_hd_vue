<template>
  <div class="goods-con" @click.stop="toGood(item)">
    <div class="goods-img">
      <img :src="item.content.thumb" />
    </div>
    <div class="goods-txt">
      <div class="goods-title">{{item.content.title}}</div>
      <div class="goods-price">￥{{item.content.price}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["item"],
  mounted() {
    this.$emit("loaded");
  },
  methods: {
    toGood(item) {
      // $http.get(
      //     "goods.goods.get-goods-type",
      //     {id: item.content.id}
      //   ).then(response => {
      //     if (response.result === 1) {
      //       console.log(response.data.goods_type)
      //     }
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
      if (item.content.id) {
        // if(item.content.goods_type === 'group_good') {
        //   this.$router.push(this.fun.getUrl("GroupGoods", { id: item.content.id }));
        // }else if(item.content.goods_type === 'grab_group') {
        //   this.$router.push(this.fun.getUrl("grab_group", { id: item.content.id }));
        // }else {
        this.$router.push(this.fun.getUrl("goods", { id: item.content.id }));
        // }
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.goods-con {
  background: #fff;
  display: flex;
  padding: 0.8rem;
  width: 15rem;

  .goods-img {
    width: 4.5rem;

    img {
      width: 4rem;
      height: 4rem;
    }
  }

  .goods-txt {
    flex: 1;

    .goods-title {
      color: #222;
      font-size: 14px;
    }

    .goods-price {
      margin-top: 0.8rem;
      color: #fb4a4a;
    }
  }
}
</style>