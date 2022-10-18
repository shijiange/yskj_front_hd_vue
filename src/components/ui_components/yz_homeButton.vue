<template>
  <div class="y5" :class="[fun.getPhoneEnv() == 3 ? 'pc' : '']" @click.stop="showToolbar">
    <div class="y6" v-show="toolbar">
      <router-link class="y8" :to="fun.getUrl('home')" v-if="datas.includes('home')">
        {{title[0] || '首页'}}
      </router-link>
      <router-link class="yb" :to="fun.getUrl('orderlist', { status: '0' })" v-if="datas.includes('orderlist')">
        {{title[1] || '订单'}}
      </router-link>
      <router-link class="yc" :to="fun.getUrl('member')" v-if="datas.includes('member')">
        {{title[2] || '我的'}}
      </router-link>
      <i class="yd"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: [String, Object, Array]
    },
    title: {
      type: [String, Object, Array],
      default: ()=> ['首页','订单','我的']
    }
  },
  data() {
    return {
      toolbar: false
    };
  },
  methods: {
    showToolbar() {
      this.toolbar = !this.toolbar;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .pc {
    position: absolute !important;
    top: 45rem;
  }

  .y5 {
    position: fixed;
    z-index: 1000;
    right: 0;
    bottom: 7.1875rem;
    width: 2.25rem;
    height: 2.25rem;
    background: rgba(0, 0, 0, 0.8) url(//static-o2o.360buyimg.com/daojia/new/images/menu/bm.png) 0.4375rem 0.4375rem no-repeat;
    background-size: 4.0625rem 1.25rem;
    border: 0.0625rem solid #757575;
    border-radius: 0.25rem 0 0 0.25rem;
  }

  .y6 {
    position: absolute;
    right: -0.0625rem;
    bottom: 2.625rem;
    width: 5.9375rem;
    border: 0.0625rem solid #757575;
    background: rgba(0, 0, 0, 0.8);
  }

  .y6 a {
    display: block;
    padding-left: 2rem;
    border-bottom: 0.0625rem solid #4b4b4b;
    line-height: 2.1875rem;
    height: 2.1875rem;
    color: #fff;
    background-image: url(//static-o2o.360buyimg.com/daojia/new/images/icon/bmenu.png);
    background-repeat: no-repeat;
    background-size: 1rem 18.75rem;
  }

  .y8 {
    background-position: 0.625rem -3.125rem;
  }

  .yb {
    background-position: 0.625rem -12.5rem;
  }

  .yc {
    background-position: 0.625rem -15.625rem;
    border: none;
  }

  .yd {
    position: absolute;
    bottom: -0.75rem;
    right: 0.625rem;
    width: 0;
    height: 0;
    z-index: 15;
    border-width: 0.375rem;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
    border-style: solid;
  }
</style>