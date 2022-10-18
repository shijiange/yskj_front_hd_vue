<template>
  <van-row id="sort" :style="{background:supplier?'#f6f6f6':'fff'}">
    <van-col :span="show ? 6 : 8">
      <div
        class="grid-content"
        :class="{ active: sort.tab == 1, up: sort.up == 1, down: sort.down == 1 }"
        @click="toggle($event, 1)"
        v-if="!supplier"
      >
        评价
      </div>
      <div
        class="grid-content"
        :class="{ active: sort.tab == 5, up: sort.up == 5, down: sort.down == 5 }"
        @click="toggle($event, 5)"
        v-if="supplier"
      >
        综合
      </div>
    </van-col>
    <van-col :span="show ? 6 : 8">
      <div
        class="grid-content"
        :class="{ active: sort.tab == 2, up: sort.up == 2, down: sort.down == 2 }"
        @click="toggle($event, 2)"
      >
        销量
      </div>
    </van-col>
    <van-col :span="show ? 6 : 8">
      <div
        class="grid-content"
        :class="{ active: sort.tab == 3, up: sort.up == 3, down: sort.down == 3 }"
        @click="toggle($event, 3)"
      >
        价格
      </div>
    </van-col>
    <van-col :span="6" v-if="show">
      <div @click="toggle($event, 4)">筛选</div>
    </van-col>
  </van-row>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    text: {},
    hide: {},
    show: {
      default: false
    },
    supplier: {
      default: false
    },
    fatherTitle:{}
  },
  data() {
    return {
      sort: { up: false, dows: false, tab: 0 }
    };
  },
  computed: {
    ...mapState(['view']),
    classObject() {
      return {
        active: this.isActive && !this.error,
        'text-danger': this.error && this.error.type === 'fatal'
      };
    }
  },

  methods: {
    ...mapMutations(['views']),
    toggle(event, n) {
      this.sort.up = n;
      let order_field = '';
      let order_field_name ='';
      if (n == 4) {
        this.$emit('showscreen');
        zhuge.track(this.fatherTitle+'点击筛选');
      } else {
        if (n == 1) {order_field = 'comment_num';order_field_name ='评价';}
        if (n == 2) {order_field = 'show_sales';order_field_name ='销量';}
        if (n == 3) {order_field = 'price';order_field_name ='价格';}
        if (n == 5) {order_field = 'id';order_field_name ='综合';}
        zhuge.track(this.fatherTitle+'-点击排序标签',{
          '排序标签名称':order_field_name
        });
        if (event.target.className == 'grid-content up') {
          event.target.className = 'grid-content down';
          this.$emit('sortIn', { order_field, order_by: 'desc' });
        } else {
          event.target.className = 'grid-content up';
          this.$emit('sortIn', { order_field, order_by: 'asc' });
        }
      }
    }
  },
  mounted() {
    this.sort.up = false;
    this.sort.down = false;
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#sort {
  background: #fff;
  line-height: 2.25rem;
  border-bottom: solid 0.0625rem #f9f9f9;
  font-size: 12px;
  color: #333;

  .grid-content.up::after {
    background-position: -10.625rem -0.9375rem;
  }

  .grid-content.down::after {
    background-position: -10.625rem 0;
  }

  .grid-content.up,
  .grid-content.down {
    color: #f15353;
  }

  .grid-content::after {
    content: '';
    display: inline-block;
    width: 0.5rem;
    height: 0.625rem;
    background: url(../assets/images/jd-sprites.png) no-repeat;
    background-size: 12.5rem 12.5rem;
    background-position: -10.625rem -1.875rem;
    margin-left: 0.25rem;
  }

  i {
    color: #555;
  }
}
</style>
