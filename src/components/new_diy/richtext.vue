<template>
  <div class="U0000010-template1" :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="html-box" v-html="datas.html_value" @click="handleHtml($event)"></div>
    <van-image-preview v-model="showImg" :images="imgList" :start-position="imgStart"></van-image-preview>
  </div>
</template>

<script>
// 自定义样式
const css = function() {
  const { bg_color, padding_top, padding_bottom, padding_left, padding_right } = this.datas;

  return `
        .component-${this.id} .html-box {
            background-color: ${bg_color || "#f8f8f8"};
            padding-top: ${padding_top}px;
            padding-bottom: ${padding_bottom}px;
            padding-left: ${padding_left}px;
            padding-right: ${padding_right}px;
            text-align: left;
        }

        .component-${this.id} .html-box p {
          margin: 0;
        }

        .component-${this.id} .html-box img {
            max-width: 100%;
        }
    `;
};

export default {
  props: ["id", "datas", "styles"],
  data() {
    return {
      imgList: [],
      showImg: false,
      imgStart: 0
    };
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  methods: {
    handleHtml($event) {
      let that = this;
      if ($event.target) {
        if ($event.target.nodeName == "IMG" && $event.target.parentElement.nodeName !== "A") {
          if (that.imgList.length == 0 || (that.imgList.length > 0 && that.imgList.indexOf($event.target.currentSrc) < 0)) {
            that.imgList.push($event.target.currentSrc);
            that.imgStart = that.imgList.length - 1;
          } else {
            let _index = that.imgList.indexOf($event.target.currentSrc);
            that.imgStart = _index;
          }
          that.showImg = true;
        }
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// 默认
.component-wrapper {
  width: 100%;
}

.html-box {
  overflow: hidden;
  min-height: 30px;
}
</style>
