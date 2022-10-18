import cTitle from "components/title";
import { Toast } from "vant";

export default {
  data() {
    return {
      order_id: "",
      notsubmitted: true,
      applyModel: {
        realname: "",
        mobile: "",
        images: []
      },
      photosize: 1024 * 1024 * 8, // 图片大小限制,

      instroductionSelect: false,
      introductionShow: false,
      introduction: {},
      showImages: false,

      plugin: "picking-card"
    };
  },
  activated() {
    this.order_id = this.$route.params.order_id;
    this.init();
    this.checkStatus();
    this.getConfig();
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.plugin && this.$route.params.plugin == "one") {
        //#78882，提货卡一期独立的新插件picking-card-one
        this.plugin = "picking-card-one";
      }
      this.introductionShow = false;
      this.showImages = false;
      this.applyModel = {
        realname: "",
        mobile: "",
        images: []
      };
      this.notsubmitted = true;
    },
    getConfig() {
      let _api = "plugin.picking-card.frontend.pickingCard.getConfig";
      if (this.plugin == "picking-card-one") _api = "plugin.picking-card-one.frontend.pickingCard.getConfig";
      $http.get(_api, {}, "加载中...").then(response => {
        if (response.result === 1) {
          this.introduction = response.data;
        } else {
          console.log(response.msg);
        }
      });
    },
    checkStatus() {
      let _api = "plugin.picking-card.frontend.pickingCard.checkRefundStatus";
      if (this.plugin == "picking-card-one") _api = "plugin.picking-card-one.frontend.pickingCard.checkRefundStatus";
      $http.get(_api, { order_id: this.order_id }, "加载中...").then(response => {
        if (response.result === 1) {
          if (response.data === 0) {
            this.notsubmitted = false;
          } else {
            this.notsubmitted = true;
          }
        } else {
          this.notsubmitted = true;
          console.log(response.msg);
        }
      });
    },
    onSubmit(values) {
      console.log("submit", values);
    },
    showIntroduction() {
      this.introductionShow = true;
    },
    setApplyData() {
      if (this.fun.isTextEmpty(this.applyModel.realname)) {
        Toast("请填写真实姓名");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.mobile)) {
        Toast("请填写手机号码");
        return;
      }

      if (this.fun.isMoblie(this.applyModel.mobile)) {
        Toast("请输入正确的手机号");
        return;
      }

      if (this.applyModel.images.length < 3) {
        Toast("请上传三张凭证");
        return;
      }

      if (!this.instroductionSelect) {
        Toast("请勾选退款说明");
        return;
      }

      let json = {
        order_id: this.order_id,
        images: this.applyModel.images.join(","),
        realname: this.applyModel.realname,
        mobile: this.applyModel.mobile
      };
      let _api = "plugin.picking-card.frontend.pickingCard.postRefund";
      if (this.plugin == "picking-card-one") _api = "plugin.picking-card-one.frontend.pickingCard.postRefund";
      $http.post(_api, json, "提交中").then(
        response => {
          if (response.result === 1) {
            let _routerName = "pickUpCardOrderList";
            if (this.plugin == "picking-card-one") _routerName = "pickUpCardOrderListOne";
            this.$router.replace(this.fun.getUrl(_routerName));
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    onRead1(e, flag) {
      this.onRead(e, flag, 0);
    },
    onRead2(e, flag) {
      this.onRead(e, flag, 1);
    },
    onRead3(e, flag) {
      this.onRead(e, flag, 2);
    },
    onphotosize1(e) {
      this.imgPreview(e.file, 1, 0);
    },
    onphotosize2(e) {
      this.imgPreview(e.file, 1, 1);
    },
    onphotosize3(e) {
      this.imgPreview(e.file, 1, 2);
    },
    /*vant图片上传*/
    onRead(e, flag, num) {
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
      let That = this;
      let _api = "plugin.picking-card.frontend.pickingCard.upload";
      if (this.plugin == "picking-card-one") _api = "plugin.picking-card-one.frontend.pickingCard.upload";
      axios
        .post(this.fun.getRealUrl(_api), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            That.applyModel.images[num] = responseData.data.img;
            That.applyModel.images.reverse().reverse(); //改变原始数组从而更新数组
            Toast.clear();
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
    imgPreview(file, callback, num) {
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
            var maxWidth = 1024,
              maxHeight = 1024;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过1024x1024的限制
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
              if (callback === 1) {
                self.onRead(blob, true, num);
              }
            }, file.type || "image/png");
          };
        };
      }
    }
  },
  components: {
    cTitle
  }
};
