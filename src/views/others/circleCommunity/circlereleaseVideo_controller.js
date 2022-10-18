import { Toast } from "vant";
import Request from "./libs/_request";

export default {
  data() {
    return {
      file: "",
      title: "",
      videoUrl: "",
      isVideo: true,
      images: [],
      realVideo: "",
      photosize: 1024 * 1024 * 2, // 图片大小限制
      coverUrl: "",
      duration: 0, //视频时长
      chooseGoods: [], //商品信息
      videoPath: "", //视频链接参数
      videoCover: "", //封面图片地址
      videoCoverPath: "", //封面路径参数
      limit: null, //视频限制时长
      uploadIng: false, //正在上传中
      videoProgress: 0,
      showOpen: false,
      showUploadBtn: false, //是否显示确认上传按钮引导用户上传（解决ios无法自动播放）
      isRirst: true, //避免重复上传
      ManualUploadImg: false, //手动上传封面
      isNeedGoods: true,
      circleId: null,
      selectGoods: false
    };
  },
  activated() {
    this.init();
    this.getList();
    this.getSet();
    if (!this.fun.isTextEmpty(JSON.parse(localStorage.getItem("shareVideoPath")))) {
      if (!this.fun.isTextEmpty(JSON.parse(localStorage.getItem("shareVideoPath")).title)) {
        this.title = JSON.parse(localStorage.getItem("shareVideoPath")).title;
      }
      if (!this.fun.isTextEmpty(JSON.parse(localStorage.getItem("shareVideoPath")).videoUrl)) {
        this.videoUrl = JSON.parse(localStorage.getItem("shareVideoPath")).videoUrl;
      }
      if (!this.fun.isTextEmpty(JSON.parse(localStorage.getItem("shareVideoPath")).videoUrl)) {
        this.videoPath = JSON.parse(localStorage.getItem("shareVideoPath")).videoPath;
      }
      if (!this.fun.isTextEmpty(JSON.parse(localStorage.getItem("shareVideoPath")).videoCover)) {
        this.videoCover = JSON.parse(localStorage.getItem("shareVideoPath")).videoCover;
        this.images[0] = this.videoCover;
      }
      if (!this.fun.isTextEmpty(JSON.parse(localStorage.getItem("shareVideoPath")).videoCoverPath)) {
        this.videoCoverPath = JSON.parse(localStorage.getItem("shareVideoPath")).videoCoverPath;
      }
      if (!this.fun.isTextEmpty(JSON.parse(localStorage.getItem("shareVideoPath")).file_name)) {
        this.file = JSON.parse(localStorage.getItem("shareVideoPath")).file_name;
      }
    }

    if (this.$route.query.goods_id !== undefined && this.$route.query.goods_id !== null) {
      this.getGoodsById();
    }
    if (this.$route.query.circle_id || this.$route.query.id) {
      this.circleId = parseInt(this.$route.query.circle_id || this.$route.query.id);
    }
  },
  mounted() {
    // this.autoPlayAudio2();
  },
  deactivated() {},
  methods: {
    init() {
      this.title = "";
      this.file = "";
      this.videoUrl = "";
      this.isVideo = true;
      this.coverUrl = "";
      this.duration = 0;
      this.chooseGoods = [];
      this.realVideo = "";
      this.videoPath = "";
      this.videoCover = "";
      this.images = [];
      this.showOpen = false;
      this.limit = null;
      this.uploadIng = false;
      this.showUploadBtn = false;
      this.isRirst = true;
      this.ManualUploadImg = false;
      this.selectGoods = false;
      document.getElementById("file").value = null;
    },
    getList() {
      Request.getSet().then(({ limit }) => {
        this.limit = limit ? Number(limit) : limit;
      });
    },
    getGoodsById() {
      $http
        .get("plugin.circle.frontend.circle-invitation.search-goods", {
          goods_id: this.$route.query.goods_id
        })
        .then(res => {
          if (res.result == 1) {
            console.log(res);
            this.chooseGoods = res.data.data;
            console.log(this.chooseGoods);
          } else {
            this.$dialog.alert({
              message: res.msg
            });
          }
        });
    },
    gotoAdd() {
      this.$router.push(this.fun.getUrl("circleVideogood", {}));
    },
    onReadVideo(e) {
      let that = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.realVideo = files[0];
      if (!(files[0].name.endsWith(".mp4") || files[0].name.endsWith(".MP4") || files[0].name.endsWith(".mov") || files[0].name.endsWith(".MOV"))) {
        that.$dialog.alert({
          message: "请上传MP4或MOV格式视频"
        });
        return;
      }
      this.videoUrl = null;
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(files[0]); //类型1
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(files[0]); //类型2
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(files[0]); //类型3
      }
      this.videoUrl = url;

      that.showUploadBtn = true;
      //自2020年04月28日起，用户打开微信内网页时将无法自动播放音频。
      // if (this.fun.isIosOrAndroid() == "ios") {
      //   that.showUploadBtn = true;
      // } else {
      //   this.getDuration();
      // }
    },
    play_Upload() {
      let v = this.$refs.video;
      v.play();
      this.showUploadBtn = false;
      this.getDuration();
    },
    getDuration() {
      //获取视频或者音频时长
      let that = this;
      let v = this.$refs.video;
      v.src = this.videoUrl;
      v.addEventListener("loadedmetadata", isDuration);

      function isDuration() {
        that.duration = v.duration;
        if (that.duration < 1) {
          that.videoUrl = null;
          that.$dialog.alert({
            message: "视频时长太短了！"
          });
          return;
        } else if (that.duration > Number(that.limit) + 1) {
          that.videoUrl = null;
          that.$dialog.alert({
            message: `视频时长不能超过${that.limit}秒`
          });
          return;
        } else {
          //调用设置视频封面
          that.setSrcAndCaptureImage();
          v.removeEventListener("loadedmetadata", isDuration);
          return;
        }
      }
    },
    //获取视频封面
    setSrcAndCaptureImage() {
      let that = this;
      let v = this.$refs.video;
      v.addEventListener("loadeddata", captureImage);

      function captureImage() {
        let scale = 1;
        let canvas = document.createElement("canvas");
        canvas.width = v.videoWidth * scale;
        canvas.height = v.videoHeight * scale;
        canvas.getContext("2d").drawImage(v, 0, 0, canvas.width, canvas.height);
        that.coverUrl = canvas.toDataURL("image/png");
        that.uploadAudioM(); //上传视频 --------------
        that.uploadImageM(); //上传封面 -----------------
        v.removeEventListener("loadeddata", captureImage);
      }
    },
    autoPlayAudio2() {
      let videos = this.$refs.video;
      videos.play();
      wx.config({
        // 配置信息, 即使不正确也能使用 wx.ready
        debug: false,
        appId: "",
        timestamp: 1,
        nonceStr: "",
        signature: "",
        jsApiList: []
      });
      wx.ready(function() {
        videos.play();
      });
    },
    BtnMethos() {
      let that = this;
      if (this.selectGoods && this.chooseGoods.length == 0) {
        //商品为空，则跳转到商品搜索页添加商品
        //本地保存标题、视频链接--------------
        let hasData = {
          title: that.title,
          videoPath: that.videoPath,
          videoUrl: that.videoUrl,
          videoCoverPath: that.videoCoverPath,
          videoCover: that.videoCover,
          file_name: that.file
        };
        localStorage.setItem("shareVideoPath", JSON.stringify(hasData));
        this.$router.replace(
          this.fun.getUrl(
            "circleVideogood",
            {},
            {
              circle_id: this.circleId,
              refresh: 1,
              to_home: 1
            }
          )
        );
      } else {
        //商品不为空，而且视频、标题已添加，则进行发布
        if (this.fun.isTextEmpty(this.title)) {
          Toast("请输入4-18个字标题");
          return;
        }
        if (this.title.length < 4) {
          this.$dialog.alert({
            message: "标题不小于4个字"
          });
          return;
        }
        if (this.fun.isTextEmpty(this.videoUrl)) {
          Toast("请选择视频进行上传！");
          return;
        }
        if (!this.isRirst) {
          return;
        }
        this.isRirst = false;
        let json = {
          goods_id: this.$route.query.goods_id,
          title: this.title,
          content: this.videoUrl,
          img: this.videoCoverPath,
          file_name: this.file,
          circle_id: this.circleId,
          invitation_status: 2,
          address: "",
          store_id: "",
          city: "",
          latitude: "",
          longitude: "",
          ylat: "",
          ylng: ""
        };
        $http.post("plugin.circle.frontend.circle-invitation.release", json).then(
          function(response) {
            that.isRirst = true;
            if (response.result === 1) {
              that.$dialog.alert({
                message: response.msg
              });
              localStorage.removeItem("shareVideoPath");
              that.$router.push(
                that.fun.getUrl(
                  "circleDetails",
                  {},
                  {
                    id: that.circleId,
                    refresh: 1,
                    to_home: 1,
                    tab:"video"
                  }
                )
              );
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            that.isRirst = true;
          }
        );
      }
    },
    uploadAudioM() {
      //视频上传
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      this.uploadIng = true;
      let that = this;
      let uploadAudio = this.fun.getRealUrl("plugin.circle.frontend.upload.uploadAudio", {});
      let fd = new FormData();
      fd.append("file", this.realVideo); //进度百分比

      // var config = {
      //   headers: { "Content-Type": "multipart/form-data" },
      //   onUploadProgress: progressEvent => {
      //     var complete =
      //       ((progressEvent.loaded / progressEvent.total) * 100) | 0;
      //     this.videoProgress = complete / 100;
      //     console.log("sssssssssssssss", this.videoProgress);
      //   }
      // };
      axios
        .post(uploadAudio, fd, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          Toast.clear();
          if (response.data.result == 1) {
            that.videoPath = response.data.data.audio;
            that.videoUrl = response.data.data.audio_url;
            that.file = response.data.data.file_name;
            //初始化vedio监听事件
            // that.removeListenVideo();
            //监听video
            // that.listenVideo();
            that.uploadIng = false;
            //本地保存标题、视频链接--------------
            let hasData = {
              title: that.title,
              videoPath: that.videoPath,
              videoUrl: response.data.data.audio_url,
              videoCoverPath: that.videoCoverPath,
              videoCover: that.videoCover,
              file_name: that.file
            };
            localStorage.setItem("shareVideoPath", JSON.stringify(hasData));
          } else {
            Toast({
              message: response.data.msg,
              duration: 2500
            });
            document.getElementById("file").value = null;
            that.videoUrl = null;
            that.uploadIng = false;
            that.videoUrl = null;
            that.videoCover = null;
            that.videoCoverPath = null;
            that.images = [];
            that.showUploadBtn = false;
            document.getElementById("file").value = null;
          }
        })
        .catch(error => {
          Toast.clear();
          that.uploadIng = false;
          document.getElementById("file").value = null;
          that.videoUrl = null;
          Toast(`error:${error}`);
        });
    },
    uploadImageM() {
      //图片上传
      if (this.ManualUploadImg) {
        return;
      }
      let that = this;
      let uploadImage = this.fun.getRealUrl("upload.uploadPic", {});
      let fd = new FormData();
      fd.append("file", this.dataURItoBlob(this.coverUrl));
      axios
        .post(uploadImage, fd, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          if (response.data.result == 1) {
            that.videoCover = response.data.data.img_url;
            that.videoCoverPath = response.data.data.img;
            that.images[0] = that.videoCover;
          } else {
            that.videoCover = null;
            that.videoCoverPath = null;
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          that.videoCover = null;
          that.videoCoverPath = null;
          Toast(error);
          console.log(error);
        });
    },
    dataURItoBlob(dataURI) {
      // 图片转成Buffer--
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
      return new Blob([ab], {
        type: mimeString
      });
    },
    removeImg() {
      this.videoCover = null;
      this.images = [];
    },
    /*vant图片上传*/
    onRead(e, flag) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      if (flag === true) {
        fd.append("file", e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      let that = this;
      let uploadImage = this.fun.getRealUrl("upload.uploadPic", {});
      axios
        .post(uploadImage, fd, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(response => {
          var responseData = response.data;
          that.ManualUploadImg = true;
          if (responseData.result === 1) {
            Toast.clear();
            that.videoCover = response.data.data.img_url;
            that.videoCoverPath = response.data.data.img;
            that.images[0] = that.videoCover;
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onPhotoSize(e) {
      this.imgPreview(e.file, 1);
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
            let _canvas = document.createElement("canvas");
            let _context = _canvas.getContext("2d");
            // canvas对图片进行缩放
            _canvas.width = targetWidth;
            _canvas.height = targetHeight;
            // 清除画布
            _context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            _context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob并上传
            _canvas.toBlob(function(blob) {
              // 图片ajax上传
              self.onRead(blob, true);
            }, file.type || "image/png");
          };
        };
      }
    },
    getSet() {
      $http.get("plugin.circle.frontend.circle.get-set").then(({ data }) => {
        this.selectGoods = Boolean(data["select_goods"]);
      });
    }
  },

  components: {}
};
