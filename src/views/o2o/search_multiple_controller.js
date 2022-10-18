import cStoreList from "components/storeList";
import cGoodsList from "components/goodsList";
import hotelList from "components/hotel/list";
import loading from "components/loading";
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      title: "搜索",
      inputs: "",
      listData: [],

      city: "",
      point: {},

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      networkLoading: false,

      screenMenu: [{ name: "商品", api: "plugin.overseas.frontend.goods.search-goods" }],
      screenType: ["good"],
      screenIndex: 0,
      screenShow: false,
      openTemplate: 0 //门店列表样式
    };
  },
  activated() {
    if (this.$route.params.fromHome === 1) {
      this.ready();
    }
  },
  created() {
    if (this.$route.params.fromHome !== 1) {
      this.ready();
    }
  },
  mounted() {},
  methods: {
    async ready() {
      this.initData();
      await this.getScreenList();
      if (this.$route.params.city && this.$route.params.city !== "1") {
        this.city = this.$route.params.city;
        this.point = JSON.parse(this.$route.params.point);
        this.getListData();
      } else {
        this.fun
          .getLocation()
          .then(res => {
            this.city = res.city;
            this.point = res.point;
            this.getListData();
          })
          .catch(err => {
            this.getListData();
            console.log(err);
          });
      }
    },
    initData() {
      this.screenMenu = [{ name: "商品", api: "plugin.overseas.frontend.goods.search-goods" }];
      this.screenType = ["good"];
      this.screenIndex = 0;
      this.screenShow = false;
    },
    initPage() {
      this.listData = [];
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.networkLoading = false;
    },
    setScreenShow() {
      this.screenShow = !this.screenShow;
    },
    setScreenIndex(index) {
      this.screenShow = false;
      if (this.screenIndex == index) return;
      this.screenIndex = index;
      this.getListData();
    },

    goback() {
      this.$router.go(-1);
    },
    getListData() {
      this.initPage();
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      let json = {
        page: this.page,
        lng: p.lng,
        lat: p.lat,
        city_name: this.city
      };

      if (this.screenIndex == 0) {
        json["search[keyword]"] = this.inputs;
      }else if (this.screenMenu[this.screenIndex].name == '门店商品') {
        json["goods_title"] = this.inputs;
      } else {
        json.kwd = this.inputs;
      }

      $http.get(this.screenMenu[this.screenIndex].api, json).then(res => {
        this.networkLoading = true;
        if (res.result === 1) {
          this.isLoadMore = true;
          this.total_page = res.data.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }

          this.listData = res.data.data;
          if (res.data.hasOwnProperty("store_list_style")) {
            this.openTemplate = res.data.store_list_style || 0;
          }
          console.log(this.listData);
        }
      });
    },
    //获取更多数据
    getMoreData() {
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      let json = {
        lng: p.lng,
        lat: p.lat,
        city_name: this.city
      };
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        if (this.screenIndex == 0) {
          json["search[keyword]"] = this.inputs;
        }else if (this.screenMenu[this.screenIndex].name == '门店商品') {
          json["goods_title"] = this.inputs;
        } else {
          json.kwd = this.inputs;
        }

        this.page = this.page + 1;
        json.page = this.page;
        $http.get(this.screenMenu[this.screenIndex].api, json, "加载中").then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              let myData = response.data.data;
              this.listData = this.listData.concat(myData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          response => {
            // error callback
          }
        );
      }
    },

    gotoGoods(id) {
      console.log(id);
      this.$router.push(this.fun.getUrl("goods", { id }));
    },

    gotoSupplier(id) {
      this.$router.push(this.fun.getUrl("SupplierShop", { id, fromHome: 1 }));
    },

    getScreenList() {
      return new Promise((resolve, reject) => {
        $http.get("plugins.get-enabled-plugins", {}, "加载中").then(
          res => {
            if (res.result != 1) this.$toast(res.msg);
            let screenMenu = this.screenMenu;
            let screenType = this.screenType;

            if (res.data.is_supplier == 1) {
              screenMenu.push({ name: "供应商", api: "plugin.supplier.frontend.supplier.get-supplier-list" });
              screenType.push("supplier");
            }

            if (res.data.is_store == 1) {
              screenMenu.push({ name: "门店", api: "plugin.store-cashier.frontend.store.store.get-store-list-to-page" });
              screenType.push("store");
              screenMenu.push({ name: "门店商品", api: "plugin.store-cashier.frontend.store.store.get-store-list-to-page" });
              screenType.push("store");
            }

            if (res.data.is_hotel == 1) {
              screenMenu.push({ name: "酒店", api: "plugin.hotel.frontend.hotel.goods.get-hotel-goods-by-title" });
              screenType.push("hotel");
            }

            this.screenMenu = screenMenu;
            this.screenType = screenType;

            let index = this.screenType.indexOf(this.$route.query.search_type);
            if (this.screenMenu[index]) {
              this.screenIndex = index;
            }

            resolve();
          });
      });
    },

    getLocation() {
      let that = this;
      let mapObj = new AMap.Map("iCenter");
      mapObj.plugin("AMap.Geolocation", function() {
        let geolocation = new AMap.Geolocation({
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
        //alert(res);
        //alert(JSON.stringify(obj.addressComponent, null, 4));
        let position = obj.position.toString().split(",");
        that.point = {
          lat: position[1],
          lng: position[0]
        };
        that.address = obj.formattedAddress;
        that.title = obj.formattedAddress;
        that.city = !that.fun.isTextEmpty(obj.addressComponent.city) ? obj.addressComponent.city : obj.addressComponent.province;

        let pos = {
          address: obj.formattedAddress,
          city: that.city,
          title: obj.formattedAddress,
          point: that.point
        };
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
        that.getListData();
      }

      function onError(obj) {
        console.log(obj);
        that.getListData();
      }
    }
  },

  components: { cStoreList, loading, yzBlank, cGoodsList, hotelList }
};
