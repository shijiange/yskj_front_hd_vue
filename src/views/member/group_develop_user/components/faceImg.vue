<template>
  <div class="imgs">
    <div class="wrapper">
      <div class="img" v-for="item in num" :key="item.id"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 2
    };
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.imgs {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .wrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
  }

  .img {
    height: 0;
    background-image: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/group_develop_user_index_bg.png);
    background-size: cover;
    background-repeat: no-repeat;
  }

  .img:first-child:nth-last-child(1) {
    width: 100%;
    padding-bottom: 100%;
  }

  // 2张图片
  .img:first-child:nth-last-child(2),
  .img:first-child:nth-last-child(2) + .img {
    width: 40%;
    padding-bottom: 40%;
  }

  .img:first-child:nth-last-child(2) + .img {
    margin-left: 5%;
  }

  // 3张图片
  .img:first-child:nth-last-child(3) {
    width: 40%;
    padding-bottom: 40%;
    margin-left: 30%;
    margin-right: 30%;
    margin-bottom: 5%;
  }

  .img:first-child:nth-last-child(3) ~ .img {
    width: 40%;
    padding-bottom: 40%;
    margin-left: 5%;
  }

  .img:first-child:nth-last-child(3) + .img {
    margin-left: 0%;
  }

  //4张图片
  .img:first-child:nth-last-child(4),
  .img:first-child:nth-last-child(4) ~ .img {
    width: 40%;
    padding-bottom: 40%;
    margin: 2.5%;
  }

  //5张图片
  .img:first-child:nth-last-child(5) {
    margin-left: 10%;
    margin-right: 2.5%;
    margin-bottom: 2.5%;
    margin-top: 2%;
    width: 29%;
    padding-bottom: 29%;
  }

  .img:first-child:nth-last-child(5) ~ .img {
    width: 29%;
    padding-bottom: 29%;
    margin: 2% 1.25%;
  }

  .img:first-child:nth-last-child(5) + .img {
    margin-right: 10%;
  }

  //6张图片
  .img:first-child:nth-last-child(6),
  .img:first-child:nth-last-child(6) ~ .img {
    width: 29%;
    padding-bottom: 29%;
    margin: 1%;
  }

  // 7张图片
  .img:first-child:nth-last-child(7) {
    width: 29%;
    padding-bottom: 29%;
    margin-left: 30%;
    margin-right: 32%;
  }

  .img:first-child:nth-last-child(7),
  .img:first-child:nth-last-child(7) ~ .img {
    width: 29%;
    padding-bottom: 29%;
  }

  .img:first-child:nth-last-child(7) ~ .img {
    margin-top: 2%;
    margin-right: 2%;
  }

  //8张图片
  .img:first-child:nth-last-child(8) {
    margin-left: 10%;
    margin-right: 2%;
    margin-top: 2%;
    width: 29%;
    padding-bottom: 29%;
  }

  .img:first-child:nth-last-child(8) ~ .img {
    width: 29%;
    padding-bottom: 29%;
    margin-top: 2%;
    margin-left: 2%;
  }

  .img:first-child:nth-last-child(8) + .img {
    margin-right: 10%;
  }

  //9张图片
  .img:first-child:nth-last-child(9),
  .img:first-child:nth-last-child(9) ~ .img {
    width: 29%;
    padding-bottom: 29%;
    margin: 1%;
  }
}
</style>
