import cTitle from "components/title";
import { Toast, Popup as VanPopup, Image as VanImage, Icon as VanIcon } from "vant";
import { getSet } from "./libs/_request";
export default {
  data() {
    return {
      radio: "1",
      agree: false,
      is_toll: 0, //是否收费
      category_id: "", //分类id
      name: "", //圈子名字
      price: "", //费用
      bg_img: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/circleMoRenBg.png", //背景图
      circle_img: "https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/circleMoRenFace.png", //头像
      synopsis: "", //简介
      // 上传图片
      photosize: 1024 * 1024 * 3,
      // 分类选择
      show: false,
      actions: [],
      cateName: "请选择分类",
      protocolshow: false,
      circleProtocol: ""
    };
  },
  activated() {
    this.getUserControl();
  },
  mounted() {
    this.getCateList();
  },
  methods: {
    getCateList() {
      $http.get("plugin.circle.frontend.circle.get-category-list").then(res => {
        this.actions = [];
        res.data.forEach(item => {
          this.actions.push({
            name: item.name,
            id: item.id
          });
        });
      });
    },
    // 提交
    createCircle() {
      if (!this.agree) {
        Toast("请先阅读并同意《用户协议》");
        return;
      }
      let params = {
        is_toll: this.is_toll,
        category_id: this.category_id,
        name: this.name,
        price: this.price || 0,
        bg_img: this.bg_img,
        circle_img: this.circle_img,
        synopsis: this.synopsis
      };
      $http
        .get("plugin.circle.frontend.circle.create-circle", params, "")
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
            } else {
              Toast("提交成功！");
              this.$router.push(this.fun.getUrl("circleIndex"));
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    // 分类选择
    onSelect(item) {
      this.show = false;
      this.category_id = item.id;
      this.cateName = item.name;
    },
    // 背景图片上传
    onRead(params) {
      return file => {
        let fd = new FormData();
        fd.append("file", file.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
        let uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
        axios
          .post(uploadUrl, fd, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          .then(res => {
            let reader = new FileReader();
            // 将图片转成base64格式
            reader.readAsDataURL(file.file);
            // 读取成功后的回调
            reader.onloadend = e => {
              let result = e.target.result;
              if (params) {
                this.heamImgUrl = result;
                if (res.data.data.img_url) {
                  this.circle_img = res.data.data.img_url;
                }
              } else {
                this.imgUrl = result;
                this.bg_img = res.data.data.img_url;
              }
            };
          });
      };
    },
    // 上传之后限制大小
    onphotosize(e) {
      this.imgPreview(e.file, 1);
      // this.$notify('上传图片大小不能超过 2MB!')
    },
    // 上传照片处理
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
    },
    async getUserControl() {
      let set = await getSet();
      this.circleProtocol = set.circle_control;
      this.bg_img = set.logo_pic;
    }
  },
  components: {
    cTitle,
    VanPopup,
    VanImage,
    VanIcon
  }
};
