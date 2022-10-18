<template>
  <div class="U000002-template1" :style="box_style">
    <img v-if="list.length == 0" :style="wrapper_style" :src="defaultUrl" alt="">
    <div v-if="list.length == 1" :style="wrapper_style">
      <img :style="img_style" :src="list[0].image" alt="" @click="toUrl(list[0])">
      <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"
           v-if="list[0].is_minApp == 2 && !fun.isApp() && !fun.isCPS()" @click.stop v-html="list[0].html">
      </div>
    </div>
    <van-swipe class="my-swipe slideshow" :autoplay="3000" :indicator-color="datas.slides_active_color || '#1989fa'" v-if="list.length > 1" ref="mySwiper">
      <!-- slides -->
      <van-swipe-item v-for="(item, idx) in list" :key="idx">
        <div class="list-image" v-if="item.image" :style="wrapper_style">
          <div style="position: relative;" :style="img_style"><img :src="item.image" alt="" :style="img_style" @click="toUrl(item)"></div>
          <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;"
               v-if="item.is_minApp == 2 && !fun.isApp() && !fun.isCPS()" @click.stop v-html="item.html">
          </div>
        </div>
      </van-swipe-item>
      <!--分页-->
      <!-- <div class="swiper-pagination" slot="pagination"></div> -->
    </van-swipe>
  </div>
</template>

<script>
// https://www.npmjs.com/package/vue-awesome-swiper
// import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import defaultUrl from "@/assets/images/new_diy/banner.png";

export default {
  props: ['id', 'datas', 'styles','fatherTitle'],
  data () {
    return {
      clientWidth: '375',
      // 轮播图设置
      swiperOption: {
        autoplay: true,
        // loop: true,   loop模式第二轮循环的时候第一张会闪烁
        delay: 3000,
        observer:true,
        // autoHeight: true,
        pagination: {
          el: '.swiper-pagination',
        }
      },
      defaultUrl
    };
  },

  components: {
    // Swiper,
    // SwiperSlide
  },

  computed: {
    // 初始化
    swiper () {
      return this.$refs.mySwiper.swiper;
    },

    /** 样式 */
    wrapper_style() {
      const {
        padding_top,
        padding_bottom,
        padding_left,
        padding_right,
      } = this.datas;
      return `
                width: 100%;
                padding-top: ${padding_top}px;
                padding-bottom: ${padding_bottom}px;
                padding-left: ${padding_left}px;
                padding-right: ${padding_right}px;
                position: relative;
            `;
    },

    img_style() {
      const {
        picture_border,
      } = this.datas;
      return `
                border-radius: ${picture_border}px;
            `;
    },

    box_style() {
      const {
        slides_default_color,
        bg_color,
      } = this.datas;
      return `
                --slides_default_color: ${slides_default_color || '#333333'};
				        background-color: ${bg_color};
            `;
    },

    // 广告轮播列表
    list () {
      try {
        let list = [...this.datas.list] || [];
        list = list.filter(item => item.image != '');
        return list;
      } catch (err) {
        return [];
      }
    }
  },
  mounted () {
    this.$nextTick(()=>{
      this.initButtons();
    });
  },
  activated() {
    this.$nextTick(()=>{
      this.initButtons();
    });
  },
  methods: {
    toUrl(item) {
      if(item.is_minApp == 2 && this.fun.isApp()) {
        YDB.MiniWX(item.gh_id, item.minApp_link);
        return;
      }
      if(item.is_minApp == 2 &&  this.fun.isCPS()) {
        let json = {
          mini_route: item.minApp_link,
          mini_id: item.gh_id,
        };
        if (this.fun.isIosOrAndroid() === "ios") {
          miniWXIOS({ body: "miniWXIOS", json: JSON.stringify(json) });
        } else {
          miniWXAndroid(JSON.stringify(json));
        }
        return;
      }

      if(item.is_minApp == 1 && item.h5_link) {        
          zhuge.track(this.fatherTitle+'-点击banner',{
            '轮播图src':item.image,
            '图片id':item.id,
            '跳转链接':item.h5_link
          });//诸葛统计       
        window.location.href = item.h5_link;
      }
    },
    // 图片加载完回调
    getImg(url, callback) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          console.log('图片加载出错');
        };
      }
    },
    initButtons() {
      let that = this;
      if(this.fun.getPhoneEnv() == 3) {
        this.clientWidth = 375;
      }else {
        this.clientWidth = document.body.clientWidth;
      }

      for(let j=0; j<this.datas.list.length; j++) {
        if(this.datas.list[j].image) {
          this.getImg(this.datas.list[j].image, function(scale) {
            // 图片加载完后获取图片高度
            let script = document.createElement('script');
            script.type = 'text/wxtag-template';
            script.text = `<div style="width: ${that.clientWidth}px;height: ${that.clientWidth*scale}px;"></div>`;
            that.datas.list[j].html = `<wx-open-launch-weapp username="${that.datas.list[j].gh_id}" path="${that.datas.list[j].minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;

            that.datas.list.reverse().reverse(); //改变原始数组从而更新数组
          });
        }
      }

    }
  },
};
</script>

<style lang="scss">
  /* .U000002-template1 .swiper-pagination { */

  /* bottom: 0rem; */

  /* } */

  /* .U000002-template1 .swiper-pagination-bullet { */

  /* position: relative; */

  /* margin: 0 .16rem!important; */

  /* vertical-align: top; */

  /* border-radius: 0; */

  /* width: .853rem; */

  /* height: .13rem; */

  /* background-color: rgba(255, 255, 255, .8)!important; */

  /* } */

  /* .U000002-template1 .swiper-pagination-bullet:after { */

  /* content: ''; */

  /* position: absolute; */

  /* top: 0; */

  /* left: 0; */

  /* width: 0; */

  /* height: .053rem; */

  /* background-color: #fff; */

  /* } */

  /* .U000002-template1 .swiper-pagination-bullet-active { */

  /* background: #fff; */

  /* } */
</style>

<style lang="scss" scoped>
  .U000002-template1 {
    display: block;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    width: 100%;
    overflow: hidden;

    img {
      width: 100%;
      display: block;
      border: none;
    }
  }

  .slideshow /deep/.van-swipe__indicator {
    background-color: var(--slides_default_color);
  }
</style>
