import { Toast } from "vant";
export const posterMixin = {
  data() {
    return {
      // 海报
      poster: "",
      poster_Data: {
        poster_data: null,
        background: {}
      },
      poster_id: null, //海报id
      posterShow: false,
      isNewPosterPlugin: false, //是否为新海报插件
      toastPoster: null,
    };
  },
  methods: {
    // 海报
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
    },
    openQrCode(e) {
      this.getPoster(e);
    },
    openQrCode_old(e) {
      if (!this.poster) {
        if (!this.timer) {
          this.getPoster_oldApi(e);
          this.timer = setInterval(() => {
            this.getPoster_oldApi(e);
          }, 3000);
        } else {
          // this.$refs.hook.style.display = e;
        }
      } else {
        // this.$refs.hook.style.display = e;
        clearInterval(this.timer);
        this.toastPoster.clear();
      }
    },
    getPoster_oldApi(e) {
      $http.get("member.poster").then(
        response => {
          if (response.result === 1) {
            this.poster = response.data.image_url;
            // this.$refs.hook.style.display = e;
            if (this.poster && this.timer) {
              this.posterShow = true;
              clearInterval(this.timer);
              if (this.toastPoster) {
                this.toastPoster.clear();
              }
            }
          } else {
            Toast(response.msg);
            if (this.timer) {
              this.posterShow = true;
              clearInterval(this.timer);
              if (this.toastPoster) {
                this.toastPoster.clear();
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
              this.toastPoster.clear();
            }
          }
        }
      );
    },
    getPoster(e) {
      if (!this.fun.isTextEmpty(this.poster_Data.poster_data) || !this.fun.isTextEmpty(this.poster)) {
        this.posterShow = true;
        // this.$refs.hook.style.display = e;
        return;
      }
      let that = this;
      $http.get("member.qrcode.get-poster", {}, {}).then(
        response => {
          if (response.result === 1) {
            this.isNewPosterPlugin = response.data.new || false;
            if (response.data.center_show == 0) {
              //0 返回的默认图片
              that.poster = response.data.image_url;
              that.posterShow = true;
            } else if (response.data.center_show == 1) {
              //前端生成
              that.poster_Data.background.src = response.data.background_url || response.data.background;
              that.poster_Data.background.type = "background";
              that.poster_Data.poster_data = response.data.style_data;
              that.poster_id = response.data.id;
              that.posterShow = true;
              // that.$nextTick(() => {
              //   that.forCreateEwm();
              // });
            } else if (response.data.center_show == 2) {
              //部分关注二维码不支持跨域，走老接口
              that.toastPoster = Toast({
                duration: -1, // 持续展示 toast
                message: "正在为您生成海报中"
              });
              that.openQrCode_old(e);
            }
            // this.$refs.hook.style.display = 'block';
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response.msg);
          if (this.timer) {
            clearInterval(this.timer);
            if (this.toastPoster) {
              this.toastPoster.clear();
            }
          }
        }
      );
    },
  },
};