import cTitle from "components/title";
import { Toast } from "vant";
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
export default {
  data() {
    return {
      ratetextshow: ["极差", "失望", "一般", "满意", "惊喜"],
      ratetext: "惊喜",
      toi: this.fun.getKeyByI(),
      good: "",
      order_id: "",
      content: "",
      level: 5,
      order: "",
      comment: "", // 评论内容
      photosize: 1024 * 1024 * 2, // 图片大小限制,
      upNumMaxOther: "", // 图片数量
      uploadUrl: "",
      fileList3: [],
      fileList4: [],

      worker_score: 5, //安装师傅评价

      is_score_latitude: false, //评分纬度
      describeScore: 5, // 包装评分
      deliveryScore: 5, // 配送评分
      serviceScore: 5,// 服务评分
      is_crm:0,
      checked_confirm:false,
      checked_confirm_again:false,
      confirm_a:0,
      confirm_b:0
    };
  },
  methods: {
    getStar(value) {
      this.ratetext = this.ratetextshow[value - 1];
    },

    // 是否开启评分纬度
    getOtherScore() {
      $http.get("goods.comment.create-comment-page").then(res => {
        if (res.result == 1) {
          this.is_score_latitude = res.data.is_score_latitude;
        }
      });
    },

    getGoodDetail() {
      // 获取订单商品信息，该id为订单商品的id(不是商品id !!!)
      $http
        .get("goods.other-info.get-goods", { id: this.$route.params.id }, ".")
        .then(response => {
          if (response.result === 1) {
            this.good = response.data;
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    toComment(item) {
      if (this.comment.length == 0) {
        this.$dialog
          .confirm({ message: "您还没有输入相关的评论内容" })
          .then(() => {
            this.submitData(item);
          })
          .catch(() => {});
      } else {
        this.submitData(item);
      }
    },
    onphotosize(e) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          if (e[i].file.size > this.photosize) {
            console.log("图片超出大小", e[i]);
            this.imgPreview(e[i].file, 2);
          } else {
            this.onRead_2(e[i].file, true);
          }
        }
      } else {
        console.log("图片超出大小", e);
        this.imgPreview(e.file, 2);
      }
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
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
                // self.onRead_1(blob, true)
                self.multipleMethod_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    // 判断多图上传，循环onRead_1方法
    multipleMethod_1(e, flag) {
      if (e && e.length) {
        for (let i = 0; i < e.length; i++) {
          this.onRead_2(e[i], flag);
        }
      } else {
        this.onRead_2(e, flag);
      }
    },
    // vant 多其他图片上传
    onRead_2(e, flag) {
      if (flag !== true) {
        // if (e.file.size > this.photosize) {
        //   this.imgPreview(e.file, 3)
        //   return false
        // }
      }
      var That = this;
      let fd = new FormData();
      if (this.upNumMaxOther == 5 || this.upNumMaxOther >= 5) {
        this.$notify({
          background: "#fef0f0",
          message: "图片数量已达到上限",
          color: "#f56c6c"
        });
        return false;
      }
      if (flag === true) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      fd.append("attach", "upload");

      // 添加加载提示
      Toast.loading({
        message: " ",
        forbidClick: true
      });
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result == 1) {
            That.upNumMax++;
            That.fileList3.push(responseData.data.img);

            if (flag === true) {
              That.fileList4.push(URL.createObjectURL(e));
            } else {
              That.fileList4.push(URL.createObjectURL(e.file));
            }
            Toast.clear();
          } else {
            Toast(responseData.msg);
            Toast.clear();
          }
        })
        .catch(error => {
          console.log(error);
          Toast.clear();
        });
    },
    removeImg_1: function(delIndex) {
      this.fileList3.splice(delIndex, 1);
      this.fileList4.splice(delIndex, 1);
      this.upNumMaxOther = this.fileList3.length;
    },
    // 提交数据到服务器
    submitData(item) {
      var newArr2 = [];
      if (this.fileList3.length != 0) {
        for (var i = 0; i < this.fileList3.length; i++) {
          newArr2.push(this.fileList3[i]);
        }
      } else {
        newArr2 = [];
      }
      newArr2 = JSON.stringify(newArr2);
      let json = {
        order_id: this.order_id,
        goods_id: item.goods_id,
        order_goods_id: this.good.id,
        content: this.comment,
        level: this.level,
        images: newArr2,
        i: this.fun.getKeyByI(),
        type: this.fun.getTyep()
      };
      if (this.good.is_install) {
        json.worker_score = this.worker_score;
      }
      // 纬度评分 （包装， 配送，服务）
      if (this.is_score_latitude) {
        json.score_latitude = {
          score_latitude_describe: this.describeScore,
          score_latitude_delivery: this.deliveryScore,
          score_latitude_service: this.serviceScore
        };
      }
      if(this.$route.query.ysi) json.ysi = this.$route.query.ysi;//益生crm待编辑
      if(this.is_crm){
          if(!this.checked_confirm){
            Toast("请勾选第一条授权协议");
            this.confirm_a=0;
            return;
          }else{
            this.confirm_a=1;
            json.confirm_a=1;
          }
          //console.log(this.checked_confirm_again);
          if(!this.checked_confirm_again){
            Toast("请勾选第二条授权协议");
            this.confirm_b=0;
            return;
          }else{
            this.confirm_b=1;
            json.confirm_b=1;
          }
        }
        zhuge.track('评价编辑页面-点击提交评论',{
          '订单号':this.$route.query.order_sn,
          '商品名称':this.good.title,
          '商品id':this.good.goods_id,
          '商品数量':this.good.total,
          '商品价格':this.good.price,
          '评分':this.level,
          '描述|包装':this.describeScore,
          '物流服务|配送':this.deliveryScore,
          '服务态度|质量':this.serviceScore,
          '评论字数':this.comment.length
        });
        $http.post("goods.comment.create-comment", json).then(
          response => {
            if (response.result == 1) {
              zhuge.track('评价编辑页面-提交评论成功',{
                '订单号':this.$route.query.order_sn,
                '商品名称':this.good.title,
                '商品id':this.good.goods_id,
                '商品数量':this.good.total,
                '商品价格':this.good.price,
                '评分':this.level,
                '描述|包装':this.describeScore,
                '物流服务|配送':this.deliveryScore,
                '服务态度|质量':this.serviceScore,
                '评论字数':this.comment.length
              });
              if (this.$route.query.ysi) {
                // 代编辑用户保存-记录
                this.saveYsiLog();
              }
              this.$dialog.alert({ message: response.msg }).then(() => {
                this.$router.go(-1);
              });
            } else {
              this.$dialog.alert({ message: response.msg });
            }
          },
          function(response) {
            // error callback
          }
        );

    },
    saveYsiLog() {
      $http
        .get("plugin.ys-system.frontend.help-edit.save-log", { h_id: this.$route.query.ysi }, ".")
        .then(response => {
          if (response.result == 0) {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getYSEdit() {
      $http
        .get("plugin.ys-system.frontend.help-edit.get-goods-comment", { h_id: this.$route.query.ysi }, ".")
        .then(response => {
          if (response.result === 1) {
            this.comment = response.data.content || "";
            this.fileList4 = response.data.images || [];
            this.fileList3 = response.data.images.slice(0) || []; //深拷贝
            this.level = response.data.level || 5;
            if (response.data.score_latitude) {
              this.describeScore = response.data.score_latitude.score_latitude_describe;
              this.deliveryScore = response.data.score_latitude.score_latitude_delivery;
              this.serviceScore = response.data.score_latitude.score_latitude_service;
            }
          } else {
            this.$toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  activated() {
    this.comment = "";
    this.toi = this.fun.getKeyByI();
    this.order_id = this.$route.params.order_id;
    this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
    this.getGoodDetail();
    this.getOtherScore();
    if (this.$route.query.ysi) {
      // 益生二开，获取后台编辑好的数据
      this.getYSEdit();
      this.is_crm = 1;
    }
    
    setTimeout(() => {
      //console.log(this.$route.query.order_sn);
      zhuge.track('进入评价编辑页面',{
        '订单号':this.$route.query.order_sn,
        '商品名称':this.good.title,
        '商品id':this.good.goods_id,
        '商品数量':this.good.total,
        '商品价格':this.good.price
      });
   }, 2000);
  },
  components: { cTitle }
};
