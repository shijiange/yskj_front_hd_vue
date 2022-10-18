<!-- 运费插件 -->
<template>
  <div id="freightPricing">
    <h2 class="title">{{ diyTitle }}</h2>
    <div class="freightPricing_main" :class="[isfold ? 'unfold' : 'fold']" ref="fp_main_height">
      <div ref="fp__main_child_h" v-html="content"></div>
    </div>
    <div class="freightPricing_btn" :class="[isfold ? 'unfold' : 'fold']" @click.stop="changeFold">
      {{ isfold ? '收起' : '展开' }}
      <div class="rotate_box"><i class="iconfont icon-member-bottom"></i></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['datas'],
  data() {
    return {
      diyTitle: '运费说明',
      content: null,
      isfold: false
    };
  },

  mounted() {
    this.diyTitle = !this.fun.isTextEmpty(this.datas.freight_name) ? this.datas.freight_name : '运费说明';
    this.content = !this.fun.isTextEmpty(this.datas.content) ? this.datas.content : `暂无${this.diyTitle}`;
  },

  components: {},

  computed: {},
  methods: {
    changeFold() {
      if (!this.isfold) {
        this.$refs.fp_main_height.style.height = this.$refs.fp__main_child_h.offsetHeight + 'px';
      } else {
        this.$refs.fp_main_height.style.height = '2.5rem';
      }

      this.isfold = !this.isfold;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
#freightPricing {
  img {
    max-width: 100% !important;
    height: auto !important;
    display: block;
    border: 0 !important;
  }
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
#freightPricing {
  background: #fff;
  border-radius: 10px;
  margin: 10px;
  text-align: left;
  padding: 0 0.75rem;

  .title,
  .freightPricing_btn {
    height: 2.375rem;
    line-height: 2.375rem;
    color: #000;
    font-weight: 400;
  }

  .freightPricing_main {
    overflow: hidden;
    line-height: 1.25rem;
    transition: height 0.6s;
  }

  .freightPricing_main.fold {
    height: 2.5rem;
  }

  .freightPricing_main.unfold {
    height: auto;
  }

  .freightPricing_btn {
    text-align: center;
    color: #666;
    line-height: 3rem;
  }

  .rotate_box {
    display: inline-block;
  }

  .freightPricing_btn.unfold .rotate_box {
    transform: rotate(180deg);
  }

  .freightPricing_btn.fold .rotate_box {
    transform: rotate(0deg);
  }
}
</style>
