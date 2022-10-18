<template>
  <div class="U000004-template1" :class="className">
    <!-- style -->
    <div v-html="css"></div>
    <!-- 列表 -->
    <div v-if="datas.list.length <= 0" style="text-align: center; font-size: 16px; line-height: 32px;">
      请先添加按钮
    </div>
    <ul class="button-box" v-if="datas.list.length > 0 && !datas.is_scroll">
      <li v-for="(item, index) in datas.list" :key="`${index}-${item.id}`">
        <div v-if="item.is_minApp == 1 || fun.isApp() || fun.isCPS()" @click.stop="toUrl(item)">
          <img class="button-img" :src="item.image || emptyImage" alt="">
          <p class="button-title">{{ item.text }}</p>
          <p class="button-desc" v-if="item.desc">{{ item.desc }}</p>
        </div>

        <div style="text-align: center; width: 100%;" v-if="item.is_minApp == 2 && (!fun.isApp() || !fun.isCPS())" v-html="item.html">
        </div>
      </li>
    </ul>
    <swiper style="width: 100%;"
            v-if="datas.list.length > 0 && datas.is_scroll"
            :options="swiperOption"
            ref="mySwiper">
      <!-- slides -->
      <swiper-slide v-for="(items, idx) in scroll_list" :key="idx" class="button-box">
        <li v-for="(item, index) in items" :key="`${index}-${item.id}`">
          <div v-if="item.is_minApp == 1 || fun.isApp() || fun.isCPS()" @click.stop="toUrl(item)">
            <img class="button-img" :src="item.image || emptyImage" alt="">
            <p class="button-title">{{ item.text }}</p>
            <p class="button-desc" v-if="item.desc">{{ item.desc }}</p>
          </div>

          <div style="text-align: center;" v-if="item.is_minApp == 2 && (!fun.isApp() || !fun.isCPS())" v-html="item.html">
          </div>
        </li>
      </swiper-slide>
      <!--分页-->
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
// import { Toast } from 'vant';
import emptyImage from "@/assets/images/new_diy/image.png";
// import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

// 自定义样式
const css = function () {
  const {
    padding_top,
    padding_bottom,
    button_size,
    border_radius,
    button_number,
    preview_color,
    font_size,
    text_style,
    font_color,
    desc_color,
    slides_default_color,
    slides_active_color,
  } = this.datas;

  return `
        .component-${this.id} .button-box{
            padding: ${padding_top}px 0 ${padding_bottom}px 0;
            background-color: ${preview_color.color || '#f8f8f8'};
            background-image: url(${preview_color.isColor == 2? preview_color.image: ''});
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
        }

        .component-${this.id} .button-box li{
            width: ${button_number == 4?'25':'20'}%;
        }

        .component-${this.id}  .button-img{
            width: ${button_size}px;
            height: ${button_size}px;
            border-radius: ${border_radius}px;
        }

        .component-${this.id}  .button-title{
            font-size:${font_size}px;
            font-weight: ${text_style.includes('1')?'bold':''};
            font-style: ${text_style.includes('2')?'italic':''};
            color: ${font_color};
        }

        .component-${this.id} .button-desc {
          color: ${desc_color || '#999999'};
        }

        .component-${this.id} .my-bullet{
            background: ${slides_default_color};
        }

        .component-${this.id} .my-bullet-active{
            background: ${slides_active_color};
        }
    `;
};

export default {
  props: ['id', 'datas','fatherTitle'],
  data() {
    return {
      emptyImage,
      scroll_list: [],  //轮播时用的数值结构
      // 轮播图设置
      swiperOption: {
        autoplay: false,
        // loop: true,   loop模式第二轮循环的时候第一张会闪烁
        delay: 3000,
        observer:true,
        // autoHeight: true,
        pagination: {
          el: '.swiper-pagination',
          bulletClass : 'my-bullet',
          bulletActiveClass: 'my-bullet-active',
        }
      },
    };
  },
  computed: {
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
    button_number() {
      return this.datas.button_number;
    },
    button_line() {
      return this.datas.button_line || 1;
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.initButtons();
    });
  },
  activated() {
    this.$nextTick(()=>{
      this.initButtons();
    });
  },
  watch: {
    list: {
      deep: true,//深度监听
      handler: function () {
        let list = this.datas.list;
        this.scroll_list = [];

        if(!this.datas.button_line) {
          this.datas.button_line = 1;
        }

        let page = Math.ceil(this.datas.list.length/this.datas.button_number/this.datas.button_line);  //==> 页数
        let num = this.datas.button_number*this.datas.button_line; // ==> 每页多少个

        for(let i=0; i<page; i++) {
          this.scroll_list.push(list.slice(i*num,(i+1)*num));
        }
      }
    },
    button_number(newValue) {
      let list = this.datas.list;
      this.scroll_list = [];

      if(!this.datas.button_line) {
        this.datas.button_line = 1;
      }

      let page = Math.ceil(this.datas.list.length/newValue/this.datas.button_line);  //==> 页数
      let num = newValue*this.datas.button_line; // ==> 每页多少个

      for(let i=0; i<page; i++) {
        this.scroll_list.push(list.slice(i*num,(i+1)*num));
      }
    },
    button_line(newValue) {
      let list = this.datas.list;
      this.scroll_list = [];

      let page = Math.ceil(this.datas.list.length/this.datas.button_number/newValue);  //==> 页数
      let num = this.datas.button_number*newValue; // ==> 每页多少个

      for(let i=0; i<page; i++) {
        this.scroll_list.push(list.slice(i*num,(i+1)*num));
      }
    }
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
        
        //console.log(this.fatherTitle);
          zhuge.track(this.fatherTitle+'-点击icon',{
            'icon名称':item.text
          });
          window.sessionStorage.setItem('newDiyIcon',item.text);
        window.location.href = item.h5_link;
      }
    },
    initButtons() {
      this.scroll_list = [];

      if(!this.datas.button_line) {
        this.datas.button_line = 1;
      }

      for(let j=0; j<this.datas.list.length; j++) {
        let script = document.createElement('script');
        script.type = 'text/wxtag-template';
        script.text = `<img style="margin: 0 auto;display: block;width: ${this.datas.button_size}px;height: ${this.datas.button_size}px;border-radius: ${this.datas.border_radius}px"  src="${this.datas.list[j].image || emptyImage}" alt="图标"/>
        <p style="font-size: ${this.datas.font_size}px; font-weight: ${this.datas.text_style.includes('1')?'bold':''}; font-style: ${this.datas.text_style.includes('2')?'italic':''}; color: ${this.datas.font_color};text-align: center;margin: 3px 0 0 0;">${ this.datas.list[j].text }</p>
        <p style="font-size: 10px;text-align: center;color: #999999;margin: 3px 0 0 0;">${ this.datas.list[j].desc ? this.datas.list[j].desc : '' }</p>`;
        this.datas.list[j].html = `<wx-open-launch-weapp username="${this.datas.list[j].gh_id}" path="${this.datas.list[j].minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;
      }
      this.datas.list.reverse().reverse(); //改变原始数组从而更新数组

      let page = Math.ceil(this.datas.list.length/this.datas.button_number/this.datas.button_line);  //==> 页数
      let num = this.datas.button_number*this.datas.button_line; // ==> 每页多少个

      for(let i=0; i<page; i++) {
        this.scroll_list.push(this.datas.list.slice(i*num,(i+1)*num));
      }
    }
  },

  components: {
    // Swiper,
    // SwiperSlide
  },
};
</script>
<style>
  .my-bullet {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #000;
    border-radius: 50%;
    position: relative;
    margin: 0 2px;
    opacity: 0.3;
  }

  .my-bullet-active {
    background: #007aff;
    opacity: 1;
  }
</style>
<style lang="scss" scoped>
  // 默认
  .component-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;

    .button-box {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      li {
        /* flex: 1; */

        /* width: 25%; */
        position: relative;
        margin: 10px 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        align-self: flex-start;
        justify-self: center;
      }

      .button-img {
        margin: 0 auto;
      }

      .button-title {
        text-align: center;
        margin: 0;

        /* text-overflow: ellipsis; */

        /* white-space: nowrap; */

        /* word-wrap: break-word; */

        /* overflow: hidden; */
      }

      .button-desc {
        font-size: 10px;
        text-align: center;

        /* color: #999; */

        /* text-overflow: ellipsis; */

        /* white-space: nowrap; */

        /* word-wrap: break-word; */

        /* overflow: hidden; */
      }
    }

    /deep/.swiper-container-horizontal > .swiper-pagination-bullets {
      bottom: 2px;
    }
  }
</style>
