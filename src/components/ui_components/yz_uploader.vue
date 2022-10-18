<!--上传图片组件-->
<!--demo: <yz_uploader v-model="fileList1"></yz_uploader>-->
<template>
  <div>
    <div class="imgUploader" :style="{ 'background-color': boxSelect ? boxSelect : '#fff', padding: customPadding=='none' ? '' : '0.8rem' }">
      <template v-for="(val, index) in fileList1">
        <div class="photoBox" :key="index" :style="styles">
          <img :src="val" style="width: 100%;" @click="showimg(index)" />
          <i @click="removeImg(index)"></i>
        </div>
      </template>
      <div @click="chooseImage" v-if="checkedImg && fileList1.length < max_count" class="wxchooseImg" :style="styles">
        <van-icon name="photograph" />
      </div>
      <van-image-preview v-model="show" :images="fileList1" :start-position="imgIndex"> </van-image-preview>
      <template v-if="!checkedImg && fileList1.length < max_count">
        <van-uploader :after-read="multipleMethod_1"  multiple :style="styles">
          <template v-if="!isCustomStyle">
            <van-icon name="photograph" />
          </template>
          <template v-else>
            <!-- 自定义按钮名称 -->
            <slot></slot>
          </template>
        </van-uploader>
        <div class="customText" v-if="customText && fileList1.length == 0">{{customText}}</div>
      </template>
      <div class="size-text-box" v-if="size_text">{{ size_text }}</div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  props: {
    customText: {
      type: String,
      default:""
    },
    boxSelect: {
      type: String,
      default: ""
    },
    customPadding: {
      type: String,
      default: ""
    },
    min_count: {
      type: Number,
      default: 1
    },
    //最多选多少张
    max_count: {
      type: Number,
      default: 100
    },
    photosize: {
      type: Number,
      default: 1024 * 1024 * 30
    },
    isCustomStyle: {
      type: Boolean, //自定义上传样式
      default: false
    },
    styles: {
      type: Object,
      default: () => ({})
    },
    size_text: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false,
      fileList1: [], //相册路径链接
      fileList2: [],
      imgIndex: 1, //相册图片预览起始位置
      checkedImg: false //true为开启微信相册
    };
  },
  mounted() {
    // this.ImgBtnMethob();//注释原因，上传接口做了后缀验证，微信相册的返回的是base64，上传报错提示
  },
  created(){
    console.log("-------------------------1111111111-------------------");
  },
  methods: {
    initData() {
      this.show = false;
      this.fileList1 = [];
      this.fileList2 = [];
      this.imgIndex = 1;
    },
    setFileList1(arr){
      this.fileList1 = JSON.parse(JSON.stringify(arr));
    },
    ImgBtnMethob() {
      // this.checkedImg = false;
      if (this.fun.isWeiXin() && this.fun.getPhoneEnv() == "2" && localStorage.getItem("isWxLogin") == 1) {
        // if (this.fun.isWeiXin()) {
        //当前使用环境为安卓机的微信app下，即使用微信SDK提供的接口调用微信相册实现图片多选上传功能（注：微信官方一次最多只能9张）
        //因ios与h5自身通过设置input属性为multiple可实现多选，暂无调用微信接口上传
        this.checkedImg = true;
      } else {
        this.checkedImg = false;
      }
    },
    //弃用微信接口原因：当选择微信原图上传时微信还是会进行压缩(任务编号: 33970又改了回来。。。)
    // 相关问题链接：https://developers.weixin.qq.com/community/develop/doc/00088493fb47182c6e27b681b54c00
    chooseImage() {
      let that = this;
      let wxChooseNum = this.max_count - this.fileList1.length;
      wx.chooseImage({
        count: wxChooseNum, // 默认9
        sizeType: ["original"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有
        success: function (req) {
          var localIds = req.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          for (let j = 0; j < localIds.length; j++) {
            wx.getLocalImgData({
              localId: req.localIds[j].toString(),
              success: function (res) {
                const localData = res.localData;
                let imageBase64 = "";
                if (localData.indexOf("data:image") == 0) {
                  //苹果的直接赋值，默认生成'data:image/jpeg;base64,'的头部拼接
                  imageBase64 = localData;
                } else {
                  //此处是安卓中的唯一得坑！在拼接前需要对localData进行换行符的全局替换
                  //此时一个正常的base64图片路径就完美生成赋值到img的src中了
                  imageBase64 = "data:image/jpeg;base64," + localData.replace(/\n/g, "");
                }
                that.onRead_1(imageBase64);
              },
              fail(res) {
                console.log("getLocalImgData::error", res);
              }
            });
          }
        },
        fail(res) {
          Toast("调起微信选择图片失败，请再次点击进行上传");
          that.checkedImg = false;
          console.log("chooseImage::error", res);
        }
      });
    },
    dataURItoBlob(dataURI) {
      // 图片转成Buffer---------------------------------
      let byteString = atob(dataURI.split(",")[1]);
      let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      let ab = new ArrayBuffer(byteString.length);
      let ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    // 判断多图上传，循环onRead_1方法
    multipleMethod_1(e, flag) {
      let isSlice = this.fileList1.length + e.length - this.max_count;
      // console.log(isSlice);
      let _data = e;
      if (isSlice > 0) {
        _data.splice(-isSlice, isSlice);

        this.$dialog.alert({ message: `(＞﹏＜)哎呦，您不小心选多了${isSlice}张！` });
      }

      if (_data && _data.length) {
        for (let i = 0; i < _data.length; i++) {
          this.onRead_1(_data[i], flag);
        }
      } else {
        this.onRead_1(_data, flag);
      }
    },
    // vant 多图片上传
    onRead_1(e, flag) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      if (this.checkedImg) {
        fd.append("file", this.dataURItoBlob(e));
      } else {
        if (flag === true) {
          fd.append("file", e);
        } else {
          fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
        }
      }
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          let responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (!this.checkedImg) {
              if (flag === true) {
                this.fileList2.push({
                  url: URL.createObjectURL(e)
                });
                
              } else {
                this.fileList2.push({
                  url: URL.createObjectURL(e.file)
                });
                this.$emit("imgFileEvent", e.file);
              }
            }
            this.fileList1.push(responseData.data.img_url);
            this.$emit("input", this.fileList1);
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    showimg(ind) {
      this.imgIndex = ind;
      this.show = true;
    },
    removeImg: function (delIndex) {
      this.fileList1.splice(delIndex, 1);
      this.$emit("input", this.fileList1);
      return this.fileList1;
    },
    onphotosize(e) {
      this.imgPreview(e.file, 2);
      // this.$notify('上传图片大小不能超过 2MB!')
    },
    imgPreview(file, callback) {
      let self = this;
      // 判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成base64格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制
            var maxWidth = 400,
              maxHeight = 400;
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
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob并上传
            canvas.toBlob(function (blob) {
              // 图片ajax上传
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
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
.customText {
  font-size: 0.69rem;
  display: flex;
  align-items: flex-end;
  color: #f14e4e;
}

.imgUploader {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  // padding: 0.8rem;

  .photoBox {
    position: relative;
    width: 4.5rem;
    height: 4.5rem;
    border: 1px dashed #c0ccda;
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    margin-bottom: 0.2rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    i {
      width: 1.2rem;
      height: 1.2rem;
      position: absolute;
      top: 0.1rem;
      right: 0.1rem;
      background: url("../../assets/images/close_iocn.png");
      background-size: 100%;
    }
  }

  /deep/ .van-uploader__input-wrapper {
    text-align: center;
    // display: flex;
    // align-items: center;
    // justify-content: center;
  }

  .van-uploader,
  .wxchooseImg {
    width: 4.5rem;
    height: 4.5rem;
    overflow: hidden;
    background: #f3f3f3;
    border: 1px dashed #c0ccda;
    margin-left: 0.2rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;

    .van-icon {
      font-size: 24px;
      line-height: 4.5rem;
      color: #666;
      display: flex;
      justify-content: center;
    }
  }

  .size-text-box {
    display: flex;
    flex-direction: column-reverse;
    margin-bottom: 0.5rem;
    color: #333;
    font-size: 10px;
  }
}
</style>
