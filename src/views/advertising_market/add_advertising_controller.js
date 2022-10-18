import cTitle from "components/title";
import { Toast } from 'vant';
import BScroll from "better-scroll";

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

export default {
  data() {
    return {
      store_cateGorys: [], // 分类
      show: false, // 余额提示
      show1: false, // 分类弹窗
      show2: false, // 区
      all: false, // 是否全选区
      streetShow: false,
      photosize: 1024 * 1024 * 4,
      district: district,
      select1: [], // 当前选择的市
      select2: [], // 当前选择的区
      result: [], // 分类
      result1: [], // 省
      result2: [], // 市
      result3: [], // 区
      uploadUrl: this.fun.getRealUrl(
        "plugin.advert-market.admin.upload.upload",
        {}
      ),
      imgUrl: "",
      videoUrl: "",
      showUploadBtn: false,
      uploadIng: false,
      formData: {
        advert_name: "",
        advert_type: "",
        advert_img: "",
        advert_budget: "",
        advert_code: [],
        await_amount: "",
        payment_amount: "",
        districts: [],
        store_categorys: []
      },
      balance: ""
    };
  },
  activated() {
    this.init();
    this.initBS();
    this.getClass();
    if (this.$route.params.id) {
      this.getEdit();
    }
  },
  methods: {
    init() {
      this.result = [];
      this.result3 = [];
    },
    unique(arr) {
      let map = new Map();
      let array = new Array(); // 数组用于返回结果
      for (let i = 0; i < arr.length; i++) {
        if (map.has(arr[i])) {
          // 如果有该key值
          map.set(arr[i], true);
        } else {
          map.set(arr[i], false); // 如果没有该key值
          array.push(arr[i]);
        }
      }
      return array;
    },
    getEdit() {
      $http
        .get(
          "plugin.advert-market.frontend.advert.getAdvertInfo",
          { advert_id: this.$route.params.id },
          ".."
        )
        .then(
          response => {
            if (response.result === 1) {
              this.formData = response.data.advert;

              if (this.formData.advert_type == 1) {
                this.imgUrl = this.formData.advert_img_url;
              } else {
                this.videoUrl = this.formData.advert_img_url;
              }

              // 编辑的时候如果是对象不能判断是否有重复的
              this.formData.store_category.map(item => {
                this.result.push(
                  JSON.stringify({
                    id: item.category_id,
                    name: item.has_one_store_category.name
                  })
                );
              });
              this.formData.districts.map(item => {
                this.result3.push(
                  JSON.stringify({
                    v: item.area_id,
                    n: item.address.areaname,
                    c: []
                  })
                );
              });
            } else {
              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    getClass() {
      $http
        .get("plugin.advert-market.frontend.advert.getStoreCategorys", {}, "..")
        .then(
          response => {
            if (response.result === 1) {
              this.store_cateGorys = response.data.store_cateGorys;
              this.balance = response.data.balance;
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    Sumbit() {
      if (this.$route.params.id) {
        this.formData.store_categorys = [];
        this.formData.districts = [];
      }

      this.result.map(item => {
        this.formData.store_categorys.push({ id: JSON.parse(item).id });
      });
      this.result3.map(item => {
        this.formData.districts.push({ id: JSON.parse(item).v });
      });

      this.formData.districts = this.unique(this.formData.districts);
      this.formData.store_categorys = this.unique(
        this.formData.store_categorys
      );

      if (this.$route.params.id) {
        let Data = {
          id: this.$route.params.id,
          advert_name: this.formData.advert_name,
          advert_type: this.formData.advert_type,
          advert_img: this.formData.advert_img,
          advert_budget: this.formData.advert_budget,
          advert_code: this.formData.advert_code,
          await_amount: this.formData.await_amount,
          payment_amount: this.formData.payment_amount,
          districts: this.formData.districts,
          store_categorys: this.formData.store_categorys
        };

        this.formData = Data;
      }

      $http
        .post(
          "plugin.advert-market.frontend.advert.subAdvert",
          { advert: this.formData },
          ".."
        )
        .then(
          response => {
            if (response.result === 1) {
              this.$dialog.alert({ message: response.msg}).then(()=>{
                this.$router.go(-1);
              });
            } else {

              Toast(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    Sure() {
      // console.log(this.result1, "result1");
      // console.log(this.result2, "result2");
      // console.log(this.result3, "result3");
      this.streetShow = false;
    },
    initBS() {
      if (!this.cartScroll) {
        this.cartScroll = new BScroll(this.$refs.cartWrapper, {
          click: true
        });
      } else {
        this.cartScroll.refresh();
      }
    },
    initBS1() {
      if (!this.cartScroll1) {
        this.cartScroll1 = new BScroll(this.$refs.cartWrapper1, {
          click: true
        });
      } else {
        this.cartScroll1.refresh();
      }
    },
    toggleAll() {
      this.$refs.checkboxGroup.toggleAll(!this.all);
    },
    seleItem(item, key) {
      if (this.result1.indexOf(item.v) < 0) {
        this.select1 = item.c;
        this.initBS1();
      } else {
        this.result3 = this.result3.filter(function(result) {
          return !result.slice(5).startsWith(item.v.toString().slice(0, 2));
        });
        this.result2 = this.result2.filter(function(result) {
          return !result.toString().startsWith(item.v.toString().slice(0, 2));
        });
      }
    },
    seleItem2(item, key) {
      if (this.result2.indexOf(item.v) < 0) {
        this.select2 = item.c;
        this.show2 = true;
        this.all = false;
      } else {
        this.result3 = this.result3.filter(function(result) {
          return !result.slice(5).startsWith(item.v.toString().slice(0, 4));
        });
      }
    },
    onphotosize2(e) {
      this.imgPreview(e.file, 2);
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
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            That.imgUrl = responseData.data.thumb_url;
            That.formData.advert_img = responseData.data.thumb;
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    play_Upload() {
      let v = this.$refs.video;
      v.play();
      this.showUploadBtn = false;
      this.uploadAudioM();
    },
    onReadVideo(e) {
      console.log(e);
      let that = this;
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;

      this.realVideo = files[0];

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
      if (this.fun.isIosOrAndroid() == "ios") {
        that.showUploadBtn = true;
      } else {
        this.getDuration();
      }
    },
    uploadAudioM() {
      //视频上传
      this.uploadIng = true;
      let that = this;
      let fd = new FormData();
      fd.append("file", this.realVideo); //进度百分比
      Toast.loading({
        message: '视频正在上传中',
        forbidClick: true,
      });
      axios
        .post(this.uploadUrl, fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          if (response.data.result === 1) {
            Toast.clear();
            that.videoPath = response.data.data.thumb_url;
            that.uploadIng = false;

            that.formData.advert_img = response.data.data.thumb;
          } else {
            that.uploadIng = false;
            Toast(response.data.msg);
          }
        })
        .catch(error => {
          that.uploadIng = false;
          console.log(error);
        });
    }
  },
  components: { cTitle }
};
