<template>
  <div class="U000007-template1" style="position: relative; overflow: hidden;" :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="notice-box">
      <div class="icon-box" v-if="datas.is_showIcon">
        <i class="iconfont" v-if="!datas.icon_value || datas.icon_value.isIcon != 2" :class="[datas.icon_value && datas.icon_value.icon ? datas.icon_value.icon : 'icon-ht_btn_news']"></i>
        <img class="icon-img" v-if="datas.icon_value && datas.icon_value.isIcon == 2" :src="datas.icon_value.image" alt="" />
      </div>
      <div class="wrap" id="wrap" v-show="datas.is_scroll"  @click="toUrl">
        <div :id="'box'+id" class="box">
          <div :id="'marquee'+id" class="marquee">{{datas.search_title|| "请填写内容,可设置是否滚动显示"}}</div>
          <div :id="'copy'+id" class="copy"></div>
        </div>
        <div :id="'node'+id" class="node">{{datas.search_title|| "请填写内容,可设置是否滚动显示"}}</div>
        <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" v-if="datas.notice_link.is_h5 == 2" @click.stop v-html="datas.notice_link.html">
        </div>
      </div>
      <div class="scroll-notice" v-show="!datas.is_scroll" @click="toUrl">
        {{datas.search_title || "请填写内容,可设置是否滚动显示"}}
        <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" v-if="datas.notice_link.is_h5 == 2" @click.stop v-html="datas.notice_link.html">
        </div>
      </div>
    </div>


  </div>
</template>

<script>
// 自定义样式
const css = function () {
  const {
    preview_color,
    search_height,
    font_size,
    text_style,
    font_color,
  } = this.datas;

  return `
        .component-${this.id} .notice-box {
            background-color: ${preview_color.color};
            background-image: url(${preview_color.isColor == 2? preview_color.image: ''});
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            font-size: ${font_size}px;
            font-weight: ${text_style.includes('1')?'bold':''};
            font-style: ${text_style.includes('2')?'italic':''};
            color: ${font_color};
        }

        .component-${this.id} .icon-box{
            background-color: ${preview_color.isColor == 2? '#ffffff' : preview_color.color};
            height: ${search_height-6}px;
            line-height: ${search_height-6}px;
        }

        .component-${this.id} .wrap, .component-${this.id} .scroll-notice{
            height: ${search_height}px;
            line-height: ${search_height}px;
        }

        .component-${this.id} .notice-box, .component-${this.id} .scroll-notice{
            width: ${this.noticeWidth}px;
        }

        .component-${this.id} .marquee, .component-${this.id} .copy, .component-${this.id} .node{
            min-width: ${this.noticeWidth}px;
        }
    `;
};

export default {
  props: ['id', 'datas', 'styles'],
  data() {
    return{
      timer: null,
      noticeWidth: "375"
    };
  },
  mounted() {
    if(this.fun.getPhoneEnv() == 3) {
      this.noticeWidth = '375';
    }else {
      this.noticeWidth = document.body.clientWidth;
    }

    this.move();
  },
  computed: {
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },
  watch: {
    datas: {
      deep: true,//深度监听
      handler: function () {
        let copy = document.getElementById("copy"+this.id);
        if(copy) {
          copy.innerText = this.datas.search_title; // 文字副本填充
        }
      }
    }
  },

  methods: {
    toUrl() {
      if(this.datas.notice_link.is_h5 == 1 && this.datas.notice_link.link) {
        window.location.href = this.datas.notice_link.link;
      }
    },
    move() {
      let script = document.createElement('script');
      script.type = 'text/wxtag-template';
      script.text = `<div style="width: ${this.noticeWidth}px;height: ${this.datas.search_height}px;"></div>`;
      this.datas.notice_link.html = `<wx-open-launch-weapp username="${this.datas.notice_link.gh_id}" path="${this.datas.notice_link.minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;

      // 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
      if(!document.getElementById("node"+this.id)) {
        return;
      }
      let width = document.getElementById("node"+this.id).getBoundingClientRect().width;
      let box = document.getElementById("box"+this.id);
      let copy = document.getElementById("copy"+this.id);
      copy.innerText = this.datas.search_title; // 文字副本填充
      let distance = 0; // 位移距离
      let duration = "";
      if(this.datas.scroll_speed) {
        duration = (width / this.datas.scroll_speed);
      }
      clearInterval(this.timer);
      this.timer = null;
      this.timer = setInterval(()=> {
        distance = distance - 1;
        // 如果位移超过文字宽度，则回到起点
        if (-distance >= width) {
          distance = 16;
        }
        box.style.transform = "translateX(" + distance + "px)";
      }, duration || 20);
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

  .scroll-notice {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    content: '...';
  }

  .icon-box {
    position: absolute;
    left: 0;
    top: 0;
    height: 39px;
    line-height: 39px;
    padding: 0 5px;
    margin: 3px 0;
    background: #fff;
    z-index: 1;
    vertical-align: middle;
    display: flex;
    align-items: center;
    i {
      font-size: 20px;
    }
    .icon-img {
      width: 27px;
      height: 27px;
    }
  }

  // 限制外框宽度，隐藏多余的部分
  .wrap {
    white-space: nowrap;
    overflow: hidden;
    height: 45px; //设置此两行代码可以防止文字错位
    line-height: 45px;
  }

  // 移动框宽度设置
  .box {
    width: 80000%;
  }

  // 文字一行显示
  .box div {
    float: left;
  }

  // 设置前后间隔
  .marquee {
    /* min-width: 375px; */
    margin: 0 16px 0 0;
  }

  .copy {
    /* min-width: 375px; */
  }

  // 获取宽度的节点，隐藏掉
  .node {
    /* min-width: 375px; */
    position: absolute;
    z-index: -999;
    top: -999999px;
  }
</style>
