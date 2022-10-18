<!-- 商品详情页海报 -->
<template>
  <div>
    <van-popup class="poster-popup-class" v-model="posterShow" round @closed="closedPosterShow" get-container="body">
      <div id="goods-poster-main" :style="{ width: width }" v-if="isQuestOK || !fun.isTextEmpty(dataURL) || !fun.isTextEmpty(errorImg)">
        <div
          id="goods_poster_box"
          class="yz-goods"
          v-if="isQuestOK"
          :style="{
            backgroundColor: posterData.background && posterData.background.type == 'color' ? posterData.background.src : 'transparent',
            backgroundImage: 'url(' + (!isNewTemplate ? posterData.backgroundImg : '') + ')'
          }"
        >
          <template v-if="isNewTemplate">
            <!-- 新海报（商品海报 和 会员中心二维码） -->
            <img v-if="base64Datas[0] && !fun.isTextEmpty(base64Datas[0])" :src="base64Datas[0]" alt="" class="ewm_bgImg" />
            <div
              class="diy_poster_child"
              v-for="(item, index) in posterData.poster_data"
              :key="index"
              :style="{
                width: `${item.width / 32}rem`,
                height: `${item.height / 32}rem`,
                left: `${item.left / 32}rem`,
                top: `${item.top / 32}rem`
              }"
            >
              <img
                :src="base64Datas[index + 1]"
                alt=""
                :style="{ width: `${item.width / 32}rem`, height: `${item.height / 32}rem` }"
                v-if="needRotate.indexOf(item.type) > -1 && !fun.isTextEmpty(base64Datas[index + 1])"
              />
              <canvas :id="`ewmCanvas_${index}`" v-else-if="item.type == 'qr_shop' || item.type == 'qr_app_share'"></canvas>
              <p
                v-else
                :style="{
                  color: `${item.color}`,
                  fontSize: `${item.size / 32}rem`,
                  textDecoration: item.slide ? 'line-through' : item.under ? 'underline' : 'none',
                  fontWeight: item.bold ? 'bold' : '400',
                  fontStyle: item.italic ? 'italic' : 'normal'
                }"
              >
                <template v-if="item.type == 'market_price' && Number(item.src) > 0">{{ fun.getMarketPrice() }}:{{ $i18n.t("money") }}{{ item.src }}</template
                ><template v-else-if="item.type == 'member_price' && Number(item.src) > 0">会员价:{{ $i18n.t("money") }}{{ item.src }}</template
                ><template v-else-if="item.type == 'price'">{{ fun.getPrice() }}{{ $i18n.t("money") }}{{ item.src }}</template>
                <template v-else-if="item.type == 'title' || item.type == 'nickname' || item.type == 'mid'">{{ item.src }}</template>
                <template v-else-if="item.type == 'invite'">{{ item.src }}</template>
                <template v-else-if="Number(item.src) > 0">{{ item.src }}</template>
              </p>
            </div>
          </template>
          <template v-else>
            <!-- 旧海报(商品详情页商品海报) -->
            <div class="poster-top">
              <!-- <img :src="`${posterData.logo}?${Date.now()}`" alt="" class="logo" crossorigin="anonymous" /> -->
              <img :src="base64Datas[0]" alt="" class="logo" />
              <div class="top-name">{{ posterData.shopName | ellipsisFun(10) }}</div>
            </div>
            <div class="poster-thumb">
              <img :src="base64Datas[1]" alt="" class="logo" />
              <!-- <img :src="`${posterData.thumb}?${Date.now()}`" alt="" crossorigin="anonymous" /> -->
            </div>
            <div class="poster-price">
              {{ $i18n.t("money") }} {{ posterData.price }}
              <div class="poster-market-price" v-if="Number(posterData.market_price) > 0">{{ $i18n.t("money") }} {{ posterData.market_price }}</div>
            </div>
            <div class="poster-title">
              {{ posterData.shareTitle | ellipsisFun(63) }}
            </div>
            <div class="poster-bottom">
              <img :src="base64Datas[2]" alt="" class="poster-ewm" />
            </div>
          </template>
        </div>
        <div class="yz-goods-canvas" v-if="!fun.isTextEmpty(dataURL)">
          <img style="width: 100%; border-radius: 16px; object-fit: contain; height: 100%;" id="goods_poster_thecanvas" />
        </div>
        <div class="yz-goods-canvas" v-if="!fun.isTextEmpty(errorImg)">
          <img style="width: 100%; height: 100%;" :src="errorImg" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { Toast } from "vant";
import QRCode from "qrcode"; //旧装修需要
export default {
  model: {
    prop: "posterShow",
    event: "onEmit"
  },
  //props:defaultImg为父组件已生成图片传参，不需要前端canvas生成
  props: {
    //弹窗是否显示，默认不显示
    posterShow: {
      type: Boolean,
      default: false
    },
    posterData: {
      type: Object,
      default: () => ({})
    },
    goodstype: {
      type: Boolean,
      default: false
    },
    defaultImg: {
      type: String,
      default: null
    },
    width: {
      type: String,
      default: "20rem"
    },
    gid: {
      type: [String, Array]
    }
  },
  data() {
    return {
      isNewTemplate: true, //是否启用新海报插件。true为开启
      base64Datas: [],
      errorImg: null,
      dataURL: null,
      toastPoster: null,
      isQuestOK: false,
      imageArr: [],
      noNeedRotate: ["qr_shop", "qr_app_share"], //不需要转化base64
      needRotate: ["logo", "img", "other_img", "qr", "head", "shopqr"] //图片的type名称，需要转化base64
    };
  },

  activated() {},
  mounted() {},
  deactivated() {
    this.delDatas();
  },

  components: {},

  computed: {},
  watch: {
    // 如果 `showAddress` 发生改变，这个函数就会运行
    posterShow: function(newV, oldV) {
      console.log("海报显隐条件变化//////////////////////////", newV, oldV, this.dataURL, this.defaultImg);
      if (newV && this.fun.isTextEmpty(this.dataURL)) {
        this.initPosterData();
      }
    }
  },
  methods: {
    delDatas() {
      this.base64Datas = [];
      this.errorImg = null;
      this.dataURL = null;
      this.isQuestOK = false;
      this.imageArr = [];
      if (this.toastPoster) {
        this.toastPoster.clear();
      }
      this.toastPoster = null;
    },
    closedPosterShow() {
      this.$emit("onEmit", false);
    },
    initPosterData() {
      let that = this;
      // 问题：截图不全；原因：滚轮滑动造成的，主要是html2canvas是根据body进行截图，若内容高度高于body时，就会出现这样的问题(大概意思就是有滚动条时造成的)
      // 解决方案：(在生成截图前，先把滚动条置顶)
      // window.pageYOffset = 0;
      // window.pageXOffset = 0;  //注释原因：会导致其他页面的PullRefresh下拉刷新出问题#77497
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      if (this.fun.isTextEmpty(this.defaultImg)) {
        try {
          if (!this.posterData.new && this.goodstype) {
            this.isNewTemplate = false;
          }
        } catch (error) {
          this.isNewTemplate = false;
          console.log("error::", error);
        }

        this.toastPoster = Toast({
          duration: -1, // 持续展示 toast
          message: "正在为您生成海报中"
        });
        if (!this.isNewTemplate) {
          this.imageArr.push(this.posterData.logo, this.posterData.thumb, this.posterData.qrcode);
        }
        //需要前端生成
        this.$nextTick(() => {
          if (this.isNewTemplate) {
            //新装修
            that.isQuestOK = false;
            that.loop();
          } else {
            // 旧装修
            that.onloadOldImg(that.imageArr, 0, 2);
          }
        });
      } else {
        //父组件已生成图片
        that.dataURL = that.defaultImg;
        this.$nextTick(() => {
          if (document.getElementById("goods_poster_thecanvas")) {
            console.log("========父组件已生成图片==========");
            document.getElementById("goods_poster_thecanvas").setAttribute("src", that.defaultImg);
          }
        });
      }
    },
    async loop() {
      let that = this;
      if (that.posterData.background.type == "background") {
        await that.onloadImg(that.posterData.background.src, -1);
      } else {
        that.base64Datas.push("");
      }
      for (let i = 0; i < that.posterData.poster_data.length; i++) {
        if (that.needRotate.indexOf(that.posterData.poster_data[i].type) > -1 && that.noNeedRotate.indexOf(that.posterData.poster_data[i].type) == -1) {
          console.log(that.posterData.poster_data[i].type);
          await that.onloadImg(that.posterData.poster_data[i].src, i);
        } else {
          that.base64Datas.push("");
        }
      }
      that.isQuestOK = true;
      setTimeout(() => {
        //(旧海报会员中心)循环批量生成二维码 qr_shop（推广二维码）、qr_app_share（app分享）接口返回链接，需要前端生成二维码(注释：新海报接口返回图片)
        that.posterData.poster_data.forEach(function(val, index) {
          if (val.type == "qr_shop" || val.type == "qr_app_share") {
            that.createEwmQrc(index, val.src);
          }
        });
      }, 80);
      console.log("===========开始画图============");
      that.$nextTick(() => {
        setTimeout(() => {
          that.saveImg();
        }, 1500);
      });
    },
    createEwmQrc(_index, _url) {
      let _ID = `ewmCanvas_${_index}`;
      QRCode.toCanvas(document.getElementById(_ID), _url, error => {
        if (error) {
          console.log(error);
        } else {
          console.log("success:地址转化二维码成功=======================");
        }
      });
    },
    saveImg() {
      this.dataURL = null;
      var content = document.getElementById("goods_poster_box");
      const that = this;
      // let scale = window.devicePixelRatio; //定义任意放大倍数 支持小数
      html2canvas(content, {
        dpi: 350, //加了一个这个设置
        useCORS: true,
        allowTaint: true, //允许跨域图片
        tainttest: true, //检测每张图片都已经加载完成
        // scale: scale, // 添加的scale 参数
        height: content.offsetHeight, //注意 下面解决当页面滚动之后生成图片出现白边问题
        width: content.offsetWidth,
        scrolly: 0,
        scrollx: 0,
        backgroundColor: null // 解决生成的图片有白边
      })
        .then(canvas => {
          that.dataURL = canvas.toDataURL("image/png"); //创建base64图片
          this.$nextTick(() => {
            if (document.getElementById("goods_poster_thecanvas")) {
              console.log("=============== 创建base64图片 ==========");
              document.getElementById("goods_poster_thecanvas").setAttribute("src", that.dataURL);
            }
          });
          that.toastPoster.clear();
          that.$emit("finish", that.dataURL);
        })
        .catch(error => {
          that.getError();
          console.log(error);
        });
    },
    onloadImg(data, i, type) {
      return new Promise((resolve, reject) => {
        //一定要设置为let，不然图片不显示
        let image = new Image();
        //解决跨域问题
        image.setAttribute("crossOrigin", "anonymous");

        let imageUrl = data;
        // let scale = window.devicePixelRatio; //定义任意放大倍数 支持小数
        image.src = `${imageUrl}?${Date.now()}`;
        let that = this;
        //image.onload为异步加载
        image.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          var context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);

          var quality = 0.8;
          //这里的dataurl就是base64类型
          var dataURL = canvas.toDataURL("image/png", quality); //使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
          that.base64Datas.push(dataURL);
          console.log("转换图片成功 =====success=====", i);

          resolve();
        };
        image.onerror = () => {
          that.base64Datas.push("");
          console.log("转换图片报错  ===== error ===", i);
          resolve();
          // that.getError()
        };
      });
    },
    //采用递归同步执行(旧装修)
    onloadOldImg(data, i, len) {
      //一定要设置为let，不然图片不显示
      let image = new Image();
      //解决跨域问题
      image.setAttribute("crossOrigin", "anonymous");

      let imageUrl = data[i];
      image.src = imageUrl;
      let that = this;
      //image.onload为异步加载
      image.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);

        var quality = 0.8;
        //这里的dataurl就是base64类型
        var dataURL = canvas.toDataURL("image/jpeg", quality); //使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
        //数组存放图片base64
        that.base64Datas.push(dataURL);

        //递归执行图片url转base64
        i = i + 1;
        if (i <= len) {
          that.onloadOldImg(data, i, len);
        } else {
          that.isQuestOK = true;
          setTimeout(() => {
            that.saveImg();
          }, 1000);
        }
      };
      image.onerror = () => {
        that.getError();
      };
    },

    getError() {
      let that = this;
      $http
        .get("goods.goods-poster.generate-goods-poster", { id: this.gid || that.$route.params.id }, "")
        .then(response => {
          that.toastPoster.clear();
          if (response.result == 1) {
            // document.getElementById('goods_poster_thecanvas').setAttribute('src', response.data.image_url)
            that.errorImg = response.data.image_url;
          } else {
            Toast("海报生成失败");
          }
        })
        .catch(error => {
          that.toastPoster.clear();
          console.log(error);
        });
    }
  },
  filters: {
    ellipsisFun: function(str, n) {
      // str： 被截取字符串；n：截取长度
      if (!str) return "";
      // value = value.toString();
      // return value.length > 30 ? value.substring(0, 33) + '...' : value;
      let len = 0;
      let tmpStr = "";
      for (let i = 0; i < str.length; i++) {
        // 遍历字符串
        if (/[\u4e00-\u9fa5]/.test(str[i])) {
          // 判断为中文  长度为三字节（可根据实际需求更换长度，将所加长度更改即可）
          len += 2;
        } else {
          // 其余则长度为一字节
          len += 1;
        }
        if (len > n) {
          // 当长度大于传入的截取长度时，退出循环
          console.log("标题长度大于传入的截取长度======");
          tmpStr = tmpStr + "...";
          break;
        } else {
          tmpStr += str[i]; // 将每个长度范围内的字节加入到新的字符串中
        }
      }
      return tmpStr; // 返回截取好的字符串
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.poster-popup-class {
  background-color: transparent !important;
}

#goods-poster-main {
  width: 20rem;
  height: 31.5rem;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;

  canvas {
    width: 100% !important;
    height: 100% !important;
  }

  .yz-goods-canvas {
    width: 100%;
    height: 100%;
  }

  .yz-goods {
    width: 20rem;
    height: 31.5rem;
    background-size: 100% 100%;
    background-position: bottom center;
    position: absolute;
    left: -120%;

    .ewm_bgImg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    .diy_poster_child {
      position: absolute;
      overflow: hidden; /* 超出部分隐藏 */
      p {
        width: 100%;
        text-align: left;
        overflow: hidden; /* 超出部分隐藏 */
        // text-overflow: ellipsis; /* 超出部分显示省略号 */
        // white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
    }

    .poster-top {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
      padding-top: 0.5rem;

      .logo {
        flex-shrink: 0;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        overflow: hidden;
        margin: 0;
      }

      .top-name {
        font-size: 0.875rem;
        color: #666;
        margin-left: 0.875rem;
      }
    }

    .poster-thumb {
      margin-bottom: 0.375rem;

      img {
        display: block;
        width: 16.875rem;
        height: 16.875rem;
        // object-fit: cover;
        margin: 0 auto;
      }
    }

    .poster-price {
      padding: 0 0.875rem;
      display: flex;
      align-items: flex-end;
      font-size: 1rem;
      color: #f15353;
      margin-bottom: 0.125rem;

      .poster-market-price {
        font-size: 0.75rem;
        color: #666;
        margin-left: 0.5rem;
        text-decoration: line-through;
      }
    }

    .poster-title {
      font-size: 1rem;
      line-height: 1.25rem;
      height: 2.5rem;
      color: #000;
      text-align: left;
      margin-bottom: 0.875rem;
      padding: 0 0.875rem;
    }

    .poster-bottom {
      padding: 0 0.875rem;
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: center;

      .poster-ewm {
        width: 5.5rem;
        height: 5.5rem;
        margin: 0;
      }
    }
  }
}
</style>
