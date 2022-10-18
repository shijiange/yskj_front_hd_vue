<template>
  <van-swipe
    :autoplay="0"
    indicator-color="#f15353"
    class="sw_list"
    :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths"
    :class="{
      sw_list_6: datas != null && datas.length > 0 && datas[0].length <= 5,
      sw_list_12: datas != null && datas.length > 0 && datas[0].length > 5,
      sw_list_0: datas.length == 0
    }"
  >
    <van-swipe-item v-for="(items, index) in datas" :key="index">
      <ul>
        <li v-for="(item, index) in items" :key="index" style="float: left;">
          <router-link
            :to="
              fun.getUrl('micro_shop_share_carelist', {
                id: item.id,
                fromHome: 1
              })
            "
          >
            <div class="image" v-if="item.thumb"><img :src="item.thumb" /></div>
            <div class="image" v-if="!item.thumb">
              <img src="../assets/images/img_default.png" />
            </div>
            <p class="text">{{ item.name }}</p>
          </router-link>
        </li>
      </ul>
    </van-swipe-item>
  </van-swipe>
</template>

<script>
// import { Swipe, SwipeItem } from "c-swipe";
export default {
  data() {
    return { clientWidths: "" };
  },
  props: ["datas"],

  mounted() {
    this.clientWidths = document.body.clientWidth;
  },
  methods: {},
  // components: { Swipe, SwipeItem }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.sw_list {
  padding-top: 0.6rem;
}

.sw_list_6 {
  /* height:  6rem; */
}

.sw_list_12 {
  height: 10rem;
}

.sw_list_0 {
  height: 0;
}

@media all and (max-width: 400px) {
  .sw_list_12 {
    height: 12rem;
  }
}

ul {
  margin: 0;
  padding: 0;

  li {
    list-style: none;
    width: 25%;
    float: left;
    margin: 0;
    padding: 0;
    margin-bottom: 0.625rem;

    a {
      color: #2b2f33;
    }

    .image {
      height: 3.28rem;
      overflow: hidden;
      line-height: 3.28rem;
      border-radius: 30%;
    }

    img {
      width: 50%;
      vertical-align: middle;
      height: 90%;
    }

    p {
      margin: 0;
      padding: 0;
      font-size: 12px;
      line-height: 1.25rem;
    }
  }
}
</style>
