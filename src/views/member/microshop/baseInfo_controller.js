import cTitle from "components/title";
import { Toast } from 'vant';
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
export default {
  data() {
    return {
      photosize: 1024 * 1024 * 4, // 图片大小限制
      showInfo: true, // 控制左右的切换
      shopName: "",
      userName: "",
      signName: "",
      showBox: "main", // 控制主页，和不同弹出框的隐现
      changeType: "", // 用来标示修改的是哪个属性
      changeVal: "", // 用来存储用户输入的值
      imageUrl: "",
      imageUrl1: "", // 用来存储微店头像
      imageUrl2: "", // 用来存储用户头像
      bgImg: "",
      temp: false,
      bannerImg: "",
      postUrl: "",
      shopModle: {
        // shop_name: "",
        // shop_avatar: "",
        shop_background: "",
        signature: ""
      },
      shoplang: ""
    };
  },
  created() {
    let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
    if (mailLanguage.micro) {
      this.fun.setWXTitle(`${mailLanguage.micro.title}设置`);
    } else {
      this.fun.setWXTitle("微店设置");
    }
  },
  activated() {
    let mailLanguage = JSON.parse(localStorage.getItem("mailLanguage"));
    if (mailLanguage.micro) {
      this.fun.setWXTitle(`${mailLanguage.micro.title}设置`);
    } else {
      this.fun.setWXTitle("微店设置");
    }
    this.temp = this.$route.params.showSelectGood;
    this.showInfo = true;
    this.init();
    this.showBox = "main";
  },
  methods: {
    init() {
      let that = this;
      $http.get("plugin.micro.frontend.controllers.MicroShop.set-shop").then(
        function (response) {
          let temp = response.data.micro_shop;
          if (response.result == 1) {
            that.shopName = temp.shop_name;
            that.username = temp.has_one_member.nickname;
            that.signName = temp.signature;
            that.imageUrl1 = temp.shop_avatar;
            that.imageUrl2 = temp.has_one_member.avatar;
            that.postUrl = temp.api;
            that.bannerImg = response.data.select_goods_thumb;
            that.bgImg = temp.shop_background;
            // that.action = "http://localhost:8081" + response.data.api + "&type=" + that.fun.getTyep()
            that.action = response.data.api + "&type=" + that.fun.getTyep();
            that.shopModle.shop_background =
              response.data.micro_shop.shop_background;
            that.shopModle.signature = response.data.micro_shop.signature;
            that.shoplang = response.data.lang;
          } else {
            console.log(response);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    // 修改信息时候 用变量来标示修改的是哪个属性
    changeShowBox(val) {
      this.changeType = val;
      if (val == "店招背景") {
        this.showBox = "upLoadBox";
      } else if (val == "个性签名" || val == "微店名称" || val == "店主昵称") {
        this.showBox = "inputBox";
      } else {
        this.showBox = "main";
      }
    },

    // 控制基本信息和自选商品的切换
    changeActive(val, type) {
      if (type == 1) {
        // 提交数据
        let that = this;

        if (this.fun.isTextEmpty(this.shopModle.shop_background)) {
          Toast("微店背景不能为空");
          return;
        }

        if (this.fun.isTextEmpty(this.shopModle.signature)) {
          Toast("微店个性签名不能为空");
          return;
        }

        let json = { shop_set: JSON.stringify(this.shopModle) };
        $http
          .get(
            "plugin.micro.frontend.controllers.MicroShop.set-shop.edit",
            json,
            "设置中"
          )
          .then(
            function (response) {
              if (response.result === 1) {
                that.$router.go(-1);
              } else {
                Toast({
                  message: response.msg,
                  duration: 2500
                });
              }
            },
            function (response) {
              console.log(response);
            }
          );
      } else {
        this.showInfo = val;
      }
    },

    // 点击输入信息关闭的时候 把输入框输入的值按照修改的类型赋值给指定的属性即可完成修改
    closePopInput() {
      // 隐藏输入弹框
      this.showBox = "main";

      // 清空输入框内容
      this.changeVal = "";
    },

    // 处理头像上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (this.changeType == "微店头像") {
        this.imageUrl1 = res.data.img;
      } else if (this.changeType == "店招背景") {
        this.bgImg = res.data.img;
        this.shopModle.shop_background = this.bgImg;
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$notify("上传图片只能是 JPG 或PNG格式!");
      }
      if (!isLt2M) {
        this.$notify("上传图片大小不能超过 4MB!");
      }
      return isJPG && isLt2M;
    },

    // 管理微店
    manageShop() {
      this.$router.push(this.fun.getUrl("manage_shop", {}));
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
            canvas.toBlob(function (blob) {
              // 图片ajax上传
              if (callback === 1) {
                self.onRead(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    /*vant图片上传*/
    onRead(e, flag) {
      let fd = new FormData();
      if (flag === true) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }

      var That = this;
      axios
        .post(this.action, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            if (flag === true) {
              That.imageUrl = URL.createObjectURL(e);
            } else {
              That.imageUrl = URL.createObjectURL(e.file);
            }

            if (That.changeType == "微店头像") {
              That.imageUrl1 = responseData.data.img_url;
            } else if (That.changeType == "店招背景") {
              That.bgImg = responseData.data.img_url;
              That.shopModle.shop_background = That.bgImg;
            }
          }
          // this.img.push(res.data.imgpath)
        })
        .catch(error => {
          console.log(error);
        });
    },
    onphotosize(e) {
      this.imgPreview(e.file, 1);
      // this.$notify("上传图片大小不能超过 4MB!");
    }
  },
  components: { cTitle }
};
