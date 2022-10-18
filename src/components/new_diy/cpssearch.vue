<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="weixin-title" :id="`scroll-box-${this.id}`">
      <div class="weixin-sousuo" @click="tosearch"
           :class="{ 'w': datas.search_style==2,
                   'center': datas.position_style=='center',
                   'padding':datas.search_style==2}">
        <i class="iconfont icon-all_search_2" v-if="datas.search_style==1"></i>
        <div class="text-over">{{datas.search_title}}</div>
      </div>
      <span v-if="datas.search_style==2" :class="{ 'borderOne': datas.search_style==2}" @click="tosearch" class="block">搜索</span>
    </div>

  </div>
</template>

<script>
// 自定义样式
const css = function() {
  const {
    preview_color,
    search_border_radius,
    font_size,
    font_color,
    search_color,
    search_height,
    border_style,
    border_color
  } = this.datas;

  return `
      .component-${this.id} .weixin-title {
          background-color: ${preview_color.color};
          background-image: url(${preview_color.isColor == 2 ? preview_color.image : ""});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
          color: ${font_color};
          height: ${search_height}px;
          line-height: ${search_height}px;
      }

      .component-${this.id} .weixin-title .weixin-sousuo {
          background-color: ${search_color || "#f8f8f8"};
          border-radius: ${search_border_radius}px;
          border: solid  ${border_style}px ${border_color};
          font-size: ${font_size}px;
      }

  `;
};

export default {
  data() {
    return {
    };
  },
  props: ["id", "datas", "styles"],
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
    tosearch() {
      this.$router.push(
        this.fun.getUrl("cpsSearchPage",{fromHome: 1}, { status: this.datas.search_type })
      );
    },
  },

  mounted() {
    this.$emit("loaded");
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  // 默认
  .component-wrapper {
    width: 100%;
  }

  .weixin-title {
    height: 50px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .weixin-logo-one {
      margin-right: 10px;
      box-sizing: border-box;
      border: solid 1px #ccc;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 30px;
      }
    }

    .weixin-logo-two {
      margin-left: 10px;
      box-sizing: border-box;
      border: solid 1px #ccc;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 30px;
      }
    }

    .weixin-sousuo {
      width: 96%;
      height: 30px;
      background-color: #f3f2f2;
      position: relative;
      display: flex;
      align-items: center;

      i {
        font-size: 14px;
        display: inline-block;
        margin-right: 10px;
        margin-left: 10px;
      }
    }

    .text-over {
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: break-word;
      overflow: hidden;
    }
  }

  .block {
    width: 50px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f2f2;
  }

  .padding {
    padding-left: 10px;
  }

  .center {
    justify-content: center;
  }

  .borderOne {
    border-left: solid 1px #ccc;
  }

  .w {
    width: 310px !important;
  }

  .scroll {
    overflow-x: scroll;
  }
</style>
