<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <!--店招静态-->
    <div>
      <div class="shopfor">
        <div class="shop">
          <img :src="datas.preview_image? datas.preview_image: emptyImage" style="width: 100%; height: 100%; display: block;" alt="">
          <div class="content-style1" v-if="datas.shop_style == 1">
            <div class="image" v-if="datas.show_logo">
              <img :src="shopLogo || require('../../assets/images/component-shop.png')" alt="" />
            </div>
            <div class="title" v-if="datas.show_name">{{shopName|| 'XX商城'}}</div>
          </div>
          <div class="content-style2" v-if="datas.shop_style == 2">
            <div class="image" v-if="datas.show_logo">
              <img :src="shopLogo || require('../../assets/images/component-shop.png')" alt="" />
            </div>
            <div class="title" v-if="datas.show_name">{{shopName|| 'XX商城'}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emptyImage from "@/assets/images/new_diy/banner.png";
// 自定义样式
const css = function() {
  const {
    margin_top,
    margin_bottom,
    margin_left,
    margin_right,
    logo_size,
    font_size,
    font_color,
  } = this.datas;

  return `
        .component-${this.id} .shopfor {
            margin-top: ${margin_top}px;
            margin-bottom: ${margin_bottom}px;
            margin-left: ${margin_left}px;
            margin-right: ${margin_right}px;
        }

        .component-${this.id} .shopfor .image {
            width: ${logo_size}px;
            height: ${logo_size}px;
        }

        .component-${this.id} .shopfor .title {
            color: ${font_color};
            font-size: ${font_size}px;
        }

    `;
};

export default {
  data() {
    return {
      emptyImage
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
    },
    shopName() {
      if(this.$store.state.temp.mailInfo) {
        return this.$store.state.temp.mailInfo.name;
      }else {
        return '';
      }
    },
    shopLogo() {
      if(this.$store.state.temp.mailInfo) {
        return this.$store.state.temp.mailInfo.logo;
      }else {
        return '';
      }
    }
  },

  methods: {
  },

  mounted() {},
};
</script>

<style lang="scss" scoped>
  // 默认
  .component-wrapper {
    width: 100%;
  }

  .shopfor {
    .shop {
      position: relative;
      width: 100%;
      min-height: 180px;
      box-sizing: content-box;

      .content-style1 {
        position: absolute;
        bottom: 0;
        min-height: 70px;
        width: 100%;
        display: flex;
        align-items: center;
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), hsla(0, 1%, 77%, 0.1));

        .image {
          /* width: 54px; */

          /* height: 54px; */
          border-radius: 4px;
          margin: 0 0 0 10px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
        }

        .title {
          margin-left: 10px;
        }
      }

      .content-style2 {
        position: absolute;
        bottom: 0;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);

        .image {
          /* width: 54px; */

          /* height: 54px; */
          border-radius: 4px;
          margin: 0 10px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 4px;
          }
        }

        .title {
          margin-top: 10px;
          width: 100%;
          text-align: center;
        }
      }
    }
  }
</style>
