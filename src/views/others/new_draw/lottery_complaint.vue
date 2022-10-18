<!-- 抽奖投诉 -->
<template>
  <div id="lottery_complaint">
    <c-title :hide="false" text="抽奖投诉"></c-title>
    <div class="title">投诉原因</div>
    <van-field v-model="reason" rows="5" autosize type="textarea" placeholder="请描述投诉的内容" />
    <div class="line"></div>
    <div class="title">上传图片</div>
    <div class="send-btn" @click="send" v-show="!sendStatus">提交</div>
    <van-uploader v-model="fileList" multiple :after-read="onRead" @delete="ondelete" />
  </div>
</template>

<script>
import { Toast } from "vant";

export default {
  data() {
    return {
      reason: "",
      photosize: 1024 * 1024 * 3,
      fileList: [],
      imgList: [],
      sendStatus: false
    };
  },

  // activated: {},

  components: {},

  computed: {},
  deactivated() {
    // 重置data数据
    Object.assign(this.$data, this.$options.data());
  },

  methods: {
    send() {
      if (this.fun.isTextEmpty(this.reason)) {
        Toast("请描述投诉的内容");
        return;
      }
      if (this.sendStatus) {
        return;
      }
      this.sendStatus = true;
      $http
        .post("plugin.luck-draw.frontend.index.complaint", { activity_id: this.$route.params.id, reason: this.reason, image: this.imgList }, "")
        .then(res => {
          if (res.result == 1) {
            this.sendStatus = false;
            Toast(res.msg);
            if (window.history.length <= 1) {
              this.$router.push(this.fun.getUrl("home", {}));
            } else {
              this.$router.go(-1);
            }
          } else {
            this.sendStatus = false;
            Toast(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /*vant图片上传*/
    onRead(e, flag) {
      e.status = "uploading";
      e.message = "上传中...";
      let fd = new FormData();

      if (flag === true) {
        fd.append("file", e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      let uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
      axios
        .post(uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            e.status = "done ";
            That.imgList.push(responseData.data.img_url);
            console.log(That.imgList);
          } else {
            Toast(responseData.msg);
            e.status = "failed";
            e.message = "上传失败";
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    ondelete(e, detail) {
      this.imgList.splice(detail.index, 1);
    },
    onphotosize(e) {
      this.imgPreview(e.file, 1);
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
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function() {
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
            canvas.toBlob(function(blob) {
              // 图片ajax上传
              self.onRead(blob, true);
            }, file.type || "image/png");
          };
        };
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#lottery_complaint {
  padding: 0 12px 40px;
  background: #fff;

  .title {
    line-height: 36px;
    text-align: left;
    font-weight: 700;
    font-size: 12px;
    color: #000;
  }

  .line {
    width: 100%;
    height: 1px;
    background: #f1f1f1;
    margin: 1rem 0;
  }

  .send-btn {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    margin-left: -10rem;
    width: 20rem;
    height: 2.5rem;
    line-height: 2.5rem;
    background-color: #f14e4e;
    border-radius: 1.375rem;
    font-size: 18px;
    color: #fff;
  }

  .van-cell {
    background: #f1f1f1;
  }

  .van-uploader {
    display: flex;
  }
}
</style>
