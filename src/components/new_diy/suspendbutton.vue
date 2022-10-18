<template>
  <div :class="className">
    <!-- style -->
    <!--<div v-html="css"></div>-->

    <template v-if="datas.list && datas.list.choose_style == 1">
      <div class="fixed-box" v-for="(item, index) in datas.list.list" :key="index" :style="{ top: `${datas.over_top - index * (datas.list.button_padding + 50)}px` }">
        <!--悬浮按钮静态-->
        <div class="btn" :style="button_style">
          <a :href="'tel:' + item.phone" v-if="item.is_minApp == 3">
            <img :src="item.image || emptyImage" />
          </a>
          <img :src="item.image || emptyImage" v-if="item.is_minApp != 3" @click="toUrl(item)" />
          <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-radius: 50%;" v-if="item.is_minApp == 2" @click.stop v-html="item.html"></div>
        </div>
      </div>
    </template>

    <template v-if="datas.list && datas.list.choose_style == 2">
      <div class="fixed-box2" :style="{ top: `${datas.over_top}px` }" v-if="datas.list.show_style == 1">
        <img :style="button_style" :class="[isFold ? 'active' : '']" @click="toOpen" :src="isFold ? datas.list.fold_button || openImage : datas.list.unfold_button || openImage" class="imgs" />
        <div
          class="btn"
          :class="[isFold ? 'active' : '']"
          v-for="(item, index) in datas.list.list"
          :key="index"
          :style="{
            top: `${-70 * (index + 1)}px`,
            left: `${datas.position_location == 'left' ? 10 + (datas.button_size - 50) / 2 : box_width - 60 - (datas.button_size - 50) / 2}px`
          }"
        >
          <a :href="'tel:' + item.phone" v-if="item.is_minApp == 3">
            <img :src="item.image || emptyImage" />
          </a>
          <img :src="item.image || emptyImage" v-if="item.is_minApp != 3" @click="toUrl(item)" />
          <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-radius: 50%;" v-if="item.is_minApp == 2" @click.stop v-html="item.html"></div>
        </div>
      </div>

      <div class="fixed-box2" :style="{ top: `${datas.over_top}px` }" v-if="datas.list.show_style == 2">
        <img :style="button_style" :class="[isFold ? 'active' : '']" @click="toOpen" :src="isFold ? datas.list.fold_button || openImage : datas.list.unfold_button || openImage" class="imgs" />
        <div class="btn" :class="[isFold ? 'active' : '']" style="top: -70px;" :style="btn_1_style" v-if="datas.list.list[0]">
          <a :href="'tel:' + datas.list.list[0].phone" v-if="datas.list.list[0].is_minApp == 3">
            <img :src="datas.list.list[0].image || emptyImage" />
          </a>
          <img :src="datas.list.list[0].image || emptyImage" v-if="datas.list.list[0].is_minApp != 3" @click="toUrl(datas.list.list[0])" />
          <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-radius: 50%;" v-if="datas.list.list[0].is_minApp == 2" @click.stop v-html="datas.list.list[0].html"></div>
        </div>
        <div class="btn" :class="[isFold ? 'active' : '']" :style="btn_3_style" v-if="datas.list.list[1]">
          <a :href="'tel:' + datas.list.list[1].phone" v-if="datas.list.list[1].is_minApp == 3">
            <img :src="datas.list.list[1].image || emptyImage" />
          </a>
          <img :src="datas.list.list[1].image || emptyImage" v-if="datas.list.list[1].is_minApp != 3" @click="toUrl(datas.list.list[1])" />
          <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-radius: 50%;" v-if="datas.list.list[1].is_minApp == 2" @click.stop v-html="datas.list.list[1].html"></div>
        </div>
        <div class="btn" :class="[isFold ? 'active' : '']" :style="btn_4_style" v-if="datas.list.list[2]">
          <a :href="'tel:' + datas.list.list[2].phone" v-if="datas.list.list[2].is_minApp == 3">
            <img :src="datas.list.list[2].image || emptyImage" />
          </a>
          <img :src="datas.list.list[2].image || emptyImage" v-if="datas.list.list[2].is_minApp != 3" @click="toUrl(datas.list.list[2])" />
          <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-radius: 50%;" v-if="datas.list.list[2].is_minApp == 2" @click.stop v-html="datas.list.list[2].html"></div>
        </div>
        <div class="btn" :class="[isFold ? 'active' : '']" style="top: 70px;" :style="btn_2_style" v-if="datas.list.list[3]">
          <a :href="'tel:' + datas.list.list[3].phone" v-if="datas.list.list[3].is_minApp == 3">
            <img :src="datas.list.list[3].image || emptyImage" />
          </a>
          <img :src="datas.list.list[3].image || emptyImage" v-if="datas.list.list[3].is_minApp != 3" @click="toUrl(datas.list.list[3])" />
          <div style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-radius: 50%;" v-if="datas.list.list[3].is_minApp == 2" @click.stop v-html="datas.list.list[3].html"></div>
        </div>
      </div>
    </template>
    <!-- 海报 -->

    <yz-goodsposter v-model="posterShow" :posterData="poster_Data" :defaultImg="poster" :width="`18.875rem`" v-on:finish="uploadImageM"></yz-goodsposter>

    <!-- 海报 end -->
  </div>
</template>

<script>
import emptyImage from "@/assets/images/new_diy/image.png";
import openImage from "@/assets/images/new_diy/open.png";
import yzGoodsposter from "components/ui_components/yz_goodsPoster";
import { Toast } from "vant";
export default {
  props: ["id", "datas", "styles"],
  data() {
    return {
      emptyImage,
      openImage,
      box_width: "375",
      isFold: false,

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
  components: { yzGoodsposter },
  mounted() {
    if (this.fun.getPhoneEnv() == 3) {
      this.box_width = "375";
    } else {
      this.box_width = document.body.clientWidth;
    }
    this.$nextTick(() => {
      this.initButtons();
    });
  },
  activated() {
    if (this.fun.getPhoneEnv() == 3) {
      this.box_width = "375";
    } else {
      this.box_width = document.body.clientWidth;
    }
    this.$nextTick(() => {
      this.initButtons();
    });
  },
  deactivated() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  computed: {
    button_style() {
      const { button_size, position_location } = this.datas;

      return `
                width: ${button_size}px;
                height: ${button_size}px;
                position: absolute;
                left: ${position_location == "left" ? "10" : this.box_width - 10 - button_size}px;
            `;
    },
    btn_1_style() {
      const { position_location } = this.datas;

      return `
				        left: ${position_location == "left" ? "10" : this.box_width - 60}px;
            `;
    },
    btn_2_style() {
      const { button_size, position_location } = this.datas;

      return `
				        top: ${20 + button_size}px;
				        left: ${position_location == "left" ? "10" : this.box_width - 60}px;
            `;
    },
    btn_3_style() {
      const { button_size, position_location } = this.datas;

      return `
				        top: ${15 - button_size}px;
				        left: ${position_location == "left" ? 20 + button_size : this.box_width - 65 - button_size}px;
            `;
    },
    btn_4_style() {
      const { button_size, position_location } = this.datas;

      return `
				        top: ${button_size - 15}px;
				        left: ${position_location == "left" ? 20 + button_size : this.box_width - 65 - button_size}px;
            `;
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },

  methods: {
    initButtons() {
      if (this.datas.list.choose_style == 1) {
        for (let j = 0; j < this.datas.list.list.length; j++) {
          let script = document.createElement("script");
          script.type = "text/wxtag-template";
          script.text = `<div style="width: ${this.datas.button_size}px;height: ${this.datas.button_size}px;border-radius: 50%"></div>`;
          this.datas.list.list[j].html = `<wx-open-launch-weapp username="${this.datas.list.list[j].gh_id}" path="${this.datas.list.list[j].minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;
        }
        this.datas.list.list.reverse().reverse(); //改变原始数组从而更新数组
      } else {
        for (let j = 0; j < this.datas.list.list.length; j++) {
          let script = document.createElement("script");
          script.type = "text/wxtag-template";
          script.text = `<div style="width: 50px;height: 50px;border-radius: 50%"></div>`;
          this.datas.list.list[j].html = `<wx-open-launch-weapp username="${this.datas.list.list[j].gh_id}" path="${this.datas.list.list[j].minApp_link}">${script.outerHTML}</wx-open-launch-weapp>`;
        }
        this.datas.list.list.reverse().reverse(); //改变原始数组从而更新数组
      }
    },
    toOpen() {
      this.isFold = !this.isFold;
    },
    toUrl(item) {
      if (item.is_minApp == 1 && item.h5_link) {
        window.location.href = item.h5_link;
      } else if (item.is_minApp == 5) {
        // 打开海报
        this.openQrCode("block",item.poster_id);
      }
    },
    //----------------  海报  ------------------
    openQrCode(e,poster_id) {
      this.getPoster(poster_id);
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
    uploadImageM(e) {
      //图片上传
      let that = this;
      this.dataURL = e;
      let uploadImage = this.fun.getRealUrl("member.qrcode.uploadLocal", { local_upload: 1, poster_id: that.poster_id, is_new: this.isNewPosterPlugin ? 1 : 0 });
      let fd = new FormData();
      fd.append("file", this.dataURItoBlob(this.dataURL));
      axios
        .post(uploadImage, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result == 1) {
            $http
              .post("member.qrcode.poster-record", { poster_id: that.poster_id, image: response.data.data.img_url, is_new: this.isNewPosterPlugin ? 1 : 0 })
              .then(response => {
                if (response.result === 1) {
                  console.log("添加海报生成记录成功");
                } else {
                  Toast(response.msg);
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    dataURItoBlob(dataURI) {
      // 图片转成Buffer---------------------------------
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    }
  }
};
</script>

<style lang="scss" scoped>
// 默认
.component-wrapper {
  width: 100%;
}

.poster-popup-class {
  background-color: transparent !important;
}

.fixed-box {
  width: 375px;
  position: fixed;
  top: 114px;
  z-index: 6;
  text-align: left;

  .button {
    /* margin-left: 325px; */
    background-color: white;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    justify-content: center;
    width: 50px;
    height: 50px;
    text-align: center;
    border-radius: 50%;
    border: 1px solid #d4d4d4;
    box-shadow: 0 1px 11px 0 rgba(4, 0, 0, 0.04);

    img {
      width: 45%;
      margin: 0 auto;
    }
  }

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

    a {
      display: block;
      width: 100%;
      height: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

.fixed-box2 {
  width: 375px;
  top: 114px;
  z-index: 6;
  position: fixed;
  text-align: left;

  .imgs {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    z-index: 6;
    position: relative;
    transform: rotate(0deg);
    transition: all 0.35s ease-in-out;
    object-fit: cover;

    &.active {
      transform: rotate(135deg);
    }
  }

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
    opacity: 0;
    transform: scale(0) translateX(0%) translateY(0%);
    transition: all 0.35s ease-in-out;

    a {
      display: block;
      width: 100%;
      height: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    &.active {
      transform: scale(1) translateX(0%) translateY(0%);
      opacity: 1;
    }
  }
}

/* 海报部分 */
#ewm {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: rgba(140, 140, 140, 0.72);
  z-index: 100;
  display: none;
  // padding-top: 14%;
  .pic_warn {
    background: #fff;
    color: #000;
    border-radius: 0.625rem;
    width: 14rem;
    height: 2.5rem;
    line-height: 2.5rem;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
  }

  .pic {
    width: 19.875rem;
    height: 31.375rem;
    // background: #fff;
    border-radius: 0.625rem;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    // transform: translate(-50%, -50%);
    margin: -15.6875rem 0 0 -9.9375rem;

    .ewm_bgImg {
      position: absolute;
      width: 100%;
      // height: 100%;
      height: auto;
      top: 0;
      left: 0;
    }

    .title {
      padding: 0.625rem;
      border-bottom: 0.0625rem solid #ebebeb;

      img {
        height: 2.5rem;
        width: 2.5rem;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;

        .set a {
          color: #fff;
          font-size: 24px;
        }

        #ewm {
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          background: rgba(140, 140, 140, 0.72);
          z-index: 100;
          display: none;
          padding-top: 14%;

          .pic {
            width: 70%;
            margin: auto;
            background: #fff;
            border-radius: 0.625rem;
            overflow: hidden;

            .title {
              padding: 0.625rem;
              border-bottom: 0.0625rem solid #ebebeb;

              img {
                height: 2.5rem;
                width: 2.5rem;
                border-radius: 50%;
                display: inline-block;
                vertical-align: middle;
              }

              span {
                margin-left: 0.875rem;
                vertical-align: middle;
                font-size: 16px;
              }
            }

            .ewm {
              z-index: 140;

              img {
                width: 50%;
                display: block;
                float: right;
              }
            }
          }

          img {
            width: 100%;
            display: block;
          }
        }
      }
    }
  }

  .diy_poster {
    position: relative;
    background: #fff;
    background-size: 100% 100%;
    width: 19.875rem;
    height: 31.375rem;

    .diy_poster_child {
      position: absolute;

      p {
        width: 100%;
        text-align: left;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }

      canvas {
        width: 100% !important;
        height: 100% !important;
      }
    }
  }

  img {
    width: 100%;
    display: block;
    height: 100%;
  }
}

.pcStyle #ewm {
  width: 375px;
  left: auto;
}

/* 海报部分end */
</style>
