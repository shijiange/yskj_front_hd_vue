import { Toast } from "vant";
import cTitle from "components/title";
import yzAddressList from "components/ui_components/yz_addressList/index";
import yzSpecs from "components/ui_components/yz_specs";
import yz_uploader from "components/ui_components/yz_uploader";
import audioUpload from "./component/audio-upload";
import audioSlider from "./component/audio-slider";
//import BMap from 'BMap';
import AMap from "AMap";
// import {Loading, Toast} from 'element-ui';
var mapListText = [];
//  var geolocation, markers, marker
// var map, placeSearch, self, placeSearchOptions, listCount, marker;
//  var poisArrr
var num = [];
// var poisArrCopy = [];
// var numIndex = 0;

export default {
  data() {
    return {
      /****/
      address_detail: null, // 详细地址
      listCount: "",
      listText: mapListText,
      center: { lng: 0, lat: 0 },
      num: num,
      address: "",
      city: "",
      point: "",
      /****/
      classificationshow: false,
      Locationshow: false,
      commodityTitle: "",
      addgoodslistshow: false,
      goodsdata: "",
      storeshow: false,
      storedata: "",
      protocolshow: false,
      photosize: 1024 * 1024 * 5, // 图片大小限制
      uploadUrl: "",
      catelist: [],
      catname: "",
      goodslistData: [],
      selectgoodsData: {},
      storelistData: [],
      selectstoreData: {},
      imgData: [],
      releasetitle: "",
      releasecontents: "",
      catid: "",
      releaseaddress: "",
      releasecity: "",
      releaselat: "",
      releaselnt: "",
      goodsId: "",
      storeId: "",
      checked: true,
      agreementcontent: "",

      goods_open: 0,
      store_open: 0,
      wish_open: 0, //1开启
      checkedWish: false, //开启心愿

      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0, //总页数
      allLoaded: true,
      //more
      pageStore: 1, //分页数，当前页数
      isLoadMoreStore: true, //判断是否要加载更多的标志
      total_pageStore: 0, //总页数Store
      allLoadedStore: true,
      isLoading: false,

      showAddress: false, //快递地址
      goodAddress: {},
      popupSpecs: false, //商品规格弹窗
      optionId: 0,
      audio_open: 0, //是否开启音频上传
      audioPath: [], //上传的音频路径
      audioList: [] //上传的音频链接
    };
  },
  created() {
    this.initData();
    // let myLocation = this.$store.state.o2oLocation;
    // if (myLocation.point) {
    //   this.address = myLocation.title;
    //   this.city = myLocation.city;
    //   this.point = myLocation.point;

    //   this.catname = "";
    //   this.releaseaddress = myLocation.title;
    //   this.releasecity = myLocation.city;
    //   this.releaselat = myLocation.point.lat;
    //   this.releaselnt = myLocation.point.lng;
    //   //初始化数据
    // } else {
    //   this.getLocation();
    // }
    /*this.fun
      .getLocation()
      .then(res => {
        this.city = res.city;
        this.address = res.title;
        this.point = res.point;

        this.catname = "";
        this.releaseaddress = res.title;
        this.releasecity = res.city;
        this.releaselat = res.point.lat;
        this.releaselnt = res.point.lng;
      })
      .catch(err => {
        console.log(err);
      });*/

    this.getAgreement();
    // this.fun.wxShare();
  },
  activated() {
    if (this.fun.getTyep() != 5) {
      this.share();
    }
    zhuge.track('进入发布详情页');
  },

  computed: {
    catidshow: function() {
      return this.catid ? true : false;
    },
    releaseaddressshow() {
      return this.releaseaddress ? true : false;
    },
    goodsIdshow() {
      return this.goodsId ? true : false;
    },
    storeIdshow() {
      return this.storeId ? true : false;
    }
  },
  mounted() {
    this.ready();
    window.addEventListener("popstate", this.backChange, false);
  },
  beforeDestroy() {
    window.removeEventListener("popstate", this.backChange, false);
  },
  methods: {
    goodsScroll() {
      let el = document.getElementById("scrollGoods");
      if (this.addgoodslistshow) {
        if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
          if (this.isLoadMore) {
            this.getMore();
          }
        }
      }
    },
    storeScroll() {
      let el = document.getElementById("scrollstore");
      if (this.storeshow) {
        if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
          if (this.isLoadMoreStore) {
            this.getMoreStore();
          }
        }
      }
    },
    backChange(e) {
      if (this.classificationshow || this.Locationshow || this.addgoodslistshow || this.storeshow || this.protocolshow) {
        this.classificationshow = false;
        this.Locationshow = false;
        this.addgoodslistshow = false;
        this.storeshow = false;
        this.protocolshow = false;
      } else {
        // this.$router.push(this.fun.getUrl("MicroHome"));
      }
    },
    initData() {
      this.uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
      this.catid = null;
      this.releasecontents = null;
      this.releaseaddress = null;
      this.imgData = [];
      this.releasetitle = null;
      this.goodsId = null;
      this.storeId = null;
      this.releasecity = null;
      this.releaselat = null;
      this.releaselnt = null;
      this.catname = "";
      this.classificationshow = false;
      this.Locationshow = false;
      this.addgoodslistshow = false;
      this.storeshow = false;
      this.protocolshow = false;
    },
    ready: function() {
      var th = this;
      var that = this;
      //输入提示
      var auto = new AMap.Autocomplete({
        input: "suggestId",
        city: that.city
      });
      AMap.event.addListener(auto, "select", select); //注册监听，当选中某条记录时会触发
      function select(e) {
        console.log("e:", e);
        AMap.plugin("AMap.Geocoder", function() {
          var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
            city: that.city
          });

          //var lnglat = [116.396574, 39.992706]
          geocoder.getAddress(e.poi.location, function(status, result) {
            console.log(result);
            if (status === "complete" && result.info === "OK") {
              // result为对应的地理位置详细信息
              var point = {
                lat: e.poi.location.lat,
                lng: e.poi.location.lng
              };
              var pos = {};
              //console.log("write9999999", result);
              if (result.regeocode.addressComponent.city == "") {
                pos = {
                  address: e.poi.address,
                  // city:result.regeocode.addressComponent.district,
                  city: result.regeocode.addressComponent.province,
                  title: e.poi.name,
                  point: point
                };
                if (Array.isArray(e.poi.address)) {
                  that.releaseaddress = result.regeocode.formattedAddress;
                } else {
                  that.releaseaddress = e.poi.address;
                }
                that.releasecity = result.regeocode.addressComponent.province;
                that.releaselat = e.poi.location.lat;
                that.releaselnt = e.poi.location.lng;
                that.Locationshow = false;
              } else {
                pos = {
                  address: e.poi.address,
                  city: result.regeocode.addressComponent.city,
                  title: e.poi.name,
                  point: point
                };
                if (Array.isArray(e.poi.address)) {
                  that.releaseaddress = result.regeocode.formattedAddress;
                } else {
                  that.releaseaddress = e.poi.address;
                }
                that.releasecity = result.regeocode.addressComponent.city;
                that.releaselat = e.poi.location.lat;
                that.releaselnt = e.poi.location.lng;
                that.Locationshow = false;
              }
              th.$store.commit("updateLocation", pos);
              th.$store.commit("setLocation", pos);
            } else {
              Toast("请输入更详细的地址");
            }
          });
        });
      }
    },
    getLocation() {
      var that = this;
      that.address_detail = "";
      that.Locationshow = false;
      var mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function() {
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
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        var position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;

        var pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        that.releaseaddress = pos.title;
        that.releasecity = pos.city;
        that.releaselat = pos.point.lat;
        that.releaselnt = pos.point.lng;
        //console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
      }

      function onError(obj) {
        Toast('定位失败，请手动定位');
        that.Locationshow = true;
        //console.log(obj);
      }
    },
    onClickLeft() {
      this.classificationshow = false;
    },
    onClickRight() {
      this.classificationshow = false;
    },
    getClassification() {
      this.classificationshow = true;
      this.getClassificationData();
      window.history.pushState(null, null, document.URL);
    },
    onAddressLeft() {
      this.Locationshow = false;
    },
    onAddressRight() {
      this.Locationshow = false;
    },
    getReleaseAddress() {
      this.address_detail = "";
      this.Locationshow = true;
      window.history.pushState(null, null, document.URL);
      this.getLocation();
    },
    onAddGoodsLeft() {
      this.addgoodslistshow = false;
      document.getElementById("scrollGoods").removeEventListener("scroll", this.goodsScroll);
    },
    onAddGoodsRight() {
      this.addgoodslistshow = false;
      document.getElementById("scrollGoods").removeEventListener("scroll", this.goodsScroll);
    },
    getGoodsMessage() {
      this.getGoodsMessageData();
      this.addgoodslistshow = true;
      this.page = 1;
      this.goodslistData = [];
      this.isLoadMore = false;
      setTimeout(() => {
        document.getElementById("scrollGoods").addEventListener("scroll", this.goodsScroll);
      }, 1000);
      window.history.pushState(null, null, document.URL);
    },
    onStoreLeft() {
      this.storeshow = false;
      document.getElementById("scrollGoods").removeEventListener("scroll", this.storeScroll);
    },
    onStoreRight() {
      this.storeshow = false;
      document.getElementById("scrollGoods").removeEventListener("scroll", this.storeScroll);
    },
    getStoreMessage() {
      this.getStoreMessageData();
      this.storeshow = true;
      this.pageStore = 1;
      this.storelistData = [];
      this.isLoadMoreStore = false;
      setTimeout(() => {
        document.getElementById("scrollstore").addEventListener("scroll", this.storeScroll);
      }, 1000);
      window.history.pushState(null, null, document.URL);
    },
    openProtocol() {
      this.protocolshow = true;
      window.history.pushState(null, null, document.URL);
    },
    protocolLeft() {
      this.protocolshow = false;
    },

    getClassificationData() {
      let that = this;
      let json = {};
      if (this.commodityTitle) {
        json.cName = this.commodityTitle;
      }
      $http.get("plugin.micro-communities.api.index.getCate", json).then(
        function(response) {
          if (response.result == 1) {
            that.catelist = response.data.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    selectCateId(id, name) {
      this.catid = id;
      this.catname = name;
      this.classificationshow = false;
    },
    selectCateTwoId(id, name, names) {
      this.catid = id;
      this.catname = name + "/" + names;
      this.classificationshow = false;
    },
    searchBtn() {
      this.getClassificationData();
    },
    getGoodsMessageData() {
      let that = this;
      let json = {};
      json.goods_name = this.goodsdata;
      $http.get("plugin.micro-communities.api.trick.getWishGoods", json).then(
        function(response) {
          if (response.result == 1) {
            that.isLoadMore = true;
            that.allLoaded = false;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.goodslistData = response.data.data;
            that.isLoading = false;
          } else {
            that.isLoading = false;
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    searchGoodBtn() {
      this.getGoodsMessageData();
    },
    setGoodsId(id) {
      this.goodsId = id;
      let selectgoodsData = {};
      for (let i = 0; i < this.goodslistData.length; i++) {
        if (this.goodsId == this.goodslistData[i].id) {
          selectgoodsData.id = this.goodslistData[i].id;
          selectgoodsData.title = this.goodslistData[i].title;
          selectgoodsData.thumb = this.goodslistData[i].thumb;
          selectgoodsData.price = this.goodslistData[i].price;
          selectgoodsData.market_price = this.goodslistData[i].market_price;
          selectgoodsData.show_sales = this.goodslistData[i].show_sales;
          selectgoodsData.has_option = this.goodslistData[i].has_option;
          selectgoodsData.has_many_options = this.goodslistData[i].has_many_options;
          selectgoodsData.has_many_params = this.goodslistData[i].has_many_params;
          selectgoodsData.has_many_specs = this.goodslistData[i].has_many_specs;
          selectgoodsData.plugin_id = this.goodslistData[i].plugin_id; //plugin_id:32为门店商品
          selectgoodsData.store_id = this.goodslistData[i].store_id;
          break;
        }
      }
      this.selectgoodsData = selectgoodsData;
      this.addgoodslistshow = false;
    },
    getStoreMessageData() {
      let that = this;
      let json = {};
      json.store_name = this.storedata;
      $http.get("plugin.micro-communities.api.trick.getStore", json).then(
        function(response) {
          if (response.result == 1) {
            that.isLoadMoreStore = true;
            that.allLoadedStore = false;
            that.total_pageStore = response.data.last_page;
            if (!that.total_pageStore) {
              that.total_pageStore = 0;
            }
            that.storelistData = response.data.data;
            that.isLoading = false;
          } else {
            that.isLoading = false;
            Toast(response.msg);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    searchStoreBtn() {
      this.getStoreMessageData();
    },
    setStoreId(id) {
      this.storeId = id;
      let selectstoreData = {};
      for (let i = 0; i < this.storelistData.length; i++) {
        if (this.storeId == this.storelistData[i].id) {
          selectstoreData.id = this.storelistData[i].id;
          selectstoreData.thumb = this.storelistData[i].thumb;
          selectstoreData.store_name = this.storelistData[i].store_name;
          selectstoreData.address = this.storelistData[i].address;
          break;
        }
      }
      this.selectstoreData = selectstoreData;
      this.storeshow = false;
    },
    getAgreement() {
      // validate_page 实名认证判断
      $http.get("plugin.micro-communities.api.trick.getAgreement", { validate_page: 1 }).then(
        response => {
          if (response.result == 1) {
            this.agreementcontent = response.data.res.value;
            this.goods_open = response.data.goods_open;
            this.store_open = response.data.store_open;
            this.wish_open = Number(response.data.wish_open);
            this.audio_open = Number(response.data.audio_open);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    submitBtn() {
      // if (this.imgData.length == 0) {
      //   Toast("请上传图片");
      //   return;
      // }
      if (!this.releasetitle) {
        Toast("请填写标题");
        return;
      }
      if (!this.releasecontents) {
        Toast("请添加正文");
        return;
      }
      if (!this.catid) {
        Toast("请选择分类");
        return;
      }
      // if (!this.releaseaddress) {
      //   Toast("请选择地点");
      //   return;
      // }
      if (this.goods_open == 0 && this.wish_open && this.checkedWish && this.selectgoodsData.has_option == 1 && this.optionId == 0) {
        Toast("请商品规格");
        return;
      }
      if (this.wish_open && this.checkedWish && this.goodAddress.username == "") {
        Toast("请选择收货地址");
        return;
      }
      // if (!this.goodsId) {
      //   Toast("请添加商品");
      //   return;
      // }
      // if (!this.storeId) {
      //   Toast("请添加门店");
      //   return;
      // }
      if (!this.checked) {
        Toast("请勾选用户协议");
        return;
      }
      if (this.wish_open && this.checkedWish) {
        //开启心愿商品
        //若心愿商品为门店商品，则需要传该商品所属的门店id,走门店创建订单接口
        let assembleGoods = [
          {
            goods_id: this.selectgoodsData.id,
            total: 1,
            option_id: this.optionId
          }
        ];
        let json = {
          //公共数据
          address: JSON.stringify(this.goodAddress),
          goods: JSON.stringify(assembleGoods),
          member_coupon_ids: JSON.stringify([]),
          orders: JSON.stringify([]),
          // 发票
          invoice_type: 0,
          rise_type: 1,
          call: "",
          email: "",
          company_number: "",
          dispatch_type_id: 1 //固定配送方式 ，1：快递
        };
        let _url = "order.create";
       
        if (this.selectgoodsData.plugin_id == 32) {
          if (this.selectgoodsData.store_id == 0) {
            Toast("数据获取失败，请刷新后重新选择商品！");
            return;
          }
          json.store_id = this.selectgoodsData.store_id;
          json.cart_ids = [];
          _url = "plugin.store-cashier.frontend.store.create";
        }

        $http.post(_url, json, "").then(response => {
          if (response.result == 1) {
            this.publishFun(response.data.order_ids);
          } else {
            Toast(response.msg);
          }
        });
        zhuge.track('发布详情页点击发布按钮',{
          '帖子标题':this.releasetitle,
          '帖子内容':this.releasecontents,
          '帖子id':'',
          '帖子分类':this.catname
        });
      } else {
        //console.log(333333);
        zhuge.track('发布详情页点击发布按钮',{
          '帖子标题':this.releasetitle,
          '帖子内容':this.releasecontents,
          '帖子id':'',
          '帖子分类':this.catname
        });
        this.publishFun();
      }
    },
    publishFun(order_ids) {
      let dataJson = {};
      let p = this.fun.bd_encrypt(this.releaselnt, this.releaselat);
      dataJson.cat_id = this.catid;
      dataJson.contents = this.releasecontents;
      dataJson.address = this.releaseaddress;
      dataJson.images = this.imgData;
      dataJson.title = this.releasetitle;
      dataJson.goods_id = this.goodsId;
      dataJson.store_id = this.storeId;
      dataJson.city = this.releasecity;
      dataJson.lat = p.lat;
      dataJson.lng = p.lng;
      dataJson.ylat = this.releaselat;
      dataJson.ylng = this.releaselnt;
      dataJson.audio = this.audioPath;

      if (order_ids) {
        dataJson.order_id = order_ids;
        dataJson.order_address = JSON.stringify(this.goodAddress);
        dataJson.wish_goods_id = this.goodsId;
      }
      $http.post("plugin.micro-communities.api.trick.publish", dataJson, "").then(response => {
        if (response.result == 1) {
          //console.log('发布成功');
          zhuge.track('社区帖子发布成功',{
            '帖子标题':this.releasetitle,
            '帖子内容':this.releasecontents,
            '帖子id':'',
            '帖子分类':this.catname
          });
          Toast(response.msg);
          this.$router.push(this.fun.getUrl("MicroHome"));
        } else {
          Toast(response.msg);
        }
      });
    },
    //下拉刷新
    loadTop() {
      this.page = 1;
      this.goodslistData = [];
      this.isLoadMore = true;
      this.total_page = 0;
      this.getGoodsMessageData();
      // this.$refs.loadmore.onTopLoaded();
    },
    //获取更多数据，加载更多
    loadBottom() {
      this.getMore();
      this.$refs.loadmore.onBottomLoaded();
    },
    getMore() {
      this.isLoadMore = false; // 防止多次请求分页数据
      this.allLoaded = true;
      const that = this;
      if (that.page >= that.total_page) {
        that.allLoaded = true; // 若数据已全部获取完毕
        return;
      } else {
        that.page += 1;
        $http
          .get("plugin.micro-communities.api.trick.getWishGoods", { page: that.page, goods_name: that.goodsdata }, "加载中...")
          .then(res => {
            that.isLoadMore = true;
            that.allLoaded = false;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.goodslistData = that.goodslistData.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    //下拉刷新
    loadTopStore() {
      this.storelistData = [];
      this.isLoadMoreStore = true;
      this.total_pageStore = 0;
      this.pageStore = 1;
      this.getStoreMessageData();
      // this.$refs.loadmoreStore.onTopLoaded();
    },
    //获取更多数据，加载更多
    loadBottomStore() {
      this.getMoreStore();
      this.$refs.loadmoreStore.onBottomLoaded();
    },
    getMoreStore() {
      this.isLoadMoreStore = false; // 防止多次请求分页数据
      this.allLoadedStore = true;
      const that = this;
      if (that.pageStore >= that.total_pageStore) {
        that.allLoadedStore = true; // 若数据已全部获取完毕
        return;
      } else {
        that.pageStore += 1;
        $http
          .get("plugin.micro-communities.api.trick.getStore", { page: that.pageStore, store_name: that.storedata }, "加载中...")
          .then(res => {
            that.isLoadMoreStore = true;
            that.allLoadedStore = false;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.storelistData = that.storelistData.concat(nextPageData); //进行数组拼接
            } else {
              that.pageStore = that.pageStore - 1;
              that.isLoadMoreStore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    removeImg: function(delIndex) {
      this.imgData.splice(delIndex, 1);
    },
    confirmSelectAddress(item) {
      this.goodAddress = item;
      this.showAddress = false;
    },
    close_yz_specs_popup(_optionsId, goodsCount, clicktype, id) {
      console.log("规格弹窗关闭了=====", _optionsId, goodsCount, clicktype, id);
      this.popupSpecs = false;
      if (clicktype == 1) {
        //点击确认按钮
        this.optionId = _optionsId;
      }
    },
    updataAudio(path, url, duration = 0) {
      console.log(path, url);
      this.audioPath.push({ file: path, duration: duration });
      this.audioList.push({ file: url, duration: duration });
    },
    delAudio(index) {
      this.audioPath.splice(index, 1);
      this.audioList.splice(index, 1);
    },
    share() {
      let url = this.fun.isIosOrAndroid() === "ios" ? window.initUrl : document.location.href;
      $http.post("member.member.wxJsSdkConfig", { url: url }).then(response => {
        if (response.result == 1) {
          wx.config(response.data.config);
          wx.ready(() => {
            wx.showOptionMenu();
          });
        }
      });
    }
  },
  components: { cTitle, yzAddressList, yzSpecs, yz_uploader, audioUpload, audioSlider }
};
