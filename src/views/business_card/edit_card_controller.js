import cTitle from "components/title";
import { Toast } from "vant";
// import District from "../../gov_province_city_area_id"

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
export default {
  data() {
    return {
      isOldVoice: false,
      card_id: "",
      chooseItem: [],
      is_allow: 0,

      // 录音
      showStart: false,
      localId: "",
      serverId: "",
      downLoadId: "",
      time: 0,
      timer: null,
      playAudio: false,

      // 地址
      district: district, // 地址本地数据
      form: {
        status: 1,
        member_id: "",
        card_avatar: "",
        card_name: "",
        card_mobile: "",
        card_wechat: "",
        role_name: "",
        role_id: "", // 角色ID
        introduction: "", // 简介
        voice: "",
        province: "",
        city: "",
        district: "",
        street: "",
        address: "",
        picture: [],
        goods_id: [],
        addressName: "", // 地址区域
        streetName: "",
        company: ""
      },

      addressShow: false,

      strShow: false, // 街道显示
      streetShow: false, // 街道pop

      // 角色
      showRole: false,
      columns: [],
      role: {},

      // 图片
      photosize: 1024 * 1024 * 4,
      imageUrl: "",
      fileList2: []
    };
  },
  activated() {
    this.card_id = this.$route.params.card_id;
    this.playAudio = false;
    this.isOldVoice = false;
    // this.initShare();
    this.fun.wxShare(
      "",
      {},
      {
        title: "名片",
        imgUrl: this.form.card_avatar ? this.form.card_avatar : "",
        description: this.form.introduction ? this.form.introduction : ""
      }
    );
    this.getRole();
    this.getData();
  },
  mounted() {
    this.amr = null;
    // const that = this;

    this.loadDemoBtn1 = document.querySelector("#amr-load");
    this.loadAmrFile1 = document.querySelector("#amr-file");
    this.playBtn = document.querySelector("#amr-play");
    this.duration = document.querySelector("#amr-duration");
  },
  deactivated() {},
  methods: {
    isend() {
      this.playAudio = false;
    },
    reloadVoice() {
      this.isOldVoice = false;
    },
    end(blob) {
      const that = this;
      this.$refs.audios.src = URL.createObjectURL(blob);
      this.$refs.audios.onended = function() {
        that.playAudio = false;
      };
    },
    playAmr() {
      if (this.$refs.audios.paused) {
        this.playAudio = true;
        this.$refs.audios.play();
      } else {
        this.playAudio = false;
        this.$refs.audios.pause();
      }
    },
    initWithUrl(url) {
      const p = new Promise((resolve, reject) => {
        fetch(url, {
          method: "GET",
          responseType: "blob",
          headers: { "Content-Type": "application/octet-stream" },
          credentials: "include"
        })
          .then(response => {
            if (response.ok) {
              response.blob().then(function(blob) {
                console.log(blob);
                resolve(blob);
              });
            }
          })
          .catch(err => {
            reject(err);
          });
      });
      return p.then(blob => {
        return blob;
      });
    },
    loadDemoBtn(voice) {
      const that = this;
      // http://localhost:8081/addons/yun_shop/static/app/mario.amr
      // https://dev1.yunzshop.com/addons/yun_shop/storage/app/public/business_card/3f91e0ce6866d86639e81aab8f4951a2_5.amr
      that.initWithUrl(voice).then(data => {
        Recorder.amr2wav(
          data,
          function(blob) {
            that.end(blob);
            console.log("已转码成wav播放");
          },
          function(msg) {
            console.log("转码成wav失败：" + msg);
          }
        );
      });
    },
    gotoCardCenter(event) {
      let subStr = new RegExp("business_card/edit_card/" + this.card_id);
      let result = window.location.href.replace(subStr, "business_card/card_center");
      event.preventDefault();
      location.replace(result);
    },
    deleteGoods(id) {
      for (let i = 0; i < this.chooseItem.length; i++) {
        if (this.chooseItem[i].id == id) {
          this.chooseItem.splice(i, 1);
        }
      }
      window.localStorage.setItem("chooseItem", JSON.stringify(this.chooseItem));
    },
    setJSONData() {
      this.form.card_id = this.card_id;
      for (let i = 0; i < this.chooseItem.length; i++) {
        this.form.goods_id.push(this.chooseItem[i].id);
      }
      delete this.form.addressName;
      delete this.form.streetName;
      if (this.form.role_id != "1" && this.form.role_id != "2" && this.form.role_id != "3" && this.form.role_id != "6") {
        this.form.goods_id = [];
      }
    },
    saveData(event) {
      if (!this.form.card_name) {
        Toast("请输入姓名");
        return;
      }
      this.setJSONData();
      $http.post("plugin.business-card.frontend.controllers.card.card.edit", this.form).then(
        response => {
          if (response.result === 1) {
            window.localStorage.setItem("cardData", "");
            window.localStorage.setItem("chooseItem", "");
            let subStr = new RegExp("business_card/edit_card/" + this.card_id);
            let result = window.location.href.replace(subStr, "business_card/card_center");
            event.preventDefault();
            location.replace(result);
          } else {
            Toast(response.msg);
          }
        },
        response => {
          console.log(response);
        }
      );
    },
    getData() {
      $http.post("plugin.business-card.frontend.controllers.card.card.index", { card_id: this.card_id }, " ").then(
        response => {
          if (response.result === 1) {
            let data = response.data.card;
            this.is_allow = response.data.is_allow;
            if (this.fun.getKey("formCard")) {
              if (window.localStorage.getItem("cardData")) {
                this.form = JSON.parse(window.localStorage.getItem("cardData"));

                this.strShow = !this.fun.isTextEmpty(this.form.street);
                if (this.strShow) {
                  this.getStreet(this.form.district);
                }
              }

              if (window.localStorage.getItem("chooseItem")) {
                this.chooseItem = JSON.parse(window.localStorage.getItem("chooseItem"));
              }
            } else {
              this.form.status = data.status;
              this.form.member_id = data.member_id;
              this.form.card_avatar = data.card_avatar;
              this.form.card_name = data.card_name;
              this.form.card_mobile = data.card_mobile;
              this.form.card_wechat = data.card_wechat;
              this.form.role_name = data.role_name;
              this.form.role_id = data.role_id;
              this.form.introduction = data.introduction;
              // this.form.voice = data.voice
              this.form.company = data.company;
              // if (this.fun.isWeiXin() && this.form.voice) {
              //   this.isOldVoice = true
              //   this.loadDemoBtn(this.form.voice)
              // }
              if (data.areas[0]) {
                this.form.addressName = data.areas[0] + data.areas[1] + data.areas[2];
              }
              if (data.areas[3]) {
                this.form.streetName = data.areas[3];
              }
              this.form.province = data.area_id[0];
              this.form.city = data.area_id[1];
              this.form.district = data.area_id[2];
              this.form.street = data.area_id[3];
              this.form.address = data.address;
              if (data.area_id[2]) {
                this.getStreet(data.area_id[2]);
              }

              !data.picture ? (this.form.picture = []) : (this.form.picture = data.picture);
              this.chooseItem = response.data.card_goods;
              // 把选择的商品保存在本地
              window.localStorage.setItem("chooseItem", JSON.stringify(this.chooseItem));
            }
          } else {
            Toast(response.msg);
            this.$router.push(this.fun.getUrl("home"));
          }
        },
        function(response) {
          console.log(response);
        }
      );
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
      var That = this;
      axios
        .post(this.fun.getRealUrl("plugin.business-card.frontend.controllers.card.card.upload-local"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (flag === true) {
              That.imageUrl = URL.createObjectURL(e);
            } else {
              That.imageUrl = URL.createObjectURL(e.file);
            }
            That.form.card_avatar = responseData.data.img_url;
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
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();
      if (flag === true) {
        fd.append("file", e);
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            Toast.clear();
            if (flag === true) {
              That.fileList2.push({
                url: URL.createObjectURL(e)
              });
            } else {
              That.fileList2.push({
                url: URL.createObjectURL(e.file)
              });
            }
            That.form.picture.push(responseData.data.img_url);
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
    onphotosize(e) {
      this.imgPreview(e.file, 1);
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
    removeImg: function(delIndex) {
      this.form.picture.splice(delIndex, 1);
    },
    getRole() {
      $http
        .post("plugin.business-card.frontend.controllers.card.card.getRoles", {
          card_id: this.card_id
        })
        .then(
          response => {
            if (response.result === 1) {
              let arr = [];
              this.role = response.data;
              Object.keys(response.data).forEach(function(key) {
                arr.push(response.data[key]);
              });
              this.columns = arr;
            } // else {
            //}
          },
          function(response) {
            console.log(response);
          }
        );
    },
    onCancel() {
      this.showRole = false;
    },
    onConfirm(value, index) {
      const role = this.role;
      const that = this;
      this.form.role_name = value;
      Object.keys(role).forEach(function(key) {
        if (role[key] === value) {
          that.form.role_id = key;
          return key;
        }
      });
      this.showRole = false;
    },
    streetChoose() {
      if (this.fun.isTextEmpty(this.form.addressName)) {
        this.$dialog.alert({ message: "请先选择所在地区" });
      } else {
        this.streetShow = true;
      }
    },
    // 地址回调
    addressCallback(obj) {
      this.form.street = "";
      this.districtVal = "";
      this.form.addressName = obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.form.province = obj.itemValue1;
      this.form.city = obj.itemValue2;
      this.form.district = obj.itemValue3;
      this.getStreet(obj.itemValue3);
    },
    streetConfirm(item) {
      this.form.streetName = item.areaname;
      this.form.street = item.id;
      this.streetShow = false;
    },
    // 获取街道
    getStreet(param) {
      $http
        .get(
          "member.memberAddress.street",
          {
            district_id: param
          },
          " "
        )
        .then(response => {
          if (response.result === 1 && !this.fun.isTextEmpty(response.data)) {
            if (!this.fun.isTextEmpty(response.data) && response.data.length > 0) {
              this.districtVal = response.data;
              this.strShow = true;
            } else {
              this.strShow = false;
            }
          } else {
            this.strShow = false;
          }
        })
        .catch(error => {
          this.strShow = false;
          console.log(error);
        });
    },
    toChooseGood() {
      window.localStorage.setItem("cardData", JSON.stringify(this.form));
      this.$router.push(this.fun.getUrl("micro_shop_add_category", {}, { formCard: this.card_id }));
    },
    initShare() {
      let that = this;

      $http.post("member.member.wxJsSdkConfig", { url: this.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl }).then(
        function(response) {
          if (response.result === 1) {
            if (response.data.config) {
              if (response.data.config) {
                that.share(response.data);
              }
            }
          } // else {
          //}
        },
        function(response) {
          console.log(response);
        }
      );
    },
    // 组装分享设置
    share(data) {
      const that = this;
      wx.config(data.config);
      wx.ready(function() {
        let _title = "名片";
        let _link = that.fun.isIosOrAndroid() === "android" ? window.location.href : window.initUrl;
        let _imgUrl = that.form.card_avatar;
        let _desc = that.form.introduction;

        wx.showOptionMenu();
        wx.onMenuShareTimeline({
          title: _title, // 分享标题
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          success: function() {
            alert("分享成功");
          },
          cancel: function() {
            alert("取消分享");
          }
        });

        wx.onMenuShareAppMessage({
          title: _title, // 分享标题
          desc: _desc, // 分享描述
          link: _link, // 分享链接
          imgUrl: _imgUrl, // 分享图标
          type: "link", // 分享类型,music、video或link，不填默认为link
          dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            alert("分享成功");
          },
          cancel: function() {
            alert("取消分享");
          }
        });
      });
    },
    // 开始录音
    start(e) {
      let that = this;
      that.time = 0;
      this.showStart = true;
      wx.startRecord({
        success: function() {
          Toast("开始录音");
          that.timer = setInterval(() => {
            that.time++;
          }, 1000);
          that.vicoeEnd();
        },
        fail: function(error) {
          alert(JSON.stringify(error));
        },
        cancel: function() {
          alert("用户拒绝授权录音");
        }
      });
    },
    // 停止录音
    stop() {
      let that = this;
      this.showStart = false;
      // clearInterval(that.timer)
      wx.stopRecord({
        success: function(res) {
          Toast("录音已停止");
          clearInterval(that.timer);
          that.localId = res.localId;
          that.upVoice();
        },
        fail: function(error) {
          alert("暂停出错了");
          console.log(error);
        }
      });
    },
    // 取消录音
    cancel() {
      wx.stopRecord({
        success: res => {
          alert("取消录音");
        }
      });
    },
    // 60秒监听
    vicoeEnd() {
      let that = this;
      wx.onVoiceRecordEnd({
        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
        complete: function(res) {
          alert("超过60秒停止录音");
          that.localId = res.localId;
          clearInterval(that.timer);
          that.upVoice();
        }
      });
    },
    // // 播放
    play() {
      let that = this;
      console.log(that.localId);
      wx.playVoice({
        localId: that.localId // 需要播放的音频的本地ID，由stopRecord接口获得
      });
    },
    // // 暂停
    pausePlay() {
      let that = this;
      wx.pauseVoice({
        localId: that.localId // 需要暂停的音频的本地ID，由stopRecord接口获得
      });
    },
    // 上传语音
    upVoice() {
      let that = this;
      wx.uploadVoice({
        localId: that.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          that.serverId = res.serverId; // 返回音频的服务器端ID
          Toast.loading({
            message: "上传录音中",
            forbidClick: true
          });
          axios
            .post(
              that.fun.getRealUrl("plugin.business-card.frontend.controllers.card.card.get-voice"),
              { media_id: res.serverId },
              {
                headers: { "Content-Type": "application/json" }
              }
            )
            .then(response => {
              Toast.clear();
              let responseData = response.data;
              if (responseData.result === 1) {
                // alert(JSON.stringify(responseData.data))
                that.form.voice = responseData.data;
              } else {
                Toast(responseData.msg);
              }
            })
            .catch(error => {
              Toast.clear();
              console.log(error);
            });
        }
      });
    },
    // 下载语音
    downVoice() {
      let that = this;
      wx.downloadVoice({
        serverId: that.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
        isShowProgressTips: 1, // 默认为1，显示进度提示
        success: function(res) {
          that.downLoadId = res.localId; // 返回音频的本地ID
          console.log(res);
          console.log(that.downLoadId);
        }
      });
    }
  },
  components: { cTitle }
};
