<template>
  <div id="carcontent">
    <div class="branch" v-if="list.goo&&list.set.cat_adv_img">
      <a :href="list.set.cat_adv_url|href_filters"><img :src="list.set.cat_adv_img"/></a>
      <div class="parentTitle">
        {{parentTitle}}
      </div>
    </div>

    <div class="sote"
         v-if='list.goo'>

      <ul>
        <li v-for="(item,i) in list"
            :key="i">
          <div @click="gotoDetails(item,1)">
            <div class="thumb"
                 v-if="item.thumb"><img :src="item.thumb"/></div>
            <div class="thumb"
                 v-if="!item.thumb"><img src="../assets/images/img_default.png"/></div>
            <span>{{item.name}}</span>
          </div>
        </li>
      </ul>
    </div>

    <div>

      <div class="sote"
           v-if='list.data'>
        <div class="branch"
             v-if="list.top_img"><a :href="list.adv_url|href_filters"><img :src="list.top_img"/></a></div>
        <div class="parentTitle">
          {{parentTitle}}
        </div>
        <ul>
          <li v-for="item in list.data"
              :key="item.id">
            <div @click="gotoDetails(item,1)">
              <div class="thumb"
                   v-if="item.thumb"><img :src="item.thumb"/></div>
              <div class="thumb"
                   v-if="!item.thumb"><img src="../assets/images/img_default.png"/></div>
              <span>{{item.name}}</span>
            </div>
          </li>
        </ul>
        <!-- <h3 class=""
            v-if='item.name'>
          <router-link :to="fun.getUrl('category_child',{id:item.id,fromHome: 1})">{{item.name}}</router-link>
        </h3> -->

        <!-- <ul v-if="item.has_many_children.length>0">
          <li v-for="catshop in item.has_many_children"
              :key="catshop.id">
            <router-link :to="fun.getUrl('category_child',{id:catshop.id,fromHome: 1})">

              <div class="thumb"
                   v-if="catshop.thumb"><img :src="catshop.thumb" /></div>
              <div class="thumb"
                   v-if="!catshop.thumb"><img src="../assets/images/img_default.png" /></div>
              <span>{{catshop.name}}</span>
            </router-link>
          </li>
        </ul> -->
      </div>
    </div>
    <template v-if="!list.goo && false">
      <template v-if='list.set'>
        <div class="branch"
             style="margin-top: 1rem;"
             v-if='list.set.cat_level==2 && $store.state.category.adv_img'><a
          :href="$store.state.category.adv_url|href_filters"><img :src="$store.state.category.adv_img"/></a></div>
        <div class="sote"
             v-if='list.set.cat_level==2'>
          <ul>
            <li v-for="(item,i) in list.data"
                :key="i">
              <router-link :to="fun.getUrl('catelist',{id:item.id,fromHome: 1})">
                <div class="thumb"
                     v-if="item.thumb"><img :src="item.thumb"/></div>
                <div class="thumb"
                     v-if="!item.thumb"><img src="../assets/images/img_default.png"/></div>
                <span>{{item.name}}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </template>
    </template>
    <div v-if="this.fun.isTextEmpty(list.data)">
      <img src="../assets/images/no-more-product.png"
           alt=""
           style="width: 5rem; margin-top: 6rem;"/>
    </div>
  </div>

</template>
<script>
import Fun from "../fun";

export default {
  props: ["list", "parentTitle"],
  data() {
    return {
      toi: Fun.getKey("i"),
      types: Fun.getTyep(),
      allLoaded: false,
      topStatus: "",
      advimg: window.localStorage.adv_img
      // ...
    };
  },
  activated() {
    console.log(this.parentTitle);
  },
  created() {
    window.list = this.list;
    console.log(this.list);
  },
  methods: {
    gotoDetails(item, fromHome) {
      //   console.log(this.list);
      //    this.$router.push(this.fun.getUrl('category_child',{id,fromHome}));
      //   return;
      if (item.level == 1) {
        this.$emit("bindOneCategory", item);
        return;
      }
      if (this.list.set.cat_level == 2) {
        this.$router.push(this.fun.getUrl("search", { id: item.id, fromHome }));
        return false;
        // this.$router.push(this.fun.getUrl("catelist", { id: item.id, fromHome }));
      } else if (this.list.set.cat_level == 3) {
        this.$router.push(this.fun.getUrl("category_child", { id: item.id, fromHome }));
      }

    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #carcontent {
    background: #eee;
    color: #686868;
    margin-bottom: 3.75rem;
    margin-top: 3%;

    .branch {
      margin: 0 3%;
    }

    .parentTitle {
      text-align: left;
      font-weight: bold;
      display: flex;
      align-items: center;
      line-height: 0.9rem;
      margin-top: 0.5rem;
      margin-left: 0.5rem;
      padding-left: 0.5rem;
      font-size: 0.9rem;
      color: #000;
      border-left: 4px solid #fb4a4a;
    }

    .sote {
      clear: both;
      overflow: hidden;
      margin-bottom: 0.625rem;
    }

    h3 {
      text-align: left;
      font-size: 12px;
      margin-left: 3%;
      margin-bottom: 0;
      padding: 0.3125rem 0 0;
      font-weight: bold;
      display: block;
      clear: both;
      color: #999;

      a {
        color: #333;
      }
    }

    .fa-bookmark::before {
      margin-right: 0.375rem;
    }

    a span {
      height: 1.875rem;
      line-height: 1.875rem;
      overflow: hidden;
      color: #686868;
      text-overflow: ellipsis;
      width: 100%;
      display: block;
      // display: -webkit-box;
      white-space: nowrap;
      text-align: -webkit-center;
    }

    .branch img {
      width: 100%;
    }

    .thumb {
      line-height: 22.5vw;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      position: relative;
    }

    ul {
      width: 94%;
      overflow: hidden;
      padding: 4% 0 0 4%;
      margin: 0% 3% 0;
      background: #fff;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
    }

    li {
      width: 29%;
      text-align: center;
      margin-bottom: 0.625rem;
      margin-right: 4%;
      font-size: 12px;
      background: #fff;
      flex-shrink: 0;

      img {
        width: 98%;
        right: 0;
        height: 98%;
        position: absolute;
      }
    }

    li:nth-child(3n) {
      margin-right: 0;
    }
  }
</style>
