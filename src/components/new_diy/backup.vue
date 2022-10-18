<template>
  <div class="U000023-template1" style="position: relative;" :class="className">
    <!--回到顶部静态-->
    <div class="fixed-box" :style="{top : `${datas.over_top}px`,width: `${box_width}px`}">
      <transition name="fade">
        <div class="btn" :style="button_style" @click="backup" v-show="btnFlag">
          <img :src="datas.icon_url || emptyImage">
        </div>
      </transition>
    </div>

  </div>
</template>

<script>
import emptyImage from "@/assets/images/new_diy/backtotop@2x.png";

export default {
  props: ['id', 'datas', 'btnFlag', 'poster'],
  data() {
    return{
      emptyImage,
      box_width: '375',
    };
  },
  mounted() {
    if(this.fun.getPhoneEnv() == 3) {
      this.box_width = '375';
    }else {
      this.box_width = document.body.clientWidth;
    }
  },
  computed: {
    button_style() {
      // 自定义样式
      const {
        button_size,
        position_location,
      } = this.datas;

      return `
                width: ${button_size}px;
                height: ${button_size}px;
                left: ${position_location =='left'?'10':(this.box_width-10)-button_size}px;
            `;
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },
  watch: {},

  methods: {
    backup() {
      if(this.poster == 1) {
        // 商品详情页=> 海报
        this.$emit('poster');
        return;
      }
      var timer = setInterval(function() {
        let osTop = document.documentElement.scrollTop || document.body.scrollTop;
        let ispeed = Math.floor(-osTop / 5);
        document.documentElement.scrollTop = document.body.scrollTop = osTop + ispeed;
        if(osTop === 0){
          clearInterval(timer);
        }
      },15);
    },
  },

};
</script>

<style lang="scss" scoped>
  // 默认
  .component-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .fixed-box {
    width: 375px;
    position: fixed;
    top: 114px;
    z-index: 6;

    .btn {
      width: 50px;
      height: 50px;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      flex-direction: column;
      font-size: 13px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
</style>
