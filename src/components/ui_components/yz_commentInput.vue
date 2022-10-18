<!-- 评论弹窗组件 支持上传图片 -->
<template>
  <div id="yz_commentInput">
    <van-popup v-model="showCommentInput" position="bottom" class="yz_commentInput-main" :style="{}" @closed="closedPopup">
      <slot></slot>
      <div class="commentInput-slot-style" v-if="options.type && (options.type == 'reply' || options.type == 'childReply')">
        回复<span class="selcolor">@{{ options.replyName || "---" }}：</span>{{ options.content || "" }}
      </div>
      <div class="replyMainComment">
        <div class="left">
          <van-field v-model="maincomment" ref="commentInput" rows="1" autosize type="textarea" :placeholder="prop_placeholder" />
          <div class="comment-imgs">
            <van-uploader ref="uploaderImgs" v-model="fileList" multiple :after-read="multipleMethod_1" @delete="ondelete" />
          </div>
        </div>
        <div class="right" @click="subMainBtn" :class="[this.fun.isTextEmpty(maincomment) && this.fun.isTextEmpty(imgList) ? 'blank-color' : '']">发送</div>
      </div>
      <div class="operate-boxs" v-if="openImg">
        <div class="operate-btn" @click.stop="uploaderFun">
          <i class="iconfont icon-ht_basis_singlepic"></i>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  model: {
    prop: "showCommentInput",
    event: "onEmit"
  },
  props: {
    //弹窗是否显示，默认不显示
    showCommentInput: {
      type: Boolean,
      default: false
    },
    openImg: {
      type: Boolean,
      default: true
    },
    options: { type: Object, default: () => ({}) },
    detailsData:{},
    replyName:"",
    zhugeid:""
  },
  data() {
    return {
      fileList: [],
      photosize: 1024 * 1024 * 3,
      imgList: [],
      maincomment: "",
      prop_placeholder: "请留下你的精彩评论吧"
    };
  },
  watch: {
    showCommentInput: function(newV, oldV) {
      if (newV) {
        this.initData();
        if (this.options.placeholder) {
          this.prop_placeholder = this.options.placeholder;
        }
      }
    }
  },
  methods: {
    initData() {
      this.maincomment = "";
      this.fileList = [];
      this.imgList = [];
      this.$nextTick(() => {
        this.$refs.commentInput.focus();
      });
    },
    subMainBtn() {
      if (this.fun.isTextEmpty(this.maincomment) && this.fun.isTextEmpty(this.imgList)) {
        Toast("不能发送空白信息");
        return;
      }
      let _json = {
        text: this.maincomment,
        imgs: this.imgList
      };
      //诸葛统计需要变量
      let commentTypeZhuge = '发表评论';
      let replyNameZhuge ='';
      if (this.options) {
        _json.options = this.options;
        if(this.options.type == 'reply'|| this.options.type == 'childReply'){
          commentTypeZhuge = '回复评论';
          replyNameZhuge =this.replyName;
        }  
      }
      this.$emit("onEmit", false);
      this.$emit("confirm", _json);
      //console.log(this.zhugeid);
      zhuge.track('社区帖子详情-点击发送评论',{
        '帖子标题':this.detailsData.title,
        '帖子id':this.detailsData.id,
        '发布人':this.detailsData.has_one_stick_user.nickname,
        '发布人id':this.detailsData.has_one_stick_user.uid,
        '发布日期':this.detailsData.created_at,
        '评论字数':this.maincomment.length,
        '评论类型':commentTypeZhuge,
        '回复评论人名称':replyNameZhuge,
        '回复评论人id':this.zhugeid
      });
    },
    closedPopup() {
      this.$emit("onEmit", false);
    },
    uploaderFun() {
      this.$refs.uploaderImgs.chooseFile();
    },
    // 判断多图上传，循环onRead_1方法
    multipleMethod_1(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead(e[i], flag);
        }
      } else {
        this.onRead(e, flag);
      }
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
  },
  // mounted: {},
  // activated: {},
  components: {},
  computed: {}
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#yz_commentInput {
  .commentInput-slot-style {
    height: 1.5rem;
    line-height: 2rem;
    text-align: left;
    padding-left: 0.875rem;

    .selcolor {
      color: #1c96fe;
    }
  }

  .replyMainComment {
    display: flex;
    padding-top: 0.8rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
    align-items: center;
    justify-content: space-between;

    .left {
      width: 18.13rem;
      background-color: #f5f5f5;
      border-radius: 0.5rem;
      padding: 0.5rem;

      /deep/.van-cell {
        background: transparent;
        padding: 0;
      }

      /deep/.van-field__control {
        max-height: 10rem;
      }

      .comment-imgs {
        display: flex;
        flex-wrap: wrap;

        /deep/.van-uploader__preview-image {
          width: 3rem;
          height: 3rem;
        }

        /deep/.van-uploader__upload {
          width: 3rem;
          height: 3rem;
          display: none;
        }

        /deep/.van-uploader__preview {
          margin: 8px 8px 0 0;
        }
      }
    }

    .right {
      // width: 3rem;
      flex: 1;
      margin: 0 0.5rem;
      height: 1.88rem;
      font-size: 0.94rem;
      line-height: 1.88rem;
      color: #0072e8;
    }

    .blank-color {
      color: #999;
    }
  }

  .operate-boxs {
    display: flex;
    padding: 0 1rem 0.5rem;

    .operate-btn {
      margin-right: 0.5rem;

      i {
        font-size: 20px;
      }
    }
  }
}
</style>
