<template>
  <!-- <swipe :style="datas.length==0?'height:0rem':'height:190px;'"> -->
  <!--<swipe>-->
  <!--<swipe-item v-for="items in datas" :time=2 id="box_b">-->
  <!--<ul class="apply_box">-->
  <!--<li v-for="item in items">-->
  <!--<router-link :to="fun.getUrl('catelist',{id:item.id,fromHome: 1})">-->
  <!--<div class="image" v-if='item.thumb'><img :src="item.thumb" /></div>-->
  <!--<div class="image" v-if='!item.thumb'><img src="../assets/images/img_default.png" /></div>-->
  <!--<p class="text" style="-webkit-box-orient: vertical;">{{item.name}}</p>-->
  <!--</router-link>-->
  <!--</li>-->
  <!--</ul>-->
  <!--</swipe-item>-->
  <!--</swipe>-->
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
      <ul>
        <li
          v-for="item in items" :key="item.id"
          style="float: left;"
          :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
        >
          <router-link
            :to="fun.getUrl(url||'catelist', { id: item.id, fromHome: 1 })"
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
    return {
      clientWidths: ""
    };
  },
  props: ["datas",'url'],
  mounted() {
    this.clientWidths = document.body.clientWidth;
  },
  methods: {},
  // components: { Swipe, SwipeItem }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
ul {
  margin-top: 0.875rem;
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
  height: 6rem;
}

.sw_list_12 {
  height: 12rem;
}

.sw_list_0 {
  height: 0;
}

@media all and (max-width: 400px) {
  .sw_list_12 {
    height: 12rem;
  }
}
</style>
