import { Toast } from 'vant';
import cTitle from "../../../components/title";

// import District from "src/gov_province_city_area_id";

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");

// const IS_SUPPLIER = 3; // 已经成为，无需再申请
// const REPEAT_APPLY = 2; // 已经提交申请，等待审核。
// const VISIT_SUCCESS = 1; // 访问成功

// var returnTag = false;
var self = null;
export default {
  data() {
    return {
      optionsId: '',
      show1: false,
      service_QRcode: '',
      service_mobile: '',
      o2o_status: 1,
      pass_safe: 0,
      fileList1: [],
      fileList2: [],
      fileList3: [], //其他图片
      fileList2E: "",
      idCardImg_0: "",
      idCardImg_1: "",
      signature: "",
      applyModel: {
        password: "",
        realname: "",
        mobile: "",
        // store名字
        storeName: "",
        lng: "",
        lat: "",
        beginTime: "",
        endTime: "",
        categoryId: "",
        // 省市区 街道id
        provinceId: "",
        cityId: "",
        districtId: "",
        streetId: "",
        address: "",
        // 门店图片src
        storeImg: "",
        // 资质图片src
        aptitudeImg: [],
        information_thumb: [],

        remark: "",

        starRated: "",
        bannerImg: "",
        storeIntroduce: "",
        idCardImg: [],
        otherImg: []
      },
      aptitudeImgurl: "",
      imageUrl: "",
      uploadUrl: "",

      categoryList: [],

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

      photosize: 1024 * 1024 * 6,

      is_hotel: false,

      star_level: "",

      levelName: "",

      levelShow: false,

      star_arr: [
        { name: "二星及以下/经济型", value: 2 },
        { name: "三星/舒适", value: 3 },
        { name: "四星/高档", value: 4 },
        { name: "五星/豪华", value: 5 },
        { name: "六星", value: 6 },
        { name: "七星", value: 7 },
        { name: "八星", value: 8 },
        { name: "不限", value: 0 }
      ],
      hotelTitleType: "",
      goods_id: "", // 商品id
      status: "", // 申请后是否跳页面
      cservice: "", //客服链接
      selectImgIndex: null, //当前点击的图片上传索引，因为vant的上传图片参数name作为标识无效
      bannerImg: null, //顶部图片
      stopButton: false,

      is_business_license:0,//营业执照是否必填
      startTimeTag:false,
      beginTime:'00:00',
      endTimeTag:false,
      endTime:'00:00',

      shop_commission: false,//是否开启平台提成
    };
  },

  activated() {
    this.init();
    this.isToGoos();
    this.getData();
    this.getCategory();
    this.getCustomizeHotelHead();
    // this.getImgUpload()
    let storeModel = this.$store.state.applyModel;
    if (JSON.stringify(storeModel) != "{}") {
      this.applyModel = JSON.parse(storeModel);
    }
    // let myLocation = this.$store.state.o2oLocation;
    // if (myLocation.point) {
    //   let p = this.fun.bd_encrypt(myLocation.point.lng, myLocation.point.lat);
    //   this.applyModel.lng = p.lng;
    //   this.applyModel.lat = p.lat;
    //   this.addressInfo = myLocation.title;
    // } else {
    //   this.getLocation();
    // }
    this.fun.getLocation()
      .then((res) => {
        let p = this.fun.bd_encrypt(res.point.lng, res.point.lat);
        this.applyModel.lng = p.lng;
        this.applyModel.lat = p.lat;
        this.addressInfo = res.title;
      })
      .catch((err) => {
        console.log(err);
      });
    self = this;
  },
  mounted() {
    // this.getLocation()
  },
  watch: {
    "applyModel.password"(newname, oldname) {
      if (this.pass_safe != 1) {
        return;
      }
      this.msgText = this.checkStrong(newname);
      if (this.msgText == 3) {
        // document.getElementById("tips").style.color = "#00D1B2";
        document.getElementById("tips").style.display = "none";
      } else {
        document.getElementById("tips").style.display = "#D33047";
        document.getElementById("tips").style.display = "inline-block";
      }
    }
  },

  methods: {
    checkStrong(sValue) {
      let modes = 0;
      //正则表达式验证符合要求的
      if (sValue.length < 1) return modes;
      if (/\d/.test(sValue)) modes++; //数字
      if (/[a-z]/.test(sValue)) modes++; //小写
      if (/[A-Z]/.test(sValue)) modes++; //大写
      // if (/\W/.test(sValue)) modes++; //特殊字符

      //逻辑处理
      switch (modes) {
      case 1:
        modes = 1;
        break;
      case 2:
        modes =  2;
        break;
      case 3:
        modes =  sValue.length < 8 ? 2 : 3;
        break;
      }
      return modes;
    },
    // 获取酒店自定义字段
    getCustomizeHotelHead() {
      var isQuestHotel = localStorage.getItem("customizeHotelHead");
      if (!this.fun.isTextEmpty(isQuestHotel)) {
        this.hotelTitleType = JSON.parse(
          localStorage.getItem("customizeHotelHead")
        ).hotels;
      } else {
        $http
          .get(
            "plugin.hotel.frontend.hotel.get-hotel-info.get-custom-name",
            {},
            "加载中..."
          )
          .then(response => {
            if (response.result == 1) {
              this.hotelTitleType = response.data.hotels;
              localStorage.setItem(
                "customizeHotelHead",
                JSON.stringify(response.data)
              );
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    init() {
      this.stopButton = false;
      this.status = false;
      this.o2o_status = 1;
      this.pass_safe = 0;
      this.fileList1 = [];
      this.fileList2 = [];
      this.fileList2E = "";
      this.idCardImg_0 = "";
      this.idCardImg_1 = "";
      this.applyModel.username = "";
      this.applyModel.password = "";
      this.applyModel.realname = "";
      this.applyModel.mobile = "";

      this.applyModel.storeName = "";
      this.applyModel.lng = "";
      this.applyModel.lat = "";
      this.applyModel.beginTime = "00:00";
      this.applyModel.endTime = "00:00";
      this.applyModel.categoryId = "";
      // 省市区 街道id
      this.applyModel.provinceId = "";
      this.applyModel.cityId = "";
      this.applyModel.districtId = "";
      this.applyModel.streetId = "";
      // 门店图片src
      this.applyModel.storeImg = "";
      // 资质图片src
      this.applyModel.aptitudeImg = [];
      this.aptitudeImgurl = "";
      this.applyModel.information_thumb = [];
      this.applyModel.idCardImg = [];
      this.applyModel.remark = "";
      this.applyModel.storeIntroduce = "";
      this.applyModel.bannerImg = "";

      this.agreementChoose = false;
      this.selectImgIndex = null;
      this.otherImg = [];
      this.fileList3 = [];
      this.service_mobile = '';
      this.service_QRcode = '';
      this.show1 = false;
      this.cservice = "";
      if (this.$route.name == "hotelApply") {
        // console.log(this.$route.name == "hotelApply");
        this.is_hotel = true;
        this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
      } else {
        this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
      }
    },
    // 获取数据
    getData() {
      let that = this;
      let json = {};
      let url;
      if (this.$route.name == "hotelApply") {
        url = "plugin.hotel.frontend.hotel.hotel.verify-apply-status";
      } else {
        url = "plugin.store-cashier.frontend.store.store.verify-apply-status";
      }

      $http.get(url, json, "加载中...").then(
        function (response) {
          if (response.result === 1) {
            that.shop_commission = response.data.shop_commission == 1 ? true : false;
            that.o2o_status = response.data.status;
            that.o2o_info = response.data.agreement;
            that.pass_safe = response.data.safe;
            if(response.data.status == -1){
              if(Object.values((response.data.last_info).length > 0)) {
                that.applyModel.realname = response.data.last_info.realname;
                that.applyModel.mobile = response.data.last_info.mobile;
                that.applyModel.username = response.data.last_info.username;
                that.applyModel.storeName = response.data.last_info.information.store_name;
                that.beginTime = response.data.last_info.information.business_hours_start;
                that.applyModel.beginTime = response.data.last_info.information.business_hours_start;
                that.endTime = response.data.last_info.information.business_hours_end;
                that.applyModel.endTime = response.data.last_info.information.business_hours_end;
                that.applyModel.storeImg =  response.data.last_info.information.thumb;
                that.imageUrl =  response.data.last_info.information.thumb;
                that.applyModel.bannerImg =  response.data.last_info.information.banner_thumb;
                that.applyModel.storeIntroduce =  response.data.last_info.information.store_introduce;
                that.applyModel.information_thumb = response.data.last_info.information.information_thumb;
                that.fileList1 = response.data.last_info.information.information_thumb == "" ? [] : response.data.last_info.information.information_thumb;
                let fileList1s = [];
                that.fileList1.forEach(item => {
                  fileList1s.push({
                    url:item
                  });
                });
                that.fileList1 = fileList1s;
                that.applyModel.categoryId =  response.data.last_info.information.category_id;
                that.categoryName = response.data.last_info.information.store_category_text;
                that.addressName = response.data.last_info.information.province +' '+ response.data.last_info.information.city +' '+ response.data.last_info.information.district;
                that.applyModel.provinceId = response.data.last_info.information.province_id;
                that.applyModel.cityId = response.data.last_info.information.city_id;
                that.applyModel.districtId = response.data.last_info.information.district_id;
                that.applyModel.address = response.data.last_info.information.address;
                that.aptitudeImgurl =  response.data.last_info.information.aptitude_imgs;
                that.applyModel.aptitudeImg = response.data.last_info.information.aptitude_imgs;
                that.applyModel.idCardImg = response.data.last_info.information.id_card_imgs;
                that.idCardImg_1 = response.data.last_info.information.id_card_imgs[1];
                that.idCardImg_0 = response.data.last_info.information.id_card_imgs[0];
                that.applyModel.otherImg = response.data.last_info.information.other_imgs;
                // that.applyModel.lat = response.data.last_info.information.lat;
                // that.applyModel.lng = response.data.last_info.information.lng;
                // that.applyModel.location_name = response.data.last_info.information.location_name !== null ? response.data.last_info.information.location_name : "";
                // that.addressInfo = response.data.last_info.information.location_name !== null ? response.data.last_info.information.location_name : "";
                that.fileList3 = response.data.last_info.information.other_imgs;
                let fileList3s = [];
                that.fileList3.forEach(item => {
                  fileList3s.push({
                    url:item
                  });
                });
                that.fileList3 = fileList3s;
                console.log(that.fileList3,'that.fileList3');
                that.applyModel.remark = response.data.last_info.information.remark;
                that.applyModel.shop_commission = response.data.last_info.information.shop_commission;
                that.shop_commission = response.data.last_info.information.shop_commission;
                that.applyModel.streetId = response.data.last_info.information.street_id;
                that.street = response.data.last_info.information.street;
              }            
            }

            if (response.data.hasOwnProperty('service_QRcode')) {
              that.service_QRcode = response.data.service_QRcode;
            }
            if (response.data.hasOwnProperty('service_mobile')) {
              that.service_mobile = response.data.service_mobile;
            }
            that.cservice = that.fun.isTextEmpty(
              response.data.cservice
            )
              ? ""
              : response.data.cservice;
            if (that.$route.name != "hotelApply") {
              that.signature = response.data.signature;
              that.bannerImg = response.data.top_thumb;
              that.is_business_license = response.data.is_business_license;
            }
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    // element组件的（可删）
    // beforeUpload(file) {
    //   //const isJPG = file.type === 'image/jpeg'
    //   const isPNG = (file.type === 'image/png' || file.type === 'image/jpeg')
    //   const isLt2M = file.size / 1024 / 1024 < 2
    //
    //   if (!isPNG) {
    //       this.$notify('上传头像图片只能是 JPG或PNG 格式!')
    //     // this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
    //   }
    //   if (!isLt2M) {
    //       this.$notify('上传头像图片大小不能超过 2MB!')
    //     // this.$message.error('上传头像图片大小不能超过 2MB!')
    //   }
    //   return isPNG && isLt2M
    // },
    //
    //
    // handleAptiRemove(file, fileList) {
    //   //console.log('handleStoreRemove:', file)
    //   let f = file.response.data.img
    //   if (f) {
    //     let delIndex = ''
    //     this.applyModel.aptitudeImg.forEach(function (val, index, arr) {
    //       if (val == f) {
    //         delIndex = index
    //       }
    //     })
    //
    //     this.applyModel.aptitudeImg.splice(delIndex, 1)
    //
    //   }
    //   //console.log('handleStoreRemove:', fileList)
    // },
    //
    // handleStoreSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    //   if (res.result == 1) {
    //     this.applyModel.storeImg = res.data.img
    //     console.log('111===', this.applyModel.storeImg)
    //   } else {
    //     Toast(res.msg)
    //   }
    // },
    //
    // handleAptiSuccess(res, file) {
    //   if (res.result == 1) {
    //     this.applyModel.aptitudeImg.push(res.data.img)
    //     console.log('222===', this.applyModel.aptitudeImg)
    //   } else {
    //     Toast(res.msg)
    //   }
    //   //console.log('111===', URL.createObjectURL(file.raw))
    //   //console.log('222===', res)
    //   //this.imageUrl = URL.createObjectURL(file.raw)
    // },

    // 提交数据
    setApplyData() {
      // console.log(this.applyModel)

      if (this.fun.isTextEmpty(this.applyModel.username)) {
        Toast("请填写账号");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.password)) {
        Toast("请填写密码");
        return;
      }

      if (this.msgText != 3 && this.pass_safe == 1) {
        Toast("请正确填写密码");
        return;
      }

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

      if (this.fun.isTextEmpty(this.applyModel.storeName)) {
        if (this.$route.name == "hotelApply") {
          Toast("请填写酒店名称");
          return;
        } else {
          Toast("请填写门店名称");
          return;
        }
      }

      if (this.fun.isTextEmpty(this.applyModel.categoryId)) {
        if (this.$route.name == "hotelApply") {
          Toast("请选择酒店分类");
          return;
        } else {
          Toast("请选择门店分类");
          return;
        }
      }

      if (
        this.fun.isTextEmpty(this.applyModel.provinceId) ||
        this.fun.isTextEmpty(this.applyModel.cityId) ||
        this.fun.isTextEmpty(this.applyModel.districtId)
      ) {
        Toast("请选择省市区");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.streetId)) {
        // Toast("请在后台系统-交易设置-开启街道地址");
        // return;
        // 任务编号: 59594 优化选填街道地址
        this.applyModel.streetId = 0;
      }

      if (this.fun.isTextEmpty(this.applyModel.address)) {
        Toast("请填写详细地址");
        return;
      }

      if (
        this.fun.isTextEmpty(this.applyModel.lng) ||
        this.fun.isTextEmpty(this.applyModel.lat)
      ) {
        Toast("经纬度不能为空");
        return;
      }

      if (
        this.fun.isTextEmpty(this.applyModel.beginTime) ||
        this.fun.isTextEmpty(this.applyModel.endTime)
      ) {
        Toast("营业开始时间活营业结束时间不能为空");
        return;
      }

      if (this.fun.isTextEmpty(this.applyModel.storeImg)) {
        if (this.$route.name == "hotelApply") {
          Toast("请上传酒店Logo");
          return;
        } else {
          Toast("请上传门店Logo");
          return;
        }
      }

      if (
        !this.is_hotel &&
        this.fun.isTextEmpty(this.applyModel.storeIntroduce)
      ) {
        Toast("请填写简介！");
        return;
      }

      // if (this.$route.name != "hotelApply") {
      //   if (this.fun.isTextEmpty(this.applyModel.aptitudeImg)) {
      //     Toast("请上传营业执照");
      //     return;
      //   }
      // }
      // else {
      if (this.$route.name == "hotelApply" && this.fun.isTextEmpty(this.applyModel.starRated)) {
        Toast("请选择星级");
        return;
      }
      // }

      // if(this.fun.isTextEmpty(this.applyModel.remark)){
      //     Toast("请填写备注")
      //     return
      // }
      if (this.shop_commission && this.fun.isTextEmpty(this.applyModel.shop_commission)) {
        Toast("请输入平台提成");
        return;
      }

      if (!this.agreementChoose) {
        Toast("请同意申请协议");
        return;
      }
      this.applyModel.idCardImg = [];
      this.applyModel.idCardImg.push(this.idCardImg_0);
      this.applyModel.idCardImg.push(this.idCardImg_1);

      let that = this;
      let json = { apply: this.applyModel };
      let url;
      if (this.$route.name == "hotelApply") {
        url = "plugin.hotel.frontend.hotel.hotel.apply";
      } else {
        url = "plugin.store-cashier.frontend.store.store.apply";
      }
      $http.post(url, json, "提交中").then(
        response => {
          if (response.result === 1) {
            that.$store.commit("setApplyModel", {}); //清楚store
            if (response.data.length == 0) {
              this.o2o_status = 2;
              return;
            }
            if (that.status == 1) {
              that.goods_id = response.data.goods_info.id;
              if (response.data.goods_info.has_many_options && response.data.goods_info.has_many_options.length > 0) {
                that.optionsId = response.data.goods_info.has_many_options[0].id;
              }
              that.goOrder();
            } else {
              that.getData();
            }
          } else {
            Toast(response.msg);
          }
        },
        function (response) {
          console.log(response);
        }
      );
    },
    // 获取分类和协议
    isToGoos() {
      $http
        .get("plugin.store-cashier.frontend.store.enter.enable")
        .then(res => {
          if (res.result === 1) {
            this.status = res.data.status;
          } else {
            console.log(res.msg);
          }
        });
    },
    // 去订单页面
    goOrder() {
      let submitActionTag = "-2"; // 立即购买
      let _optionsId = this.optionsId;
      let _total = 1;
      let _goodsId = this.goods_id;
      this.$router.push(
        this.fun.getUrl("goodsorder", {}, {
          tag: submitActionTag,
          goodsId: _goodsId,
          optionsId: _optionsId,
          total: _total
        })
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
        //   "经纬度：" +
        //   obj.position +
        //   "\n精度范围：" +
        //   obj.accuracy +
        //   "米\n定位结果的来源：" +
        //   obj.location_type +
        //   "\n状态信息：" +
        //   obj.info +
        //   "\n地址：" +
        //   obj.formattedAddress +
        //   "\n地址信息：" +
        //   JSON.stringify(obj.addressComponent, null, 4);
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
        // console.log( that.address, that.city);
        that.applyModel.lng = p.lng;
        that.applyModel.lat = p.lat;

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
        // alert(obj.info + '--' + obj.message)
        console.log(obj);
      }

      // var mapObj = new AMap.Map("")

      // var that=this

      // mapObj.plugin('AMap.Geolocation', function () {

      //     var geolocation = new AMap.Geolocation({
      //         enableHighAccuracy: true,//是否使用高精度定位，默认:true
      //         timeout: 10000,          //超过10秒后停止定位，默认：无穷大
      //         maximumAge: 0,           //定位结果缓存0毫秒，默认：0
      //         convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      //         showButton: true,        //显示定位按钮，默认：true
      //         buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
      //         buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      //         showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
      //         showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
      //         panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
      //         zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      //     })

      //     mapObj.addControl(geolocation)
      //     geolocation.getCurrentPosition()
      //     AMap.event.addListener(geolocation, 'complete', that.onComplete);//返回定位信息
      //     AMap.event.addListener(geolocation, 'error', that.onError);      //返回定位出错信息

      // })
    },

    showCategory() {
      this.categoryShow = true;
    },

    // 选择类别
    chooseCategory(item) {
      this.categoryName = "";
      this.applyModel.categoryId = item.id;
      // console.log(this.applyModel.categoryId);
      this.categoryShow = false;
      this.categoryName = item.name;
    },

    // 获取分类和协议
    getCategory() {
      let url;
      if (this.$route.name == "hotelApply") {
        url = "plugin.hotel.frontend.hotel.hotel.get-hotel-categorys";
      } else {
        url = "plugin.store-cashier.frontend.store.store.get-store-categorys";
      }
      $http
        .get(url, {})
        .then(response => {
          if (response.result === 1) {
            this.categoryList = response.data.store_categorys;
            this.agreement = response.agreement;
          }
        })
        .catch(error => {
          console.log(error);
        });
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

      this.applyModel.provinceId = obj.itemValue1;

      this.applyModel.cityId = obj.itemValue2;

      this.applyModel.districtId = obj.itemValue3;

      this.getStreet(obj.itemValue3);
    },

    streetConfirm(item) {
      this.street = item.areaname;
      this.applyModel.streetId = item.id;
      // console.log(this.applyModel.streetId)
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
      // returnTag = true;
    },
    hideAgreement() {
      this.agreementShow = false;
      // returnTag = false;
    },

    onComplete(data) {
      this.applyModel.lng = data.position.getLng();
      this.applyModel.lat = data.position.getLat();
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
      if (this.stopButton) {
        return false;
      }
      this.selectImgIndex = i;
    },
    /*vant图片上传*/
    onRead(e, flag) {
      console.log(e.file);
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      this.stopButton = true;
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
            case 1:
              //门店logo
              if (flag === true) {
                That.imageUrl = URL.createObjectURL(e);
              } else {
                That.imageUrl = URL.createObjectURL(e.file);
              }
              That.applyModel.storeImg = responseData.data.img_url;
              That.stopButton = false;
              break;
            case 2:
              //门店banner
              That.applyModel.bannerImg = responseData.data.img_url;
              That.stopButton = false;
              break;
            case 4:
              //营业执照
              // That.fileList2 = [];
              // if (flag) {
              //   That.fileList2[0] = URL.createObjectURL(e);
              // } else {
              //   That.fileList2[0] = URL.createObjectURL(e.file);
              // }
              // console.log("aaaaaa", That.fileList2);
              That.aptitudeImgurl = responseData.data.img_url;
              That.fileList2 = [responseData.data.img_url];
              That.applyModel.aptitudeImg[0] = responseData.data.img_url;
              That.stopButton = false;
              break;
            case 5:
              //身份证正面
              That.idCardImg_0 = responseData.data.img_url;
              That.stopButton = false;
              break;
            case 6:
              //身份证反面
              That.idCardImg_1 = responseData.data.img_url;
              That.stopButton = false;
              break;
            default:
              That.stopButton = false;
              return;
            }
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
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
      this.stopButton = true;
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

            switch (That.selectImgIndex) {
            case 3:
              //门店介绍
              if (flag === true) {
                That.fileList1.push({
                  url: URL.createObjectURL(e)
                });
              } else {
                That.fileList1.push({
                  url: URL.createObjectURL(e.file)
                });
              }
              That.applyModel.information_thumb.push(
                responseData.data.img_url
              );
              That.stopButton = false;
              break;
            case 7:
              //其他图片
              if (flag === true) {
                That.fileList3.push({
                  url: URL.createObjectURL(e)
                });
              } else {
                That.fileList3.push({
                  url: URL.createObjectURL(e.file)
                });
              }
              That.applyModel.otherImg.push(responseData.data.img_url);
              That.stopButton = false;
              break;
            default:
              That.stopButton = false;
              return;
            }
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    removeImg: function (delIndex) {
      this.aptitudeImgurl = "";
      this.applyModel.aptitudeImg.splice(delIndex, 1);
      this.fileList2.splice(delIndex, 1);
    },
    removeImg_1: function (delIndex) {
      this.applyModel.information_thumb.splice(delIndex, 1);
      this.fileList1.splice(delIndex, 1);
    },
    removeImg_2: function (delIndex) {
      this.applyModel.otherImg.splice(delIndex, 1);
      this.fileList3.splice(delIndex, 1);
    },

    chooseStarLevel(item) {
      this.levelName = "";
      this.applyModel.starRated = item.value;
      this.levelShow = false;
      this.levelName = item.name;
    },
    toGeolocation() {
      this.$store.commit("setApplyModel", JSON.stringify(this.applyModel));
      if (this.$route.name == "hotelApply") {
        this.$router.push(
          this.fun.getUrl("o2oLocation_loc", {}, { tag: "hotelApply" })
        );
      } else {
        this.$router.push(
          this.fun.getUrl("o2oLocation_loc", {}, { tag: "storeApply" })
        );
      }
    },
    sureStartTime(e) {
      this.beginTime = e;
      this.startTimeTag = false;
    },
    sureEndtTime(e) {
      this.endTime = e;
      this.endTimeTag = false;
    }
  },
  components: { cTitle },
  beforeRouteLeave: function (to, from, next) {
    if (!self.agreementShow) {
      next();
    } else {
      self.agreementShow = false;
      next(false);
    }
  }
};
