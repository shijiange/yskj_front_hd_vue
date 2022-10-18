import { Toast } from 'vant';
import cTitle from "../../../components/title";

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

// let returnTag = false;
// var self = null;
export default {
  data() {
    return {
      o2o_status: 1,
      signature: "", //入驻说明
      apply: {
        electrician_card: '',
        realname: "",
        mobile: "",

        // 省市区 街道id
        province_id: "",
        city_id: "",
        district_id: "",
        street_id: "",
        address: "",

        id_card_front: "",
        id_card_side: "",
        remark: "",
      },

      imageUrl: "",
      uploadUrl: "",

      agreement: "",
      categoryShow: false,
      addressShow: false,
      streetShow: false,
      addressName: "",
      categoryName: "",
      //街道
      area: district,
      // 省，市，区,街道
      province: "",
      city: "",
      district: "",
      addressInfo: "",
      street: "",
      strShow: false,

      districtVal: [],
      agreementChoose: false,
      agreementShow: false,
      photosize: 1024 * 1024 * 5,

      status: "", // 申请后是否跳页面
      cservice: "", //客服链接
      selectImgIndex: null, //当前点击的图片上传索引，因为vant的上传图片参数name作为标识无效
      bannerImg: '', //顶部图片
      msgText: "",

      diyName: ""
    };
  },

  activated() {
    this.init();
    this.getData();
    // let myLocation = this.$store.state.o2oLocation;
    // if (myLocation.point) {
    //     console.log("有选择的地理信息", myLocation);
    //     let p = this.fun.bd_encrypt(myLocation.point.lng, myLocation.point.lat);
    //     this.apply.lng = p.lng;
    //     this.apply.lat = p.lat;
    //     this.addressInfo = myLocation.title;
    // } else {
    //     this.getLocation();
    // }
    // self = this;

  },
  mounted() {
    // this.getLocation()
  },
  methods: {
    init() {
      this.status = false;
      this.o2o_status = 1;
      this.apply.realname = "";
      this.apply.mobile = "";

      this.apply.lng = "";
      this.apply.lat = "";

      // 省市区 街道id
      this.apply.province_id = "";
      this.apply.city_id = "";
      this.apply.district_id = "";
      this.apply.street_id = "";

      this.apply.id_card_front = "";
      this.apply.id_card_side = "";
      this.apply.remark = "";
      this.apply.thumb = [];

      this.agreementChoose = false;
      this.selectImgIndex = null;
      this.otherImg = [];
      this.imageUrl = "";

      this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
      this.msgText = "";

      this.diyName = JSON.parse(window.localStorage.getItem("globalParameter")).assemble_worker_name || '';
    },
    // 获取数据
    getData() {
      let that = this;
      let json = {};
      let url;
      url = "plugin.assemble.Frontend.Modules.WorkerApply.Controllers.page";

      $http.get(url, json, "加载中...").then(
        function (response) {
          if (response.result === 1) {
            that.fun.setWXTitle(that.diyName + '申请');
            that.o2o_status = 1;
            that.o2o_info = response.data.agreement;
            that.bannerImg = response.data.banner;
          } else {
            that.o2o_status = 2;
            that.msgText = response.msg;
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },

    // 提交数据
    setApplyData() {
      // console.log(this.apply)
      if (this.fun.isTextEmpty(this.apply.realname)) {
        Toast("请填写真实姓名");
        return;
      }

      if (this.fun.isTextEmpty(this.apply.mobile)) {
        Toast("请填写手机号码");
        return;
      }

      if (this.fun.isMoblie(this.apply.mobile)) {
        Toast("请输入正确的手机号");
        return;
      }

      if (
        this.fun.isTextEmpty(this.apply.province_id) ||
        this.fun.isTextEmpty(this.apply.city_id) ||
        this.fun.isTextEmpty(this.apply.district_id)
      ) {
        Toast("请选择省市区");
        return;
      }

      if (this.fun.isTextEmpty(this.apply.street_id)) {
        Toast("请在后台系统-交易设置-开启街道地址");
        return;
      }

      if (this.fun.isTextEmpty(this.apply.id_card)) {
        Toast("请填写身份证号");
        return;
      }
      if (this.fun.isTextEmpty(this.apply.id_card_front)) {
        Toast("请上传身份证正面");
        return;
      }
      if (this.fun.isTextEmpty(this.apply.id_card_side)) {
        Toast("请上传身份证背面");
        return;
      }
      // if (
      //     this.fun.isTextEmpty(this.apply.lng) ||
      //     this.fun.isTextEmpty(this.apply.lat)
      // ) {
      //     Toast("经纬度不能为空");
      //     return;
      // }


      if (!this.agreementChoose) {
        Toast("请同意注册协议");
        return;
      }

      let that = this;
      let json = { apply: this.apply };
      let url = "plugin.assemble.Frontend.Modules.WorkerApply.Controllers.apply";
      $http.post(url, json, "提交中").then(
        response => {
          if (response.result === 1) {
            Toast(response.msg);
            that.getData();
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    // 去首页商城
    goToIndex() {
      this.$router.push(this.fun.getUrl("home"));
    },

    // 获取当前的经纬度
    getLocation() {
      let that = this;
      var mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000, // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0, // 定位结果缓存0毫秒，默认：0
          convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, // 显示定位按钮，默认：true
          buttonPosition: "LB", // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true, // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        mapObj.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete); // 返回定位信息
        AMap.event.addListener(geolocation, "error", onError); // 返回定位出错信息
      });

      function onComplete(obj) {
        // var res =
        //             "经纬度：" +
        //             obj.position +
        //             "\n精度范围：" +
        //             obj.accuracy +
        //             "米\n定位结果的来源：" +
        //             obj.location_type +
        //             "\n状态信息：" +
        //             obj.info +
        //             "\n地址：" +
        //             obj.formattedAddress +
        //             "\n地址信息：" +
        //             JSON.stringify(obj.addressComponent, null, 4);
        // alert(JSON.stringify(obj.addressComponent, null, 4))
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.addressInfo = obj.formattedAddress;
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city)
          ? obj.addressComponent.city
          : obj.addressComponent.province;
        let p = that.fun.bd_encrypt(that.point.lng, that.point.lat);
        console.log("水电费会计师", that.address, that.city);
        that.apply.lng = p.lng;
        that.apply.lat = p.lat;

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
      }

      function onError(obj) {
        console.log(obj);
      }
    },

    showCategory() {
      this.categoryShow = true;
    },

    // 地址回调
    addressCallback(obj) {
      // this.form.street = ""
      // this.districtVal = ""
      this.addressName =
        obj.itemName1 + " " + obj.itemName2 + " " + obj.itemName3;
      this.provice = obj.itemName1;
      this.city = obj.itemName2;
      this.district = obj.itemName3;

      console.log(obj.itemValue1, obj.itemValue2, obj.itemValue3);

      this.apply.province_id = obj.itemValue1;

      this.apply.city_id = obj.itemValue2;

      this.apply.district_id = obj.itemValue3;

      this.getStreet(obj.itemValue3);
    },

    streetConfirm(item) {
      this.street = item.areaname;
      this.apply.street_id = item.id;
      // console.log(this.apply.street_id)
      this.streetShow = false;
    },

    // 获取街道
    getStreet(param) {
      $http
        .get("member.memberAddress.street", { district_id: param })
        .then(response => {
          if (response.result === 1) {
            if (
              !this.fun.isTextEmpty(response.data) &&
              response.data.length > 0
            ) {
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
          console.log(error);
        });
    },

    // 获取门店图片上传路径
    getImgUpload() {
      $http
        .get("plugin.store-cashier.frontend.store.store.upload", {})
        .then(response => {
          if (response.result === 1) {
            this.storeImg = resposne.data.img;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    showAgreement() {
      this.agreementShow = true;
    },
    hideAgreement() {
      this.agreementShow = false;
    },

    onComplete(data) {
      this.apply.lng = data.position.getLng();
      this.apply.lat = data.position.getLat();
    },

    onError(error) {
      Toast(error.message);
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
              } else {
                self.onRead_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    selectIndex(i) {
      console.log(i);
      this.selectImgIndex = i;
    },
    /*vant图片上传*/
    onRead(e, flag) {
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      let fd = new FormData();

      if (flag === true) {
        fd.append("file", e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
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

            switch (That.selectImgIndex) {
            case 5:
              //身份证正面
              That.apply.id_card_front = responseData.data.img_url;
              break;
            case 6:
              //身份证反面
              That.apply.id_card_side = responseData.data.img_url;
              break;
            case 7:
              //身份证反面
              That.apply.electrician_card = responseData.data.img_url;
              break;
            default:
              return;
            }
          } else {
            Toast(responseData.msg);
            Toast.clear();
          }
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    onphotosize(e) {
      this.imgPreview(e.file, 1);
      // this.$notify('上传图片大小不能超过 2MB!')
    },
    onphotosize2(e) {
      this.imgPreview(e.file, 2);
    },

  },
  components: { cTitle }
};
