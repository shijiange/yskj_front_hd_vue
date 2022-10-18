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
    <van-swipe-item v-for="(items, i) in datas" :key="i">
      <!-- 视频答题 -->
      <ul v-if="iscont == 'question'">
        <li
          v-for="(item, i) in items"
          :key="i"
          style="float: left;"
          :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
        >
          <div @click.stop="gotoUrl(item.url)">
            <div class="image" v-if="item.thumb"><img :src="item.thumb"/></div>
            <div class="image" v-if="!item.thumb">
              <img src="../assets/images/img_default.png"/>
            </div>
            <p class="text">{{ item.title }}</p>
          </div>
        </li>
      </ul>
      <ul v-else>
        <li
          v-for="(item, i) in items"
          :key="i"
          style="float: left;"
          :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
        >
          <router-link :to="fun.getUrl('o2oCategory', { id: item.id,name:item.name })">
            <div class="image" v-if="item.thumb"><img :src="item.thumb"/></div>
            <div class="image" v-if="!item.thumb">
              <img src="../assets/images/img_default.png"/>
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
    return {
      clientWidths: ""
    };
  },
  props: [
    "iscont",
    "datas"
  ],

  mounted() {
    this.clientWidths = document.body.clientWidth;
    // console.log("sss", this.clientWidths);
  },
  methods: {
    gotoUrl(url) {
      window.location = url;
    }
  }
  // components: { Swipe, SwipeItem }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  ul {
    margin: 0.875rem 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;

    li {
      list-style: none;
      width: 20%;
      float: left;
      margin: 0;
      padding: 0;
      margin-bottom: 0.625rem;

      a {
        color: #2b2f33;
      }

      .image {
        height: 11vw;
        width: 100%;
        overflow: hidden;
      }

      img {
        width: 50%;
        vertical-align: middle;
        height: 90%;
        border-radius: 50%;
      }

      p {
        margin: 0;
        font-size: 12px;
        line-height: 1.125rem;
        max-height: 2.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding: 0 0.5rem;
        display: block;
      }
    }

    .pcStyle {
      .image {
        height: 2.625rem;
      }
    }
  }

  .sw_list {
    padding-top: 0.6rem;
  }

  .sw_list_6 {
    min-height: 6rem;
  }

  .sw_list_12 {
    min-height: 10rem;
  }

  .sw_list_0 {
    min-height: 0;
  }

  @media all and (max-width: 400px) {
    .sw_list_12 {
      height: 12rem;
    }
  }
</style>
