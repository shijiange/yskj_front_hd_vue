import { mapState, mapMutations } from "vuex";
import cStoreList from "components/storeList";
import loading from "components/loading";
import { scrollMixin } from "utils/mixin";
import optionMenu from "./child/option_menu";
import yzBlank from "components/ui_components/yz_blank";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      title: "搜索",
      inputs: "",
      amout: false,
      stores: [],
      order_by: "",
      order_field: "",
      showPage: false,
      city: "",
      point: {},

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      openTemplate: 0 //门店列表样式
    };
  },
  activated() {
    this.stores = [];
    this.page = 1;
    this.total_page = 0;
    this.isLoadMore = true;

    if (this.$route.params.city && this.$route.params.city !== "1") {
      this.city = this.$route.params.city;
      this.point = JSON.parse(this.$route.params.point);
      this.gotoSearch();
    } else {
      // let myLocation = this.$store.state.o2oLocation;
      // if (myLocation.point) {
      //   this.city = myLocation.city;
      //   this.point = myLocation.point;
      //   this.gotoSearch();
      // } else {
      //   console.log("location不存在");
      //   this.getLocation();
      // }

      this.fun
        .getLocation()
        .then(res => {
          this.city = res.city;
          this.point = res.point;
          this.gotoSearch();
        })
        .catch(err => {
          this.gotoSearch();
          console.log(err);
        });
    }
  },
  computed: mapState(["view"]),
  ...mapMutations(["views"]),
  mounted() {
    this.slider();
  },
  methods: {
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.gotoSearch();
      }
    },
    slider() {
      let that = this;
      window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        if (top < 80) {
          that.amout = false;
        } else {
          that.amout = true;
        }
      };
    },
    goback() {
      this.$router.go(-1);
    },
    gotoSearch() {
      this.showPage = false;
      this.page = 1;
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      let json = {
        page: this.page,
        kwd: this.inputs,
        lng: p.lng,
        lat: p.lat,
        city_name: this.city
      };
      $http.get("plugin.store-cashier.frontend.store.goods.get-store-goods-by-title", json).then(response => {
        this.showPage = true;
        if (response.result === 1) {
          this.isLoadMore = true;
          this.total_page = response.data.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
          this.stores = response.data.data;
          this.openTemplate = response.data.store_list_style || 0;
        } else {
          this.stores = [];
        }
      });
    },
    //获取更多数据
    getMoreData() {
      console.log("this.$refs.ref_optionMenu.isOpenMoreChild:::::", this.$refs.ref_optionMenu.isOpenMoreChild);
      if (this.$refs.ref_optionMenu.isOpenMoreChild) {
        this.$refs.ref_optionMenu.getChildrenMoreData();
        return;
      }
      let p = this.fun.bd_encrypt(this.point.lng, this.point.lat);
      let json = {
        kwd: this.inputs,
        lng: p.lng,
        lat: p.lat,
        city_name: this.city
      };
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json.page = this.page;
        $http.get("plugin.store-cashier.frontend.store.goods.get-store-goods-by-title", json, "加载中").then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              this.stores = this.stores.concat(myData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },

    getLocation() {
      var that = this;
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
        //alert(res);
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
        console.log("test pos", pos);
        that.$store.commit("updateLocation", pos);
        that.$store.commit("setLocation", pos);
        window.localStorage.setItem("myLocation", JSON.stringify(pos));
        that.gotoSearch();
      }

      function onError(obj) {
        console.log(obj);
        that.gotoSearch();
      }
    }
  },

  components: { cStoreList, loading, optionMenu, yzBlank }
};
