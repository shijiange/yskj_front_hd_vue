import cTitle from "components/title";
import { Toast } from 'vant';
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

export default {
  data() {
    return {
      imagesList: [],
      order_info: {
        has_one_order_project: {},
        has_one_worker: {},
        has_one_store: {}
      },
      comment: {},
      photosize: 1024 * 1024 * 4,
      imgIndex: 1, //相册图片预览起始位置
      show: false, //图片预览
      applyModel: {
        order_service_id: 0,
        content: "",
        store_level: 5,
        project_level: 5,
        worker_level: 5,
        images: []
      },
      applyMoreModel: {
        content: "",
        images: []
      }
    };
  },
  activated() {
    this.applyModel.order_service_id = this.$route.params.service_id;
    this.getData();
  },
  computed: {
    appointmentLang() {
      if(this.$store.state.shopLanguage.appointment) {
        return this.$store.state.shopLanguage.appointment;
      }else {
        return {worker: "技师", project: "项目", service: "服务"};
      }
    },
  },
  methods: {
    getData() {
      $http
        .get(
          "plugin.appointment.frontend.comment.get-comment-by-order-service-id",
          { order_service_id: this.applyModel.order_service_id },
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.order_info = response.data.order_info;
            this.comment = response.data.comment;
            if (!this.comment) {
              this.comment = {};
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    makeEvaluate() {
      this.applyModel.images = JSON.stringify(this.imagesList);
      $http
        .get(
          "plugin.appointment.frontend.comment.create-comment",
          this.applyModel,
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.imagesList = [];
            this.$dialog.alert({ message: response.msg})
              .then(() => {
             
                this.$router.go(-1);
              }).catch(() => {});
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });

    },
    makeMoreEvaluate() {
      this.applyMoreModel.id = this.comment.id;
      this.applyMoreModel.images = JSON.stringify(this.imagesList);
      $http
        .post(
          "plugin.appointment.frontend.comment.append-comment",
          this.applyMoreModel,
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.imagesList = [];
            this.applyMoreModel = {
              content: "",
              images: []
            };
            
            this.$dialog.alert({ message: response.msg})
              .then(() => {
             
                this.$router.go(-1);
              }).catch(() => {});
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });

    },
    showimg(ind) {
      this.imgIndex = ind;
      this.show = true;
    },
    onphotosize(e) {
      this.imgPreview(e.file, 2);
    },
    // 判断多图上传，循环onRead_1方法
    multipleMethod_1(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_1(e[i], flag);
        }
      } else {
        this.onRead_1(e, flag);
      }
    },
    // vant 多图片上传
    onRead_1(e, flag) {
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      let fd = new FormData();
      if (flag === true) {
        fd.append("file", e);
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
            Toast.clear();
            That.imagesList.push(responseData.data.img_url);
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
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
                targetHeight = Math.round(
                  maxWidth * (originHeight / originWidth)
                );
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(
                  maxHeight * (originWidth / originHeight)
                );
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
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
                self.onRead_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    removeImg: function(delIndex) {
      this.applyModel.images.splice(delIndex, 1);
    }
  },
  components: { cTitle }
};
