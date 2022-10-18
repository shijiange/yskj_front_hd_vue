<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div class="weixin-title" :id="`scroll-box-${this.id}`">
      <div class="wxCode" @click="getPoster" v-if="datas.show_code == 1">
        <i class="iconfont icon-fontclass-erweima" :style="{color:datas.code_color}"></i>
      </div>
      <div class="weixin-sousuo" @click="tosearch"
           :class="{ 'w': datas.search_style==2,
                   'center': datas.position_style=='center',
                   'padding':datas.search_style==2}">
        <i class="iconfont icon-all_search_2" v-if="datas.search_style==1"></i>
        <div class="text-over">{{datas.search_title}}</div>
      </div>
      <span v-if="datas.search_style==2" :class="{ 'borderOne': datas.search_style==2}" @click="tosearch" class="block">搜索</span>
    </div>
    <!-- 海报 -->

    <yz-goodsposter v-model="posterShow" :posterData="poster_Data" :defaultImg="poster" :width="`18.875rem`" v-on:finish="uploadImageM"></yz-goodsposter>

    <!-- 海报 end -->
  </div>
</template>

<script>
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import { Toast } from "vant";
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
    border_color,
    btn_font_color,
    btn_bg_color
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
      .component-${this.id} .borderOne{
        background-color: ${btn_bg_color};
        color:${btn_font_color}
      }
  `;
};

export default {
  data() {
    return {
      oldOffsetTop: 0,
      oDiv: {},
      // 海报
      posterShow: false,
      poster: "",
      poster_Data: {
        poster_data: null,
        background: {}
      },
      poster_id: null, //海报id
      isNewPosterPlugin: false //是否为新海报
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
  components: { yzGoodsposter },
  methods: {
    tosearch() {
      if (this.datas.search_type === "store") {
        this.$router.push(this.fun.getUrl("o2oSearch", { city: "1", point: {} }));
      } else {
        zhuge.track('点击电商搜索栏',{
          '所在页面':'首页'
        });
        this.$router.push(
          this.fun.getUrl("search", { fromHome: 1 })
        );
      }
    },
    handleScroll() {
      if(this.datas.is_top_fixed != 1) {
        return;
      }
      let s = document.body.scrollTop || document.documentElement.scrollTop;
      if(this.oDiv.offsetTop != 0) {
        this.oldOffsetTop = this.oDiv.offsetTop;
      }
      if (s > this.oDiv.offsetTop && s > this.oldOffsetTop) {
        if(this.fun.getPhoneEnv() == 3) {
          this.oDiv.style = "position:fixed;top:0;width:375px;z-index:10";
        }else {
          this.oDiv.style = "position:fixed;top:0;width:100%;z-index:10";
        }
      } else {
        this.oDiv.style = "";
      }
    },
    // 海报
    getPoster(poster_id) {
      if (!this.fun.isTextEmpty(this.poster_Data.poster_data) || !this.fun.isTextEmpty(this.poster)) {
        this.posterShow = true;
        return;
      }
      $http.get("member.qrcode.get-poster", {poster_id: poster_id}, {}).then(
        response => {
          if (response.result === 1) {
            this.isNewPosterPlugin = response.data.new || false;
            if (response.data.center_show == 0) {
              //0 返回的默认图片
              this.poster = response.data.image_url;
              this.posterShow = true;
            } else if (response.data.center_show == 1) {
              //前端生成
              this.poster_Data.background.src = response.data.background_url || response.data.background;
              this.poster_Data.background.type = "background";
              this.poster_Data.poster_data = response.data.style_data;
              this.poster_id = response.data.id;
              this.posterShow = true;
            } else if (response.data.center_show == 2) {
              //部分关注二维码不支持跨域，走老接口
              this.toastPoster = Toast({
                duration: -1, // 持续展示 toast
                message: "正在为您生成海报中"
              });
              this.openQrCode_old();
            }
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
          if (this.timer) {
            clearInterval(this.timer);
            if (this.toastPoster) {
              this.toastPoster.close();
            }
          }
        }
      );
    },
    openQrCode_old() {
      if (!this.poster) {
        if (!this.timer) {
          this.getPoster_oldApi();
          this.timer = setInterval(() => {
            this.getPoster_oldApi();
          }, 3000);
        }
      } else {
        clearInterval(this.timer);
        this.toastPoster.close();
      }
    },
    getPoster_oldApi() {
      $http.get("member.poster").then(
        response => {
          if (response.result === 1) {
            this.poster = response.data.image_url;
            if (this.poster && this.timer) {
              this.posterShow = true;
              clearInterval(this.timer);
              if (this.toastPoster) {
                this.toastPoster.close();
              }
            }
          } else {
            Toast(response.msg);
            if (this.timer) {
              this.posterShow = true;
              clearInterval(this.timer);
              if (this.toastPoster) {
                this.toastPoster.close();
              }
            }
          }
        },
        response => {
          console.log(response.msg);
          if (this.timer) {
            this.posterShow = true;
            clearInterval(this.timer);
            if (this.toastPoster) {
              this.toastPoster.close();
            }
          }
        }
      );
    },
  },

  mounted() {
    this.$emit("loaded");
    this.$nextTick(() => {
      this.oDiv = document.getElementById(`scroll-box-${this.id}`);
    });
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  }
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
  .wxCode{
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-fontclass-erweima{
      font-size: 24px;
    }
  }
</style>
