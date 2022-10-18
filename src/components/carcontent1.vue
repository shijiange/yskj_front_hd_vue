<template>
  <div id="carcontent">
    <div class="branch" v-if="list.goo && list.set.cat_adv_img">
      <a :href="list.set.cat_adv_url | href_filters"><img :src="list.set.cat_adv_img"/></a>
    </div>
    <div class="sote" v-if="list.goo">
      <ul>
        <li v-for="(item, i) in list" :key="i" @click="toCatelist(item.id, $event)">
          <div class="thumb" v-if="item.thumb">
            <img :src="item.thumb" />
          </div>
          <div class="thumb" v-if="!item.thumb">
            <img src="../assets/images/img_default.png" />
          </div>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <div v-for="item in list.data" :key="item.id" v-show="list.set.cat_level == 3">
      <div class="branch" v-if="item.adv_img">
        <a :href="item.adv_url | href_filters"><img :src="item.adv_img"/></a>
      </div>
      <div class="sote" v-if="list.data">
        <h3 class="" v-if="item.name" @click="toCatelist(item.id, $event)">
          {{ item.name }}
        </h3>

        <ul v-if="item.has_many_children && item.has_many_children.length > 0">
          <li v-for="(catshop, i) in item.has_many_children" @click="toCatelist(catshop.id, $event)" :key="i">
            <div class="thumb" v-if="catshop.thumb">
              <img :src="catshop.thumb" />
            </div>
            <div class="thumb" v-if="!catshop.thumb">
              <img src="../assets/images/img_default.png" />
            </div>
            <span>{{ catshop.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <template v-if="!list.goo">
      <template v-if="list.set">
        <div class="branch" v-if="list.set.cat_level == 2 && $store.state.category.adv_img">
          <a :href="$store.state.category.adv_url | href_filters"><img :src="$store.state.category.adv_img"/></a>
        </div>
        <div class="sote" v-if="list.set.cat_level == 2">
          <ul>
            <li v-for="(item, i) in list.data" @click="toCatelist(item.id, $event)" :key="i">
              <div class="thumb" v-if="item.thumb">
                <img :src="item.thumb" />
              </div>
              <div class="thumb" v-if="!item.thumb">
                <img src="../assets/images/img_default.png" />
              </div>
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import Fun from '../fun';
export default {
  props: ['list', 'formCard'],
  data() {
    return {
      toi: Fun.getKey('i'),
      types: Fun.getTyep(),
      allLoaded: false,
      topStatus: '',
      advimg: window.localStorage.adv_img
    };
  },
  methods: {
    toCatelist(id, event) {
      if (this.formCard) {
        let subStr = new RegExp('microShopAdd/micro_shop_category');
        let result = window.location.href.replace(subStr, 'business_card/card_goods/' + id);
        event.preventDefault();
        location.replace(result);
        // this.$router.push(this.fun.getUrl("CardGoods", { id: id }));
      } else {
        this.$router.push(this.fun.getUrl('catelist1', { id: id }));
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
    color: #686868;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
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
    clear: both;
    width: 94%;
    overflow: hidden;
    padding: 4% 0 0 4%;
    margin: 3% 3% 0;
    background: #fff;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
  }

  li {
    width: 29%;
    text-align: center;
    float: left;
    margin-bottom: 0.625rem;
    margin-right: 4%;
    font-size: 12px;
    background: #fff;

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
