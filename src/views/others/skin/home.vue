<!-- 测试主页 -->
<template>
  <div id="skin_home">
    <c-title :hide="false" :text="diyName"></c-title>
    <div class="main">
      <div class="main-top">
        <van-uploader :after-read="onRead" :max-size="photosize" @oversize="onphotosize">
          <img src="../../../assets/images/skin/camera.png" alt="" />
        </van-uploader>
        <div class="h1">开始测肤</div>
        <div class="h3">看看您的皮肤状态怎么样？</div>
        <div class="uploadMask" v-show="treaty_data && (treaty_data.is_open == 1 || treaty_data.is_open == '1') && !checked" @click.stop="checkprotocol"></div>
      </div>
      <div class="main-agreement" v-if="treaty_data && (treaty_data.is_open == 1 || treaty_data.is_open == '1')">
        <van-checkbox v-model="checked" shape="square" checked-color="#fe5a73" icon-size="16px"></van-checkbox>
        <div style="margin-left: 0.75rem;" @click.stop="showAgreement = true">{{ treaty_data.name }}</div>
      </div>
      <div class="main-warn">
        <div class="warn-text">图片越清晰，测肤结果越准确~<br />拍照请务必关闭美颜功能哦~</div>
        <div class="warn-example" @click="showExample = true">查看图片示例</div>
      </div>
      <div class="main-bottom">
        <router-link :to="fun.getUrl('skinLog')" class="bottom-child" tag="div">我的测肤记录</router-link>
        <template v-if="isOpenRank">
          <router-link :to="fun.getUrl('skinRank')" class="bottom-child color2" tag="div">测肤排行榜</router-link>
        </template>
      </div>

      <!-- 示例 -->
      <van-popup v-model="showExample" closeable class="example-popup" round style="width: 80%;">
        <div class="example-title">1.点击开始测肤</div>
        <img src="../../../assets/images/skin/camera.png" alt="" />
        <div class="example-title">2.从您的图库里选择一张</div>
        <img src="../../../assets/images/skin/example.png" alt="" />
        <p class="example-text">建议使用后置摄像头、闭眼使用闪光灯拍照！</p>
      </van-popup>
      <!-- 协议 -->
      <van-popup v-model="showAgreement" round closeable class="agreement-popup" style="width: 80%;">
        <img src="../../../assets/images/skin/agreement.png" alt="" />
        <div class="h2">{{ treaty_data && treaty_data.name }}</div>
        <template v-if="treaty_data">
          <div class="agreement-popup-text" v-html="treaty_data.content"></div>
        </template>
      </van-popup>
      <!-- 温馨提示 -->
      <van-popup v-model="showTips" round class="tips-popup">
        <div class="h2">温馨提示</div>
        <div class="tips-popup-text1">{{ warnData.msg }}</div>
        <div class="tips-popup-text2">注：{{ warnData.data ? warnData.data.checkAuth : "" }}</div>
        <div class="tips-popup-btn" @click="showTips = false">确定</div>
      </van-popup>
      <van-popup v-model="showUpload" :overlay="false" position="bottom" class="upload-popup" style="height: 100vh;">
        <div class="img-animation">
          <img class="whirl" src="../../../assets/images/skin/upload.png" alt="" />
          <img class="upload-img" :src="preview" alt="" />
        </div>
        <div class="upload-popup-text" v-show="img_fize">
          图片大小{{ Number(img_fize / 1048576).toFixed(2) > 1 ? Number(img_fize / 1048576).toFixed(2) + "M" : Number(img_fize / 1024).toFixed(2) + "KB" }} ，预计时间{{
            parseInt(Number(img_fize / 1048576).toFixed(2) * 2.5) > 5 ? parseInt(Number(img_fize / 1048576).toFixed(2) * 2.5) : 5
          }}s，请稍等...
        </div>
        <div class="upload-popup-text" v-show="!img_fize">图片大小获取失败，预计时间 N s，请稍等...</div>
        <div class="upload-popup-text">肤质检测，已完成{{ percentage }}%</div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from "vant";
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
export default {
  data() {
    return {
      diyName: "肌肤测试",
      isOpenRank: false,
      checked: false,
      showExample: false,
      showAgreement: false,
      showTips: false,
      showUpload: false,
      img_fize: 0, //上传图片大小
      photosize: 1024 * 1024 * 8,
      percentage: 0, //上传进度
      img_url: null,
      preview: require("../../../assets/images/skin/example.png"),
      warnData: {}, //警告提示弹窗
      treaty_data: {},

      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  mounted() {
    this.getCheck();
  },
  components: { cTitle },
  computed: {},
  methods: {
    getCheck() {
      $http.get("plugin.skin-check.api.skin-check.index", {}, "...").then(
        response => {
          if (response.result === 1) {
            this.diyName = response.data.customizeName || "肌肤测试";
            this.fun.setWXTitle(this.diyName);
            this.treaty_data = response.data.set.treaty_data;
            this.isOpenRank = response.data.rank_list == "1" ? true : false;
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    getReport() {
      if (!this.img_url) {
        this.showUpload = false;
        this.preview = null;
        return this.$toast("图片链接错误，请重新上传");
      }
      $http.get("plugin.skin-check.api.skin-check.skin-check", { img: this.img_url, is_check: this.checked ? 1 : 0 }, "...").then(
        response => {
          if (response.result === 1) {
            this.$router.push(this.fun.getUrl("skinResult", { id: response.data.reportId }));
          } else {
            this.warnData = response;
            this.showUpload = false;
            Toast(response.msg);
            if (warnData.data.checkAuth) {
              this.showTips = true;
            }
          }
        },
        response => {}
      );
    },
    /*vant图片上传*/
    onRead_1(e, flag) {
      let fd = new FormData();

      if (flag === true) {
        try {
          this.preview = URL.createObjectURL(e);
        } catch (error) {
          console.log(error);
        }
        fd.append("file", e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
        this.img_fize = Number(e.size) || undefined;
      } else {
        try {
          this.preview = URL.createObjectURL(e.file);
        } catch (error) {
          console.log(error);
        }
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
        this.img_fize = Number(e.file.size) || undefined;
      }
      let that = this;
      fd.append("upload_type", "img");
      let uploadImage = this.fun.getRealUrl("upload.uploadPic", {});
      that.showUpload = true;
      axios
        .post(uploadImage, fd, {
          headers: { "Content-Type": "multipart/form-data" },
          processData: false,
          contentType: false,
          onUploadProgress(progressEvent) {
            if (progressEvent.lengthComputable) {
              let total = progressEvent.total + progressEvent.total * 0.09;
              that.percentage = Math.ceil((progressEvent.loaded / total) * 100);
            }
          }
        })
        .then(response => {
          if (response.status === 200 && response.data.result == 1) {
            console.log("上传成功");
            that.img_url = response.data.data.img_url;
            that.getReport();
          } else {
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    checkprotocol() {
      if (this.treaty_data.is_open == "1" && !this.checked) {
        Toast(`请勾选${this.treaty_data.name}`);
        return;
      }
    },
    onRead(e) {
      if (JSON.stringify(this.warnData) != "{}") {
        Toast(this.warnData.msg);
        return;
      }
      this.onRead_1(e);
      // this.imgPreview(e.file, 1)
    },
    onphotosize(e) {
      this.imgPreview(e.file, 1);
    },
    imgPreview(file, callback) {
      // let files = e.target.files || e.dataTransfer.files
      // let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      // Exif.getData(file, function() {
      //   Orientation = Exif.getTag(this, 'Orientation')
      //   console.log('Orientation=======', Exif.getTag(this, 'Orientation'), Exif.getAllTags(this))
      // })

      let self = this;
      // 判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成base64格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function() {
            // 图片原始尺寸
            let ratio = img.naturalWidth / img.naturalHeight; //  获取原图比例,为了等比压缩
            var originWidth = img.naturalWidth;
            var originHeight = originWidth / ratio;
            // 最大尺寸限制
            var maxWidth = 2500,
              maxHeight = 3500;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过400x400的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
              }
            }

            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);

            // if (Orientation != 0 || Orientation != 1) {
            //   context.translate(canvas.width / 2, canvas.height / 2)
            //   switch (Orientation) {
            //     case 8:
            //       Toast('旋转90度')
            //       context.rotate((-90 * Math.PI) / 180)
            //       // context.drawImage(img, -(canvas.height / 2), -(canvas.width / 2), canvas.height, canvas.width)
            //       break
            //     //旋转180度
            //     case 3:
            //       Toast('旋转180度')
            //       context.rotate((180 * Math.PI) / 180)
            //       // context.drawImage(img, -(canvas.width / 2), -(canvas.height / 2), canvas.width, canvas.height)
            //       break
            //     //旋转-90度
            //     case 6:
            //       Toast('旋转 - 90度')
            //       context.rotate((90 * Math.PI) / 180)
            //       // context.drawImage(img, -(canvas.height / 2), -(canvas.width / 2), canvas.height, canvas.width)
            //       break
            //     default:
            //       context.rotate((360 * Math.PI) / 180)
            //       break
            //   }
            //   context.translate(-(canvas.width / 2), -(canvas.height / 2))
            // }

            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // Toast('图片压缩')
            // canvas转为blob并上传
            canvas.toBlob(function(blob) {
              // 图片ajax上传
              if (callback === 1) {
                self.onRead_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#skin_home {
  min-height: calc(100vh - 50px);
  background-color: #fff;

  .main {
    font-size: 1rem;

    .main-top {
      width: 90%;
      margin: 1.875rem auto;
      background-color: #fff;
      box-shadow: 0 1px 12px 1px rgba(226, 226, 226, 0.95);
      border-radius: 0.375rem;
      color: #fe5a73;
      position: relative;

      img {
        width: 7.875rem;
        height: 7.875rem;
        margin: 1.25rem auto;
      }

      .h1 {
        font-size: 1.5rem;
        font-weight: bold;
        line-height: 1.875rem;
      }

      .h3 {
        line-height: 1.5rem;
        padding-bottom: 0.5rem;
      }

      .uploadMask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
    }

    .main-warn {
      .warn-text {
        color: #333;
        line-height: 1.5rem;
      }

      .warn-example {
        color: #fe5a73;
        font-size: 0.75rem;
        margin: 0.75rem 0 3rem;
      }
    }

    .main-bottom {
      color: #fff;

      .bottom-child {
        margin: 1rem auto 0;
        height: 2.375rem;
        line-height: 2.375rem;
        width: 12.75rem;
        border-radius: 2rem;
        overflow: hidden;
        background-color: #fe5a73;
        box-shadow: 0 1px 3px 0 #fe5a73;
      }

      .color2 {
        background-color: #fe9d56;
        box-shadow: 0 1px 3px 0 #e78740;
      }
    }

    .main-agreement {
      text-align: center;
      margin: 0 0 1rem 0;
      display: flex;
      justify-content: center;
      color: #999;
    }

    .example-popup {
      padding: 0 1rem;

      .example-title {
        color: #333;
        margin-top: 1rem;
        text-align: left;
      }

      img {
        width: 5.375rem;
        height: 5.375rem;
        margin-top: 1rem;
      }

      .example-text {
        font-size: 0.75rem;
        color: #666;
        margin: 1rem 0;
      }
    }

    .agreement-popup {
      padding: 1rem;

      img {
        width: 6.875rem;
        height: 5.625rem;
      }

      .h2 {
        font-size: 1rem;
        color: #161615;
        margin: 0.875rem 0;
      }

      .agreement-popup-text {
        text-align: left;
        color: #6e6e6e;
        font-size: 0.75rem;
        line-height: 1.25rem;
        max-height: 10rem;
        overflow-y: scroll;

        /deep/img {
          width: 100%;
        }
      }
    }

    .tips-popup {
      background: url(../../../assets/images/skin/tips.png);
      background-size: 100% 100%;
      width: 15.625rem;
      height: 11.875rem;
      color: #fff;
      padding: 0 0.875rem;

      .h2 {
        font-size: 1rem;
        padding: 2rem 0 1rem;
      }

      .tips-popup-text1 {
        font-size: 0.875rem;
        line-height: 1rem;
      }

      .tips-popup-text2 {
        font-size: 0.75rem;
        padding: 0.875rem 0;
      }

      .tips-popup-btn {
        width: 7.5rem;
        height: 1.875rem;
        line-height: 1.875rem;
        background-image: linear-gradient(#fe5a73, #fe5a73), linear-gradient(#ec8094, #ec8094);
        box-shadow: 0 0.125rem 0.25rem 0 rgba(165, 79, 25, 0.43);
        border-radius: 1rem;
        margin: 0 auto;
      }
    }

    .upload-popup {
      .img-animation {
        width: 9.375rem;
        height: 9.375rem;
        position: relative;
        margin: 4.625rem auto 1.625rem;

        .whirl {
          width: 9.375rem;
          height: 9.375rem;
          -webkit-animation: haha1 3s linear infinite;
        }

        .upload-img {
          position: absolute;
          width: 7.375rem;
          height: 7.375rem;
          top: 50%;
          left: 50%;
          margin-top: -3.6875rem;
          margin-left: -3.6875rem;
          border-radius: 100%;
          overflow: hidden;
        }

        @-webkit-keyframes haha1 {
          0% {
            -webkit-transform: rotate(0deg);
          }

          25% {
            -webkit-transform: rotate(90deg);
          }

          50% {
            -webkit-transform: rotate(180deg);
          }

          75% {
            -webkit-transform: rotate(270deg);
          }

          100% {
            -webkit-transform: rotate(360deg);
          }
        }
      }

      .upload-popup-text {
        color: #666;
        font-size: 0.875rem;
        line-height: 1.875rem;
      }
    }
  }
}
</style>
