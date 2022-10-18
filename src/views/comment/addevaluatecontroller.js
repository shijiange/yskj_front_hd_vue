import cTitle from "components/title";
import { Toast } from "vant";
export default {
  data() {
    return {
      toi: this.fun.getKeyByI(),
      value: 3,
      //评论内容
      comment: "",
      //追加评价
      reComment: "",
      good: "",
      comment_id: "",
      item: "",

      photosize: 1024 * 1024 * 2, // 图片大小限制,
      upNumMaxOther: "", // 图片数量
      uploadUrl: "",
      fileList3: [],
      fileList4: []
    };
  },
  methods: {
    toReComment() {
      var that = this;
      if (this.reComment.length == 0) {
        that.$dialog
          .confirm({ message: "您还没有输入相关的评论内容" })
          .then(() => {
            that.submitData();
          })
          .catch(() => {});
      } else {
        that.submitData();
      }
    },
    //提交数据到服务器
    submitData() {
      var that = this;
      let newArr2 = [];
      if (that.fileList3.length != 0) {
        newArr2 = that.fileList3.map(item => item.url);
      }
      $http
        .post("goods.comment.append-comment", {
          id: this.item.id,
          order_goods_id: this.order_goods_id,
          content: this.reComment,
          images: JSON.stringify(newArr2),
          i: this.fun.getKeyByI(),
          type: this.fun.getTyep()
        })
        .then(
          function(response) {
            if (response.result == 1) {
              that.$dialog.alert({ message: response.msg }).then(() => {
                that.$router.go(-1);
              });
            } else {
              that.$dialog.alert({ message: response.msg });
            }
          },
          function(response) {
            // error callback
          }
        );
    },

    removeImg_1: function(delIndex) {
      this.fileList3.splice(delIndex, 1);
      this.fileList4.splice(delIndex, 1);
      this.upNumMaxOther = this.fileList3.length;
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
            That.fileList3.push({
              url: responseData.data.img
            });
            console.log(That.fileList3);

            if (flag === true) {
              That.fileList4.push({
                url: URL.createObjectURL(e)
              });
            } else {
              That.fileList4.push({
                url: URL.createObjectURL(e.file)
              });
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

    getNetData() {
      $http
        .post("goods.comment.append-comment-page", {
          goods_id: this.goods_id,
          order_id: this.order_id,
          order_goods_id: this.order_goods_id
        })
        .then(response => {
          console.log(response);
          if (response.result !== 1) {
            return this.$toast(response.msg);
          }
          this.item = response.data.comment;
          this.value = this.item.level;
          this.comment = this.item.content;
        });
    }
  },
  activated() {
    this.good = this.$route.params.item;
    this.toi = this.fun.getKeyByI();
    this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});

    if (!this.good) {
      this.$router.go(-1);
      return;
    }
    this.goods_id = this.good.goods_id;
    this.order_id = this.$route.params.order_id;
    this.order_goods_id = this.good.id;
    this.getNetData();
  },

  components: { cTitle }
};
